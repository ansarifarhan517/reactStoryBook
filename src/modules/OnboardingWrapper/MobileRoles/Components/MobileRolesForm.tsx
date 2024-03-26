import React, { Dispatch, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SectionHeader, Grid, Box, IconButton, useToast } from "ui-library";
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from "react-router-dom";
import FormLoader from "../../../../utils/components/FormLoader";
import FormField from "../../../../utils/components/Form/FormField";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { MobileRolesFormContainer, SectionHeaderContainer, FormFieldWapper, FormButtonContainer } from "../MobileRolesStyledComponents";
import { IMobileRolesActions } from "../MobileRoles.actions";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import axios from '../../../../utils/axios';
import apiMappings from '../../../../utils/apiMapping';
import { ILogiAPIResponse } from '../../../../utils/api.interfaces';
import { IAccessProfileList, ICreatePayload, IFormInputs, IMobileRolesRouteParams } from "../MobileRoles.models";
import { tGlobalPopupAction } from "../../../common/GlobalPopup/GlobalPopup.reducer";
import { sendGA } from "../../../../utils/ga";

const MobileRolesForm = () => {
    /** General Hooks */
    const toast = useToast();
    const history = useHistory();
    const loaderRef = React.useRef<HTMLDivElement | null>(null);
    const formInstance = useForm<Record<string, any>>({ mode: 'all', shouldUnregister: false });
    const { handleSubmit, setValue } = formInstance;
    const dispatch = useDispatch<Dispatch<IMobileRolesActions>>();
    const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>();
    
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.mobileRoles);
    
    const structure = useTypedSelector((state) => state.settingScreen.mobileRoles.form.structure);
    const isStructureLoading = useTypedSelector((state) => state.settingScreen.mobileRoles.form.loading);
    
    const isEditMode = useTypedSelector((state) => state.settingScreen.mobileRoles.form.isEditMode)
    const mobileRole = useTypedSelector((state) => state.settingScreen.mobileRoles.mobileRole)
    
    const accessProfiles = useTypedSelector((state) => state.settingScreen.mobileRoles.accessProfiles)
    
    const [isButtonDisabled, setButtonDisabled] = useState<boolean>(false);
    
    const sectionKeys = Object.keys(structure);
    
    const { orgRoleId } = useParams<IMobileRolesRouteParams>();

    useEffect(() => {
        dispatch({ type: '@@mobileRoles/FETCH_MOBILE_ROLE_FORM_STRUCTURE' });
    }, []);

    useEffect(() => {
        if (isEditMode && !accessProfiles.length) {
            dispatch({ type: '@@mobileRoles/FETCH_ACCESS_PROFILES' })
        } else if (isEditMode && accessProfiles.length > 0) {
            const { orgRoleName, orgRoleDescription, orgRoleAccessProfile } = mobileRole
            const orgRoleAccessProfileObj = orgRoleAccessProfile[0];
            const accessProfile = accessProfiles.find((accessProfileObj: IAccessProfileList) => accessProfileObj?.accessProfileId === orgRoleAccessProfileObj?.accessProfileId)
            setValue('orgRoleName', orgRoleName)
            setValue('orgRoleDescription', orgRoleDescription)
            if (accessProfile && Object.keys(accessProfile).length > 0) {
                setValue('accessProfileIds', { name: accessProfile?.accessprofileName, id: accessProfile?.accessProfileId })
            }
        }
    }, [isEditMode, mobileRole, accessProfiles])

    const createMobileRole = async (payload: ICreatePayload) => {
        setButtonDisabled(true);
        sendGA('Event New','Mobile Roles Save Add Form')
        
        try {
            const { data } = await axios.post<ILogiAPIResponse<ICreatePayload>>(apiMappings.settingScreen.mobileRoles.form.create, payload);
            if (data.hasError) {
                toast.add(data.message, 'warning', false);
                setButtonDisabled(false)
            } else {
                toast.add(dynamicLabels.mobileRoleCreatedSuccess ? dynamicLabels.mobileRoleCreatedSuccess : data.message!=null?data.message:'Role created successfully.', 'success', false);
                dispatch({ type: "@@mobileRoles/SET_VIEW_TYPE", payload: 'list-view' });
                history.push({pathname: '/'});
            }
        }
        catch (error) {
            toast.add(dynamicLabels.somethingWendWrong, 'success', false);
            console.log(error);
        }
    }

    const updateMobileRole = async (payload: ICreatePayload) => {
        setButtonDisabled(true);
        sendGA('Event New','Mobile Roles Save Add Form')

        try {
            const { data } = await axios.put<ILogiAPIResponse<ICreatePayload>>(apiMappings.settingScreen.mobileRoles.form.update, payload);
            if (data.hasError) {
                toast.add(data.message, 'warning', false);
                setButtonDisabled(false)
            } else {
                
                toast.add(dynamicLabels.mobileRoleUpdatedSuccess ? dynamicLabels.mobileRoleUpdatedSuccess : data.message!=null?data.message:'Role updated successfully.' , 'success', false);
                dispatch({ type: "@@mobileRoles/SET_VIEW_TYPE", payload: 'list-view' });
                dispatch({ type: "@@mobileRoles/SET_EDIT_MODE", payload: false });
                dispatch({ type: "@@mobileRoles/RESET_MOBILE_ROLE_DATA" });
                history.push({pathname: '/'});
            }
        }
        catch (error) {
            toast.add(dynamicLabels.somethingWendWrong, 'success', false);
            console.log(error);
        }
    }

    const onSubmit = async (formInputs: IFormInputs) => {       

        if (isEditMode) {
       
            const payload = {
                orgRoleId: Number(orgRoleId),
                orgRoleName: formInputs?.orgRoleName,
                orgRoleDescription: formInputs?.orgRoleDescription,
                orgRoleLandingPage: null,
                persona: "MOBILE",
                activeFl: mobileRole?.activeFl,
                accessProfileIds: [formInputs?.accessProfileIds?.accessProfileId || formInputs?.accessProfileIds?.id]
            }
            updateMobileRole(payload)
        } else {
            const payload = {
                orgRoleName: formInputs?.orgRoleName,
                orgRoleDescription: formInputs?.orgRoleDescription,
                orgRoleLandingPage: null,
                persona: "MOBILE",
                accessProfileIds: [formInputs?.accessProfileIds?.accessProfileId]
            }
            createMobileRole(payload);
        }
    }

    const handleCancel = React.useCallback(() => {
        sendGA('Event New','Mobile Roles Cancel Add Form')
        if (!formInstance.formState.isDirty) {
            dispatch({ type: "@@mobileRoles/SET_VIEW_TYPE", payload: 'list-view' });
            dispatch({ type: "@@mobileRoles/SET_EDIT_MODE", payload: false });
            dispatch({ type: "@@mobileRoles/RESET_MOBILE_ROLE_DATA" });
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
                                dispatch({ type: "@@mobileRoles/SET_VIEW_TYPE", payload: 'list-view' });
                                dispatch({ type: "@@mobileRoles/SET_EDIT_MODE", payload: false });
                                dispatch({ type: "@@mobileRoles/RESET_MOBILE_ROLE_DATA" });
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
    },[formInstance.formState.isDirty, history]);
    return (
        <>
            {(isStructureLoading || !sectionKeys.length) || (isEditMode && !accessProfiles.length) ? (
                <div ref={loaderRef}>
                    <FormLoader />
                </div>
            ) : <MobileRolesFormContainer>
                {sectionKeys.length > 0 &&
                    sectionKeys.map((sectionName) => (
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
                <FormButtonContainer>
                    <Box horizontalSpacing='15px' display='flex' mt='30px'>
                        <IconButton id={`DaRolesForm-actionBar-${isEditMode ? dynamicLabels.update : dynamicLabels.save}`} disabled={isButtonDisabled} iconVariant='icomoon-save' style={{ padding: '0px 15px' }} onClick={handleSubmit((data) => onSubmit(data))} primary>{isEditMode ? dynamicLabels.update : dynamicLabels.save}</IconButton>
                        <IconButton id="DaRolesForm-actionBar-cancel" iconVariant='icomoon-close' style={{ padding: '0px 15px' }} onClick={() => handleCancel()}>{dynamicLabels.cancel}</IconButton>
                    </Box>
                </FormButtonContainer>

            </MobileRolesFormContainer>
            }
        </>
    )
}
export default MobileRolesForm;