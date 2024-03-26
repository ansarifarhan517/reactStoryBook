import React, { useEffect, Dispatch, useState } from 'react'
import { useDispatch } from 'react-redux'

import {
  Card, Box, Grid, useToast, IListViewColumn, ISelectedRows, IFetchDataOptions, ListView, IconButton, Tooltip, IconDropdown, ModalHeader, Modal, BreadCrumb, IFilterOptions,
  ISortOptions, withToastProvider, withPopup,


} from 'ui-library'
import { ColumnInstance } from 'react-table'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import { transformMongoListViewToColumns } from '../../../utils/mongo/ListView'
import { CustomerListViewActions } from './CustomerListView.actions'
import axios from '../../../utils/axios'
import apiMappings from '../../../utils/apiMapping'
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels'
import { hybridRouteTo, getQueryParams, } from '../../../utils/hybridRouting';
import iconsMapping from '../../../utils/mongo/ListView/actionBarIcons.mapping'
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping'
import { sendGA } from '../../../utils/ga'
import withRedux from '../../../utils/redux/withRedux';
import { IStateService } from 'angular-ui-router';
import FileSaver from 'file-saver'
import { StyledGrid, ListViewWrapper } from './styled'
import { ICustomerListViewDataPayload, INotifyDropdown, IRowData } from './CustomerListView.models'
import UploadExcel from '../../../utils/wrapper/uploadExcel';
// import withReact from '../../../utils/components/withReact'
import { SortingRule } from 'react-table'
import { withThemeProvider } from '../../../utils/theme'
import AdvancedFilterComponent from '../../common/AdvancedFilterComponent/index'
import { AdvancedFilterComponentActions } from '../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions'
import {
  AdvancedFilterLabel, AppliedFilterStrip, ButtonWrapper, FilterAppliedTag, FilterAppliedTagButtonWrapper, FilterAppliedTagLabel,
  //  SectionHeader, Accordion
} from '../../OrderRequest/OrderRequestListView/StyledOrderRequestListView'
import { NoDataWrapper } from '../../Vehicle/VehicleListView/VehicleListView.styled'
import EmptyData from '../../../utils/components/EmptyData'
import NotificationModal from './SubComponent/Modals/NotificationModal'
import DownloadMessage from '../../../utils/components/DownloadMessage'
import InlineEditConfirmationModal from '../../../utils/components/InlineEditConfirmationModal'
import { throwError, validateRows } from '../../common/InlineEdit/InlineEdit'
import moment from 'moment'
import { IMongoListViewStructure } from '../../../utils/mongo/interfaces'
import { IListViewRequestPayload } from '../../../utils/common.interface'
import store from '../../../utils/redux/store'
import { manipulateCount, manipulateData, manipulateStructure } from './utils'
import { dummyResult } from '../../Carrier/CarrierListView/CarrierListView.reducer'
interface ICustomerListViewProps {
  ngStateRouter: IStateService
}

/** By default: Dont Reload, Or notify change or Inherit existing Parameters from URL */
const ngStateRouterOptions = { notify: false, reload: false, inherit: false, location: true }

