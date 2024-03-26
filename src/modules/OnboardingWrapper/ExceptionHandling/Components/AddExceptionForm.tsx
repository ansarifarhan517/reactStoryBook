import React, { Dispatch, useEffect, useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { SectionHeader, Grid, IconButton, useToast, Tooltip, Box } from "ui-library";
import apiMappings from "../../../../utils/apiMapping";
import axios from "../../../../utils/axios";
import FormField from "../../../../utils/components/Form/FormField";
import FormLoader from "../../../../utils/components/FormLoader";
import { deepCopy } from "../../../../utils/helper";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import { ExceptionHandlingActions } from "../ExceptionHandling.actions";
import { ICreatePayload, IDropDownOption, IExceptionEvents, IExceptionHandlingRouteParams, IFormFields } from "../ExceptionHandling.models";
import { AddFormButtonContainer, FormContainer, FormFieldWapper, SectionHeaderContainer, LogATicketWrapper, FormFieldWapperWithToolTip } from "../ExceptionHandlingStyledComponents";
import EventModal from "./SubComponents/EventModal";
import { hybridRouteTo } from '../../../../utils/hybridRouting';
import { sendGA } from "../../../../utils/ga";

const AddExceptionForm = () => {
    /* General Hooks */
    const history = useHistory();
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.exceptionHandling);
    const formInstance = useForm<Record<string, any>>({ mode: 'all', shouldUnregister: false });
    const { setValue, watch, handleSubmit, clearErrors } = formInstance;

    const toast = useToast();

    /* Local State */

    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [eventCode, setEventCode] = useState<string>('');
    const [isEventTouched, setEventTouched] = useState<boolean>(false);
    

    /** Redux Hooks */
    const dispatch = useDispatch<Dispatch<ExceptionHandlingActions>>();
    const isFormLoading = useTypedSelector((state) => state.exceptionHandling.form.loading)
    const structure = useTypedSelector((state) => state.exceptionHandling.form.structure);
    const events = useTypedSelector((state) => state.exceptionHandling.form.events);
    const isFormEditable = useTypedSelector((state) => state.exceptionHandling.form.isEditable);
    const exceptionData = useTypedSelector((state) => state.exceptionHandling.form.exceptionData);
    const exceptionTypes = useTypedSelector((state) => state.exceptionHandling.lookup.exceptionTypes);
    const exceptionStages = useTypedSelector((state) => state.exceptionHandling.lookup.exceptionStages);
    const exceptionAppliesToList = useTypedSelector((state) => state.exceptionHandling.lookup.exceptionAppliesTo);
    const pageLabels = useTypedSelector((state) => state.pageLabels.addExceptionForm);
    const clientData = useTypedSelector((state) => state.ticketingTool.clientData);
    const sectionKeys = Object.keys(structure);
    const loaderRef = React.useRef<HTMLDivElement | null>(null);
    const exceptionMode = watch('exceptionMode', '');
    const exceptionAppliesTo = watch('exceptionAppliesTo','')
    const displayOnTrackingLink = watch('displayOnTrackingLink' , "")

    const { exceptionGroupId } = useParams<IExceptionHandlingRouteParams>();

    function checkBoxState(newStructure){
        
        if(exceptionAppliesTo.length !== 2){
            newStructure['exceptionDetails']['applyToConstituents'].permission = false;
         dispatch({type: '@@exceptionHandling/FETCH_FORM_STRUCTURE_SUCCESS', payload : newStructure})
        }
        else{
            newStructure['exceptionDetails']['applyToConstituents'].permission = true;
         dispatch({type: '@@exceptionHandling/FETCH_FORM_STRUCTURE_SUCCESS', payload : newStructure})
        }
    }

    useEffect(() => {
        dispatch({ type: '@@exceptionHandling/FETCH_FORM_STRUCTURE' });
        setValue('execptionMode', "Manual");
    }, []);

    
    useEffect(() => {
        if (events.length > 0 && !isFormEditable) setEventCode(events[0].exceptionCode)
    }, [events, isFormEditable])

    useEffect(() => { 
        if (exceptionGroupId && exceptionGroupId.length > 0 && Object.keys(structure).length > 0) {
            dispatch({ type: '@@exceptionHandling/FETCH_EXCEPTION_BY_ID', payload: exceptionGroupId });
        }
    }, [exceptionGroupId]);  

 

    useEffect(() => {
        const newStructure = deepCopy(structure);
        if (Object.keys(newStructure).length > 0 && newStructure.hasOwnProperty('exceptionMode')) {
            // if (displayOnTrackingLink === 'Y') {
            //     newStructure['exceptionDetails']['exceptionMessage'].required = true;
            //     dispatch({ type: '@@exceptionHandling/FETCH_FORM_STRUCTURE_SUCCESS', payload: newStructure });
            // } else {
            //     newStructure['exceptionDetails']['exceptionMessage'].required = false;
            //     dispatch({ type: '@@exceptionHandling/FETCH_FORM_STRUCTURE_SUCCESS', payload: newStructure });
            // }

            if (exceptionMode === "Event Based") {
                checkBoxState(newStructure);
                    if(isFormEditable) {
                        newStructure['exceptionMode']['exceptionMode'].editable = false;
                    }
                    newStructure['exceptionMode']['exceptionEvent'].permission = true;
                    newStructure['exceptionMode']['exceptionEvent'].required = true;
                    dispatch({ type: '@@exceptionHandling/FETCH_FORM_STRUCTURE_SUCCESS', payload: newStructure });    
         
                } else if (exceptionMode === "Manual") {
                setTimeout(() => {
                checkBoxState(newStructure);
                setValue('exceptionEvent', '');
                    if(!isFormEditable) {
                        setValue('exceptionMessage', '')
                    }
                    clearErrors("exceptionEvent")
                    if(isFormEditable) {
                        newStructure['exceptionMode']['exceptionMode'].editable = false;
                        setValue('exceptionMessage', exceptionData.exceptionMessage)
                    }
                    newStructure['exceptionMode']['exceptionEvent'].permission = false;
                    newStructure['exceptionMode']['exceptionEvent'].required = false;
                    dispatch({ type: '@@exceptionHandling/FETCH_FORM_STRUCTURE_SUCCESS', payload: newStructure });
                }, 100);
            }
        }
    }, [exceptionMode, isFormEditable, exceptionAppliesTo]);


    useEffect(() => {
        const newStructure = deepCopy(structure);
        if (Object.keys(newStructure).length > 0 && newStructure.hasOwnProperty('exceptionMode')) {
            if (displayOnTrackingLink === 'Y') {
                newStructure['exceptionDetails']['exceptionMessage'].required = true;
                dispatch({ type: '@@exceptionHandling/FETCH_FORM_STRUCTURE_SUCCESS', payload: newStructure });
            } else {
                newStructure['exceptionDetails']['exceptionMessage'].required = false;
                dispatch({ type: '@@exceptionHandling/FETCH_FORM_STRUCTURE_SUCCESS', payload: newStructure });
            }
        }
    }, [displayOnTrackingLink])
    useEffect(() => {
        if((exceptionMode === "Event Based") && !isFormEditable) {
            const exceptionEvent = events.find((event: IExceptionEvents) => event.exceptionCode === eventCode);
            setValue('exceptionEvent', exceptionEvent?.exceptionName);
            setValue('exceptionMessage', exceptionEvent?.exceptionDescription);
        }
    },[exceptionMode, isFormEditable]);

    useEffect(() => {
        if (isFormEditable && Object.keys(structure).length > 0 && events.length > 0 && !isEventTouched) {
            const newStructure = deepCopy(structure);
           const applyToConstituentsFlag = (exceptionData.applyToConstituents === true) ? "Y" : "N";
           const displayOntrack = (exceptionData.displayOnTrackingLink === true) ? "Y" : "N";  //
           
            if (exceptionData.exceptionMode === "Event Based") {
                const exceptionEvent = events.find((event: IExceptionEvents) => event.exceptionCode === (isEventTouched ? eventCode : exceptionData.eventCode))?.exceptionName;
                setValue('exceptionEvent', exceptionEvent);
                setEventCode(String(exceptionData.eventCode));
            }
            setValue('exceptionMode', exceptionData.exceptionMode);
            setValue('exceptionCode', exceptionData.exceptionCode);
            setValue('exceptionName', exceptionData.exceptionName);
            setValue('exceptionMessage', exceptionData.exceptionMessage)
            setValue('applyToConstituents', applyToConstituentsFlag)
            setValue('displayOnTrackingLink', displayOntrack)
            setValue('exceptionType', exceptionTypes.find((exxceptionType: IDropDownOption) => exxceptionType.clientRefMasterCd === exceptionData.exceptionType)); // single select
            setValue('exceptionStage', exceptionData.exceptionStage.length > 0 ? exceptionData.exceptionStage.map((exceptionStageRec: string) => exceptionStages.find((exceptionStage: IDropDownOption) => exceptionStage.clientRefMasterCd === exceptionStageRec)) : []);
            setValue('exceptionAppliesTo', exceptionData.exceptionAppliesTo.length > 0 ? exceptionData.exceptionAppliesTo.map((exceptionAppliesToRec: string) => exceptionAppliesToList.find((exceptionAppliesTo: IDropDownOption) => exceptionAppliesTo.clientRefMasterCd === exceptionAppliesToRec)) : []);
            dispatch({ type: '@@exceptionHandling/SET_FORM_LOADING', payload: false });

            
        setTimeout(() => {
            newStructure['exceptionMode']['exceptionMode'].editable = false;
            dispatch({ type: '@@exceptionHandling/FETCH_FORM_STRUCTURE_SUCCESS', payload: newStructure });
        }, 100);
        }
    }, [isFormEditable, events, isEventTouched]);

    useEffect(() => {
        
        if(isFormEditable && !isEventTouched && exceptionMode === "Event Based") {
            const exceptionEvent = events.find((event: IExceptionEvents) => event.exceptionCode === eventCode);
                setValue('exceptionEvent', exceptionEvent?.exceptionName);
                setValue('exceptionMessage', exceptionData.exceptionMessage || exceptionEvent?.exceptionDescription)
        }
       
    },[structure, isFormEditable, isEventTouched])


    useLayoutEffect(() =>{       
            const newStructure = deepCopy(structure);
            if (Object.keys(newStructure).length > 0 && newStructure.hasOwnProperty('exceptionMode')) {
               if (displayOnTrackingLink === 'Y') {
                   newStructure['exceptionDetails']['exceptionMessage'].required = true;
                   dispatch({ type: '@@exceptionHandling/FETCH_FORM_STRUCTURE_SUCCESS', payload: newStructure });
               } else {
                   newStructure['exceptionDetails']['exceptionMessage'].required = false;
                   dispatch({ type: '@@exceptionHandling/FETCH_FORM_STRUCTURE_SUCCESS', payload: newStructure });
               }
           }
    },[isFormLoading])

    const handleExceptionEvent = () => {
        setModalOpen(true);
    }

    const handleEventModal = () => {
        setEventTouched(true);
        const exceptionEvent = events.find((event: IExceptionEvents) => event.exceptionCode === eventCode);
        setEventCode(String(exceptionEvent?.exceptionCode));
        setValue('exceptionEvent', exceptionEvent?.exceptionName);
        setValue('exceptionMessage', exceptionEvent?.exceptionDescription)
        setModalOpen(false)
    }

    const saveForm = async (fields: IFormFields) => {
    fields.applyToConstituents = (fields.applyToConstituents === "Y") ? true : false
    fields.displayOnTrackingLink = (fields.displayOnTrackingLink === "Y") ? true : false
     sendGA('All Exceptions', `Click - Save Exception`);
       let payload: ICreatePayload = {
            exceptionMode: fields.exceptionMode,
            exceptionCode: fields.exceptionCode,
            exceptionName: fields.exceptionName,
            exceptionMessage: fields.exceptionMessage,
            applyToConstituents: fields.applyToConstituents, 
            displayOnTrackingLink:fields.displayOnTrackingLink,
            exceptionStage: fields.exceptionStage.length > 0 ? fields.exceptionStage.map((exceptionStage: IDropDownOption) => exceptionStage.clientRefMasterCd) : [],
            exceptionType: fields.exceptionType.clientRefMasterCd,
            exceptionAppliesTo: fields.exceptionAppliesTo.length > 0 ? fields.exceptionAppliesTo.map((exceptionApplies: IDropDownOption) => exceptionApplies.clientRefMasterCd) : []
        }

        if (fields.exceptionMode === "Event Based") {
            payload = { ...payload, eventCode: eventCode }
        }
        
        try {
            const { data: { status, message } } = await axios.post(apiMappings.exceptionHandling.form.create, payload)

            if (status === 200) {
                history.push("/");
                resetForm();
                dispatch({ type: '@@exceptionHandling/SET_VIEW_TYPE', payload: 'allExceptions' });
                toast.add(message, 'check-round', false);
                return;
            }
            else if (status === 400) {
                toast.add(message, 'warning', false);
                return;
            }
            throw message;

        } catch (error) {
            toast.add(dynamicLabels.somethingWendWrong, 'warning', false);
            console.log(error, error?.response);
        }
    }

    const updateForm = async (fields: IFormFields) => {
    fields.applyToConstituents = (fields.applyToConstituents === "Y") ? true : false
    fields.displayOnTrackingLink = (fields.displayOnTrackingLink === "Y") ? true : false
        sendGA('All Exceptions', `Click - Update Exception - Save`);
        let payload: ICreatePayload = {
            exceptionGroupId: exceptionGroupId,
            exceptionMode: fields.exceptionMode,
            exceptionCode: fields.exceptionCode,
            exceptionName: fields.exceptionName,
            exceptionMessage: fields.exceptionMessage,
            applyToConstituents: fields.applyToConstituents,
            displayOnTrackingLink: fields.displayOnTrackingLink,
            exceptionStage: fields.exceptionStage.length > 0 ? fields.exceptionStage.map((exceptionStage: IDropDownOption) => exceptionStage.clientRefMasterCd) : [],
            exceptionType: fields.exceptionType.clientRefMasterCd,
            exceptionAppliesTo: fields.exceptionAppliesTo.length > 0 ? fields.exceptionAppliesTo.map((exceptionApplies: IDropDownOption) => exceptionApplies.clientRefMasterCd) : []
        }

        if (fields.exceptionMode === "Event Based") {
            payload = { ...payload, eventCode: eventCode }
        }
        try {
            const { data: { status, message } } = await axios.post(apiMappings.exceptionHandling.form.update, payload)

            if (status === 200) {
                resetForm();
                toast.add(message, 'check-round', false);
                return;
            }
            else if (status === 400) {
                toast.add(message, 'warning', false);
                return;
            }
            throw message;

        } catch (error) {
            if(error?.response.status === 400 && error?.response?.data?.message) {
                toast.add(error?.response?.data?.message, 'warning', false);
            } else {
                toast.add(error.message, 'warning', false);
            }
            console.log(error, error?.response);
        }
    }

    const resetForm = () => {
        sendGA('All Exceptions', `${isFormEditable ? 'Click - Update Exception - Cancel' : "Click - Cancel Add Exception"}`); 
        dispatch({ type: "@@exceptionHandling/SET_VIEW_TYPE", payload: "allExceptions" });
        dispatch({ type: "@@exceptionHandling/RESET_EXCEPTION_DATA" });
        dispatch({ type: "@@exceptionHandling/SET_FORM_EDITABLE", payload: false });
        dispatch({ type: '@@exceptionHandling/RESET_FORM_STRUCTURE' });
        history.push('/')
    }
    const checkAuthentication = async () => {
        let username = JSON.parse(localStorage.getItem('userAccessInfo') || "")['userName'] || "";
        if(!clientData){
            try {
            const { data: response } = await axios.get(apiMappings.exceptionHandling.form.authenticateApi + username);
                if (response?.hasError) {
                    toast.add(response?.message || dynamicLabels.somethingWendWrong, "warning", false);
                } else  {
                    hybridRouteTo("ticketing");
                }
            }
            catch(error){
                toast.add(dynamicLabels.somethingWendWrong, "warning", false);
            }
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
                            <Grid container spacing='15px' style={{ marginBottom: '15px', paddingRight: '40px' }}>
                                <>
                                    {Object.keys(structure[sectionName]).map((fieldName) => {
                                        const meta = structure[sectionName][fieldName]
                                        const { permission } = meta;
                                        if (!permission) {
                                            return undefined;
                                        }
                                        if (fieldName === 'exceptionEvent') {
                                            if (watch('exceptionMode') === 'Event Based') {
                                                meta['fieldType'] = 'textWithIcon';
                                                meta['iconVariant'] = 'icomoon-add';
                                                meta['iconSize'] = 24;
                                                return (
                                                    <Grid spacing='15px' item key={fieldName} xs={12} sm={6} md={4} className='input-grid grid-item'>
                                                        <FormFieldWapper>
                                                            <FormField name={fieldName} meta={meta} formInstance={formInstance} handler={handleExceptionEvent} />
                                                        </FormFieldWapper>
                                                    </Grid>
                                                )
                                            }
                                            else {
                                                return <></>
                                            }
                                        } else if (fieldName === 'exceptionMode') {
                                            return (
                                                <Grid item key={fieldName} xs={12} sm={6} md={4} className='input-grid grid-item'>
                                                    <FormFieldWapperWithToolTip style={{ marginBottom: '0' }}>
                                                        <Tooltip arrowPlacement="start" messagePlacement='start' message={
                                                            <span style={{ textAlign: 'left', fontSize: 12 }}> <>
                                                                <Box mb='10px'>{dynamicLabels.manualExceptionsTooltTipText}</Box>
                                                                <Box mb='5px'>{dynamicLabels.eventBasedExceptionsTooltTipText}</Box></>
                                                            </span>} hover>
                                                            <FormField name={fieldName} meta={meta} formInstance={formInstance} />
                                                        </Tooltip>
                                                    </FormFieldWapperWithToolTip>
                                                </Grid>
                                            )
                                        } else if (fieldName === 'exceptionType') {
                                            meta['align'] = 'left';
                                            return (
                                                <Grid item key={fieldName} xs={12} sm={6} md={4} className='input-grid multiselect grid-item'>
                                                <FormFieldWapper>
                                                    <FormField name={fieldName} meta={meta} formInstance={formInstance} />
                                                </FormFieldWapper>
                                            </Grid>
                                            )
                                        } else {
                                            if (meta.fieldType === "multiselect") {
                                                return (
                                                    <Grid item key={fieldName} xs={12} sm={6} md={4} className='input-grid multiselect grid-item'>
                                                        <FormFieldWapper>
                                                            <FormField name={fieldName} meta={meta} formInstance={formInstance} />
                                                        </FormFieldWapper>
                                                    </Grid>
                                                )
                                            } else {
                                                return (
                                                    <Grid item key={fieldName} xs={12} sm={6} md={4} className='input-grid grid-item'>
                                                        <FormFieldWapper>
                                                            <FormField name={fieldName} meta={meta} formInstance={formInstance} />
                                                        </FormFieldWapper>
                                                    </Grid>
                                                )
                                            }
                                        }

                                    })}
                                </>
                            </Grid>
                            {sectionName === 'exceptionMode' && pageLabels?.buttons?.logTicketLink && <>
                                <LogATicketWrapper>{dynamicLabels.newExceptionRequired}
                                    <a onClick={() => { sendGA('All Exceptions', `Click - Log a Ticket`); checkAuthentication()}}> {dynamicLabels.logATicket}</a>
                                </LogATicketWrapper>
                            </>}
                        </FormContainer>
                    ))}
                <Grid container spacing='15px'>
                    <AddFormButtonContainer item xs={6} sm={6} md={6}>
                        <IconButton id={`AddExceptionForm--actionBar--${isFormEditable ? dynamicLabels.update : dynamicLabels.save}`} primary iconVariant="icomoon-save" disabled={isFormEditable && (!formInstance.formState.isDirty && !isEventTouched)} onClick={handleSubmit((data) => isFormEditable ? updateForm(data) : saveForm(data))}>{isFormEditable ? dynamicLabels.update : dynamicLabels.save}</IconButton>
                        <IconButton id="AddExceptionForm--actionBar--Cancel" iconVariant="cancel-button" onClick={() => resetForm()}>{dynamicLabels.cancel}</IconButton>
                    </AddFormButtonContainer>
                </Grid>
                <EventModal isModalOpen={isModalOpen} setModalOpen={setModalOpen} modalWidth="600px" eventCode={eventCode} setEventCode={setEventCode} handleEventModal={handleEventModal} />
            </>
    )
}

export default AddExceptionForm;