import React, { Dispatch, useEffect, useState } from 'react'
import withRedux from '../../../../../utils/redux/withRedux'
import { withThemeProvider } from '../../../../../utils/theme'
import { withPopup, withToastProvider, Box, IListViewColumn, IFetchDataOptions, ListView, useToast, Grid, Card, Tooltip, IconButton, ISelectedRows, ModalHeader, Modal, IListViewRow } from 'ui-library'
import { useTypedSelector } from '../../../../../utils/redux/rootReducer'
import AddBranchWebhookProfile from './AddBranchWebhookProfile'
import { useDispatch } from 'react-redux'
import { BranchWebhookProfileActions } from './BranchWebhookProfile.actions'
import apiMappings from '../../../../../utils/apiMapping'
import axios from '../../../../../utils/axios' 
import { transformMongoListViewToColumns } from '../../../../../utils/mongo/ListView'
import { AddWebhookButtonWrapper, FormActionButton, ListViewWrapper, NodataWrapper, StyledGrid, WebhookListWrapper, WebhookPageHeader } from '../subComponents/styledComponents'
import { ColumnInstance } from 'react-table'
import iconsMapping from '../../../../../utils/mongo/ListView/actionBarIcons.mapping'
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels'
import { IBranchWebhookList } from './BranchWebhookProfile.reducer'
import { tGlobalToastActions } from '../../../../common/GlobalToasts/globalToast.reducer'
import DeleteConfirmationModal from '../../../../../utils/components/DeleteConfirmationModal'

export interface IBranchWebhookProfileProp {   
    navigateToList? : boolean     
  }
  
