import React, { Dispatch, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ExceptionHandlingActions } from "../ExceptionHandling.actions";
import { ColumnInstance } from 'react-table'
import {
    Box, ListView, IListViewColumn, IFetchDataOptions, IconButton,
    useToast, ISelectedRows, IconDropdown, Tooltip, ISortOptions
} from 'ui-library'
import { transformMongoListViewToColumns } from "../../../../utils/mongo/ListView";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { iconsMapping, IRowData } from "../ExceptionHandling.models";
import axios from "../../../../utils/axios";
import apiMappings from "../../../../utils/apiMapping";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import AllExceptionListviewModals from "./SubComponents/AllExceptionListviewModals";
import DownloadListModal from './DownloadListModal';
import { sendGA } from "../../../../utils/ga";
import { ActionBarContainer } from "../ExceptionHandlingStyledComponents";
import { debounce } from "../../../../utils/commonFunctions/lodashFunctions";

const AllExceptionListView = () => {

    /** General Hooks */
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.exceptionHandling)
    const toast = useToast()
    const history = useHistory();
    /** Redux Hooks */
    const dispatch = useDispatch<Dispatch<ExceptionHandlingActions>>();
    const structure = useTypedSelector(state => state.exceptionHandling.listview.allExceptions.structure)
    const columnsSelector = useTypedSelector(state => state.exceptionHandling.listview.allExceptions.structure.columns)
    const actionBarButtons = useTypedSelector(state => state.exceptionHandling.listview.allExceptions.structure.buttons)
    const rowsSelector = useTypedSelector(state => state.exceptionHandling.listview.allExceptions.data.results)
    const totalRowsSelector = useTypedSelector(state => state.exceptionHandling.listview.allExceptions.data.totalCount)
    const loading = useTypedSelector(state => state.exceptionHandling.listview.allExceptions.loading)
    const viewMode = useTypedSelector((state) => state.exceptionHandling.viewType)
    /** State */
    const [columns, setColumns] = useState<IListViewColumn[]>([]);
    const [selectedRows, setSelectedRows] = useState<ISelectedRows>({})
    const [showColumnShimmer, setShowColumnShimmer] = useState<boolean>(false)
    const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<string>('');
    const [isDeleteError, setDeleteError] = useState<boolean>(false);
    const [isUpdateError, setUpdateError] = useState<boolean>(false);
    const [activeInactiveCount, setActiveInactiveCount] = useState<number>(0);




    useEffect(() => {
        setShowColumnShimmer(true)
        dispatch({ type: '@@exceptionHandling/FETCH_ALL_EXCEPTIONS_LISTVIEW_STRUCTURE' });
    }, []);

    useEffect(() => {
        const mongoStructure = columnsSelector;

        if (Object.keys(mongoStructure).length) {
            const newColumns = transformMongoListViewToColumns(mongoStructure, 'allExceptions', cellCallbackMapping)
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
            sendGA('All Exceptions', `${length === 1 ? 'Click - Single Exception' : 'Click - Multiple Exceptions'}`);
        }
    },[selectedRows]);

    /** List View Callbacks */
    const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {
        
        setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis })
        sendGA('All Exceptions', `List Action - ${pageSize} - ${pageNumber} - ${sortOptions?.sortBy} - ${sortOptions?.sortOrder} - ${filterOptions?.searchBy} - ${filterOptions?.searchText}`);
        dispatch({
            type: '@@exceptionHandling/FETCH_ALL_EXCEPTIONS_LIST',
            payload: {
                pageNumber: pageNumber,
                pageSize: pageSize,
                searchBy: filterOptions?.searchBy,
                searchText: filterOptions?.searchText && filterOptions?.searchText === 'Action Required' ? 'Restrictive': filterOptions?.searchText,
                sortBy: sortOptions?.sortBy,
                sortOrder: sortOptions?.sortOrder
            }
        })
    }, [])
    const onSortChange = React.useCallback((sortObject: ISortOptions) => {
        sendGA('All Exceptions', `Click - ${sortObject?.sortBy} - ${sortObject?.sortOrder}`);
     }, [])


    const onRowSelect = React.useCallback((s: ISelectedRows) => {
        setSelectedRows(s)
    }, []);

    const onSaveColumnPreferences = React.useCallback(async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
        sendGA('All Exceptions', `Click - Save and Apply Column Selector`);
        const columns = { ...columnsSelector }
        Object.keys(columns).forEach((columnKey) => {
            columns[columnKey].permission = !!visibleColumns[columnKey]
        })

        const payload = {
            ...structure,
            columns
        }

        try {
            const { data: { message } } = await axios.put(apiMappings.exceptionHandling.listview.allExceptions.structure, payload)
            message && toast.add(message, 'check-round', false)
        } catch (error) {
            console.log(error, error?.response)
        }
    }, [columnsSelector])


    const handleDeleteException = () => {
        sendGA('All Exceptions', `Click - Delete Exception`);
        setModalType('delete');
        setDeleteError(false)
        setModalOpen(true);
    }


    const deleteException = debounce( async () => {
        const payload = Object.keys(selectedRows).map((key) => selectedRows[key].exceptionGroupId);
        try {

            const { data: { status, message } } = await axios.delete(apiMappings.exceptionHandling.listview.allExceptions.delete, { data: payload })
            if (status === 200) {
                setModalOpen(false);
                toast.add(message, 'check-round', false);
                setSelectedRows && setSelectedRows({});
                setDeleteError(false)
                fetchOptions.apis?.resetSelection();
                handleFetchData(fetchOptions)
                return;
            }
            throw message;

        } catch (error) {
            setDeleteError(true)
            if(error?.response.status === 400 && error?.response?.data?.message) {
                toast.add(error?.response?.data?.message, 'warning', false);
            } else {
                toast.add(error.message, 'warning', false);
            }
            console.log(error, error?.response)
        }
    },500)

    const handleMarkException = (id: string) => {
        sendGA('All Exceptions', `${id === 'active' ? 'Click - Mark as Active' : 'Click - Mark as Inactive'}`);
        setModalType(id);
        setActiveInactiveCount(Object.keys(selectedRows).filter((key) => selectedRows[key].isActiveFl === (id === 'active' ? true : false)).length);
        setUpdateError(Object.keys(selectedRows).filter((key) => selectedRows[key].isActiveFl === (id === 'active' ? true : false)).length > 0);
        setModalOpen(true);
    }

    const markException = async (id: string) => {

        let active = id === 'active' ? true : false;

        const payload = Object.keys(selectedRows).map((key) => selectedRows[key].exceptionGroupId);
        try {
            const { data: { status, message } } = await axios.put(`${apiMappings.exceptionHandling.listview.allExceptions.active}?isActive=${active}`, payload)
            if (status === 200) {
                setModalOpen(false);
                toast.add(message, 'check-round', false);
                setSelectedRows && setSelectedRows({});
                setUpdateError(true);
                fetchOptions.apis?.resetSelection();
                handleFetchData(fetchOptions)
                return;
            }
        } catch (error) {
            setUpdateError(false);
            setModalOpen(false);
            setSelectedRows && setSelectedRows({});
            fetchOptions.apis?.resetSelection();
            if(error?.response.status === 400 && error?.response?.data?.message) {
                toast.add(error?.response?.data?.message, 'warning', false);
            } else {
                toast.add(error.message, 'warning', false);
            }
        }
    }

    const handleEditException = (row: IRowData) => {
        const { exceptionGroupId } = row;
        dispatch({ type: '@@exceptionHandling/SET_VIEW_TYPE', payload: 'addExceptionForm' })
        history.push(`/addExceptionForm/${exceptionGroupId}`)
    }

