import React, { useState, Dispatch, useEffect } from "react";
import { useDispatch } from "react-redux";
import AnimatedAccordion from "./Components/AnimatedAccordion";
import { getStep } from "./Tour";
import axios from "../../../utils/axios";
import apiMappings from "../../../utils/apiMapping";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import { IOnboardingTourActions, IStep } from "./Store/Tour.model";
import firebaseRef from "../../../utils/firebase";

var TourRef;

// Check all sub steps are completed
// TODO: optimize the code
function CheckAllVisitedSubStep(steps, callBackCompletePercentage, isLastChild = false) {
  let updatedStep: IStep[] = steps.map((step: IStep) => {
    if (step?.subSteps && step?.subSteps.length > 0) {
      let visitedStep = step?.subSteps.filter(
        (item) => item.status === "VISITED"
      );
      let completedStep = step?.subSteps.filter(
        (item) => item.status === "COMPLETED"
      );
      if(isLastChild && completedStep.length == 1){
        callBackCompletePercentage({
          ...step,
          status: "COMPLETED",
        });
        return {
          ...step,
          status: "COMPLETED",
        };
      }
      else if (step.status !== "COMPLETED" && !isLastChild &&
        completedStep.length === step?.subSteps.length
      ) {
        callBackCompletePercentage({
          ...step,
          status: "COMPLETED",
        });
        return {
          ...step,
          status: "COMPLETED",
        };
      } else if (
        step.status !== "COMPLETED" &&
        // isSubStep === 0 &&
        visitedStep.length === 1
      ) {
        visitedStep[0].status = "COMPLETED";
        let updatedSubSteps = step.subSteps.map((item) => {
          if (item.stepId === visitedStep[0].stepId) {
            return {
              ...item,
              status: "COMPLETED",
            };
          } else {
            return item;
          }
        });
        return {
          ...step,
          subSteps: updatedSubSteps,
        };
      } else {
        return step;
      }
    }
    // else if (step.status !== "COMPLETED" && isLastChild ){
    //   callBackCompletePercentage({
    //     ...step,
    //     status: "COMPLETED",
    //   });
    //   return {
    //     ...step,
    //     status: "COMPLETED",
    //   };
    // } 
    else {
      return step;
    }
  });
  return updatedStep;
}

// Check and return updated steps if step is visited, completed
function CheckVisitedNode(steps, id, setPercentageCallbackFn, setSelectedStep, isLastStep) {
  let updatedStep: IStep[] = steps.map((step: IStep) => {
    if (step?.stepId === id && step?.status === "VISITED") {
      return {
        ...step,
        selected: true,
      };
    }
    if (
      step?.stepId === id &&
      (step?.status === "UNVISITED" || step?.status === "COMPLETED")
    ) {
      setSelectedStep(step?.stepId);
      let status = step?.status === "UNVISITED" ? "VISITED" : step?.status
      if(isLastStep){
        status = 'COMPLETED'
      }
      return {
        ...step,
        selected: true,
        status: status
      };
    } else if (
      step?.status === "VISITED" &&
      (step?.subSteps?.length === 0 || !step?.subSteps)
    ) {
      //set percentage only on the status completed
      const updatedStep = {
        ...step,
        selected: false,
        status: "COMPLETED",
      };
      // TODO: need to refactor code
      if (!String(id).split(".")[1]) {
        setPercentageCallbackFn(updatedStep, isLastStep);
      }
      return updatedStep;
    } else {
      return {
        ...step,
        selected: false,
      };
    }
  });
  return updatedStep;
}

