import React, { Dispatch, useEffect, useState } from 'react';
import {
  withPopup,
  withToastProvider,
  Box,
  BreadCrumb,
  DateRangePicker,
  TextInput,
  IFetchDataOptions,
  Card,
  ListView,
  IListViewColumn,
  useToast,
  Modal,
  ModalHeader,
  IconButton,
  InputField,
  IMultiSelectOptions,
  Grid,
  Tooltip
} from "ui-library";
import { withThemeProvider } from '../../utils/theme';
import withRedux from "../../utils/redux/withRedux";
import useDynamicLabels from '../common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../common/DynamicLabels/dynamicLabels.mapping';
import moment from 'moment';
import useClientProperties from '../common/ClientProperties/useClientProperties';
import { AlertsHistoryActions } from './AlertsHistory.actions';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../utils/redux/rootReducer';
import { transformMongoListViewToColumns } from '../../utils/mongo/ListView';
import axios from '../../utils/axios';
import apiMappings from '../../utils/apiMapping';
import { ColumnInstance } from 'react-table';
import { hybridRouteTo } from '../../utils/hybridRouting';
import { IAlertName, IOrderStatusLabels, IRowData, IVehicleType } from './AlertsHistory.models';
import FileSaver from 'file-saver';
import DownloadMessage from '../../utils/components/DownloadMessage';
import {
  ButtonWrapper,
  FilterAppliedTag, FilterAppliedTagButtonWrapper, FilterAppliedTagLabel,
} from '../OrderRequest/OrderRequestListView/StyledOrderRequestListView'
import { AdvancedFilterComponentActions } from '../common/AdvancedFilterComponent/AdvancedFilterComponent.actions'
import AdvancedFilterComponent from '../common/AdvancedFilterComponent'
import { AdvancedFilterLabel, AppliedFilterStrip, StyledGrid } from './AlertsHistoryStyledComponents';
import { sendGA } from '../../utils/ga';
import { IFilters } from '../common/AdvancedSearch/interface';
// import _ from 'lodash';

// custom hook
// const usePrevious = (data: any) => {
//   const ref = React.useRef();
//   React.useEffect(() => {
//     ref.current = data
//   }, [data])
//   return ref.current
// }

