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
import { InscanOrderManifestActions } from "../InscanOrderManifest.actions";
import { IManifestOfManifests, IManifestOfManifestsListviewDataPayload } from "../InscanOrderManifest.models";
import { isEmpty, usePagination } from "../utils";
import { ActionBarContainer } from "./InscanStyledComponent";

interface IManifestInscanListviewProps {
    tableData: Array<any>
    setTabledata: Dispatch<SetStateAction<Array<any>>>;
    scannedShipmentIds: Array<string>;
    setScannedShipmentIds: Dispatch<SetStateAction<Array<string>>>;
    totalCrates: number;
    setTotalCrates: Dispatch<SetStateAction<number>>;
    totalInscannedOrders: number;
    setTotalInscannedOrders:  Dispatch<SetStateAction<number>>;
}

const ManifestInscanListview = (props: IManifestInscanListviewProps) => {
    const { tableData, setTabledata, scannedShipmentIds, setScannedShipmentIds,totalCrates,setTotalCrates,totalInscannedOrders, setTotalInscannedOrders} = props;

    const toast = useToast()
    const dispatch = useDispatch<Dispatch<InscanOrderManifestActions>>();
    const structure = useTypedSelector(state => state.inscanUpdate.listview.manifestOfManifests.structure)
    const columnsSelector = useTypedSelector(state => state.inscanUpdate.listview.manifestOfManifests.structure.columns)
    const actionBarButtons = useTypedSelector(state => state.inscanUpdate.listview.manifestOfManifests.structure.buttons)
    const rowsSelector = useTypedSelector(state => state.inscanUpdate.listview.manifestOfManifests.data.results);
    const totalRowsSelector = useTypedSelector(state => state.inscanUpdate.listview.manifestOfManifests.data.totalCount)
    const loading = useTypedSelector(state => state.inscanUpdate.listview.manifestOfManifests.loading)
    const formStructure = useTypedSelector(state => state.inscanUpdate.form.structure);

    const isFormEditable = false;
    const [columns, setColumns] = useState<IListViewColumn[]>([]);
    const [selectedRows, setSelectedRows] = useState<ISelectedRows>({})
    const [showColumnShimmer, setShowColumnShimmer] = useState<boolean>(false)
    const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
    const [rowData, setRowData] = useState<IManifestOfManifestsListviewDataPayload>({ clientBranchId: 0, otherCount: 0, results: [], totalCount: 0});


    // intial structure loading for listview
    useEffect(() => {
        setShowColumnShimmer(true)
        dispatch({ type: '@@inscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LISTVIEW_STRUCTURE' });
    }, []);

    // column transformation
    useEffect(() => {
        const mongoStructure = columnsSelector;

        if (Object.keys(mongoStructure).length) {
            const newColumns = transformMongoListViewToColumns(mongoStructure, 'inscanOrders', cellCallbackMapping)
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
        setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis })
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
            const { data: { message } } = await axios.put(apiMappings.inscanUpdate.listview.manifestOfManifests.structure, payload)
            message && toast.add(message, 'check-round', false)
        } catch (error) {
            console.log(error)
        }
    }, [columnsSelector])

    const removeManifest = () => {
        let newTableData: Array<any> = [];
        let addedOrdernoMap = {};

        const manifestNames = Object.keys(selectedRows).map((obj: any) => selectedRows[obj].manifestName);
        const manifestList = deepCopy(rowsSelector);

        const filteredManifests = manifestList.filter((obj: any) => !manifestNames.includes(obj.manifestName))
        const filteredOrders = tableData.filter((obj: any) => !manifestNames.includes(obj.manifestId));

        filteredOrders.forEach((row: any) => {
            if (selectedRows[row.shipmentId]) {
                scannedShipmentIds.splice(scannedShipmentIds.indexOf(row.shipmentId.toString()), 1);
            } else {
                newTableData.push(row)
                addedOrdernoMap[row.shipmentId] = row;
                addedOrdernoMap[row.shipmentId] = row;
            }
        })

        const manifestData = {
            clientBranchId: 0,
            otherCount: 0,
            results: filteredManifests,
            totalCount: filteredManifests.length
        }
        dispatch({ type: '@@inscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LIST_SUCCESS', payload: manifestData })
        // setTabledata(newTableData);

        if (!tableData.length && !isFormEditable && !isEmpty(formStructure)) {
            const newStructure = deepCopy(formStructure);
            setTimeout(() => {
                newStructure['general details']['inscanBy']['editable'] = true;
            }, 100);
            dispatch({ type: '@@inscanOrderManifest/FETCH_ADD_MANIFEST_FORM_STRUCTURE_SUCCESS', payload: newStructure });
        } 
        const updatedCount = totalInscannedOrders - Object.keys(selectedRows).reduce((total: number, current:string) => total += selectedRows[current].orderCount || 0, 0)
        setTotalInscannedOrders(updatedCount)
        setTotalCrates((totalCrates) => totalCrates -= Object.keys(selectedRows).reduce((total: number, current:string) => total += selectedRows[current].totalCrates || 0, 0));
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


export default ManifestInscanListview;