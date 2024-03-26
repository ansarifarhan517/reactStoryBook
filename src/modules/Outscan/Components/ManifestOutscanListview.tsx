import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ColumnInstance } from 'react-table'
import {
    ListView, IListViewColumn, IFetchDataOptions, IconButton,
    useToast, ISelectedRows, Tooltip, ISortOptions, IListViewRow
} from 'ui-library'
import apiMappings from "../../../utils/apiMapping";
import axios from "../../../utils/axios";
import { deepCopy } from "../../../utils/helper";
import { transformMongoListViewToColumns } from "../../../utils/mongo/ListView";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import { OutscanOrderManifestActions } from "../OutscanOrderManifest.actions";
import { IManifestOfManifests, IManifestOfManifestsListviewDataPayload, IManifestRecord, IOrderRecord } from "../OutscanOrderManifest.models";
import { isEmpty, usePagination } from "../utils";
import { ActionBarContainer } from "./OutscanStyledComponent";

interface IManifestOutscanListviewProps {
    tableData: Array<IOrderRecord>
    setTabledata: Dispatch<SetStateAction<Array<IOrderRecord>>>;
    totalCratesCount: number;
    setTotalCratesCount: Dispatch<SetStateAction<number>>;
    totalWeight: number;
    setTotalWeight: Dispatch<SetStateAction<number>>;
    totalVolume: number;
    setTotalVolume: Dispatch<SetStateAction<number>>;
    totalPendingOrders: number;
    setTotalPendingOrders: Dispatch<SetStateAction<number>>;
    scannedShipmentIds: Array<string>;
    setScannedShipmentIds: Dispatch<SetStateAction<Array<string>>>;
    totalOutscannedOrders: number;
    setTotalOutscannedOrders: Dispatch<SetStateAction<number>>;
}

