import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ColumnInstance } from 'react-table'
import { ListView, IListViewColumn, IFetchDataOptions, IconButton,
    useToast, ISelectedRows, Tooltip, ISortOptions, IListViewRow
} from 'ui-library'
import apiMappings from "../../../utils/apiMapping";
import axios from "../../../utils/axios";
import { deepCopy } from "../../../utils/helper";
import { transformMongoListViewToColumns } from "../../../utils/mongo/ListView";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import { InscanOrderManifestActions } from "../InscanOrderManifest.actions";
import { isEmpty, usePagination } from "../utils";
import { ActionBarContainer } from "./InscanStyledComponent";
import CrateModal from "./CrateModal";
import { IOrderRecord, IScannedOrder, IScannedOrderListviewDataPayload } from "../InscanOrderManifest.models";

interface IOrderInscanListviewProps {
    tableData: Array<any>
    setTabledata: Dispatch<SetStateAction<Array<any>>>;
    totalCrates: number;
    setTotalCrates: Dispatch<SetStateAction<number>>;
    scannedShipmentIds: Array<string>;
    setScannedShipmentIds: Dispatch<SetStateAction<Array<string>>>;
    totalInscannedOrders: number
    setTotalInscannedOrders: Dispatch<SetStateAction<number>>;
}

const OrderInscanListview = (props: IOrderInscanListviewProps) => {
    const {tableData, setTotalCrates, setTabledata, scannedShipmentIds, setScannedShipmentIds, totalInscannedOrders, setTotalInscannedOrders } = props;
    const toast = useToast()

    const dispatch = useDispatch<Dispatch<InscanOrderManifestActions>>();
    const structure = useTypedSelector(state => state.inscanUpdate.listview.orders.structure)
    const formStructure = useTypedSelector(state => state.inscanUpdate.form.structure);
    const columnsSelector = useTypedSelector(state => state.inscanUpdate.listview.orders.structure.columns)
    const actionBarButtons = useTypedSelector(state => state.inscanUpdate.listview.orders.structure.buttons)
    const rowsSelector = useTypedSelector(state => state.inscanUpdate.listview.orders.data.results)
    const totalRowsSelector = useTypedSelector(state => state.inscanUpdate.listview.orders.data.totalCount)
    const loading = useTypedSelector(state => state.inscanUpdate.listview.orders.loading)
    const [columns, setColumns] = useState<IListViewColumn[]>([]);
    const [selectedRows, setSelectedRows] = useState<ISelectedRows>({})
    const [showColumnShimmer, setShowColumnShimmer] = useState<boolean>(false)
    const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
    const [crateDetails, setCrateDetails] = useState<Record<string,any>>({});
    const [isCrateDetailsModalOpen, setCrateDetailsModalOpen] = useState<boolean>(false);
    const [rowData, setRowData] = useState<IScannedOrderListviewDataPayload>({ clientBranchId: 0, otherCount: 0, results: [], totalCount: 0});

    // initial column structure loading
    useEffect(() => {
        setShowColumnShimmer(true)
        dispatch({ type: '@@inscanOrderManifest/FETCH_ORDER_INSCAN_LISTVIEW_STRUCTURE' });
    }, []);


    // tranforming columns
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

    const paginateData = (data: IScannedOrder[], pageNumber: number, pagSize: number) => {
        if(rowsSelector && rowsSelector?.length > 0) {
            const orderList = usePagination(data, pageNumber, pagSize);
            setRowData({ clientBranchId: 0, otherCount: 0, results: orderList as IScannedOrder[], totalCount: orderList.length});
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
        for (let [key, value] of Object.entries(columns)) {
            columns[key].permission = !!visibleColumns[key]
        }

        const payload = {
            ...structure,
            columns
        }

        try {
            const { data: { message } } = await axios.put(apiMappings.inscanUpdate.listview.orders.structure, payload)
            message && toast.add(message, 'check-round', false)
        } catch (error) {
            console.log(error)
        }
    }, [columnsSelector]);

    const handleCrateCdScanStatusClick = (orderData: IListViewRow) => {
        const popupData = {
            scannedCrates: [] as Array<any>,
            notScannedCrates: [] as Array<any>
        }

        
        if (orderData.scannedCrateCodes) {
            orderData.crates.forEach((crateObj: any) => {
                if (orderData.scannedCrateCodes.has(crateObj.crateCd?.toString().toLowerCase())) {
                    popupData.scannedCrates.push(crateObj)
                } else {
                    popupData.notScannedCrates.push(crateObj)
                }
            })
        } else {
            popupData.scannedCrates = orderData.crates
        }
        /** Open Crate Details Popup */
        setCrateDetailsModalOpen(true);
        setCrateDetails({scannedCrates: popupData.scannedCrates, notScannedCrates: popupData.notScannedCrates})
    }

    const cellCallbackMapping = {
        scannedCrates: handleCrateCdScanStatusClick
    }

    const removeOrder = () => {
        let newTableData:Array<any> = [];
        let addedOrdernoMap = {};
        let totalOrderCrates = 0;

        tableData.forEach((row:any) => {
            if(selectedRows[row.shipmentId]) {
                if (row.scannedCrateCodes) {
                    totalOrderCrates += row.scannedCrateCodes.size   
                    } else if (row.crates) {
                        totalOrderCrates += (row.totalCrates || row.crates.length)
                    }
                    setScannedShipmentIds(scannedShipmentIds.filter((id: string) => id !== row.shipmentId.toString()));

            } else {
                    newTableData.push(row)
                    addedOrdernoMap[row.shipmentId] = row;
                }
        })

        setTabledata(newTableData);

        if (!tableData.length && !isEmpty(formStructure)) {
            const newStructure = deepCopy(formStructure);
            setTimeout(() => {
                newStructure['general details']['inscanBy']['editable'] = true;
            },100);
            dispatch({ type: '@@inscanOrderManifest/FETCH_SCANNED_ORDER_LIST_SUCCESS', payload: newStructure});
        }
        setTotalCrates((totalCrates) => totalCrates -= totalOrderCrates );
        setTotalInscannedOrders((totalInscannedOrders) => totalInscannedOrders -= Object.keys(selectedRows).length)
        setSelectedRows({});
        fetchOptions?.apis?.resetSelection();
    }
   
        return (
            <>
            <ListView
                rowIdentifier='shipmentId'
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
                onRowEditClick={() => {}}
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
                                                    onClick={() => removeOrder()}
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
            <CrateModal isOpen={isCrateDetailsModalOpen} onClose={setCrateDetailsModalOpen} crateDetails={crateDetails} />
            </>
    )
}

export default OrderInscanListview;