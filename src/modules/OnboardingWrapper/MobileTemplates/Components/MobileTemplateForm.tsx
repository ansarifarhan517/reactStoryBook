import React, { Dispatch, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SectionHeader, Grid, Box, IconButton, useToast } from "ui-library";
import { useForm } from 'react-hook-form';
import FormLoader from "../../../../utils/components/FormLoader";
import { useHistory, useParams } from "react-router-dom";
import FormField from "../../../../utils/components/Form/FormField";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { MobileTemplateFormContainer, SectionHeaderContainer, FormFieldWapper, FormButtonContainer } from "../MobileTemplateStyledComponents";
import { IMobileTemplateActions } from "../MobileTemplate.actions";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import { tGlobalPopupAction } from "../../../common/GlobalPopup/GlobalPopup.reducer";
import MobileTemplateAccordion from "./SubComponents/MobileTemplateAccordion";
import { ICreatePayload, IDynamicCardTileList, IFormInputs, IMobileTemplateAccesses, IMobileTemplateAccessSections, IMobileTemplateRouteParams } from "../MobileTemplate.models";
import axios from '../../../../utils/axios';
import apiMappings from '../../../../utils/apiMapping';
import { ILogiAPIResponse } from "../../../../utils/api.interfaces";
import { sendGA } from '../../../../utils/ga';
import { onlyUnique,removeEmptyFields } from "../utils";

