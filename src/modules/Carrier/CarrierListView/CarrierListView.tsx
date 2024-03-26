import React, { useEffect, Dispatch, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ColumnInstance, SortingRule } from 'react-table'
import {
  Card, Box, ListView, IListViewColumn, IFetchDataOptions,
  withPopup, Modal, ModalHeader, IconButton,
  withToastProvider, useToast, ISelectedRows,
  ButtonGroup, Grid, BreadCrumb, Tooltip, IFilterOptions
} from 'ui-library'
import FileSaver from 'file-saver'
// import ReactTooltip from 'react-tooltip'
import { ReactTooltipCustom as ReactTooltip } from '../../../utils/layouts/ReactTooltipCustom'

import { CarrierListViewActions, ISetViewMode } from './CarrierListView.actions'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import withRedux from '../../../utils/redux/withRedux'
import { transformMongoListViewToColumns } from '../../../utils/mongo/ListView'
import axios from '../../../utils/axios'
import apiMappings from '../../../utils/apiMapping'
import { withThemeProvider } from '../../../utils/theme'
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels'
import { IRowData } from './CarrierListView.models'
import { hybridRouteTo } from '../../../utils/hybridRouting'
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping'
import UploadExcel from '../../../utils/wrapper/uploadExcel'
import CarrierListViewContainer from './CarrierListViewCss'
import DownloadMessage from '../../../utils/components/DownloadMessage'
import { sendGA } from '../../../utils/ga'
import {
  AdvancedFilterLabel, AppliedFilterStrip, ButtonWrapper,
  FilterAppliedTag, FilterAppliedTagButtonWrapper, FilterAppliedTagLabel,
} from '../../OrderRequest/OrderRequestListView/StyledOrderRequestListView'
import InlineEditConfirmationModal from '../../../utils/components/InlineEditConfirmationModal'
import { AdvancedFilterComponentActions } from '../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions'
import AdvancedFilterComponent from '../../common/AdvancedFilterComponent'
import CreateActionBarButton from '../../common/ActionBar/CreateActionBarButton'
import { throwError, validateRows } from '../../common/InlineEdit/InlineEdit'

import { getQueryParams } from '../../../utils/hybridRouting';
import { IStateService } from 'angular-ui-router';
import moment from 'moment'

interface IDriverListViewViewProps {
  ngStateRouter: IStateService
}

/** By default: Dont Reload, Or notify change or Inherit existing Parameters from URL */
const ngStateRouterOptions = { notify: false, reload: false, inherit: false, location: true }

