import React, { Dispatch, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { CompartmentConfigurationActions } from "../CompartmentConfiguration.actions";
import {ListView, IListViewColumn, IFetchDataOptions, IconButton, useToast, ISelectedRows, Tooltip } from "ui-library"
import { ColumnInstance } from "react-table"
import { transformMongoListViewToColumns } from "../../../../../utils/mongo/ListView";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import { sendGA } from "../../../../../utils/ga";
import { ActionBarContainer } from "../CompartmentConfigurationStyledComponents";
import { IRowData } from "../CompartmentConfiguration.models";
import axios from "../../../../../utils/axios";
import apiMappings from "../../../../../utils/apiMapping";
import DeleteConfirmationModal from "../../../../../utils/components/DeleteConfirmationModal";
import NoDataView from "../../../../../utils/components/NoDataView";

const AllCompartmentListView = () => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.settings.compartmentConfiguration)
    const toast = useToast()
    const history = useHistory();
    const dispatch = useDispatch<Dispatch<CompartmentConfigurationActions>>();
    const structure = useTypedSelector(state => state.compartmentConfiguration.listview.structure)
    const columnsSelector = useTypedSelector(state => state.compartmentConfiguration.listview.structure.columns)
    const actionBarButtons = useTypedSelector(state => state.compartmentConfiguration.listview.structure.buttons)
    const rowsSelector = useTypedSelector(state => state.compartmentConfiguration.listview.data.results)
    const totalRowsSelector = useTypedSelector(state => state.compartmentConfiguration.listview.data.totalCount)
    const loading = useTypedSelector(state => state.compartmentConfiguration.listview.loading.listView)
    const columnsLoading = useTypedSelector(state => state.compartmentConfiguration.listview.loading.columns)
    const emptyData = useTypedSelector(state => state.compartmentConfiguration.listview.emptyData)
    /** State */
    const [columns, setColumns] = useState<IListViewColumn[]>([]);
    const [selectedRows, setSelectedRows] = useState<ISelectedRows>({})
    const [showColumnShimmer, setShowColumnShimmer] = useState<boolean>(false)
    const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
    const [showDeletionConfirmation, setShowDeletionConfirmation] = useState<boolean>(false);
    const styledClassess = {
        primaryImage: {
          width: "400px",
          height: "224px",
        },
        styledButtons: {
          maxHeight: "40px",
          height: "40px"
        },
      };
    useEffect(() => {
        setShowColumnShimmer(true)
        dispatch({ type: '@@compartmentConfiguration/FETCH_ALL_COMPARTMENT_LISTVIEW_STRUCTURE' });
        dispatch({ type: "@@compartmentConfiguration/SET_VIEW_TYPE", payload: "allCompartments" })
        dispatch({ type: '@@compartmentConfiguration/FETCH_CLIENT_METRIC_SYSTEM'})
        dispatch({ type: '@@compartmentConfiguration/FETCH_CRATES'});
        handleFetchData(fetchOptions);
    }, []);

    useEffect(() => {
        const mongoStructure = columnsSelector;
        if (Object.keys(mongoStructure).length) {
            const newColumns = transformMongoListViewToColumns(mongoStructure, 'compartmentConfiguration')
            setColumns(newColumns)
        }
        const firstEntry: any = Object.values(columnsSelector)?.[0]
        if (firstEntry?.id) {
            setTimeout(() => { setShowColumnShimmer(false) }, 0)
        }
    }, [columnsSelector]);

    const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {
        sendGA('All Compartments', `List Action - ${pageSize} - ${pageNumber} - ${sortOptions?.sortBy} - ${sortOptions?.sortOrder} - ${filterOptions?.searchBy} - ${filterOptions?.searchText}`);
        setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis })
        dispatch({
            type: '@@compartmentConfiguration/FETCH_ALL_COMPARTMENT_LIST',
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
        sendGA('All Compartments', `Click - Save and Apply Column Selector`);
        const columns = { ...columnsSelector }
        Object.keys(columns).forEach((columnKey) => {
          columns[columnKey].permission = !!visibleColumns[columnKey]
        })
        const payload = {...structure, columns }
        try {
          const { data: { message } } = await axios.put(apiMappings.compartmentConfiguration.listView.structure, payload)
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
        sendGA('Compartment Configuration', `Delete Compartment`);
        setShowDeletionConfirmation(false);
        try {
            const compartmentIDs = Object.keys(selectedRows);
            const {
                data: data,
            } = await axios.delete(apiMappings.compartmentConfiguration.listView.deleteCompartment, { data: compartmentIDs });

            if (data.status === 200) {
                toast.add(data?.message, 'check-round', false);
                setSelectedRows({});
                fetchOptions.apis?.resetSelection();
                handleFetchData(fetchOptions);
                return;
            }
            throw toast.add(`${data?.message}`, 'warning', false);;
        } catch (error) {
            toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false);
        }
    };
    const handleEditCompartment = (row: IRowData) => {
        const { compartmentId } = row;
        dispatch({ type: '@@compartmentConfiguration/SET_VIEW_TYPE', payload: 'addCompartmentForm' })
        history.push(`/addCompartmentForm/${compartmentId}`)
    }
    return (<>
        {emptyData ?
            <NoDataView
                image='images/EmptyCompartment.svg'
                styledClassess= {styledClassess}
                message={dynamicLabels?.noCompartmentAddedYet || `No ${dynamicLabels?.compartment_p} added yet. Click on the button below to add ${dynamicLabels?.compartment_s}.`}
                buttonList={[{
                    name: `Add ${dynamicLabels?.compartment_s}`,
                    icon: 'icomoon-add',
                    onButtonClick: () => { dispatch({ type: '@@compartmentConfiguration/SET_VIEW_TYPE', payload: 'addCompartmentForm' }); history.push('/addCompartmentForm') }
                }
                ]}
            /> :
            <ListView
                rowIdentifier='compartmentId'
                style={{ height: '100%', overflow: 'hidden' }}
                columns={columns}
                data={rowsSelector}
                onFetchData={handleFetchData}
                onRowSelect={onRowSelect}
                onSaveColumnPreferences={onSaveColumnPreferences}
                totalRows={totalRowsSelector}
                loading={showColumnShimmer || loading}
                isColumnLoading={showColumnShimmer}
                hideColumnSettings={false}
                hasRowSelection={actionBarButtons?.["delete"]?.permission && !actionBarButtons?.["update"]?.permission}
                hasRowSelectionWithEdit={actionBarButtons?.["update"]?.permission}
                onRowEditClick={(row) => {
                    sendGA('Compartment Configuration',`Update Compartment Form`);
                    handleEditCompartment(row as IRowData);
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
        }
        {/* DELETE CONFIRMATION MODAL */}
        <DeleteConfirmationModal
            showDeletionConfirmation={showDeletionConfirmation}
            setShowDeletionConfirmation={(value: boolean) => setShowDeletionConfirmation(value)}
            deleteSelectedRows={deleteSelectedRows}
            featureName="comparment"
        />
    </>
    );
}

export default AllCompartmentListView;