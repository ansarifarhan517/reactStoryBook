import React, { Dispatch, useCallback, useEffect, useState } from "react";
import { Box, BreadCrumb, Tooltip, IconButton, withToastProvider, withPopup, Grid, Card, ListView, IListViewColumn, ISelectedRows, IFetchDataOptions, Modal, ModalHeader, useToast, IListViewRow } from 'ui-library';
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import withRedux from "../../../../utils/redux/withRedux";
import { withThemeProvider } from "../../../../utils/theme";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels';
import { AddButtonWrapper, ListGridWrapper, StyledGrid } from "./StyledDrsLabelConfiguration";
import { DRSTemplateConfigActions } from "./DRSTemplateConfiguration.actions";
import { useDispatch } from "react-redux";
import CreateActionBarButton from '../../../common/ActionBar/CreateActionBarButton'
import { transformMongoListViewToColumns } from "../../../../utils/mongo/ListView";
import { IRowData } from "./DRSTemplateConfiguration.models";
import apiMappings from "../../../../utils/apiMapping";
import axios from "../../../../utils/axios";
import DRSTemplateConfigurationForm from "./DRSTemplateConfigurationForm";
import { sendGA } from "../../../../utils/ga";
import { ColumnInstance } from 'react-table';
import { debounce } from "../../../../utils/commonFunctions/lodashFunctions";