const BranchWebhookProfile = ({navigateToList}: IBranchWebhookProfileProp) => {
    const dispatch = useDispatch<Dispatch<BranchWebhookProfileActions>>()
    const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()

    const toast = useToast()

    const pageLabels = useTypedSelector(state => state.pageLabels.branchWebhookProfiles);
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.webHooks);

    const structure = useTypedSelector(state => state.branchWebhookProfile.listStructure)
    const columnsSelector = useTypedSelector(state => state.branchWebhookProfile.listStructure.columns);
    const rowsSelector = useTypedSelector(state => state.branchWebhookProfile.data.results)
    const totalRowsSelector = useTypedSelector(state => state.branchWebhookProfile.data.totalCount)
    const actionBarButtons = useTypedSelector(state => state.branchWebhookProfile.listStructure.buttons)
    const listLoading = useTypedSelector(state => state.branchWebhookProfile.loading.listView)
    const columnLoading = useTypedSelector(state => state.branchWebhookProfile.loading.columns)
    const toastObject = useTypedSelector(state => state.globalToast);
    const eventsData = useTypedSelector(state => state.branchWebhookProfile.events)

    const [pageType, setPageType] = useState<string>('list');
    const [columns, setColumns] = useState<IListViewColumn[]>([]);
    const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
    const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});
    const [webhookActivationRequest, setWebhookActivationRequest] = useState<
        | { activeRequest: boolean; selectedWebhook: IBranchWebhookList; failureCallback?: React.Dispatch<React.SetStateAction<boolean>> }
        | undefined
    >();
    const [showDeletionConfirmation, setShowDeletionConfirmation] = useState<boolean>(false);


    const onCancel = () => {
        setPageType('list')
    }

    const getBranches = async () => {
        try {
            const { data } = await axios.get(apiMappings.branchWebhookProfile.getBranches, {
                data: {}
            });

            dispatch({
                type: '@@branchWebhookProfile/SET_DATA', payload: {
                    key: 'branchList',
                    value: data
                }
            })
        } catch (errorMessage) {
            console.log(errorMessage)
        }
    }

    const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {
        dispatch({
            type: '@@branchWebhookProfile/SET_LIST_LOADING', payload: {
                listView: true
            }
        })
        setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis })
        dispatch({
            type: '@@branchWebhookProfile/FETCH_DATA',
            payload: {
                pageNumber: pageNumber,
                pageSize: pageSize,
                searchBy: filterOptions?.searchBy,
                searchText: filterOptions?.searchText,
                sortBy: sortOptions?.sortBy,
                sortOrder: sortOptions?.sortOrder
            }
        })
    }, [])

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
            console.log(error)
        }


    }, [columnsSelector])

    const onRowSelect = React.useCallback((s: ISelectedRows) => {
        setSelectedRows(s);
    }, []);

    const onRowEditClick = React.useCallback((row: IListViewRow) => {
        dispatch({
            type: '@@branchWebhookProfile/SET_DATA', payload: {
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

        if (webhookActivationRequest?.selectedWebhook?.branchWebhookProfileId) {
            const webhookProfile = webhookActivationRequest.selectedWebhook;
            dispatch({
                type: '@@branchWebhookProfile/UPDATE_DATA',
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
                `${apiMappings.branchWebhookProfile.listView.activeWebhook}${webhookActivationRequest?.selectedWebhook?.branchWebhookProfileId}&isActive=${webhookActivationRequest?.activeRequest}`
            );
            if (status === 200) {
                toast.add(dynamicLabels.statusUpdatedSuccessfully, 'check-round', false);
                // handleFetchData(fetchOptions);
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
        selectedWebhook: IBranchWebhookList,
        failureCallback: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
        // const vehicleIds = {
        //     [selectedWebhook?.webhookProfileId]: true,
        // };
        setWebhookActivationRequest({ activeRequest: isChecked, selectedWebhook, failureCallback });
    };

    const cellCallbackMapping = {
        isActiveFl: handleActiveFlChange
    }

    /** Delete Request */
    const deleteSelectedRows = async () => {

        setShowDeletionConfirmation(false);
        try {
            const webhookProfileIDs = Object.keys(selectedRows);
            const {
                data: data,
            } = await axios.delete(apiMappings.branchWebhookProfile.listView.deleteWebhook, { data: webhookProfileIDs });

            if (data.status === 200) {
                toast.add(`${data?.message}`, 'check-round', false);
                setSelectedRows({});
                fetchOptions.apis?.resetSelection();
                handleFetchData(fetchOptions);
                return;
            }
            throw toast.add(`${data?.message}`, 'warning', false);;
        } catch (errorMessage) {
            toast.add(dynamicLabels.vehicleFailedToBeDeleted, 'warning', false);
        }
    };

    useEffect(() => {
        // getEventsList();
        dispatch({ type: '@@branchWebhookProfile/FETCH_EVENTS_DATA' });
        getBranches();
        dispatch({ type: '@@branchWebhookProfile/FETCH_STRUCTURE' });
    }, [])

    useEffect(() => {
        const mongoStructure = columnsSelector;

        if (Object.keys(mongoStructure).length) {
            const newColumns = transformMongoListViewToColumns(mongoStructure, 'branchWebhookProfile', cellCallbackMapping, 'branchWebhookProfileId')
            setColumns(newColumns);
            dispatch({
                type: '@@branchWebhookProfile/SET_LIST_LOADING', payload: {
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
        window.scrollTo(0, 0);
        if (pageType === 'list') {
            // handleFetchData({});
        }
    }, [pageType])

    useEffect(() => {
        setPageType('list')
    },[navigateToList])

    return (
        <>
            <div id='toast-inject-here'></div>
            {
                pageType === 'list' ?
                    (
                        <WebhookListWrapper className='webhook-list-wrapper'>
                            <WebhookPageHeader className='webhookpage-header'>
                                {dynamicLabels.BranchWebhookProfile || 'Branch Webhook Profile'}
                            </WebhookPageHeader>
                            {(Object.keys(eventsData).length && pageLabels) ?
                                <AddWebhookButtonWrapper className='add-webhook-button-wrapper'>
                                    <Tooltip message={`${dynamicLabels.clickHereToAdd || 'Click here to add '} ${dynamicLabels.BranchWebhookProfile || 'Branch Webhook Profile'}.`} hover messagePlacement='end' tooltipDirection='bottom' arrowPlacement='center'>
                                        <IconButton
                                            id='branchWebhookProfile-actionBar-add'
                                            onClick={() => { setPageType('form')
                                            dispatch({ type: '@@branchWebhookProfile/SET_ADDITIONAL_HEADERS', payload: [] });
                                            }}
                                            primary={false}
                                            intent='page'
                                            iconVariant='icomoon-add'
                                            className="addFromButton"
                                        >
                                            {dynamicLabels[pageLabels?.buttons.add] || dynamicLabels.add}
                                        </IconButton>
                                    </Tooltip>
                                </AddWebhookButtonWrapper> : <></>}
                            <Box display='flex' flexDirection='column' style={{ width: '100%', height: 'calc(100vh - 130px)', backgroundColor: '#fff', boxShadow: "0 10px 15px -8px rgba(0, 0, 0, 0.24), 0 0 11px 1px rgba(0, 0, 0, 0.12)" }}>
                                <StyledGrid container spacing={5} style={{ flexGrow: 1, overflow: 'hidden', width: '100%' }} className='styled-grid'>
                                    <Grid className='grid-customised-scroll-bar' item style={{ display: 'flex', overflow: 'hidden' }}>
                                        <Card style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', paddingRight: 0, paddingBottom: 0 }}>
                                            {(rowsSelector?.length > 0 && columns.length > 0) && (
                                                <ListViewWrapper className='WebhookListViewWrapper list-view-wrapper'>
                                                    <ListView
                                                        rowIdentifier='branchWebhookProfileId'
                                                        style={{ height: '100%', overflow: 'visible' }}
                                                        columns={columns}
                                                        data={rowsSelector}
                                                        onFetchData={handleFetchData}
                                                        onSaveColumnPreferences={onSaveColumnPreferences}
                                                        totalRows={totalRowsSelector}
                                                        loading={listLoading}
                                                        isColumnLoading={columnLoading}
                                                        hasRowSelectionWithEdit={true}
                                                        onRowEditClick={onRowEditClick}
                                                        onRowSelect={onRowSelect}
                                                        hideColumnSettings={true}
                                                    >
                                                        {{
                                                            ActionBar: (
                                                                <Box display='flex' horizontalSpacing='10px'>
                                                                    {Object.keys(actionBarButtons).map(
                                                                        (buttonKey, index) =>
                                                                            <Tooltip key={buttonKey} message={`Click here to ${actionBarButtons[buttonKey].labelKey} the selected Webhook Profile(s)`} hover messagePlacement={index === 0 ? 'start' : 'center'}>
                                                                                <IconButton
                                                                                    key={buttonKey}
                                                                                    disabled={!Object.keys(selectedRows).length}
                                                                                    intent='table'
                                                                                    iconVariant={iconsMapping[buttonKey]}
                                                                                    id={`listView-actionBar-${buttonKey}`}
                                                                                    onClick={() => {
                                                                                        setShowDeletionConfirmation(true);
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
                                                    <div className="no-data-text">{dynamicLabels.NoBranchWebhookProfiles || 'No Branch Webhook Profile added yet. Click on the button below to add Webhook Profile.'}</div>
                                                    <FormActionButton className="form-action-button" iconVariant='icomoon-add' onClick={() => { setPageType('form') }} primary>{dynamicLabels.add || 'Add'} {dynamicLabels.BranchWebhookProfile || 'Branch Webhook Profile'}</FormActionButton>
                                                </NodataWrapper>
                                            </>)}
                                        </Card>
                                    </Grid>
                                </StyledGrid>
                            </Box>
                        </WebhookListWrapper>
                    ) : <AddBranchWebhookProfile onFormCancel={onCancel} />}

            {/* DELETE CONFIRMATION MODAL */}
            <DeleteConfirmationModal
              showDeletionConfirmation={showDeletionConfirmation}
              setShowDeletionConfirmation={(value: boolean) => setShowDeletionConfirmation(value)}
              deleteSelectedRows={deleteSelectedRows}
            />

            {/* ACTIVATION CONFIRMATION MODAL */}
            <Modal open={!!webhookActivationRequest} onToggle={() => { }} size='md'>
                {{
                    header: (
                        <ModalHeader
                            headerTitle={dynamicLabels?.statusConfirmation}
                            imageVariant='icomoon-close'
                            handleClose={() => {
                                webhookActivationRequest?.failureCallback &&
                                    webhookActivationRequest?.failureCallback(!webhookActivationRequest.activeRequest);
                                setWebhookActivationRequest(undefined);
                            }}
                        />
                    ),

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
                            <IconButton id={`branchWebhook-${webhookActivationRequest?.activeRequest
                                    ? 'MarkAsActive'
                                    : 'MarkAsInActive'}-Ok`} iconVariant='icomoon-tick-circled' primary onClick={handleWebhookActivation}>
                                {dynamicLabels.ok}
                            </IconButton>
                            <IconButton
                                id={`branchWebhook-${webhookActivationRequest?.activeRequest
                                    ? 'MarkAsActive'
                                    : 'MarkAsInActive'}-cancel`}
                                iconVariant='icomoon-close'
                                iconSize={11}
                                onClick={() => {
                                    webhookActivationRequest?.failureCallback &&
                                        webhookActivationRequest?.failureCallback(!webhookActivationRequest.activeRequest);
                                    setWebhookActivationRequest(undefined);
                                }}
                            >
                                {dynamicLabels.cancel}
                            </IconButton>
                        </Box>
                    ),
                }}
            </Modal>
        </>
    )
}

export default withThemeProvider(withToastProvider(withRedux(withPopup(BranchWebhookProfile)), 'toast-inject-here'))