import React, { Dispatch, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { withReactOptimized } from "../../../../utils/components/withReact";
import { MemoryRouter, Switch, Route, useHistory } from 'react-router-dom'
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import { Box, BreadCrumb, IconButton, Grid, Card} from "ui-library";
import { BreadCrumbContainer, Header, ActionButtonWrapper } from './CompartmentConfigurationStyledComponents';
import AllCompartmentListView from './Components/AllCompartmentListView';
import { CompartmentConfigurationActions } from "./CompartmentConfiguration.actions";
import CompartmentForm from "./Components/CompartmentForm";
import { sendGA } from "../../../../utils/ga";
export interface ICompartmentConfigurationProp {
    navigateToList? : boolean
}

export const basename = '';
const CompartmentConfiguration = ({navigateToList}: ICompartmentConfigurationProp) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.settings.compartmentConfiguration);
    const viewType = useTypedSelector((state) => state.compartmentConfiguration.viewType);
    const isFormEditable = useTypedSelector((state) => state.compartmentConfiguration.form.isEditable);;
    const dispatch = useDispatch<Dispatch<CompartmentConfigurationActions>>();
    const history = useHistory();
    const pageLabels = useTypedSelector(state => state.pageLabels.compartmentConfigurations)

    const breadCrumbOptions = React.useMemo(() => {
        if (viewType === 'addCompartmentForm') {
            if(isFormEditable){
                return [
                    {
                        id: 'allCompartments',
                        label: dynamicLabels.COMPARTMENT_CONFIGURATION || 'Compartment Configuration',
                        disabled: true,
                    },
                    {
                        id: 'editCompartmentForm',
                        label: (dynamicLabels.update + ' ' +  dynamicLabels.compartment_s) ||'Edit Compartment',
                        disabled: true,
                    }
                ]
            } else {
                return [
                    {
                        id: 'allCompartments',
                        label: dynamicLabels.COMPARTMENT_CONFIGURATION || 'Compartment Configuration',
                        disabled: true,
                    },
                    {
                        id: 'addCompartmentForm',
                        label: (dynamicLabels.add + ' ' +  dynamicLabels.compartment_s) || 'Add Compartment',
                        disabled: true,
                    }
                ]
            }
        } else {
            return [
                {
                    id: 'allCompartments',
                    label: dynamicLabels.COMPARTMENT_CONFIGURATION || 'Compartment Configuration',
                    disabled: true,
                }
            ]
        }
            
    }, [viewType, dynamicLabels, isFormEditable]);

    useEffect(() => {
        history.push("/");
        dispatch({ type: '@@compartmentConfiguration/SET_VIEW_TYPE', payload: 'allCompartments' });
    },[navigateToList])
    
    useEffect(() => {
        if (history?.location?.pathname === '/') {
            sendGA('Settings', `Click -Compartment Configuration - All Compartments`);
            dispatch({ type: "@@compartmentConfiguration/SET_VIEW_TYPE", payload: "allCompartments" });
            dispatch({ type: "@@compartmentConfiguration/RESET_COMPARTMENT_DATA" });
            dispatch({ type: "@@compartmentConfiguration/SET_FORM_EDITABLE", payload: false });
        }
    }, [history]);

    return (
        <>
         <Header>
            <BreadCrumbContainer>
                <BreadCrumb options={breadCrumbOptions}/>
            </BreadCrumbContainer>

            {(viewType === 'allCompartments' && pageLabels?.buttons.add) ?
                <ActionButtonWrapper title={dynamicLabels.addCompartmentTooltip}>
                    <IconButton
                        id='compartmentConfiguration_actionBar-add'
                        intent='page'
                        iconVariant='icomoon-add'
                        onClick={() => {
                            sendGA('Compartment Configuration', `Add Compartment Form`);
                            dispatch({ type: "@@compartmentConfiguration/SET_VIEW_TYPE", payload: "addCompartmentForm" })
                            dispatch({ type: "@@compartmentConfiguration/RESET_COMPARTMENT_DATA" });
                            dispatch({ type: "@@compartmentConfiguration/SET_FORM_EDITABLE", payload: false });
                            history.push('/addCompartmentForm')
                        }}>
                        {dynamicLabels.add}
                    </IconButton>
                </ActionButtonWrapper>
                : <></>
            }
        </Header>
        <div>
            <div id='toast-inject-here' style={{ textAlign: 'center' }}></div>
            <Box display='flex' flexDirection='column' style={{ width: '100%', marginRight: '2px', height: viewType === 'allCompartments'? '78vh': 'auto' }}>
                <Grid container spacing={5} style={{ flexGrow: 1, width: '100%', boxShadow: '0 2px 20px -10px #000' }}> {/* overflow: 'hidden'*/}
                    <Grid item md={12} style={{ display: 'flex', overflow: 'hidden' }}>
                        <Card style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', paddingBottom: 0 }}>
                            <Switch>
                                <Route path={`${basename}/addCompartmentForm/:compartmentId`}><CompartmentForm /></Route>
                                <Route path={`${basename}/addCompartmentForm`}><CompartmentForm /></Route>
                                <Route path={`${basename}/`}><AllCompartmentListView/></Route>
                            </Switch>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </div>
    </>
    )
}
const withMemoryRouter = <P extends object>(Component: React.ComponentType<P>) =>
    (props: P) => {
        return <MemoryRouter><Component {...props as P} /></MemoryRouter>
    }
export default withReactOptimized(withMemoryRouter(CompartmentConfiguration))