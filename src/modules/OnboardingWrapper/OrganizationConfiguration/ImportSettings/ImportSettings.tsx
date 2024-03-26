import "./css/importSettings.css";

import React, { Dispatch, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Box, BreadCrumb, Tooltip, useToast, Grid, TextInput } from "ui-library";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import { BoxContainer, IconDropdownStyle } from "./styles";
import { ImportSettingsActions } from "./ImportSettings.actions";
import DropDownComponent from "./CommonComponents/DropDown";
import { sendGA } from "../../../../utils/ga";
import { gaMapping } from "./Mappings/gaMapping";
import BoxSkeleton from "./CommonComponents/BoxSkeleton";

const ImportSettings = () => {
    /** General Hooks */
    const dynamicLabels = useDynamicLabels(
        DYNAMIC_LABELS_MAPPING.settings.importSettings
    );

    /** Redux Hooks */
    const pageLabels = useTypedSelector((state) => state.pageLabels.user);
    const { importFromLookUpData, importToLookUpData } = useTypedSelector((state) => state.settings.importSettings);
    const { importFrom, importTo } = useTypedSelector((state) => state.settings.importSettings.clients);
    
    const importFromClients = importFromLookUpData?.map((client) => {
        return { value: client?.id, label: client?.name };
    });

    const importToClients = importToLookUpData?.map((client) => {
        return { value: client?.id, label: client?.name };
    });
    // const importFromClients = clientsLookUpData.filter((client) => {
    //     return client?.id !== importTo;
    // }).map((client) => {
    //     return { value: client?.id, label: client?.name, modelType: client?.modelType };
    // });
    // const importToClients = clientsLookUpData.filter((client) => {
    //     return client?.id !== importFrom && client?.modelType === modelType;
    // }).map((client) => {
    //     return { value: client?.id, label: client?.name, modelType: client?.modelType };
    // });
    const history = useHistory();

    /** Redux */
    const structure = useTypedSelector(
        (state) => state.settings.importSettings.structure
    );

    /** State */
    const [modulesData, setModulesData] = useState({});
    const [search, setSearch] = useState("");

    /** Dispatcher */
    const dispatch = useDispatch<Dispatch<ImportSettingsActions>>();

    /** Variables */
    const breadCrumbOptions = React.useMemo(
        () => [
            {
                id: "importSettings",
                label: dynamicLabels.importSettings,
                disabled: true,
            },
        ],
        [pageLabels, dynamicLabels]
    );

    /** Helper Methods */
    const onHandleChange = (key: string, value : string) => {
        if(value === undefined) {
            if(key === "importFrom") {
                dispatch({
                    type: "@@importSettings/SET_CLIENT",
                    payload: { key: "importFrom", value: ""},
                });
            } else {
                dispatch({
                    type: "@@importSettings/SET_CLIENT",
                    payload: { key: key, value: "" },
                });
            }
        } else {
            dispatch({
                type: "@@importSettings/SET_CLIENT",
                payload: { key: key, value: value },
            });
        }
    }

    const isMatch = (label: string, descLabel: string) => {
        return label.toLowerCase().includes(search.toLowerCase()) || descLabel.toLowerCase().includes(search.toLowerCase());
    }

    const navigateToModule = (label : string, moduleKey : string) => {
        let eventCategory= gaMapping[moduleKey]?.eventCategory;
        let eventAction = gaMapping[moduleKey]?.eventAction;
        sendGA(eventCategory, eventAction);

        history.push({ pathname: "/moduleConfiguration", state: { label, moduleKey } });
    }

    const sendSearchGA = () => {
        let eventCategory= gaMapping["SEARCH"]?.eventCategory;
        let eventAction = gaMapping["SEARCH"]?.eventAction;
        sendGA(eventCategory, eventAction);
    }

    const renderModules = () => {
        let searchedModulesKeys = Object.keys(modulesData).filter((moduleKey) => {
            return isMatch(modulesData[moduleKey]?.label, modulesData[moduleKey]?.descLabel);
        });
        let searchedModulesData = {};
        searchedModulesKeys.forEach((moduleKey) => {
            searchedModulesData = {...searchedModulesData, [moduleKey]: modulesData[moduleKey]};
        });

        if(search.length === 0) {
            searchedModulesData = modulesData;
        }

        return Object.keys(searchedModulesData).length > 0 ? Object.keys(searchedModulesData).map((moduleKey) => {
            let moduleData = searchedModulesData[moduleKey];

            return (
                <Grid key={moduleKey} item xs={12} sm={12} md={6} lg={4} xl={4} className="imp-card-container" onClick={() => navigateToModule(moduleData?.label, moduleKey)} >
                    <div className="imp-card">
                        <Grid item xs={12} sm={12} md={4} lg={3} xl={3} className="card-image">
                            <img src={`${moduleData?.logoPath}`} width={40} height={40} alt="image" />
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={9} xl={9}>
                            <h4>{moduleData?.labelKey && dynamicLabels[moduleData?.labelKey] ? dynamicLabels[moduleData?.labelKey] : moduleData?.label}</h4>
                            <p>{moduleData?.descLabelKey && dynamicLabels[moduleData?.descLabelKey] ? dynamicLabels[moduleData?.descLabelKey] : moduleData?.descLabel}</p>
                        </Grid>
                    </div>
                </Grid>
            )
        }) : [1,2,3].map((_) => (
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4} className="imp-card-container">
                <BoxSkeleton />
            </Grid>
        ));
    }

    useEffect(()=> {
        if(structure?.importSettings){
            setModulesData(structure?.importSettings);
        }
    }, [JSON.stringify(structure)])

    useEffect(() => {
        dispatch({ type: "@@importSettings/FETCH_STRUCTURE" });
        dispatch({ type: "@@importSettings/FETCH_IMPORT_FROM_DATA" });
        dispatch({ type: "@@importSettings/FETCH_IMPORT_TO_DATA" });
    }, []);

    return (
        <Box
            display="flex"
            flexDirection="column"
            style={{ width: "100%", height: "calc(100vh - 72px)" }}
        >
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                style={{ width: "100%" }}
                py="15px"
            >
                <BreadCrumb options={breadCrumbOptions} />
                <Box
                    display="flex"
                    justifyContent="space-evenly"
                    horizontalSpacing="0px"
                >
                    <div className="dropdown-container">
                        {/* <Tooltip message={dynamicLabels.IMPORT_FROM_TOOLTIP} hover={true}>  */}
                            <IconDropdownStyle padding="0px">
                                <DropDownComponent 
                                    variant="form-select" 
                                    optionList={importFromClients} 
                                    onChange={(value : string) => onHandleChange("importFrom", value)}
                                    placeholder={dynamicLabels.IMPORT_FROM}
                                    value={importFrom}
                                    width="200px"
                                    disabled={false}
                                />
                            </IconDropdownStyle>
                        {/* </Tooltip> */}
                        {/* <Tooltip message={dynamicLabels.IMPORT_TO_TOOLTIP} hover={true}> */}
                            <IconDropdownStyle padding="0px">
                                <DropDownComponent 
                                    variant="form-select" 
                                    optionList={importToClients} 
                                    onChange={(value : string) => onHandleChange("importTo", value)}
                                    placeholder={dynamicLabels.IMPORT_TO}
                                    value={importToClients[0]?.value}
                                    width="200px"
                                    disabled={true} // Todo: Remove For Super Client UseCase
                                    // disabled={importFrom.length === 0} // Todo: Add For Super Client UseCase
                                />
                            </IconDropdownStyle>
                        {/* </Tooltip> */}
                    </div>
                </Box>
            </Box>
            <BoxContainer className={`module-container ${importFrom.length === 0 || importTo.length === 0 ? "disabled" : ""}`}>
                <i className="logi-icon icon-Product-Icons_Navbar_Search"></i>
                <TextInput         
                    id="imp-search"
                    name="search"
                    className="imp-search"
                    fullWidth={true}
                    onChange={(e) => setSearch(e.target.value)}
                    variant='inline-edit'
                    placeholder={dynamicLabels.SEARCH}
                    style={{ position: "relative" }}
                    autoComplete="off"
                    onClick={sendSearchGA}
                />
                <Grid container spacing="7.5px">
                    {renderModules()}
                </Grid>
            </BoxContainer>
        </Box>
    );
};

export default ImportSettings;