export interface IDRSTemplateConfigurationProp {
    navigateToList?: boolean
}
const DRSTemplateConfiguration = ({ navigateToList }) => {

    const pageLabels = useTypedSelector(state => state.pageLabels.manifestLabelConfiguration)
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.drsTemplateConfiguration)
    const dispatch = useDispatch<Dispatch<DRSTemplateConfigActions>>()
    const { structure, loading, data } = useTypedSelector(state => state.drsTemplateConfiguration)
    const [columns, setColumns] = useState<IListViewColumn[]>([])
    const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});
    const [drsTemplateActivationRequest, setDrsTemplateActivationRequest] = useState<
        | { activeRequest: boolean; drsIds: Record<number, boolean>; failureCallback?: React.Dispatch<React.SetStateAction<boolean>> }
        | undefined
    >();
    const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});

    const toast = useToast()
    const [pageType, setPageType] = useState<string>('list');

    const handleAddDRSTemplate = () => {
        sendGA('Navigation', 'DRS Template Configuration - Add button');
        setPageType('form')
    }

    const breadCrumbOptions = React.useMemo(() => [{ id: 'drsTemplateConfiguration', label: dynamicLabels.DRS_TEMPLATE_CONFIGURATION || 'DRS TEMPLATE CONFIGURATION' }
    ], [dynamicLabels])

    useEffect(() => {
        dispatch({
            type: '@@drsTemplateConfig/SET_COLUMNS_LOADING',
            payload: { columns: true }
        })
        dispatch({ type: '@@drsTemplateConfig/GET_STRUCTURE' })
    }, [])

    useEffect(() => {
        setPageType('list')
    }, [navigateToList])


    const setAsFavourite = debounce(async (row: ISelectedRows) => {
        dispatch({ type: '@@drsTemplateConfig/SET_LOADING', payload: { listView: true } })
        try {
            const isActiveFl = Object.values(row)?.map(row => Boolean(row.isActiveFl))?.[0]
            if (!isActiveFl) {
                toast.add(dynamicLabels?.drsMarkAsFavouriteInactiveMessage, 'warning', false);
                dispatch({ type: '@@drsTemplateConfig/SET_LOADING', payload: { listView: false } })
                return;
            }
            let payload = {
                type: "DRS_TEMPLATE",
                templateId: `${(Object.keys(row).map((rowId: string) => Number(rowId)))[0]}`
            }

            const {
                data: { message, status },
            } = await axios.put(`${apiMappings.drsTemplateConfiguration.listView.setFavourite}`, payload);
            if (status === 200) {
                toast.add(dynamicLabels.drsTemplatemarkedAsFavourite || message, 'check-round', false);
                setSelectedRows && setSelectedRows({});
                dispatch({ type: '@@drsTemplateConfig/SET_LOADING', payload: { listView: false } })
                fetchOptions.apis?.resetSelection();
                handleFetchData(fetchOptions)
                return;
            }
            throw message;
        } catch (errorMessage) {
            dispatch({ type: '@@drsTemplateConfig/SET_LOADING', payload: { listView: false } })
            toast.add(dynamicLabels.somethingWendWrong, 'warning', false);
        }

    },500)

    const onSaveColumnPreferences = useCallback(async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
        const columns = { ...structure.columns }
        Object.keys(columns).forEach((columnKey) => {
            columns[columnKey].permission = !!visibleColumns[columnKey]
        })
        const payload = {
            ...structure,
            columns
        }
        try {
            const { data: { message } } = await axios.put(apiMappings.drsTemplateConfiguration.listView.structure, payload)
            message && toast.add(message, 'check-round', false)
        } catch (error) {
            console.log(error, "An error occured")
        }

    }, [structure.columns])

    const onRowSelect = React.useCallback((s: ISelectedRows) => {
        setSelectedRows(s);
    }, [])

    const onRowEditClick = (row: IListViewRow) => {
        if(row?.clientId!==0) {
            dispatch({
                type: '@@drsTemplateConfig/SET_DATA', payload: {
                    key: 'isEditDrsTemplate',
                    value: row
                }
            })
            setSelectedRows({})
            setPageType('form');
        }
        else {
            toast.add(dynamicLabels.cannotEditLNDefTemplate, "warning", false);
        } 
    }

    useEffect(() => {
        const mongoStructure = structure?.columns;
        if (Object.keys(mongoStructure).length) {
            const newColumns = transformMongoListViewToColumns(mongoStructure, 'drsTemplateConfiguration', cellCallbackMapping);

            setColumns(newColumns);
        }
    }, [structure?.columns]);

    const handleActiveFlChange = (
        isChecked: boolean,
        { templateId ,isFavourite }: IRowData,
        failureCallback: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
        if(isFavourite){
            toast.add(dynamicLabels.favouriteDrsTemplateInActiveErrorMessage || 'Cannot mark favourite DRS template as inactive ' ,'warning', false)
        }
        else{
            const drsIds = {
                [templateId]: true,
            };
            setDrsTemplateActivationRequest({ activeRequest: isChecked, drsIds, failureCallback });
        }
    };

    const cellCallbackMapping = {
        isActiveFl: handleActiveFlChange
    };

    const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }) => {
        dispatch({
            type: '@@drsTemplateConfig/SET_LOADING',
            payload: { listView: true }
        })
        setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis })
        dispatch({
            type: '@@drsTemplateConfig/FETCH_DATA',
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

    const handleDrsTemplateConfigurationActivation = async () => {
        if (!drsTemplateActivationRequest) {
            return;
        }
        setDrsTemplateActivationRequest(undefined);
        let payload = {}
        if (Object.keys(drsTemplateActivationRequest.drsIds).length === 1) {
            const drsTemplateId = Number(Object.keys(drsTemplateActivationRequest.drsIds)[0]);
            dispatch({
                type: '@@drsTemplateConfig/CHANGE_STATUS',
                payload: {
                    drsTemplateId,
                    isActiveFl: drsTemplateActivationRequest?.activeRequest
                }
            })
            payload = {
                type: "DRS_TEMPLATE",
                templateId: drsTemplateId
            }

        }
        try {
            const { data: { message, status } } = await axios.put(apiMappings.drsTemplateConfiguration.listView.activationRequest + `?isActive=${drsTemplateActivationRequest.activeRequest}`, payload)
            if (status === 200) {
                toast.add(drsTemplateActivationRequest.activeRequest ? `${dynamicLabels?.drsTemplateActivatedSuccessfully || message}` : `${dynamicLabels?.drsTemplateInactivatedSuccessfully || message}`, 'check-round', false);
                handleFetchData(fetchOptions);
                setSelectedRows({});
                fetchOptions.apis?.resetSelection();
                return;
            }
            throw message;
        }
        catch (errorMessage) {
            drsTemplateActivationRequest.failureCallback && drsTemplateActivationRequest.failureCallback(!drsTemplateActivationRequest.activeRequest);
            toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false);
        }
    }

    const onCancel = () => {
        setPageType('list')
    }
    return (
        <>
            <div id='toast-inject-here'></div>
            {
                pageType === 'list' ?
                    (<Box display="flex" flexDirection="column" style={{ width: '100%', height: '100%' }} px='15px' pb="15px">
                        {/* Header */}
                        <Box display="flex" justifyContent="space-between" style={{ width: '100%', marginTop: "20px" }}>
                            <BreadCrumb options={breadCrumbOptions} onClick={() => { }} />
                            {/* Page Action Buttons */}
                            {pageLabels?.buttons.add &&
                                <AddButtonWrapper className="add-button-wrapper">
                                    <Tooltip tooltipDirection="bottom" arrowPlacement="center" messagePlacement="end" message={`${dynamicLabels.clickHereToAdd} ${dynamicLabels?.drsTemplate}.`} hover={true}>
                                        <IconButton id='DRSConfiguration-actionBar-add' intent='page' iconVariant='icomoon-add' onClick={handleAddDRSTemplate} className='addFormButton'>
                                            {dynamicLabels?.[pageLabels?.buttons.add] || dynamicLabels.add}
                                        </IconButton>
                                    </Tooltip>
                                </AddButtonWrapper>

                            }
                        </Box>
                        {/* ListViewContainer */}
                        <ListGridWrapper className="list-grid-wrapper" container spacing={5} style={{ marginTop: '20px' }}>
                            <Grid item md={12} style={{ display: 'flex', overflow: 'hidden' }}>
                                <StyledGrid container spacing={15} style={{ boxShadow: '0 2px 20px -10px #000' }}>
                                    <Grid
                                        className='grid-customised-scroll-bar'
                                        item
                                        style={{ display: 'flex', overflow: 'hidden' }}
                                    >
                                        <Card style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', paddingRight: 0, paddingBottom: 0 }}>
                                            <ListView
                                                rowIdentifier="templateId"
                                                hasRowSelectionWithEdit={true}
                                                columns={columns}
                                                data={data?.results}
                                                totalRows={data?.totalCount}
                                                onFetchData={handleFetchData}
                                                onRowSelect={onRowSelect}
                                                loading={loading?.listView || false}
                                                isColumnLoading={loading?.columns}
                                                onSaveColumnPreferences={onSaveColumnPreferences}
                                                onRowEditClick={onRowEditClick}
                                                style={{ height: '90vh' }}
                                                showFavouriteStar={true}
                                            >
                                                {{
                                                    ActionBar: (
                                                        <Box display='flex' horizontalSpacing='10px'>
                                                            {structure?.buttons &&
                                                                Object.keys(structure?.buttons).map((buttonKey, index) => {
                                                                    return <CreateActionBarButton
                                                                        buttonKey={buttonKey}
                                                                        buttonIndex={index}
                                                                        actionBarButton={structure?.buttons[buttonKey]}
                                                                        buttonToolTipTextList={structure?.buttons[buttonKey].label}
                                                                        selectedRows={selectedRows}
                                                                        handleActionBarButtonClick={() => setAsFavourite(selectedRows)}
                                                                        isButtonDisabled={Object.keys(selectedRows).length !== 1 && structure?.buttons[buttonKey].permission || (Object.keys(selectedRows).length ? selectedRows[Object.keys(selectedRows)[0]].isFavourite : false)} />
                                                                })
                                                            }
                                                        </Box>
                                                    )
                                                }}

                                            </ListView>

                                        </Card>

                                    </Grid>
                                </StyledGrid>
                            </Grid>
                        </ListGridWrapper>
                    </Box>) : <DRSTemplateConfigurationForm onFormCancel={onCancel} />
            }

            {/* Activation Confirmation Modal */}
            <Modal open={!!drsTemplateActivationRequest} onToggle={() => { }} size='md'>
                {{
                    header: (
                        <ModalHeader
                            headerTitle={dynamicLabels?.statusConfirmation}
                            imageVariant='icommoon-close'
                            handleClose={() => {
                                drsTemplateActivationRequest?.failureCallback &&
                                    drsTemplateActivationRequest?.failureCallback(!drsTemplateActivationRequest?.activeRequest)
                                setDrsTemplateActivationRequest(undefined)
                            }} />
                    ),
                    content: (
                        <div style={{ fontSize: '14px' }}>
                            {drsTemplateActivationRequest?.activeRequest
                                ? dynamicLabels.areYouSureYouWantToMarkAsAcitve
                                : dynamicLabels.areYouSureYouWantToMarkAsInactive}

                        </div>
                    ),
                    footer: (
                        <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                            <IconButton id={`DRSConfiguration-actionBar-${drsTemplateActivationRequest?.activeRequest
                                ? 'MarkAsAcitve'
                                : 'MarkAsInactive'}-ok`} iconVariant="icommon-tick-circle" primary onClick={handleDrsTemplateConfigurationActivation}>
                                {dynamicLabels.ok}
                            </IconButton>
                            <IconButton
                                id='DRSConfiguration-actionBar-cancel' 
                                iconVariant="icomoon-close"
                                iconSize={11}
                                onClick={() => {
                                    drsTemplateActivationRequest?.failureCallback &&
                                        drsTemplateActivationRequest?.failureCallback(!drsTemplateActivationRequest?.activeRequest)
                                    setDrsTemplateActivationRequest(undefined)
                                }}>
                                {dynamicLabels.cancel}
                            </IconButton>
                        </Box>
                    )

                }}
            </Modal>
        </>
    )
}

export default withThemeProvider(withToastProvider(withRedux(withPopup(DRSTemplateConfiguration)), 'toast-inject-here'))