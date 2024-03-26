import React, { Dispatch, Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { withReactOptimized } from "../../../../utils/components/withReact";
import { MemoryRouter, Switch, Route, useHistory } from 'react-router-dom'
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import { Box, BreadCrumb, IconButton, Grid, Card,Loader, Position } from "ui-library";
import { BreadCrumbContainer, Header, ActionButtonWrapper } from './TrackerConfigurationStyledComponents';
import { TrackerConfigurationActions } from "./TrackerConfiguration.actions";
import { sendGA } from "../../../../utils/ga";
import AllTrackerConfigListView from './Components/AllTrackerConfigListView';
import { closeSideMenu } from "../../../../utils/helper";



const AddTrackerConfigForm = React.lazy(() => import(/* webpackChunkName: TrackerConfigurationForm*/'./Components/AddTrackerConfigForm'));


function AddTrackerConfigFormLazy(props) {

    return (
        <div>
            <Suspense fallback={
                <Position type='relative'>
                    <Loader center  />
                </Position>}>
                <AddTrackerConfigForm {...props} />
            </Suspense>
        </div>
    );
}

export interface ITrackerConfigurationProp {
    navigateToList?: boolean
}

export const basename = '';
const TrackerConfiguration = ({navigateToList }: ITrackerConfigurationProp) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.settings.trackerConfiguration);
    const viewType = useTypedSelector((state) => state.tracker.trackerConfiguration.viewType);
    const isFormEditable = useTypedSelector((state) => state.tracker.trackerConfiguration.form.isEditable);;
    const dispatch = useDispatch<Dispatch<TrackerConfigurationActions>>();
    const history = useHistory();
    const pageLabels = useTypedSelector(state => state.pageLabels.trackerConfigurations)

    const breadCrumbOptions = React.useMemo(() => {
        if (viewType === 'trackerForm') {
            if (isFormEditable){
                return [
                    {
                        id: 'allTrackers',
                        label: dynamicLabels.TRACKER_CONFIGURATION || 'Tracker Configuration',
                        disabled: true,
                    },
                    {
                        id: 'editTrackerForm',
                        label: (dynamicLabels.update + ' ' + dynamicLabels.tracker_s) || 'Edit Tracker',
                        disabled: true,
                    }
                ]
            } else {
                return [
                    {
                        id: 'allTrackers',
                        label: dynamicLabels.TRACKER_CONFIGURATION || 'Tracker Configuration',
                        disabled: true,
                    },
                    {
                        id: 'addTrackerForm',
                        label: (dynamicLabels.add + ' ' + dynamicLabels.tracker_s) || 'Add Tracker',
                        disabled: true,
                    }
                ]
            }
        } else {
            return [
                {
                    id: 'allTrackers',
                    label: dynamicLabels.TRACKER_CONFIGURATION || 'Tracker Configuration',
                    disabled: true,
                }
            ]
        }

    }, [viewType, dynamicLabels, isFormEditable]);

    useEffect(() => {
        history.push("/");
        dispatch({ type: '@@trackerConfiguration/SET_VIEW_TYPE', payload: 'allTrackers' });
    }, [navigateToList])

    useEffect(() => {
        if (history?.location?.pathname === '/') {
            sendGA('Settings', `Click -Tracker Configuration - All Trackers`);
            dispatch({ type: "@@trackerConfiguration/SET_VIEW_TYPE", payload: "allTrackers" });
        }
    }, [history]);
    return (
        <>
            <Header>
                <BreadCrumbContainer>
                    <BreadCrumb options={breadCrumbOptions} />
                </BreadCrumbContainer>

                {(viewType === 'allTrackers' && pageLabels?.buttons.add) ?
                    <ActionButtonWrapper>
                        <IconButton
                            id='AddTrackerConfiguration-Button'
                            intent='page'
                            iconVariant='icomoon-add'
                            onClick={() => {
                                history.push("/addTrackerForm");
                                sendGA('Tracker Configuration', `Add Tracker`);
                                dispatch({ type: "@@trackerConfiguration/SET_VIEW_TYPE", payload: "trackerForm" });
                                dispatch({ type: "@@trackerConfiguration/RESET_TRACKER_DATA" });
                                dispatch({ type: "@@trackerConfiguration/SET_FORM_EDITABLE", payload: false });
                                closeSideMenu();
                            }}>
                            {dynamicLabels.add}
                        </IconButton>
                    </ActionButtonWrapper>
                    : <></>
                }
            </Header>
            <div>
                <div id='toast-inject-here' style={{ textAlign: 'center' }}></div>
                <Box display='flex' flexDirection='column' style={{ width: '100%', marginRight: '2px', height: viewType === 'allTrackers' ? '78vh' : 'auto' }}>
                    <Grid container spacing={5} style={{ flexGrow: 1, width: '100%', boxShadow: '0 2px 20px -10px #000' }}>
                        <Grid item md={12} style={{ display: 'flex', overflow: 'hidden' }}>
                            <Card style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', paddingBottom: 0 }}>
                                <Switch>
                                    <Route path={`${basename}/addTrackerForm/:trackerConfigId`}><AddTrackerConfigFormLazy /></Route>
                                    <Route path={`${basename}/addTrackerForm`}><AddTrackerConfigFormLazy /></Route>
                                    <Route path={`${basename}/`}><AllTrackerConfigListView /></Route>
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
export default withReactOptimized(withMemoryRouter(TrackerConfiguration))