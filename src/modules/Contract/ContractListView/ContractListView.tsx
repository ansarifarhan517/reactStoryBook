import React, { useEffect, Dispatch, useState } from 'react'
import { useDispatch } from 'react-redux'

import {
  Card, Box, Grid, useToast, IListViewColumn, ISelectedRows, IFetchDataOptions, ListView, IconButton, Tooltip, ModalHeader, Modal, BreadCrumb, IFilterOptions,
  ISortOptions, withToastProvider, withPopup, IconDropdown
} from 'ui-library'
import { ColumnInstance } from 'react-table'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import { transformMongoListViewToColumns } from '../../../utils/mongo/ListView'
import { ContractListViewActions } from './ContractListView.actions'
import axios from '../../../utils/axios'
import apiMappings from '../../../utils/apiMapping'
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels'
import { hybridRouteTo, getQueryParams, } from '../../../utils/hybridRouting';
import iconsMapping from '../../../utils/mongo/ListView/actionBarIcons.mapping'
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping'
import { sendGA } from '../../../utils/ga'
import withRedux from '../../../utils/redux/withRedux';
import { IRowData, tContractStatus } from './ContractListView.models'

import { IStateService } from 'angular-ui-router';
import FileSaver from 'file-saver'
import { StyledGrid, ListViewWrapper } from './styled'
import UploadExcel from '../../../utils/wrapper/uploadExcel';
// import withReact from '../../../utils/components/withReact'
import { SortingRule } from 'react-table'
import { withThemeProvider } from '../../../utils/theme'
import {
  AdvancedFilterLabel, AppliedFilterStrip, ButtonWrapper, FilterAppliedTag, FilterAppliedTagButtonWrapper, FilterAppliedTagLabel,
  //  SectionHeader, Accordion
} from '../../OrderRequest/OrderRequestListView/StyledOrderRequestListView'
import { NoDataWrapper } from '../../Vehicle/VehicleListView/VehicleListView.styled'
import EmptyData from '../../../utils/components/EmptyData'
import BranchAccordion from './SubComponent/BranchAccordion'
import { manipulateData } from './SubComponent/utils'
import DownloadMessage from '../../../utils/components/DownloadMessage'
import InlineEditConfirmationModal from '../../../utils/components/InlineEditConfirmationModal'
// import useClientProperties from '../../common/ClientProperties/useClientProperties'
import { AdvancedFilterComponentActions } from '../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions'
import AdvancedFilterComponent from '../../common/AdvancedFilterComponent'
import { throwError, validateRows } from '../../common/InlineEdit/InlineEdit'
interface IContractListViewProps {
  ngStateRouter: IStateService
}


/** By default: Dont Reload, Or notify change or Inherit existing Parameters from URL */
const ngStateRouterOptions = { notify: false, reload: false, inherit: false, location: true }

