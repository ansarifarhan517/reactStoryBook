import React, { Dispatch, useEffect,useState } from "react";
import { withReactOptimized } from "../../../utils/components/withReact";
import { useDispatch } from "react-redux";
import { ITrackerFormActions } from "./TrackerForm.actions";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import FormLoader from "../../../utils/components/FormLoader";
import { AddFormButtonContainer, FormContainer, SectionHeaderContainer } from "./TrackerFormStyleComponents";
import {
  BreadCrumb, Box, Card, Grid,
  SectionHeader,
  IconButton,
  useToast
} from 'ui-library'
import { sendGA } from '../../../utils/ga';
import FormField from "../../../utils/components/Form/FormField";
import { useForm } from "react-hook-form";
import { IFormFields } from "../TrackersListView/TrackersListView.models";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import { FormWrapper } from "../../../utils/components/Form/Form.styles";
import { preparePayload } from "./TrackerForm.utils";
import axios from "../../../utils/axios";
import apiMappings from "../../../utils/apiMapping";
import { getQueryParams, hybridRouteTo } from "../../../utils/hybridRouting";
import { tGlobalToastActions } from "../../common/GlobalToasts/globalToast.reducer";
import { tGlobalPopupAction } from "../../common/GlobalPopup/GlobalPopup.reducer";
import { useBreadCrumbs } from "./TrackerForm.utils";


const TrackerForm = () => {


  /* General Hooks */
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.trackers)
  const toast = useToast();
  const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>();



  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<ITrackerFormActions>>();
  const loaderRef = React.useRef<HTMLDivElement | null>(null);
  const formInstance = useForm<Record<string, any>>({ mode: 'all', shouldUnregister: false });
  const { handleSubmit, setValue } = formInstance
  const isFormLoading = useTypedSelector((state) => state.tracker.trackers.form.loading)
  const structure = useTypedSelector((state) => state.tracker.trackers.form.structure);
  const isFormEditable = useTypedSelector((state) => state.tracker.trackers.form.isFormEditable)
  const trackerData = useTypedSelector((state) => state.tracker.trackers.form.trackerData)

  const trackersList = useTypedSelector((state)=>state.tracker.trackers.form.trackersList)
  const { deviceId } = getQueryParams()
  console.log(formInstance.formState.isDirty)
