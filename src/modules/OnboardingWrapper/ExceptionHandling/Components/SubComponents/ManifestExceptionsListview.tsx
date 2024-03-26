import React, { Dispatch, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ListView, IconDropdown, IListViewColumn, ISelectedRows, IFetchDataOptions, useToast, Box, ISortOptions } from "ui-library";
import apiMappings from "../../../../../utils/apiMapping";
import axios from "../../../../../utils/axios";
import { ColumnInstance } from 'react-table'
import { transformMongoListViewToColumns } from "../../../../../utils/mongo/ListView";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import { ExceptionHandlingActions } from "../../ExceptionHandling.actions";
import { exceptionStatusMapping, iconsMapping } from "../../ExceptionHandling.models";
import OrderManifestsListviewModals from "./OrderManifestsListviewModals";
import DownloadListModal from "../DownloadListModal";
import { sendGA } from "../../../../../utils/ga";
import { isEmpty } from "../../utils";
import { ActionBarContainer } from "../../ExceptionHandlingStyledComponents";
interface IManifestExceptionsProps {
    selectedDate: {
        startDate: string
        endDate: string
    }
}

const ManifestExceptionsListview = (props: IManifestExceptionsProps) => {
    const { selectedDate } = props;
    const [modalType, setModalType] = useState<string>('');
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    /** Redux Hooks */
    const dispatch = useDispatch<Dispatch<ExceptionHandlingActions>>();
    const toast = useToast()

    const structure = useTypedSelector(state => state.exceptionHandling.listview.raisedExceptions.manifests.structure)
    const columnsSelector = useTypedSelector(state => state.exceptionHandling.listview.raisedExceptions.manifests.structure.columns)
    const actionBarButtons = useTypedSelector(state => state.exceptionHandling.listview.raisedExceptions.manifests.structure.buttons)
    const rowsSelector = useTypedSelector(state => state.exceptionHandling.listview.raisedExceptions.manifests.data.results)
    const totalRowsSelector = useTypedSelector(state => state.exceptionHandling.listview.raisedExceptions.manifests.data.totalCount)
    const loading = useTypedSelector(state => state.exceptionHandling.listview.raisedExceptions.manifests.loading);
    const exceptionStatus = useTypedSelector((state) => state.exceptionHandling.listview.raisedExceptions.breadcrumbState);
    /** State */
    const [columns, setColumns] = useState<IListViewColumn[]>([]);
    const [selectedRows, setSelectedRows] = useState<ISelectedRows>({})
    const [showColumnShimmer, setShowColumnShimmer] = useState<boolean>(false)
    const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
    useEffect(() => {
        setShowColumnShimmer(true);
        dispatch({ type: '@@exceptionHandling/FETCH_MANIFEST_EXCEPTIONS_LISTVIEW_STRUCTURE' })
        dispatch({ type: '@@exceptionHandling/FETCH_EXCEPTION_STATUS' });
        dispatch({ type: '@@exceptionHandling/FETCH_EXCEPTION_TYPE_LIST' });
    }, []);

    useEffect(() => {
        const mongoStructure = columnsSelector;

        if (Object.keys(mongoStructure).length) {
            const newColumns = transformMongoListViewToColumns(mongoStructure, 'manifestExceptions', cellCallbackMapping)
            setColumns(newColumns)
        }
        const firstEntry: any = Object.values(columnsSelector)?.[0]
        if (firstEntry?.id) {
            setTimeout(() => { setShowColumnShimmer(false) }, 0)
        }

    }, [columnsSelector]);

    const cellCallbackMapping = {
    }

    useEffect(() => {
        const length = Object.keys(selectedRows).length;
        if(length > 0) {
            sendGA('Raised Exceptions - Manifests', `${length === 1 ? 'Click - Single Manifest' : 'Click - Multiple Manifests'}`);
        }
    },[selectedRows]);



    /** List View Callbacks */
    const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {

        setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis });

        sendGA('Raised Exceptions - Manifests', `List Action - ${pageSize} - ${pageNumber} - ${sortOptions?.sortBy} - ${sortOptions?.sortOrder} - ${filterOptions?.searchBy} - ${filterOptions?.searchText}`);

        dispatch({
            type: '@@exceptionHandling/FETCH_MANIFEST_EXCEPTIONS_LIST',
            payload: {
                module: "Manifests",
                startDateFilter: selectedDate?.startDate,
                endDateFilter: selectedDate?.endDate,
                exceptionStatus: exceptionStatusMapping[exceptionStatus],
                pageNumber: pageNumber,
                pageSize: pageSize,
                searchBy: isEmpty(filterOptions!) ? exceptionStatusMapping[exceptionStatus] === "ALL" ? undefined : 'exceptionStatus' : (exceptionStatusMapping[exceptionStatus] === "ALL") ? filterOptions?.searchBy : 'exceptionStatus' + "#@#" + filterOptions?.searchBy,
                searchText: isEmpty(filterOptions!) ? exceptionStatusMapping[exceptionStatus] === "ALL" ? undefined : exceptionStatusMapping[exceptionStatus] : (exceptionStatusMapping[exceptionStatus] === "ALL") ? filterOptions?.searchText : exceptionStatusMapping[exceptionStatus] + "#@#" + filterOptions?.searchText,
                sortBy: sortOptions?.sortBy,
                sortOrder: sortOptions?.sortOrder
            }
        })
    }, [exceptionStatus, selectedDate])
    const onSortChange = React.useCallback((sortObject: ISortOptions) => {
        sendGA('Raised Exceptions - Manifests', `Click - ${sortObject?.sortBy} - ${sortObject?.sortOrder}`);
     }, [])


    const onRowSelect = React.useCallback((s: ISelectedRows) => {
        setSelectedRows(s);
    }, []);

    const onSaveColumnPreferences = React.useCallback(async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
        sendGA('Raised Exceptions - Manifests', `Click - Save and Apply Column Selector`);
        const columns = { ...columnsSelector }
        Object.keys(columns).forEach((columnKey) => {
            columns[columnKey].permission = !!visibleColumns[columnKey]
        })

        const payload = {
            ...structure,
            columns
        }

        try {
            const { data: { message } } = await axios.put(apiMappings.exceptionHandling.listview.raisedExceptions.manifests.structure, payload)
            message && toast.add(message, 'check-round', false)
        } catch (error) {
            console.log(error, error?.response)
        }
    }, [columnsSelector])

    const markException = async (notes: string) => {

        sendGA('Raised Exceptions - Manifests', `${modalType === "rejected" ? "Click - Reject Exception" : "Click - Resolve Exception"}`);

        const payload = {
            ids: Object.keys(selectedRows).map((key) => selectedRows[key].raisedExceptionId),
            exceptionNotes: notes,
            moduleName: 'Manifests'
        }
        try {
            const { data: { message } } = await axios.put(`${apiMappings.exceptionHandling.listview.raisedExceptions.resolveReject}?status=${modalType === "rejected" ? "REJECTED" : "CLOSED"}`, payload)
            message && toast.add(message, 'check-round', false)
            handleModalCancel();
            handleFetchData(fetchOptions);
        } catch (error) {
            console.log(error, error?.response)
        }
    }

    const handleMarkException = (id: string) => {
        setModalOpen(true);
        setModalType(id);
        sendGA('Raised Exceptions - Manifests', `${id === "rejected" ? "Click - Mark as Rejected" : "Click - Mark as Resolved"}`);
    }

    const handleModalCancel = () => {
        fetchOptions.apis?.resetSelection();
        fetchOptions.apis?.setSelection({});
        setSelectedRows({});
        setModalOpen(false);
    }

    const onShowMoreColumns = () => {
        sendGA('Raised Exceptions - Manifests', `Click - Column Selector`);
    }

    return (
        <>
        <ListView
            rowIdentifier='raisedExceptionId'
            style={{ height: '100%', overflow: 'hidden' }}
            columns={columns}
            data={rowsSelector}
            onFetchData={handleFetchData}
            hasRowSelectionWithEdit={false}
            hasRowSelection={true}
            onRowSelect={onRowSelect}
            onSortChange={onSortChange}
            onSaveColumnPreferences={onSaveColumnPreferences}
            totalRows={totalRowsSelector}
            loading={showColumnShimmer || loading}
            onShowMoreColumns={onShowMoreColumns}
            isColumnLoading={showColumnShimmer}
            hideColumnSettings={false}
            onRowEditClick={() => {}}
        >
            {{
                IconBar: 
                <DownloadListModal fetchOptions={fetchOptions} downloadType='manifestsExceptions' selectedDate={selectedDate}/>,
                ActionBar:
                    <ActionBarContainer display='flex' horizontalSpacing='10px'>

                        {Object.keys(actionBarButtons).map(buttonKey => actionBarButtons[buttonKey].permission && actionBarButtons[buttonKey].hasOwnProperty('childNodes') && Object.keys(actionBarButtons[buttonKey]['childNodes']!).length > 0 &&
                            (buttonKey === 'markAs' &&
                                <div key={buttonKey}>
                                    <IconDropdown
                                        id={`manifest_exceptions--actionbar--${buttonKey}`}
                                        key={buttonKey}
                                        disabled={!Object.keys(selectedRows).length || Object.keys(selectedRows).some((key) => selectedRows[key].exceptionStatus !== 'OPEN')}
                                        variant='button-dropdown'
                                        intent='table'
                                        iconVariant={iconsMapping[buttonKey]}
                                        optionList={Object.keys(actionBarButtons[buttonKey]['childNodes']!).map((key) => {return {label: actionBarButtons[buttonKey]['childNodes']?.[key]?.label, value: key, id: key}})}
                                        tooltipMessage={actionBarButtons[buttonKey].label}
                                        iconButtonDetails={[
                                            iconsMapping[buttonKey],
                                            actionBarButtons[buttonKey].label,
                                            'icomoon-angle-bottom'
                                        ]}
                                        onChange={handleMarkException}
                                        isSingleClickOption 
                                    />
                                </div>
                            )
                        )
                        }
                    </ActionBarContainer>
            }
            }
        </ListView>
        <OrderManifestsListviewModals modalType={modalType} isModalOpen={isModalOpen} handleModalCancel={handleModalCancel} modalWidth="600px" markException={markException} activeTab="manifests" />
        </>
    )
}

export default ManifestExceptionsListview;