const CustomerListView = ({ ngStateRouter }: ICustomerListViewProps) => {
  /** General Hooks */
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.contract)
  const toast = useToast()

  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<CustomerListViewActions>>()
  const advanceFilterdispatch = useDispatch<Dispatch<AdvancedFilterComponentActions>>()
  const pageLabels = useTypedSelector(state => state.pageLabels.customer)
  const columnsLoading = useTypedSelector(state => state.customer.listView.loading.columns);
  const editDetails = useTypedSelector(state => state.customer.listView.editDetails)
  const notifyTypeOptions = useTypedSelector(state => state.customer.listView.notifyType)
  const filterListPayload = useTypedSelector(state => state.advanceFilter.filterListPayload)
  const emptyData = useTypedSelector(state => state.advanceFilter.emptyData);
  const currentFilter = useTypedSelector(state => state.advanceFilter.currentFilter)
  const mentions = useTypedSelector(state => state.customer.listView.notifyTypeDynamicTags)
  const advancedFilterData = useTypedSelector(state => state.advanceFilter.advancedFilterData)
  const [isFilterDataCalled, setIsFilterDataCalled] = useState<boolean>(false);
  /** State */
  const [columns, setColumns] = useState<IListViewColumn[]>([])
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({})
  const [isEditMode, setEditMode] = useState<boolean>(false)
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({})
  const [isDownloadReportDisabled, setDownloadReportDisabled] = useState<boolean>(false)
  const [customerActivationRequest, setCustomerActivationRequest] = useState<
    { activeRequest: boolean, customerId: number, failureCallback?: React.Dispatch<React.SetStateAction<boolean>> } | undefined>()
  const [showCancelConfirmationModal, setShowCancelConfirmationModal] = useState<boolean>(false)
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false)
  const [showUploadPopup, setShowUploadPopup] = useState<boolean>(false)
  const [notifyDropdown, setNotifyDropdown] = useState<INotifyDropdown[] | undefined>()
  const [filters, setFilters] = useState<Record<string, string>>()
  const [sort, setSort] = useState<SortingRule<object>[]>()
  const [notifyTypeObject, setNotifyTypeObject] = useState<INotifyDropdown | undefined>()
  const [showNotifyModal, setShowNotifyModal] = useState<boolean>(false)
  const [structure, setStructure] = useState<IMongoListViewStructure>({columns : {}, buttons: {}})
  const [loading, setLoading] = useState<boolean>(true)
  const [listviewData, setListviewData] = useState<ICustomerListViewDataPayload>({
    totalCount: 0,
    results: [{ customerId: 1 }, { customerId: 2 }, { customerId: 3 }, { customerId: 4 }]
  })
  const [listviewCount, setListviewCount] = useState()
  const AdvanceFilterData = {
    sectionName: 'customer.all_customers'
  }
  const pageName="customer"
  const columnsSelector = structure?.columns
  const actionBarButtons = structure?.buttons
  const rowsSelector = listviewData?.results || dummyResult
  const totalRowsSelector = listviewCount;
  
  const getListStructure = async() => {
    try{
      const { data } = await axios.get(apiMappings.customer.listView.structure)
      setStructure(manipulateStructure(data)) 
    }catch(error){
       console.log(error, 'Failed to get structure')
    }
  }

  const getListData = async(queryPayload) => {
      
      setLoading(true);
       if(!!store.getState().advanceFilter.advFilterLoader){
        const data = filterListPayload || undefined
        let filter: IListViewRequestPayload = { ...queryPayload}

        try{
          delete filter?.isLoading
          const { data: response }= await axios.post(apiMappings.customer.listView.advancedFilterData, data, {params: {...filter}})
          const clientProperties =  store.getState().clientProperties
          response.clientProperties = clientProperties

          let isParamsEmpty = (Object.keys(filter).length > 1) && !filter['searchBy'] && !filter['searchText'] && !filter['sortBy'] && !filter['sortOrder']
      if (isParamsEmpty && response?.results?.length < 1 && !filterListPayload) {
        advanceFilterdispatch({ type: '@@advanceFilter/SET_EMPTY_DATA', payload: true });

      } else {
        setListviewData(manipulateData(response))
        advanceFilterdispatch({ type: '@@advanceFilter/SET_EMPTY_DATA', payload: false });
      }
      setLoading(false)
        }catch(error){
          console.log('Failed to load customer list view data', error)
        }
       }
  }

  const getListDataCount = async(queryPayload) => {
     setLoading(true)
     if(!!store.getState().advanceFilter.advFilterLoader){
     const data = filterListPayload || undefined

     let filter: IListViewRequestPayload = {...queryPayload}
     try{
      delete filter?.isLoading
      const {data : response} = await axios.post(apiMappings.customer.listView.advancedFilterCount, data, { params: {...filter}})
      const clientProperties =  store.getState().clientProperties
      response.clientProperties = clientProperties

      let isParamsEmpty = (Object.keys(filter).length > 1) && !filter['searchBy'] && !filter['searchText'] && !filter['sortBy'] && !filter['sortOrder']
      if (isParamsEmpty && response?.results?.length < 1 && !filterListPayload) {
        advanceFilterdispatch({ type: '@@advanceFilter/SET_EMPTY_DATA', payload: true });

      } else {
        setListviewCount(manipulateCount(response))
        advanceFilterdispatch({ type: '@@advanceFilter/SET_EMPTY_DATA', payload: false });

      }
       setLoading(false)
     }catch(error){
        console.log(error, 'Customer List view Count failed')
     }
    }
  }
  /** Watchers */
  useEffect(() => {
    dispatch({ type: '@@customerListView/FETCH_STRUCTURE' })
    handleQueryParams()
    getListStructure()
    handleFetchFilters();
    advanceFilterdispatch({
      type: "@@advanceFilter/UPDATE_FIRST_LOAD",
      payload: false,
    });
    advanceFilterdispatch({ type: '@@advanceFilter/SET_FILTERLIST_PAYLOAD', payload: undefined });
    advanceFilterdispatch({ type: '@@advanceFilter/SET_CURRENT_FILTERS', payload: undefined });
    advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: false });
    return () => {
      dispatch({ type: '@@customerListView/RESET_STATE' })
    }
  }, [])

  useEffect(() => {
    const mongoStructure = columnsSelector
    if (Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(mongoStructure, 'customer', cellCallbackMapping)
      setColumns(newColumns)
    }
    advanceFilterdispatch({ type: '@@advanceFilter/SET_COLUMNS_SELECTOR', payload: columnsSelector });
  }, [columnsSelector])

  useEffect(() => {
    setNotifyDropdown(notifyTypeOptions)
  }, [notifyTypeOptions])

  /** Cell Callbacks */
  const handleCustomerActiavtion = async () => {
    if (!customerActivationRequest) {
      return
    }
    setCustomerActivationRequest(undefined)
    const customerId = Number(customerActivationRequest.customerId)
    let params = {
      customerId: customerId,
      isactive: customerActivationRequest.activeRequest
    }
    dispatch({
      type: '@@customerListView/UPDATE_DATA',
      payload: params
    })

    try {
      const { data: { message, status } } = await axios.put(apiMappings.customer.listView.activationRequest, {},
        {
          params: {
            customerIds: customerActivationRequest.customerId,
            isactive: customerActivationRequest.activeRequest
          }
        }
      )

      if (status === 200) {
        toast.add(message, 'check-round', false)
        setSelectedRows({})
        setEditMode(false)

        handleFetchData(fetchOptions)

        fetchOptions.apis?.resetSelection()
        return
      }
      throw message
    } catch (errorMessage) {
      customerActivationRequest.failureCallback && customerActivationRequest.failureCallback(!customerActivationRequest.activeRequest)
      toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false)
    }

  }

  const handleActiveFlChange = (isChecked: boolean, { customerId }: IRowData, failureCallback: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!Object.keys(editDetails).length) {
      setCustomerActivationRequest({ activeRequest: isChecked, customerId: customerId, failureCallback })
    } else {
      setCustomerActivationRequest({ activeRequest: isChecked, customerId: customerId, failureCallback })
    }
  }

  const handleNodeCount = (row: any) => {
    sendGA('Navigation', 'Customer List View Show Address')
    ngStateRouter.go('address')
    hybridRouteTo(`address?cid=${row.customerId}&accountCode=${row.accountCode}`);

  }
  // cell callback mapping
  const cellCallbackMapping = {
    nodeCount: handleNodeCount,
    isActiveFl: handleActiveFlChange

  }

  // Handle fetch Filters
  const handleFetchFilters = async (callBackAdvanceFilter=false) => {
    try {
      if ((!isFilterDataCalled && ((advancedFilterData.length > 0 && advancedFilterData[0].sectionName != 'CUSTOMER_LIST_VIEW') || advancedFilterData?.length == 0)) || callBackAdvanceFilter) {
        setIsFilterDataCalled(true)
        const { data } = await axios.get(apiMappings.advancedSearch.getFilters, {
          params: {
            modelName: 'CUSTOMER',
            pageName: 'CUSTOMER',
            sectionName: `CUSTOMER_LIST_VIEW`
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
      }

      return;
    } catch (errorMessage) {
      toast.add(dynamicLabels.updateFilterFailed, 'warning', false);
    }

  }

  const handleRemoveFilter = (showToast: boolean) => {
    advanceFilterdispatch({ type: '@@advanceFilter/SET_FILTERLIST_PAYLOAD', payload: undefined });
    advanceFilterdispatch({ type: '@@advanceFilter/SET_CURRENT_FILTERS', payload: undefined });
    advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: false });
    getListData(filterListPayload)
    showToast && toast.add(dynamicLabels?.filterRemovedSuccessfully, 'check-round', false);
  }

  /** List View Callbacks */
  const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {
    setLoading(true)
    setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis })
   
      const payload = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        searchBy: filterOptions?.searchBy,
        searchText: filterOptions?.searchText,
        sortBy: sortOptions?.sortBy,
        sortOrder: sortOptions?.sortOrder
      }

      getListData(payload)
      getListDataCount(payload)

  }, [filterListPayload])

  const onRowSelect = React.useCallback((s: ISelectedRows) => {
    setSelectedRows(s)
  }, [])

  // const onSortChange = React.useCallback(() => { }, [])

  const handleActionBarButtonClick = React.useCallback((id: string) => {
    switch (id) {
      case 'update': {
        sendGA('ListView ActionBar', 'Customer List View Update - Inline Edit')
        setEditMode(true)
        break
      }
      case 'more':
        break

    }
  }, [])

  /** Inline Edit */
  const validateSelectedRows = () => {
    const columnStructure = columnsSelector

    try {
      validateRows(editDetails,columnStructure);

    } catch (error) {
      throwError(error);

      if (error.message) {
        toast.add(error.message, '', false)
      }
      return false
    }

    return true
  }
  const handleSaveRows = async () => {

    sendGA('ListView ActionBar', 'Customer List View Save - Inline Edit')
    const isValid = validateSelectedRows()

    if (isValid) {
      const payload: Partial<IRowData>[] = []
      let flag = true
      Object.values(selectedRows).forEach((row) => {

        if (editDetails[row.customerId]) {
          const obj: any = {
            customerId: row.customerId
          }

          Object.keys(columnsSelector).forEach((columnId) => {
            if (columnsSelector?.[columnId]?.editable && !columnsSelector?.[columnId]?.customField) {
              if (editDetails?.[row.customerId]?.[columnId]?.hasError) {
                toast.add(`Please Enter Valid ${columnId}`, 'warning', false)
                flag = false

              } else {
                obj[columnId] = editDetails?.[row.customerId]?.[columnId]?.value || row[columnId]
              }
            }
          })

          payload.push(obj)
        }
      })

      if (!payload.length) {
        handleCancel()

      }
      if (flag) {
        try {
          const { data: { message, status } } = await axios.put(apiMappings.customer.listView.inlineUpdate, payload)
          if (status === 200) {
            handleFetchData(fetchOptions)
            setEditMode(false)
            fetchOptions.apis?.resetSelection()
            setSelectedRows({})
            dispatch({ type: '@@customerListView/CLEAR_EDIT_DETAILS' })
            toast.add(message, 'check-round', false)
            return
          }
          throw message
        } catch (errorMessage) {
          const message = errorMessage?.response?.data?.message
          toast.add(message || dynamicLabels.somethingWendWrong, 'warning', false)
        }
      } else {
        return
      }

    }
  }
  const handleCancel = () => {
    if (!Object.keys(editDetails).length) {
      setEditMode(false);
      fetchOptions.apis?.resetSelection();
      setSelectedRows({});
    } else {
      setShowCancelConfirmationModal(true)
    }

  }
  const handleCancelRows = React.useCallback(() => {
    setShowCancelConfirmationModal(false)
    dispatch({ type: '@@customerListView/CLEAR_EDIT_DETAILS' });
    setEditMode(false);
    fetchOptions.apis?.resetSelection();
    setSelectedRows({});
  }, [fetchOptions]);

  const handleDownloadReport = async () => {
    sendGA('ListView Icon Bar', 'Customer List View - Download Report')

    setDownloadReportDisabled(true)
    setShowDownloadModal(true)
    const payload = {
      pageNumber: fetchOptions.pageNumber,
      pageSize: fetchOptions.pageSize,
      searchBy: fetchOptions.filterOptions?.searchBy,
      searchText: fetchOptions.filterOptions?.searchText,
      sortBy: fetchOptions.sortOptions?.sortBy,
      sortOrder: fetchOptions.sortOptions?.sortOrder
    }
    try {
      console.log('Download Customer Start', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
      const data = await axios.post(apiMappings.customer.listView.customerExcelDownload, filterListPayload, {
        params: payload,
        responseType: 'arraybuffer'
      })
      console.log('Download Customer Complete', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
      FileSaver.saveAs(new Blob([data.data], { type: "application/vnd.ms-excel xlsx" }), `${dynamicLabels.customer} List.xlsx`)
      setDownloadReportDisabled(false)
    } catch {
      toast.add(dynamicLabels.somethingWendWrong, 'warning', false)
    }
  }

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
      const { data: { message } } = await axios.put(apiMappings.customer.listView.structure, payload)
      message && toast.add(message, 'check-round', false)
    } catch (error) {
      console.log(error, error?.response)
    }


  }, [columnsSelector])

  const handleNotifyOption = (e: any) => {
    const obj = notifyDropdown?.find((o: INotifyDropdown) => o.id === e)
    if (obj) {
      setNotifyTypeObject(obj)
      setShowNotifyModal(true)
    }
  }

  const handleAddCustomer = () => {
    // customer - Add button
    sendGA('Navigation', 'Customer List View - Add button')
    hybridRouteTo('addCustomer');
    ngStateRouter.go('customerForm')
  }

  const breadCrumbOptions = React.useMemo(
    () => [
      { id: 'Customer', label: dynamicLabels.customer },
      { id: 'All Customer', label: `${dynamicLabels.all} ${dynamicLabels.customer_p}` }
    ],
    [pageLabels, dynamicLabels],
  );

  /********  FILTER CHANGE **************/
  const handleFilterChange = (combinedFilters: IFilterOptions) => {
    let existingParams = getQueryParams()
    /** Do not push to history when there is no change. */
    if ((!combinedFilters.searchBy && !existingParams.searchBy) || (combinedFilters.searchBy === existingParams.searchBy && combinedFilters.searchText === existingParams.searchText)) {
      return
    }
    const newParams = {
      ...(existingParams.sortBy ? { sortBy: existingParams.sortBy, sortOrder: existingParams.sortOrder } : {}),
      ...(combinedFilters.searchBy ? { searchBy: combinedFilters.searchBy, searchText: combinedFilters.searchText } : {})
    }

    setTimeout(() => {
      ngStateRouter.go('customer', newParams, ngStateRouterOptions)
    }, 2000)
  }

  /********  SORT  CHANGE **************/
  const handleSortChange = (sortOptions: ISortOptions) => {
    const existingParams = getQueryParams()

    /** Do not push to history when there is no change. */
    if ((!sortOptions.sortBy && !existingParams.sortBy) || (sortOptions.sortBy === existingParams.sortBy && sortOptions.sortOrder === existingParams.sortOrder)) {
      return
    }

    /** Construct new set of Query Params */
    const newParams = {
      ...(sortOptions.sortBy ? { sortBy: sortOptions.sortBy, sortOrder: sortOptions.sortOrder } : {}),
      ...(existingParams.searchBy ? { searchBy: existingParams.searchBy, searchText: existingParams.searchText } : {})
    }

    setTimeout(() => {
      ngStateRouter.go('customer', newParams, ngStateRouterOptions)
    }, 2000)
  }

  // HANDLE QUERY PARAMS FOR HISTORY RENTENTION
  const handleQueryParams = () => {
    const filterData: Record<string, string> = getQueryParams();

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
  }

  const handleSendNotify = async (data: any) => {
    let payload = {
      ...data,
      customerIds: [...Object.keys(selectedRows)]
    }
    try {
      const { data: { message, status } } = await axios.post(apiMappings.customer.listView.notifyCustomer, payload)
      toast.add(message, status === 200 ? 'success' : 'error', false)
    } catch (e) {
      console.log(e)
    }
    setShowNotifyModal(false)
    setSelectedRows({})
    setEditMode(false)
    fetchOptions.apis?.resetSelection();
  }
  return (
    <>
      <div id='toast-inject-here'></div>
      <Box display='flex' justifyContent='space-between' style={{ width: '100%', paddingTop: '74px' }} px='15px' pb='15px'>
        <div>
          <BreadCrumb
            options={breadCrumbOptions}
            width='100px'
          />

          {filterListPayload &&
            <Tooltip tooltipDirection='bottom' messagePlacement='center' hover message={
              <div style={{ textAlign: 'left', fontSize: 12 }}>
                <Box mb='10px'>Filters are applied on {filterListPayload.operationLogic === 'AND' ? 'ALL' : 'ANY'} of the the following conditions:</Box>
                {currentFilter && currentFilter?.filters && currentFilter?.filters.map((f: any, i) => {
                  return <Box mb='5px'>{`${i + 1}. ${f.fieldLabelKey} ${f?.labelValue || f?.operationLabelKey} ${f.filterDataLabel ? f.filterDataLabel :f.filterData}`}</Box>
                })}
                <div>{currentFilter?.sortCriteria && currentFilter?.sortCriteria[0] && (
                  <Box mb='5px'>{currentFilter?.sortCriteria[0]?.fieldLabelKey + ' ' + currentFilter?.sortCriteria[0]?.operationSymbol}</Box>
                )}</div>
              </div>
            }>

              <FilterAppliedTag>
                <FilterAppliedTagLabel>{(currentFilter?.filterName?.trim()) || 'Filter Applied'}</FilterAppliedTagLabel>
                <FilterAppliedTagButtonWrapper>
                  <IconButton
                    onClick={handleRemoveFilter}
                    onlyIcon
                    iconVariant='close'
                    iconSize={10}
                    color='error.main'
                  />
                </FilterAppliedTagButtonWrapper>
              </FilterAppliedTag>
            </Tooltip>
          }
        </div>

        {/* Page Action Buttons */}
        <Box display='flex' justifyContent='space-evenly' horizontalSpacing='10px'>
          {pageLabels?.buttons.add && (
            <Tooltip message={`${dynamicLabels.clickHereToAdd} ${dynamicLabels.customer}.`} hover={true}>
              <IconButton
                id ='customer--actionbar--add'
                intent='page'
                iconVariant='icomoon-add'
                onClick={handleAddCustomer}
              >
                {dynamicLabels[pageLabels?.buttons.add] || dynamicLabels.add}
              </IconButton>
            </Tooltip>
          )}

          {pageLabels?.buttons.upload && (
            <Tooltip message={`${dynamicLabels.clickHereToUploadAListOf} ${dynamicLabels.customer_p}.`} hover={true} messagePlacement='end'>
              <IconButton
                id ='customer--actionbar--upload'
                intent='page'
                style={{ marginRight: 0 }}
                iconVariant='icomoon-upload'
                onClick={() => {
                  sendGA('customer button action', 'Customer List View Upload excel')
                  setShowUploadPopup(true)
                }}
              >
                {dynamicLabels[pageLabels?.buttons.upload] || dynamicLabels.Upload}
              </IconButton>
            </Tooltip>
          )}
        </Box>

      </Box>
      <Box display='flex' flexDirection='column' style={{ width: '100%', height: '100vh' }} px='15px' pb='15px'>
        {/* Header */}

        {/* LIST VIEW CONTAINER */}
        <StyledGrid
          container
          spacing={5}
          style={{ boxShadow: '0 2px 20px -10px #000' }}
        >
          {!emptyData ?
            <>
              <Grid className='grid-customised-scroll-bar' item md={12} style={{ display: 'flex', overflow: 'hidden' }}>
                {filterListPayload &&
                  <AppliedFilterStrip>
                    <AdvancedFilterLabel>Advanced Filter Applied</AdvancedFilterLabel>
                    <ButtonWrapper onClick={handleRemoveFilter}>
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
                <Card
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    backgroundColor: '#fff',
                    overflow: 'hidden',
                    width: '100%',
                    paddingRight: 0,
                    paddingBottom: 0,
                  }}
                >
                  {columns.length > 0 && (
                    <ListViewWrapper className='CustomerListViewWrapper'>
                      <ListView
                        rowIdentifier='customerId'
                        style={{ height: '100%', overflow: 'visible' }}
                        columns={columns}
                        data={rowsSelector}
                        onFetchData={handleFetchData}
                        hasRowSelection={!actionBarButtons?.['InlineEdit']?.permission}
                        hasRowSelectionWithEdit={actionBarButtons?.['InlineEdit']?.permission}
                        onRowSelect={onRowSelect}
                        onSaveColumnPreferences={onSaveColumnPreferences}
                        totalRows={totalRowsSelector}
                        loading={loading}
                        hideRefresh={loading}
                        isEditMode={isEditMode}
                        onRowEditClick={row => {
                          hybridRouteTo(`updateCustomer?cid=${row.customerId}`);
                        }}
                        permanentColumns={{
                          accountCode: true,
                          accountName: true,
                          branchName: true

                        }}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        sorts={sort}
                        onSortChange={handleSortChange}
                        isColumnLoading={columnsLoading}
                      // moreResultsExists={moreResultsExists}
                      >
                        {{
                          IconBar: (
                            <Box display='flex' style={{ position: 'relative' }}>
                              <Tooltip message={`${dynamicLabels.download} ${dynamicLabels.CustomerReport}.`} hover messagePlacement='end'>
                                <IconButton
                                  id="customer--actionbar--download"
                                  key={'tt_DownloadVehicle'}
                                  disabled={isDownloadReportDisabled}
                                  iconVariant='icomoon-download'
                                  iconSize={16}
                                  onlyIcon
                                  style={{ color: 'inherit' }}
                                  onClick={handleDownloadReport}
                                />
                              </Tooltip>
                              <AdvancedFilterComponent
                                pageName={pageName}
                                handleFetchFilters={handleFetchFilters}
                                handleRemoveFilter={handleRemoveFilter}
                                handleFetchData={handleFetchData}
                                data={AdvanceFilterData}
                                needsFetchDataCall={false}
                              />

                            </Box>

                          ),
                          ActionBar: (
                            <Box display='flex' horizontalSpacing='10px'>
                              {isEditMode ? (
                                <>
                                  <Tooltip message={`${dynamicLabels.save}`} hover>
                                    <IconButton
                                      intent='table'
                                      id='listView-actionBar-save'
                                      iconVariant='icomoon-save'
                                      onClick={handleSaveRows}
                                      disabled={!Object.keys(selectedRows).length}
                                    >
                                      {dynamicLabels.save}
                                    </IconButton>

                                  </Tooltip>
                                  <Tooltip message={`${dynamicLabels.cancel}`} hover>
                                    <IconButton
                                      intent='table'
                                      id='listView-actionBar-cancel'
                                      iconVariant='icomoon-close'
                                      onClick={handleCancel}
                                      disabled={!Object.keys(selectedRows).length}
                                    >
                                      {dynamicLabels.cancel}
                                    </IconButton>
                                  </Tooltip>
                                </>
                              ) : (
                                  Object.keys(actionBarButtons).map(
                                    (buttonKey, index) =>
                                      actionBarButtons[buttonKey].permission &&
                                      (buttonKey === 'notifyCustomer' ? (
                                        // <Tooltip message={`${dynamicLabels.customerNotify} ${dynamicLabels.customer_p}`}
                                        //   hover
                                        //   messagePlacement={index === 0 ? 'start' : 'center'}
                                        // >
                                        <IconDropdown
                                        id = {`${pageName}--actionbar--${buttonKey}`}
                                          key={index}
                                          variant='button-dropdown'
                                          optionList={notifyDropdown}
                                          width='100px'
                                          iconButtonDetails={[
                                            'icomoon-funnel-options',
                                            actionBarButtons[buttonKey].label,
                                            'icomoon-angle-bottom',
                                          ]}
                                          tooltipMessage={`${dynamicLabels.customerNotify} ${dynamicLabels.customer_p}.`}
                                          disabled={!Object.keys(selectedRows).length}
                                          intent='table'
                                          onChange={handleNotifyOption}
                                          isSingleClickOption
                                          style={{ zIndex: '99' }}
                                          tooltipProps={{
                                            arrowPlacement: 'center',
                                            messagePlacement: 'end',
                                            tooltipDirection: 'bottom'
                                          }}
                                        />
                                        // </Tooltip>
                                      ) :
                                        (
                                          buttonKey !== 'InlineEdit' && <Tooltip message={buttonKey === 'update' ? `${dynamicLabels.customerUpdate} ${dynamicLabels.customer_p}.` : `${actionBarButtons[buttonKey].label} `}
                                            hover
                                            messagePlacement={'start'}
                                          >

                                            <IconButton
                                            
                                              key={buttonKey}
                                              disabled={!Object.keys(selectedRows).length}
                                              intent='table'
                                              iconVariant={iconsMapping[buttonKey]}
                                              id={`listView-actionBar-${buttonKey}`}
                                              onClick={() => {
                                                sendGA('customer action button', 'Customer List View ' + `customer - ${actionBarButtons[buttonKey].label}`)
                                                handleActionBarButtonClick(buttonKey)
                                              }}
                                            >
                                              {actionBarButtons[buttonKey].label}
                                            </IconButton>

                                          </Tooltip>
                                        )
                                      )
                                  ))
                              }


                            </Box>
                          ),
                        }
                        }
                      </ListView>
                    </ListViewWrapper>
                  )}
                </Card>
              </Grid>

            </>
            : <NoDataWrapper>
              <div>
                <EmptyData message={dynamicLabels.noCustomerAddedYet} imgSrc='https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-images/emptyCustomersList.png' />
                <Box display='flex' justifyContent='center' fullWidth>
                  <Tooltip message={`${dynamicLabels.clickHereToAdd} ${dynamicLabels.customer}`} hover={true}>
                    <IconButton 
                      primary
                      iconVariant='icomoon-add'
                      onClick={handleAddCustomer}
                    >
                      {dynamicLabels[pageLabels?.buttons.add] || dynamicLabels.add} {dynamicLabels.customer}
                    </IconButton>
                  </Tooltip>
                </Box>
              </div>
            </NoDataWrapper>}
        </StyledGrid>


        {/* NOTIFY NOTIFY MODAL */}
        <Modal
          open={showNotifyModal}
          onToggle={value => {
            setShowNotifyModal(!value);
          }}
          width="1200px"
          size='sm'
          children={{
            header: (
              <ModalHeader
                headerTitle={`${dynamicLabels?.customer} Notification Settings`}
                handleClose={() => setShowNotifyModal(false)}
                imageVariant='icomoon-close'
                headerStyle={{ fontSize: '15px' }}
                width='1200px'
              />
            ),
            content: (
              <div style={{ fontSize: '14px' }}>
                <NotificationModal
                  notifyObject={notifyTypeObject}
                  mentions={mentions}
                  handleCancel={() => setShowNotifyModal(false)}
                  handleSend={handleSendNotify}
                  selectedRows={selectedRows}
                />
              </div>
            ),
            footer: (
              <></>
            ),
          }}
        />

        {/* ACTIVATION CONFIRMATION MODAL */}
        <Modal open={!!customerActivationRequest} onToggle={() => { }} size='md'>
          {{
            header: <ModalHeader
              headerTitle={dynamicLabels?.statusConfirmation}
              imageVariant='icomoon-close'
              handleClose={() => {
                customerActivationRequest?.failureCallback && customerActivationRequest?.failureCallback(!customerActivationRequest.activeRequest)
                setCustomerActivationRequest(undefined)
              }}
            />,

            content: (
              <>
                <div style={{ fontSize: '14px' }}>{customerActivationRequest?.activeRequest ? dynamicLabels.areYouSureYouWantToMarkAsAcitve : dynamicLabels.areYouSureYouWantToMarkAsInactive}</div><br></br>
                <div style={{ fontSize: '14px' }}><span style={{ fontSize: '14px', fontWeight: 800 }}>{dynamicLabels.note}:</span> {dynamicLabels.thisWillNotImpactExistingOrdersCreatedForThisAddress}</div>
              </>),
            footer: (
              <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                <IconButton iconVariant='icomoon-tick-circled' primary onClick={handleCustomerActiavtion}>{dynamicLabels.ok}</IconButton>
                <IconButton iconVariant='icomoon-close' iconSize={11}
                  onClick={() => {
                    customerActivationRequest?.failureCallback && customerActivationRequest?.failureCallback(!customerActivationRequest.activeRequest)
                    setCustomerActivationRequest(undefined)
                  }}>
                  {dynamicLabels.cancel}
                </IconButton>
              </Box>
            )
          }}
        </Modal>


        {/* INLINE EDIT CANCEL CONFIRMATION MODAL */}
        <InlineEditConfirmationModal
          showCancelConfirmationModal={showCancelConfirmationModal}
          setShowCancelConfirmationModal={(value: boolean) => setShowCancelConfirmationModal(value)}
          handleCancelRows={handleCancelRows}
        />

        {/* DOWNLOAD RESPONSE MODAL */}
        <DownloadMessage
          showInfoModal={showDownloadModal}
          onToggle={setShowDownloadModal}
        />

        {/* UPLOAD CUSTOMER MODAL */}
        <UploadExcel
          isOpen={showUploadPopup}
          featureName='customer'
          onSuccess={() => {
            setShowUploadPopup(false);
            handleFetchData(fetchOptions);
          }}
          onClose={() => setShowUploadPopup(false)}
        />


      </Box>


    </>
  )
}

export default withThemeProvider(withToastProvider(withRedux(withPopup(CustomerListView)), 'toast-inject-here'));
