import React, { Dispatch, useEffect, useState } from 'react'
import {
    Box, ListView, Tooltip, IconButton, IListViewColumn, useToast, IFetchDataOptions, ISelectedRows, Grid, BreadCrumb,
    IFilterOptions, ISortOptions
} from 'ui-library'
import { ColumnInstance, SortingRule } from 'react-table'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import { tOrderRequestListViewAcions } from './OrderRequestListView.actions'
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels'
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping'
import WhiteCard from '../../../utils/layouts/WhiteCard'
import { AdvancedFilterLabel, AppliedFilterStrip, BreadCrumbTagWrapper, FilterAppliedTag, FilterAppliedTagButtonWrapper, FilterAppliedTagLabel, StyledGrid } from './StyledOrderRequestListView'
import PageActionButtons from './SubComponents/PageActionButtons'
import { getQueryParams } from '../../../utils/hybridRouting'
import TextOverflowEllipsis from '../../../utils/components/TextOverflowEllipsis'
import iconsMapping from '../../../utils/mongo/ListView/actionBarIcons.mapping'
import axios from '../../../utils/axios'
import apiMappings from '../../../utils/apiMapping'
import { IOrderRequestListViewRowData, tOrderRequestStatus } from './OrderRequestListView.models'
import { transformMongoListViewToColumns } from '../../../utils/mongo/ListView'
import { sendGA } from '../../../utils/ga'
import withReact from '../../../utils/components/withReact'
import OrderRequestModals from './SubComponents/OrderRequestModals'
import { IStateService } from 'angular-ui-router'
import { ButtonWrapper } from './StyledOrderRequestListView'
import DownloadOrderRequestModal from './SubComponents/DownloadOrderRequestModal'
import NoDataView from '../../../utils/components/NoDataView'
import {AdvancedFilterComponentActions} from '../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions'
import AdvancedFilterComponent from '../../common/AdvancedFilterComponent'
import { throwError,validateRows } from '../../common/InlineEdit/InlineEdit'
import { IOrderFetchDataOptions } from '../../Order/OrderListView/OrderListView.models'

interface IOrderRequestListView {
    ngStateRouter: IStateService
}

