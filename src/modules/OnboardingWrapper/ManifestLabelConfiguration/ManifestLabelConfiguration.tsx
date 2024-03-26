import React, { Dispatch, useEffect, useState } from 'react';
import withRedux from '../../../utils/redux/withRedux';
import { withThemeProvider } from '../../../utils/theme';
import {
    withToastProvider, withPopup, IListViewColumn, ISelectedRows, useToast, Box, BreadCrumb, IconButton, Grid, Card, ListView,
    IListViewRow, IFetchDataOptions, ModalHeader, Modal, Tooltip
} from 'ui-library';
import { ManifestLabelConfigActions } from './ManifestLabelConfiguration.actions';
import { useDispatch } from 'react-redux';
import { tGlobalToastActions } from '../../common/GlobalToasts/globalToast.reducer';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import { transformMongoListViewToColumns } from '../../../utils/mongo/ListView';
import { IRowData } from './ManifestLabelConfiguration.models';
import ga, { sendGA } from '../../../utils/ga';
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import { ColumnInstance } from 'react-table'
import { ListGridWrapper, StyledGrid, AddButtonWrapper } from './StyledManifestLabelConfiguration';
import CreateActionBarButton from '../../common/ActionBar/CreateActionBarButton'
import ManifestLabelConfigurationForm from './ManifestLabelConfigurationForm'
import { debounce } from '../../../utils/commonFunctions/lodashFunctions';
export interface IManifestLabelConfigurationProp {
    navigateToList?: boolean
}

