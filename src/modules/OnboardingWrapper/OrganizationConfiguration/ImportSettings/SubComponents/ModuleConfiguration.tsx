import "../css/importSettings.css";
import React, { useEffect, Dispatch, useState } from 'react';
import { useDispatch } from "react-redux";
import { BreadCrumb, Box, IconButton, useToast, Grid } from 'ui-library';
import { useHistory } from 'react-router-dom';
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels';
import { tGlobalToastActions } from '../../../../common/GlobalToasts/globalToast.reducer';
import { useTypedSelector } from '../../../../../utils/redux/rootReducer';
import { useBreadCrumbs } from '../utils/ImportSettingsBreadcrumb.utils';
import { BoxContainer } from '../styles';
import { ImportSettingsActions } from "../ImportSettings.actions";
import AccordionComponent from "../CommonComponents/Accordion";
import { IMongoImportSettingsField } from "../ImportSettings.models";
import CTAModalComponent from "../CommonComponents/CTAModal";
import MultiSelectDropDown from "../CommonComponents/MultiSelectFormField";
import apiMappings from '../../../../../utils/apiMapping';

import { useForm } from "react-hook-form";
import { processValues } from "../helper/processValues";
import { checkValues } from "../helper/checkValues";
import axios from "../../../../../utils/axios";