const OrderRequestListView = ({ ngStateRouter }: IOrderRequestListView) => {
    /** Redux Hooks */
    const dispatch = useDispatch<Dispatch<tOrderRequestListViewAcions>>()
    const advanceFilterdispatch = useDispatch<Dispatch<AdvancedFilterComponentActions>>();

    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.orderRequest)
    const pageLabels = useTypedSelector(state => state.pageLabels.booking);


    const columnsSelector = useTypedSelector(state => state.orderRequest.listView.structure.columns)
    const rowsSelector = useTypedSelector(state => state.orderRequest.listView.data.results)
    const totalRowsSelector = useTypedSelector(state => state.orderRequest.listView.data.totalCount)
    const structure = useTypedSelector(state => state.orderRequest.listView.structure)

    const editDetails = useTypedSelector(state => state.orderRequest.listView.editDetails)
    const selectedRows = useTypedSelector(state => state.orderRequest.listView.selectedRows)
    const [fetchOptions, setFetchOptions] = useState<IOrderFetchDataOptions>({});
    const stateFetchOptions = useTypedSelector(state => state.orderRequest.listView.fetchOptions)
    const isEditMode = useTypedSelector(state => state.orderRequest.listView.isEditMode)
    const actionBarButtons = useTypedSelector(state => state.orderRequest.listView.structure.buttons)
    const loading = useTypedSelector(state => state.orderRequest.listView.loading.listView)
    const isSaveClicked = useTypedSelector(state => state.orderRequest.listView.isSaveClicked);
    const emptyData = useTypedSelector(state => state.orderRequest.listView.emptyData);
    const breadcrumbFilter = useTypedSelector(state => state.orderRequest.listView.breadcrumbFilter)
    const appliedAdvancedFilterData = useTypedSelector(state => state.orderRequest.listView.appliedAdvancedFilterData);
    const minDate = useTypedSelector(state => state.orderRequest.listView.minDate);
    const maxDate = useTypedSelector(state => state.orderRequest.listView.maxDate);
    const dateRangeOpen = useTypedSelector(state => state.orderRequest.listView.dateRangeOpn);
    const filterListPayload = useTypedSelector(state => state.advanceFilter.filterListPayload)
    const currentFilter = useTypedSelector(state => state.advanceFilter.currentFilter)
    const openAdvFilter = useTypedSelector(state => state.advanceFilter.openAdvFilter)
    const advancedFilterData = useTypedSelector(state => state.advanceFilter.advancedFilterData)
    const [isFilterDataCalled, setIsFilterDataCalled] = useState<boolean>(false);


    const toast = useToast()
    /** State */
    const [columns, setColumns] = useState<IListViewColumn[]>([])
    const [showColumnShimmer, setShowColumnShimmer] = useState<boolean>(false)
    const [sort, setSort] = useState<SortingRule<object>[]>()
    const [filters, setFilters] = useState<Record<string, string>>()

    const AdvanceFilterData = {
        sectionName : 'orderRequest' ,
        saveParams : {
            modelName: 'BOOKING',
            pageName: 'BOOKING',
            sectionName: `${breadcrumbFilter}_BOOKING_LIST_VIEW`
        }
    }


    /** Watchers */
    useEffect(() => {

        handleQueryParams()
        setShowColumnShimmer(true)
        dispatch({ type: '@@orderRequestListView/FETCH_STRUCTURE' })
        dispatch({ type: '@@orderRequestListView/INITIAL_LOAD' })
        handleFetchFilters();
        setFetchOptions(stateFetchOptions)
        advanceFilterdispatch({ type: '@@advanceFilter/SET_FILTERLIST_PAYLOAD', payload: undefined });
        advanceFilterdispatch({ type: '@@advanceFilter/SET_CURRENT_FILTERS', payload: undefined });
        advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: false });
        return (() => {
            dispatch({
                type: '@@orderRequestListView/RESET_INITIAL_STATE'
            })
        })
    }, [])



    useEffect(() => {
        const firstEntry: any = Object.values(columnsSelector)?.[0]
        if (columnsSelector && firstEntry?.id) {
            const mongoStructure = columnsSelector
            if (mongoStructure && Object.keys(mongoStructure).length) {
                const newColumns = transformMongoListViewToColumns(mongoStructure, 'orderRequest', {})
                setColumns(newColumns)
            }
            advanceFilterdispatch({ type: '@@advanceFilter/SET_COLUMNS_SELECTOR', payload: columnsSelector });

            // we have created dummy data for shimmer there not providing label,in actual data label will be there so show shimmer if dummy data
            setTimeout(() => { setShowColumnShimmer(false) }, 100)


        }

    }, [columnsSelector])

    // HANDLE QUERY PARAMS FOR HISTORY RENTENTION
    const handleQueryParams = () => {
        const filterData: Record<string, string> = getQueryParams();
        // if no current filter then dont apply filter
        /** Initialize Sort Options from Query Params */
        let sortBy = filterData?.sortBy?.split('#@#')
        let sortOrder = filterData?.sortOrder?.split('#@#')

        let sort: SortingRule<object>[] = [];
        sortBy?.forEach((element: string, index: number) => {
            let temp = {
                id: element,
                desc: sortOrder[index] === 'DESC'
            }
            sort.push(temp)
        });
        sort && setSort(sort)

        /** Initialize Filter from Query Params */
        let searchBy = filterData?.searchBy?.split('#@#');
        let searchText = filterData?.searchText?.split('#@#');

        let temp: Record<string, string> = {}
        searchBy && searchText &&
            searchBy?.forEach((s, index) => {
                temp[s] = searchText[index]
            })

        setFilters(temp)

        let breadcrumb: tOrderRequestStatus = filterData?.page as tOrderRequestStatus
        if (filterData?.minDate && filterData?.maxDate) {
            dispatch({
                type: '@@orderRequestListView/SET_SELECTED_DATE', payload: {
                    minDate: filterData?.startDateFilter,
                    maxDate: filterData?.endDateFilter
                }
            })
        }

        dispatch({
            type: '@@orderRequestListView/SET_BREADCRUMB_STATE',
            payload: breadcrumb || 'ALL',
        });
    }

    const getBreadCrumbOptions = () => {
        const dropdownValues = pageLabels?.dropdownValues
        return dropdownValues ? [
            {
                label: dropdownValues['allBookings'],
                value: 'ALL',
                id: 'ALL',
                key: 'allBookings',
            },
            {
                label: dropdownValues['cancelledBookings'],
                value: 'CANCELLED',
                id: 'CANCELLED',
                key: 'cancelledBookings'
            }, {
                label: dropdownValues['confirmedBookings'],
                value: 'CONFIRMED',
                id: 'CONFIRMED',
                key: 'confirmedBookings'
            },
            {
                label: dropdownValues['pendingBookings'],
                value: 'PENDING',
                id: 'PENDING',
                key: 'pendingBookings'
            }, {
                label: dropdownValues['rejectedBookings'],
                value: 'REJECTED',
                id: 'REJECTED',
                key: 'rejectedBookings'
            },

        ] : [

            ]
    }
    const breadCrumbOptionList = React.useMemo(
        () => getBreadCrumbOptions(),
        [dynamicLabels, pageLabels]
    );

    const breadCrumbOptions = React.useMemo(() => {
        const list: any = [
            { id: 'shipmentRequest', label: dynamicLabels?.bookings || "Shipment Request", disabled: true },
        ]
        const dynamicBreadcrumbHeader: any = breadCrumbOptionList.find(
            (option: any) => option.value === breadcrumbFilter
        );


        dynamicBreadcrumbHeader && list.push({
            label: dynamicBreadcrumbHeader?.label,
            value: dynamicBreadcrumbHeader?.value,
            id: dynamicBreadcrumbHeader?.value,
            key: dynamicBreadcrumbHeader?.key,
            disabled: false
        });
        return list
    }, [dynamicLabels, breadcrumbFilter, pageLabels])

    const handleBreadcrumbChange = (id: string) => {

        dispatch({ type: '@@orderRequestListView/SET_OPEN_DATERANGE', payload: false })
        if (id !== breadcrumbFilter) {
            dispatch({
                type: '@@orderRequestListView/SET_BREADCRUMB_STATE',
                payload: (id || 'ALL') as tOrderRequestStatus,
            })
            handleCancelRows()
            /** Clear other filters & sorts when Breadcrumb Filter changes */
            setTimeout(() => {
                ngStateRouter.go('bookings', { page: id || 'ALL' },
                    { notify: false, reload: false, inherit: false, location: true })
            }, 1000)

            setShowColumnShimmer(true)
            dispatch({ type: '@@orderRequestListView/FETCH_STRUCTURE' })

            dispatch({ type: '@@orderRequestListView/FETCH_DATA', payload: { isLoading: true } })
        } else {
            dispatch({
                type: '@@orderRequestListView/SET_BREADCRUMB_STATE',
                payload: (id || 'ALL') as tOrderRequestStatus,
            })
            setTimeout(() => {
                ngStateRouter.go('bookings', { page: id || 'ALL' },
                    { notify: false, reload: false, inherit: false, location: true })
            }, 1000)

        }

    }

    /********  FILTER CHANGE **************/
    const handleFilterChange = (combinedFilters: IFilterOptions) => {
        if (appliedAdvancedFilterData.length === 0) {
            let existingParams = getQueryParams()

            /** Do not push to history when there is no change. */
            if ((!combinedFilters.searchBy && !existingParams.searchBy) || (combinedFilters.searchBy === existingParams.searchBy && combinedFilters.searchText === existingParams.searchText)) {
                return
            }

            const newParams = {
                page: breadcrumbFilter,
                startDateFilter: minDate,
                endDateFilter: maxDate,
                ...(existingParams.sortBy ? { sortBy: existingParams.sortBy, sortOrder: existingParams.sortOrder } : {}),
                ...(combinedFilters.searchBy ? { searchBy: combinedFilters.searchBy, searchText: combinedFilters.searchText } : {})
            }
            setTimeout(() => {
                ngStateRouter.go('bookings', newParams, { notify: false, reload: false, inherit: false, location: true })
            }, 100)

        }
    }
    /********  SORT  CHANGE **************/
    const handleSortChange = (sortOptions: ISortOptions) => {
        if (appliedAdvancedFilterData.length === 0) {
            const existingParams = getQueryParams()

            /** Do not push to history when there is no change. */
            if ((!sortOptions.sortBy && !existingParams.sortBy) || (sortOptions.sortBy === existingParams.sortBy && sortOptions.sortOrder === existingParams.sortOrder)) {
                return
            }

            /** Construct new set of Query Params */
            const newParams = {
                page: breadcrumbFilter,
                startDateFilter: minDate,
                endDateFilter: maxDate,
                ...(sortOptions.sortBy ? { sortBy: sortOptions.sortBy, sortOrder: sortOptions.sortOrder } : {}),
                ...(existingParams.searchBy ? { searchBy: existingParams.searchBy, searchText: existingParams.searchText } : {})
            }
            setTimeout(() => {
                ngStateRouter.go('bookings', newParams, { notify: false, reload: false, inherit: false, location: true })
            }, 100)
        }

    }



    const onSaveColumnPreferences = React.useCallback(async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
        sendGA('Event New','Order Request - Save & Apply column preferences ')
        const columns = { ...columnsSelector }
        Object.keys(columns).forEach((columnKey) => {
            columns[columnKey].permission = !!visibleColumns[columnKey]
        })
        const payload = {
            ...structure,
            columns
        }
        try {
            const { data: { message } } = await axios.put(apiMappings.common.structure, payload, {
                params: {
                    modelName: 'BOOKING',
                    pageName: 'BOOKING',
                    sectionName: `${breadcrumbFilter}_BOOKING_LIST_VIEW`
                }
            })
            message && toast.add(message, 'check-round', false)
        } catch (error) {
            console.log(error, error?.response)
        }

    }, [columnsSelector, breadcrumbFilter])

    /** Inline Edit */
    const validateSelectedRows = () => {
        const columnStructure = columnsSelector

        try {
            validateRows(editDetails,columnStructure);
        } catch (error) {
            console.log('Inline Edit Validation Failed.', error?.message)
            dispatch({ type: '@@orderRequestListView/SET_IS_SAVE_CLICKED', payload: false });
            dispatch({ type: '@@orderRequestListView/SET_IS_EDITABLE', payload: true });
            throwError(error);

            if (error.message) {
                toast.add(error.message, '', false)
            }
            return false
        }

        return true
    }

    // right now just making provision for edit - it will be taken later on as no api exist for save
    const handleSaveRows = async () => {
        dispatch({ type: '@@orderRequestListView/SET_IS_SAVE_CLICKED', payload: true });
        const isValid = validateSelectedRows()
        if (isValid) {
            const payload: Partial<IOrderRequestListViewRowData>[] = []
            Object.values(selectedRows as ISelectedRows).forEach(row => {
                if (editDetails[row.bookingId]) {
                    const obj: any = {
                        id: row.bookingId
                    }
                    Object.keys(columnsSelector).forEach((columnId) => {
                        if (columnsSelector?.[columnId]?.editable && !columnsSelector?.[columnId]?.customField) {
                            if (editDetails?.[row.bookingId]?.[columnId]) {
                                obj[columnId] = editDetails?.[row.bookingId]?.[columnId]?.value || row[columnId]
                            }
                        }
                    })

                    const newObj = { ...row, ...obj }

                    payload.push(newObj)
                }
            })

            if (!payload.length) {
                handleCancelRows()
                return
            }

            try {
                const { data: { message, status } } = await axios.put(apiMappings.orderRequest.listView.inlineUpdate, payload)
                if (status === 200) {
                    dispatch({
                        type: '@@orderRequestListView/FETCH_DATA',
                        payload: {
                            pageNumber: fetchOptions?.pageNumber,
                            pageSize: fetchOptions?.pageSize,
                            searchBy: fetchOptions?.filterOptions?.searchBy,
                            searchText: fetchOptions?.filterOptions?.searchText,
                            sortBy: fetchOptions?.sortOptions?.sortBy,
                            sortOrder: fetchOptions?.sortOptions?.sortOrder,
                            isLoading: true
                        }
                    })
                    dispatch({ type: '@@orderRequestListView/SET_IS_SAVE_CLICKED', payload: false });
                    dispatch({ type: '@@orderRequestListView/SET_IS_EDITABLE', payload: false });
                    fetchOptions.apis?.resetSelection()
                    dispatch({ type: '@@orderRequestListView/SET_SELECTED_ROWS', payload: {} });
                    dispatch({ type: '@@orderRequestListView/CLEAR_EDIT_DETAILS' })
                    toast.add(message, 'check-round', false)
                    return
                }
                throw message
            } catch (errorMessage) {
                dispatch({ type: '@@orderRequestListView/SET_IS_SAVE_CLICKED', payload: false });
                dispatch({ type: '@@orderRequestListView/SET_IS_EDITABLE', payload: true });
                const message = errorMessage?.response?.data?.message

                toast.add(message || dynamicLabels.somethingWendWrong, 'warning', false)
            }
        }
    }

    const handleSave = () => {
        handleSaveRows();
    };

    const handleCancelRows = React.useCallback(() => {
        dispatch({ type: '@@orderRequestListView/SET_IS_SAVE_CLICKED', payload: false });
        dispatch({ type: '@@orderRequestListView/CLEAR_EDIT_DETAILS' });
        dispatch({ type: '@@orderRequestListView/SET_IS_EDITABLE', payload: false });
        fetchOptions.apis?.resetSelection();
        dispatch({ type: '@@orderRequestListView/SET_SELECTED_ROWS', payload: {} });

    }, [fetchOptions, editDetails]);

    const handleActionBarButtonClick = (id: string) => {
        switch (id) {
            case 'update':
                sendGA('Event New','Order Request - Update record')
                dispatch({ type: '@@orderRequestListView/SET_IS_EDITABLE', payload: true });
                break;
            case 'accept':
                sendGA('Event New','Order Request - Approve record')
                dispatch({ type: '@@orderRequestListView/SET_APPROVE_MODAL', payload: true });
                break;
            case 'reject':
                sendGA('Event New','Order Request - Reject record')
                dispatch({ type: '@@orderRequestListView/SET_REJECT_MODAL', payload: true });
                break;
        }
    }
    // Handle fetch Filters
    const handleFetchFilters = async (callBackAdvanceFilter=false) => {
        if((!isFilterDataCalled && ((advancedFilterData.length > 0 && advancedFilterData[0].sectionName != `${breadcrumbFilter}_BOOKING_LIST_VIEW`) || advancedFilterData?.length == 0)) || callBackAdvanceFilter){
            setIsFilterDataCalled(true)
            try {
                const { data } = await axios.get(apiMappings.advancedSearch.getFilters, {
                    params: {
                        modelName: 'BOOKING',
                        pageName: 'BOOKING',
                        sectionName: `${breadcrumbFilter}_BOOKING_LIST_VIEW`
                    }
                });
                if (data) {
                    setIsFilterDataCalled(false)
                    const isFavouriteFilter = data.find((filter: { isFavourite: boolean; }) => filter?.isFavourite);
                    if (isFavouriteFilter) {
                        advanceFilterdispatch({ type: '@@advanceFilter/SET_APPLIED_ADV_FILTER_DATA', payload: isFavouriteFilter?.filters });
                    }
                    advanceFilterdispatch({ type: '@@advanceFilter/SET_ADV_FILTER_DATA', payload: data });

                }
                return;
            } catch (errorMessage) {
                console.log(dynamicLabels.updateFilterFailed, errorMessage);
                toast.add(dynamicLabels.updateFilterFailed, 'warning', false);
            }
        }

    }

    /** List View Callbacks */
    const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {
        dispatch({ type: '@@orderRequestListView/SET_FETCH_OPTIONS', payload: { pageSize, pageNumber, sortOptions, filterOptions, apis } })
        dispatch({
            type: '@@orderRequestListView/FETCH_DATA',
            payload: {
                pageNumber: pageNumber,
                pageSize: pageSize,
                searchBy: filterOptions?.searchBy,
                searchText: filterOptions?.searchText,
                sortBy: sortOptions?.sortBy,
                sortOrder: sortOptions?.sortOrder,
                isLoading: true
            }
        })
    }, [minDate, maxDate, fetchOptions, filterListPayload])

    const onRowSelect = React.useCallback((s: ISelectedRows) => {
        dispatch({ type: '@@orderRequestListView/SET_SELECTED_ROWS', payload: s });
    }, [])

    const handleCancelRowsChange = React.useCallback(() => {
        const propertyLength = Object.keys(editDetails)?.length

        // anything newly edited then this flag will become true
        if (propertyLength !== 0) {
            dispatch({ type: '@@orderRequestListView/SET_EDIT_CONFIRMATION_MODAL', payload: true })
        } else {
            // nothing edited just clear all the selection.
            dispatch({ type: '@@orderRequestListView/SET_IS_SAVE_CLICKED', payload: false });
            dispatch({ type: '@@orderRequestListView/SET_IS_EDITABLE', payload: false });
            dispatch({ type: '@@orderRequestListView/CLEAR_EDIT_DETAILS' });
            fetchOptions.apis?.resetSelection();
            dispatch({ type: '@@orderRequestListView/SET_SELECTED_ROWS', payload: {} });
            dispatch({ type: '@@orderRequestListView/SET_EDIT_CONFIRMATION_MODAL', payload: false })

        }
    }, [fetchOptions, editDetails, selectedRows]);

    const handleRemoveFilter = (showToast: boolean) => {
        advanceFilterdispatch({ type: '@@advanceFilter/SET_FILTERLIST_PAYLOAD', payload: undefined });
        advanceFilterdispatch({ type: '@@advanceFilter/SET_CURRENT_FILTERS', payload: undefined });
        advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: false });
        handleFetchData(fetchOptions)
        showToast && toast.add(dynamicLabels?.filterRemovedSuccessfully, 'check-round', false);
    }
    const handleOpenAdvancedFilter = () => {
        advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: !openAdvFilter });
      }
    const buttonToolTipTextList = {
        update: `${dynamicLabels?.clickHereToUpdateSelected} ${dynamicLabels?.bookings}.`,
        reject: `${dynamicLabels?.clickHereToRejectSelected} ${dynamicLabels?.bookings}.`,
        accept: `${dynamicLabels?.clickHereToApproveSelected} ${dynamicLabels?.bookings}.`,
    };
    let isAllPendingSelection = true
    Object.values(selectedRows as ISelectedRows).forEach((entry) => {
        if (entry.bookingStatus !== 'PENDING') {
            isAllPendingSelection = false
        }
    })
    const isEnable = Object.values(selectedRows as ISelectedRows).length !== 0 && isAllPendingSelection

    const enableStatus = {
        accept: isEnable,
        reject: isEnable
    }

    return <><Box display='flex' mt='64px' flexDirection='column' style={{ width: '100%', height: 'calc(100vh - 69px)', overflow: 'hidden' }} px='15px' pb='15px'>
        <Box display='flex' justifyContent='space-between' style={{ width: '100%' }} py='15px'>
            <BreadCrumbTagWrapper>
                <BreadCrumb
                    options={breadCrumbOptions}
                    optionList={breadCrumbOptionList}
                    width='260px'
                    onClick={handleBreadcrumbChange}
                />
                {filterListPayload &&
                <Tooltip maxWidth={600} tooltipDirection='bottom' messagePlacement='center' hover message={
                  <div style={{ textAlign: 'left', fontSize: 12}}>
                    <Box mb='10px'>Filters are applied on {filterListPayload.operationLogic === 'AND' ? 'ALL' : 'ANY'} of the the following conditions:</Box>
                    {currentFilter && currentFilter?.filters && currentFilter?.filters.map((f: any, i) => {
                      return <Box mb='5px'>{`${i + 1}. ${f.fieldLabelKey} ${f?.labelValue || f?.operationSymbol} ${f.filterDataLabel ? f.filterDataLabel :f.filterData}`}</Box>
                    })}
                    <div>{currentFilter?.sortCriteria && currentFilter?.sortCriteria[0] && (
                      <Box mb='5px'>{currentFilter?.sortCriteria[0]?.fieldLabelKey + ' ' + currentFilter?.sortCriteria[0]?.operationSymbol}</Box>
                    )}</div>
                  </div>
                }>
                  <FilterAppliedTag >
                    <FilterAppliedTagLabel onClick={handleOpenAdvancedFilter}>{(currentFilter?.filterName?.trim()) || 'Filter Applied'}</FilterAppliedTagLabel>
                    <FilterAppliedTagButtonWrapper>
                      <IconButton
                        onClick={() => handleRemoveFilter()}
                        onlyIcon
                        iconVariant='close'
                        iconSize={10}
                        color='error.main'
                      />
                    </FilterAppliedTagButtonWrapper>
                  </FilterAppliedTag>
                </Tooltip>
              }
            </BreadCrumbTagWrapper>

            <PageActionButtons 
                ngStateRouter={ngStateRouter}
                minDate={minDate}
                maxDate={maxDate} />
        </Box>
        <StyledGrid container spacing={15} style={{ boxShadow: '0 2px 20px -10px #000' }}>
            <Grid
                className='grid-customised-scroll-bar'
                item
                md={12}
                style={{ display: 'flex', overflow: 'hidden' }}
            >

                {filterListPayload &&
                  <AppliedFilterStrip>
                    <AdvancedFilterLabel>Advanced Filter Applied</AdvancedFilterLabel>
                    <ButtonWrapper onClick={() => handleRemoveFilter()}>
                      <IconButton
                        onlyIcon
                        iconVariant='close'
                        iconSize={8}
                        color='grey'
                      />
                      <span>Clear Filter</span>
                    </ButtonWrapper>
                  </AppliedFilterStrip>
             }

                <WhiteCard>
                    {   // once we add Add Form we can show below state.
                        emptyData ? <NoDataView
                            image='images/orderRequest.png'
                            message={dynamicLabels?.noBookingAddedYet}
                            buttonList={[/*{
                                name: `Add ${dynamicLabels?.booking_s}`,
                                icon: 'icomoon-add',
                                href: 'bookings/addBooking',
                            }, */ {
                                name: `Change Date Range`,
                                icon: 'calendar',
                                onButtonClick: () => { dispatch({ type: '@@orderRequestListView/SET_OPEN_DATERANGE', payload: !dateRangeOpen }); }
                            }
                            ]}

                        /> :
                            (<ListView
                                rowIdentifier='bookingId'
                                style={{ height: '100%', overflow: 'hidden', boxShadow: '0px 2px 20px -10px #000 !important' }}
                                columns={columns}
                                data={rowsSelector}
                                onFetchData={handleFetchData}
                                hasRowSelection={!actionBarButtons?.['InlineEdit']?.permission}
                                hasRowSelectionWithEdit={actionBarButtons?.['InlineEdit']?.permission}
                                onRowSelect={onRowSelect}
                                onSaveColumnPreferences={onSaveColumnPreferences}
                                totalRows={totalRowsSelector}
                                loading={showColumnShimmer || loading}
                                isColumnLoading={showColumnShimmer}
                                isEditMode={isEditMode}
                                paginationPageSize={50}
                                onApply={() => {
                                    sendGA('Event New','Order Request - Apply column preferences')
                                }}
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                sorts={sort}
                                onSortChange={handleSortChange}
                                permanentColumns={{
                                    clientName: true,
                                    make: true,
                                    type: true,
                                    isActiveFl: true
                                }}

                            >{{
                                IconBar:
                                    <Box display='flex' style={{ position: 'relative' }}>
                                        <DownloadOrderRequestModal />
                                        <AdvancedFilterComponent
                                            pageName='bookings'
                                            handleFetchFilters={handleFetchFilters}
                                            handleRemoveFilter={handleRemoveFilter}
                                            handleFetchData={handleFetchData}
                                            data={AdvanceFilterData}
                                            needsFetchDataCall={false}
                                        />
                                    </Box>,

                                ActionBar: (
                                    <Box display='flex' horizontalSpacing='10px'>
                                        {isEditMode ? (
                                            <>
                                                <Tooltip message={`${dynamicLabels?.clickHereToSaveSelected} ${dynamicLabels.bookings}.`} hover={true} messagePlacement='start'>
                                                    <IconButton
                                                        intent='table'
                                                        id='listView-actionBar-save'
                                                        iconVariant='icomoon-save'
                                                        onClick={handleSave}
                                                        disabled={!Object.keys(selectedRows as ISelectedRows).length || isSaveClicked}
                                                    >
                                                        {dynamicLabels?.save}
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip message={`${dynamicLabels?.clickHereToCancelSelected} ${dynamicLabels.bookings}.`} hover={true}>
                                                    <IconButton
                                                        intent='table'
                                                        id='listView-actionBar-cancel'
                                                        iconVariant='icomoon-close'
                                                        onClick={handleCancelRowsChange}
                                                        disabled={!Object.keys(selectedRows as ISelectedRows).length || isSaveClicked}
                                                    >
                                                        {dynamicLabels?.cancel}
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        ) :
                                            Object.keys(actionBarButtons).map(
                                                buttonKey => actionBarButtons[buttonKey].permission &&
                                                    (
                                                        buttonKey !== 'InlineEdit' && <Tooltip
                                                            messagePlacement='start'
                                                            hover={true}
                                                            message={`${buttonToolTipTextList[buttonKey]
                                                                ? buttonToolTipTextList[buttonKey]
                                                                : buttonKey
                                                                }`}
                                                            key={buttonKey}
                                                        >
                                                            <IconButton
                                                                key={buttonKey}
                                                                disabled={!enableStatus[buttonKey]}
                                                                intent='table'
                                                                iconVariant={iconsMapping[buttonKey]}
                                                                id={`listView-actionBar-${buttonKey}`}
                                                                onClick={() => handleActionBarButtonClick(buttonKey)}
                                                            >
                                                                <TextOverflowEllipsis>{actionBarButtons[buttonKey].label}</TextOverflowEllipsis>
                                                            </IconButton>
                                                        </Tooltip>
                                                    ))
                                        }
                                    </Box>
                                )
                            }}
                            </ListView>)
                    }

                </WhiteCard>
            </Grid>
        </StyledGrid>
    </Box>
        <OrderRequestModals />
    </>
}

export default withReact(OrderRequestListView)
