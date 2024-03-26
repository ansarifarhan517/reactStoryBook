import React, { useEffect, Dispatch } from "react";
import { useDispatch } from "react-redux";
import { IconButton } from "ui-library";
import { AnimatePresence, motion } from "framer-motion";

import { StyledWrapper } from "./StyledComponent/StyledWrapper";

import { useTypedSelector } from "../../../utils/redux/rootReducer";
import { IOnboardingTourActions } from "./Store/Tour.model";
import { tGlobalPopupAction } from "../../common/GlobalPopup/GlobalPopup.reducer";
import withReact from "../../../utils/components/withReact";

import TourLayout from "./Layouts/TourLayout";
import TourAccordion from "./TourAccordion";
import TourAccordionDetail from "./TourAccordionDetail";
import TourProgressBar from "./Components/TourProgressBar";
import  Confetti from "./Components/Confetti";

// config for the page loader animation framer motion
const animationConfig = {
  type: "spring",
  damping: 20,
  stiffness: 100,
};

export function getStep(stepId, structure){
  let parentId = Number(String(stepId).split('.')[0])
  let subStepId = String(stepId).split('.')[1] ? stepId : 0;
  let structureStep = structure?.steps.reduce(
    (a, v) => ({ ...a, [`${v.stepId}`]: v }),
    {}
  );
  if(!subStepId && (!structureStep[parentId].subSteps || structureStep[parentId].subSteps.length === 0)){
    return structureStep[parentId]
  }
  if(structureStep[parentId].subSteps.length > 0){
    
    if(subStepId){
      return structureStep[parentId].subSteps.filter(step => step.stepId ===  subStepId )[0]
    }else{
      return structureStep[parentId].subSteps[0]
    }
  }
}

function Tour(props) {

  //console.log(props.redirectSupportLink(''))

  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<IOnboardingTourActions>>();
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>();

  /** Type Selectors */
  const structure = useTypedSelector((state) => state.saas.tour.structure);
  const percentage = useTypedSelector((state) => state.saas.tour.percentage);
  const structureError = useTypedSelector(
    (state) => state.saas.tour.structureError
  );
  const currentStep = useTypedSelector((state) => state.saas.tour.currentStep);
  const totalWeightage = useTypedSelector((state) => state.saas.tour.totalWeightage);
  const isLastStep = useTypedSelector((state) => state.saas.tour.isLastStep);
  const loading = useTypedSelector((state) => state.saas.tour.loading);

  // Sub tasks
  // TODO: only if strcture is not present, fetch the structure of product tour and on unmount remove it
  // TODO: Render into UI
  // TODO: Create accordion from structure
  // TODO: Create side panel
  // TODO: Action on click of the step, call the api to update the structure
  // TODO: Percentage Loader UI

  const getStructure = () => {
    if (!structureError && !Object.keys(structure).length) {
      dispatch({ type: "@@onboardingTour/SET_LOADING", payload: true });
      dispatch({ type: "@@onboardingTour/FETCH_STRUCTURE" });
    }
  };

  // useEffect
  useEffect(() => {
    getStructure();
    // check for the error in strcture then show global popup
    if (structureError) {
      globalPopupDispatch({
        type: "@@globalPopup/SET_PROPS",
        payload: {
          isOpen: true,
          title: "Error",
          onClose: () => {
            globalPopupDispatch({ type: "@@globalPopup/CLOSE_POPUP" });
            // location.reload();
          },
          content: (
            <>
              <div>{`Seems like we have encountered an error!`}</div>
              <br />
              <div>
                {`Please contact your LogiNext Account Manager or write to `}
                <a href="contact@loginextsolutions.com">
                  contact@loginextsolutions.com
                </a>
                {`.`}
              </div>
            </>
          ),
          footer: (
            <>
              <IconButton
                iconVariant="icomoon-tick-circled"
                primary
                onClick={() => {
                  globalPopupDispatch({ type: "@@globalPopup/CLOSE_POPUP" });
                  location.reload();
                }}
              >
                Reload
              </IconButton>
            </>
          ),
        },
      });
    }
  }, [structure, structureError]);

  if (loading) {
    return <p>Loading</p>;
  }

  return (
    <div>
      {structure &&
        structure?.steps &&
        Object.keys(structure?.steps).length === 0 && (
          <p> ---- No data found | Try again ----</p>
        )}
      {/* Get Data according to the current index and embed next and previous button */}
      {
        isLastStep && isLastStep.isValid && <Confetti />
      }
      {!loading && (
        <AnimatePresence exitBeforeEnter initial={false}>
          <div className="wrapper">
            {structure && structure?.steps && structure?.steps.length !== 0 && (
              <TourLayout
                title="Your Quick Product Tour"
                component={<TourAccordion data={structure?.steps} />}
                percentageProgress={<TourProgressBar weightage={percentage} totalWeightage={totalWeightage}/>}
              >
                {/* Render Structure as per the stepTpye and call the component */}
                <StyledWrapper>
                  <div
                    className={`main__content ${structure?.steps[currentStep]?.stepName}`}
                  >
                    <div
                      className={`content__block ${structure?.steps[currentStep]?.stepName}`}
                    >
                      <motion.div
                        key={structure?.steps[currentStep]?.stepName}
                        transition={animationConfig}
                        initial={{ x: 10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -10, opacity: 0 }}
                      >
                        <TourAccordionDetail step={getStep(currentStep, structure)} redirectSupport={props.redirectSupportLink} />
                      </motion.div>
                    </div>
                  </div>
                </StyledWrapper>
              </TourLayout>
            )}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}

export default withReact(Tour);
