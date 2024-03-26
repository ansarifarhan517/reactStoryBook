import React, { Dispatch, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ServiceTypeConfigurationActions } from "../ServiceTypeConfiguration.actions";
import {ListView, IListViewColumn, IFetchDataOptions, IconButton, useToast, ISelectedRows, Tooltip } from "ui-library"
import { ColumnInstance } from "react-table"
import { transformMongoListViewToColumns } from "../../../../../utils/mongo/ListView";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import { sendGA } from "../../../../../utils/ga";
import { ActionBarContainer } from "../ServiceTypeConfigurationStyledComponents";
import { IRowData, IAutoAllocateValues, IBranchMovementValues } from "../ServiceTypeConfiguration.models";
import ActivateDeactivateModal from "../SubComponents/ActivateDeactivateModal";
import axios from "../../../../../utils/axios";
import apiMappings from "../../../../../utils/apiMapping";
import DeleteConfirmationModal from "../../../../../utils/components/DeleteConfirmationModal";
import { closeSideMenu } from "../../../../../utils/helper";
import FileSaver from "file-saver";
import DownloadMessage from "../../../../../utils/components/DownloadMessage";
import { getSearchText } from "../utils"

const AllServiceTypeListView = () => {

    /** General Hooks */
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.settings.serviceTypeConfiguration)
    const toast = useToast()
    const history = useHistory();
    /** Redux Hooks */
    const dispatch = useDispatch<Dispatch<ServiceTypeConfigurationActions>>();
    const structure = useTypedSelector(state => state.serviceTypeConfiguration.listview.structure)
    const columnsSelector = useTypedSelector(state => state.serviceTypeConfiguration.listview.structure.columns)
    const actionBarButtons = useTypedSelector(state => state.serviceTypeConfiguration.listview.structure.buttons)
    const rowsSelector = useTypedSelector(state => state.serviceTypeConfiguration.listview.data.results)
    const totalRowsSelector = useTypedSelector(state => state.serviceTypeConfiguration.listview.data.totalCount)
    const loading = useTypedSelector(state => state.serviceTypeConfiguration.listview.loading.listView)
    const columnsLoading = useTypedSelector(state => state.serviceTypeConfiguration.listview.loading.columns)
    // const viewMode = useTypedSelector((state) => state.serviceTypeConfiguration.viewType)
    /** State */
    const [columns, setColumns] = useState<IListViewColumn[]>([]);
    const [selectedRows, setSelectedRows] = useState<ISelectedRows>({})
    const [showColumnShimmer, setShowColumnShimmer] = useState<boolean>(false)
    const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
    const [showActivateDeactivateModal, setShowActivateDeactivateModal] = useState<boolean>(false)
    const [statusChangeData, setStatusChangeData] = useState<any>({})
    const [showDeletionConfirmation, setShowDeletionConfirmation] = useState<boolean>(false);
    const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false)
    const [isDownloadReportDisabled, setDownloadReportDisabled] = useState<boolean>(false)

    let autoAllocateValuePayload : IAutoAllocateValues ={
        autoAssignToNearestDA : dynamicLabels?.Auto_assign_to_nearest_rider,
        AutoAssignToAnExistingRoute : dynamicLabels?.Auto_assign_to_existing_route,
        ManuallyAssignToARun : dynamicLabels?.Manual_assign_to_trip
    }

    let branchMovementValuePayload: IBranchMovementValues = {
        yes : dynamicLabels.Yes,
        no : dynamicLabels.No
    }
    
    useEffect(() => {
        dispatch({type: "@@serviceTypeConfiguration/SET_AUTO_ALLOCATE_VALUES", payload: autoAllocateValuePayload})
        dispatch({type: "@@serviceTypeConfiguration/SET_BRANCH_MOVEMENT_VALUES", payload: branchMovementValuePayload})
    }, []);

    useEffect(() => {
        setShowColumnShimmer(true)
        dispatch({ type: '@@serviceTypeConfiguration/FETCH_ALL_SERVICETYPE_LISTVIEW_STRUCTURE' });
        dispatch({ type: "@@serviceTypeConfiguration/INITIAL_LOAD" });
        dispatch({ type: "@@serviceTypeConfiguration/SET_VIEW_TYPE", payload: "allServiceTypes" })
    }, []);

    useEffect(() => {
        const mongoStructure = columnsSelector;
        if (Object.keys(mongoStructure).length) {
            const newColumns = transformMongoListViewToColumns(mongoStructure, 'serviceTypeConfiguration', cellCallbackMapping)
            setColumns(newColumns)
        }
        const firstEntry: any = Object.values(columnsSelector)?.[0]
        if (firstEntry?.id) {
            setTimeout(() => { setShowColumnShimmer(false) }, 0)
        }
    }, [columnsSelector]);

    const handleStatusChange = (
        isChecked: boolean,
        row : IRowData
      ) => {
          setShowActivateDeactivateModal(true)
          setStatusChangeData({'selectedRow': row, 'isChecked': isChecked})
    };

    const cellCallbackMapping = {
        activeFlag: handleStatusChange
    };

    const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {
        sendGA('All Service Types', `List Action - ${pageSize} - ${pageNumber} - ${sortOptions?.sortBy} - ${sortOptions?.sortOrder} - ${filterOptions?.searchBy} - ${filterOptions?.searchText}`);
        setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis })
        let searchText = filterOptions ? getSearchText(filterOptions) : "";
        dispatch({
            type: '@@serviceTypeConfiguration/FETCH_ALL_SERVICETYPE_LIST',
            payload: {
                pageNumber: pageNumber,
                pageSize: pageSize,
                searchBy: filterOptions?.searchBy,
                searchText: searchText,
                sortBy: sortOptions?.sortBy,
                sortOrder: sortOptions?.sortOrder
            }
        })
    }, [])

    const onSaveColumnPreferences = React.useCallback(async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
        sendGA('All Service Types', `Click - Save and Apply Column Selector`);
        const columns = { ...columnsSelector }
        Object.keys(columns).forEach((columnKey) => {
          columns[columnKey].permission = !!visibleColumns[columnKey]
        })
        const payload = {...structure, columns }
        try {
          const { data: { message } } = await axios.put(apiMappings.serviceTypeConfiguration.listView.structure, payload)
          message && toast.add(message, 'check-round', false)
        } catch (error) {
            toast.add(error, 'warning', false)
        }
      }, [columnsSelector])

    const onRowSelect = React.useCallback((s: ISelectedRows) => {
        setSelectedRows(s)
    }, []);
    
    /** Delete Request */
    const deleteSelectedRows = async () => {
        sendGA('All Service Types', `Click - Delete Service type`);
        setShowDeletionConfirmation(false);
        try {
            const serviceTypeIDs = Object.keys(selectedRows);
            const {
                data: data,
            } = await axios.delete(apiMappings.serviceTypeConfiguration.listView.deleteServiceType, { data: serviceTypeIDs });

            if (data.status === 200) {
                toast.add(dynamicLabels.serviceTypeDeletedSuccessfully, 'check-round', false);
                setSelectedRows({});
                fetchOptions.apis?.resetSelection();
                handleFetchData(fetchOptions);
                return;
            }
            throw toast.add(`${data?.message}`, 'warning', false);;
        } catch (errorMessage) {
            toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false);
        }
    };
    const handleEditServiceType = (row: IRowData) => {
        const { serviceTypeDetailsId } = row;
        dispatch({ type: '@@serviceTypeConfiguration/SET_VIEW_TYPE', payload: 'addServiceTypeForm' })
        history.push(`/addServiceTypeForm/${serviceTypeDetailsId}`)
        closeSideMenu()
    }
    const handleDownloadReport = async () => {
        sendGA('All Service Types',`Click - Download Report`);
        setDownloadReportDisabled(true)
        setShowDownloadModal(true)
        const payload = {
          pageNumber: fetchOptions.pageNumber,
          pageSize: fetchOptions.pageSize,
          searchBy: fetchOptions.filterOptions?.searchBy,
          searchText: fetchOptions.filterOptions?.searchText,
          sortBy: fetchOptions.sortOptions?.sortBy,
          sortOrder: fetchOptions.sortOptions?.sortOrder
        }
        try {
          const { data } = await axios.post(apiMappings.serviceTypeConfiguration.listView.downloadReport, {}, {
            responseType: 'arraybuffer',
            params: payload
    
          })
    
          FileSaver.saveAs(new Blob([data], { type: "application/vnd.ms-excel xlsx" }), `${dynamicLabels.ServiceTypeConfigurationForm}.xlsx`)
          setDownloadReportDisabled(false)
        } catch {
          setDownloadReportDisabled(false)
          toast.add(dynamicLabels.somethingWendWrong, 'warning', false)
        }
      }
    return (<>
        <ListView
            rowIdentifier='serviceTypeDetailsId'
            style={{ height: '100%', overflow: 'hidden' }}
            columns={columns}
            data={rowsSelector}
            onFetchData={handleFetchData}
            onRowSelect={onRowSelect}
            onSaveColumnPreferences={onSaveColumnPreferences}
            totalRows={totalRowsSelector}
            loading={showColumnShimmer || loading}
            isColumnLoading={showColumnShimmer || columnsLoading}
            hideColumnSettings={false}
            hasRowSelectionWithEdit={true}
            onRowEditClick={(row) => {
                sendGA('All Service Types',`Click - Update Service Type`);
                handleEditServiceType(row as IRowData);
            }}
        >
            {{
                IconBar: <IconButton id="serviceTypeConfiguration-actionBar-download" title={dynamicLabels.download + ' ' + dynamicLabels.serviceType + dynamicLabels.report} disabled={isDownloadReportDisabled} iconVariant='icomoon-download' iconSize={16} onlyIcon style={{ color: 'inherit' }} onClick={handleDownloadReport} />,
                ActionBar:
                    <ActionBarContainer display='flex' horizontalSpacing='10px'>
                        {Object.keys(actionBarButtons).map(buttonKey => actionBarButtons[buttonKey].permission &&
                            <Tooltip key={buttonKey} message={actionBarButtons[buttonKey].label}
                                hover messagePlacement={'center'}>
                                <div key={buttonKey}>
                                    <IconButton
                                        id='serviceTypeConfiguration-actionBar-delete'
                                        key={buttonKey}
                                        disabled={!(Object.keys(selectedRows).length)}
                                        intent='table'
                                        iconVariant='icomoon-delete-empty'
                                        id={`listView-actionBar-${buttonKey}`}
                                        onClick={() => {setShowDeletionConfirmation(true)}}
                                    >
                                        {actionBarButtons[buttonKey].label}
                                    </IconButton>
                                </div>
                            </Tooltip>
                        )}
                    </ActionBarContainer>
            }
            }
        </ListView>
        {showActivateDeactivateModal && (
            <ActivateDeactivateModal showActivateDeactivateModal={showActivateDeactivateModal} setShowActivateDeactivateModal={setShowActivateDeactivateModal} fetchOptions={fetchOptions} handleFetchData={handleFetchData} statusChangeData={statusChangeData} setStatusChangeData={setStatusChangeData}
            />
        )}
        {/* DELETE CONFIRMATION MODAL */}
        <DeleteConfirmationModal
            showDeletionConfirmation={showDeletionConfirmation}
            setShowDeletionConfirmation={(value: boolean) => setShowDeletionConfirmation(value)}
            deleteSelectedRows={deleteSelectedRows}
        />
        <DownloadMessage
          showInfoModal={showDownloadModal}
          onToggle={setShowDownloadModal}
        />
    </>
    );
}

export default AllServiceTypeListView;