import React, { Dispatch, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import { TrackerConfigurationActions } from "../TrackerConfiguration.actions";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import FormLoader from "../../../../../utils/components/FormLoader";
import { useHistory, useParams } from "react-router-dom";
import axios from "../../../../../utils/axios";
import apiMappings from "../../../../../utils/apiMapping";
import { useForm } from "react-hook-form";
import { SectionHeader, Grid, IconButton, useToast } from "ui-library";
import { SectionHeaderContainer } from "../TrackerConfigurationStyledComponents";
import { AddFormButtonContainer, FormContainer } from "../TrackerConfigurationStyledComponents"
import { IFormFields, IRouteParams } from "../TrackerConfiguration.models"
import { preparePayload } from "../utils"
import { sendGA } from "../../../../../utils/ga";
import FormField from "../../../../../utils/components/Form/FormField";
import { tGlobalPopupAction } from "../../../../common/GlobalPopup/GlobalPopup.reducer";
import AddTrackerConfigView from "./AddTrackerConfigView"



const AddTrackerConfigForm = () => {
  /* General Hooks */
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.settings.trackerConfiguration)
  const history = useHistory();
  const toast = useToast();
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>();
  


  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<TrackerConfigurationActions>>();
  const isFormLoading = useTypedSelector((state) => state.tracker.trackerConfiguration.form.loading)
  const loaderRef = React.useRef<HTMLDivElement | null>(null);
  const structure = useTypedSelector((state) => state.tracker.trackerConfiguration.form.structure);
  const formInstance = useForm<Record<string, any>>({ mode: 'all', shouldUnregister: false });
  const { handleSubmit, setValue } = formInstance
  const isFormEditable = useTypedSelector((state) => state.tracker.trackerConfiguration.form.isEditable)
  const trackerData = useTypedSelector((state) => state.tracker.trackerConfiguration.form.trackerData)
  const trackerTypeList = useTypedSelector((state) => state.tracker.trackerConfiguration.trackerTypeList)
  const supplierList = useTypedSelector((state) => state.tracker.trackerConfiguration.supplierList)
  const ownershipList = useTypedSelector((state) => state.tracker.trackerConfiguration.ownershipList)
  const { trackerConfigId } = useParams<IRouteParams>();
  console.log(formInstance.formState.isDirty)

  useEffect(() => {
    dispatch({ type: "@@trackerConfiguration/FETCH_FORM_STRUCTURE" });
    return ()=>{dispatch({type:"@@trackerConfiguration/RESET_STATE"})}
  }, []);

  useEffect(() => {

    if (trackerConfigId) {
      dispatch({ type: '@@trackerConfiguration/FETCH_TRACKER_BY_ID', payload: trackerConfigId });
    }
  }, [trackerConfigId]);

  useEffect(() => {
    if (isFormEditable) {
      // If this is update form then we are setting all the 3 values that are coming from API
      if(trackerData?.trackerModel){
        setValue('trackerModel', trackerData?.trackerModel);
      }

      if (trackerData?.trackerTypeRefId) {
        const tracker = trackerTypeList.find((tracker) => {
          if (tracker.id === trackerData.trackerTypeRefId)
            return tracker;
        })
        setValue('trackerTypeRefId', { id: trackerData.trackerTypeRefId, name: tracker?.title, clientRefMasterCd: tracker?.title, clientRefMasterId: trackerData.trackerTypeRefId })
      }

      // This is nonMandatory
      if (trackerData?.supplierRefId) {
        const supplier = supplierList.find((supplier) => {
          if (supplier.id === trackerData.supplierRefId)
            return supplier;
        })
        setValue('supplierRefId', { id: trackerData.supplierRefId, name: supplier?.title, clientRefMasterCd: supplier?.title, clientRefMasterId: trackerData.supplierRefId })
      }

      if (trackerData.ownership) {
        const ownership = ownershipList.find((ownership) => {
          const ownershipId = Number(trackerData.ownership)
          if (ownership.id === ownershipId)
            return ownership
        })
        setValue('ownership', { id: trackerData.ownership, name: ownership?.title, clientRefMasterCd: ownership?.title, clientRefMasterId: trackerData.ownership })
      }
    }
  }, [isFormEditable])


  const resetForm = () => {
    history.push("/");
    dispatch({ type: "@@trackerConfiguration/SET_VIEW_TYPE", payload: "allTrackers" });
    dispatch({ type: "@@trackerConfiguration/RESET_TRACKER_DATA" });
    dispatch({ type: "@@trackerConfiguration/SET_FORM_EDITABLE", payload: false });
  }
  const handleCancelForm = () => {
    if (!formInstance.formState.isDirty) {
      resetForm()
    } else {
      globalPopupDispatch({
        type: '@@globalPopup/SET_PROPS',
        payload: {
          isOpen: true,
          title: dynamicLabels.navigationConfirmation,
          content: dynamicLabels.dataLostWarningMsg,
          footer: (
            <>
              <IconButton iconVariant='icomoon-tick-circled' primary onClick={() => { globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' }); resetForm() }}>{dynamicLabels.ok}</IconButton>
              <IconButton iconVariant='icomoon-close' onClick={() => globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })}>{dynamicLabels.cancel}</IconButton>
            </>
          )
        }
      })
    }
  }
  const saveForm = async (fields: IFormFields) => {
    sendGA('Tracker Configuration', `Add Tracker`);

    const payload = preparePayload(fields);



    try {
      const { data: { status, message } } = await axios.post(apiMappings.tracker.trackerConfiguration.form.addTracker, payload)
      if (status === 200) {
        history.push("/");
        resetForm();
        dispatch({ type: "@@trackerConfiguration/SET_VIEW_TYPE", payload: "allTrackers" });

        toast.add(dynamicLabels.trackerCreatedSuccessfully, 'check-round', false);
        return;
      }
      else if (status === 400) {
        toast.add(message, 'warning', false);
        return;
      }
      else
        {
        toast.add(message , 'warning', false);
      }
      
      throw message;

    } catch (error: any) {

      toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false);
    }


  }
  const updateForm = async (fields: IFormFields) => {
    sendGA('Tracker Configuration', 'Update Tracker');

    const payload = preparePayload(fields);


    payload['trackerConfigId'] = trackerData?.trackerConfigId

    try {
      const { data: { status, message } } = await axios.put(apiMappings.tracker.trackerConfiguration.form.updateTracker, payload)
      if (status === 200) {
        resetForm();
        toast.add(dynamicLabels.trackerUpdatedSuccessfully, 'check-round', false)
        return;
      }
      else if (status === 400) {
        toast.add(message, 'warning', false);
        return;
      }
      throw message;
    } catch (error: any) {
      toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false);

    }
  }


  return (isFormLoading || Object.keys(structure).length === 0 ? (
    <div ref={loaderRef}>
      <FormLoader />
    </div>
  ) :
    <div style={{ height: "300px", paddingBottom: "0px" }}>
      {Object.keys(structure).length > 0 && Object.keys(structure).map((sectionName) => (
        <FormContainer key={sectionName} >
          <SectionHeaderContainer>
            <SectionHeader headerTitle={dynamicLabels[sectionName]}  />
          </SectionHeaderContainer>
          <Grid container spacing='10px' style={{ marginBottom: '15px' }}>
              {Object.keys(structure[sectionName]).map((fieldName) => {
                  return (
                    <AddTrackerConfigView meta={structure[sectionName][fieldName]} formInstance={formInstance} fieldName={fieldName} />
                  )
              })}
          </Grid>
        </FormContainer>
      ))}
      <Grid container spacing='15px'>
        <AddFormButtonContainer item xs={6} sm={6} md={6}>
          <IconButton primary iconVariant="icomoon-save" onClick={handleSubmit((data) => isFormEditable ? updateForm(data) : saveForm(data))}>{isFormEditable ? dynamicLabels.update : dynamicLabels.save}</IconButton>
          <IconButton iconVariant="cancel-button" onClick={() => { handleCancelForm() }}>{dynamicLabels.cancel}</IconButton>
        </AddFormButtonContainer>
      </Grid>
    </div>
  )
}
export default AddTrackerConfigForm;