const MobileTemplateForm = () => {
    /** General Hooks */
    const history = useHistory(); 
    const { accessProfileId } = useParams<IMobileTemplateRouteParams>();
    const toast = useToast();
    const loaderRef = React.useRef<HTMLDivElement | null>(null);
    const formInstance = useForm<Record<string, any>>({ mode: 'all', shouldUnregister: false });

    const { handleSubmit, watch, setValue } = formInstance;

    const dispatch = useDispatch<Dispatch<IMobileTemplateActions>>();
    const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>();

    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.mobileTemplates);
    const structure = useTypedSelector((state) => state.settingScreen.mobileTemplates.form.structure);
    const isStructureLoading = useTypedSelector((state) => state.settingScreen.mobileRoles.form.loading);
    const sectionKeys = Object.keys(structure);
    const accordionStructure = useTypedSelector((state) => state.settingScreen.mobileTemplates.form.accordionStructure.accessModules)

    const isEditMode = useTypedSelector((state) => state.settingScreen.mobileTemplates.form.isEditMode);

    const mobileTemplate = useTypedSelector((state) => state.settingScreen.mobileTemplates.mobileTemplate);

    const isOrderConfigured = useTypedSelector((state) => state.settingScreen.mobileTemplates.isOrderConfigured);

    const mobileDynamicStructure = useTypedSelector((state) => state.settingScreen.mobileTemplates.dynamicOrder.mobileDynamicStructure);
                                                                                                                    
    const isOrderConfiguring = useTypedSelector((state) => state.settingScreen.mobileTemplates.isOrderConfiguring);

    const formValues = useTypedSelector((state) => state.settingScreen.mobileTemplates.form.formValues);
    const accessIds = useTypedSelector((state) => state.settingScreen.mobileTemplates.form.accessProfileIds);

    /* internal state */
    const [accessReferenceIds, setAccessReferenceIds] = useState<Array<string | undefined>>([]);
    const [isButtonDisabled, setButtonDisabled] = useState<boolean>(false);

    const [negativeCashValue, setNegativeCashValue] = useState(0);
    const [negativeInput, setNegativeInput] = useState(false);

    const [cashTransaction ,setCashTransaction] = useState(false)
    const [negativeCashTransaction, setNegativeCashTransaction] = useState(false)

    const sections = accordionStructure[0]?.accessSections;

    useEffect(() => {
        dispatch({ type: '@@mobileTemplates/FETCH_MOBILE_TEMPLATES_FORM_STRUCTURE' });
        dispatch({ type: '@@mobileTemplates/FETCH_MOBILE_TEMPLATE_ACCORDION_STRUCTURE' })
    }, []);

    useEffect(() => {
        if (isEditMode && Object.keys(mobileTemplate).length > 0) {
            const { accessprofileName, accessprofileDesc, accessReferenceIds } = mobileTemplate;
            setValue('accessprofileName', accessprofileName);
            setValue('accessprofileDesc', accessprofileDesc);
            if(!isOrderConfiguring) {
                setAccessReferenceIds(accessReferenceIds);
            } else {
                setAccessReferenceIds(accessIds);
            }
            // set the values of Negative Cash Transaction
            
            sections?.forEach((section)=> {
                if(section.sectionName === "Wallet"){
                    section.accessSections?.forEach((subSection)=>{
                        if(subSection.sectionName == "CASH_TRANSACTION"){
                            if(mobileTemplate.accessReferenceIds.includes(subSection.accessRefId )){
                                setCashTransaction(true);
                            }
                        }
                    })
                }
            })
            if(mobileTemplate.additionalDetails.allowDaNegativeAmount){
                setNegativeCashValue(mobileTemplate.additionalDetails.daNegativeAmount);
                setNegativeCashTransaction(true);
            }
            else{
                setNegativeCashValue(0);
                setNegativeCashTransaction(false);
            }
        }
    },[isEditMode, mobileTemplate, isOrderConfiguring,sections]);

    const handleToggleChange = (accessReferenceId: string, type: string, accessReferenceIds: Array<string | undefined>, sectionName?: string, parentSectionName?: string, accessName?: string, subAccessName?:string) => {
        const sections = accordionStructure[0].accessSections
        const section = sections?.find((section: IMobileTemplateAccessSections) => section.sectionName === sectionName);
        const accessSection = section?.accessSections?.find((section: IMobileTemplateAccessSections) => section?.accessRefId === accessReferenceId);
        const accessesIds = accessSection?.accesses?.map((access: IMobileTemplateAccesses) => access.accessRefId);
        const subAccesses = accessSection?.accesses?.filter((access: IMobileTemplateAccesses) => Object.keys(access).includes('accesses'));
        const subAccessList = subAccesses?.map((access: IMobileTemplateAccesses) => access.accesses).flat();
        const subAccessIds = subAccessList?.map((access: IMobileTemplateAccesses | undefined) => access?.accessRefId);
  
        if (type === 'screen') {
            if (accessReferenceIds.includes(accessReferenceId)) {
                let accessReferenceIdList: Array<string | undefined> = [];
                if (accessesIds && accessesIds?.length > 0) {
                    accessReferenceIdList = accessReferenceIds.filter((accessId: string | undefined) => !accessesIds.includes(String(accessId)));
                    if (subAccessIds && subAccessIds?.length > 0) {
                        accessReferenceIdList = accessReferenceIds.filter((x) => !subAccessIds.includes(x)).filter((accessId: string | undefined) => !accessesIds.includes(String(accessId)));
                    } else {
                        accessReferenceIdList = accessReferenceIds.filter((accessId: string | undefined) => !accessesIds.includes(String(accessId))).filter((accessId: string | undefined) => accessId !== accessReferenceId);
                    }
                } else {
                    accessReferenceIdList = accessReferenceIds.filter((accessId: string | undefined) => accessId !== accessReferenceId);
                }
                if(accessName === "NEGATIVE_CASH_TRANSACTION" && !negativeCashTransaction){
                    accessReferenceIdList = [...accessReferenceIds].concat(accessReferenceId)
                }
                const uniqueIds = onlyUnique(accessReferenceIdList);
                setAccessReferenceIds(uniqueIds);

            } else {
                let accessReferenceIdList = [];
                if (accessesIds && accessesIds?.length > 0) {
                    if (subAccessIds && subAccessIds?.length > 0) {
                        accessReferenceIdList = [...accessReferenceIds, ...accessesIds, ...subAccessIds].concat(accessReferenceId);
                    } else {
                        accessReferenceIdList = [...accessReferenceIds, ...accessesIds].concat(accessReferenceId)
                    }
                } else {
                    accessReferenceIdList = [...accessReferenceIds].concat(accessReferenceId);
                }
                
                const uniqueIds = onlyUnique(accessReferenceIdList);
                setAccessReferenceIds(uniqueIds);
            }

        } else if (type === 'setting') {
            if (accessReferenceIds.includes(accessReferenceId)) {
                let accessReferenceIdList: Array<string | undefined> = [];
                const parentSection = section?.accessSections?.find((section: IMobileTemplateAccessSections) => section?.sectionName === parentSectionName);
                const currentAccess = parentSection?.accesses?.find((access: IMobileTemplateAccesses) => access.accessRefId === accessReferenceId);
                if (parentSection) {
                    if (accessReferenceIds.includes(parentSection?.accessRefId) || parentSection?.accessMode === 'GROUP' ) {
                        if (currentAccess && currentAccess?.accesses && currentAccess?.accesses?.length > 0) {
                            const subAccessIds: Array<string | undefined> = currentAccess?.accesses?.map((access: IMobileTemplateAccesses) => access.accessRefId)
                            accessReferenceIdList = accessReferenceIds.filter((x) => !subAccessIds.includes(x)).filter((accessId) => accessId !== accessReferenceId)
                            accessReferenceIdList.concat(parentSection?.accessRefId);
                        } else {
                            accessReferenceIdList = accessReferenceIds.filter((accessId) => accessId !== accessReferenceId);
                        }
                    } else {
                        return;
                    }
                }
                const uniqueIds = onlyUnique(accessReferenceIdList);
                setAccessReferenceIds(uniqueIds);
            } else {
                let accessReferenceIdList: Array<string | undefined> = [];
                const parentSection = section?.accessSections?.find((section: IMobileTemplateAccessSections) => section?.sectionName === parentSectionName);
                const currentAccess = parentSection?.accesses?.find((access: IMobileTemplateAccesses) => access.accessRefId === accessReferenceId);
                if (parentSection) {
                    if (currentAccess?.accesses && currentAccess?.accesses?.length > 0) {
                        const subAccessIds = currentAccess?.accesses?.map((access: IMobileTemplateAccesses) => access.accessRefId)
                        if(currentAccess?.accessName === "CARD_AUTO_PAYMENT") {
                            accessReferenceIdList = [...accessReferenceIds, subAccessIds[0], parentSection?.accessRefId, accessReferenceId]
                        } else {
                            accessReferenceIdList = [...accessReferenceIds, ...subAccessIds, parentSection?.accessRefId, accessReferenceId]
                        }
                       
                    } else {
                        if (currentAccess?.accessName === 'pickup_checkin_branch_otp' || currentAccess?.accessName === 'pickup_checkout_branch_otp') {
                            if (currentAccess?.accessName === 'pickup_checkin_branch_otp') {
                                const checkout_refId = parentSection.accesses?.filter((checkoutAccess: IMobileTemplateAccesses) => checkoutAccess.accessName === 'pickup_checkout_branch_otp');
                                if (checkout_refId?.length && accessReferenceIds.includes(checkout_refId[0].accessRefId)) {
                                    const pickup_checkout_index = accessReferenceIds.findIndex(refId => refId === checkout_refId[0].accessRefId);
                                    if (pickup_checkout_index > -1) {
                                        accessReferenceIds.splice(pickup_checkout_index, 1);
                                    }
                                }
                            } else if (currentAccess?.accessName === 'pickup_checkout_branch_otp') {
                                const checkin_refId = parentSection.accesses?.filter((checkoutAccess: IMobileTemplateAccesses) => checkoutAccess.accessName === 'pickup_checkin_branch_otp')
                                if (checkin_refId?.length && accessReferenceIds.includes(checkin_refId[0].accessRefId)) {
                                    const pickup_checkin_index = accessReferenceIds.findIndex(refId => refId === checkin_refId[0].accessRefId);
                                    if (pickup_checkin_index > -1) {
                                        accessReferenceIds.splice(pickup_checkin_index, 1);
                                    }
                                }
                            }
                        }

                        if (currentAccess?.accessName === 'deliver_checkin_branch_otp' || currentAccess?.accessName === 'deliver_checkout_branch_otp') {
                            if (currentAccess?.accessName === 'deliver_checkin_branch_otp') {
                                const checkout_refId = parentSection.accesses?.filter((checkoutAccess: IMobileTemplateAccesses) => checkoutAccess.accessName === 'deliver_checkout_branch_otp');
                                if (checkout_refId?.length && accessReferenceIds.includes(checkout_refId[0].accessRefId)) {
                                    const deliver_checkout_index = accessReferenceIds.findIndex(refId => refId === checkout_refId[0].accessRefId);
                                    if (deliver_checkout_index > -1) {
                                        accessReferenceIds.splice(deliver_checkout_index, 1);
                                    }
                                }
                            } else if (currentAccess?.accessName === 'deliver_checkout_branch_otp') {
                                const checkin_refId = parentSection.accesses?.filter((checkoutAccess: IMobileTemplateAccesses) => checkoutAccess.accessName === 'deliver_checkin_branch_otp')
                                if (checkin_refId?.length && accessReferenceIds.includes(checkin_refId[0].accessRefId)) {
                                    const deliver_checkin_index = accessReferenceIds.findIndex(refId => refId === checkin_refId[0].accessRefId);
                                    if (deliver_checkin_index > -1) {
                                        accessReferenceIds.splice(deliver_checkin_index, 1);
                                    }
                                }
                            }
                        }

                        if (currentAccess?.accessName === 'OTP_AT_PICKUP_CHECKIN' || currentAccess?.accessName === 'OTP_AT_PICKUP_CHECKOUT') {
                            if (currentAccess?.accessName === 'OTP_AT_PICKUP_CHECKIN') {
                                const checkout_refId = parentSection.accesses?.filter((checkoutAccess: IMobileTemplateAccesses) => checkoutAccess.accessName === 'OTP_AT_PICKUP_CHECKOUT');
                                if (checkout_refId?.length && accessReferenceIds.includes(checkout_refId[0].accessRefId)) {
                                    const otp_pickup_checkout_index = accessReferenceIds.findIndex(refId => refId === checkout_refId[0].accessRefId);
                                    if (otp_pickup_checkout_index > -1) {
                                        accessReferenceIds.splice(otp_pickup_checkout_index, 1);
                                    }
                                }
                            } else if (currentAccess?.accessName === 'OTP_AT_PICKUP_CHECKOUT') {
                                const checkin_refId = parentSection.accesses?.filter((checkoutAccess: IMobileTemplateAccesses) => checkoutAccess.accessName === 'OTP_AT_PICKUP_CHECKIN')
                                if (checkin_refId?.length && accessReferenceIds.includes(checkin_refId[0].accessRefId)) {
                                    const otp_pickup_checkin_index = accessReferenceIds.findIndex(refId => refId === checkin_refId[0].accessRefId);
                                    if (otp_pickup_checkin_index > -1) {
                                        accessReferenceIds.splice(otp_pickup_checkin_index, 1);
                                    }
                                }
                            }
                        }

                        if (currentAccess?.accessName === 'OTP_AT_DELIVER_CHECKIN' || currentAccess?.accessName === 'OTP_AT_DELIVER_CHECKOUT') {
                            if (currentAccess?.accessName === 'OTP_AT_DELIVER_CHECKIN') {
                                const checkout_refId = parentSection.accesses?.filter((checkoutAccess: IMobileTemplateAccesses) => checkoutAccess.accessName === 'OTP_AT_DELIVER_CHECKOUT');
                                if (checkout_refId?.length && accessReferenceIds.includes(checkout_refId[0].accessRefId)) {
                                    const otp_deliver_checkout_index = accessReferenceIds.findIndex(refId => refId === checkout_refId[0].accessRefId);
                                    if (otp_deliver_checkout_index > -1) {
                                        accessReferenceIds.splice(otp_deliver_checkout_index, 1);
                                    }
                                }
                            } else if (currentAccess?.accessName === 'OTP_AT_DELIVER_CHECKOUT') {
                                const checkin_refId = parentSection.accesses?.filter((checkoutAccess: IMobileTemplateAccesses) => checkoutAccess.accessName === 'OTP_AT_DELIVER_CHECKIN')
                                if (checkin_refId?.length && accessReferenceIds.includes(checkin_refId[0].accessRefId)) {
                                    const otp_deliver_checkin_index = accessReferenceIds.findIndex(refId => refId === checkin_refId[0].accessRefId);
                                    if (otp_deliver_checkin_index > -1) {
                                        accessReferenceIds.splice(otp_deliver_checkin_index, 1);
                                    }
                                }
                            }
                        }

                        if (currentAccess?.accessName === 'MSwipe Payment' || currentAccess?.accessName === 'Ezetap Payment' || currentAccess?.accessName === 'CIMB Payment') {
                            const names = ['MSwipe Payment','Ezetap Payment','CIMB Payment']
                            
                            const otherOptionsRefI = parentSection.accesses?.filter((checkoutAccess: IMobileTemplateAccesses) => checkoutAccess.accessName !== currentAccess?.accessName && names.includes(currentAccess?.accessName) );

                            console.log(otherOptionsRefI)

                        
                        }

                        accessReferenceIdList = [...accessReferenceIds, parentSection?.accessRefId, accessReferenceId];
                    }
                }
                const uniqueIds = onlyUnique(accessReferenceIdList);

                setAccessReferenceIds(uniqueIds);
            }
        } else if (type === 'action') {
            let accessReferenceIdList: Array<string | undefined> = [];

            const currentSection = section?.accessSections?.find((section: IMobileTemplateAccessSections) => section?.sectionName === parentSectionName);
            const parentSetting = currentSection?.accesses?.find((access: IMobileTemplateAccesses) => access.accessName === accessName);
            
            const otherRefIds = parentSetting?.accesses?.filter((access:IMobileTemplateAccesses) => {
                return access?.accessName !== subAccessName
            }).map((obj) => obj?.accessRefId)

           if(subAccessName === 'MSwipe Payment' || subAccessName === 'Ezetap Payment' || subAccessName === 'CIMB Payment') {
                otherRefIds?.forEach((currentRefId:any) => {
                    if (accessReferenceIds.includes(currentRefId)) {
                        // remove the accessId 
                        const indexTobeRemoved = accessReferenceIds.findIndex(refId => refId === currentRefId);
                        if (indexTobeRemoved > -1) {
                            accessReferenceIds.splice(indexTobeRemoved, 1);
                        }
                        // accessReferenceIdList = accessReferenceIds.filter((accessId: string | undefined) => accessId !== accessReferenceId);
                    }
                })
           }
            

            if (accessReferenceIds.includes(accessReferenceId)) {
                accessReferenceIdList = accessReferenceIds.filter((accessId: string | undefined) => accessId !== accessReferenceId);
            } else {
                
                if (accessReferenceIds.includes(currentSection?.accessRefId)) {
                     // if parent section is not turned on then just turn on the child section
                    if (accessReferenceIds.includes(parentSetting?.accessRefId)) {
                        accessReferenceIdList = [...accessReferenceIds, accessReferenceId];
                    } else {
                        accessReferenceIdList = [...accessReferenceIds, parentSetting?.accessRefId, accessReferenceId];
                    }
                } else {
                    // if parent section is not turned on then turn it on
                    if (accessReferenceIds.includes(parentSetting?.accessRefId)) {
                        accessReferenceIdList = [...accessReferenceIds, currentSection?.accessRefId, accessReferenceId];
                    } else {
                        accessReferenceIdList = [...accessReferenceIds, parentSetting?.accessRefId, currentSection?.accessRefId, accessReferenceId];
                    }
                }
            }
            const uniqueIds = onlyUnique(accessReferenceIdList);
            
            setAccessReferenceIds(uniqueIds);
        }
    }

    const handleCancel = React.useCallback(() => {
        sendGA('Event New','Mobile Templates Add Form - Cancel')

        if (!formInstance.formState.isDirty) {
            dispatch({ type: "@@mobileTemplates/SET_VIEW_TYPE", payload: 'list-view' });
            dispatch({ type: "@@mobileTemplates/SET_EDIT_MODE", payload: false });
            dispatch({ type: "@@mobileTemplates/RESET_MOBILE_TEMPLATE_DATA" });
            history.push('/');

        } else {
            globalPopupDispatch({
                type: '@@globalPopup/SET_PROPS',
                payload: {
                    isOpen: true, title: dynamicLabels.navigationConfirmation,
                    content: dynamicLabels.dataLostWarningMsg,
                    footer: (<>
                        <IconButton
                            iconVariant='icomoon-tick-circled' primary onClick={() => {
                                globalPopupDispatch({
                                    type: '@@globalPopup/CLOSE_POPUP',
                                });
                                dispatch({ type: "@@mobileTemplates/SET_VIEW_TYPE", payload: 'list-view' });
                                dispatch({ type: "@@mobileTemplates/SET_EDIT_MODE", payload: false });
                                dispatch({ type: "@@mobileTemplates/RESET_MOBILE_TEMPLATE_DATA" });
                                dispatch({ type: '@@mobileTemplates/SET_ORDER_CONFIGURING', payload: false });
                                dispatch({ type: "@@mobileTemplates/RESET_DYNAMIC_MOBILE_STRUCTURE" });
                                
                                history.push('/');
                            }}> {dynamicLabels.ok}
                        </IconButton>
                        <IconButton iconVariant='icomoon-close' onClick={() =>
                            globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })
                        }> {dynamicLabels.cancel}
                        </IconButton>
                    </>
                    ),
                },
            });
        }
    },[formInstance.formState.isDirty, history])

    const createMobileTemplate = async (payload: ICreatePayload) => {
        setButtonDisabled(true);        
        sendGA('Event New','Mobile Templates Add Form - Save')
        try {
            const { data } = await axios.post<ILogiAPIResponse<ICreatePayload>>(apiMappings.settingScreen.mobileTemplates.form.create, payload);
            if (data.hasError) {
                toast.add(data.message, 'warning', false);
                setButtonDisabled(false);
            } else {
                toast.add(dynamicLabels.mobileTemplateCreatedSuccess ? dynamicLabels.mobileTemplateCreatedSuccess : data.message!=null?data.message:'Access Profile created successfully.', 'success', false);
                dispatch({ type: "@@mobileTemplates/SET_VIEW_TYPE", payload: 'list-view' });
                dispatch({ type: '@@mobileTemplates/SET_ORDER_CONFIGURING', payload: false });
                dispatch({ type: "@@mobileTemplates/RESET_DYNAMIC_MOBILE_STRUCTURE" });
                dispatch({ type: '@@mobileTemplates/RESET_MOBILE_TEMPLATE_DATA'})
                history.push('/');
            }
        }
        catch (error) {
            toast.add(dynamicLabels.somethingWendWrong, 'success', false);
            console.log(error);
        }
    }

    const updateMobileTemplate = async (payload: ICreatePayload) => {
        setButtonDisabled(true);
        sendGA('Event New','Mobile Templates Add Form - Save')
        try {
            const { data } = await axios.put<ILogiAPIResponse<ICreatePayload>>(apiMappings.settingScreen.mobileTemplates.form.update, payload);
            if (data.hasError) {
                toast.add(data.message, 'warning', false);
                setButtonDisabled(false);
            } else {
                toast.add(dynamicLabels.mobileTemplateUpdatedSuccess ? dynamicLabels.mobileTemplateUpdatedSuccess : data.message!=null?data.message:'Access Profile updated successfully.' , 'success', false);
                dispatch({ type: "@@mobileTemplates/SET_VIEW_TYPE", payload: 'list-view' });
                dispatch({ type: "@@mobileTemplates/SET_EDIT_MODE", payload: false });
                dispatch({ type: '@@mobileTemplates/SET_ORDER_CONFIGURING', payload: false });
                dispatch({ type: "@@mobileTemplates/RESET_MOBILE_TEMPLATE_DATA" });
                dispatch({ type: "@@mobileTemplates/RESET_DYNAMIC_MOBILE_STRUCTURE" });
                history.push('/');
            }
        }
        catch (error) {
            toast.add(dynamicLabels.somethingWendWrong, 'success', false);
            console.log(error);
        }
    }

    const onSubmit = async (formInputs: IFormInputs) => {
            const negativeAmount = negativeCashValue.toString();
            if (!negativeInput || (negativeInput && negativeAmount.length !== 0) )
            {
                const negativeAmountSend = !negativeInput ? '0' : negativeAmount;
                mobileTemplate.additionalDetails.daNegativeAmount = parseFloat(negativeAmountSend);
                mobileTemplate.additionalDetails.allowDaNegativeAmount = negativeInput;
                if (isEditMode) {
                    const mobileStructure = mobileDynamicStructure.map((mobileStructure: IDynamicCardTileList) => {
                        return {
                            ...mobileStructure, structure: {columns: removeEmptyFields(mobileStructure)}
                        }
                    })
        
                const accessreferenceIdList = accessReferenceIds.length > 0 ? accessReferenceIds.filter((accessid:string | undefined) => accessid) : [];
                
                    const payload = {
                        accessProfileId: Number(accessProfileId),
                        accessprofileName: formInputs?.accessprofileName,
                        accessprofileDesc: formInputs?.accessprofileDesc,
                        accessProfileType: "MOBILE",
                        accessReferenceIds: accessreferenceIdList,
                        mobileDynamicStructure: isOrderConfigured ? mobileStructure : [],
                        additionalDetails: mobileTemplate.additionalDetails,
                    }
                    updateMobileTemplate(payload)
                } else {
        
                    const mobileStructure = mobileDynamicStructure.map((mobileStructure: IDynamicCardTileList) => {
                        return {
                            ...mobileStructure, structure: {columns: removeEmptyFields(mobileStructure)}
                        }
                    })
                const payload = {
                    accessprofileName: formInputs?.accessprofileName,
                    accessprofileDesc: formInputs?.accessprofileDesc,
                    accessProfileType: "MOBILE",
                    accessReferenceIds: accessReferenceIds,
                    mobileDynamicStructure: isOrderConfigured ? mobileStructure : [],
                    additionalDetails: mobileTemplate.additionalDetails,
                }
                createMobileTemplate(payload);
            }
        }
        else
        {
            toast.add(dynamicLabels.NEGATIVE_CASH_ERROR_MSG,'warning',false);
        }
    }

    const saveFormValues = (tripStartDetails = null) => {
        const formValues = {
            accessprofileName: watch('accessprofileName'),
            accessprofileDesc: watch('accessprofileDesc'),
        }

        dispatch({ type: '@@mobileTemplates/SET_FORM_VALUES', payload: formValues});
        dispatch({ type: '@@mobileTemplates/SET_ACCESS_IDS', payload: accessReferenceIds});
        tripStartDetails && dispatch({ type: '@@mobileTemplates/SET_TRIP_START_FORM_VALUES', payload: { tripStartDetails, accessReferenceIds }})
    }

    useEffect(() => {   
        if(isOrderConfiguring && !isEditMode) {

            const {accessprofileName, accessprofileDesc} = formValues;

            setValue('accessprofileName', accessprofileName);
            setValue('accessprofileDesc', accessprofileDesc);
            setAccessReferenceIds(accessIds);

            dispatch({ type: '@@mobileTemplates/SET_FORM_VALUES', payload: {}});
            dispatch({ type: '@@mobileTemplates/SET_ACCESS_IDS', payload: []});
            dispatch({ type: '@@mobileTemplates/SET_ORDER_CONFIGURING', payload: false });

        }
    },[isOrderConfiguring, isEditMode])

    return (
        <>
            {(isStructureLoading || !sectionKeys.length) ?
                <div ref={loaderRef}>
                    <FormLoader />
                </div>
                : <MobileTemplateFormContainer>
                    {sectionKeys.length > 0 &&
                        sectionKeys.map((sectionName) => (
                            sectionName === 'Mobile Template Details' &&
                            <div key={sectionName}>
                                <SectionHeaderContainer><SectionHeader headerTitle={dynamicLabels[sectionName]} /></SectionHeaderContainer>
                                <Grid container spacing='15px' style={{ marginBottom: '15px' }}>
                                    {Object.keys(structure[sectionName]).map((fieldName) => {
                                        const meta = structure[sectionName][fieldName];
                                        meta.multipleFiles = false;
                                        const { permission } = meta;

                                        if (!permission) {
                                            return undefined;
                                        }
                                        return (
                                            <Grid item key={fieldName} xs={12} sm={6} md={3} className='grid-item'>
                                                <FormFieldWapper>
                                                    <FormField name={fieldName} meta={meta} formInstance={formInstance} />
                                                </FormFieldWapper>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </div>
                        ))}

                    <SectionHeaderContainer>
                        <SectionHeader headerTitle={dynamicLabels.mobileTemplateModules} />
                    </SectionHeaderContainer>

                    <MobileTemplateAccordion accessReferenceIds={accessReferenceIds} handleToggleChange={handleToggleChange} saveFormValues={saveFormValues} accessProfileId={accessProfileId} negativeCashValue={negativeCashValue} setNegativeCashValue = {(value) => setNegativeCashValue(value)} negativeInput={negativeInput} setNegativeInput = {(value) => setNegativeInput(value)} cashTransaction={cashTransaction} setCashTransaction = {(value) => setCashTransaction(value)} negativeCashTransaction={negativeCashTransaction} setNegativeCashTransaction={(value) => setNegativeCashTransaction(value)}/>

                    <FormButtonContainer>
                        <Box horizontalSpacing='15px' display='flex' mt='30px'>
                            <IconButton id={`mobileTemplateForm-actionBar-${isEditMode ? dynamicLabels.update : dynamicLabels.save}`} iconVariant='icomoon-save' style={{ padding: '0px 15px' }} disabled={isButtonDisabled} onClick={handleSubmit((data) => onSubmit(data))} primary>{isEditMode ? dynamicLabels.update : dynamicLabels.save}</IconButton>
                            <IconButton id="mobileTemplateForm-actionBar-cancel" iconVariant='icomoon-close' style={{ padding: '0px 15px' }} onClick={() => handleCancel()}>{dynamicLabels.cancel}</IconButton>
                        </Box>
                    </FormButtonContainer>
                </MobileTemplateFormContainer>
            }
        </>
    )
}

export default MobileTemplateForm;