function TourAccordion({ data }) {
  const [steps, setSteps] = useState<IStep[]>(data);
  
  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<IOnboardingTourActions>>();

  /** Type Selectors */
  const structure = useTypedSelector((state) => state.saas.tour.structure);
  const totalSteps = structure && structure.steps.length > 0 && structure.steps.reduce((count, el) => {
    if(el.subSteps && el.subSteps.length > 0){
      return count + el.subSteps.length
    }else{
      return count + 1
    }
  }, 0);

  const localStructure = useTypedSelector(
    (state) => state.saas.tour.localStructure
  );

  const percentage = useTypedSelector((state) => state.saas.tour.percentage) || 0;
  const isLastStep = useTypedSelector((state) => state.saas.tour.isLastStep) || 0;
  const totalWeightage = useTypedSelector(
    (state) => state.saas.tour.totalWeightage
  ) || 0;

  function checkLastStep(items, id, subStep){
    const completedWeitage = items.reduce((count, el) => {
      if(el.subSteps && el.subSteps.length > 0){
        return count + el.subSteps.filter(item => item.status === 'COMPLETED').length
      }else if(el.status === 'COMPLETED'){
        return count + 1
      }else{
        return count
      }
    }, 0);
    if((subStep === 0 && completedWeitage === totalSteps - 1) || (subStep && completedWeitage === totalSteps)){
      console.log(id, subStep)
      dispatch({
        type: "@@onboardingTour/IS_LAST_STEP",
        payload: {
          stepId: id,
          subStepId: subStep,
          isValid: true
        },
      });
      return true
    }
    return false
  }

  function updatePercentageCompletion(data, checkLastStepFlag = false) {
    // let step = steps.filter((item : IStep) => item.stepId === data.stepId)
    let step = getStep(data.stepId, structure);
    const updatedStructureSteps =
      structure?.steps &&
      structure?.steps.length > 0 &&
      structure?.steps.map((stepItem) => {
        if (stepItem.stepId === data.stepId) {
          return data;
        } else {
          return stepItem;
        }
      });
    const percentageAdded = Math.trunc((100 / totalWeightage) * (percentage + step?.weightage))
    console.log(percentageAdded);
    TourRef.set(checkLastStepFlag ? 100 : percentageAdded )
    
    let percentageUpdated = percentage + step?.weightage <= totalWeightage ? percentage + step?.weightage : totalWeightage;
    console.log('percentageUpdated', percentageUpdated)
    // Call the api to update the data
    if (!localStructure) {
      updateStepAPISelection({
        ...structure,
        steps: updatedStructureSteps,
        percentage: checkLastStepFlag ? totalWeightage : percentageUpdated,
        completedWeightage:checkLastStepFlag ?  totalWeightage : percentageUpdated,
      });
    }
    if(percentageUpdated < totalWeightage){
      dispatch({
        type: "@@onboardingTour/SET_PERCENTAGE",
        payload: step?.weightage,
      });
    }
   
  }

  function setSelectedStep(id) {
    dispatch({
      type: "@@onboardingTour/SET_STEP",
      payload: id,
    });
  }

  const updateStepAPISelection = async (data) => {
    try {
      const updatedStructure = {
        ...data,
      };
      const { data: response } = await axios["put"](
        apiMappings.saas.tour.updateStructure,
        updatedStructure
      );
      if (!response.hasError) {
        dispatch({ type: "@@onboardingTour/SET_LOADING", payload: false });
      } else {
        dispatch({ type: "@@onboardingTour/SET_LOADING", payload: false });
      }
    } catch (error) {
      dispatch({ type: "@@onboardingTour/SET_LOADING", payload: false });
    }
  };

  const handleSelection = (id: number, subStepId: number = 0, checkLastStepFlag = false, status) => {
    let updatedStep = CheckVisitedNode(
      steps,
      id,
      updatePercentageCompletion,
      setSelectedStep,
      checkLastStepFlag
    );
    let stepsObj = updatedStep.reduce(
      (a, v) => ({ ...a, [`${v.stepId}`]: v }),
      {}
    );

    if (subStepId) {
      // check the parent node visited
      let updatedSubStep = CheckVisitedNode(
        stepsObj[Number(String(subStepId).split(".")[0])].subSteps,
        subStepId,
        updatePercentageCompletion,
        setSelectedStep,
        checkLastStepFlag
      );

      // Nested level steps check visited node
      stepsObj[Number(String(subStepId).split(".")[0])].subSteps =
        updatedSubStep;
      updatedStep = Object.keys(stepsObj).map((id) => stepsObj[id]);
    }
    // check all sub node is visited
    updatedStep = CheckAllVisitedSubStep(
      updatedStep,
      updatePercentageCompletion,
      checkLastStepFlag
    );
    dispatch({
      type: "@@onboardingTour/SET_STRUCTURE",
      payload: {
        ...structure,
        totalWeightage: totalWeightage,
        steps: updatedStep,
      },
    });
    setSteps(updatedStep);
    if(status !== 'COMPLETED' && checkLastStep(updatedStep, id, Number(subStepId))){
      console.log('fire last step')
      //handleSelection(id, subStepId = 0, checkLastStepFlag = true, 'COMPLETED');
    }
  };

  useEffect(() =>{
    getSocketConnection()
  },[])

  useEffect(() => {
    if(isLastStep && isLastStep.isValid){
      console.log('Its last step')
      dispatch({
        type: "@@onboardingTour/SET_PERCENTAGE",
        payload: 10,
      });
      let updatedStructureSteps = structure && structure.steps.map((step) => 
      {
        if(step.stepId == isLastStep.stepId){
          return {
            ...step,
            status: 'COMPLETED'
          }
        }else{
          return step
        }
      })
      setSteps(updatedStructureSteps);
      updateStepAPISelection({
        ...structure,
        steps: updatedStructureSteps,
        percentage: totalWeightage ,
        completedWeightage: totalWeightage,
      });
      TourRef.set(100)
    }
  },[isLastStep])

  const getSocketConnection = () => {
    let localData = localStorage.getItem('userAccessInfo') || '';
    let userId = JSON.parse(localData)?.userId;
    TourRef = firebaseRef.database().ref(`sockets/producttour/${userId}/`)
}

  return (
    <>
      {/* <TourProgressBar percentage={0}/> */}
      <div className='accordion--wrapper'>
        {steps &&
          steps.length > 0 &&
          steps.map((accordion, index) => {
            return (
              <AnimatedAccordion
                title={accordion?.headerLabel}
                isSelected={accordion?.selected}
                stepName={accordion?.stepName}
                id={accordion?.stepId}
                data={accordion}
                status={accordion?.status}
                setSelected={handleSelection}
                key={index}
              />
            );
          })}
      </div>
    </>
  );
}

export default TourAccordion;
