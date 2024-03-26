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
import { OutscanOrderManifestActions } from "../OutscanOrderManifest.actions";
import { ICrateDetails, IOrderRecord, IScannedOrderListviewDataPayload } from "../OutscanOrderManifest.models";
import { isEmpty, usePagination } from "../utils";
import CrateDetailsModal from "./CrateDetailsModal";
import { ActionBarContainer } from "./OutscanStyledComponent";

interface IOrderOutscanListviewProps {
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
    totalOutscannedOrders: number
    setTotalOutscannedOrders: Dispatch<SetStateAction<number>>;
    
}

const OrderOutscanListview = (props: IOrderOutscanListviewProps) => {
    const {tableData, setTabledata, setTotalCratesCount, setTotalWeight, setTotalVolume, setTotalPendingOrders, scannedShipmentIds, setScannedShipmentIds, totalOutscannedOrders, setTotalOutscannedOrders} = props;
     /** General Hooks */
    const toast = useToast()

    /** Redux Hooks */
    const dispatch = useDispatch<Dispatch<OutscanOrderManifestActions>>();
    const structure = useTypedSelector(state => state.outscan.listview.orders.structure)
    const formStructure = useTypedSelector(state => state.outscan.form.structure);
    const columnsSelector = useTypedSelector(state => state.outscan.listview.orders.structure.columns)
    const actionBarButtons = useTypedSelector(state => state.outscan.listview.orders.structure.buttons)
    const rowsSelector = useTypedSelector(state => state.outscan.listview.orders.data.results)
    const totalRowsSelector = useTypedSelector(state => state.outscan.listview.orders.data.totalCount)
    const loading = useTypedSelector(state => state.outscan.listview.orders.loading)
    const isFormEditable = useTypedSelector(state => state.outscan.form.isEditable);
    /** State */
    const [columns, setColumns] = useState<IListViewColumn[]>([]);
    const [selectedRows, setSelectedRows] = useState<ISelectedRows>({})
    const [showColumnShimmer, setShowColumnShimmer] = useState<boolean>(false)
    const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
    const [crateDetails, setCrateDetails] = useState<Record<string,ICrateDetails[]>>({});
    const [isCrateDetailsModalOpen, setCrateDetailsModalOpen] = useState<boolean>(false);
    const [rowData, setRowData] = useState<IScannedOrderListviewDataPayload>({ clientBranchId: 0, otherCount: 0, results: [], totalCount: 0});
    // intial data loading
    useEffect(() => {
        setShowColumnShimmer(true)
        dispatch({ type: '@@outscanOrderManifest/FETCH_ORDER_OUTSCAN_LISTVIEW_STRUCTURE' });
    }, []);


    const paginateData = (data: IOrderRecord[], pageNumber: number, pagSize: number) => {
        if(rowsSelector && rowsSelector?.length > 0) {
            const orderList = usePagination(data, pageNumber, pagSize);
            setRowData({ clientBranchId: 0, otherCount: 0, results: orderList as IOrderRecord[], totalCount: orderList.length});
        } 
    }
    // pagination
    useEffect(() => {   
        if(rowsSelector && rowsSelector?.length > 0 && !isEmpty(fetchOptions)) {
            paginateData(rowsSelector, Number(fetchOptions?.pageNumber), Number(fetchOptions?.pageSize))
        } else {
            setRowData({ clientBranchId: 0, otherCount: 0, results: [], totalCount: 0});
        }
    }, [fetchOptions, rowsSelector]);

    // transforming columns
    useEffect(() => {
        const mongoStructure = columnsSelector;

        if (Object.keys(mongoStructure).length) {
            const newColumns = transformMongoListViewToColumns(mongoStructure, 'outscanOrders', cellCallbackMapping)
            setColumns(newColumns)
        }
        const firstEntry: any = Object.values(columnsSelector)?.[0]
        if (firstEntry?.id) {
            setTimeout(() => { setShowColumnShimmer(false) }, 0)
        }

    }, [columnsSelector]);

    
    const handleCrateCdScanStatusClick = (orderData: IListViewRow) => {
        const popupData = {
            scannedCrates: [] as Array<ICrateDetails>,
            notScannedCrates: [] as Array<ICrateDetails>
        }
        
        if (orderData.scannedCrateCodes) {
            orderData.crates.forEach((crateObj: ICrateDetails) => {
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
            const { data: { message } } = await axios.put(apiMappings.outscan.listview.orders.structure, payload)
            message && toast.add(message, 'check-round', false)
        } catch (error) {
            console.log(error, error?.response)
        }
    }, [columnsSelector]);

    const removeOrder = () => {
        let newTableData:Array<IOrderRecord> = [];
        let addedOrdernoMap = {};
        let totalOrderCrateCodes = 0;
        let totalOrderWeight = 0;
        let totalOrderVolume = 0;

        tableData.forEach((row:IOrderRecord) => {

            if(selectedRows[row.shipmentId]) {
                totalOrderWeight += row.packageWeight || 0
                totalOrderVolume += row.packageVolume || 0
                if (row.scannedCrateCodes) {
                        totalOrderCrateCodes += row.scannedCrateCodes.size   
                    } else if (row.crates) {
                        totalOrderCrateCodes += (row.totalCrates || row.crates.length)
                    }
                setScannedShipmentIds(scannedShipmentIds.filter((id: string) => id !== row.shipmentId.toString()));
            } else {
                    newTableData.push(row)
                    addedOrdernoMap[row.shipmentId] = row;
            }
        })

        setTabledata(newTableData);
            setTotalOutscannedOrders((totalOutscannedOrders) =>  totalOutscannedOrders -= Object.keys(selectedRows).length)
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
            },100);
            dispatch({ type: '@@outscanOrderManifest/FETCH_ADD_MANIFEST_FORM_STRUCTURE_SUCCESS', payload: newStructure});
        }
            setTotalCratesCount((totalCrateCodes) => totalCrateCodes - totalOrderCrateCodes);
            setTotalWeight((totalWeight) => totalWeight -= totalOrderWeight);
            setTotalVolume((totalVolume) => totalVolume -= totalOrderVolume);
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
                hideRefresh={showColumnShimmer || loading}
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
            <CrateDetailsModal isOpen={isCrateDetailsModalOpen} onClose={setCrateDetailsModalOpen} crateDetails={crateDetails} />
            </>
    )
}

export default OrderOutscanListview;