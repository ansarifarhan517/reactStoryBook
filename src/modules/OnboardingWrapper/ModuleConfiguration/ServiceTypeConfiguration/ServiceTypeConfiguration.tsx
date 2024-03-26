import React, { useState, Dispatch, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { withReactOptimized } from "../../../../utils/components/withReact";
import { MemoryRouter, Switch, Route, useHistory } from 'react-router-dom'
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import { Box, BreadCrumb, IconButton, Grid, Card} from "ui-library";
import { BreadCrumbContainer, Header, ActionButtonWrapper } from './ServiceTypeConfigurationStyledComponents';
import { ReactTooltipCustom as ReactTooltip } from '../../../../utils/layouts/ReactTooltipCustom';
import AllServiceTypeListView from './Components/AllServiceTypeListView';
import UploadExcel from '../../../../utils/wrapper/uploadExcel';
import { ServiceTypeConfigurationActions } from "./ServiceTypeConfiguration.actions";
import AddServiceTypeForm from "./Components/AddServiceTypeForm";
import { sendGA } from "../../../../utils/ga";
import { closeSideMenu } from "../../../../utils/helper";
export interface IServiceTypeConfigurationProp {
    navigateToList? : boolean
}

export const basename = '';
const ServiceTypeConfiguration = ({navigateToList}: IServiceTypeConfigurationProp) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.settings.serviceTypeConfiguration);
    const viewType = useTypedSelector((state) => state.serviceTypeConfiguration.viewType);
    const isFormEditable = useTypedSelector((state) => state.serviceTypeConfiguration.form.isEditable);
    const [showUploadPopup, setShowUploadPopup] = useState<boolean>(false);
    const dispatch = useDispatch<Dispatch<ServiceTypeConfigurationActions>>();
    const history = useHistory();

    const breadCrumbOptions = React.useMemo(() => {
        if (viewType === 'addServiceTypeForm') {
            if(isFormEditable){
                return [
                    {
                        id: 'allServiceTypes',
                        label: dynamicLabels.serviceTypeConfiguration || 'Service Type Configuration',
                        disabled: true,
                    },
                    {
                        id: 'editServiceTypeForm',
                        label: (dynamicLabels.edit + ' ' +  dynamicLabels.serviceType) ||'Edit Service Type',
                        disabled: true,
                    }
                ]
            } else {
                return [
                    {
                        id: 'allServiceTypes',
                        label: dynamicLabels.serviceTypeConfiguration || 'Service Type Configuration',
                        disabled: true,
                    },
                    {
                        id: 'addServiceTypeForm',
                        label: (dynamicLabels.add + ' ' +  dynamicLabels.serviceType) || 'Add Service Type',
                        disabled: true,
                    }
                ]
            }
        } else {
            return [
                {
                    id: 'allServiceTypes',
                    label: dynamicLabels.serviceTypeConfiguration || 'Service Type Configuration',
                    disabled: true,
                }
            ]
        }
            
    }, [viewType, dynamicLabels, isFormEditable]);

    useEffect(() => {
        history.push("/");
        dispatch({ type: '@@serviceTypeConfiguration/SET_VIEW_TYPE', payload: 'allServiceTypes' });
    },[navigateToList])
    
    useEffect(() => {
        if (history?.location?.pathname === '/') {
            sendGA('Settings', `Click - Service Type Configuration - All Service Types`);
            dispatch({ type: "@@serviceTypeConfiguration/SET_VIEW_TYPE", payload: "allServiceTypes" });
            dispatch({ type: "@@serviceTypeConfiguration/RESET_SERVICETYPE_DATA" });
            dispatch({ type: "@@serviceTypeConfiguration/SET_FORM_EDITABLE", payload: false });
        }
    }, [history]);

    return (
        <>
        <Header>
            <BreadCrumbContainer>
                <BreadCrumb options={breadCrumbOptions}/>
            </BreadCrumbContainer>

            {viewType === 'allServiceTypes' ?
                <ActionButtonWrapper title={dynamicLabels.ClickHereToAddCustomForm}>
                    <IconButton
                        id='serviceTypeConfiguration-actionBar-add'
                        intent='page'
                        iconVariant='icomoon-add'
                        onClick={() => {
                            sendGA('Settings', `Click - Add Service Type`);
                            dispatch({ type: "@@serviceTypeConfiguration/SET_VIEW_TYPE", payload: "addServiceTypeForm" })
                            dispatch({ type: "@@serviceTypeConfiguration/RESET_SERVICETYPE_DATA" });
                            dispatch({ type: "@@serviceTypeConfiguration/SET_FORM_EDITABLE", payload: false });
                            history.push('/addServiceTypeForm')
                            closeSideMenu()
                        }}>
                        {dynamicLabels.add}
                    </IconButton>
                    <>
                        <IconButton
                            id='serviceAreaProfile-actionBar-upload'
                            data-tip={`${dynamicLabels.clickHereToUploadNewServiceType}`}
                            data-place='bottom'
                            data-offset="{'top': 10, 'left': 10}"
                            data-for='tt_UploadBranch'
                            intent='page'
                            iconVariant='icomoon-upload'
                            onClick={() => {
                                sendGA('Excel Upload', `Click - Upload Service Type`);
                                setShowUploadPopup(true)}}>
                            {dynamicLabels.Upload}
                        </IconButton>
                        <ReactTooltip
                            id='tt_UploadServiceType'
                            type='info'
                            effect='solid'
                            place='bottom'
                            multiline>
                        </ReactTooltip>
                    </>
                </ActionButtonWrapper>
                : <></>
            }
        </Header>
        <div>
            <div id='toast-inject-here' style={{ textAlign: 'center' }}></div>
            <Box display='flex' flexDirection='column' style={{ width: '100%', height: '90vh', marginRight: '2px' }}>
                <Grid container spacing={5} style={{ flexGrow: 1, width: '100%', boxShadow: '0 2px 20px -10px #000' }}> {/* overflow: 'hidden'*/}
                    <Grid item md={12} style={{ display: 'flex', overflow: 'hidden' }}>
                        <Card style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', paddingRight: 0, paddingBottom: 0 }}>
                            <Switch>
                                <Route path={`${basename}/addServiceTypeForm/:serviceTypeDetailsId`}><AddServiceTypeForm /></Route>
                                <Route path={`${basename}/addServiceTypeForm`}><AddServiceTypeForm /></Route>
                                <Route path={`${basename}/`}><AllServiceTypeListView/></Route>
                            </Switch>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </div>
        <UploadExcel
            isOpen={showUploadPopup}
            featureName='serviceType'
            onSuccess={() => {
                setShowUploadPopup(false);
                dispatch({
                    type: '@@serviceTypeConfiguration/FETCH_ALL_SERVICETYPE_LIST',
                    payload: {
                        pageNumber: 1,
                        pageSize: 50
                    }
                })
            }}
            onClose={() => {setShowUploadPopup(false)}}
        />
    </>
    )
}
const withMemoryRouter = <P extends object>(Component: React.ComponentType<P>) =>
    (props: P) => {
        return <MemoryRouter><Component {...props as P} /></MemoryRouter>
    }
export default withReactOptimized(withMemoryRouter(ServiceTypeConfiguration))