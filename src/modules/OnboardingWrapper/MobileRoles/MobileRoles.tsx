import React, { Dispatch, useEffect } from "react";
import { withReactOptimized } from "../../../utils/components/withReact";
import { MemoryRouter, Switch, Route, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { BreadCrumb, IconButton } from "ui-library";
import { MainContentContainer, GridContainer, GridItem, StyledGridContainer, ListViewCard, Header, BreadCrumbContainer, ActionButtonWrapper, AddFormCard } from "./MobileRolesStyledComponents"
import MobileRolesListView from "./Components/MobileRolesListView";
import MobileRolesForm from "./Components/MobileRolesForm";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import { IMobileRolesActions } from "./MobileRoles.actions";
import { sendGA } from '../../../utils/ga';

export const basename = '';

const MobileRoles = () => {
    const history = useHistory();

    /* General Hooks */
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.mobileRoles);
    const dispatch = useDispatch<Dispatch<IMobileRolesActions>>();
    // accessProfileId
    /* Redux Selectors */
    const pageLabels = useTypedSelector((state) => state.pageLabels.mobileRole);
    const viewType = useTypedSelector((state) => state.settingScreen.mobileRoles.viewType);
    const isEditMode = useTypedSelector((state) => state.settingScreen.mobileRoles.form.isEditMode);

    const breadCrumbOptions = React.useMemo(() => {
        if (viewType === 'add-form-view') {
            return [
                {
                    id: 'driverAppSetup',
                    label: dynamicLabels.driverAppSetup,
                    disabled: true,
                },
                {
                    id: 'list-view',
                    label: dynamicLabels.mobileRoles,
                    disabled: false,
                },
                {
                    id: `${isEditMode ? 'updatedMobileRoles' : 'addMobileRoles'}`,
                    label: `${isEditMode ? dynamicLabels.updateMobileRole : dynamicLabels.addMobileRole}`,
                    disabled: true,
                },
            ];
        } else {
            return [
                {
                    id: 'driverAppSetup',
                    label: dynamicLabels.driverAppSetup,
                    disabled: true,
                },
                {
                    id: 'clientMobileRoles',
                    label: dynamicLabels.mobileRoles,
                    disabled: true,
                },
            ];
        }
    }, [viewType, isEditMode, dynamicLabels]);

    useEffect(() => {
        if(history?.location?.pathname === '/') {
            dispatch({ type: "@@mobileRoles/SET_VIEW_TYPE", payload: 'list-view' })
            dispatch({ type: "@@mobileRoles/SET_EDIT_MODE", payload: false });
        }
     }, [history]);

    const handleBreadCrumbChange = (id:string) => {
        dispatch({ type: "@@mobileRoles/SET_VIEW_TYPE", payload: id });
        dispatch({ type: "@@mobileRoles/SET_EDIT_MODE", payload: false });
        history.push('/');
    }

    return (
        <>
            <Header>
                <BreadCrumbContainer><BreadCrumb options={breadCrumbOptions} onClick={(id) => handleBreadCrumbChange(id)} /></BreadCrumbContainer>
                {viewType !== 'add-form-view' &&
                    <ActionButtonWrapper>
                        {pageLabels?.buttons.add && (
                            <IconButton
                                id="driverAppManagementRoles-actionBar-add"
                                intent='page'
                                iconVariant='icomoon-add'
                                onClick={() => {
                                    sendGA('Event New','Mobile Roles - Add Form')
                                    dispatch({ type: "@@mobileRoles/SET_VIEW_TYPE", payload: "add-form-view" })
                                    history.push({pathname: '/addMobileRole'});
                                }}
                            >
                                {dynamicLabels.add}
                            </IconButton>
                        )}
                    </ActionButtonWrapper>
                }
            </Header>
            <MainContentContainer>
                <GridContainer
                    container
                    spacing={5}
                >
                    <GridItem item md={12}>
                        <StyledGridContainer
                            container
                            spacing={15}
                        >
                            <Switch>
                                <Route path={`${basename}/updateMobileRole/:orgRoleId`}><AddFormCard><MobileRolesForm /></AddFormCard></Route>
                                <Route path={`${basename}/addMobileRole`}><AddFormCard><MobileRolesForm /></AddFormCard></Route>
                                <Route path={`${basename}/`}><ListViewCard><MobileRolesListView /></ListViewCard></Route>
                                <Route path='/'><ListViewCard><MobileRolesListView /></ListViewCard></Route>
                            </Switch>
                        </StyledGridContainer>
                    </GridItem>
                </GridContainer>
            </MainContentContainer>
        </>
    )
}

const withMemoryRouter = <P extends object>(Component: React.ComponentType<P>) =>
  (props: P) => {
    return <MemoryRouter><Component {...props as P} /></MemoryRouter>
  }

export default withReactOptimized(withMemoryRouter(MobileRoles));