const ManifestOutscanListview = (props: IManifestOutscanListviewProps) => {
    const { tableData, setTabledata, setTotalCratesCount, setTotalWeight, setTotalVolume, setTotalPendingOrders, scannedShipmentIds, totalOutscannedOrders, setTotalOutscannedOrders} = props;

    /** General Hooks */
    const toast = useToast()
    /** Redux Hooks */
    const dispatch = useDispatch<Dispatch<OutscanOrderManifestActions>>();
    const structure = useTypedSelector(state => state.outscan.listview.manifestOfManifests.structure)
    const columnsSelector = useTypedSelector(state => state.outscan.listview.manifestOfManifests.structure.columns)
    const actionBarButtons = useTypedSelector(state => state.outscan.listview.manifestOfManifests.structure.buttons)
    const rowsSelector = useTypedSelector(state => state.outscan.listview.manifestOfManifests.data.results)
    const totalRowsSelector = useTypedSelector(state => state.outscan.listview.manifestOfManifests.data.totalCount)
    const loading = useTypedSelector(state => state.outscan.listview.manifestOfManifests.loading)
    const formStructure = useTypedSelector(state => state.outscan.form.structure);
    const isFormEditable = useTypedSelector(state => state.outscan.form.isEditable);
    /** State */
    const [columns, setColumns] = useState<IListViewColumn[]>([]);
    const [selectedRows, setSelectedRows] = useState<ISelectedRows>({})
    const [showColumnShimmer, setShowColumnShimmer] = useState<boolean>(false)
    const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
    const [rowData, setRowData] = useState<IManifestOfManifestsListviewDataPayload>({ clientBranchId: 0, otherCount: 0, results: [], totalCount: 0});

    // intial structure loading
    useEffect(() => {
        setShowColumnShimmer(true)
        dispatch({ type: '@@outscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LISTVIEW_STRUCTURE' });
    }, []);

    // transforming columns
    useEffect(() => {
        const mongoStructure = columnsSelector;

        if (Object.keys(mongoStructure).length) {
            const newColumns = transformMongoListViewToColumns(mongoStructure, 'manifestOfManifests', cellCallbackMapping)
            setColumns(newColumns)
        }
        const firstEntry: any = Object.values(columnsSelector)?.[0]
        if (firstEntry?.id) {
            setTimeout(() => { setShowColumnShimmer(false) }, 0)
        }

    }, [columnsSelector]);

    const paginateData = (data: IManifestOfManifests[], pageNumber: number, pagSize: number) => {
        if(rowsSelector && rowsSelector?.length > 0) {
            const manifesList = usePagination(data, pageNumber, pagSize).reverse();
            setRowData({ clientBranchId: 0, otherCount: 0, results: manifesList as IManifestOfManifests[], totalCount: manifesList.length});
        }
    }
    //pagination
    useEffect(() => {   
        if(rowsSelector && rowsSelector?.length > 0 && !isEmpty(fetchOptions)) {
            paginateData(rowsSelector, Number(fetchOptions?.pageNumber), Number(fetchOptions?.pageSize));
        } else {
            setRowData({ clientBranchId: 0, otherCount: 0, results: [], totalCount: 0});
        }
    }, [fetchOptions, rowsSelector]);

    const cellCallbackMapping = {
    }

    const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {
        setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis });
    }, [])

    const onSortChange = React.useCallback((sortObject: ISortOptions) => {
        console.log(fetchOptions, sortObject)
    }, []);

    const onRowSelect = React.useCallback((s: ISelectedRows) => {
        setSelectedRows(s)
    }, []);

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
            const { data: { message } } = await axios.put(apiMappings.outscan.listview.manifestOfManifests.structure, payload)
            message && toast.add(message, 'check-round', false)
        } catch (error) {
            console.log(error, error?.response)
        }
    }, [columnsSelector])
    const removeManifest = () => {
        let newTableData: Array<IOrderRecord> = [];
        let addedOrdernoMap = {};
        let totalOrderWeight = 0;
        let totalOrderVolume = 0;
        let totalOrderCrateCodes = 0;
        const manifestNames = Object.keys(selectedRows).map((obj: string) => selectedRows[obj].manifestName);
        const manifestList = deepCopy(rowsSelector);

        const filteredManifests = manifestList.filter((obj: IManifestOfManifests) => !manifestNames.includes(obj.manifestName))
        const filteredOrders = tableData.filter((obj: IOrderRecord) => !manifestNames.includes(obj.manifestId));

        filteredOrders.forEach((row: IOrderRecord) => {
            if (selectedRows[row.shipmentId]) {
                scannedShipmentIds.splice(scannedShipmentIds.indexOf(String(row.shipmentId)), 1);
                if (row.packageStatusCd != "CANCELLED") {
                    setTotalPendingOrders((totalPendingOrders) => totalPendingOrders + 1);
                }
            } else {
                newTableData.push(row)
                totalOrderWeight += row.packageWeight || 0
                totalOrderVolume += row.packageVolume || 0
                if (row.scannedCrateCodes) {
                    totalOrderCrateCodes += row.scannedCrateCodes.size
                } else if (row.crates) {
                    totalOrderCrateCodes += (row.totalCrates || row.crates.length)
                }
                addedOrdernoMap[row.shipmentId] = row;
            }
        })


        const manifestData = {
            clientBranchId: 0,
            otherCount: 0,
            results: filteredManifests,
            totalCount: filteredManifests.length
        }
        dispatch({ type: '@@outscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LIST_SUCCESS', payload: manifestData })
        setTabledata(newTableData);

            const updatedCount = totalOutscannedOrders - Object.keys(selectedRows).reduce((total: number, current:string) => total += selectedRows[current].orderCount || 0, 0)
            setTotalCratesCount((totalCrateCodes) => totalCrateCodes -= Object.keys(selectedRows).reduce((total: number, current:string) => total += selectedRows[current].totalCrates || 0, 0));
            setTotalOutscannedOrders(updatedCount);
            setTotalWeight((totalWeight) => totalWeight -= Object.keys(selectedRows).reduce((total: number, current:string) => total += Number(selectedRows[current].totalWeight?.toFixed(2) || 0) , 0));
            setTotalVolume((totalVolume) => totalVolume -= Object.keys(selectedRows).reduce((total: number, current:string) => total += Number(selectedRows[current].totalVolume?.toFixed(2) || 0) , 0));

        if (!tableData.length && !isFormEditable && !isEmpty(formStructure)) {
            const newStructure = deepCopy(formStructure);
            setTimeout(() => {
                newStructure['general details']['outscanBy']['editable'] = true;
                newStructure['general details']['selectTrip']['editable'] = true;
                newStructure['general details']['selectDm']['editable'] = true;
                newStructure['general details'].originBranchFilter.editable = true;
                newStructure['general details'].nextBranchFilter.editable = true;
                newStructure['general details'].serviceTypeFilter.editable = true;
                newStructure['general details'].tripNameFilter.editable = true;
                newStructure['general details']['cancelledOrderAllowedFl']['editable'] = true;
            }, 100);
            dispatch({ type: '@@outscanOrderManifest/FETCH_ADD_MANIFEST_FORM_STRUCTURE_SUCCESS', payload: newStructure });
        }
        setSelectedRows({})
        fetchOptions?.apis?.resetSelection();
    }

    return (
        <ListView
            rowIdentifier='manifestId'
            style={{ height: '100%', overflow: 'hidden' }}
            columns={columns}
            data={!rowsSelector ? [] : rowData.results as IListViewRow[]}
            onFetchData={handleFetchData}
            hasRowSelectionWithEdit={false}
            hasRowSelection={true}
            onRowSelect={onRowSelect}
            onSortChange={onSortChange}
            onSaveColumnPreferences={onSaveColumnPreferences}
            hidePaginationBar={false}
            totalRows={totalRowsSelector}
            loading={showColumnShimmer || loading}
            hideRefresh={showColumnShimmer || loading}
            isColumnLoading={showColumnShimmer}
            hideColumnSettings={false}
            onRowEditClick={() => { }}
        >
            {{
                ActionBar:
                    <ActionBarContainer display='flex' horizontalSpacing='10px'>

                        {Object.keys(actionBarButtons).map(buttonKey => actionBarButtons[buttonKey].permission &&
                            (

                                <Tooltip key={buttonKey} message={actionBarButtons[buttonKey].label}
                                    hover
                                    messagePlacement={'center'}
                                >
                                    <div key={buttonKey}>
                                        <IconButton
                                            key={buttonKey}
                                            disabled={!Object.keys(selectedRows).length}
                                            intent='table'

                                            iconVariant={"icomoon-delete-empty"}
                                            id={`listView-actionBar-${buttonKey}`}
                                            onClick={() => removeManifest()}
                                        >
                                            {actionBarButtons[buttonKey].label}
                                        </IconButton>
                                    </div>
                                </Tooltip>
                            )
                        )
                        }
                    </ActionBarContainer>
            }
            }
        </ListView>
    )
}


export default ManifestOutscanListview;