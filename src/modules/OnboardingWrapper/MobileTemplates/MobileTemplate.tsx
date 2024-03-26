import React, { Dispatch, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { MainContentContainer, GridContainer, GridItem, StyledGridContainer, ListViewCard, Header, ActionButtonWrapper, BreadCrumbContainer, AddFormCard } from "./MobileTemplateStyledComponents"
import MobileTemplateListView from "./Components/MobileTemplateListView";
import MobileTemplateForm from "./Components/MobileTemplateForm";
import { withReactOptimized } from "../../../utils/components/withReact";
import { MemoryRouter, Switch, Route, useHistory } from 'react-router-dom';
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import { IconButton, BreadCrumb } from "ui-library";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import { IMobileTemplateActions } from "./MobileTemplate.actions";
import MobileOrderConfiguration from "./Components/SubComponents/MobileOrderConfiguration";
import { orderTypeLabelMapping } from "./MobileTemplate.models";
import { sendGA } from '../../../utils/ga';

export const basename = '';

const MobileTemplate = () => {
    /* General Hooks */
    const history = useHistory();
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.mobileTemplates);
    const dispatch = useDispatch<Dispatch<IMobileTemplateActions>>();

    /* Redux Selectors */
    const pageLabels = useTypedSelector((state) => state.pageLabels.mobileTemplate);
    const viewType = useTypedSelector((state) => state.settingScreen.mobileTemplates.viewType);

    const isEditMode = useTypedSelector((state) => state.settingScreen.mobileTemplates.form.isEditMode);

    const orderType = useTypedSelector((state) => state.settingScreen.mobileTemplates.orderType);
    const accessProfileId = useTypedSelector((state) => state.settingScreen.mobileTemplates.accessProfileId);

    const breadCrumbOptions = React.useMemo(() => {
        if (viewType === 'add-form-view') {
            if (isEditMode) {
                return [
                    {
                        id: 'driverAppSetup',
                        label: dynamicLabels.driverAppSetup,
                        disabled: true,
                    },
                    {
                        id: 'list-view',
                        label: dynamicLabels.mobileTemplate,
                        disabled: false,
                    },
                    {
                        id: 'updateMobileTemplate',
                        label: dynamicLabels.updateMobileTemplate,
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
                        id: 'list-view',
                        label: dynamicLabels.mobileTemplate,
                        disabled: false,
                    },
                    {
                        id: 'addMobileTemplate',
                        label: dynamicLabels.addMobileTemplate,
                        disabled: true,
                    },
                ];
            }
        } else if (viewType === 'configure-order-view') {
            if (isEditMode) {
                return [
                    {
                        id: 'driverAppSetup',
                        label: dynamicLabels.driverAppSetup,
                        disabled: true,
                    },
                    {
                        id: 'clientMobileTemplates',
                        label: dynamicLabels.mobileTemplate,
                        disabled: true,
                    },
                    {
                        id: 'add-form-view',
                        label: dynamicLabels.updateMobileTemplate,
                        disabled: false,
                    }, {
                        id: orderType,
                        label: dynamicLabels[`${orderTypeLabelMapping[orderType]}`],
                        disabled: true
                    }
                ];
            } else {
                return [
                    {
                        id: 'driverAppSetup',
                        label: dynamicLabels.driverAppSetup,
                        disabled: true,
                    },
                    {
                        id: 'clientMobileTemplates',
                        label: dynamicLabels.mobileTemplate,
                        disabled: true,
                    },
                    {
                        id: 'add-form-view',
                        label: dynamicLabels.addMobileTemplate,
                        disabled: false,
                    }, {
                        id: orderType,
                        label: dynamicLabels[`${orderTypeLabelMapping[orderType]}`],
                        disabled: true
                    }
                ];
            }
        } else {
            return [
                {
                    id: 'driverAppSetup',
                    label: dynamicLabels.driverAppSetup,
                    disabled: true,
                },
                {
                    id: 'clientMobileTemplates',
                    label: dynamicLabels.mobileTemplate,
                    disabled: true,
                }
            ];
        }
    }, [viewType, isEditMode, orderType, dynamicLabels]);

    useEffect(() => {
       if(history?.location?.pathname === '/') {
            dispatch({ type: "@@mobileTemplates/SET_VIEW_TYPE", payload: 'list-view' });
            dispatch({ type: "@@mobileTemplates/SET_EDIT_MODE", payload: false });
        }
    }, [history]);

    const handleBreadCrumbChange = (id:string) => {
        dispatch({ type: "@@mobileTemplates/SET_VIEW_TYPE", payload: id });
        if(id === 'list-view') {
            history.push('/');
            dispatch({ type: "@@mobileTemplates/SET_EDIT_MODE", payload: false });

        } else if(id === 'add-form-view') {
            if(isEditMode) {
                history.push(`/updateMobileTemplate/${accessProfileId}`);
            } else {
                history.push(`/addMobileTemplate`);
                dispatch({ type: "@@mobileTemplates/SET_EDIT_MODE", payload: false });
            }
        }
    }

    return (
        <>
            <Header>
                <BreadCrumbContainer><BreadCrumb options={breadCrumbOptions} onClick={(id) => handleBreadCrumbChange(id)} /></BreadCrumbContainer>

                {viewType === 'list-view' &&
                    <ActionButtonWrapper>
                        {pageLabels?.buttons.add && (
                            <IconButton
                                intent='page'
                                id="clientMobileTemplates-actionBar-add"
                                iconVariant='icomoon-add'
                                onClick={() => {
                                    sendGA('Event New','Mobile Templates - Add Form')
                                    dispatch({ type: "@@mobileTemplates/SET_VIEW_TYPE", payload: "add-form-view" })
                                    history.push('/addMobileTemplate')
                                    }}
                            >
                                {dynamicLabels.add}
                            </IconButton>
                        )}
                    </ActionButtonWrapper>
                }
            </Header>
            <MainContentContainer>
                <GridContainer container spacing={5}>
                    <GridItem item md={12}>
                        <StyledGridContainer
                            container
                            spacing={15}
                        >
                              <Switch>
                                <Route path={`${basename}/updateMobileTemplate/:accessProfileId`}><AddFormCard><MobileTemplateForm /></AddFormCard></Route>
                                <Route path={`${basename}/configureOrder/:accessProfileId`}><AddFormCard><MobileOrderConfiguration /></AddFormCard></Route>
                                <Route path={`${basename}/addMobileTemplate`}><AddFormCard><MobileTemplateForm /></AddFormCard></Route>
                                <Route path={`${basename}/configureOrder`}><AddFormCard><MobileOrderConfiguration /></AddFormCard></Route>
                                <Route path={`${basename}/`}><ListViewCard><MobileTemplateListView /></ListViewCard></Route>
                                <Route path='/'><ListViewCard><MobileTemplateListView /></ListViewCard></Route>
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

export default withReactOptimized(withMemoryRouter(MobileTemplate));