import React, { Dispatch, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { TrackerConfigurationActions } from "../TrackerConfiguration.actions";
import {ListView, IListViewColumn, IFetchDataOptions, IconButton, useToast, ISelectedRows, Tooltip } from "ui-library"
import { ColumnInstance } from "react-table"
import { transformMongoListViewToColumns } from "../../../../../utils/mongo/ListView";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import { sendGA } from "../../../../../utils/ga";
import { ActionBarContainer } from "../TrackerConfigurationStyledComponents";
import axios from "../../../../../utils/axios";
import apiMappings from "../../../../../utils/apiMapping";
import DeleteConfirmationModal from "../../../../../utils/components/DeleteConfirmationModal";
import ActivateDeactivateModal from "../SubComponents/ActivateDeactivateModal";
import { IRowData } from "../TrackerConfiguration.models";
import { closeSideMenu } from "../../../../../utils/helper";


const AllTrackerConfigListView = () => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.settings.trackerConfiguration)
    const toast = useToast()
    const history = useHistory();
    const dispatch = useDispatch<Dispatch<TrackerConfigurationActions>>();
    const structure = useTypedSelector(state => state.tracker.trackerConfiguration.listview.structure)
    const columnsSelector = useTypedSelector(state => state.tracker.trackerConfiguration.listview.structure.columns)
    const actionBarButtons = useTypedSelector(state => state.tracker.trackerConfiguration.listview.structure.buttons)
    const rowsSelector = useTypedSelector(state => state.tracker.trackerConfiguration.listview.data.results)
    const totalRowsSelector = useTypedSelector(state => state.tracker.trackerConfiguration.listview.data.totalCount)
    const loading = useTypedSelector(state => state.tracker.trackerConfiguration.listview.loading.listView)
    const columnsLoading = useTypedSelector(state => state.tracker.trackerConfiguration.listview.loading.columns)

    /** State */
    const [columns, setColumns] = useState<IListViewColumn[]>([]);
    const [selectedRows, setSelectedRows] = useState<ISelectedRows>({})
    const [showColumnShimmer, setShowColumnShimmer] = useState<boolean>(false)
    const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
    const [showDeletionConfirmation, setShowDeletionConfirmation] = useState<boolean>(false);
    const [showActivateDeactivateModal, setShowActivateDeactivateModal] = useState<boolean>(false)
    const [statusChangeData, setStatusChangeData] = useState<any>({})

    useEffect(() => {
        dispatch({type: "@@trackerConfiguration/RESET_TRACKER_DROPDOWN_DATA"})
    }, []);

    useEffect(() => {
        setShowColumnShimmer(true)
        dispatch({type: '@@trackerConfiguration/FETCH_DROPDOWN_OPTIONS'})
        dispatch({ type: '@@trackerConfiguration/FETCH_TRACKER_CONFIG_LISTVIEW_STRUCTURE' });
        dispatch({ type: "@@trackerConfiguration/SET_VIEW_TYPE", payload: "allTrackers" })
    }, []);

    useEffect(() => {
        const mongoStructure = columnsSelector;
        if (Object.keys(mongoStructure).length) {
            const newColumns = transformMongoListViewToColumns(mongoStructure, 'trackerConfiguration', cellCallbackMapping)
            setColumns(newColumns)
        }
        const firstEntry: any = Object.values(columnsSelector)?.[0]
        if (firstEntry?.id) {
            setTimeout(() => { setShowColumnShimmer(false) }, 0)
        }
    }, [columnsSelector]);

    const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {
        sendGA('All Tracker', `List Action - ${pageSize} - ${pageNumber} - ${sortOptions?.sortBy} - ${sortOptions?.sortOrder} - ${filterOptions?.searchBy} - ${filterOptions?.searchText}`);
        setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis })
        dispatch({
            type: '@@trackerConfiguration/FETCH_TRACKERS_CONFIG_LIST',
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
        sendGA('All Trackers', `Click - Save and Apply Column Selector`);
        const columns = { ...columnsSelector }
        Object.keys(columns).forEach((columnKey) => {
          columns[columnKey].permission = !!visibleColumns[columnKey]
        })
        const payload = {...structure, columns }
        try {
          const { data: { message } } = await axios.put(apiMappings.tracker.trackerConfiguration.listView.structure, payload)
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
        sendGA('Tracker Configuration', `Delete Tracker`);
        setShowDeletionConfirmation(false);
        try {
            const trackerIDs = Object.keys(selectedRows);
            const {
                data: data,
            } = await axios.delete(apiMappings.tracker.trackerConfiguration.listView.deleteTracker, { data: trackerIDs });

            if (data.status === 200) {
                toast.add(data?.message, 'check-round', false);
                setSelectedRows({});
                fetchOptions.apis?.resetSelection();
                handleFetchData(fetchOptions);
                return;
            }
            throw toast.add(`${data?.message}`, 'warning', false);
        } catch (error) {
            toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false);
        }
    };
    const handleStatusChange = (
        isChecked: boolean,
        row : IRowData
      ) => {
          setShowActivateDeactivateModal(true)
          setStatusChangeData({'selectedRow': row, 'isChecked': isChecked})
    };
    const cellCallbackMapping = {
        isActiveFl: handleStatusChange
    };
    const handleEditTracker= (row :IRowData) =>{
        const {trackerConfigId} = row;
        dispatch({type :'@@trackerConfiguration/SET_VIEW_TYPE',payload:'trackerForm'})
        history.push(`/addTrackerForm/${trackerConfigId}`)
        closeSideMenu()
    }

    return (<>
            <ListView
                rowIdentifier='trackerConfigId'
                style={{ height: '100%', overflow: 'hidden' }}
                columns={columns}
                data={rowsSelector}
                onFetchData={handleFetchData}
                onRowSelect={onRowSelect}
                onSaveColumnPreferences={onSaveColumnPreferences}
                totalRows={totalRowsSelector}
                loading={columnsLoading}
                isColumnLoading={showColumnShimmer}
                hideColumnSettings={false}
                hasRowSelection={actionBarButtons?.["delete"]?.permission && !actionBarButtons?.["update"]?.permission}
                hasRowSelectionWithEdit={actionBarButtons?.["update"]?.permission}
                onRowEditClick={(row) => {
                    sendGA("Tracker Configuration",'Update Tracker');
                    handleEditTracker(row as IRowData);
                }}
            >
                {{
                    ActionBar:
                        <ActionBarContainer display='flex' horizontalSpacing='10px'>
                            {Object.keys(actionBarButtons).map(buttonKey => actionBarButtons[buttonKey].permission && buttonKey === 'delete' &&
                                <Tooltip key={buttonKey} message={actionBarButtons[buttonKey].label}
                                    hover messagePlacement={'center'}>
                                    <div key={buttonKey}>
                                        <IconButton
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
                }}
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
    </>
    );
}

export default AllTrackerConfigListView;