const ManifestLabelConfiguration = ({ navigateToList }: IManifestLabelConfigurationProp) => {

    const dispatch = useDispatch<Dispatch<ManifestLabelConfigActions>>()
    const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()
    const pageLabels = useTypedSelector(state => state.pageLabels.manifestLabelConfiguration)
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.manifestLabelConfiguration)
    const structure = useTypedSelector(state => state.manifestLabelConfiguration.structure)
    const columnsSelector = useTypedSelector(state => state.manifestLabelConfiguration.structure.columns)
    const actionBarButtons = useTypedSelector(state => state.manifestLabelConfiguration.structure.buttons);
    const rowCount = useTypedSelector(state => state.manifestLabelConfiguration.data.totalCount)
    const rowsSelector = useTypedSelector(state => state.manifestLabelConfiguration.data.results)
    const loading = useTypedSelector(state => state.manifestLabelConfiguration.loading.listView)
    const columnsLoading = useTypedSelector(state => state.manifestLabelConfiguration.loading.columns);
    const toastObject = useTypedSelector(state => state.globalToast);

    const [columns, setColumns] = useState<IListViewColumn[]>([])
    const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});
    const [pageType, setPageType] = useState<string>('list');
    const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
    const [manifestLabelActivationRequest, setManifestLabelActivationRequest] = useState<
        | { activeRequest: boolean; templateIds: Record<number, boolean>; failureCallback?: React.Dispatch<React.SetStateAction<boolean>> }
        | undefined
    >();

    const toast = useToast()

    const breadCrumbOptions = React.useMemo(() => [
        { id: 'manifestLabelConfiguration', label: dynamicLabels.MANIFEST_LABEL_CONFIGURATION || 'Manifest Label Configuration' }
    ], [dynamicLabels])

    useEffect(() => {
        dispatch({
            type: '@@manifestLabelConfig/SET_COLUMNS_LOADING',
            payload: { columns: true }
        })
        dispatch({ type: '@@manifestLabelConfig/FETCH_STRUCTURE' });
        dispatch({ type: '@@manifestLabelConfig/INITIALISE_FORM' });
        if (toastObject?.message) {
            toast.add(toastObject?.message, toastObject?.icon || '', toastObject?.remove || false);
        }
    }, [])

    useEffect(() => {
        const mongoStructure = columnsSelector;
        if (Object.keys(mongoStructure).length) {
            const newColumns = transformMongoListViewToColumns(mongoStructure, 'manifestLabelConfiguration', cellCallbackMapping);
            setColumns(newColumns);
        }
    }, [columnsSelector]);

    useEffect(() => {
        toastDispatch({
            type: '@@globalToast/clear'
        })
        window.scrollTo(0, 0);
        if (pageType === 'list') {
            handleFetchData({});
        }
    }, [pageType])

    useEffect(() => {
        setPageType('list')
    }, [navigateToList])

    const handleActiveFlChange = (
        isChecked: boolean,
        { templateId }: IRowData,
        failureCallback: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
        const templateIds = {
            [templateId]: true,
        };
        setManifestLabelActivationRequest({ activeRequest: isChecked, templateIds, failureCallback });
    };

    const cellCallbackMapping = {
        isActiveFl: handleActiveFlChange
    };

    const onCancel = () => {
        setPageType('list')
    }

    const onRowSelect = React.useCallback((s: ISelectedRows) => {
        setSelectedRows(s);
    }, [])

    const onSaveColumnPreferences = React.useCallback(async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {

        sendGA('Column Preference Action', 'Manifest Label Configuration - Save & Apply column');

        const columns = { ...columnsSelector }
        Object.keys(columns).forEach((columnKey) => {
            columns[columnKey].permission = !!visibleColumns[columnKey]
        })
        const payload = {
            ...structure,
            columns
        }
        try {
            const { data: { message } } = await axios.put(apiMappings.manifestLabelConfiguration.listView.structure, payload)
            message && toast.add(message, 'check-round', false)
        } catch (error) {
            console.log(error, error?.response)
        }

    }, [columnsSelector])

    const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }) => {
        dispatch({
            type: '@@manifestLabelConfig/SET_LOADING',
            payload: { listView: true }
        })

        setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis });

        dispatch({
            type: '@@manifestLabelConfig/FETCH_DATA',
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

    const handleManifestLabelConfigurationActivation = async () => {
        if (!manifestLabelActivationRequest) {
            return;
        }
        setManifestLabelActivationRequest(undefined);

        let payload = {}

        if (Object.keys(manifestLabelActivationRequest.templateIds).length === 1) {
            const templateId = Number(Object.keys(manifestLabelActivationRequest.templateIds)[0]);
            dispatch({
                type: '@@manifestLabelConfig/CHANGE_STATUS',
                payload: {
                    templateId,
                    isActiveFl: manifestLabelActivationRequest.activeRequest
                },
            });
            payload = {
                type: "MANIFESTLABEL",
                templateId: templateId
            }
        }


        try {
            const {
                data: { message, status },
            } = await axios.put(apiMappings.manifestLabelConfiguration.listView.activationRequest + `?&isActive=${manifestLabelActivationRequest.activeRequest}`, payload);
            if (status === 200) {
                toast.add(manifestLabelActivationRequest.activeRequest ? `${dynamicLabels?.manifestLabelTemplateActivatedSuccessfully || message}` : `${dynamicLabels?.manifestLabelTemplateInactivatedSuccessfully || message}`, 'check-round', false);

                handleFetchData(fetchOptions);
                setSelectedRows({});
                fetchOptions.apis?.resetSelection();
                return;
            }
            throw message;
        } catch (errorMessage) {
            manifestLabelActivationRequest.failureCallback && manifestLabelActivationRequest.failureCallback(!manifestLabelActivationRequest.activeRequest);
            toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false);
        }
    };

    const handleAddManifestLabel = () => {
        sendGA('Navigation', 'Manifest Label Configuration - Add button');
        setPageType('form')
    }

    const onRowEditClick = React.useCallback((row: IListViewRow) => {
        dispatch({
            type: '@@manifestLabelConfig/SET_DATA', payload: {
                key: 'isEditManifestLabel',
                value: row
            }
        })
        setSelectedRows({})
        setPageType('form');
    }, []);

    const setAsFavourite = debounce (async (row: ISelectedRows) => {
        dispatch({ type: '@@manifestLabelConfig/SET_LOADING', payload: { listView: true } })
        try {
            const isActiveFl = Object.values(row)?.map(row => Boolean(row.isActiveFl))?.[0]
            if (!isActiveFl) {
                toast.add(dynamicLabels?.manifestMarkAsFavouriteInactiveMessage, 'warning', false);
                dispatch({ type: '@@manifestLabelConfig/SET_LOADING', payload: { listView: false } })
                return;
            }
            let payload = {
                type: "MANIFESTLABEL",
                templateId: `${(Object.keys(row).map((rowId: string) => Number(rowId)))[0]}`
            }
            const {
                data: { message, status },
            } = await axios.put(`${apiMappings.manifestLabelConfiguration.listView.setFavourite}`, payload);
            if (status === 200) {
                toast.add(dynamicLabels?.manifestLabelmarkedAsFavourite || message, 'check-round', false);

                setSelectedRows && setSelectedRows({});
                dispatch({ type: '@@manifestLabelConfig/SET_LOADING', payload: { listView: false } })
                fetchOptions.apis?.resetSelection();
                handleFetchData(fetchOptions)
                return;
            }
            throw message;
        } catch (errorMessage) {
            dispatch({ type: '@@manifestLabelConfig/SET_LOADING', payload: { listView: false } })
            toast.add(dynamicLabels.somethingWendWrong, 'warning', false);
        }
    },500)

    return (
        <>
            <div id='toast-inject-here'></div>
            {
                pageType === 'list' ?
                    (
                        <Box display='flex' flexDirection='column' style={{ width: '100%', height: '100%' }} pb='15px'>
                            {/* Header */}
                            <Box display='flex' justifyContent='space-between' style={{ width: '100%', marginTop: '20px' }}>
                                <BreadCrumb options={breadCrumbOptions} onClick={() => { }} />
                                {/* Page Action Buttons */}
                                {pageLabels?.buttons.add &&
                                    <AddButtonWrapper className="add-button-wrapper">
                                        <Tooltip tooltipDirection="bottom" arrowPlacement="center" messagePlacement="end" message={`${dynamicLabels.clickHereToAdd} ${dynamicLabels?.manifestLabelTemplate || 'Manifest Template Label'}.`} hover={true}>
                                            <IconButton id = 'manifest_label_configuration-actionbar-add' intent='page' iconVariant='icomoon-add' onClick={handleAddManifestLabel}>
                                                {dynamicLabels?.[pageLabels?.buttons.add] || dynamicLabels.add}
                                            </IconButton>
                                        </Tooltip>
                                    </AddButtonWrapper>

                                }
                            </Box>

                            {/* LIST VIEW CONTAINER */}
                            <ListGridWrapper className="list-grid-wrapper" container spacing={5} style={{ marginTop: '20px' }}>
                                <Grid item md={12} style={{ display: 'flex', overflow: 'hidden' }}>
                                    <StyledGrid container spacing={15} style={{ boxShadow: '0 2px 20px -10px #000' }}>
                                        <Grid
                                            className='grid-customised-scroll-bar'
                                            item
                                            style={{ display: 'flex', overflow: 'hidden' }}
                                        >
                                            <Card style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', paddingRight: 0, paddingBottom: 0 }}>
                                                {columns.length > 0 &&
                                                    <ListView
                                                        rowIdentifier='templateId'
                                                        hasRowSelectionWithEdit={true}
                                                        columns={columns}
                                                        data={rowsSelector}
                                                        totalRows={rowCount}
                                                        onFetchData={handleFetchData}
                                                        onRowSelect={onRowSelect}
                                                        loading={loading || false}
                                                        hideRefresh={loading }
                                                        isColumnLoading={columnsLoading}
                                                        onSaveColumnPreferences={onSaveColumnPreferences}
                                                        onRowEditClick={onRowEditClick}
                                                        style={{ height: '90vh' }}
                                                        showFavouriteStar={true}
                                                    // favouriteIcon='star-filled'
                                                    // isFavouriteSelection={true}

                                                    >
                                                        {{
                                                            ActionBar: (
                                                                <Box display='flex' horizontalSpacing='10px'>
                                                                    {actionBarButtons &&
                                                                        Object.keys(actionBarButtons).map((buttonKey, index) => {
                                                                            return <CreateActionBarButton
                                                                                id = "manifest_label_configuration-actionbar-{{buttonKey}}"
                                                                                buttonKey={buttonKey}
                                                                                buttonIndex={index}
                                                                                actionBarButton={actionBarButtons[buttonKey]}
                                                                                buttonToolTipTextList={actionBarButtons[buttonKey].label}
                                                                                selectedRows={selectedRows}
                                                                                handleActionBarButtonClick={() => setAsFavourite(selectedRows)}
                                                                                isButtonDisabled={Object.keys(selectedRows).length !== 1 && actionBarButtons[buttonKey].permission || (Object.keys(selectedRows).length ? selectedRows[Object.keys(selectedRows)[0]].isFavourite : false)} />
                                                                        })
                                                                    }
                                                                </Box>
                                                            )
                                                        }}
                                                    </ListView>
                                                }
                                            </Card>
                                        </Grid>
                                    </StyledGrid>
                                </Grid>
                            </ListGridWrapper>
                        </Box>
                    ) : <ManifestLabelConfigurationForm onFormCancel={onCancel} />
            }

            {/* ACTIVATION CONFIRMATION MODAL */}
            <Modal open={!!manifestLabelActivationRequest} onToggle={() => { }} size='md'>
                {{
                    header: (
                        <ModalHeader
                            headerTitle={dynamicLabels?.statusConfirmation}
                            imageVariant='icomoon-close'
                            handleClose={() => {
                                manifestLabelActivationRequest?.failureCallback &&
                                    manifestLabelActivationRequest?.failureCallback(!manifestLabelActivationRequest.activeRequest);
                                setManifestLabelActivationRequest(undefined);
                            }}
                        />
                    ),
                    content: (
                        <>
                            <div style={{ fontSize: '14px' }}>
                                {manifestLabelActivationRequest?.activeRequest
                                    ? dynamicLabels.areYouSureYouWantToMarkAsAcitve
                                    : dynamicLabels.areYouSureYouWantToMarkAsInactive}
                            </div>
                        </>
                    ),
                    footer: (
                        <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                            <IconButton id={`Manifest-Label-Active/Inactive-Modal-Ok`} iconVariant='icomoon-tick-circled' primary onClick={handleManifestLabelConfigurationActivation}>
                                {dynamicLabels.ok}
                            </IconButton>
                            <IconButton
                                id={`Manifest-Label-Active/Inactive-Modal-Cancel`}
                                iconVariant='icomoon-close'
                                iconSize={11}
                                onClick={() => {
                                    manifestLabelActivationRequest?.failureCallback &&
                                        manifestLabelActivationRequest?.failureCallback(!manifestLabelActivationRequest.activeRequest);
                                    setManifestLabelActivationRequest(undefined);
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
export default withThemeProvider(withToastProvider(withRedux(withPopup(ManifestLabelConfiguration)), 'toast-inject-here'))

