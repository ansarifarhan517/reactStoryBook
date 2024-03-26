import React, { Dispatch, useEffect, useState } from 'react'
import withRedux from '../../../../../utils/redux/withRedux'
import { withThemeProvider } from '../../../../../utils/theme'
import { withPopup, withToastProvider, Box, IListViewColumn, IFetchDataOptions, ListView, useToast, Grid, Card, Tooltip, IconButton, ISelectedRows, FontIcon, IListViewRow } from 'ui-library'
import { useTypedSelector } from '../../../../../utils/redux/rootReducer'
import WebhookProfile from './AddShipperWebhookProfile'
import { useDispatch } from 'react-redux'
import { WebhookProfileActions } from './ShipperWebhookProfile.actions'
import apiMappings from '../../../../../utils/apiMapping'
import axios from '../../../../../utils/axios'
import { transformMongoListViewToColumns } from '../../../../../utils/mongo/ListView'
import { ColumnInstance } from 'react-table'
import iconsMapping from '../../../../../utils/mongo/ListView/actionBarIcons.mapping'
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels'
import { IOrganisationWebhookList } from './ShipperWebhookProfile.reducer'
import { tGlobalToastActions } from '../../../../common/GlobalToasts/globalToast.reducer'
import { WebhookListWrapper, WebhookPageHeader, NodataWrapper, AddWebhookButtonWrapper } from '../../../../ClientAdmin/DeveloperSpace/WebhookProfile/subComponents/styledComponents'
import { ListViewWrapper } from '../../../../Contract/ContractListView/styled'
import { FormActionButton } from '../../../../OnboardingWrapper/BranchConfiguration/BranchConfigurationStyledComponents'
import { StyledGrid } from '../../../ShipperListView/StyledShipperListView'
import { tGlobalPopupAction } from '../../../../common/GlobalPopup/GlobalPopup.reducer'

interface IShipperWebhookListProps {
    params: Record<string, any>
    navigateToList: boolean
}