const AlertsHistory = () => {

  const d = new Date();
  // const username = JSON.parse(localStorage.getItem('userAccessInfo') || '{}').userName;
  // const userId = JSON.parse(localStorage.getItem('userAccessInfo') || '{}').userId;

  // Redux hooks
  const dispatch = useDispatch<Dispatch<AlertsHistoryActions>>();
  const advanceFilterdispatch = useDispatch<Dispatch<AdvancedFilterComponentActions>>();
  const toast = useToast();
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.alert);
  const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT']);
  const structure = useTypedSelector(state => state.alertsHistory.structure);
  const columnsSelector = useTypedSelector(state => state.alertsHistory.structure.columns);
  const rowsSelector = useTypedSelector(state => state.alertsHistory.data.results);
  const totalRowsSelector = useTypedSelector(state => state.alertsHistory.data.totalCount);
  // const loading = useTypedSelector(state => state.alertsHistory.loading);
  const rowsLoading = useTypedSelector(state => state.alertsHistory.listLoading.rows);
  const columnsLoading = useTypedSelector(state => state.alertsHistory.listLoading.columns);
  const advancedFilterData = useTypedSelector(state => state.advanceFilter.advancedFilterData)
  const [isFilterDataCalled, setIsFilterDataCalled] = useState<boolean>(false);
  // const statusMap = useTypedSelector(state => state.alertsHistory.statusMap);

  // state
  const [selectedDates, setSelectedDates] = useState<any>({
    startDate: moment(Date()).subtract(7, 'days').format("YYYY-MM-DD"),
    endDate: moment(Date()).format("YYYY-MM-DD"),
  });
  const [minDate, setMinDate] = useState<any>(new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7));
  const [maxDate, setMaxDate] = useState<any>(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
  const [columns, setColumns] = useState<IListViewColumn[]>([]);
  const [isResolvedChangeRequest, SetIsResolvedChangeRequest] = useState<{ activeRequest: boolean, alertIds: Record<number, boolean>, failureCallback?: React.Dispatch<React.SetStateAction<boolean>> } | undefined>()
  const [notesRequest, SetNotesRequest] = useState<{ activeRequest: boolean, row: IRowData | undefined, failureCallback?: React.Dispatch<React.SetStateAction<boolean>> } | undefined>()
  const [notesValue, setNotesValue] = useState<string | undefined>(undefined);
  const [downloadReportDisabled, setDownloadReportDisabled] = useState<boolean>(false);
  const [saveNotesDisabled, setSaveNotesDisabled] = useState<boolean>(true);
  const [showDownloadMessage, setShowDownloadMessage] = useState<boolean>(false);
  const [dropdownOptions, setDropdownOptions] = useState<Record<string, IMultiSelectOptions[]>>({});
  const [isGlobalDateOpen, setIsGlobalDateOpen] = useState<boolean>(false);
  const filterListPayload = useTypedSelector(state => state.advanceFilter.filterListPayload)
  const currentFilter = useTypedSelector(state => state.advanceFilter.currentFilter)
  const openAdvFilter = useTypedSelector(state => state.advanceFilter.openAdvFilter)
  const [appliedAdvancedFilterData, setAppliedAdvancedFilterData] = useState<IFilters[]>([]);


  const statusCodes = {
    STARTED: dynamicLabels['STARTED'],
    NOTSTARTED: dynamicLabels['NOTSTARTED'],
    DELIVERED: dynamicLabels['DELIVERED'],
    NOTDELIVERED: dynamicLabels['NOTDELIVERED'],
    INTRANSIT: dynamicLabels['INTRANSIT'],
    ENDED: dynamicLabels['ENDED'],
    NOTDISPATCHED: dynamicLabels['NOTDISPATCHED'],
    ARRIVED: dynamicLabels['ARRIVED'],
    PICKEDUP: dynamicLabels['PICKEDUP'],
    NOTPICKEDUP: dynamicLabels['NOTPICKEDUP'],
    CANCELLED: dynamicLabels['CANCELLED']
  }
  const AdvanceFilterData = {
    sectionName: 'alertsHistory'
  }

  // const prevSelectedDates = usePrevious(selectedDates);


  // Reading state form store

  const handleOpenAdvancedFilter = () => {
    advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: !openAdvFilter });
  }
  // Helper functions
  const handleDateChange = (date: Date | null | [Date, Date]) => {
    if (date) {
      sendGA('Event New', 'alertHistory - apply date range');
      let startDate = moment(date[0]).format("YYYY-MM-DD");
      let endDate = moment(date[1]).format("YYYY-MM-DD");
      var dateDiff = moment(date[1]).diff(moment(date[0]), 'days');
      if (dateDiff && dateDiff > 31) {
        toast.add(dynamicLabels.check31Days ? dynamicLabels.check31Days : 'Please select a maximum of 31 days to proceed.', 'warning', false);
      } else {
        setSelectedDates({ startDate: startDate, endDate: endDate });
        setMinDate(new Date(date[0].getFullYear(), date[0].getMonth(), date[0].getDate()));
        setMaxDate(new Date(date[1].getFullYear(), date[1].getMonth(), date[1].getDate()));
      }
    }
  };


  const getFormattedDate = (date: Date) => {
    return moment(date).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())
  };

  const handleNotesChange = (ele: React.ChangeEvent<HTMLInputElement>) => {
    if (ele.target.value && notesRequest?.row?.notes !== ele.target.value) {
      setSaveNotesDisabled(false);
    } else {
      setSaveNotesDisabled(true);
    }
    setNotesValue(ele.target.value);
  }

  const handleDownloadReport = async () => {
    setDownloadReportDisabled(true);
    setShowDownloadMessage(true);

    const payload = {
      pageNumber: fetchOptions.pageNumber,
      pageSize: fetchOptions.pageSize,
      searchBy: fetchOptions.filterOptions?.searchBy,
      searchText: fetchOptions.filterOptions?.searchText,
      sortBy: fetchOptions.sortOptions?.sortBy,
      sortOrder: fetchOptions.sortOptions?.sortOrder,
      endDateFilter: moment(selectedDates.endDate).endOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
      startDateFilter: moment(selectedDates.startDate).startOf('day').utc().format('YYYY-MM-DD HH:mm:ss')
    }
    sendGA('Event New', 'alertHistory - Download');

    try {
      const { data } = await axios.post(apiMappings.alertsHistory.downloadReport, appliedAdvancedFilterData, { params: payload, responseType: 'arraybuffer' })

      FileSaver.saveAs(new Blob([data], { type: "application/vnd.ms-excel xlsx" }), `${dynamicLabels.AlertsReport || "Alerts Report"}.xlsx`)
      setDownloadReportDisabled(false);
    } catch {
      toast.add(dynamicLabels.somethingWendWrong, 'warning', false);
      setDownloadReportDisabled(false);
    }
  }

  const getDropdownOptions = async () => {
    setDropdownOptions({
      ...dropdownOptions,
      isResolved: [
        { value: 'Y', label: dynamicLabels.closed, fieldType: "dropdown" },
        { value: 'N', label: dynamicLabels.open, fieldType: "dropdown" }
      ]
    });

    const { data: names } = await axios.get(apiMappings.alertsHistory.dropdownAlerts);
    dispatch({
      type: '@@alertsHistory/SET_DATA', payload: {
        key: 'name',
        value: names
      }
    })
    const alertNameOPtions = names?.map((name: IAlertName) => {
      name["label"] = name.name;
      name["value"] = name.shortName;
      name["fieldType"] = 'dropdown';
      return name;
    })

    const { data: statuses } = await axios.get(apiMappings.alertsHistory.getOrderStatus);
    dispatch({
      type: '@@alertsHistory/SET_DATA', payload: {
        key: 'orderStatus',
        value: statuses
      }
    })
    const orderStatusOptions = statuses?.map((name: IOrderStatusLabels) => {
      name["label"] = statusCodes?.[name.name];
      name["value"] = name?.clientRefMasterCd;
      name["fieldType"] = 'dropdown';
      return name;
    });

    const { data: types } = await axios.get(apiMappings.alertsHistory.getVehicleTypes);
    dispatch({
      type: '@@alertsHistory/SET_DATA', payload: {
        key: 'vehicleType',
        value: types
      }
    })
    const vehicleTypeOptions = types?.map((type: IVehicleType) => {
      type["label"] = type?.name;
      type["value"] = type?.clientRefMasterDesc;
      type["fieldType"] = 'dropdown';
      return type;
    });

    const { data: tripStatuses } = await axios.get(apiMappings.alertsHistory.getTripStatus);
    dispatch({
      type: '@@alertsHistory/SET_DATA', payload: {
        key: 'tripStatus',
        value: tripStatuses
      }
    })
    const tripStatusOptions = tripStatuses?.map((status: IOrderStatusLabels) => {
      status["label"] = status?.name;
      status["value"] = status?.clientRefMasterDesc;
      status["fieldType"] = 'dropdown';
      return status;
    });

    const { data: bodyTypes } = await axios.get(apiMappings.alertsHistory.getVehicleTypeOfBody);
    dispatch({
      type: '@@alertsHistory/SET_DATA', payload: {
        key: 'vehicleTypeOfBody',
        value: bodyTypes
      }
    })
    const vehicleTypeOfBodyOptions = bodyTypes?.map((bodyType: IVehicleType) => {
      bodyType["label"] = bodyType?.name;
      bodyType["value"] = bodyType?.clientRefMasterDesc;
      bodyType["fieldType"] = 'dropdown';
      return bodyType;
    });

    const { data: ownershipTypes } = await axios.get(apiMappings.alertsHistory.getOwnership);
    dispatch({
      type: '@@alertsHistory/SET_DATA', payload: {
        key: 'vehicleOwnership',
        value: ownershipTypes
      }
    })

    const vehicleOwnershipOptions = ownershipTypes?.map((ownershipType: IVehicleType) => {
      ownershipType["label"] = ownershipType?.name;
      ownershipType["value"] = ownershipType?.clientRefMasterDesc;
      ownershipType["fieldType"] = 'dropdown';
      return ownershipType;
    });

    setDropdownOptions({
      ...dropdownOptions,
      name: alertNameOPtions,
      orderStatus: orderStatusOptions,
      vehicleType: vehicleTypeOptions,
      tripStatus: tripStatusOptions,
      vehicleTypeOfBody: vehicleTypeOfBodyOptions,
      vehicleOwnership: vehicleOwnershipOptions
    });
  }

  // Cell Callbacks

  const handleIsResolved = async () => {
    if (!isResolvedChangeRequest) {
      SetIsResolvedChangeRequest(undefined);
      return
    }

    try {
      const { data: { message, status } } = await axios.post(apiMappings.alertsHistory.updateToggle,
        {
          alertId: Number(Object.keys(isResolvedChangeRequest.alertIds)[0]),
          isResolved: isResolvedChangeRequest.activeRequest
        }
      )
      SetIsResolvedChangeRequest(undefined)
      if (status === 200) {
        const alertId = Number(Object.keys(isResolvedChangeRequest.alertIds)?.[0])
        dispatch({
          type: '@@alertsHistory/UPDATE_DATA',
          payload: {
            alertId,
            isResolved: isResolvedChangeRequest.activeRequest
          }
        })
        toast.add(message, 'check-round', false)
        return
      }
      throw message
    } catch (errorMessage) {
      SetIsResolvedChangeRequest(undefined)
      isResolvedChangeRequest.failureCallback && isResolvedChangeRequest.failureCallback(!isResolvedChangeRequest.activeRequest)
      toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false)
    }
  }

  const handleIsResolvedFlChange = (isChecked: boolean, { alertId }: IRowData, failureCallback: React.Dispatch<React.SetStateAction<boolean>>) => {
    const alertIds = {
      [alertId]: true
    }
    SetIsResolvedChangeRequest({ activeRequest: isChecked, alertIds, failureCallback })
  }

  const handleNotes = async () => {
    if (!notesRequest || saveNotesDisabled) {
      SetNotesRequest(undefined);
      return
    }

    sendGA('Event New', 'alertHistory - save Notes');

    try {
      const { data: { message, status } } = await axios.post(apiMappings.alertsHistory.updateRemark,
        {
          alertId: Number(notesRequest?.row?.alertId),
          notes: notesValue
        }
      )
      SetNotesRequest(undefined);
      if (status === 200) {
        toast.add(message, 'check-round', false);
        const alertId = Number(notesRequest?.row?.alertId);
        dispatch({
          type: '@@alertsHistory/UPDATE_NOTES',
          payload: {
            alertId,
            notes: notesValue
          }
        })
        return
      }
      throw message
    } catch (errorMessage) {
      SetNotesRequest(undefined);
      notesRequest.failureCallback && notesRequest.failureCallback(!notesRequest.activeRequest)
      toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false)
    }
  }

  const openNotesModal = (row: IRowData, failureCallback: React.Dispatch<React.SetStateAction<boolean>>) => {
    SetNotesRequest({ activeRequest: true, row, failureCallback });
    setNotesValue(row?.notes);
  }

  const goToOrderDetails = (row: IRowData) => {
    sendGA('Event New', 'Orders - open order history');
    hybridRouteTo(`order/mileorderhistoryDetailsNew/details?shipment=${row.shipmentDetailsId}&lat=-${row.originLatitude}&lng=-${row.originLongitude}&ordno=${row.orderNo}&clientid=${row.branchId}&bc_key=allOrders`);
  }
  const cellCallbackMapping = {
    isResolved: handleIsResolvedFlChange,
    notes: openNotesModal,
    orderNo: goToOrderDetails
  }

  // hooks 
  // Breadcrumb
  const breadCrumbOptions = React.useMemo(() => [
    { id: 'alert', label: dynamicLabels.alertsHistory, disabled: true },
  ], [dynamicLabels]);

  // fetch alertsHistoryData
  const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {
    dispatch({
      type: '@@alertsHistory/SET_DATA',
      payload: {
        key: 'listLoading',
        value: {
          rows: true,
          columns: false
        }
      }
    })
    setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis })

    dispatch({
      type: '@@alertsHistory/FETCH_DATA',
      payload: {
        params: {
          pageNumber: pageNumber,
          pageSize: pageSize,
          searchBy: filterOptions?.searchBy,
          searchText: filterOptions?.searchText,
          sortBy: sortOptions?.sortBy,
          sortOrder: sortOptions?.sortOrder,
          endDateFilter: moment(selectedDates.endDate).endOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
          startDateFilter: moment(selectedDates.startDate).startOf('day').utc().format('YYYY-MM-DD HH:mm:ss')
        }
      }
    })
  }, [selectedDates, filterListPayload, appliedAdvancedFilterData])

  const onSortChange = React.useCallback(() => { }, []);

  const onShowMoreColumns = React.useCallback(() => {
    sendGA('Event New', 'alertsHistory - Show More Columns');
  }, []);

  const onSaveColumnPreferences = React.useCallback(async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
    const columnsPreferences = { ...columnsSelector }
    Object.keys(columnsPreferences).forEach((columnKey) => {
      columnsPreferences[columnKey].permission = !!visibleColumns[columnKey]
    })

    const payload = {
      ...structure,
      columnsPreferences
    }
    dispatch({
      type: '@@alertsHistory/SET_DATA',
      payload: {
        key: 'listLoading',
        value: {
          rows: false,
          columns: true
        }
      }
    })

    sendGA('Event New', 'alertsHistory - Save & Apply column preferences');

    try {
      const { data: { message } } = await axios.put(apiMappings.alertsHistory.getColumnsList, payload)
      message && toast.add(message, 'check-round', false)
      dispatch({
        type: '@@alertsHistory/SET_DATA',
        payload: {
          key: 'listLoading',
          value: {
            rows: false,
            columns: false
          }
        }
      })
    } catch (error) {
      dispatch({
        type: '@@alertsHistory/SET_DATA',
        payload: {
          key: 'listLoading',
          value: {
            rows: false,
            columns: false
          }
        }
      })
      console.log(error, error?.response)
    }


  }, [columnsSelector])

  const onApplyColumnPreferences = React.useCallback(() => {
    sendGA('Event New', 'alertsHistory - Apply column preferences');
  }, [])

  // on getStructure
  useEffect(() => {
    dispatch({ type: '@@alertsHistory/FETCH_STRUCTURE' });
    dispatch({
      type: '@@alertsHistory/SET_DATA', payload: {
        key: 'statusMap',
        value: statusCodes
      }
    })
    handleFetchFilters();
    getDropdownOptions();
    advanceFilterdispatch({ type: '@@advanceFilter/SET_FILTERLIST_PAYLOAD', payload: undefined });
    advanceFilterdispatch({ type: '@@advanceFilter/SET_CURRENT_FILTERS', payload: undefined });
    advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: false });
  }, [])

  // on date chage hook
  useEffect(() => {
  }, [selectedDates])

  // create column and data massaging
  useEffect(() => {
    const mongoStructure = columnsSelector;
    if (Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(mongoStructure, 'alertsHistory', cellCallbackMapping);
      setColumns(newColumns)
    }
    advanceFilterdispatch({ type: '@@advanceFilter/SET_COLUMNS_SELECTOR', payload: columnsSelector });
  }, [columnsSelector])


  // Handle fetch Filters
  const handleFetchFilters = async (callBackAdvanceFilter=false) => {
    try {
      if ((!isFilterDataCalled && ((advancedFilterData.length > 0 && advancedFilterData[0].sectionName != 'ALERTS_HISTORY_LIST_VIEW') || advancedFilterData?.length == 0)) || callBackAdvanceFilter) {
        setIsFilterDataCalled(true);
        const { data } = await axios.get(apiMappings.advancedSearch.getFilters, {
          params: {
            pageName: "ALERTS_HISTORY",
            sectionName: "ALERTS_HISTORY_LIST_VIEW"
          }
        });
        if (data) {
          setIsFilterDataCalled(false);
          const isFavouriteFilter = data.find((filter: { isFavourite: boolean; }) => filter?.isFavourite);
          if (isFavouriteFilter) {
            setAppliedAdvancedFilterData(isFavouriteFilter?.filters);
            advanceFilterdispatch({ type: '@@advanceFilter/SET_APPLIED_ADV_FILTER_DATA', payload: isFavouriteFilter?.filters });
          }
          advanceFilterdispatch({ type: '@@advanceFilter/SET_ADV_FILTER_DATA', payload: data });
        }
      }

      return;
    } catch (errorMessage) {
      toast.add(dynamicLabels?.FailedToMakeChangesToFilter || 'Failed to Make Changes to Filter. ', 'warning', false);
    }

  }

  // Handle Remove filters
  const handleRemoveFilter = (showToast: boolean) => {
    setAppliedAdvancedFilterData([])
    advanceFilterdispatch({ type: '@@advanceFilter/SET_FILTERLIST_PAYLOAD', payload: undefined });
    advanceFilterdispatch({ type: '@@advanceFilter/SET_CURRENT_FILTERS', payload: undefined });
    advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: false });
    showToast && toast.add(dynamicLabels?.filterRemovedSuccessfully, 'check-round', false);
  }

  // Advanced Filter

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        style={{ width: '100%', height: 'calc(100vh - 64px)', position: 'relative' }}
        p="1em"
        mt="64px"
      >
        {/* header content */}
        <Box display='flex' justifyContent='space-between' style={{ width: '100%' }} mb="15px">
          <div>
            <BreadCrumb options={breadCrumbOptions} onClick={() => { }} />
            {filterListPayload &&
              <Tooltip tooltipDirection='bottom' messagePlacement='center' hover message={
                <div style={{ textAlign: 'left', fontSize: 12 }}>
                  <Box mb='10px'>Filters are applied on {filterListPayload.operationLogic === 'AND' ? 'ALL' : 'ANY'} of the the following conditions:</Box>
                  {currentFilter && currentFilter?.filters && currentFilter?.filters.map((f: any, i) => {
                    return <Box mb='5px'>{`${i + 1}. ${f.fieldLabelKey} ${f?.labelValue || f?.operationLabelKey} ${f.filterDataLabel || f.filterData}`}</Box>
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
          <Tooltip message={`Choose a  date range  to display Alerts history during that time.`} hover={true} hide={isGlobalDateOpen} tooltipDirection="bottom" arrowPlacement="center" messagePlacement="end">
            <div className="global-date" style={{ marginRight: '0', width: 230, boxShadow: "0px 2px 11px -5px #000" }}>
              <DateRangePicker
                onApply={handleDateChange}
                variant="daterange"
                showTime={false}
                style={{
                  position: 'absolute',
                  right: '0px',
                }}
                startDate={minDate}
                endDate={maxDate}
                fromDateFormatter={getFormattedDate}
                toDateFormatter={getFormattedDate}
              >
                {({ value, open, setOpen }: any) => (
                  <div>
                    <div onClick={() => { setOpen(!open); setIsGlobalDateOpen(!open) }}>
                      <TextInput
                        id="someId"
                        //name={name}
                        className="someClassname"
                        variant="withIcon"
                        labelColor="text.inputLabel.default"
                        placeholder="Please Click Here"
                        fullWidth
                        value={`${moment(value[0]).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())} - ${moment(value[1]).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())}`}
                        onChange={() => 'On change clicked'}
                        iconVariant='calendar'
                        iconSize='xs'
                        iconStyle={{ padding: '7px 7px 7px 7px', cursor: "pointer", minWidth: "35px" }}
                        style={{
                          fontSize: '14px',
                          minHeight: '32px',
                          margin: 0,
                          border: 0
                        }}
                      />
                    </div>
                  </div>
                )}
              </DateRangePicker>
            </div>
          </Tooltip>
        </Box>
        {/* list view content */}
        <StyledGrid container spacing={15} style={{ boxShadow: '0 2px 20px -10px #000' }}>
          <Grid
            className='grid-customised-scroll-bar'
            item
            style={{ display: 'flex', overflow: 'hidden' }}
          >
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

            <Card style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', paddingRight: 0, paddingBottom: 0, minHeight: "400px", }}>
              {columns.length > 0 &&
                <ListView
                  rowIdentifier='alertId'
                  style={{ display:'flex', height: '100%', overflow: 'auto' }}
                  columns={columns}
                  data={rowsSelector}
                  onFetchData={handleFetchData}
                  onSortChange={onSortChange}
                  onSaveColumnPreferences={onSaveColumnPreferences}
                  onApply={onApplyColumnPreferences}
                  onShowMoreColumns={onShowMoreColumns}
                  totalRows={totalRowsSelector}
                  hasRowSelectionWithEdit={false}
                  hasRowSelection={false}
                  loading={rowsLoading}
                  isColumnLoading={columnsLoading}>
                  {{
                    IconBar:
                      <>
                        <Tooltip message={`${dynamicLabels.download} ${dynamicLabels?.alert} ${dynamicLabels.report}.`} hover={true} hide={downloadReportDisabled} tooltipDirection="bottom" arrowPlacement="center" messagePlacement="end">
                          <IconButton
                            id="alert_history--actionbar--download"
                            intent="page"
                            onlyIcon
                            primary={false}
                            iconVariant="icomoon-download"
                            onClick={handleDownloadReport}
                            iconSize={16}
                            className="alertsHitoryReportDownload"
                            disabled={downloadReportDisabled}
                            style={{ color: 'inherit' }}
                          />
                        </Tooltip>
                        <AdvancedFilterComponent
                          pageName='alert_history'
                          handleFetchFilters={handleFetchFilters}
                          handleRemoveFilter={(showToast: boolean) => handleRemoveFilter(showToast)}
                          handleFetchData={handleFetchData}
                          data={AdvanceFilterData}
                          needsFetchDataCall={false}
                        />

                      </>
                  }}
                </ListView>}
            </Card>
          </Grid>
        </StyledGrid>

        {/* status confirmation box */}
        <Modal open={!!isResolvedChangeRequest} onToggle={() => { }} size='md'>
          {{
            header: <ModalHeader
              headerTitle={dynamicLabels?.statusConfirmation}
              imageVariant='icomoon-close'
              handleClose={() => {
                isResolvedChangeRequest?.failureCallback && isResolvedChangeRequest.failureCallback(!isResolvedChangeRequest.activeRequest)
                SetIsResolvedChangeRequest(undefined)
              }}
            />,

            content: (
              <>
                <div style={{ fontSize: '14px' }}>{dynamicLabels.statusUpdateMsg || 'Are you sure you want to update the status?'}</div>
              </>),
            footer: (
              <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                <IconButton iconVariant='icomoon-tick-circled' primary onClick={handleIsResolved}>{dynamicLabels.ok}</IconButton>
                <IconButton iconVariant='icomoon-close' iconSize={11}
                  onClick={() => {
                    isResolvedChangeRequest?.failureCallback && isResolvedChangeRequest.failureCallback(!isResolvedChangeRequest.activeRequest);
                    SetIsResolvedChangeRequest(undefined);
                  }}>
                  {dynamicLabels.cancel}
                </IconButton>
              </Box>
            )
          }}
        </Modal>

        {/* Notes input model */}
        <Modal open={!!notesRequest} onToggle={() => { }} size='md'>
          {{
            header: <ModalHeader
              headerTitle={`${dynamicLabels?.orderNo} : ${notesRequest?.row?.orderNo ? notesRequest.row.orderNo : notesRequest?.row?.name} ${dynamicLabels?.comments}`}
              imageVariant='icomoon-close'
              handleClose={() => {
                notesRequest?.failureCallback && notesRequest.failureCallback(!notesRequest.activeRequest);
                SetNotesRequest(undefined);
              }}
            />,

            content: (
              <>
                <InputField type="text" style={{ width: "100%", margin: 0 }} placeholder={dynamicLabels.enterRemarks || "Enter your remarks (Max 200 characters)"} maxLength={200} value={notesValue} onChange={(value: React.ChangeEvent<HTMLInputElement>) => { handleNotesChange(value) }} />
              </>),
            footer: (
              <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                <IconButton iconVariant='icomoon-tick-circled' primary onClick={handleNotes}>{dynamicLabels.save}</IconButton>
                <IconButton iconVariant='icomoon-close' iconSize={11}
                  onClick={() => {
                    notesRequest?.failureCallback && notesRequest.failureCallback(!notesRequest.activeRequest);
                    SetNotesRequest(undefined);
                  }}>
                  {dynamicLabels.cancel}
                </IconButton>
              </Box>
            )
          }}
        </Modal>
        <DownloadMessage showInfoModal={showDownloadMessage} onToggle={(value) => setShowDownloadMessage(value)} />
      </Box>
    </>
  )
}

export default withThemeProvider(withToastProvider(withRedux(withPopup(AlertsHistory)), 'toast-inject-here'))
