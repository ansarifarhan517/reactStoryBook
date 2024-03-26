import React, { Dispatch, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { SectionHeader, Grid, IconButton, useToast} from "ui-library";
import apiMappings from "../../../../../utils/apiMapping";
import axios from "../../../../../utils/axios";
import FormField from "../../../../../utils/components/Form/FormField";
import FormLoader from "../../../../../utils/components/FormLoader";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import { ServiceTypeConfigurationActions } from "../ServiceTypeConfiguration.actions";
import { AddFormButtonContainer, FormContainer, SectionHeaderContainer, SpanCSS } from "../ServiceTypeConfigurationStyledComponents";
import { IFormFields, IDropdown, IRouteParams } from "../ServiceTypeConfiguration.models"
import {preparePayload, convertUTCTimeToLocalTime} from "../utils"
import { sendGA } from "../../../../../utils/ga";
import { tGlobalPopupAction } from '../../../../common/GlobalPopup/GlobalPopup.reducer';

const AddServiceTypeForm = () => {
    /* General Hooks */
    const history = useHistory();
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.settings.serviceTypeConfiguration);
    const formInstance = useForm<Record<string, any>>({ mode: 'all', shouldUnregister: false });
    const toast = useToast();

    /** Redux Hooks */
    const dispatch = useDispatch<Dispatch<ServiceTypeConfigurationActions>>();
    const isFormLoading = useTypedSelector((state) => state.serviceTypeConfiguration.form.loading)
    const structure = useTypedSelector((state) => state.serviceTypeConfiguration.form.structure);
    const sectionKeys = Object.keys(structure);
    const loaderRef = React.useRef<HTMLDivElement | null>(null);
    const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>();
    const { handleSubmit , setValue, setError, reset} = formInstance
    const TimeWithFormatOptions = [
        { clientRefMasterCd: 'Mins',clientRefMasterId: dynamicLabels.Mins,id: dynamicLabels.Mins, value: 'Mins', label: dynamicLabels.Mins, title: dynamicLabels.Mins},
        { clientRefMasterCd: 'Hours',clientRefMasterId: dynamicLabels.Hours,id: dynamicLabels.Hours, value: 'Hours', label: dynamicLabels.Hours, title: dynamicLabels.Hours},
        { clientRefMasterCd: 'Days',clientRefMasterId: dynamicLabels.days,id: dynamicLabels.days, value: 'Days', label: dynamicLabels.days, title: dynamicLabels.days}
    ]
    const { serviceTypeDetailsId } = useParams<IRouteParams>();
    const isFormEditable = useTypedSelector((state) => state.serviceTypeConfiguration.form.isEditable)
    const serviceTypeData = useTypedSelector((state) => state.serviceTypeConfiguration.form.serviceTypeData)
    const branches = useTypedSelector((state) => state.serviceTypeConfiguration.branches)
    const deliveryTypes = useTypedSelector((state) => state.serviceTypeConfiguration.deliveryTypes)

    useEffect(() => {
        dispatch({ type: '@@serviceTypeConfiguration/FETCH_FORM_STRUCTURE' });
    }, []);
    useEffect(() => {
        if(!isFormEditable){
            setValue('autoAllocate', 'N');
            setValue('branchMovement', 'Y');
            setValue('deliverSLAUnit', { clientRefMasterCd: 'Days',clientRefMasterId: dynamicLabels.days,id: dynamicLabels.days, value: 'Days', label: dynamicLabels.days, title: dynamicLabels.days})
        }
    }, [structure, isFormEditable]);
    useEffect(() => {
        if (serviceTypeDetailsId) {
            dispatch({ type: '@@serviceTypeConfiguration/FETCH_SERVICETYPE_BY_ID', payload: serviceTypeDetailsId });
        }
    }, [serviceTypeDetailsId]);

    useEffect(()=> {
        if(isFormEditable){
            reset({'autoAllocate': serviceTypeData.autoAllocate});
            setValue('name', serviceTypeData.name)
            setValue('description', serviceTypeData.description)
            setValue('considerHolidays', serviceTypeData.considerHolidays)
            setValue('serviceStartTime',convertUTCTimeToLocalTime(serviceTypeData.serviceStartTime, false) )
            setValue('serviceEndTime',convertUTCTimeToLocalTime(serviceTypeData.serviceEndTime, false) )
            setValue('cutOffTime',convertUTCTimeToLocalTime(serviceTypeData.cutOffTime, false) )
            setValue('deliveryBeforeTime', serviceTypeData.deliveryBeforeTime? convertUTCTimeToLocalTime(serviceTypeData.deliveryBeforeTime, false) : '')
            setValue('deliverSLA', serviceTypeData.deliverSLA)
            setValue('branchMovement', serviceTypeData.branchMovement);
            setValue('autoAllocate', serviceTypeData.autoAllocate);
            setValue('deliverSLAUnit',{id: serviceTypeData.deliverSLAUnit ? serviceTypeData.deliverSLAUnit : 'Mins', name: serviceTypeData.deliverSLAUnit ? serviceTypeData.deliverSLAUnit : dynamicLabels.Mins, clientRefMasterCd: serviceTypeData.deliverSLAUnit ? serviceTypeData.deliverSLAUnit : 'Mins'})
            const serviceDaysArray = serviceTypeData?.serviceDays.split(',')
            const serviceDays = serviceDaysArray.map((s: any) => {
                return { id: s, name: s, clientRefMasterCd: s }
            })
            setValue('serviceDays', serviceDays)
            const selectedBranchNameArray: IDropdown[] = [];
            serviceTypeData.branchId && serviceTypeData.branchId.forEach((id: number) => {
                const selectedBranch = branches.find((branch) => branch.branchId === id)
                selectedBranch && selectedBranchNameArray.push(selectedBranch)
            })
            setValue('branchId', selectedBranchNameArray)
            const selectedDeliveryTypeArray: IDropdown[] = [];
            serviceTypeData.deliveryType && serviceTypeData.deliveryType.forEach((id: number) => {
                const selectedDeliveryType = deliveryTypes.find((type) => type.id === id)
                if(selectedDeliveryType){
                    selectedDeliveryType['name'] = selectedDeliveryType.value
                    selectedDeliveryType['clientRefMasterId'] = selectedDeliveryType.id
                    selectedDeliveryTypeArray.push(selectedDeliveryType)
                }
            })
            setValue('deliveryType', selectedDeliveryTypeArray)
        }
    }, [isFormEditable])

    const saveForm = async (fields: IFormFields) => {
        sendGA('All Service Type', `Click - Save Service Type`);
        const payload = preparePayload(fields);
        if ((payload?.cutOffTime > payload?.serviceEndTime)){
            toast.add((dynamicLabels && dynamicLabels.requestCutoffTimeError) ? dynamicLabels.requestCutoffTimeError : 'Pickup End time should be equal or greater than request cutoff time.', 'warning', false);
            return;
        }
        try {
            const { data: { status, message } } = await axios.post(apiMappings.serviceTypeConfiguration.form.addServiceType, payload)
            if (status === 200) {
                history.push("/");
                resetForm();
                dispatch({ type: '@@serviceTypeConfiguration/SET_VIEW_TYPE', payload: 'allServiceTypes' });
                toast.add(dynamicLabels.serviceTypeAddedSuccessfully, 'check-round', false);
                return;
            }
            else if (status === 400) {
                toast.add(message, 'warning', false);
                return;
            }
            throw message;

        } catch (error) {
            console.log(error, error?.response)
            toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false);
        }
    }
    const updateForm = async (fields: IFormFields) => {
        sendGA('All Service Type', `Click - Update Service Type - Save`);
        const payload = preparePayload(fields);
        if ((payload?.cutOffTime > payload?.serviceEndTime)){
                toast.add((dynamicLabels && dynamicLabels.requestCutoffTimeError) ? dynamicLabels.requestCutoffTimeError : 'Pickup End time should be equal or greater than request cutoff time.', 'warning', false);
            return;
        }
        if(!payload.deliveryType.length && !payload.serviceDays.length){
            setError('deliveryType', {type: 'required'})
            setError('serviceDays', {type: 'required'})
            return;
        }
        if(!payload.deliveryType.length){
            setError('deliveryType', {type: 'required'})
            return;
        }
        if(!payload.serviceDays.length){
            setError('serviceDays', {type: 'required'})
            return;
        }
        payload['serviceTypeDetailsId'] = serviceTypeData?.serviceTypeDetailsId
        payload['clientRefMasterId'] = serviceTypeData?.clientRefMasterId
       try {
            const { data: { status, message } } = await axios.post(apiMappings.serviceTypeConfiguration.form.updateServiceType, payload)

            if (status === 200) {
                resetForm();
                toast.add(dynamicLabels.serviceTypeUpdatedSuccessfully, 'check-round', false);
                return;
            }
            else if (status === 400) {
                toast.add(message, 'warning', false);
                return;
            }
            throw message;

        } catch (error) {
            toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false);
        }
    }

    const resetForm = () => {
        history.push("/");
        sendGA('All Service Type', `${isFormEditable ? 'Click -Cancel Update Service Type' : "Click - Cancel Add service Type"}`); 
        dispatch({ type: "@@serviceTypeConfiguration/SET_VIEW_TYPE", payload: "allServiceTypes" });
        dispatch({ type: "@@serviceTypeConfiguration/RESET_SERVICETYPE_DATA" });
        dispatch({ type: "@@serviceTypeConfiguration/SET_FORM_EDITABLE", payload: false });
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
                    <IconButton iconVariant='icomoon-tick-circled' primary onClick={() => { globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' }); resetForm()}}>{dynamicLabels.ok}</IconButton>
                    <IconButton iconVariant='icomoon-close' onClick={() => globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })}>{dynamicLabels.cancel}</IconButton>
                  </>
                )
              }
            })
          }
    }
    return (
        isFormLoading || sectionKeys.length === 0 ? (
            <div ref={loaderRef}>
                <FormLoader />
            </div>
        ) :
            <>
                {sectionKeys.length > 0 &&
                    sectionKeys.map((sectionName) => (
                        <FormContainer key={sectionName}>
                            <SectionHeaderContainer><SectionHeader headerTitle={dynamicLabels[sectionName]} /></SectionHeaderContainer>
                            <Grid container spacing='10px' style={{ marginBottom: '15px'}}>
                                <>
                                    {Object.keys(structure[sectionName]).map((fieldName) => {
                                        const meta = structure[sectionName][fieldName]
                                        const { permission } = meta;
                                        if (!permission) {
                                            return undefined;
                                        }
                                        if(meta.fieldName === 'deliverSLA'){
                                            meta.removeDecimal = true
                                            return (
                                                <>
                                                <Grid item key={fieldName} xs={12} sm={2} md={2} style={{paddingRight: '5px'}} className='grid-item'>
                                                    <FormField name={fieldName} meta={meta} formInstance={formInstance} />
                                                </Grid>
                                                <SpanCSS>-</SpanCSS>
                                                </>
                                            )
                                        }if(meta.fieldName === 'deliverSLAUnit'){
                                            return (
                                                <Grid item key={fieldName} xs={12} sm={1} md={1} style={{paddingLeft: '5px'}} className='grid-item'>
                                                    <FormField name={fieldName} meta={meta} formInstance={formInstance} options={TimeWithFormatOptions}/>
                                                </Grid>
                                            )
                                        }if (meta.fieldType === "toggleBox") {
                                            return (
                                              <Grid item key={fieldName} xs={12} sm={6} md={3} className="grid-item toggle-item"
                                                style={{ display: "flex" }} >
                                                  <FormField name={fieldName} meta={meta} formInstance={formInstance} />
                                              </Grid>
                                            );
                                        } else {
                                            if(meta.fieldName === 'deliveryType' ||  meta.fieldName === 'branch' || meta.fieldName === 'serviceStartTime' || meta.fieldName === 'serviceEndTime'
                                            || meta.fieldName === 'cutOffTime' || meta.fieldName === 'deliveryBeforeTime'){
                                                meta['pageName'] = 'addServiceTypeForm'
                                            }
                                            return (
                                                <Grid item key={fieldName} xs={12} sm={3} md={3} className='grid-item'>
                                                    <FormField name={fieldName} meta={meta} formInstance={formInstance} />
                                                </Grid>
                                            )
                                        }
                                    })}
                                </>
                            </Grid>
                        </FormContainer>
                    ))}
                <Grid container spacing='15px'>
                    <AddFormButtonContainer item xs={6} sm={6} md={6}>
                        <IconButton id={`AddServiceTypeForm--actionBar--${isFormEditable ? dynamicLabels.update : dynamicLabels.save}`} primary iconVariant="icomoon-save" disabled={isFormEditable && (!formInstance.formState.isDirty)} onClick={handleSubmit((data) => isFormEditable ? updateForm(data) : saveForm(data))}>{isFormEditable ? dynamicLabels.update : dynamicLabels.save}</IconButton>
                        <IconButton id="AddServiceTypeForm--actionBar--Cancel" iconVariant="cancel-button" onClick={() => {handleCancelForm()}}>{dynamicLabels.cancel}</IconButton>
                    </AddFormButtonContainer>
                </Grid>
            </>
    )
}

export default AddServiceTypeForm;