const ModuleConfiguration = () => {
    /** General Hooks */
    const history = useHistory();
    const toast = useToast();
    const formInstance = useForm<Record<string, any>>({
        mode: "all",
        shouldUnregister: false,
        defaultValues: {}
    });

    const { getValues } = formInstance;
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.settings.importSettings);

    /** History State */
    let moduleKey = history.location.state ? (history.location.state as Object)["moduleKey"] : "TRIP_PLANNING";

    /** Redux Hooks */
    const dispatch = useDispatch<Dispatch<ImportSettingsActions>>();
    const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>();
    const { importFrom, importTo } = useTypedSelector((state) => state.settings.importSettings.clients);

    const structure = useTypedSelector(state => state.settings.importSettings.structure);

    /** state */
    const [currentRoute, setCurrentRoute] = useState({});
    const [openImportModal, setOpenImportModal] = useState(false);
    const [openCancelModal, setOpenCancelModal] = useState(false);
    const [accordionToggles, setAccordionToggles] = useState({});
    const [isOkButtonLoading, setIsOkButtonLoading] = useState(false);
    const [expanded, setExpanded] = React.useState('0');

    const { breadCrumbOptions, handleBreadCrumbClick } = useBreadCrumbs(currentRoute);

    // TODO: Remove it
    // useEffect(() => {
    //     dispatch({ type: "@@importSettings/FETCH_STRUCTURE" });
    // }, []);

    /** Navigation Helper Methods */

    /** useEffects */
    useEffect(() => {
        let moduleKey = history.location.state && (history.location.state as Object)["moduleKey"];
        let label = history.location.state && (history.location.state as Object)["label"];

        setCurrentRoute({ id: moduleKey, label, disabled: true });
    }, []);

    /** Helper Methods */
    let isValid = () => {
        let values = { ...getValues(), ...accordionToggles };
        let isChangedValues = checkValues(values);

        return isChangedValues;
    }

    const onImport = (e : any) => {
        e.preventDefault();
        let isChangedValues = isValid();
        if(isChangedValues) {
            setOpenImportModal(true);
        } else {
            /** TODO: */
            toast.add(dynamicLabels.NOTHING_TO_IMPORT_WARNING, 'warning', false);
        }
    }

    let handleBreadCrumbOptions = (id : string) => {
        let isChangedValues = isValid();  
        /** TODO : Change this true to isChangedValues after resolving e.preventDefault() bug */
        handleBreadCrumbClick(id, isChangedValues);
    }

    let onImportClickOk = async (e : any) => {
        e.preventDefault();
        let values = { ...getValues(), ...accordionToggles };
        let backendRequestObject = processValues(values);

        backendRequestObject = {
            ...backendRequestObject,
            fromClientId: importFrom,
            toClientId: importTo
        }
        // console.log("backendRequestObject: ", backendRequestObject);

        dispatch({ type: '@@importSettings/SET_LOADING', payload: true });
        setIsOkButtonLoading(true);
        try {
            const { data: { status, message } } = await axios.post<any>(`${apiMappings.importSettings.migrations[moduleKey]}`, backendRequestObject);

            if (status === 200) {
                dispatch({ type: '@@importSettings/SET_LOADING', payload: false })
                setIsOkButtonLoading(false);
                setOpenImportModal(false);
                toastDispatch({
                    type: '@@globalToast/add', payload: {
                        message: dynamicLabels.IMPORTED_SUCCESSFULLY,
                        icon: 'check-round'
                    }   
                });
                history.push("/");
        } else {
                dispatch({ type: '@@importSettings/SET_LOADING', payload: false });
                setIsOkButtonLoading(false);
                setOpenImportModal(false);
                toast.add(message || dynamicLabels.SOMETHING_WENT_WRONG_WARNING, 'warning', false);                
            }
        } catch (error : any) {
            dispatch({ type: '@@importSettings/SET_LOADING', payload: false });
            setIsOkButtonLoading(false);
            setOpenImportModal(false);
            toast.add(dynamicLabels.SOMETHING_WENT_WRONG_WARNING, 'warning', false);
        }
    }

    let onImportClickCancel = (e : any) => {
        e.preventDefault();
        setOpenImportModal(false);
    }

    let onCancel = (e : any) => {
        e.preventDefault();
        let values = { ...getValues(), ...accordionToggles };
        let isChangedValues = checkValues(values);
        if(isChangedValues) {
            setOpenCancelModal(true);
        } else {
            history.push("/");
        }
    }

    let onCancelClickOk = (e : any) => {
        e.preventDefault();
        setOpenCancelModal(false);
        history.push({ pathname: "/" });
    }

    let onCancelClickCancel = (e : any) => {
        e.preventDefault();
        setOpenCancelModal(false);
    }

    let renderField = (fieldKey : string, childData : IMongoImportSettingsField, index: number) => {
        switch(childData?.fieldType) {
            case "dropdownWithoutLabel": {
                return (
                    <MultiSelectDropDown 
                        key={index}
                        name={`${fieldKey}_MULTISELECT`}
                        formInstance={formInstance}
                        id={fieldKey} 
                        searchableKeys={["label"]}
                        apiUrl={`${apiMappings.importSettings.dropdowns[fieldKey]}&clientId=${importFrom}`}
                    />
                )
            }
            default:
                return <></>;
        }        
    }

    let renderAccordionChild = (childKey : string, childData : IMongoImportSettingsField, index: number) => {
        switch(childData?.fieldType) {
            case "accordionChild": {
                return (
                    <Grid key={index} container className="accordion-child-container">
                        <Grid item xs={12} sm={12} md={7} lg={7} xl={7} className="accordion-child-desc">
                            <h4>{childData?.labelKey && dynamicLabels[childData?.labelKey] ? dynamicLabels[childData?.labelKey] : childData?.label}</h4>
                            <p>{childData?.descLabelKey && dynamicLabels[childData?.descLabelKey] ? dynamicLabels[childData?.descLabelKey] : childData?.descLabel}</p>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4} className="accordion-child-dropdown">
                            {
                                childData?.childNodes && Object.keys(childData?.childNodes).map((fieldKey, index) => {
                                    let fieldData = childData?.childNodes && childData?.childNodes[fieldKey];

                                    if(fieldData !== undefined) {
                                        return renderField(childKey, fieldData, index + 1);
                                    }
                                    return <></>;
                                })
                            }
                        </Grid>
                    </Grid>
                )
            }
            default:
                return <></>;
        }
    }

    let renderAccordionChilds = (accordionChildData : any) => {
        return accordionChildData && Object.keys(accordionChildData).map((childKey, index) => {
            let childData = accordionChildData[childKey];

            return renderAccordionChild(childKey, childData, index + 1);
        })
    }

    let renderFields = (childKey: string, childData : IMongoImportSettingsField, index: number) => {
        switch(childData?.fieldType) {
            case "accordion": {
                return (
                    <AccordionComponent 
                        key={index}
                        id={(index - 1).toString()}
                        headerTitle={childData?.labelKey && dynamicLabels[childData?.labelKey] ? dynamicLabels[childData?.labelKey] : childData?.label} 
                        headerSubTitle={childData?.descLabelKey && dynamicLabels[childData?.descLabelKey] ? dynamicLabels[childData?.descLabelKey] : childData?.descLabel}
                        expanded={expanded}
                        setExpanded={setExpanded}
                        renderAccordionChilds={() => renderAccordionChilds(childData?.childNodes)}
                    />
                )
            }
            case "accordionWithToggle": {
                return (
                    <AccordionComponent 
                        key={index}
                        id={index.toString()}
                        headerTitle={childData?.labelKey && dynamicLabels[childData?.labelKey] ? dynamicLabels[childData?.labelKey] : childData?.label}
                        headerSubTitle={childData?.descLabelKey && dynamicLabels[childData?.descLabelKey] ? dynamicLabels[childData?.descLabelKey] : childData?.descLabel}
                        isToggleChecked={false}
                        showToggleSwitch={true}
                        hideChevron={true}
                        expanded={expanded}
                        setExpanded={setExpanded}
                        accordionToggle={{ key: `${childKey}_TOGGLE`, accordionToggles, setAccordionToggles }}
                    />
                )
            }
            default: 
                return <></>;
        }
    }
 
    return (
        <form>
            <div id='toast-inject-here'></div>
            <Box
                display="flex"
                flexDirection="column"
                style={{ width: "100%", height: "calc(100vh - 72px)" }}
                className="main-module-config-container"
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    style={{ width: "100%" }}
                    py="15px"
                    className="module-config-container"
                >
                    <BreadCrumb options={breadCrumbOptions} onClick={(id : string) => handleBreadCrumbOptions(id)} />
                </Box>
                <BoxContainer padding="15px 0px" className="module-container">
                    <div className="module-content-container">
                        {
                            structure?.importSettings && Object.keys(structure?.importSettings[moduleKey]?.childNodes).map((childKey, index) => {
                                let childData = structure?.importSettings[moduleKey]?.childNodes[childKey];

                                return renderFields(childKey, childData, index + 1);
                            })
                        }
                    </div>
                    <div className="button-container">
                        <IconButton
                            onClick={onImport}
                            primary={true}
                            disabled={false}
                            iconVariant='icomoon-save'
                            style={{ marginRight: "10px" }}
                        >
                            Import
                        </IconButton>
                        <IconButton
                            onClick={onCancel}
                            primary={false}
                            disabled={false}
                            iconVariant='icomoon-close'
                            children='Cancel'
                        />
                    </div>
                </BoxContainer>
                <CTAModalComponent 
                    open={openImportModal} 
                    width="555px" 
                    headerTitle={dynamicLabels.IMPORT_SETTINGS_SAVE_DATA_TITLE}
                    contentMessage={dynamicLabels.IMPORT_SETTINGS_SAVE_DATA_CONTENT_MESSAGE}
                    onClickOk={onImportClickOk}
                    onClickCancel={onImportClickCancel}
                    isOkButtonLoading={isOkButtonLoading}
                />
                <CTAModalComponent 
                    open={openCancelModal} 
                    width="555px" 
                    headerTitle={dynamicLabels.IMPORT_SETTINGS_NAVIGATION_TITLE}
                    contentMessage={dynamicLabels.IMPORT_SETTINGS_NAVIGATION_CONTENT_MESSAGE}
                    onClickOk={onCancelClickOk}
                    onClickCancel={onCancelClickCancel}
                />
            </Box>
        </form>
    )
}

export default ModuleConfiguration;