const onShowMoreColumns = () => {
    sendGA('All Exceptions', `Click - Column Selector`);
}

    return (<>
        <ListView
            rowIdentifier='exceptionGroupId'
            style={{ height: '100%', overflow: 'hidden' }}
            columns={columns}
            data={rowsSelector}
            onFetchData={handleFetchData}
            hasRowSelectionWithEdit={viewMode === 'allExceptions' && actionBarButtons?.['updateException']?.permission}
            hasRowSelection={viewMode === 'allExceptions' && !actionBarButtons?.['updateException']?.permission}
            onRowSelect={onRowSelect}
            onSortChange={onSortChange}
            onShowMoreColumns={onShowMoreColumns}
            onSaveColumnPreferences={onSaveColumnPreferences}
            totalRows={totalRowsSelector}
            loading={showColumnShimmer || loading}
            isColumnLoading={showColumnShimmer}
            hideColumnSettings={false}
            onRowEditClick={(row) => {
                sendGA('All Exceptions',`Click - Update Exception`);
                handleEditException(row as IRowData);
            }}
        >
            {{
                IconBar:
                    <DownloadListModal fetchOptions={fetchOptions} downloadType='allExceptions' />,
                ActionBar:
                    <ActionBarContainer display='flex' horizontalSpacing='10px'>

                        {Object.keys(actionBarButtons).map(buttonKey => actionBarButtons[buttonKey].permission &&
                            (
                                buttonKey === 'delete' ?
                                    <Tooltip key={buttonKey} message={actionBarButtons[buttonKey].label}
                                        hover
                                        messagePlacement={'center'}
                                    >
                                        <div key={buttonKey}>
                                            <IconButton
                                                key={buttonKey}
                                                disabled={!Object.keys(selectedRows).length}
                                                intent='table'

                                                iconVariant={iconsMapping[buttonKey]}
                                                id={`listView-actionBar-${buttonKey}`}
                                                onClick={handleDeleteException}
                                            >
                                                {actionBarButtons[buttonKey].label}
                                            </IconButton>
                                        </div>
                                    </Tooltip>
                                    : buttonKey === 'markAs' && actionBarButtons[buttonKey].hasOwnProperty('childNodes') && Object.keys(actionBarButtons[buttonKey]['childNodes']!).length ?
                                        <div key={buttonKey}>
                                            <IconDropdown
                                                key={buttonKey}
                                                disabled={!Object.keys(selectedRows).length}
                                                variant='button-dropdown'
                                                intent='table'
                                                iconVariant={iconsMapping[buttonKey]}
                                                optionList={Object.keys(actionBarButtons[buttonKey]['childNodes']!).map((key) => { return { label: actionBarButtons[buttonKey]['childNodes']?.[key]?.label, value: key, id: key } })}
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
                                        : <></>
                            )
                        )
                        }
                    </ActionBarContainer>
            }
            }
        </ListView>
        {isModalOpen && 
        <AllExceptionListviewModals isModalOpen={isModalOpen} setModalOpen={setModalOpen} modalType={modalType} modalWidth="600px" deleteException={deleteException} isDeleteError={isDeleteError} markException={markException} isUpdateError={isUpdateError} activeInactiveCount={activeInactiveCount} />}
    </>
    );
}

export default AllExceptionListView;