const ContractListView = ({ ngStateRouter }: IContractListViewProps) => {
  /** General Hooks */
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.contract)
  const toast = useToast()

  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<ContractListViewActions>>()
  const advanceFilterdispatch = useDispatch<Dispatch<AdvancedFilterComponentActions>>();
  const structure = useTypedSelector(state => state.contract.listView.structure)
  const columnsSelector = useTypedSelector(state => state.contract.listView.structure.columns)
  const rowsSelector = useTypedSelector(state => state.contract.listView.data.results)
  const totalRowsSelector = useTypedSelector(state => state.contract.listView.data.totalCount)
  const pageLabels = useTypedSelector(state => state.pageLabels.rateContract)
  const actionBarButtons = useTypedSelector(state => state.contract.listView.structure.buttons)
  // const columnsLoading = useTypedSelector(state => state.contract.listView.loading.columns);
  const editDetails = useTypedSelector(state => state.contract.listView.editDetails)
  const loading = useTypedSelector(state => state.contract.listView.loading.listView)
  //   const notifyTypeOptions = useTypedSelector(state => state.contract.listView.notifyType)
  const emptyData = useTypedSelector(state => state.contract.listView.emptyData);
  const breadcrumbFilter = useTypedSelector(state => state.contract.listView.breadcrumbFilter)
  const clientProperties = useTypedSelector(state => state.clientProperties);
  const filterListPayload = useTypedSelector(state => state.advanceFilter.filterListPayload)
  const currentFilter = useTypedSelector(state => state.advanceFilter.currentFilter)
  const openAdvFilter = useTypedSelector(state => state.advanceFilter.openAdvFilter)
  const advancedFilterData = useTypedSelector(state => state.advanceFilter.advancedFilterData)
  const [isFilterDataCalled, setIsFilterDataCalled] = useState<boolean>(false);
  //   const mentions = useTypedSelector(state => state.contract.listView.notifyTypeDynamicTags)
  /** State */
  const [columns, setColumns] = useState<IListViewColumn[]>([])
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({})
  const [isEditMode, setEditMode] = useState<boolean>(false)
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({})
  const [isDownloadReportDisabled, setDownloadReportDisabled] = useState<boolean>(false)
  const [contractActivationRequest, setContractActivationRequest] = useState<
    { activeRequest: boolean, contractId: Record<number, boolean>, failureCallback?: React.Dispatch<React.SetStateAction<boolean>> } | undefined>()

  const [showCancelConfirmationModal, setShowCancelConfirmationModal] = useState<boolean>(false)
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false)
  const [showUploadPopup, setShowUploadPopup] = useState<boolean>(false)
  //   const [notifyDropdown, setNotifyDropdown] = useState<INotifyDropdown[] | undefined>()
  const [filters, setFilters] = useState<Record<string, string>>()
  const [sort, setSort] = useState<SortingRule<object>[]>()
  const [showBranchPopup, setShowBranchPopup] = useState<boolean>(false)
  const [branchPopup, setBranchPopUp] = useState<any | undefined>()
  const [showColumnShimmer, setShowColumnShimmer] = useState<boolean>(false)

  const AdvanceFilterData = {
    sectionName: 'contract'
  }

  /** Watchers */
  useEffect(() => {

    dispatch({ type: '@@contractListView/FETCH_STRUCTURE' })
    handleQueryParams()
    setShowColumnShimmer(true)
    handleFetchFilters();
    dispatch({ type: '@@contractListView/FETCH_DATA', payload: { isLoading: true } })
    advanceFilterdispatch({ type: '@@advanceFilter/SET_FILTERLIST_PAYLOAD', payload: undefined });
    advanceFilterdispatch({ type: '@@advanceFilter/SET_CURRENT_FILTERS', payload: undefined });
    advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: false });

    return () => {
      dispatch({ type: '@@contractListView/RESET_STATE' })
    }

  }, [])


  useEffect(() => {

    rowsSelector.length > 0 && setTimeout(() => {
      dispatch({
        type: '@@contractListView/SET_LOADING',
        payload: { listView: false }
      })
    }, 300)

  }, [rowsSelector])




  useEffect(() => {

    const firstEntry: any = Object.values(columnsSelector)?.[0]
    if (columnsSelector && firstEntry?.id) {
      const mongoStructure = columnsSelector
      if (mongoStructure && Object.keys(mongoStructure).length) {
        const newColumns = transformMongoListViewToColumns(mongoStructure, 'contract', cellCallbackMapping)
        setColumns(newColumns)
      }
      advanceFilterdispatch({ type: '@@advanceFilter/SET_COLUMNS_SELECTOR', payload: columnsSelector });
      // we have created dummy data for shimmer there not providing label,in actual data label will be there so show shimmer if dummy data
      setTimeout(() => { setShowColumnShimmer(false) }, 100)
    }

  }, [columnsSelector])


  /** Cell Callbacks */
  const handleContractActiavtion = async () => {
    if (!contractActivationRequest) {
      return;
    }
    setContractActivationRequest(undefined);

    if (Object.keys(contractActivationRequest.contractId).length === 1) {
      const contractId = Number(Object.keys(contractActivationRequest.contractId)[0]);
      dispatch({
        type: '@@contractListView/UPDATE_DATA',
        payload: {
          id: contractId,
          isActive: contractActivationRequest.activeRequest,
        },
      });
    }


    const contractIds = Object.keys(contractActivationRequest.contractId).map((c: any) => {
      return Number(c)
    })

    try {
      const {
        data: { message, status },
      } = await axios.put(
        apiMappings.contract.listView.activationRequest, [...contractIds],
        {
          params: {
            isActive: contractActivationRequest.activeRequest
          }
        }
      );
      if (status === 200) {
        toast.add(dynamicLabels.statusUpdatedSuccessfully, 'check-round', false);
        handleFetchData(fetchOptions);
        setSelectedRows({});
        fetchOptions.apis?.resetSelection();
        return;
      }
      throw message;
    } catch (errorMessage) {
      contractActivationRequest.failureCallback && contractActivationRequest.failureCallback(!contractActivationRequest.activeRequest);
      toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false);
    }
  };



  const handleActiveFlChange = (isChecked: boolean, { contractId }: IRowData, failureCallback: React.Dispatch<React.SetStateAction<boolean>>) => {
    const contractIds = {
      [contractId]: true,
    };
    // setVehicleActivationRequest({ activeRequest: isChecked, contractIds, failureCallback });

    if (!Object.keys(editDetails).length) {
      setContractActivationRequest({ activeRequest: isChecked, contractId: contractIds, failureCallback })
    } else {
      setContractActivationRequest({ activeRequest: isChecked, contractId: contractIds, failureCallback })
    }
  }

  const handleBranchCount = async (row: any) => {
    sendGA('Navigation', 'Contract List View Branch Count');
    try {
      const { data } = await axios.get(apiMappings.contract.listView.branchCount, {
        params: {
          id: row?.contractId
        }
      });
      if (data) {
        data.data.clientBranchCoLoaderDTOs && setShowBranchPopup(true)
        data.data.clientBranchCoLoaderDTOs && setBranchPopUp(data.data.clientBranchCoLoaderDTOs)
      }
      return;
    } catch (errorMessage) {
      toast.add(dynamicLabels.somethingWendWrong, 'warning', false);
    }


  }
  // cell callback mapping
  const cellCallbackMapping = {
    branchCount: handleBranchCount,
    isActiveFl: handleActiveFlChange
  }

  // Handle fetch Filters
  const handleFetchFilters = async (callBackAdvanceFilter=false) => {
    try {
      if ((!isFilterDataCalled && ((advancedFilterData.length > 0 && advancedFilterData[0].sectionName != 'CONTRACT_LIST_VIEW') || advancedFilterData?.length == 0)) || callBackAdvanceFilter) {
        setIsFilterDataCalled(true)
        const { data } = await axios.get(apiMappings.advancedSearch.getFilters, {
          params: {
            modelName: 'CONTRACT',
            pageName: 'CONTRACT',
            sectionName: `CONTRACT_LIST_VIEW`
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
    showToast && toast.add(dynamicLabels?.filterRemovedSuccessfully, 'check-round', false);
  }

  const handleOpenAdvancedFilter = () => {
    advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: !openAdvFilter });
  }
  /** List View Callbacks */
  const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {

    dispatch({
      type: '@@contractListView/SET_LOADING',
      payload: { listView: true }
    })

    let filterOpt: IFilterOptions | undefined = { ...filterOptions }

    if (filterOptions?.searchBy?.includes("contractDate") || filterOptions?.searchBy?.includes("contractExpiryDate")) {

      const FO = manipulateData(filterOptions, ['contractDate', 'contractExpiryDate'], clientProperties?.TIMEZONE?.propertyValue)
      filterOpt = { ...FO }
    }

    setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions: filterOpt, apis })

    dispatch({
      type: '@@contractListView/FETCH_DATA',
      payload: {
        pageNumber: pageNumber,
        pageSize: pageSize,
        searchBy: filterOpt?.searchBy,
        searchText: filterOpt?.searchText,
        sortBy: sortOptions?.sortBy,
        sortOrder: sortOptions?.sortOrder,
        status: breadcrumbFilter,
        isLoading: true
      }
    })

  }, [filterListPayload])

  const onRowSelect = React.useCallback((s: ISelectedRows) => {
    setSelectedRows(s)
  }, [])

  // const onSortChange = React.useCallback(() => { }, [])

  const handleActionBarButtonClick = React.useCallback((id: string) => {
    switch (id) {
      case 'update': {
        sendGA('ListView ActionBar', 'Contract List View Button Click - Update - Inline Edit');
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

    sendGA('ListView ActionBar', 'Contract List View Button Click - Save - Inline Edit');
    const isValid = validateSelectedRows()

    if (isValid) {
      const payload: Partial<IRowData>[] = []
      let flag = true
      Object.values(selectedRows).forEach((row) => {

        if (editDetails[row.contractId]) {
          const obj: any = {
            contractId: row.contractId
          }

          Object.keys(columnsSelector).forEach((columnId) => {
            if (columnsSelector?.[columnId]?.editable && !columnsSelector?.[columnId]?.customField) {
              if (editDetails?.[row.contractId]?.[columnId]?.hasError) {
                toast.add(`Please Enter Valid ${columnId}`, 'warning', false)
                flag = false

              } else {
                obj[columnId] = editDetails?.[row.contractId]?.[columnId]?.value || row[columnId]
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
          const { data: { message, status } } = await axios.put(apiMappings.contract.listView.inlineUpdate, payload)
          if (status === 200) {
            handleFetchData(fetchOptions)
            setEditMode(false)
            fetchOptions.apis?.resetSelection()
            setSelectedRows({})
            dispatch({ type: '@@contractListView/CLEAR_EDIT_DETAILS' })
            toast.add('Contract Updated Successfully.', 'check-round', false)
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
    dispatch({ type: '@@contractListView/CLEAR_EDIT_DETAILS' });
    setEditMode(false);
    fetchOptions.apis?.resetSelection();
    setSelectedRows({});
  }, [fetchOptions]);

  const handleDownloadReport = async () => {
    sendGA('ListView ActionBar', 'Contract List View Button Click - Download Report');

    setDownloadReportDisabled(true)
    setShowDownloadModal(true)
    const payload = {
      pageNumber: fetchOptions.pageNumber,
      pageSize: fetchOptions.pageSize,
      searchBy: fetchOptions.filterOptions?.searchBy,
      searchText: fetchOptions.filterOptions?.searchText,
      sortBy: fetchOptions.sortOptions?.sortBy,
      sortOrder: fetchOptions.sortOptions?.sortOrder,
      status: breadcrumbFilter
    }
    try {
      const data = await axios.post(apiMappings.contract.listView.contractExcelDownload, filterListPayload,
        {
          params: payload,
          responseType: 'arraybuffer'
        }
      )

      FileSaver.saveAs(new Blob([data.data], { type: "application/vnd.ms-excel xlsx" }), `${dynamicLabels.Contracts} List.xlsx`)
      setDownloadReportDisabled(false)
    } catch {
      toast.add(dynamicLabels.somethingWendWrong, 'warning', false)
      setDownloadReportDisabled(false)
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
      const { data: { message } } = await axios.put(apiMappings.contract.listView.structure, payload, {
        params: {
          modelName: 'CONTRACT',
          pageName: 'CONTRACT',
          sectionName: breadcrumbFilter === 'ALL' ? 'RATE_CONTRACT_MASTER_LIST_VIEW' : `RATE_CONTRACT_MASTER_LIST_VIEW_${breadcrumbFilter}`
        }
      })
      message && toast.add(message, 'check-round', false)
    } catch (error) {
      console.log(error, error?.response)
    }


  }, [columnsSelector])


  const handleAddContract = () => {
    // contract - Add button
    sendGA('Navigation', 'Contract List View Contract - Add button');
    hybridRouteTo('rateContractForm');
    ngStateRouter.go('rateContractForm')
  }

  const handleUpdateContract = (row: any) => {
    // contract - Add button
    sendGA('Navigation', 'Contract List View Contract - Update button');
    hybridRouteTo(`rateContractForm?contract=${row.contractId}`);
    ngStateRouter.go('rateContractForm')
  }

  const getBreadCrumbOptions = () => {
    const dropdownValues = pageLabels?.dropdownValues
    return dropdownValues ? [
      {
        label: `${dropdownValues['all']} ${dynamicLabels.Contracts}`,
        value: 'ALL',
        id: 'ALL',
        key: 'all',
      },
      {
        label: `${dropdownValues['active']} ${dynamicLabels.Contracts}`,
        value: 'ACTIVE',
        id: 'ACTIVE',
        key: 'active'
      }, {
        label: `${dropdownValues['inactive']} ${dynamicLabels.Contracts}`,
        value: 'INACTIVE',
        id: 'INACTIVE',
        key: 'inactive'
      }
    ] : [

      ]
  }

  const breadCrumbOptionList = React.useMemo(
    () => getBreadCrumbOptions(),
    [dynamicLabels, pageLabels]
  );

  const breadCrumbOptions = React.useMemo(() => {
    const list: any = [
      { id: 'payment', label: dynamicLabels?.Payments || "Payments", disabled: true },
      { id: 'carriers', label: dynamicLabels?.carrier_s || "Carrier", disabled: true },
      { id: 'contractMasters', label: dynamicLabels?.CONTRACT_MASTER_LABEL_KEY || "Contract Masters", disabled: true },
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
    if (id !== breadcrumbFilter && !emptyData) {
      dispatch({
        type: '@@contractListView/SET_BREADCRUMB_STATE',
        payload: id as tContractStatus,
      })
      handleCancelRows()
      /** Clear other filters & sorts when Breadcrumb Filter changes */
      setTimeout(() => {
        ngStateRouter.go('rateContractMaster', { page: id || 'ALL' },
          { notify: false, reload: false, inherit: false, location: true })
      }, 1000)

      dispatch({
        type: '@@contractListView/SET_LOADING',
        payload: { listView: true }
      })

      dispatch({ type: '@@contractListView/FETCH_STRUCTURE' })

      dispatch({ type: '@@contractListView/FETCH_DATA', payload: { isLoading: true } })

      setShowColumnShimmer(true)
      dispatch({
        type: '@@contractListView/SET_LOADING',
        payload: { listView: false }
      })
    } else {
      dispatch({
        type: '@@contractListView/SET_BREADCRUMB_STATE',
        payload: id as tContractStatus,
      })
      setTimeout(() => {
        ngStateRouter.go('rateContractMaster', { page: id || 'ALL' },
          { notify: false, reload: false, inherit: false, location: true })
      }, 1000)

    }

  }

  const handleMoreOptions = React.useCallback(

    async (id: string) => {
      const selectedRowValues = Object.values(selectedRows);

      switch (id) {
        case 'inactive':
        case 'active':
          {
            /** Validate for marking already Active or Inactive ContractsIds*/
            const hasInvalidRequest = selectedRowValues.some(row => {
              if ((id === 'inactive' && !row.isActiveFl) || (id === 'active' && row.isActiveFl)) {
                return true;
              }
              return false;
            });

            if (hasInvalidRequest) {
              toast.add(dynamicLabels?.[id === 'active' ? 'contractAlreadyActive' : 'contractAlreadyInActive'], 'warning', false);
              return;
            }
            const contractId = {};
            selectedRowValues.forEach(row => (contractId[row.contractId] = true));
            setContractActivationRequest({
              activeRequest: id === 'active',
              contractId,
            });

            break;
          }
      }
    },
    [selectedRows, dynamicLabels],
  );


  /********  FILTER CHANGE **************/
  const handleFilterChange = (combinedFilters: IFilterOptions) => {
    let existingParams = getQueryParams()
    /** Do not push to history when there is no change. */
    if ((!combinedFilters.searchBy && !existingParams.searchBy) || (combinedFilters.searchBy === existingParams.searchBy && combinedFilters.searchText === existingParams.searchText)) {
      return
    }
    const newParams = {
      page: breadcrumbFilter,
      ...(existingParams.sortBy ? { sortBy: existingParams.sortBy, sortOrder: existingParams.sortOrder } : {}),
      ...(combinedFilters.searchBy ? { searchBy: combinedFilters.searchBy, searchText: combinedFilters.searchText } : {})
    }


    setTimeout(() => {
      ngStateRouter.go('rateContractMaster', newParams, ngStateRouterOptions)
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
      page: breadcrumbFilter,
      ...(sortOptions.sortBy ? { sortBy: sortOptions.sortBy, sortOrder: sortOptions.sortOrder } : {}),
      ...(existingParams.searchBy ? { searchBy: existingParams.searchBy, searchText: existingParams.searchText } : {})
    }

    setTimeout(() => {
      ngStateRouter.go('rateContractMaster', newParams, ngStateRouterOptions)
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


    let breadcrumb: tContractStatus = filterData?.page as tContractStatus
    dispatch({
      type: '@@contractListView/SET_BREADCRUMB_STATE',
      payload: breadcrumb || 'ALL',
    });

  }

  const moreOptionsList = [
    {
      label: 'Mark As Active',
      value: 'active',
      id: 'active',
      tooltipText: 'Mark Status as Active'

    },
    {
      label: 'Mark As Inactive',
      value: 'inactive',
      id: 'inactive',
      tooltipText: 'Mark Status as Inactive'

    }
  ]

  const getOnlyDate = (cDate: string, f: any) => {

    if (f.fieldId === 'contractDate' || f.fieldId === 'contractExpiryDate') {
      const dateArray = cDate.split(',')
      let dA = dateArray.map((d: any) => {
        return d.substring(0, 10)
      })
      dA.join(',')
      return dA
    } else {
      return f.filterDataLabel ? f.filterDataLabel : cDate
    }

  }

  return (
    <>
      <div id='toast-inject-here'></div>
      <Box display='flex' justifyContent='space-between' style={{ width: '100%', paddingTop: '74px' }} px='15px' pb='15px'>
        <div>
          <BreadCrumb
            options={breadCrumbOptions}
            optionList={breadCrumbOptionList}
            width='260px'
            onClick={handleBreadcrumbChange}
          />

          {filterListPayload &&
            <Tooltip tooltipDirection='bottom' messagePlacement='center' hover message={
              <div style={{ textAlign: 'left', fontSize: 12 }}>
                <Box mb='10px'>Filters are applied on {filterListPayload.operationLogic === 'AND' ? 'ALL' : 'ANY'} of the the following conditions:</Box>
                {currentFilter && currentFilter?.filters && currentFilter?.filters.map((f: any, i) => {
                  return <Box mb='5px'>{`${i + 1}. ${f.fieldLabelKey} ${f?.labelValue || f?.operationLabelKey} ${getOnlyDate(f.filterData, f)}`}</Box>
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
          {pageLabels?.buttons.add && (
            <Tooltip message={`${dynamicLabels.clickHereToAdd} ${dynamicLabels.Contracts}.`} hover={true}>
              <IconButton
                id='rateContractMaster-actionBar-add'
                intent='page'
                iconVariant='icomoon-add'
                onClick={handleAddContract}
              >
                {dynamicLabels[pageLabels?.buttons.add] || dynamicLabels.add}
              </IconButton>
            </Tooltip>
          )}

          {pageLabels?.buttons.upload && (
            <Tooltip message={`${dynamicLabels.clickHereToUploadAListOf} ${dynamicLabels.Contracts}.`} hover={true} messagePlacement='end'>
              <IconButton
                id='rateContractMaster-actionBar-upload'
                intent='page'
                style={{ marginRight: 0 }}
                iconVariant='icomoon-upload'
                onClick={() => {
                  sendGA('contract button action', 'Contract List View contract - Upload excel');
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
                    <ListViewWrapper className='ContractListViewWrapper'>

                      <ListView
                        rowIdentifier='contractId'
                        style={{ height: '100%', overflow: 'visible' }}
                        columns={columns}
                        data={rowsSelector}
                        onFetchData={handleFetchData}
                        hasRowSelection={!actionBarButtons?.['InlineEdit']?.permission}
                        hasRowSelectionWithEdit={actionBarButtons?.['InlineEdit']?.permission}
                        onRowSelect={onRowSelect}
                        onSaveColumnPreferences={onSaveColumnPreferences}
                        totalRows={totalRowsSelector}
                        loading={loading || showColumnShimmer}
                        hideRefresh={loading || showColumnShimmer}
                        isEditMode={isEditMode}
                        onRowEditClick={handleUpdateContract}
                        permanentColumns={{
                          contractNumber: true,
                          contractDate: true,
                          isActiveFl: true,

                        }}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        sorts={sort}
                        onSortChange={handleSortChange}
                        isColumnLoading={showColumnShimmer}
                      >
                        {{
                          IconBar: (
                            <Box display='flex' style={{ position: 'relative' }}>
                              <Tooltip message={`${dynamicLabels.download} ${dynamicLabels.ContractReport}`} hover messagePlacement='end'>
                                <IconButton
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
                                      (buttonKey === 'more' ? (
                                        <IconDropdown
                                          key={index}
                                          variant='button-dropdown'
                                          optionList={moreOptionsList}
                                          width='100px'
                                          iconButtonDetails={[
                                            'icomoon-funnel-options',
                                            actionBarButtons[buttonKey].label,
                                            'icomoon-angle-bottom',
                                          ]}
                                          tooltipMessage={`${dynamicLabels.contractMore} ${dynamicLabels.Contracts}.`}
                                          disabled={!Object.keys(selectedRows).length}
                                          intent='table'
                                          onChange={handleMoreOptions}
                                          isSingleClickOption
                                          style={{ zIndex: '99' }}
                                          tooltipProps={{
                                            arrowPlacement: 'center',
                                            messagePlacement: 'start',
                                            tooltipDirection: 'bottom'
                                          }}
                                        />
                                      ) :
                                        (
                                          buttonKey !== 'InlineEdit' && <Tooltip message={buttonKey === 'update' ? `${dynamicLabels.contractUpdate} ${dynamicLabels.Contracts}.` : `${actionBarButtons[buttonKey].label} `}
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
                                                sendGA('contract button action', 'Contract List View ' + `contract - ${actionBarButtons[buttonKey].label}`);
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
                <EmptyData message={dynamicLabels.noContractAddedYet} imgSrc='https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-images/group-15-copy-23x.png' />
                <Box display='flex' justifyContent='center' fullWidth>
                  <Tooltip message={`${dynamicLabels.clickToAlternateContacts} ${dynamicLabels.Contracts}`} hover={true}>
                    <IconButton
                      primary
                      iconVariant='icomoon-add'
                      onClick={handleAddContract}
                    >
                      {dynamicLabels[pageLabels?.buttons.add] || dynamicLabels.add} {dynamicLabels.Contracts}
                    </IconButton>
                  </Tooltip>
                </Box>
              </div>
            </NoDataWrapper>}
        </StyledGrid>


        {/* ACTIVATION CONFIRMATION MODAL */}
        <Modal open={!!contractActivationRequest} onToggle={() => { }} size='md'>
          {{
            header: <ModalHeader
              headerTitle={dynamicLabels?.statusConfirmation}
              imageVariant='icomoon-close'
              handleClose={() => {
                contractActivationRequest?.failureCallback && contractActivationRequest?.failureCallback(!contractActivationRequest.activeRequest)
                setContractActivationRequest(undefined)
              }}
            />,

            content: (
              <>
                <div style={{ fontSize: '14px' }}>{contractActivationRequest?.activeRequest ? dynamicLabels.areYouSureYouWantToMarkAsAcitve : dynamicLabels.areYouSureYouWantToMarkAsInactive}</div><br></br>

              </>),
            footer: (
              <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                <IconButton iconVariant='icomoon-tick-circled' primary onClick={handleContractActiavtion}>{dynamicLabels.ok}</IconButton>
                <IconButton iconVariant='icomoon-close' iconSize={11}
                  onClick={() => {
                    contractActivationRequest?.failureCallback && contractActivationRequest?.failureCallback(!contractActivationRequest.activeRequest)
                    setContractActivationRequest(undefined)
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

        {/* CONTRACT UPLOAD MODAL */}
        <UploadExcel
          isOpen={showUploadPopup}
          featureName='contract'
          onSuccess={() => {
            setShowUploadPopup(false);
            handleFetchData(fetchOptions);
          }}
          onClose={() => setShowUploadPopup(false)}
        />

        {/* BRANCH POPUP */}
        <Modal
          open={showBranchPopup}
          onToggle={value => {
            setShowBranchPopup(value);
          }}
          width='600px'
          children={{
            header: (
              <ModalHeader
                headerTitle={dynamicLabels.servicablebranches}
                handleClose={() => setShowBranchPopup(false)}
                imageVariant='icomoon-close'
                headerStyle={{ fontSize: '15px' }}
              />
            ),
            content: (
              <BranchAccordion data={branchPopup} />
            ),
            footer: (
              <>
                <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>

                  <IconButton iconVariant='icomoon-close' iconSize={11} onClick={() => setShowBranchPopup(false)}>
                    {dynamicLabels.cancel}
                  </IconButton>
                </Box>
              </>
            ),
          }}
        />

      </Box>


    </>
  )
}

export default withThemeProvider(withToastProvider(withRedux(withPopup(ContractListView)), 'toast-inject-here'));