const CarrierListView = ({ ngStateRouter }: IDriverListViewViewProps) => {
  /** General Hooks */
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.carrier)
  const toast = useToast()

  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<CarrierListViewActions>>()
  const advanceFilterdispatch = useDispatch<Dispatch<AdvancedFilterComponentActions>>()
  const structure = useTypedSelector(state => state.carrier.listView.structure)
  const columnsSelector = useTypedSelector(state => state.carrier.listView.structure.columns)
  const rowsSelector = useTypedSelector(state => state.carrier.listView.data.results)
  const totalRowsSelector = useTypedSelector(state => state.carrier.listView.data.totalCount)
  const pageLabels = useTypedSelector(state => state.pageLabels.vendor)
  const actionBarButtons = useTypedSelector(state => state.carrier.listView.structure.buttons)
  const viewMode = useTypedSelector(state => state.carrier.listView.viewMode)
  const editDetails = useTypedSelector(state => state.carrier.listView.editDetails)
  const loading = useTypedSelector(state => state.carrier.listView.loading.listView)
  const branchStructure = useTypedSelector(state => state.carrier.branchListView.branchStructure)
  const branchRowsSelector = useTypedSelector(state => state.carrier.branchListView.branchData.results)
  const filterListPayload = useTypedSelector(state => state.advanceFilter.filterListPayload)
  const currentFilter = useTypedSelector(state => state.advanceFilter.currentFilter)
  const openAdvFilter = useTypedSelector(state => state.advanceFilter.openAdvFilter)
  const advancedFilterData = useTypedSelector(state => state.advanceFilter.advancedFilterData)


  /** State */
  const [columns, setColumns] = useState<IListViewColumn[]>([])
  const [carrierActivationRequest, setCarrierActivationRequest] = useState<{ activeRequest: boolean, carrierIds: any, failureCallback?: React.Dispatch<React.SetStateAction<boolean>> } | undefined>()
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({})
  const [isEditMode, setEditMode] = useState<boolean>(false)
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({})
  const [isDownloadReportDisabled, setDownloadReportDisabled] = useState<boolean>(false)
  const [showUploadPopup, setShowUploadPopup] = useState<boolean>(false)
  const [showBranchPopup, setShowBranchPopup] = useState<{ isBranchPopupFlag: boolean, carrierIds: any } | undefined>()
  const [sectionPageName, setSectionName] = useState<string>('VENDOR_MASTER_LIST_VIEW');
  const [showDownloadSuccess, setShowDownloadSuccess] = useState(false)
  const [showCancelConfirmationModal, setShowCancelConfirmationModal] = useState<boolean>(false)
  const [showColumnShimmer, setShowColumnShimmer] = useState<boolean>(false)
  const [isFilterDataCalled, setIsFilterDataCalled] = useState<boolean>(false);

    // ---------------------------------------------------------------------------------------------------------
    const [filters, setFilters] = useState<Record<string, string>>()
    const [sort, setSort] = useState<SortingRule<object>[]>()

  /** Variables */
  const ButtonGroupData = React.useMemo(() =>
    pageLabels?.viewOptions ?
      Object.keys(pageLabels?.viewOptions).map((key: string) => ({
        id: key,
        label: pageLabels?.viewOptions[key].toUpperCase(),
        selected: key === viewMode,
        icon: key === 'mapview' ? 'default-marker' : 'menu',
        tooltipText: key === 'mapview' ?
          `${dynamicLabels.showsTheCurrentLocationOfThe} ${dynamicLabels.Resources} ${dynamicLabels.onAMap}` :
          `${dynamicLabels.showsTheListViewOfAllThe} ${dynamicLabels.Resources}`
      }))
      : []
    , [pageLabels, viewMode, dynamicLabels])

  const breadCrumbOptions = React.useMemo(() => [
    { id: 'fleet', label: dynamicLabels.Resources, disabled: true },
    { id: 'carrier', label: dynamicLabels.vendorMaster, disabled: true },
    { id: 'allCarriers', label: "All " + dynamicLabels.vendorMaster, disabled: false, toolTipMessage: dynamicLabels.ClickHereToSortTheListOfCarrierOnTheBasisOfStatus }
  ], [pageLabels, dynamicLabels])

  // const MoreButtonOptionList = React.useMemo(() => [
  //   { value: 'active', label: 'Mark As Active', tooltipText: "Mark Status as Active" },
  //   { value: 'inactive', label: 'Mark As Inactive', tooltipText: "Mark Status as Inactive" }
  // ], [dynamicLabels])

  const optionList = React.useMemo(() => [
    { value: 'allCarriers', label: "All " + dynamicLabels.vendorMaster, id: 'allCarriers' },
    { value: 'activeCarriers', label: "Active " + dynamicLabels.vendorMaster, id: 'activeCarriers' },
    { value: 'InactiveCarriers', label: "Inactive " + dynamicLabels.vendorMaster, id: 'InactiveCarriers' }
  ], [pageLabels, dynamicLabels])

  //advance filter params
  const AdvanceFilterData = {
    sectionName: 'Vendor'
  }

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
    if (localStorage.getItem('globalSearchText')) {
      temp["orderNo"] = localStorage.getItem('globalSearchText') || ""
    }
    setFilters(temp)
  }

  /** Watchers */
  useEffect(() => {
    handleQueryParams()
    setShowColumnShimmer(true)
    handleFetchFilters()
    advanceFilterdispatch({
      type: "@@advanceFilter/UPDATE_FIRST_LOAD",
      payload: false,
    });
    dispatch({ type: '@@carrierListView/FETCH_STRUCTURE', payload: { sectionName: 'VENDOR_MASTER_LIST_VIEW' } });
    dispatch({ type: '@@carrierListView/FETCH_BRANCH_STRUCTURE' });
    advanceFilterdispatch({ type: '@@advanceFilter/SET_FILTERLIST_PAYLOAD', payload: undefined });
    advanceFilterdispatch({ type: '@@advanceFilter/SET_CURRENT_FILTERS', payload: undefined });
    advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: false });
  }, [])

  useEffect(() => {
    const firstEntry: any = Object.values(columnsSelector)?.[0]
    if (columnsSelector && firstEntry?.id) {
      const mongoStructure = columnsSelector
      if (mongoStructure && Object.keys(mongoStructure).length) {
        const newColumns = transformMongoListViewToColumns(mongoStructure, 'carrier', cellCallbackMapping)
        setColumns(newColumns)
      }
      advanceFilterdispatch({ type: '@@advanceFilter/SET_COLUMNS_SELECTOR', payload: columnsSelector });
      // we have created dummy data for shimmer there not providing label,in actual data label will be there so show shimmer if dummy data
      setTimeout(() => { setShowColumnShimmer(false) }, 100)
    }

  }, [columnsSelector])

  /** Cell Callbacks */
  const handleCarrierActivation = async () => {
    if (!carrierActivationRequest) {
      return
    }
    setCarrierActivationRequest(undefined)

    if (!isEditMode) {
      if (Object.keys(carrierActivationRequest.carrierIds).length === 1) {
        const clientCoLoaderId = Number(Object.keys(carrierActivationRequest.carrierIds)[0])
        dispatch({
          type: '@@carrierListView/UPDATE_DATA',
          payload: {
            clientCoLoaderId,
            isActiveFl: carrierActivationRequest.activeRequest
          }
        })
      }

      try {
        let carrierIds = carrierActivationRequest.carrierIds
        const { data: { message, status } } = await axios.put(apiMappings.carrier.listView.activationRequest + '?isActive=' + carrierActivationRequest.activeRequest, carrierIds)
        if (status === 200) {
          toast.add(message, 'check-round', false)
          fetchDataSilently()
          setSelectedRows({});
          fetchOptions.apis?.resetSelection()
          return
        }
        throw message
      } catch (errorMessage) {
        carrierActivationRequest.failureCallback && carrierActivationRequest.failureCallback(!carrierActivationRequest.activeRequest)
        toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false)
      }
    }
  }
  const handleActiveFlChange = (isChecked: boolean, { clientCoLoaderId }: IRowData, failureCallback: React.Dispatch<React.SetStateAction<boolean>>) => {
    const carrierIds = [clientCoLoaderId]
    setCarrierActivationRequest({ activeRequest: isChecked, carrierIds, failureCallback })
  }

  const handleBranchPopup = (isBranchFlag: boolean, { clientCoLoaderId }: IRowData) => {
    const carrierIds = clientCoLoaderId
    if (isBranchFlag) {
      setShowBranchPopup({ isBranchPopupFlag: isBranchFlag, carrierIds })
      dispatch({
        type: '@@carrierListView/FETCH_BRANCH_DATA',
        payload: {
          customColoaderId: clientCoLoaderId
        }
      })
    } else {
      setShowBranchPopup(undefined)
    }

  }

  const cellCallbackMapping = {
    isActiveFl: handleActiveFlChange,
    linkedBranchCount: handleBranchPopup
  }

  const regexValidation = (inputText: string) => {
    let mail_format = /^[a-zA-Z0-9_\-]+[\.]?[a-zA-Z0-9]+[^\.]*[@][a-z]+[\.][a-z]{2,3}$/;
    return mail_format.test(inputText);
  }
  
  /** Inline Edit */
  const validateSelectedRows = () => {
    const columnStructure = columnsSelector

    try {
      validateRows(editDetails,columnStructure);
    } catch (error) {
      console.log('Inline Edit Validation Failed.', error?.message)
      throwError(error);
      if (error.message) {
        toast.add(error.message, '', false)
      }
      return false
    }

    return true
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

  const handleSaveRows = async () => {
    sendGA('ListView ActionBar', 'Carrier List View Button Click - Save - Inline Edit');
    const isValid = validateSelectedRows()
    let handleFlag = true;

    if (isValid) {
      const payload: Partial<IRowData>[] = []
      Object.values(selectedRows).forEach((row) => {
        if (editDetails[row.clientCoLoaderId]) {
          const obj: any = {
            clientCoLoaderId: row.clientCoLoaderId
          }
          Object.keys(columnsSelector).forEach((columnId) => {
            if (columnsSelector?.[columnId]?.editable) {
              const validationflag = regexValidation(editDetails?.[row.clientCoLoaderId]?.[columnId]?.value);

              if (editDetails?.[row.clientCoLoaderId]?.[columnId]?.hasError) {
                toast.add(`${dynamicLabels.pleaseEnterValid} ${dynamicLabels.email}`, 'warning', false)
                handleFlag = false

              } else {
                obj[columnId] = editDetails?.[row.clientCoLoaderId]?.[columnId]?.value || row[columnId]
              }
              if (columnId == 'coLoaderName') {
                obj['name'] = editDetails?.[row.clientCoLoaderId]?.[columnId]?.value || row[columnId]
              }

              if (columnId == 'emailAddress' && validationflag == false) {
                toast.add(`${dynamicLabels.pleaseEnterValid} ${dynamicLabels.email}`, 'warning', false)
                handleFlag = false
              }
            }
          })
          payload.push(obj)
        }
      })

      if (!payload.length) {
        handleCancelRows()
        return
      }

      if(handleFlag){
        try {
          const { data: { message, status } } = await axios.put(apiMappings.carrier.listView.inlineUpdate, payload)
          if (status === 200) {
            fetchDataSilently()
            setEditMode(false)
            fetchOptions.apis?.resetSelection()
            setSelectedRows({})
            dispatch({ type: '@@carrierListView/CLEAR_EDIT_DETAILS' })
            toast.add(message, 'check-round', false)
            return
          }
          throw message
        } catch (errorMessage) {
          const message = errorMessage?.response?.data?.message
          toast.add(message || dynamicLabels.somethingWendWrong, 'warning', false)
        }
      } else {
        return false;
      }
    }
  }

  const handleCancelRows = React.useCallback(() => {
    setShowCancelConfirmationModal(false)
    sendGA('ListView ActionBar', 'Carrier List View Button Click - Cancel - Inline Edit');
    dispatch({ type: '@@carrierListView/CLEAR_EDIT_DETAILS' })
    setEditMode(false)
    fetchOptions.apis?.resetSelection()
    setSelectedRows({})
  }, [fetchOptions])

  const handleMoreOptions = React.useCallback(async (id: string) => {
    const selectedRowValues = Object.values(selectedRows)
    switch (id) {
      case 'inactive':
      case 'active':
        {
          /** Validate for marking already Active or Inactive carrier */
          const hasInvalidRequest = selectedRowValues.some(row => {
            if ((id === 'inactive' && !row.isActiveFl) || (id === 'active' && row.isActiveFl)) {
              return true
            }
            return false
          })

          if (hasInvalidRequest) {
            toast.add(dynamicLabels?.[id === 'active' ? 'carrierAlreadyActive' : 'carrierAlreadyInActive'], 'warning', false)
            return
          }

          let carrierIds: any = [];
          selectedRowValues.forEach(row => carrierIds.push(row.clientCoLoaderId))
          setCarrierActivationRequest({
            activeRequest: id === 'active',
            carrierIds,
          })
        }
        break
    }
  }, [selectedRows, dynamicLabels])

  const handleBreadCrumbClick = React.useCallback((value: string) => {
    const payload = {
      pageNumber: fetchOptions.pageNumber,
      pageSize: fetchOptions.pageSize,
      fetchColoaderBranches: true
    }

    if (value == 'activeCarriers') {
      payload['searchBy'] = "isActiveFl"
      payload['searchText'] = true
      setSectionName('VENDOR_AVALIABLE_LIST_VIEW')
      dispatch({ type: '@@carrierListView/FETCH_STRUCTURE', payload: { sectionName: 'VENDOR_AVALIABLE_LIST_VIEW' } });

    } else if (value == 'InactiveCarriers') {
      payload['searchBy'] = "isActiveFl"
      payload['searchText'] = false
      setSectionName('VENDOR_INACTIVE_LIST_VIEW')
      dispatch({ type: '@@carrierListView/FETCH_STRUCTURE', payload: { sectionName: 'VENDOR_INACTIVE_LIST_VIEW' } });
    } else {
      setSectionName('VENDOR_MASTER_LIST_VIEW');
      dispatch({ type: '@@carrierListView/FETCH_STRUCTURE', payload: { sectionName: 'VENDOR_MASTER_LIST_VIEW' } });
    }
    dispatch({
      type: '@@carrierListView/SET_LOADING',
      payload: { listView: true }
    })

    dispatch({
      type: '@@carrierListView/FETCH_DATA',
      payload: payload
    })
  }, [])

  const fetchDataSilently = () => {
    const { pageSize, pageNumber, sortOptions, filterOptions } = fetchOptions
    let payload: any = {}
    if (sectionPageName == 'VENDOR_AVALIABLE_LIST_VIEW') {
      payload['searchBy'] = "isActiveFl"
      payload['searchText'] = true
      payload['isLoading'] = false
    } else if (sectionPageName == 'VENDOR_INACTIVE_LIST_VIEW') {
      payload['searchBy'] = "isActiveFl"
      payload['searchText'] = false
      payload['isLoading'] = false
    } else {
      payload = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        searchBy: filterOptions?.searchBy,
        searchText: filterOptions?.searchText,
        sortBy: sortOptions?.sortBy || '',
        sortOrder: sortOptions?.sortOrder || '',
        isLoading: false
      }
    }
    dispatch({
      type: '@@carrierListView/FETCH_DATA',
      payload
    });

  }

  /** List View Callbacks */
  const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {
    dispatch({
      type: '@@carrierListView/SET_LOADING',
      payload: { listView: true }
    })
    let payload = {}
    setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis })
    if (sectionPageName == 'VENDOR_AVALIABLE_LIST_VIEW') {
      payload['searchBy'] = "isActiveFl"
      payload['searchText'] = true
      payload['isLoading'] = true
    } else if (sectionPageName == 'VENDOR_INACTIVE_LIST_VIEW') {
      payload['searchBy'] = "isActiveFl"
      payload['searchText'] = false
      payload['isLoading'] = true
    } else {
      payload = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        searchBy: filterOptions?.searchBy,
        searchText: filterOptions?.searchText,
        sortBy: sortOptions?.sortBy,
        sortOrder: sortOptions?.sortOrder,
        isLoading: true
      }
    }
    dispatch({
      type: '@@carrierListView/FETCH_DATA',
      payload: payload
    })
  }, [sectionPageName, filterListPayload])

  const onSortChange = React.useCallback(() => { }, [])

  const onRowSelect = React.useCallback((s: ISelectedRows) => {
    setSelectedRows(s)
  }, [])

  const handleActionBarButtonClick = React.useCallback((id: string) => {
    switch (id) {
      case 'update':
        setEditMode(true)
        break

      case 'more':
        break

    }
  }, [])

  const handleDownloadReport = async () => {
    sendGA('ListView ActionBar', 'Carrier List View Button Click - Download Report');
    setDownloadReportDisabled(true)

    const payload = {
      pageNumber: fetchOptions.pageNumber,
      pageSize: fetchOptions.pageSize,
      searchBy: fetchOptions.filterOptions?.searchBy,
      searchText: fetchOptions.filterOptions?.searchText,
      sortBy: fetchOptions.sortOptions?.sortBy,
      sortOrder: fetchOptions.sortOptions?.sortOrder
    }
    try {
      console.log('Download Carrier Start', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
      const { data } = await axios.post(apiMappings.carrier.listView.carrierExcelDownload, {}, {
        responseType: 'arraybuffer',
        params: payload

      })
      console.log('Download Carrier Complete', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
      FileSaver.saveAs(new Blob([data], { type: "application/vnd.ms-excel xlsx" }), `${dynamicLabels.CarrierReport}.xlsx`)
      setDownloadReportDisabled(false)
      setShowDownloadSuccess(true)
    } catch {
      setDownloadReportDisabled(false)
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
    const param = {
      sectionName: sectionPageName
    }

    try {
      const { data: { message } } = await axios.put(apiMappings.carrier.listView.structure, payload, { params: param })
      message && toast.add(message, 'check-round', false)
    } catch (error) {
      console.log(error, error?.response)
    }


  }, [columnsSelector])
  // console.log(showColumnShimmer || (!Object.values(rowsSelector)?.[0]?.coLoaderName) ? true + 'hello' : loading)

  // Handle fetch Filters
  const handleFetchFilters = async (callBackAdvanceFilter = false) => {
    if ((!isFilterDataCalled && ((advancedFilterData.length > 0 && advancedFilterData[0].sectionName != 'CARRIER_LIST_VIEW') || advancedFilterData?.length == 0)) || callBackAdvanceFilter) {
      setIsFilterDataCalled(true)
      try {
        const { data } = await axios.get(apiMappings.advancedSearch.getFilters, {
          params: {
            modelName: 'CARRIER',
            pageName: 'CARRIER',
            sectionName: `CARRIER_LIST_VIEW`
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
        toast.add(dynamicLabels.updateFilterFailed, 'warning', false);
      }
    }
  }

  /********  FILTER CHANGE **************/
  const handleFilterChange = (combinedFilters: IFilterOptions) => {

    let existingParams = getQueryParams()
    /** Do not push to history when there is no change. */
    if ((!combinedFilters.searchBy && !existingParams.searchBy) || (combinedFilters.searchBy === existingParams.searchBy && combinedFilters.searchText === existingParams.searchText)) {
      return
    }

    const newParams = {
      page: existingParams.page || "All",
      ...(existingParams.sortBy ? { sortBy: existingParams.sortBy, sortOrder: existingParams.sortOrder } : {}),
      ...(combinedFilters.searchBy ? { searchBy: combinedFilters.searchBy, searchText: combinedFilters.searchText } : {})
    }

    // hybridRouteTo(`updatedriver/?driverid=${row.driverId}`)
    // hybridRouteTo(`driver/?page=${newParams.page || null}&searchBy=${newParams.searchBy || null}&searchText=${newParams.searchText || null}&startDateFilter=${newParams.startDateFilter || null}&endDateFilter=${newParams.endDateFilter || null}`)
    
    setTimeout(() => {
      ngStateRouter.go('Carrier', newParams, ngStateRouterOptions)
    }, 100)
  }

  const handleRemoveFilter = (showToast: boolean) => {
    advanceFilterdispatch({ type: '@@advanceFilter/SET_FILTERLIST_PAYLOAD', payload: undefined });
    advanceFilterdispatch({ type: '@@advanceFilter/SET_CURRENT_FILTERS', payload: undefined });
    advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: false });
    dispatch({ type: '@@carrierListView/FETCH_DATA', payload: { isLoading: true } })
    showToast && toast.add(dynamicLabels?.filterRemovedSuccessfully, 'check-round', false);
  }

  const handleOpenAdvancedFilter = () => {
    advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: !openAdvFilter });
  }

  return (
    <>
      <CarrierListViewContainer>
        <div id='toast-inject-here' style={{ zIndex: 100 }}></div>
        <Box display='flex' flexDirection='column' style={{ width: '100%', height: '100vh', paddingTop: '64px' }} px='15px' pb='15px'>
          {/* Header */}
          <Box display='flex' justifyContent='space-between' style={{ width: '100%' }} py='15px'>
            {/* <div title='breadcrumbs' className='cursor'>Bread crumbs come here</div> */}
            <div>
              <BreadCrumb options={breadCrumbOptions} onClick={(value: string) => { handleBreadCrumbClick(value) }} optionList={optionList} />
              {filterListPayload &&
                <Tooltip maxWidth={600} tooltipDirection='bottom' messagePlacement='center' hover message={
                  <div style={{ textAlign: 'left', fontSize: 12 }}>
                    <Box mb='10px'>Filters are applied on {filterListPayload.operationLogic === 'AND' ? 'ALL' : 'ANY'} of the the following conditions:</Box>
                    {currentFilter && currentFilter?.filters && currentFilter?.filters.map((f: any, i) => {
                      return <Box mb='5px'>{`${i + 1}. ${f.fieldLabelKey} ${f?.labelValue || f?.operationSymbol} ${f.filterDataLabel ? f.filterDataLabel : f.filterData}`}</Box>
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
                        onClick={() => handleRemoveFilter(true)}
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
              {pageLabels?.buttons.add &&
                <>
                  <IconButton
                    id="carrier--actionbar--add"
                    intent='page'
                    data-tip
                    data-for='tt_AddCarrier'
                    iconVariant='icomoon-add'
                    onClick={() => {
                      sendGA('Navigation', 'Carrier List View Button Click - Add Carrier');
                      hybridRouteTo('vendorForm')
                    }}>
                    {dynamicLabels[pageLabels?.buttons.add] || dynamicLabels.add}
                  </IconButton>
                  <ReactTooltip id='tt_AddCarrier' type='info' effect='solid' place='bottom'>
                    {`${dynamicLabels.addCarrierBranch}`}
                  </ReactTooltip>
                </>}



              {pageLabels?.buttons.upload &&
                <>
                  <IconButton
                    id="carrier--actionbar--upload"
                    data-tip={`${dynamicLabels.clickHereToUploadNew} ${dynamicLabels.vendorMaster}`}
                    data-place='bottom'
                    // data-offset="{'top': 10, 'left': 10}"
                    data-for='tt_UploadCarrier'
                    intent='page'
                    style={{ marginRight: 0 }}
                    iconVariant='icomoon-upload' onClick={() => {
                      sendGA('Excel Upload', 'Carrier List View Button Click - Upload Carrier');
                      setShowUploadPopup(true)
                    }}>
                    {dynamicLabels[pageLabels?.buttons.upload] || dynamicLabels.Upload}
                  </IconButton>
                  <ReactTooltip
                    id='tt_UploadCarrier'
                    type='info'
                    effect='solid'
                    place='bottom'
                    multiline>
                    <div style={{ maxWidth: '100px', lineHeight: '20px', textAlign: 'center' }}>
                      {`${dynamicLabels.clickHereToUploadNew} ${dynamicLabels.vendorMaster}`}
                    </div>
                  </ReactTooltip>
                </>
              }

              {ButtonGroupData.length > 0 &&
                <ButtonGroup data={ButtonGroupData} onChange={(id) => dispatch({ type: '@@carrierListView/SET_VIEW_MODE', payload: id } as ISetViewMode)} />}
            </Box>
          </Box>

          {/* LIST VIEW CONTAINER */}
          <Grid container spacing={5} style={{ flexGrow: 1, overflow: 'hidden', width: '100%', boxShadow: viewMode === 'listview' ? '0 2px 20px -10px #000' : '' }}>
            <Grid item md={viewMode === 'listview' ? 12 : 4} style={{ display: 'flex', overflow: 'hidden' }}>
              {filterListPayload &&
                <AppliedFilterStrip>
                  <AdvancedFilterLabel>Advanced Filter Applied</AdvancedFilterLabel>
                  <ButtonWrapper onClick={() => handleRemoveFilter(true)}>
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


              <Card style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', paddingRight: 0, paddingBottom: 0 }}>
                {columns.length > 0 &&
                  <ListView
                    rowIdentifier='clientCoLoaderId'
                    style={{ height: '100%', overflow: 'visible' }}
                    columns={columns}
                    data={rowsSelector}
                    onFetchData={handleFetchData}
                    hasRowSelectionWithEdit={viewMode === 'listview'}
                    onSortChange={onSortChange}
                    onRowSelect={onRowSelect}
                    onSaveColumnPreferences={onSaveColumnPreferences}
                    totalRows={totalRowsSelector}
                    loading={showColumnShimmer || loading}
                    hideRefresh={showColumnShimmer || loading}
                    isColumnLoading={showColumnShimmer}
                    isEditMode={isEditMode}
                    onRowEditClick={(row) => {
                      sendGA('Navigation', 'Carrier List View Button Click - Edit Carrier');
                      hybridRouteTo(`vendorForm?vendor=${row.clientCoLoaderId}`)
                    }}
                    filters = {filters}
                    sorts = {sort}
                    onFilterChange={handleFilterChange}
                  >
                    {viewMode === 'listview' ? {
                      IconBar:
                        <Box display='flex' style={{ position: 'relative' }}>
                          <IconButton title={dynamicLabels.download + ' ' + dynamicLabels.Vendor + dynamicLabels.report} disabled={isDownloadReportDisabled} iconVariant='icomoon-download' iconSize={16} onlyIcon style={{ color: 'inherit' }} onClick={handleDownloadReport} />
                          <AdvancedFilterComponent
                            pageName='carrier'
                            handleFetchFilters={handleFetchFilters}
                            handleRemoveFilter={(showToast: boolean) => handleRemoveFilter(showToast)}
                            handleFetchData={handleFetchData}
                            data={AdvanceFilterData}
                            needsFetchDataCall={false}
                          />


                        </Box>,
                      ActionBar: (
                        <Box display='flex' horizontalSpacing='10px'>
                          {isEditMode ? (
                            <>
                              <Tooltip message={`${dynamicLabels.save} ${dynamicLabels.Vendor}`} hover>
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
                              <Tooltip message={`${dynamicLabels.cancel} ${dynamicLabels.Vendor}`} hover>
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
                                (buttonKey, index) => {

                                  switch (buttonKey) {
                                    case 'InlineEdit': {
                                      return null;
                                    }
                                    case 'more': {
                                      <CreateActionBarButton
                                        pageName="carrier"
                                        buttonKey={buttonKey}
                                        actionBarButton={actionBarButtons[buttonKey]}
                                        buttonIndex={index}
                                        selectedRows={selectedRows}
                                        handleActionBarButtonClick={handleMoreOptions}
                                        isButtonDisabled={!Object.keys(selectedRows).length && actionBarButtons[buttonKey].permission}
                                        buttonToolTipTextList={'Click here to update the status of the selected ' + dynamicLabels.vendorMaster} />
                                    }

                                    default: {
                                      return <CreateActionBarButton
                                        pageName='carrier'
                                        buttonKey={buttonKey}
                                        actionBarButton={actionBarButtons[buttonKey]}
                                        buttonIndex={index}
                                        selectedRows={selectedRows}
                                        handleActionBarButtonClick={handleActionBarButtonClick}
                                        isButtonDisabled={!Object.keys(selectedRows).length && actionBarButtons[buttonKey].permission}
                                        buttonToolTipTextList={buttonKey === 'update' ? 'Click here to update the selected ' + dynamicLabels.vendorMaster : `tt_${actionBarButtons[buttonKey].label}`} />

                                    }

                                  }

                                }

                              ))}
                        </Box>
                      ),

                    } : undefined
                    }
                  </ListView>}
              </Card>

            </Grid>
            {viewMode === 'mapview' && <Grid item md={8}>
              <Card style={{ backgroundColor: '#fff' }}>This is map View</Card>
            </Grid>}
          </Grid>
        </Box>

        {/* ACTIVATION CONFIRMATION MODAL */}
        <Modal open={!!carrierActivationRequest} onToggle={() => { }} size='md'>
          {{
            header: <ModalHeader
              headerTitle={dynamicLabels?.confirmation}
              imageVariant='icomoon-close'
              handleClose={() => {
                carrierActivationRequest?.failureCallback && carrierActivationRequest?.failureCallback(!carrierActivationRequest.activeRequest)
                setCarrierActivationRequest(undefined)
              }}
            />,

            content: (
              <>
                <div style={{ fontSize: '14px' }}>{carrierActivationRequest?.activeRequest ? dynamicLabels.areYouSureYouWantToMarkAsAcitve : dynamicLabels.areYouSureYouWantToMarkAsInactive}</div>
              </>),
            footer: (
              <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                <IconButton iconVariant='icomoon-tick-circled' primary onClick={handleCarrierActivation}>{dynamicLabels.confirm}</IconButton>
                <IconButton iconVariant='icomoon-close' iconSize={11}
                  onClick={() => {
                    carrierActivationRequest?.failureCallback && carrierActivationRequest?.failureCallback(!carrierActivationRequest.activeRequest)
                    setCarrierActivationRequest(undefined)
                  }}>
                  {dynamicLabels.cancel}
                </IconButton>
              </Box>
            )
          }}
        </Modal>
        {/* BRANCH  MODAL */}
        <Modal open={!!showBranchPopup} onToggle={() => { }} width="90vw">
          {{
            header: <ModalHeader
              headerTitle={dynamicLabels?.branch}
              imageVariant='icomoon-close'
              width='90vw'
              handleClose={() => {
                setShowBranchPopup(undefined)
              }}
            />,

            content: (
              <>
                {/* BRANCH LIST VIEW CONTAINER */}
                <table className="popup-table">
                  <thead>
                    <tr>{Object.values(branchStructure.columns).map((col, i) => {
                      return col['permission'] ? <th key={i}><span title={col['label']}> {col['label']}</span></th> : ''
                    })
                    }</tr>
                  </thead>
                  <tbody>
                    {branchRowsSelector.map((rowdata, k) => {
                      return (<tr key={k}>
                        {Object.entries(branchStructure.columns).map(([columnKey, val]) => {
                          return (
                            val['permission'] ? <td key={columnKey}><span title={rowdata[columnKey]}> {rowdata[columnKey]} </span></td> : ""
                          )
                        })
                        }
                      </tr>)
                    })
                    }
                  </tbody>
                </table>
              </>),
            footer: (
              <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                <IconButton iconVariant='icomoon-close' iconSize={11}
                  onClick={() => {
                    setShowBranchPopup(undefined)
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
        <UploadExcel
          isOpen={showUploadPopup}
          featureName='carrier'
          onSuccess={() => {
            setShowUploadPopup(false)
            handleFetchData(fetchOptions)
          }}
          onClose={() => setShowUploadPopup(false)}
        />

        <DownloadMessage
          showInfoModal={showDownloadSuccess}
          onToggle={setShowDownloadSuccess}
        />
      </CarrierListViewContainer>

    </>
  )
}

export default withThemeProvider(withToastProvider(withRedux(withPopup(CarrierListView)), 'toast-inject-here'))

