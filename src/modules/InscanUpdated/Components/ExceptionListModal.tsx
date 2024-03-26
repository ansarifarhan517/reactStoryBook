import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Modal, ModalHeader, IconButton, useToast, IListViewColumn, ISelectedRows, IFetchDataOptions, ListView, ISortOptions, FontIcon, IListViewRow } from 'ui-library';
import { ColumnInstance } from 'react-table'
import apiMappings from "../../../utils/apiMapping";
import axios from "../../../utils/axios";
import { transformMongoListViewToColumns } from "../../../utils/mongo/ListView";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import { InscanOrderManifestActions } from "../InscanOrderManifest.actions";
import { ExceptionListviewContainer, ExceptionListviewFooter, ModalHeaderWithIcon, ReloadRibbon } from "./InscanStyledComponent";
import { isEmpty, usePagination } from "../utils";
import { IExceptionData, IExceptionRecord } from "../InscanOrderManifest.models";
import { usePageVisibility } from "../../../utils/usePageVisibility";

interface IExceptionListModalProps {
    isOpen: boolean
    onClose: React.Dispatch<SetStateAction<boolean>>;
    scanSelectedType: any
    selectedAccordionType: string
    continueScanning: Function
    scanApiPayload: Record<string, any>
    setExceptionList: React.Dispatch<SetStateAction<IExceptionRecord[]>>
}
const ExceptionListModal = ({ isOpen, onClose, scanSelectedType, selectedAccordionType, continueScanning, scanApiPayload, setExceptionList }: IExceptionListModalProps) => {

    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.inscan);
    const toast = useToast();
    const isVisible = usePageVisibility();
    const dispatch = useDispatch<Dispatch<InscanOrderManifestActions>>();
    const structure = useTypedSelector(state => state.inscanUpdate.listview.exceptions.structure);
    const columnsSelector = useTypedSelector(state => state.inscanUpdate.listview.exceptions.structure.columns);
    const loading = useTypedSelector(state => state.inscanUpdate.listview.exceptions.loading);
    const rowsSelector = useTypedSelector(state => state.inscanUpdate.listview.exceptions.data.results);
    const [columns, setColumns] = useState<IListViewColumn[]>([]);
    const [selectedRows, setSelectedRows] = useState<ISelectedRows>({})
    const [showColumnShimmer, setShowColumnShimmer] = useState<boolean>(false)
    const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
    const [rowData, setRowData] = useState<IExceptionData>({ clientBranchId: 0, otherCount: 0, results: [], totalCount: 0});
    const isToggledRef = React.useRef(isVisible);
    const [moduleType, setModuleType] = useState<string>('orders');
    // initial listview structure loading
    useEffect(() => {
        setShowColumnShimmer(true)
        dispatch({ type: '@@inscanOrderManifest/FETCH_EXCEPTION_LISTVIEW_STRUCTURE' });
    }, []);

    // resetting values of toggle
    useEffect(() => {
        isToggledRef.current = isVisible;
    },[isVisible]);

    const fetchExceptionList = async () => {
        try {
            const { data: data } = await axios.get(`${apiMappings.inscanUpdate.form.getOrders}?scanIdentifier=${scanApiPayload.scanIdentifier}`);
                isToggledRef.current = true;
                if(data.data.hasOwnProperty('exceptionList')) {
                    setExceptionList(data.data.exceptionList.sort((a: IExceptionRecord, b: IExceptionRecord) => b.exceptionType.localeCompare(a.exceptionType)));
                } else {
                    setExceptionList([]);
                }
        } catch (error) {
            console.log(error)
            toast.add(dynamicLabels.somethingWendWrong, 'warning', false);
        }
    }     

    


    const paginateData = (data: any, pageNumber: number, pagSize: number) => {
        if(rowsSelector && rowsSelector?.length > 0) {
            const exceptionList = usePagination(data, pageNumber, pagSize);
            setRowData({ clientBranchId: 0, otherCount: 0, results: exceptionList as IExceptionRecord[], totalCount: exceptionList.length});
        }
    }
    
    // pagination
    useEffect(() => {   
        if(rowsSelector && rowsSelector?.length > 0 && !isEmpty(fetchOptions)) {
            paginateData(rowsSelector, Number(fetchOptions?.pageNumber), Number(fetchOptions?.pageSize));
        } else {
            setRowData({ clientBranchId: 0, otherCount: 0, results: [], totalCount: 0});
        }
    }, [fetchOptions, rowsSelector]);

    useEffect(() => {
        if(rowsSelector && rowsSelector?.length > 0) {
            const module = rowsSelector[0].moduleName;
            setModuleType(module)
        }
    },[rowsSelector])

    const cellCallbackMapping = {
    }


    // updating columns preferences
    useEffect(() => {
        const mongoStructure = columnsSelector;

        if (Object.keys(mongoStructure).length) {
            const newColumns = transformMongoListViewToColumns(mongoStructure, 'exceptionList', cellCallbackMapping)
            setColumns(newColumns)
        }
        const firstEntry: any = Object.values(columnsSelector)?.[0]
        if (firstEntry?.id) {
            setTimeout(() => { setShowColumnShimmer(false) }, 0)
        }

    }, [columnsSelector]);

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
            const { data: { message } } = await axios.put(apiMappings.inscanUpdate.listview.exceptions.structure, payload)
            message && toast.add(message, 'check-round', false)
        } catch (error) {
            console.log(error)
        }
    }, [columnsSelector]);

    return (
        <Modal open={isOpen} onToggle={() => onClose(false)} size='md' width="1140px">
            {{
                header: <ModalHeaderWithIcon><FontIcon variant="alert-for-popups"/> <ModalHeader width="1140px" headerTitle={moduleType === 'Manifests' ? `${dynamicLabels.exceptionAlertInManifestID} #${scanApiPayload.scanIdentifier}` : dynamicLabels.exceptionAlert} handleClose={() => onClose(false)} /></ModalHeaderWithIcon>,

                content: (<ExceptionListviewContainer> 
                    {!isToggledRef.current && <ReloadRibbon><span onClick={() => fetchExceptionList()}>{dynamicLabels.clickHere}</span> {dynamicLabels.reloadExceptionList}</ReloadRibbon>}
                    <ListView
                        rowIdentifier='orderNo'
                        style={{ height: '100%', overflow: 'hidden', minHeight: '60vh' }}
                        columns={columns}
                        data={!rowsSelector ? [] : rowData?.results as IListViewRow[]}
                        onFetchData={handleFetchData}
                        isEditMode={true}
                        hasRowSelectionWithEdit={true}
                        hasRowSelection={false}
                        onRowSelect={onRowSelect}
                        onSortChange={onSortChange}
                        hideColumnSettings={true}
                        onSaveColumnPreferences={onSaveColumnPreferences}
                        hidePaginationBar={false}
                        totalRows={rowData.totalCount}
                        loading={showColumnShimmer || loading}
                        isColumnLoading={showColumnShimmer}
                        onRowEditClick={() => { }}
                    />
                </ExceptionListviewContainer>),
                footer: (
                <ExceptionListviewFooter>
                       <IconButton id='inscan-exceptionModal-button-continueScanning' iconVariant='scan-continue' disabled={rowsSelector?.some((row: IExceptionRecord) => row.exceptionType === "Restrictive")} primary onClick={() => continueScanning(scanSelectedType, selectedAccordionType)}>{dynamicLabels.continueScanning}</IconButton>
                       <IconButton id='inscan-exceptionModal-button-Cancel' iconVariant='scan-cancel'  onClick={() => onClose(false)} >{dynamicLabels.cancelScanning}</IconButton>
                </ExceptionListviewFooter>),
            }}
        </Modal>
    )
}

export default ExceptionListModal;