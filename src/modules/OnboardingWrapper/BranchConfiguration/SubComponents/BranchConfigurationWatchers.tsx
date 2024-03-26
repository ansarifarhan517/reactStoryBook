import React, { useEffect, Dispatch,useState } from "react";
import { UseFormMethods } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { deepCopy } from "../../../../utils/helper";
import { IMongoField } from "../../../../utils/mongo/interfaces";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { BranchConfigurationActions } from "../BranchConfiguration.actions";
import { IBranchManagerStructure, IDynamicMongoField, IMangerDetails, IShifts } from "../BranchConfiguration.models";
import { convertShiftTimingStructure } from "../utils";
import useDebounce from "../../../../utils/useDebounce";
interface IBranchConfigurationWatchersProps {
    formInstance: UseFormMethods<Record<string, any>>;
    dispatchFormStructure: Function;
    setSearchText: Function;
    isBranchManagerTouched: boolean;
    isOperationTimingTouched: boolean;
    isEditMode: boolean;
    setEditModeShiftList: Function;
    dispatchShiftTimingsStructure: Function;
    rowKey: string;
    setManagerDetails: Function;
    isAddressFieldsTouched: boolean;
    isMapSearched: boolean;
}

const BranchConfigurationWatchers = (props: IBranchConfigurationWatchersProps) => {
    const dispatch = useDispatch<Dispatch<BranchConfigurationActions>>();
    const {formInstance, dispatchFormStructure , setSearchText, isOperationTimingTouched, isBranchManagerTouched, isEditMode, setEditModeShiftList, dispatchShiftTimingsStructure, setManagerDetails, rowKey, isAddressFieldsTouched, isMapSearched } = props;
    // const isEditClientBranch = useTypedSelector(state => state.branchConfiguration.isEditClientBranch);
    const structure = useTypedSelector((state) => state.branchConfiguration.form.structure);
    const clientBranchDetails = useTypedSelector((state) => state.branchConfiguration.clientBranchDetails);
    const operationTimingsFormStructure = useTypedSelector((state) => state.branchConfiguration.form.operationTimingsFormStructure.operationsTiming);
    const branchManagerList = useTypedSelector((state) => state.branchConfiguration.form.branchManagerList);
    const shiftTimingsStructure = useTypedSelector((state) => state.branchConfiguration.form.shiftTimingsStructure.columns);  

    const { watch, setValue } = formInstance;
    
    const autoAllocateFl = watch('autoAllocateFl', '');

   
    

      /* wtachers for address fields */
    const country = useDebounce(watch('country', ''), 1000);
    const state = useDebounce(watch('state', ''), 1000);
    const apartment = useDebounce(watch('apartment', ''), 1000);
    const streetName = useDebounce(watch('streetName', ''), 1000);
    const landmark = useDebounce(watch('landmark', ''), 1000);
    const locality = useDebounce(watch('locality', ''), 1000);
    const city = useDebounce(watch('city', ''), 1000);
    const zipCode = useDebounce(watch('zipCode', ''), 1000);
    /* watchers for address fields */
    // const walletEnabled = watch('walletEnabled', 'Yes');
    const vendorName = watch('vendorName', '');
    const watchClientId = watch('clientId', '');
    /* setting branch timezone in redux*/
    const branchTimeZone = watch('branchTimeZone','');
    useEffect(() => {
      if(!isEditMode) {
      if(Object.keys(branchTimeZone).length > 0) {
        const { canonicalId } = branchTimeZone
          dispatch({type: '@@branchConfiguration/SET_BRANCH_TIMEZONE', payload: canonicalId })
      }
    }
    },[branchTimeZone, isEditMode])

    useEffect(() => {
      let myPromise = new Promise(function(myResolve, myReject){
        if(structure){
         myResolve('Structure Found');
        }else{
          myReject('Structure Not Found');
        }
      })

      myPromise.then(() => {
        const newStructure = deepCopy(structure);
        if (!isEditMode) {  
        if (autoAllocateFl === 'Y') {
          setValue("deliveryMediumAutoAllocateFl", "Y");
          console.log(newStructure,'NewStructure');
        newStructure["general details"]["deliveryMediumAutoAllocateFl"].permission = true;
        dispatchFormStructure(newStructure);
      } // Else if First toggle is OFF -> Make permission for second toggle to false
      else {
        newStructure["general details"]["deliveryMediumAutoAllocateFl"].permission = false;
        setValue("deliveryMediumAutoAllocateFl", "N");
        dispatchFormStructure(newStructure);
     
      }
    }
    //Else if it is Update Form Fix_63007
    else {
      // and First toggle is OFF -> Make permission for second toggle false
      if (autoAllocateFl === "N") {
        newStructure["general details"]["deliveryMediumAutoAllocateFl"].permission = false;
        dispatchFormStructure(newStructure);
        setValue("deliveryMediumAutoAllocateFl", "N");
      } // Else ff someone turns 1st toggle ON and second toggle permission is not there -> Make permission and value for second toggle to true
      else if ( autoAllocateFl === "Y" && structure["general details"]["deliveryMediumAutoAllocateFl"].permission === false) {
        newStructure["general details"]["deliveryMediumAutoAllocateFl"].permission = true;
        dispatchFormStructure(newStructure);
        setValue("deliveryMediumAutoAllocateFl", "Y");
       }
            } });
      }, [autoAllocateFl]);
       
useEffect(() => {
  const newStructure = deepCopy(structure);
  const isTextType = newStructure?.['address']?.['addressFields']?.['childNodes']?.zipCode?.fieldType === "text" ? true : false;
  let address = `${apartment} ${streetName} ${landmark} ${locality} ${city} ${state?.name} ${country?.name} ${isTextType ? zipCode : zipCode?.name}`.replaceAll('undefined', '');
  if(!isMapSearched && !isAddressFieldsTouched) {
      // commented for temporary fix
      // setSearchText(address);
    } else if(!isMapSearched && isAddressFieldsTouched) {
      setSearchText(address);
    }
  
}, [country, state, apartment, streetName, landmark, locality, city, zipCode, isAddressFieldsTouched]);



    useEffect(() => {
        if (Object.keys(vendorName).length > 0 && structure?.['carrierDetails']?.skillSet) {
        const newStructure = deepCopy(structure);
        setTimeout(() => {
            newStructure['carrierDetails']['skillSet'].permission = true;
            dispatchFormStructure(newStructure);
        }, 100);
        }
    },[vendorName]);

  useEffect(() => {
    const newStructure = deepCopy(structure);
    if (Object.keys(newStructure).length > 0 && watchClientId !== undefined) {
      const { isSuperFl } = watchClientId;
        setTimeout(() => {
          newStructure['general details']['superClientParentBranchId'].permission = isSuperFl === 'N' ? false : true;
          newStructure['general details']['subClientParentBranchId'].permission = isSuperFl === 'N' ? true : false;
          if(newStructure['carrierDetails']?.vendorName) {
              newStructure['carrierDetails']['vendorName'].permission = isSuperFl === 'N' ? false : true;
          }
          if(newStructure['carrierDetails']?.skillSet) {
            newStructure['carrierDetails']['skillSet'].permission = isSuperFl === 'N' ? false : true;
          }
          dispatchFormStructure(newStructure);
        }, 100);
    }
  }, [watchClientId]);

  useEffect(() => {
    if (isEditMode && !isOperationTimingTouched && !isBranchManagerTouched && Object.keys(clientBranchDetails).length && operationTimingsFormStructure && Object.keys(operationTimingsFormStructure).length && structure.branchManagerDetails && Object.keys(structure.branchManagerDetails).length) {
      const operationTiming = clientBranchDetails.operationTimings.length ? clientBranchDetails.operationTimings : [operationTimingsFormStructure];
      let operationTimingStructure = operationTiming.map(
        (field: IMongoField, index: number) => {
          let newField = {
            operationsTimingId: field.operationsTimingId
              ? field.operationsTimingId
              : null,
            [index === 0 ? `operationsDaysOfWeek` : `operationsDaysOfWeek-${index}`]: { ...operationTimingsFormStructure['daysOfWeek'], id: index === 0 ? `operationsDaysOfWeek` : `operationsDaysOfWeek-${index}`, fieldName: index === 0 ? `operationsDaysOfWeek` : `operationsDaysOfWeek-${index}`, labelKey: index === 0 ? `operationsDayOfWeek` : `operationsDayOfWeek-${index}`, permission: true },
            [index === 0 ? `operationsStartTime` : `operationsStartTime-${index}`]: { ...operationTimingsFormStructure['operationsStartTime'], id: index === 0 ? `operationsStartTime` : `operationsStartTime-${index}`, fieldName: index === 0 ? `operationsStartTime` : `operationsStartTime-${index}`, labelKey: index === 0 ? `operationsStartTime` : `operationsStartTime-${index}`, permission: true },
            [index === 0 ? `operationsEndTime` : `operationsEndTime-${index}`]: { ...operationTimingsFormStructure['operationsEndTime'], id: index === 0 ? `operationsEndTime` : `operationsEndTime-${index}`, fieldName: index === 0 ? `operationsEndTime` : `operationsEndTime-${index}`, labelKey: index === 0 ? `operationsEndTime` : `operationsEndTime-${index}`, permission: true },
            isSaved: true
          };

          return newField;
        }
      );

      dispatch({ type: '@@branchConfiguration/SET_OPERATION_TIMINGS_STRUCTURE', payload: operationTimingStructure });
      
      let managerDetailList = clientBranchDetails.managerDetails.length > 0 ? clientBranchDetails.managerDetails: [structure.branchManagerDetails];

      let branchMangerStructureList = managerDetailList.map((field: IMongoField, index: number) => {

        let newField = {
          branchManagerId: field?.branchManagerId? field.branchManagerId : null,
          [index === 0 ? `managerContactName` : `managerContactName-${index}`]:{ ...structure.branchManagerDetails['managerContactName'], id: index === 0 ? `managerContactName` :`managerContactName-${index}`, fieldName: index === 0 ? `managerContactName` : `managerContactName-${index}`, labelKey: index === 0 ? `managerContactName` : `managerContactName-${index}`},
          [index === 0 ? `managerMobileNumber` : `managerMobileNumber-${index}`]: { ...structure.branchManagerDetails['managerMobileNumber'], id: index === 0 ? `managerMobileNumber` : `managerMobileNumber-${index}`, fieldName: index === 0 ? `managerMobileNumber` : `managerMobileNumber-${index}`, labelKey: index === 0 ? `managerMobileNumber` : `managerMobileNumber-${index}`},
          [index === 0 ? `managerWhatsappOptin` : `managerWhatsappOptin-${index}`]: { ...structure.branchManagerDetails['managerWhatsappOptin'], id: index === 0 ? `managerWhatsappOptin` : `managerWhatsappOptin-${index}`, fieldName: index === 0 ? `managerWhatsappOptin` : `managerWhatsappOptin-${index}`, labelKey: index === 0 ? `managerWhatsappOptin` : `managerWhatsappOptin-${index}`},
          [index === 0 ? `managerEmailAddress` : `managerEmailAddress-${index}`]: { ...structure.branchManagerDetails['managerEmailAddress'], id: index === 0 ? `managerEmailAddress` : `managerEmailAddress-${index}`, fieldName: index === 0 ? `managerEmailAddress` : `managerEmailAddress-${index}`, labelKey: index === 0 ? `managerEmailAddress` : `managerEmailAddress-${index}`},
          [index === 0 ? `shiftTiming` :`shiftTiming-${index}`]: { ...structure.branchManagerDetails['shiftTiming'], id: index === 0 ? `shiftTiming` :`shiftTiming-${index}`, fieldName: index === 0 ? `shiftTiming` :`shiftTiming-${index}`, labelKey: index === 0 ? `shiftTiming` :`shiftTiming-${index}` }
        };
  
        return newField;
      });  
  
      dispatch({ type: '@@branchConfiguration/SET_BRANCH_MANAGER_STRUCTURE', payload: branchMangerStructureList });      
    } else {
      return;
    }
  }, [clientBranchDetails, isEditMode]);

  useEffect(() => {
    if(isEditMode && Object.keys(clientBranchDetails).length && !isBranchManagerTouched) {
    const newManagerDetails = deepCopy(clientBranchDetails.managerDetails);
    let shiftTimingList = clientBranchDetails.managerDetails.length > 0 ? [].concat(...newManagerDetails.map((manager: IMangerDetails) => {  return manager.shifts.length > 0 ? manager.shifts.map((shift:IShifts) => { return {...shift, branchManagerId: manager.branchManagerId}}) : {branchManagerId: manager.branchManagerId}})) : [shiftTimingsStructure]
    if(shiftTimingList.length > 0) {
      let shiftList = shiftTimingList.map((field:IDynamicMongoField, index: number) => {
      let branchManager = branchManagerList.filter((manager:IBranchManagerStructure)=>  {return manager.branchManagerId === field.branchManagerId})
      if(branchManager.length > 0) {
       let newField = {
          ['shiftTimingId']: field.shiftTimingId ? field.shiftTimingId : null,
         [index === 0 ? `daysOfWeek` : `daysOfWeek-${index}`]: { ...shiftTimingsStructure['daysOfWeek'], id: index === 0 ? `daysOfWeek` : `daysOfWeek-${index}`, fieldName: index === 0 ? `daysOfWeek` : `daysOfWeek-${index}`, labelKey: index === 0 ? `shiftDayOfWeek` : `shiftDayOfWeek-${index}`, permission: true },
         [index === 0 ? `shiftStartTime` : `shiftStartTime-${index}`]: { ...shiftTimingsStructure['shiftStartTime'], id: index === 0 ? `shiftStartTime` : `shiftStartTime-${index}`, fieldName: index === 0 ? `shiftStartTime` : `shiftStartTime-${index}`, labelKey: index === 0 ? `shiftStartTime` : `shiftStartTime-${index}`, permission: true },
         [index === 0 ? `shiftEndTime` : `shiftEndTime-${index}`]: { ...shiftTimingsStructure['shiftEndTime'], id: index === 0 ? `shiftEndTime` : `shiftEndTime-${index}`, fieldName: index === 0 ? `shiftEndTime` : `shiftEndTime-${index}`, labelKey: index === 0 ? `shiftEndTime` : `shiftEndTime-${index}`, permission: true },
         branchManagerId: branchManager.length && branchManager[0].branchManagerId === field.branchManagerId ? Object.keys(branchManager[0])[5] : 'shiftTiming',
         isSaved: true
        };  
        return newField;
        } else {
          if(Object.keys(shiftTimingsStructure).length > 0) {
          return convertShiftTimingStructure([shiftTimingsStructure]); 
         }
        }
    })
    setEditModeShiftList(shiftList)
    dispatchShiftTimingsStructure(shiftList.flat())
  } else {
    if(Object.keys(shiftTimingsStructure).length > 0) {
      dispatchShiftTimingsStructure(convertShiftTimingStructure([shiftTimingsStructure]));
  }      
}
   
} else if(!isEditMode){
      if (Object.keys(structure).length > 0) {
      const newStructure = deepCopy(structure);
      if(newStructure['general details'] && newStructure['general details'].clientId && newStructure['general details'].superClientParentBranchId &&
        newStructure['general details'].name && newStructure['general details'].branchTimeZone) {
        newStructure['general details'].clientId.editable = true;
        newStructure['general details'].superClientParentBranchId.editable = true;
        newStructure['general details'].name.editable = true;
        newStructure['general details'].branchTimeZone.editable = true;
        if(newStructure['carrierDetails']?.vendorName) {
          newStructure['carrierDetails'].vendorName.editable = true;
        }
        dispatchFormStructure(newStructure);
        }
      }
    }
  }, [clientBranchDetails, isEditMode, branchManagerList, shiftTimingsStructure]);

  useEffect(() => {
    if(isEditMode && !isBranchManagerTouched && Object.keys(clientBranchDetails).length && clientBranchDetails.managerDetails.length) {
      let editModeMangerDetails = clientBranchDetails.managerDetails.map((manager: IMangerDetails) => {
      return {
        ['branchManagerId']: manager.branchManagerId,
        ['managerContactName']: manager.managerContactName,
        ['mobileNumber']: manager.mobileNumber,
        ['whatsappOptin']: manager.whatsappOptin,
        ['emailAddress']: manager.emailAddress,
        ['shifts']: manager.shifts.map((shift:IShifts) => {
          return {
                ['shiftTimingId']: shift.shiftTimingId,
                ['daysOfWeek']: shift.daysOfWeek,
                ['shiftStartTime']: shift.shiftStartTime,
                ['shiftEndTime']: shift.shiftEndTime
              };
        })
      }
    })
    setManagerDetails(editModeMangerDetails)
    }
  },[clientBranchDetails, isEditMode, rowKey])

    return(<></>);
}
export default BranchConfigurationWatchers;