import React, { useEffect, Dispatch, useState } from 'react'
import { useDispatch } from 'react-redux'
import { SortingRule, ColumnInstance } from 'react-table'
import {
  Card, Box, ListView, IListViewColumn, IFetchDataOptions,
  Modal, ModalHeader, IconButton,
  useToast, ISelectedRows,
  ButtonGroup, Grid, BreadCrumb, IconDropdown, IFilterOptions
} from 'ui-library'
import FileSaver from 'file-saver'
// import ReactTooltip from 'react-tooltip'
import { ReactTooltipCustom as ReactTooltip } from '../../../utils/layouts/ReactTooltipCustom'

import { DriverListViewActions, ISetViewMode } from './DriverListView.actions'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import { transformMongoListViewToColumns } from '../../../utils/mongo/ListView'
import axios from '../../../utils/axios'
import apiMappings from '../../../utils/apiMapping'
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels'
import { IDriverListData, ILoadingObject, IRowData } from './DriverListView.models'
import { hybridRouteTo } from '../../../utils/hybridRouting'
import iconsMapping from '../../../utils/mongo/ListView/actionBarIcons.mapping'
import UploadExcel from '../../../utils/wrapper/uploadExcel'
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping'
import { sendGA } from '../../../utils/ga'
// import { useGlobalPopup } from '../../common/GlobalPopup/useGlobalPopup'
import withReact from '../../../utils/components/withReact'
import DeleteConfirmationModal from '../../../utils/components/DeleteConfirmationModal'
import { throwError, validateRows } from '../../common/InlineEdit/InlineEdit'

import { getQueryParams } from '../../../utils/hybridRouting';
import { IStateService } from 'angular-ui-router';
import { handleCustomColumnSort } from '../../../utils/helper'
import moment from 'moment'
import { IMongoListViewStructure } from '../../../utils/mongo/interfaces'
import { dummyResult } from '../../Order/OrderListView/OrderListView.reducer'
// import { withThemeProvider } from '../../../utils/theme';
// import withRedux from '../../../utils/redux/withRedux';

interface IDriverListViewViewProps {
  ngStateRouter: IStateService
}

/** By default: Dont Reload, Or notify change or Inherit existing Parameters from URL */
const ngStateRouterOptions = { notify: false, reload: false, inherit: false, location: true }

