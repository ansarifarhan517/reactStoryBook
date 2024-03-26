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
import { CompartmentConfigurationActions } from "../CompartmentConfiguration.actions";
import { AddFormButtonContainer, FormContainer, SectionHeaderContainer, FormFieldWrapper } from "../CompartmentConfigurationStyledComponents";
import { IFormFields, IDropdown, IRouteParams } from "../CompartmentConfiguration.models"
import {preparePayload} from "../utils"
import { sendGA } from "../../../../../utils/ga";
import { tGlobalPopupAction } from '../../../../common/GlobalPopup/GlobalPopup.reducer';
import { deepCopy } from "../../../../../utils/helper";
import { metricsConversion } from "../../../../../utils/helper";
import { tGlobalToastActions } from '../../../../common/GlobalToasts/globalToast.reducer'

const CompartmentForm = () => {
    /* General Hooks */
    const history = useHistory();
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.settings.compartmentConfiguration);
    const formInstance = useForm<Record<string, any>>({ mode: 'all', shouldUnregister: false });
    const toast = useToast();
    console.log(formInstance.formState.isDirty)
    const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()
    /** Redux Hooks */
    const dispatch = useDispatch<Dispatch<CompartmentConfigurationActions>>();
    const isFormLoading = useTypedSelector((state) => state.compartmentConfiguration.form.loading)
    const structure = useTypedSelector((state) => state.compartmentConfiguration.form.structure);
    const sectionKeys = Object.keys(structure);
    const loaderRef = React.useRef<HTMLDivElement | null>(null);
    const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>();
    const { handleSubmit , setValue } = formInstance
    const { compartmentId } = useParams<IRouteParams>();
    const isFormEditable = useTypedSelector((state) => state.compartmentConfiguration.form.isEditable);
    const compartmentData = useTypedSelector((state) => state.compartmentConfiguration.form.compartmentData)
    const crates = useTypedSelector((state) => state.compartmentConfiguration.crates)
    const clientMetric = useTypedSelector((state)=> state.compartmentConfiguration.clientMetric)

    useEffect(() => {
        dispatch({ type: '@@compartmentConfiguration/FETCH_FORM_STRUCTURE' });
    }, []);

    useEffect(() => {
        if(isFormEditable && Object.keys(structure).length > 0){
            const newStructure = deepCopy(structure);
            setTimeout(() => {
                newStructure['general details']['compartmentName'].editable = false;
                dispatch({ type: '@@compartmentConfiguration/FETCH_FORM_STRUCTURE_SUCCESS', payload: newStructure });
            },100)
        }
    }, [isFormEditable]);
    useEffect(() => {
        if (compartmentId) {
            dispatch({ type: '@@compartmentConfiguration/FETCH_COMPARTMENT_BY_ID', payload: compartmentId });
        }
    }, [compartmentId]);

    useEffect(()=> {
        if(isFormEditable){
            const volume = clientMetric && clientMetric?.find(c => c.name === 'volume')
            const weight = clientMetric && clientMetric?.find(c => c.name === 'weight')
            setValue('compartmentName', compartmentData.compartmentName)
            setValue('breadth', compartmentData.breadth)
            setValue('height', compartmentData.height)
            setValue('length', compartmentData.length)
            setValue('capacityInUnits', compartmentData.capacityInUnits)
            
            setValue('capacityInVolume', compartmentData.capacityInVolume ? metricsConversion(compartmentData.capacityInVolume, 'GET', volume?.conversionFactor).toFixed(2): '')
            setValue('capacityInWeight', compartmentData.capacityInWeight ? metricsConversion(compartmentData.capacityInWeight, 'GET', weight?.conversionFactor).toFixed(2): '')
            setValue('temperatureCategoryCd', {id: compartmentData.temperatureCategoryCd, name: compartmentData.temperatureCategoryCd, clientRefMasterCd:compartmentData.temperatureCategoryCd})
            setValue('minTemperature', compartmentData.minTemperature)
            setValue('maxTemperature', compartmentData.maxTemperature)
            const selectedCratesArray: IDropdown[] = [];
            compartmentData.crateIds && compartmentData.crateIds.forEach((id: number) => {
                const selectedCrate = crates.find((crate) => crate.id === id)
                if(selectedCrate){
                    selectedCrate['name'] = selectedCrate['label']
                }
                selectedCrate && selectedCratesArray.push(selectedCrate)
            })
            setValue('crateIds', selectedCratesArray)
        }
    }, [isFormEditable])

    const saveForm = async (fields: IFormFields) => {
        sendGA('Compartment Configuration', `Add Compartment`);
        const payload = preparePayload(fields, clientMetric);
        try {
            const { data: { status, message } } = await axios.post(apiMappings.compartmentConfiguration.form.addCompartment, payload)
            if (status === 200) {
                history.push("/");
                resetForm();
                dispatch({ type: '@@compartmentConfiguration/SET_VIEW_TYPE', payload: 'allCompartments' });
                toast.add(message || dynamicLabels.compartment_s + 'added successfully', 'check-round', false);
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
    const updateForm = async (fields: IFormFields) => {
        sendGA('Compartment Configuration', `Update Compartment`);
        const payload = preparePayload(fields, clientMetric);
        payload['compartmentId'] = compartmentData?.compartmentId;
        try {
            const { data: { status, message } } = await axios.put(apiMappings.compartmentConfiguration.form.updateCompartment, payload)

            if (status === 200) {
                resetForm();
                toast.add(message || dynamicLabels.compartment_s + 'updated successfully', 'check-round', false);
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
    const validateFields = async (fields: IFormFields)  => {
        let sendApiCall = true
        if(fields?.minTemperature !== '' && fields?.maxTemperature !== ''){
            if(parseFloat(fields?.minTemperature) >= parseFloat(fields?.maxTemperature)) {
              toastDispatch({
                type: '@@globalToast/add', payload: {
                  message: dynamicLabels?.maxTempGreaterThanMinTemp,
                  icon: 'check-round'
                }
              })
              sendApiCall = false
            }
        }
        if (fields?.capacityInUnits && fields.capacityInUnits % 1 != 0) {
            toast.add((dynamicLabels && dynamicLabels.decimalValue) ? dynamicLabels.decimalValue : 'Capacity (in Units) cannot be decimal.', 'warning', false);
            sendApiCall = false
        }
        if(sendApiCall){
            isFormEditable ? updateForm(fields) : saveForm(fields)
        }
    }
    const resetForm = () => {
        history.push("/");
        dispatch({ type: "@@compartmentConfiguration/SET_VIEW_TYPE", payload: "allCompartments" });
        dispatch({ type: "@@compartmentConfiguration/RESET_COMPARTMENT_DATA" });
        dispatch({ type: "@@compartmentConfiguration/SET_FORM_EDITABLE", payload: false });
    }
    const handleCancelForm = () => {
        sendGA('Compartment Configuration', `${isFormEditable ? 'Cancel Update Compartment' : "Cancel - Add Compartment Form"}`); 
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
                                        if(meta.id === 'capacity'){
                                            return (
                                                <Grid item key={fieldName} xs={12} sm={6} md={4} style={{paddingTop: '15px'}} className='input-grid grid-item'>
                                                    <FormFieldWrapper><FormField name={fieldName} meta={meta} formInstance={formInstance} /></FormFieldWrapper>
                                                </Grid>
                                            )
                                        }else {
                                            return (
                                                <Grid item key={fieldName} xs={12} sm={6} md={4} className='input-grid grid-item'>
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
                        <IconButton id={`compartmentForm--${isFormEditable ? dynamicLabels.update : dynamicLabels.save}`} primary iconVariant="icomoon-save" onClick={handleSubmit((data) => validateFields(data))}>{isFormEditable ? dynamicLabels.update : dynamicLabels.save}</IconButton>
                        <IconButton id="CompartmentForm-Cancel" iconVariant="cancel-button" onClick={() => {handleCancelForm()}}>{dynamicLabels.cancel}</IconButton>
                    </AddFormButtonContainer>
                </Grid>
            </>
    )
}

export default CompartmentForm;