const ShipperWebhookProfile = ({ params, navigateToList }: IShipperWebhookListProps) => {

    const dispatch = useDispatch<Dispatch<WebhookProfileActions>>()
    const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()
    const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()


    const toast = useToast()

    const pageLabels = useTypedSelector(state => state.pageLabels.shipperWebhookProfiles);
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.webHooks);

    const structure = useTypedSelector(state => state.shipperSettings.shipperWebhook.listStructure)
    const columnsSelector = useTypedSelector(state => state.shipperSettings.shipperWebhook.listStructure.columns);
    const rowsSelector = useTypedSelector(state => state.shipperSettings.shipperWebhook.data.results)
    const totalRowsSelector = useTypedSelector(state => state.shipperSettings.shipperWebhook.data.totalCount)
    const actionBarButtons = useTypedSelector(state => state.shipperSettings.shipperWebhook.listStructure.buttons)
    const listLoading = useTypedSelector(state => state.shipperSettings.shipperWebhook.loading.listView)
    const columnLoading = useTypedSelector(state => state.shipperSettings.shipperWebhook.loading.columns)
    const toastObject = useTypedSelector(state => state.globalToast);
    const eventsData = useTypedSelector(state => state.shipperSettings.shipperWebhook.events)

    const [pageType, setPageType] = useState<string>('list');
    const [columns, setColumns] = useState<IListViewColumn[]>([]);
    const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
    const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});
    const [webhookActivationRequest, setWebhookActivationRequest] = useState<
        | { activeRequest: boolean; selectedWebhook: IOrganisationWebhookList; failureCallback?: React.Dispatch<React.SetStateAction<boolean>> }
        | undefined
    >();
    // const [showDeletionConfirmation, setShowDeletionConfirmation] = useState<boolean>(false);
    const [subClientId, setSubClientId] = useState<string | number>(params?.shipperDetails?.subClientId || '')
    const [isNavigatetoList, setIsNavigatetoList] = useState<boolean>(false)

    // ShipperWebhook Changes
    const onCancel = () => {
        setPageType('list')
    }

    const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {
        dispatch({
            type: '@@shipperWebhookProfile/SET_LIST_LOADING', payload: {
                listView: true
            }
        })
        setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis })
        if (subClientId) {
            dispatch({
                type: '@@shipperWebhookProfile/FETCH_DATA',
                payload: {
                    pageNumber: pageNumber,
                    pageSize: pageSize,
                    searchBy: filterOptions?.searchBy,
                    searchText: filterOptions?.searchText,
                    sortBy: sortOptions?.sortBy,
                    sortOrder: sortOptions?.sortOrder,
                    subClientId: subClientId
                }
            })
        } else {
            getOnboardingStructure({ pageSize, pageNumber, sortOptions, filterOptions, apis })
        }
    }, [])

    const getOnboardingStructure = async ({ pageSize, pageNumber, sortOptions, filterOptions }: IFetchDataOptions) => {
        try {
            const { data: { data: { configurationSteps } } } = await axios.get(apiMappings.shipperWebhookProfile.getOnBoardingStructure, {
                params: {
                    token: params?.token
                }
            })

            if (configurationSteps.length > 0) {
                var shipperProfileData = JSON.parse(configurationSteps[0]?.subSteps[0]?.answerData);
                setSubClientId(shipperProfileData?.subClientId);
                dispatch({
                    type: '@@shipperWebhookProfile/FETCH_DATA',
                    payload: {
                        pageNumber: pageNumber,
                        pageSize: pageSize,
                        searchBy: filterOptions?.searchBy,
                        searchText: filterOptions?.searchText,
                        sortBy: sortOptions?.sortBy,
                        sortOrder: sortOptions?.sortOrder,
                        subClientId: shipperProfileData?.subClientId
                    }
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const onSaveColumnPreferences = React.useCallback(async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
        const columns = { ...columnsSelector }
        Object.keys(columns).forEach((columnKey) => {
            columns[columnKey].permission = !!visibleColumns[columnKey]
        })

        const payload = {
            ...structure,
            columns
        }

        try {
            const { data: { message } } = await axios.put(apiMappings.driver.listView.structure, payload)
            message && toast.add(message, 'check-round', false)
        } catch (error) {
            console.log(error, error?.response)
        }


    }, [columnsSelector])

    const onRowSelect = React.useCallback((s: ISelectedRows) => {
        setSelectedRows(s);
    }, []);

    const onRowEditClick = React.useCallback((row: IListViewRow) => {
        dispatch({
            type: '@@shipperWebhookProfile/SET_DATA', payload: {
                key: 'editedWebhookProfile',
                value: row
            }
        })
        setPageType('form');
    }, []);



    // cell Callbacks

    const handleWebhookActivation = async () => {
        if (!webhookActivationRequest) {
            return;
        }
        setWebhookActivationRequest(undefined);
        globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })

        if (webhookActivationRequest?.selectedWebhook?.webhookProfileId) {
            const webhookProfile = webhookActivationRequest.selectedWebhook;
            dispatch({
                type: '@@shipperWebhookProfile/UPDATE_DATA',
                payload: {
                    ...webhookProfile,
                    isActiveFl: webhookActivationRequest.activeRequest,
                },
            });
        }

        try {
            const {
                data: { message, status },
            } = await axios.put(
                `${apiMappings.shipperWebhookProfile.listView.activeWebhook}webhookProfileId=${webhookActivationRequest?.selectedWebhook?.webhookProfileId}&isActive=${webhookActivationRequest?.activeRequest}&subClientId=${subClientId}`
            );
            if (status === 200) {
                toast.add(dynamicLabels.statusUpdatedSuccessfully, 'check-round', false);
                setSelectedRows({});
                fetchOptions.apis?.resetSelection();
                return;
            }
            throw message;
        } catch (errorMessage) {
            webhookActivationRequest.failureCallback && webhookActivationRequest.failureCallback(!webhookActivationRequest.activeRequest);
            toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false);
        }
    };

    const handleActiveFlChange = (
        isChecked: boolean,
        selectedWebhook: IOrganisationWebhookList,
        failureCallback: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
        setWebhookActivationRequest({ activeRequest: isChecked, selectedWebhook, failureCallback });
    };

    const cellCallbackMapping = {
        isActiveFl: handleActiveFlChange
    }

    /** Delete Request */
    const deleteSelectedRows = async () => {

        // setShowDeletionConfirmation(false);
        globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })
        try {
            const webhookProfileIDs = Object.keys(selectedRows).map(key => key);
            const {
                data: data
            } = await axios.delete(`${apiMappings.shipperWebhookProfile.listView.deleteWebhook}?subClientId=${subClientId}`, { data: webhookProfileIDs });
            if (data.status === 200) {
                toast.add(`${data?.message}`, 'check-round', false);
                setSelectedRows({});
                fetchOptions.apis?.resetSelection();
                handleFetchData(fetchOptions);
                return;
            }
            throw toast.add(`${data?.message}`, 'warning', false);
        } catch (errorMessage) {
            toast.add(errorMessage, 'warning', false);
        }
    };

    useEffect(() => {

        if (subClientId) {
            dispatch({
                type: '@@shipperWebhookProfile/FETCH_EVENTS_DATA', payload: subClientId
            })
        } else {
            getShipperEventsList()
        }

        dispatch({ type: '@@shipperWebhookProfile/FETCH_STRUCTURE' });
        if (toastObject?.message) {
            toast.add(toastObject?.message, toastObject?.icon || '', toastObject?.remove || false);
        }
    }, [])

    const getShipperEventsList = async () => {
        try {
            const { data: { data: { configurationSteps } } } = await axios.get(apiMappings.shipperWebhookProfile.getOnBoardingStructure, {
                params: {
                    token: params?.token
                }
            })

            if (configurationSteps.length > 0) {
                var shipperProfileData = JSON.parse(configurationSteps[0]?.subSteps[0]?.answerData);
                setSubClientId(shipperProfileData?.subClientId);
                dispatch({
                    type: '@@shipperWebhookProfile/FETCH_EVENTS_DATA', payload: shipperProfileData?.subClientId
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const mongoStructure = columnsSelector;

        if (Object.keys(mongoStructure).length) {
            const newColumns = transformMongoListViewToColumns(mongoStructure, 'webhookProfile', cellCallbackMapping, 'webhookProfileId')
            setColumns(newColumns);
            dispatch({
                type: '@@shipperWebhookProfile/SET_LIST_LOADING', payload: {
                    columns: false
                }
            })
        }

    }, [columnsSelector])

    useEffect(() => {
        if (toastObject?.message) {
            toast.add(toastObject?.message, toastObject?.icon || '', toastObject?.remove || false);
        }

        toastDispatch({
            type: '@@globalToast/clear'
        })
        document.querySelector('.sidebar-container.ng-scope')?.scrollTo(0, 0)
        if (pageType === 'list') {
            // handleFetchData({});
        }
    }, [pageType])

    // menuclick to navigate to list
    useEffect(() => {
        if (pageType === 'form') {
            setIsNavigatetoList(true)
        }
    }, [navigateToList])

    useEffect(() => {
        if (webhookActivationRequest) {
            handleModalPopup('activateWebhook')
        }
    }, [webhookActivationRequest])

    // delete and activate popups
    const handleModalPopup = (modaltype: string) => {
        if (modaltype === 'deleteWebhook') {
            globalPopupDispatch({
                type: '@@globalPopup/SET_PROPS',
                payload: {
                    isOpen: true,
                    title: dynamicLabels?.deletionConformation,
                    content: (
                        <div style={{ fontSize: '14px' }}>
                            <Box horizontalSpacing='5px'>

                                <span>
                                    {dynamicLabels?.delete_Confirmation_Warning}<br /><br />
                                    <FontIcon color='error.main' variant='icomoon-warning-circled' size={14} />
                                    {dynamicLabels?.youCantUndoThisAction}
                                </span>
                            </Box>
                        </div>
                    ),
                    footer: (
                        <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                            <IconButton  id="ShipperWebhookProfile-actionBar-delete" iconVariant='icomoon-delete-empty' primary onClick={deleteSelectedRows}>
                                {dynamicLabels.Delete}
                            </IconButton>
                            <IconButton id="ShipperWebhookProfile-actionBar-cancel" iconVariant='icomoon-close' iconSize={11} onClick={() => globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })}>
                                {dynamicLabels.cancel}
                            </IconButton>
                        </Box>
                    ),
                    onClose: () => globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })
                }
            })
        } else if (modaltype === 'activateWebhook') {
            globalPopupDispatch({
                type: '@@globalPopup/SET_PROPS',
                payload: {
                    isOpen: true,
                    title: dynamicLabels?.statusConfirmation,
                    content: (
                        <>
                            <div style={{ fontSize: '14px' }}>
                                {webhookActivationRequest?.activeRequest
                                    ? dynamicLabels.areYouSureYouWantToMarkAsAcitve
                                    : dynamicLabels.areYouSureYouWantToMarkAsInactive}
                            </div>
                        </>
                    ),
                    footer: (
                        <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                            <IconButton id="ShipperWebhookProfile-actionBar-ok" iconVariant='icomoon-tick-circled' primary onClick={handleWebhookActivation}>
                                {dynamicLabels.ok}
                            </IconButton>
                            <IconButton
                            id="ShipperWebhookProfile-actionBar-cancel"
                                iconVariant='icomoon-close'
                                iconSize={11}
                                onClick={() => {
                                    webhookActivationRequest?.failureCallback &&
                                        webhookActivationRequest?.failureCallback(!webhookActivationRequest.activeRequest);
                                    setWebhookActivationRequest(undefined);
                                    globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })
                                }}
                            >
                                {dynamicLabels.cancel}
                            </IconButton>
                        </Box>
                    ),
                    onClose: () => {
                        webhookActivationRequest?.failureCallback &&
                            webhookActivationRequest?.failureCallback(!webhookActivationRequest.activeRequest);
                        setWebhookActivationRequest(undefined);
                        globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })
                    }
                }
            })
        }

    }

    return (
        <>
            <div id='toast-inject-here'></div>
            {
                pageType === 'list' ?
                    (
                        <WebhookListWrapper className='webhook-list-wrapper' style={{ position: 'relative' }}>
                            <WebhookPageHeader className="webhook-page-header" style={{ marginTop: 0 }}>
                                {dynamicLabels.ShipperWebhookProfile || 'Shipper Webhook Profile'}
                            </WebhookPageHeader>
                            {Object.keys(eventsData).length && pageLabels ?
                                <AddWebhookButtonWrapper className='add-webhook-button-wrapper' style={{ top: '-5px', right: 0 }}>
                                    <Tooltip message={`${dynamicLabels.clickHereToAdd || 'Click here to add '} ${dynamicLabels.ShipperWebhookProfile || 'Shipper Webhook Profile'}.`} hover messagePlacement='end' tooltipDirection='bottom' arrowPlacement='center'>
                                        <IconButton
                                            id="ShipperWebhookProfile-actionBar-add"
                                            onClick={() => { setPageType('form') }}
                                            primary={false}
                                            disabled={false}
                                            intent='page'
                                            iconVariant='icomoon-add'
                                            className="addFromButton"
                                            style={{ padding: '0 10px' }}
                                        >
                                            {dynamicLabels[pageLabels?.buttons.add] || dynamicLabels.add}
                                        </IconButton>
                                    </Tooltip>
                                </AddWebhookButtonWrapper> : <></>}
                            <Box display='flex' flexDirection='column' style={{ width: '100%', height: 'calc(100vh - 130px)', backgroundColor: '#fff', boxShadow: "0 10px 15px -8px rgba(0, 0, 0, 0.24), 0 0 11px 1px rgba(0, 0, 0, 0.12)" }}>
                                <StyledGrid container spacing={5} style={{ flexGrow: 1, overflow: 'hidden', width: '100%' }} className='styled-grid'>
                                    <Grid className='grid-customised-scroll-bar' item style={{ display: 'flex', overflow: 'hidden' }}>
                                        <Card style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', paddingRight: 0, paddingBottom: 0 }}>
                                            {(rowsSelector?.length > 0) && (
                                                <ListViewWrapper className='WebhookListViewWrapper list-view-wrapper'>
                                                    <ListView
                                                        rowIdentifier='webhookProfileId'
                                                        style={{ height: '100%', overflow: 'visible' }}
                                                        columns={columns}
                                                        data={rowsSelector}
                                                        onFetchData={handleFetchData}
                                                        onSaveColumnPreferences={onSaveColumnPreferences}
                                                        hideColumnSettings={true}
                                                        totalRows={totalRowsSelector}
                                                        loading={listLoading}
                                                        isColumnLoading={columnLoading}
                                                        hasRowSelectionWithEdit={true}
                                                        onRowEditClick={onRowEditClick}
                                                        onRowSelect={onRowSelect}
                                                    >
                                                        {{
                                                            ActionBar: (
                                                                <Box display='flex' horizontalSpacing='10px'>
                                                                    {Object.keys(actionBarButtons).map(
                                                                        (buttonKey, index) =>
                                                                            <Tooltip key={buttonKey} message={dynamicLabels?.WebhookDeleteTooltipMsg || `Click here to delete the selected Webhook Profile(s).`} hover messagePlacement={index === 0 ? 'start' : 'center'}>
                                                                                <IconButton
                                                                                    key={buttonKey}
                                                                                    disabled={!Object.keys(selectedRows).length}
                                                                                    intent='table'
                                                                                    iconVariant={iconsMapping[buttonKey]}
                                                                                    id={`listView-actionBar-${buttonKey}`}
                                                                                    onClick={() => {
                                                                                        // setShowDeletionConfirmation(true);
                                                                                        handleModalPopup('deleteWebhook')
                                                                                    }}
                                                                                >
                                                                                    {actionBarButtons[buttonKey].label}
                                                                                </IconButton>

                                                                            </Tooltip>
                                                                    )}
                                                                </Box>
                                                            )
                                                        }}
                                                    </ListView>
                                                </ListViewWrapper>
                                            )}
                                            {rowsSelector?.length === 0 && columns.length > 0 && (<>
                                                <NodataWrapper>
                                                    <img src='images/group.png' width="355px" height="189px" />
                                                    <div className="no-data-text">{dynamicLabels.NoShipperWebhookProfiles || 'No Shipper Webhook Profile added yet. Click on the button below to add Webhook Profile.'}</div>
                                                    <FormActionButton className="form-action-button" iconVariant='icomoon-add' onClick={() => { setPageType('form') }} primary>{dynamicLabels.add || 'Add'} {dynamicLabels.ShipperWebhookProfile || 'Shipper Webhook Profile'}</FormActionButton>
                                                </NodataWrapper>
                                            </>)}
                                        </Card>
                                    </Grid>
                                </StyledGrid>
                            </Box>
                        </WebhookListWrapper>
                    ) : <WebhookProfile onFormCancel={onCancel} subClientId={subClientId} isNavigatetoList={isNavigatetoList} setIsNavigatetoList={setIsNavigatetoList} />}
        </>
    )
}

export default withThemeProvider(withToastProvider(withRedux(withPopup(ShipperWebhookProfile)), 'toast-inject-here'))