useEffect(() => {
    dispatch({type: '@@trackerForm/FETCH_DROPDOWN_OPTIONS'})
    dispatch({ type: "@@trackerForm/FETCH_FORM_STRUCTURE" });
    setValue('isActiveFl', 'Y')
  }, []);
  useEffect(() => {
    if (deviceId) {
      dispatch({ type: '@@trackerForm/FETCH_DEVICE_BY_ID', payload: deviceId })
    }
  }, [deviceId])
  useEffect(() => {

    if (isFormEditable) {
      if (trackerData?.clientBranchId) {

        setValue('clientBranchId',{id: trackerData?.clientBranchId, name:trackerData?.clientBranchName,branchId: trackerData?.clientBranchId})
      }

      if(trackerData?.trackeeId){
        setValue('trackeeId',trackerData?.trackeeId)
      }
      if(trackerData?.trackerDescription){
        setValue('trackerDescription',trackerData?.trackerDescription)
      }
      if(trackerData?.barcode){
        setValue('barcode',trackerData?.barcode)
      }
      if(trackerData?.imei){
        setValue('imei',trackerData?.imei)
      }

      if(trackerData?.trackerConfigId){
        setValue('trackerConfigId',{ id : trackerData?.trackerConfigId,name: trackerData?.trackerModel})


        const tracker = trackersList.find((tracker) => {
          if (tracker?.trackerConfigId === trackerData?.trackerConfigId){
            return tracker;
          }
        })


       setValue('trackerTypeRefId', { id: tracker?.trackerTypeRefId, name: tracker?.trackerTypeRefCd, clientRefMasterCd: tracker?.trackerTypeRefId})
       setValue('supplierRefId',{id:tracker?.supplierRefId,name : tracker?.supplierRefCd})
      }

      setValue('isActiveFl',trackerData?.isActiveFl ? 'Y' : 'N')
    }
  }, [isFormEditable,trackerData,trackersList])
  const { breadCrumbOptions, handleBreadCrumbClick } = useBreadCrumbs(formInstance)


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
  const updateForm = async (fields: IFormFields) => {
    sendGA('Tracker ', 'Update Tracker');
    const payload = preparePayload(fields);
    payload['deviceId'] = trackerData?.deviceId
    const errorMessage= validation(fields);
    if(!validation(fields)){
      try {
        const { data: { status, message } } = await axios.put(apiMappings.tracker.trackers.form.updateDevice, payload)
        if (status === 200) {
          resetForm();
          toastDispatch({
            type: '@@globalToast/add', payload: {
              message: dynamicLabels.trackerUpdatedSuccessfully,
              icon: 'check-round'
            }
          })
          return;
        }
        
        throw message;
      } catch (error: any) {
        toast.add(error?.response?.data?.error?.[0].message || error?.response?.data?.message || dynamicLabels?.somethingWendWrong, 'warning', false)
      }
    }else{
       toast.add(`${errorMessage}`,'warining', false)
    }   
  }

  const validation =(fields:IFormFields)=>{
    const trackeeId = Number(fields?.trackeeId)
    if(trackeeId===0){
       return dynamicLabels.trackerIdCannotBe0 || 'Tracker Id cannot be zero'
    }

    const barcode = Number(fields?.barcode)
    if(fields?.barcode && barcode===0){
       return dynamicLabels.barcodeCannotBe0 || 'Barcode cannot be zero'
    }
    return false;
  }
  const saveForm = async (fields: IFormFields) => {
    sendGA('Tracker', 'Add Tracker')
    
    
    const payload = preparePayload(fields);
    const errorMessage = validation(fields);
    
    if(!validation(fields)){
    try {
      const { data: { status, message } } = await axios.post(apiMappings.tracker.trackers.form.addTracker, payload)
      if (status === 200) {
        hybridRouteTo("trackers")
        toastDispatch({
          type: '@@globalToast/add', payload: {
            message: dynamicLabels.trackerCreatedSuccessfully ,
            icon: 'check-round'
          }
        })
        return;
      }

      if (status === 409) {
        toast.add(message, 'warning', false)
        return;
      }
      throw message;
    } catch (error: any) {
      toast.add(error?.response?.data?.error?.[0].message || error?.response?.data?.message || dynamicLabels?.somethingWendWrong, 'warning', false)
    }
  }else{
    toast.add(`${errorMessage}`,'warining', false)
  }

  }

  const handleChange = async (data: any) => {

    setValue('trackerTypeRefId', { id: data.trackerTypeRefId, name: data.trackerTypeRefCd })
    setValue('supplierRefId', { id: data.supplierRefId, name: data.supplierRefCd })
  }

  const resetForm = () => {
    hybridRouteTo("trackers")

    dispatch({ type: "@@trackerForm/RESET_TRACKER_DATA" });
    dispatch({ type: "@@trackerForm/SET_FORM_EDITABLE", payload: false });
  }

  return (
    <FormWrapper formName="Tracker">
      <div id='toast-inject-here'></div>
      <Box py='15px'>
        <BreadCrumb options={breadCrumbOptions} onClick={handleBreadCrumbClick} />
      </Box>
      <Box bgColor="white">
        <Card style={{ minHeight: '80vh', position: 'relative' }}>
          {isFormLoading && <div ref={loaderRef}><FormLoader /></div>}
          <div style={isFormLoading ? { display: 'none' } : {}}>
            {Object.keys(structure).length > 0 && Object.keys(structure).map((sectionName) => (
              <FormContainer key={sectionName} >
                <SectionHeaderContainer>
                  <SectionHeader headerTitle={dynamicLabels[sectionName]}/>
                </SectionHeaderContainer>
                <Grid container spacing='10px' style={{ marginBottom: '15px' }}>
                  {Object.keys(structure[sectionName]).map((fieldName) => {
                    const meta = structure[sectionName][fieldName]
                    if (fieldName == 'trackerConfigId') {
                      return (
                        <Grid item key={fieldName} xs={12} sm={6} md={3} className='grid-item'>
                          <FormField
                            name={fieldName}
                            meta={meta}
                            onChange={handleChange}
                            formInstance={formInstance} />
                        </Grid>
                      )
                    }
                    if(meta.id === 'imei'){
                      meta.removeDecimal = true
                    }
                    return (
                      <Grid item key={fieldName} xs={12} sm={3} md={3} className='grid-item'>
                        <FormField name={fieldName} meta={meta} formInstance={formInstance} />
                      </Grid>
                    )
                  })}
                </Grid>
              </FormContainer>
            ))}
            <Grid container spacing='15px'>
              <AddFormButtonContainer item xs={6} sm={6} md={6}>
                <IconButton id='trackerForm-actionBar-save' primary iconVariant="icomoon-save" onClick={handleSubmit((data) => isFormEditable ? updateForm(data) : saveForm(data))}>{isFormEditable ? dynamicLabels.update : dynamicLabels.save}</IconButton>
                <IconButton iconVariant="cancel-button" onClick={() => { handleCancelForm() }}>{dynamicLabels.cancel}</IconButton>
              </AddFormButtonContainer>
            </Grid>
          </div>
        </Card>

      </Box>

    </FormWrapper>
  )
}

export default withReactOptimized(TrackerForm)