const DriverListView = ({ ngStateRouter }: IDriverListViewViewProps) => {
  /** General Hooks */
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.driver)
  // const globalPopup = useGlobalPopup()
  const toast = useToast()

  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<DriverListViewActions>>()
  const pageLabels = useTypedSelector(state => state.pageLabels.driver)
  const viewMode = useTypedSelector(state => state.driver.listView.viewMode)
  const editDetails = useTypedSelector(state => state.driver.listView.editDetails)

  /** State */
  const [columns, setColumns] = useState<IListViewColumn[]>([])
  const [showDeletionConfirmation, setShowDeletionConfirmation] = useState<boolean>(false)
  const [driverActivationRequest, setDriverActivationRequest] = useState<{ activeRequest: boolean, driverIds: Record<number, boolean>, failureCallback?: React.Dispatch<React.SetStateAction<boolean>> } | undefined>()
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({})
  const [isEditMode, setEditMode] = useState<boolean>(false)
  const [showUploadPopup, setShowUploadPopup] = useState<boolean>(false)
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({})
  const [vehicleTypes, setVehicleTypes] = useState<any>({})
  const [isDownloadReportDisabled, setDownloadReportDisabled] = useState<boolean>(false)

  // ---------------------------------------------------------------------------------------------------------
  const [filters, setFilters] = useState<Record<string, string>>()
  const [sort, setSort] = useState<SortingRule<object>[]>()

  const [structure, setStructure] = useState<IMongoListViewStructure>({columns:{}, buttons: {}})
  const [loadingObject, setLoading] = useState<ILoadingObject>({loading : true, inputVal: false})
  const [listData, setListData] = useState<IDriverListData>()
  const columnsSelector = structure?.columns;
  const actionBarButtons =structure?.buttons;
  const rowsSelector = listData?.results || dummyResult;
  const totalRowsSelector = listData?.totalCount
  const inputVal = loadingObject.inputVal

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
    { id: 'driver', label: dynamicLabels.drivers, disabled: true },
  ], [pageLabels, dynamicLabels])

  const MoreButtonOptionList = React.useMemo(() => [
    { value: 'absent', label: 'Mark As Absent' },
    { value: 'present', label: 'Mark As Present' },
    { value: 'active', label: 'Mark As Active' },
    { value: 'inactive', label: 'Mark As Inactive' }
  ], [dynamicLabels])

  const fetchStructure = async () => {
    try {
      const { data } = await axios.get(apiMappings.driver.listView.structure)
      setStructure(data)
      dispatch({type: '@@driverListView/SET_STRUCTURE', payload: data})
    }catch(e){
       console.log(e);
    }

  }

  const fetchVehicleTypes = async () => {
    try {
      const { data: { message, status, data } } = await axios.get(apiMappings.driver.listView.unassignedVehicles)

      const types = {}
      data.forEach((unassignedVehicle: any) => {
        types[unassignedVehicle.name] = { 'name': unassignedVehicle.name, 'id': unassignedVehicle.id };
      })

      if (status === 200) {
        setVehicleTypes(types)
        return
      }
      throw message
    } catch (errorMessage) {
      console.log('Failed to fetch Vehicle Types: ', errorMessage)
      // toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, 'warning', false)
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
        ngStateRouter.go('Driver', newParams, ngStateRouterOptions)
      }, 100)
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
      temp["driverdata"] = localStorage.getItem('globalSearchText') || ""
    }

    setFilters(temp)
  }

  /** Watchers */
  useEffect(() => {
    handleQueryParams()
    if (Object.entries(columnsSelector).length === 0) {
      fetchStructure()
    }
    fetchVehicleTypes()

    return () => {
      if (window.location.hash.indexOf("#/driver/") < 0) {
        dispatch({ type: '@@driverListView/RESET_STATE' })
      }
    }
  }, [])

  useEffect(() => {
    const mongoStructure = columnsSelector

    if (Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(mongoStructure, 'driver', cellCallbackMapping, 'driverId')
      setColumns(newColumns)
    }

  }, [columnsSelector])

  /** Cell Callbacks */
  const handleDriverActivation = async () => {
    if (!driverActivationRequest) {
      return
    }
    setDriverActivationRequest(undefined)


    if (Object.keys(driverActivationRequest.driverIds).length === 1) {
      const driverId = Number(Object.keys(driverActivationRequest.driverIds)[0])
      dispatch({
        type: '@@driverListView/UPDATE_DATA',
        payload: {
          driverId,
          isActiveFl: driverActivationRequest.activeRequest
        }
      })
    }
    try {
      const { data: { message, status } } = await axios.put(apiMappings.driver.listView.activationRequest,
        Object.keys(driverActivationRequest.driverIds)
          .map(id => ({
            driverId: Number(id),
            isActiveFl: driverActivationRequest.activeRequest
          }))
      )
      if (status === 200) {
        toast.add(message, 'check-round', false)
        handleFetchData(fetchOptions)
        setSelectedRows({})
        fetchOptions.apis?.resetSelection()
        return
      }
      throw message
    } catch (errorMessage) {
      driverActivationRequest.failureCallback && driverActivationRequest.failureCallback(!driverActivationRequest.activeRequest)
      toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false)
    }
  }
  const handleActiveFlChange = (isChecked: boolean, { driverId }: IRowData, failureCallback: React.Dispatch<React.SetStateAction<boolean>>) => {
    const driverIds = {
      [driverId]: true
    }
    setDriverActivationRequest({ activeRequest: isChecked, driverIds, failureCallback })
  }

  const handleAttendanceChange = async (isChecked: boolean, { driverId }: IRowData, setState: React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
      const { data: { message, status } } = await axios.put(apiMappings.driver.listView.attendance, [{ driverId, isPresent: isChecked }])
      if (status === 200) {
        toast.add(message, 'check-round', false)
        const status = !isChecked ? dynamicLabels.Absent : dynamicLabels.available
        dispatch({
          type: '@@driverListView/UPDATE_STATUS',
          payload: { driverId, status, custom: { isPresent: isChecked } }
        })
        return
      }
      throw message
    } catch (errorMessage) {
      toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false)
      setState(!isChecked)
    }
  }

  const handleDriverNameClick = (row: IRowData) => {
    console.log('Zoom In Map as Driver name is clicked. ', row)
  }

  const cellCallbackMapping = {
    driverName: handleDriverNameClick,
    isActiveFl: handleActiveFlChange,
    isPresent: handleAttendanceChange
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

  const handleSaveRows = async () => {
    sendGA('ListView ActionBar','Driver List View Button Click - Save - Inline Edit')
    const isValid = validateSelectedRows()
    let invalidVehicleNumber = false

    if (isValid) {
      const payload: Partial<IRowData>[] = []
      Object.values(selectedRows).forEach((row) => {
        if (editDetails[row.driverId]) {
          const obj: any = {
            driverId: row.driverId
          }
          Object.keys(columnsSelector).forEach((columnId) => {
            // console.log(columnId, columnsSelector?.[columnId]?.editable)
            if (columnsSelector?.[columnId]?.editable && !columnsSelector?.[columnId]?.customField) {

              obj[columnId] = editDetails?.[row.driverId]?.[columnId]?.value || row[columnId]
            }
          })
          // Object.keys(columnsSelector).forEach((columnId) => {
          //   if (editDetails?.[row.driverId]?.[columnId]) {
          //     obj[columnId] = editDetails[row.driverId]?.[columnId]?.value || row[columnId]
          //   }
          // })

          // console.log(obj, vehicleTypes)
          if (obj.vehicleNumber && vehicleTypes[obj.vehicleNumber]) {
            obj.defaultVehicle = vehicleTypes[obj.vehicleNumber].id;
          } else if (!obj.vehicleNumber) {
            obj.defaultVehicle = ''
          } else if (!vehicleTypes[obj.vehicleNumber]) {
            invalidVehicleNumber = true
          }

          obj.previousPhoneNumber = row.phoneNumber;
          payload.push(obj)
        }
      })

      if (invalidVehicleNumber) {
        toast.add(dynamicLabels.pleaseEnterValidVehicleNumber, 'warning', false)
        return
      }

      if (!payload.length) {
        handleCancelRows()
        return
      }

      try {
        const { data: { message, status } } = await axios.put(apiMappings.driver.listView.inlineUpdate, payload)
        if (status === 200) {
          handleFetchData(fetchOptions)
          setEditMode(false)
          fetchOptions.apis?.resetSelection()
          setSelectedRows({})
          dispatch({ type: '@@driverListView/CLEAR_EDIT_DETAILS' })
          toast.add(message, 'check-round', false)
          return
        }
        throw message
      } catch (errorMessage) {
        const message = errorMessage?.response?.data?.message
        toast.add(message || dynamicLabels.somethingWendWrong, 'warning', false)
      }
    }
  }

  const handleCancelRows = React.useCallback(() => {
    sendGA('ListView ActionBar','Driver List View Button Click - Cancel - Inline Edit')
    dispatch({ type: '@@driverListView/CLEAR_EDIT_DETAILS' })
    setEditMode(false)
    fetchOptions.apis?.resetSelection()
    setSelectedRows({})
  }, [fetchOptions])

  /** Delete Request */
  const deleteSelectedRows = async () => {
    setShowDeletionConfirmation(false)
    try {
      const { data: { message, status } } = await axios.delete(apiMappings.driver.listView.deleteRequest,
        {
          data: Object.values(selectedRows).map(row => Number(row.driverId))
        })
      if (status === 200) {
        toast.add(message, 'check-round', false)
        setSelectedRows({})
        fetchOptions.apis?.resetSelection()
        handleFetchData(fetchOptions)
        return
      }
      throw message
    } catch (errorMessage) {
      console.log('Failed to Delete drivers: ', errorMessage)
      toast.add(dynamicLabels.somethingWendWrong, 'warning', false)
    }
  }

  const handleMoreOptions = React.useCallback(async (id: string) => {
    const selectedRowValues = Object.values(selectedRows)
    switch (id) {
      case 'absent':
      case 'present':
        {
          /** Validate for Inactive Rows */
          const hasInactiveRows = selectedRowValues.some(row => !row.isActiveFl)
          if (hasInactiveRows) {
            toast.add(dynamicLabels?.youCannotMarkToInactiveDriver, 'warning', false)
            return
          }

          /** Validate for marking already Absent or Present drivers */
          const hasInvalidRequest = selectedRowValues.some(row => {
            if ((id === 'absent' && !row.isPresent) || (id === 'present' && row.isPresent)) {
              return true
            }
            return false
          })

          if (hasInvalidRequest) {
            toast.add(dynamicLabels?.[id === 'present' ? 'driverAlreadyPresent' : 'driverAlreadyAbsent'], 'warning', false)
            return
          }

          /** Process Marking Absent/ Present */
          try {
            const { data: { message, status } } = await axios.put(apiMappings.driver.listView.attendance, selectedRowValues.map(({ driverId }) => ({ driverId, isPresent: id === 'present', isActiveFl: true })))
            if (status === 200) {
              toast.add(message, 'check-round', false)
              setSelectedRows({})
              fetchOptions.apis?.resetSelection()
              handleFetchData(fetchOptions)
              return
            }
            throw message
          } catch (errorMessage) {
            toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, 'warning', false)
          }
          break
        }

      case 'inactive':
      case 'active':
        {
          /** Validate for marking already Active or Inactive drivers */
          const hasInvalidRequest = selectedRowValues.some(row => {
            if ((id === 'inactive' && !row.isActiveFl) || (id === 'active' && row.isActiveFl)) {
              return true
            }
            return false
          })

          if (hasInvalidRequest) {
            toast.add(dynamicLabels?.[id === 'active' ? 'driverAlreadyActive' : 'driverAlreadyInActive'], 'warning', false)
            return
          }

          const driverIds = {}
          selectedRowValues.forEach(row => driverIds[row.driverId] = true)
          setDriverActivationRequest({
            activeRequest: id === 'active',
            driverIds,
          })
        }
        break
    }
  }, [selectedRows, dynamicLabels])

  const getListData = React.useCallback(async (payload) => {
    try{
     const { data } = await axios.get(apiMappings.driver.listView.data, {params: payload})
     if(data.status == 200){
     setListData(data.data)
    setLoading({loading: false, inputVal: false})
     }
    }catch(error){
     console.log(error)
     setLoading({loading: false, inputVal: false})
    }
},[])



  /** List View Callbacks */
  const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {
    if (!inputVal || sortOptions?.sortOrder) {
      sortOptions = handleCustomColumnSort(sortOptions)
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
    }
  }, [])

  const onRowSelect = React.useCallback((s: ISelectedRows) => {
    setSelectedRows(s)
  }, [])

  const onSortChange = React.useCallback(() => { }, [])

  const handleActionBarButtonClick = React.useCallback((id: string) => {
    switch (id) {
      case 'delete':
        setShowDeletionConfirmation(true)
        break

      case 'update':
        setEditMode(true)
        break

      case 'more':
        break

    }
  }, [])

  const handleDownloadReport = async () => {
    sendGA('ListView ActionBar','Driver List View Button Click - Download Report')
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
      console.log('Download Driver  Start', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
      const { data } = await axios.get(apiMappings.driver.listView.driverExcelDownload, {
        params: payload,
        responseType: 'arraybuffer'
      })
      console.log('Download Driver Complete', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
      FileSaver.saveAs(new Blob([data], { type: "application/vnd.ms-excel xlsx" }), `${dynamicLabels.DriverReport}.xlsx`)
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
      const { data: { message } } = await axios.put(apiMappings.driver.listView.structure, payload)
      message && toast.add(message, 'check-round', false)
    } catch (error) {
      console.log(error, error?.response)
    }


  }, [columnsSelector])

  return (
    <>
      {/* <div id='toast-inject-here'></div> */}
      <Box display='flex' flexDirection='column' style={{ width: '100%', height: 'calc(100vh - 64px)', marginTop: '64px' }} px='15px' pb='15px'>
        {/* Header */}
        <Box display='flex' justifyContent='space-between' style={{ width: '100%' }} py='15px'>
          {/* <div title='breadcrumbs' className='cursor'>Bread crumbs come here</div> */}
          <BreadCrumb options={breadCrumbOptions} onClick={() => { }} />

          {/* Page Action Buttons */}
          <Box display='flex' justifyContent='space-evenly' horizontalSpacing='10px'>
            {pageLabels?.buttons.add &&
              <>
                <IconButton
                  id="driver--actionbar--add"
                  intent='page'
                  data-tip
                  data-for='tt_AddDriver'
                  iconVariant='icomoon-add'
                  onClick={() => {
                    sendGA('Navigation','Driver List View Button Click - Add Driver')
                    hybridRouteTo('adddriver')
                  }}>
                  {dynamicLabels[pageLabels?.buttons.add] || dynamicLabels.add}
                </IconButton>
                <ReactTooltip id='tt_AddDriver' type='info' effect='solid' place='bottom'>
                  {`${dynamicLabels.add} ${dynamicLabels.Resources}`}
                </ReactTooltip>
              </>}



            {pageLabels?.buttons.upload &&
              <>
                <IconButton
                  id="driver--actionbar--upload"
                  data-tip={`${dynamicLabels.clickHereToUploadNew} ${dynamicLabels.Resources}`}
                  data-place='bottom'
                  // data-offset="{'top': 10, 'left': 10}"
                  data-for='tt_UploadDriver'
                  intent='page'
                  style={{ marginRight: 0 }}
                  iconVariant='icomoon-upload' onClick={() => {
                    sendGA('Excel Upload','Driver List View Button Click - Upload')
                    setShowUploadPopup(true)
                  }}>
                  {dynamicLabels[pageLabels?.buttons.upload] || dynamicLabels.Upload}
                </IconButton>
                <ReactTooltip
                  id='tt_UploadDriver'
                  type='info'
                  effect='solid'
                  place='bottom'
                  multiline>
                  <div style={{ maxWidth: '100px', lineHeight: '20px', textAlign: 'center' }}>
                    {`${dynamicLabels.clickHereToUploadNew} ${dynamicLabels.Resources}`}
                  </div>
                </ReactTooltip>
              </>
            }

            {ButtonGroupData.length > 0 &&
              <ButtonGroup data={ButtonGroupData} onChange={(id) => dispatch({ type: '@@driverListView/SET_VIEW_MODE', payload: id } as ISetViewMode)} />}
          </Box>
        </Box>

        {/* LIST VIEW CONTAINER */}
        <Grid container spacing={5} style={{ flexGrow: 1, overflow: 'hidden', width: '100%', boxShadow: viewMode === 'listview' ? '0 2px 20px -10px #000' : '' }}>
          <Grid item md={viewMode === 'listview' ? 12 : 4} style={{ display: 'flex', overflow: 'hidden' }}>
            <Card style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', paddingRight: 0, paddingBottom: 0 }}>
              {columns.length > 0 &&
                <ListView
                  rowIdentifier='driverId'
                  style={{ height: '100%', overflow: 'visible' }}
                  columns={columns}
                  data={rowsSelector}
                  onFetchData={handleFetchData}
                  hasRowSelection={viewMode === 'listview' && !actionBarButtons?.['InlineEdit']?.permission}
                  hasRowSelectionWithEdit={viewMode === 'listview' && actionBarButtons?.['InlineEdit']?.permission}
                  onRowSelect={onRowSelect}
                  onSortChange={onSortChange}
                  onSaveColumnPreferences={onSaveColumnPreferences}
                  totalRows={totalRowsSelector}
                  loading={loadingObject.loading}
                  hideRefresh={loadingObject.loading}
                  isEditMode={isEditMode}
                  onRowEditClick={(row) => {
                    sendGA('Navigation','Driver List View Button Click - Edit Driver')
                    hybridRouteTo(`updatedriver/?driverid=${row.driverId}`)
                  }}
                  filters = {filters}
                  sorts = {sort}
                  onFilterChange={handleFilterChange}
                >
                  {viewMode === 'listview' ? {
                    IconBar:
                      <Box>
                        <IconButton disabled={isDownloadReportDisabled} id="driver--actionbar--download" iconVariant='icomoon-download' iconSize={16} onlyIcon style={{ color: 'inherit' }} onClick={handleDownloadReport} />
                      </Box>,
                    ActionBar:
                      <Box display='flex' horizontalSpacing='10px'>

                        {isEditMode ?
                          <>
                            <div title={dynamicLabels.save}>
                              <IconButton intent='table' id='listView-actionBar-save' iconVariant='icomoon-save' onClick={handleSaveRows} disabled={!Object.keys(selectedRows).length}>{dynamicLabels.save}</IconButton>
                            </div>
                            <div title={dynamicLabels.cancel}>
                              <IconButton intent='table' id='listView-actionBar-cancel' iconVariant='icomoon-close' onClick={handleCancelRows} disabled={!Object.keys(selectedRows).length}>{dynamicLabels.cancel}</IconButton>
                            </div>
                          </>
                          :
                          Object.keys(actionBarButtons).map(buttonKey => actionBarButtons[buttonKey].permission &&
                            (buttonKey === 'more' ?
                              <div title={actionBarButtons[buttonKey].label}>
                                <IconDropdown
                                  id={`driver--actionbar--${buttonKey}`}
                                  key={buttonKey}
                                  variant={'button-dropdown'}
                                  optionList={MoreButtonOptionList}
                                  width='120px'
                                  iconButtonDetails={[
                                    'icomoon-funnel-options',
                                    actionBarButtons[buttonKey].label,
                                    'icomoon-angle-bottom'
                                  ]}
                                  disabled={!Object.keys(selectedRows).length}
                                  intent='table'
                                  onChange={handleMoreOptions}
                                  isSingleClickOption

                                />
                              </div>
                              :
                              (buttonKey !== 'InlineEdit' && <div title={actionBarButtons[buttonKey].label}>
                                <IconButton
                                  key={buttonKey}
                                  disabled={!Object.keys(selectedRows).length}
                                  intent='table'
                                  iconVariant={iconsMapping[buttonKey]}
                                  id={`listView-actionBar-${buttonKey}`}
                                  onClick={() => {
                                    sendGA('Navigation','Button Click - ' + actionBarButtons[buttonKey].label)
                                    handleActionBarButtonClick(buttonKey)
                                  }}
                                // title={actionBarButtons[buttonKey].label}
                                >
                                  {actionBarButtons[buttonKey].label}
                                </IconButton>
                              </div>))
                          )
                        }
                      </Box>
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

      {/* DELETE CONFIRMATION MODAL */}
      <DeleteConfirmationModal
        showDeletionConfirmation={showDeletionConfirmation}
        setShowDeletionConfirmation={(value: boolean) => setShowDeletionConfirmation(value)}
        deleteSelectedRows={deleteSelectedRows}
      />

      {/* ACTIVATION CONFIRMATION MODAL */}
      <Modal open={!!driverActivationRequest} onToggle={() => { }} size='md'>
        {{
          header: <ModalHeader
            headerTitle={dynamicLabels?.statusConfirmation}
            imageVariant='icomoon-close'
            handleClose={() => {
              driverActivationRequest?.failureCallback && driverActivationRequest?.failureCallback(!driverActivationRequest.activeRequest)
              setDriverActivationRequest(undefined)
            }}
          />,

          content: (
            <>
              <div style={{ fontSize: '14px' }}>{driverActivationRequest?.activeRequest ? dynamicLabels.areYouSureYouWantToMarkAsAcitve : dynamicLabels.areYouSureYouWantToMarkAsInactive}</div>
            </>),
          footer: (
            <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
              <IconButton id={`driver-${driverActivationRequest?.activeRequest ? 'Active' : 'InActive'}-Modal-Ok`} iconVariant='icomoon-tick-circled' primary onClick={handleDriverActivation}>{dynamicLabels.ok}</IconButton>
              <IconButton id={`driver-${driverActivationRequest?.activeRequest ? 'Active' : 'InActive'}-Modal-Cancel`} iconVariant='icomoon-close' iconSize={11}
                onClick={() => {
                  driverActivationRequest?.failureCallback && driverActivationRequest?.failureCallback(!driverActivationRequest.activeRequest)
                  setDriverActivationRequest(undefined)
                }}>
                {dynamicLabels.cancel}
              </IconButton>
            </Box>
          )
        }}
      </Modal>
      <UploadExcel
        isOpen={showUploadPopup}
        featureName='driver'
        onSuccess={() => {
          setShowUploadPopup(false)
          handleFetchData(fetchOptions)
        }}
        onClose={() => setShowUploadPopup(false)} />
    </>
  )
}

// export default withThemeProvider(withToastProvider(withRedux(withPopup(DriverListView)), 'toast-inject-here'));
export default withReact(DriverListView)