import React, { useEffect, Dispatch, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ColumnInstance, SortingRule } from 'react-table';
import {
  Card,
  Box,
  IListViewColumn,
  IFetchDataOptions,
  withPopup,
  IconButton,
  withToastProvider,
  useToast,
  ISelectedRows,
  Grid,
  BreadCrumb,
  Tooltip,
  IFilterOptions
} from 'ui-library';

import { tDAListViewActions, ISetViewMode } from './DeliveryAssociate.actions';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import withRedux from '../../../utils/redux/withRedux';
import { transformMongoListViewToColumns } from '../../../utils/mongo/ListView';
import axios from '../../../utils/axios';
import apiMappings from '../../../utils/apiMapping';
import { withThemeProvider } from '../../../utils/theme';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import { IRowData, tMoreOption } from './DeliveryAssociate.models';
import { hybridRouteTo } from '../../../utils/hybridRouting';
import iconsMapping from '../../../utils/mongo/ListView/actionBarIcons.mapping';
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import ActivationConfirmation from './SubComponent/Popups/ActivationConfirmation';
import UpdateConfirmation from './SubComponent/Popups/UpdateConfirmation';
import ChangePassword from './SubComponent/Popups/ChangePassword';
import Notify from './SubComponent/Popups/Notify';
import PrintPage from './PrintPage';
import UploadExcel from '../../../utils/wrapper/uploadExcel';
import MoreOptionConfirmation from './MoreOptionConfirmation';
import LabelMapping from './LabelMapping';
import NetworkStatusComponent from './NetworkStatusComponent';
import BulkUpdate from './SubComponent/Popups/BulkUpdate';
import {
  StyledGrid,
  StyledButtonGroup, BreadCrumbTagWrapper,
} from './StyledDeliveryAssociate';
import { handlePrint } from './SubComponent/Hooks/PrintTable';
import ListViewComponent from './SubComponent/ListViewComponent';
import { handleActionBarButtonClick } from './DeliveryAssociateHelperMethods';
import { sendGA } from '../../../utils/ga'
import DeliveryAssociateMap from './DeliveryAssociateMap';
import { dummyData } from './DeliveryAssociate.reducer';
import DownloadModal from './SubComponent/Popups/DownloadModal';
import { handleCustomColumnSort, metricsConversion } from '../../../utils/helper';
import DeleteConfirmationModal from '../../../utils/components/DeleteConfirmationModal';
import InlineEditConfirmationModal from '../../../utils/components/InlineEditConfirmationModal';
import { AdvancedFilterComponentActions } from '../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions'
import {
  AdvancedFilterLabel, AppliedFilterStrip, ButtonWrapper,
  FilterAppliedTag, FilterAppliedTagButtonWrapper, FilterAppliedTagLabel,
} from '../../OrderRequest/OrderRequestListView/StyledOrderRequestListView'
import { throwError, validateRows } from '../../common/InlineEdit/InlineEdit';

//import { deepCopy } from '../../../utils/helper';
// ---------------------------------------------------------------------------------
import { getQueryParams } from '../../../utils/hybridRouting';
import { IStateService } from 'angular-ui-router';
import CompartmentListViewModal from '../../OnboardingWrapper/ModuleConfiguration/CompartmentConfiguration/Components/CompartmentListViewModal';
import { IHiredDMRouteFlagAction } from '../../common/GlobalRouteFlags/HiredDeliveryMediumRouteFlag.reducer';
import { NoDataWrapper } from '../../Vehicle/VehicleListView/VehicleListView.styled';
import EmptyData from '../../../utils/components/EmptyData';
interface IDeliveryAssociateListViewViewProps {
  ngStateRouter: IStateService
}

/** By default: Dont Reload, Or notify change or Inherit existing Parameters from URL */
const ngStateRouterOptions = { notify: false, reload: false, inherit: false, location: true }


const DeliveryAssociateListView = ({ ngStateRouter }: IDeliveryAssociateListViewViewProps) => {
  /** General Hooks */
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.deliveryMedium);

  const toast = useToast();

  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<tDAListViewActions>>();
  const advanceFilterdispatch = useDispatch<Dispatch<AdvancedFilterComponentActions>>();
  const globalRouteFlagDispatch = useDispatch<Dispatch<IHiredDMRouteFlagAction>>();
  // const deliveryMedium = useTypedSelector(state => state.deliveryMedium)
  const structure = useTypedSelector(state => state.deliveryMedium.listView.structure);
  const columnsSelector = useTypedSelector(state => state.deliveryMedium.listView.structure.columns);
  const rowsSelector = useTypedSelector(state => state.deliveryMedium.listView.data.results);
  const pageLabels = useTypedSelector(state => state.pageLabels.deliveryMedium);
  const viewMode = useTypedSelector(state => state.deliveryMedium.listView.viewMode);
  const editDetails = useTypedSelector(state => state.deliveryMedium.listView.editDetails);
  const branchList = useTypedSelector(state => state.deliveryMedium.listView.branchList);
  const deviceStatusLoading = useTypedSelector(state => state.deliveryMedium.listView.deviceStatusLoading);
  const actionBarButtons = useTypedSelector(state => state.deliveryMedium.listView.structure.buttons);
  const data = useTypedSelector(state => state.deliveryMedium.listView.data);
  // const clientId = useTypedSelector(state => state.deliveryMedium.listView.clientId);
  // const userId = useTypedSelector(state => state.deliveryMedium.listView.userId);

  const clientMetric = useTypedSelector(state => state.deliveryMedium.listView.clientMetric)
  const initailFetchDone = useTypedSelector(state => state.deliveryMedium.listView.initailFetchDone)
  const statusList = useTypedSelector(state => state.deliveryMedium.listView.statusList)
  const weeklyOff = useTypedSelector(state => state.deliveryMedium.listView.weeklyOff)
  const deliveryTypes = useTypedSelector(state => state.deliveryMedium.listView.deliveryTypes)
  const filterListPayload = useTypedSelector(state => state.advanceFilter.filterListPayload)
  const currentFilter = useTypedSelector(state => state.advanceFilter.currentFilter)
  const openAdvFilter = useTypedSelector(state => state.advanceFilter.openAdvFilter)
  const advancedFilterData = useTypedSelector(state => state.advanceFilter.advancedFilterData)
  const pageName="da"

  /** State */
  const [isFilterDataCalled, setIsFilterDataCalled] = useState<boolean>(false);
  const [columns, setColumns] = useState<IListViewColumn[]>([]);
  const [daActivationRequest, setDaActivationRequest] = useState<
    { activeRequest: boolean; daIds: Record<number, boolean>; failureCallback?: React.Dispatch<React.SetStateAction<boolean>> } | undefined
  >();
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [showUploadPopup, setShowUploadPopup] = useState<boolean>(false);
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
  const [showDownload, setShowDownload] = useState<boolean>(false);
  const [isPrint, setIsPrint] = useState<boolean>(false);
  const [moreOptionConfirmation, setMoreOptionConfirmation] = useState<{ activeRequest: boolean; selectionType: tMoreOption | string; reason: undefined | string }>({
    activeRequest: false,
    selectionType: '',
    reason: dynamicLabels.Other,
  });

  const [landingPage, setLandingPage] = useState<string>('');
  const [daUpdateRequest, setDaUpdateRequest] = useState<
    { activeRequest: boolean; daIds: Record<number, boolean>; failureCallback?: React.Dispatch<React.SetStateAction<boolean>> } | undefined
  >();
  const [showBulkUpdate, setShowBulkUpdate] = useState<boolean>(false);
  const [showDeletionConfirmation, setShowDeletionConfirmation] = useState<boolean>(false);
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [showNotify, setShowNotify] = useState<boolean>(false);
  const [updateConfirmationModal, setUpdateConfirmationModal] = useState<boolean>(false);
  const [isSaveClicked, setIsSaveClicked] = useState<boolean>(false)
  const [isCompartmentListModalVisible, setCompartmentListModalVisible] = useState<boolean>(false);
  const [selectedDA, setSelectedDA] = useState<IRowData>();

  /* Advnaced Filter state */
  const [showColumnShimmer, setShowColumnShimmer] = useState<boolean>(false)


  // const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);

  // ---------------------------------------------------------------------------------------------------------
  const [filters, setFilters] = useState<Record<string, string>>()
  const [sort, setSort] = useState<SortingRule<object>[]>()

  const buttonTooltip = {
    mapview: `${LabelMapping.clickhereToShowtheCurrentLocation} ${dynamicLabels.deliveryBoy} ${dynamicLabels.onAMap}`,
    listview: `${LabelMapping.clickheretoViewListofThe} ${dynamicLabels.deliveryBoy}`,
    timelineview: `${LabelMapping.clickhereToshowOccupancy}  ${dynamicLabels.deliveryBoy} on timeline`,
  };
  /** Variables */
  const ButtonGroupData = React.useMemo(() =>
    pageLabels?.viewOptions ?
      Object.keys(pageLabels?.viewOptions).map((key: string) => ({
        id: key,
        label: pageLabels?.viewOptions[key].toUpperCase(),
        selected: key === viewMode,
        icon: iconsMapping[key],
        tooltipText: buttonTooltip[key]
      }))
      : []
    , [pageLabels, viewMode, dynamicLabels])


  // as per the prd- pending work change menu item to plural
  const breadCrumbOptions = React.useMemo(() => [
    { id: 'fleet', label: dynamicLabels?.Resources || "Fleets", disabled: true },
    { id: 'FieldRepresentatives', label: dynamicLabels.deliveryboy_p, disabled: true },
  ], [pageLabels, dynamicLabels])

  const MoreButtonOptionList = React.useMemo(() => [
    { value: 'absent', label: `${dynamicLabels?.markAsAbsent}` || 'Mark as Absent', tooltipText: `Mark Attendance as ${dynamicLabels?.Absent}.` || 'Mark Attendance as Absent.' },
    { value: 'present', label: `${dynamicLabels?.markAsPresent}` || 'Mark As Present', tooltipText: `Mark Attendance as ${dynamicLabels?.present}.` || 'Mark Attendance as Present.' },
    { value: 'active', label: `${dynamicLabels?.markAsActive}` || 'Mark As Active', tooltipText: 'Mark Status as Active.' },
    { value: 'inactive', label: `${dynamicLabels?.markAsInactive}` || 'Mark As Inactive', tooltipText: 'Mark Status As Inactive.' },
    { value: 'sendActivationLink', label: `${dynamicLabels?.sendActivationLink}` || 'Send Activation Link', tooltipText: ' Send Activation Link.' }
  ], [dynamicLabels])


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
      ngStateRouter.go('deliveryMedium', newParams, ngStateRouterOptions)
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
      temp["orderNo"] = localStorage.getItem('globalSearchText') || ""
    }

    setFilters(temp)
  }

  useEffect(() => {
    handleQueryParams()
    setShowColumnShimmer(true)
    dispatch({
      type: '@@daListView/INITIAL_DATA_LOAD'
    })
    return (() => {
      dispatch({
        type: '@@daListView/RESET_INITIAL_STATE'
      })
    })

  }, [])




  useEffect(() => {
    if (initailFetchDone) {
      dispatch(({ type: '@@daListView/GET_DELIVERY_STATUS', payload: statusList }));
      dispatch(({ type: '@@daListView/UPDATE_WEEKLY_OFF', payload: weeklyOff }));
      dispatch(({ type: '@@daListView/UPDATE_BRANCH_LIST', payload: { branchList } }));
      dispatch(({ type: '@@daListView/GET_DELIVERY_TYPE', payload: deliveryTypes }));
    }
    advanceFilterdispatch({ type: '@@advanceFilter/SET_FILTERLIST_PAYLOAD', payload: undefined });
    advanceFilterdispatch({ type: '@@advanceFilter/SET_CURRENT_FILTERS', payload: undefined });
    advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: false });
  }, [initailFetchDone])

  const resetNetworkStatus = (rowsSelector: any) => {
    if (rowsSelector.length > 0) {
      dispatch({
        type: '@@daListView/SET_DEVICE_STATUS',
        payload: {
          deviceStatusLoading: true
        }
      })
      setTimeout(() => {
        dispatch({
          type: '@@daListView/SET_DEVICE_STATUS',
          payload: {
            deviceStatusLoading: false
          }
        })
      }, 3000)
    }
  }

  useEffect(() => {
    resetNetworkStatus(rowsSelector)

  }, [rowsSelector]);

  /** Watchers */
  useEffect(() => {
    const landingPage = localStorage.getItem('landingPage') || '';
    setLandingPage(landingPage);
    dispatch({ type: '@@daListView/FETCH_STRUCTURE' });
    globalRouteFlagDispatch({
      type: '@@hiredDMRouteFlag/SET_HIREDDM_ROUTEFLAG',
      payload: {
        isThroughHiredDA: false
      }
    })
  }, [viewMode]);



  const handletripNameClick = (row: IRowData) => {
    hybridRouteTo(`tripHst/tripDetails?tripId=${row.tripId}`);
  };
  const handleLastTracking = (row: IRowData) => {
    hybridRouteTo(
      `deliverymedium/locationhistory/?page=deliveryMedium&deliverymediumid=${row.deliveryMediumMasterId}&deliverymediumname=${row.deliveryMediumMasterName}&trackingDt=${row.trackingDt}`,
    );
  };

  const fetchDataSilenty = () => {
    const { pageSize, pageNumber, sortOptions, filterOptions: filter } = fetchOptions
    console.log('Fetched Data Silently');
    let searchText = filter?.searchText
    let payload: any = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      searchBy: filter?.searchBy || '',
      searchText: searchText || '',
      sortBy: sortOptions?.sortBy || '',
      sortOrder: sortOptions?.sortOrder || '',
      isLoading: false,
      isTotalCountLoading: false
    }
    dispatch({
      type: '@@daListView/FETCH_DATA',
      payload
    });

  }

  const handleActiveFlChange = (
    isChecked: boolean,
    { deliveryMediumMasterId }: IRowData,
    failureCallback: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    sendGA('ListView Active Action', `Delivery Associate Toggle Change - Status - ${isChecked ? 'Active' : 'Inactive'}`)
    const daIds = {
      [deliveryMediumMasterId]: true,
    };
    setDaActivationRequest({ activeRequest: isChecked, daIds, failureCallback });
  };


  const handleAttendanceChange = async (
    isChecked: boolean,
    { deliveryMediumMasterId }: IRowData,
    setState: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    // ga.event({
    //   category: 'ListView Attendence',
    //   action: `Checkbox Click - Attendence - ${isChecked ? 'Absent' : 'Present'}`,
    //   label: 'Delivery Associate List View'
    // })
    sendGA('Event New', 'Delivery Associate - change attendance confirmed')
    try {
      const {
        data: { message, status },
      } = await axios.put(apiMappings.deliveryMedium.listView.attendance, [
        { deliveryMediumMasterId, isAttandanceFl: isChecked, attendanceSrc: 'WEB' },
      ]);
      if (status === 200) {
        toast.add(message, 'check-round', false);
        const status = !isChecked ? dynamicLabels.Absent : dynamicLabels.available;
        dispatch({
          type: '@@daListView/UPDATE_STATUS',
          payload: { deliveryMediumMasterId, status, custom: { isAttandanceFl: isChecked } },
        });

        // in selection old value will remain so clear selection
        // in prod as well same thing, there just bug is it shows selected rows but gives error that no selection
        fetchDataSilenty()
        resetSelctedRows()


        return;
      }
      throw message;
    } catch (errorMessage) {
      toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false);
      setState(!isChecked);
    }
  };
  const handleNumberOfCompartments = (row: IRowData) => {
    dispatch({ type: '@@daListView/FETCH_COMPARTMENT_LIST_STRUCTURE' });
    setSelectedDA(row)
    setCompartmentListModalVisible(true);
  }
  const cellCallbackMapping = {
    deliveryMediumMasterName: (row: IRowData) => {
      hybridRouteTo(
        `deliverymedium/history/details?deliveryMediumMasterId=${row.deliveryMediumMasterId}&deliveryMediumMasterName=${row.deliveryMediumMasterName}`,
      );
    },
    tripName: handletripNameClick,
    trackingDate: handleLastTracking,
    isAttandanceFl: handleAttendanceChange,
    isActiveFl: handleActiveFlChange,
    compartmentCount: handleNumberOfCompartments
  };

  useEffect(() => {
    if (Object.entries(columnsSelector).length !== 0) {
      advanceFilterdispatch({ type: '@@advanceFilter/SET_COLUMNS_SELECTOR', payload: columnsSelector });
      const mongoStructure = columnsSelector;
      if (mongoStructure && Object.keys(mongoStructure).length) {
        const newColumns = transformMongoListViewToColumns(mongoStructure, 'deliveryMedium', cellCallbackMapping);
        const statusTransformedColumn = newColumns.map((column: any) => {
          const newcolumn = column;
          if (column.accessor === 'deviceStatus' && newcolumn?.isVisible) {
            newcolumn.Filter = <NetworkStatusComponent columnName={column.accessor} />;
          } else if (column.accessor === 'deliveryMediumMasterName') {
            newcolumn.hrefdata = "`#/deliverymedium/history/details?deliveryMediumMasterId=${row.original.deliveryMediumMasterId}&deliveryMediumMasterName=${row.original.deliveryMediumMasterName}&endDt=${row.original.trackingDt}`";
          } else if (column.accessor === 'tripName') {
            newcolumn.hrefdata = "`#/tripHst/tripDetails?tripId=${row.original['tripId']}`";
          } else if (column.accessor === 'trackingDate') {
            newcolumn.hrefdata = "`#/deliverymedium/locationhistory/?page=deliveryMedium&deliverymediumid=${row?.original?.deliveryMediumMasterId}&deliverymediumname=${row?.original?.deliveryMediumMasterName}&trackingDt=${row?.original?.trackingDt}`";
            newcolumn['cellType'] = 'DATE';
          }
          return newcolumn;
        });
        setColumns(statusTransformedColumn);
      }
    }
  }, [columnsSelector, deviceStatusLoading, actionBarButtons]);

  /** Cell Callbacks */
  const handleDaActivation = async () => {
    if (!daActivationRequest) {
      return;
    }
    setDaActivationRequest(undefined);

    if (Object.keys(daActivationRequest.daIds).length === 1) {
      const deliveryMediumMasterId = Number(Object.keys(daActivationRequest.daIds)[0]);
      dispatch({
        type: '@@daListView/UPDATE_DATA',
        payload: {
          deliveryMediumMasterId,
          isActiveFl: daActivationRequest.activeRequest,
        },
      });
    }
    try {
      const {
        data: { message, status },
      } = await axios.put(
        apiMappings.deliveryMedium.listView.activationRequest,
        Object.keys(daActivationRequest.daIds).map(id => ({
          deliveryMediumMasterId: Number(id),
          isActiveFl: daActivationRequest.activeRequest,
        })),
      );
      if (status === 200) {
        toast.add(`${message}.`, 'check-round', false);
        sendGA('Event New', 'Delivery Associate - active/inactive confirmed')

        // in selection old value will remain so clear selection
        // in prod as well same thing, there just bug is it shows selected rows but gives error that no selection
        fetchDataSilenty()
        resetSelctedRows()
        return;
      }
      throw message;
    } catch (errorMessage) {
      daActivationRequest.failureCallback && daActivationRequest.failureCallback(!daActivationRequest.activeRequest);
      toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false);
    }
  };

  /** Inline Edit */
  const validateSelectedRows = () => {
    const columnStructure = columnsSelector;

    try {
      validateRows(editDetails, columnStructure);
    } catch (error: any) {
      console.log('Inline Edit Validation Failed.', error?.message);
      setIsSaveClicked(false)
      setEditMode(true);
      throwError(error);

      if (error.message) {
        toast.add(error.message, '', false);
      }
      return false;
    }

    return true;
  };

  const handleSaveRows = async () => {
    // this flag is to tell list view that save is clicked so hisable save and cancel btn and dont get out of edit mode
    setIsSaveClicked(true)
    const isValid = validateSelectedRows();
    sendGA('ListView ActionBar', 'Delivery Associate Button Click - Save - Inline Edit')

    if (isValid) {
      const payload: Partial<IRowData>[] = [];

      // const selectedRowsLength = Object.keys(selectedRows).length
      Object.values(selectedRows).forEach((row: any) => {
        if (editDetails[row.deliveryMediumMasterId]) {
          const obj: any = {
            deliveryMediumMasterId: row.deliveryMediumMasterId,
          };
          var customFieldArray: any = [];
          Object.keys(columnsSelector).forEach(columnId => {
            // console.log(columnId, columnsSelector?.[columnId]?.editable)
            var payload = {}
            if (columnsSelector?.[columnId]?.editable && !columnsSelector?.[columnId]?.customField) {
              obj[columnId] = editDetails?.[row.deliveryMediumMasterId]?.[columnId]?.value || row[columnId];
            }
            var customFieldValue = editDetails?.[row.deliveryMediumMasterId]?.[columnId]?.value;
            if (columnsSelector?.[columnId]?.customField && customFieldValue != undefined) {
              var customFieldType = columnsSelector?.[columnId]?.fieldType
              payload = { field: columnId, type: customFieldType, value: customFieldValue }
              customFieldArray.push(payload);
            }

            switch (columnId) {
              case 'minCapacityUtilizationInVolume':
              case 'capacityInVolume': {
                const clientObj = clientMetric.find(c => c.name === 'volume')
                const emptyValue = editDetails?.[row.deliveryMediumMasterId]?.[columnId]?.value

                const val = emptyValue !== undefined && metricsConversion(parseFloat(editDetails?.[row.deliveryMediumMasterId]?.[columnId]?.value), 'POST', clientObj?.conversionFactor)

                const val2 = metricsConversion(parseFloat(row[columnId]), 'POST', clientObj?.conversionFactor)
                obj[columnId] = emptyValue === undefined ? val2 : val ? val : 0

                break;
              }
              case 'minCapacityUtilizationInWeight':
              case 'capacityInWeight': {

                const clientObj = clientMetric.find(c => c.name === 'weight')
                const emptyValue = editDetails?.[row.deliveryMediumMasterId]?.[columnId]?.value

                const val = emptyValue !== undefined && metricsConversion(parseFloat(editDetails?.[row.deliveryMediumMasterId]?.[columnId]?.value), 'POST', clientObj?.conversionFactor)

                const val2 = metricsConversion(parseFloat(row[columnId]), 'POST', clientObj?.conversionFactor)
                obj[columnId] = emptyValue === undefined ? val2 : val ? val : 0

                break;
              }
              case 'linkedVehicleNumber': {
                const vehicleId = editDetails?.[row.deliveryMediumMasterId]?.[columnId]?.value
                obj['vehicleId'] = vehicleId
              }
              case 'deliveryMediumMasterTypeCd': {
                obj[columnId] = editDetails?.[row.deliveryMediumMasterId]?.[columnId]?.value || (typeof editDetails?.[row.deliveryMediumMasterId]?.[columnId]?.value === 'string' && editDetails?.[row.deliveryMediumMasterId]?.[columnId]?.value.length === 0) ? editDetails?.[row.deliveryMediumMasterId]?.[columnId]?.value : row.deliveryMediumMasterTypeCd
                obj["deliveryType"] = editDetails?.[row.deliveryMediumMasterId]?.[columnId]?.value || (typeof editDetails?.[row.deliveryMediumMasterId]?.[columnId]?.value === 'string' && editDetails?.[row.deliveryMediumMasterId]?.[columnId]?.value.length === 0) ? editDetails?.[row.deliveryMediumMasterId]?.[columnId]?.value : row.deliveryMediumMasterTypeCd
              }
            }
          });
          obj["customFieldsEntity"] = customFieldArray;
          const selectedBranch = branchList.find((option: any) => option.label === obj.branchName);

          const payloadParams = {
            capacityInUnits: row.capacityInUnits,
            capacityInVolume: row.capacityInVolume,
            capacityInWeight: row.capacityInWeight,
            clientBranchId: row.clientBranchId,
            deliveryMediumMasterId: row.deliveryMediumMasterId,
            deliveryMediumMasterName: row?.deliveryMediumMasterName,
            deliveryMediumMasterTypeCd: row.deliveryMediumMasterTypeCd,
            deliveryType: row.deliveryMediumMasterTypeCd,
            employeeId: row.employeeId,
            isOnBreakFl: row.isOnBreakFl,
            operationType: row.operationType,
            phoneNumber: row.phoneNumber,
            timezoneId: row.timezoneId,
            userId: row.userId,
            userName: row.userName,
            weeklyOffList: row.weeklyOffList,
          };
          console.log("payloadParams ", payloadParams, "OBJ ", obj)
          const newObj = { ...payloadParams, ...obj };
          newObj.distributionCenter = selectedBranch?.id;
          payload.push(newObj);
        }
      });

      const propertyLength = Object.keys(editDetails)?.length
      // all 3 properties branchname, dm type and weekly are same and prop length matching then show toast
      if (propertyLength === 0) {
        setIsSaveClicked(false)
        setEditMode(false);
        return
      }

      if (!payload.length) {
        handleCancelRows();
        return;
      }

      try {
        const {
          data: { message, status },
        } = await axios.put(apiMappings.deliveryMedium.listView.inlineUpdate, payload);
        if (status === 200) {
          interface IUpdateDataPayload extends Partial<IRowData> {
            deliveryMediumMasterId: number
          }
          payload.map((payloadRow) => {
            dispatch({ type: '@@daListView/UPDATE_DATA', payload: (payloadRow as IUpdateDataPayload) })
          });
          handleFetchData(fetchOptions)
          setEditMode(false)
          //once it gets save correctly first remove call selection and set isSaveCliked to false and then remove edit mode so that whenevr you switch to normal list view all btns will be in disable state.
          dispatch({ type: '@@daListView/CLEAR_EDIT_DETAILS' });
          fetchOptions.apis?.resetSelection();
          setSelectedRows({});
          setIsSaveClicked(false)
          setDaUpdateRequest({ activeRequest: false, daIds: {} });
          toast.add(message, 'check-round', false);
          // when click on save we are disabling it.once get 200 remove disable

          return;
        }
        throw message;
      } catch (errorMessage: any) {
        //error: {,…}
        // deliverymedium_0: [{key: "minCapacityUtilizationInUnits",…}, {key: "minCapacityUtilizationInWeight",…}]
        // 0: {key: "minCapacityUtilizationInUnits",…}
        // key: "minCapacityUtilizationInUnits"
        // message: ["Capacity (Units) % value must be less than equal to 100."]
        // 0: "Capacity (Units) % value must be less than equal to 100."
        setEditMode(true)
        dispatch({ type: '@@daListView/SET_LOADING', payload: { listView: false } })
        // const error = errorMessage.response?.data?.error?.['deliverymedium_0']?.[0]?.message?.[0]
        const error = errorMessage.response?.data?.error?.[0]?.message?.[0]

        setIsSaveClicked(false)
        setDaUpdateRequest({ activeRequest: false, daIds: {} });
        toast.add(error || dynamicLabels.somethingWendWrong, 'warning', false);
      }
    }
  };

  const resetSelctedRows = () => {
    setIsSaveClicked(false)
    setEditMode(false);
    dispatch({ type: '@@daListView/CLEAR_EDIT_DETAILS' });
    fetchOptions.apis?.resetSelection();
    setSelectedRows({});
  }


  const handleCancelRows = React.useCallback(() => {
    setUpdateConfirmationModal(false)
    resetSelctedRows()

  }, [fetchOptions]);

  const handleCancelRowsChange = React.useCallback(() => {
    setUpdateConfirmationModal(false)
    const propertyLength = Object.keys(editDetails)?.length

    // anything newly edited then this flag will become true
    if (propertyLength !== 0) {
      setUpdateConfirmationModal(true)
    } else {
      // nothing edited just clear all the selection.
      resetSelctedRows()

    }
  }, [fetchOptions, editDetails, selectedRows]);

  const handleMoreOptions = (id: string) => {
    sendGA('ListView ActionBar', `Delivery Associate Button Click - More Option - ${id}`)



    setMoreOptionConfirmation({ ...moreOptionConfirmation, activeRequest: true, selectionType: id, reason: dynamicLabels.Other });
  };

  /** List View Callbacks */
  const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {

    const isDispatchedIncluded = filterOptions?.searchText?.includes('DISPATCHED')
    if (isDispatchedIncluded) {
      apis?.resetSelection()
    }
    sortOptions = handleCustomColumnSort(sortOptions)
    let searchText = filterOptions?.searchText
    let payload: any = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      searchBy: filterOptions?.searchBy || '',
      searchText: searchText || '',
      sortBy: sortOptions?.sortBy || '',
      sortOrder: sortOptions?.sortOrder || '',
      isLoading: true,
      isTotalCountLoading: false
    }

    setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis });
    dispatch({
      type: '@@daListView/FETCH_DATA',
      payload
    });

  }, [filterListPayload]);

  const onRowSelect = React.useCallback((s: ISelectedRows) => {
    setSelectedRows(s);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onSortChange = React.useCallback(() => { }, []);

  const handleDelete = async () => {
    setShowDeletionConfirmation(false);
    dispatch({ type: '@@daListView/SET_LOADING', payload: { listView: true } })
    try {
      const {
        data: { message, status },
      } = await axios.delete(apiMappings.deliveryMedium.listView.deleteRequest, {
        data: Object.values(selectedRows).map((row: any) => Number(row.deliveryMediumMasterId)),
      });
      if (status === 200) {
        toast.add(message, 'check-round', false);
        fetchOptions.apis?.resetSelection();
        setSelectedRows({});
        fetchDataSilenty()
        dispatch({ type: '@@daListView/SET_LOADING', payload: { listView: false } })
        // handleFetchData(fetchOptions)
        return;
      }
      throw message;
    } catch (errorMessage) {
      dispatch({ type: '@@daListView/SET_LOADING', payload: { listView: false } })
      console.log('Failed to Delete Delivery Associates: ', errorMessage);
      toast.add(dynamicLabels.somethingWendWrong, 'warning', false);
    }
  };


  const onSaveColumnPreferences = React.useCallback(
    async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
      sendGA('ListView ActionBar', 'Delivery Associate Button Click - Apply')
      const columns = { ...columnsSelector };
      Object.keys(columns).forEach(columnKey => {
        columns[columnKey].permission = !!visibleColumns[columnKey];
      });

      const payload = {
        ...structure,
        columns,
      };

      try {
        const {
          data: { message },
        } = await axios.put(apiMappings.deliveryMedium.listView.structure, payload, {
          params: {
            modelName: 'DELIVERYMEDIUM',
            pageName: 'DELIVERYMEDIUM',
            sectionName: viewMode === 'listview' ? 'DELIVERY_MEDIUM_LIST_VIEW' : 'DELIVERY_MEDIUM_MAP_VIEW'
          }
        });
        message && toast.add(message, 'check-round', false);
      } catch (error: any) {
        console.log(error, error?.response);
      }
    },
    [columnsSelector],
  );

  const handleOkAction = () => {
    handleSaveRows();
  };


  // handle Fetch Filter
  const handleFetchFilters = async (callBackAdvanceFilter = false) => {
    try {
      if ((!isFilterDataCalled && ((advancedFilterData.length > 0 && advancedFilterData[0].sectionName != 'DELIVERY_MEDIUM_LIST_VIEW') || advancedFilterData?.length == 0)) || callBackAdvanceFilter) {
        setIsFilterDataCalled(true);
        const { data } = await axios.get(apiMappings.advancedSearch.getFilters, {
          params: {
            pageName: 'DELIVERYMEDIUM',
            sectionName: 'DELIVERY_MEDIUM_LIST_VIEW'
          }
        });
        if (data) {
          const isFavouriteFilter = data.find((filter: { isFavourite: boolean; }) => filter?.isFavourite);
          if (isFavouriteFilter) {
            advanceFilterdispatch({ type: '@@advanceFilter/SET_APPLIED_ADV_FILTER_DATA', payload: isFavouriteFilter?.filters });
          }
          advanceFilterdispatch({ type: '@@advanceFilter/SET_ADV_FILTER_DATA', payload: data });
        }
      }

      return;
    } catch (errorMessage) {
      // console.log('Failed to Make Changes to Filter: ', errorMessage);
      toast.add('Failed to Make Changes to Filter. ', 'warning', false);
    }
  };



  // handle remove fiter
  const handleRemoveFilter = async () => {
    advanceFilterdispatch({ type: '@@advanceFilter/SET_FILTERLIST_PAYLOAD', payload: undefined });
    advanceFilterdispatch({ type: '@@advanceFilter/SET_CURRENT_FILTERS', payload: undefined });
    advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: false });

  };

  const handleOpenAdvancedFilter = () => {
    advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: !openAdvFilter });
  }

  const actionClick = (id: string) => {
    globalRouteFlagDispatch({
      type: '@@hiredDMRouteFlag/SET_HIREDDM_ROUTEFLAG',
      payload: {
        isThroughHiredDA: false
      }
    })
    handleActionBarButtonClick(id, setShowDeletionConfirmation, setEditMode, setShowChangePassword, setShowNotify, setShowBulkUpdate)
  }

  const buttonGroupClick = (id: string) => {
    if (viewMode != id) {
      const type = id === 'mapview' ? 'Map View' : 'List View'
      if (id === 'timelineview') {
        sendGA('ListView Button Group', 'Delivery Associate Button Click - Timeline View`')
        hybridRouteTo('dbTimeline/?page=dbOccupancy')

      } else {
        sendGA('ListView Button Group', `Delivery Associate Button Click - ${type}`)


        dispatch({ type: '@@daListView/SET_VIEW_MODE', payload: id } as ISetViewMode);
      }
      // first flush all the data then shift to next page, on switching prev data should not visible
      setShowColumnShimmer(true)
      // as suggestion from pm not clearing selectedRow
      // for list view we want to keep selection blocked on select all for intransit, and in map view remove that
      const newPayload = { ...data, results: rowsSelector }

      dispatch({ type: '@@daListView/IS_INTRANSIT', payload: false });
      // if filter data is there then while switching to map remove filter data and remove selection
      if (id === 'mapview') {
        // if changing to map view and filterdata available then fetch data using api
        if (filterListPayload) {
          fetchDataSilenty()
        }
        else {
          // if no filter data from list view while switching to map, simply take payload already fetched
          dispatch({
            type: '@@daListView/FETCH_DATA_SUCCESS', payload: newPayload
          });
        }
      } else if (id === 'listview') {
        // if changing to list view and filterdata available then fetch data using api
        if (filterListPayload) {
          handleFetchData(fetchOptions)
        } else {
          // if no filter data from map view while switching to list, simply take payload already fetched
          dispatch({
            type: '@@daListView/FETCH_DATA_SUCCESS', payload: newPayload
          });
        }
      }


      dispatch({
        type: '@@daListView/FETCH_STRUCTURE_SUCCESS', payload: {
          columns: dummyData,
          buttons: {},
        }
      });

    }

  }

  const onHandleApply = (selectedColumns: Record<string, boolean>) => {
    dispatch({
      type: '@@daListView/SET_COLUMNS',
      payload: selectedColumns
    });
  }

  /*********** Delivery Medium add Form ***********/
  const handleAddDA = () => {
    // DA - Add button
    // sendGA('Navigation', 'Delivery Associate Button Click - Add Delivery Associate')
    hybridRouteTo('adddeliverymedium');
  }



  return (
    <>
      {viewMode === 'listview' && <div id='toast-inject-here'></div>}
      <Box display='flex' mt='64px' flexDirection='column' style={{ width: '100%', height: 'calc(100vh - 64px)', overflow: 'hidden' }} px='15px' pb='15px'>
        {/* Header */}
        <Box display='flex' justifyContent='space-between' style={{ width: '100%' }} py='15px'>
          {/* <div title='breadcrumbs' className='cursor'>Bread crumbs come here</div> */}
          {/* eslint-disable-next-line @typescript-eslint/no-empty-function*/}
          <BreadCrumbTagWrapper>
            <BreadCrumb options={breadCrumbOptions} onClick={() => { }} />
            {filterListPayload &&
              <Tooltip maxWidth={600} tooltipDirection='bottom' messagePlacement='center' hover message={
                <div style={{ textAlign: 'left', fontSize: 12 }}>
                  <Box mb='10px'>Filters are applied on {filterListPayload.operationLogic === 'AND' ? 'ALL' : 'ANY'} of the the following conditions:</Box>
                  {currentFilter && currentFilter?.filters && currentFilter?.filters.map((f: any, i) => {
                    return <Box mb='5px'>{`${i + 1}. ${f.fieldLabelKey} ${f?.labelValue || f?.operationSymbol} ${(f.fieldId === "deliveryMediumMasterTypeCd" && (f.operationLabelKey === "filterOpEquals" || f.operationLabelKey === "filterNotOpEquals" || f.operationLabelKey === "contains") && f.filterData.value) ? f.filterData.value : f.filterDataLabel ? f.filterDataLabel : f.filterData}`}</Box>
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
          </BreadCrumbTagWrapper>


          {/* Page Action Buttons */}
          <Box display='flex' justifyContent='space-evenly' horizontalSpacing='10px'>
            {pageLabels?.buttons.add && (
              <Tooltip message={`Click here to add ${dynamicLabels?.deliveryboy_s}.`} hover={true}>
                <IconButton
                  id='da--actionbar--add'
                  intent='page'
                  iconVariant='icomoon-add'
                  onClick={() => {
                    sendGA('Navigation', 'Delivery Associate Button Click - Add Delivery Associate')
                    hybridRouteTo('adddeliverymedium');
                  }}

                >
                  {dynamicLabels?.[pageLabels?.buttons.add] || dynamicLabels.add}
                </IconButton>
              </Tooltip>
            )}

            {pageLabels?.buttons.upload && (
              <Tooltip message={`Click here to upload a list of ${dynamicLabels?.deliveryboy_p}.`} hover={true}>
                <IconButton intent='page' style={{ marginRight: '-5px' }} iconVariant='icomoon-upload' onClick={() => {
                  sendGA('Upload Action', 'Delivery Associate Button Click - Upload')
                  setShowUploadPopup(true)
                }}
                id='da--actionbar--upload'>
                  {dynamicLabels?.[pageLabels?.buttons.upload] || dynamicLabels?.Upload}
                </IconButton>
              </Tooltip>
            )}

            {ButtonGroupData.length > 0 && (

              <StyledButtonGroup
                data={ButtonGroupData}
                onChange={(id: string) => {
                  return buttonGroupClick(id)
                }}
              />
            )}
          </Box>
        </Box>

        {/* LIST VIEW CONTAINER */}
        <StyledGrid container spacing={15} style={{ boxShadow: viewMode === 'listview' ? '0 2px 20px -10px #000' : '' }}>
          <Grid
            className='grid-customised-scroll-bar'
            item
            md={viewMode === 'listview' ? 12 : 4}
            style={{ display: 'flex', overflow: 'hidden' }}
          >
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
                boxShadow: '0px 2px 20px -10px #000 !important'
              }}
            >
              { // (advFilterLoader- if filter applied then true or false) if that filter is applied then only show list view

                <ListViewComponent
                  pageName={pageName}
                  columns={columns}
                  handleFetchData={handleFetchData}
                  onRowSelect={onRowSelect}
                  onSortChange={onSortChange}
                  onSaveColumnPreferences={onSaveColumnPreferences}
                  isEditMode={isEditMode}
                  setIsPrint={setIsPrint}
                  showDownload={showDownload}
                  setShowDownload={setShowDownload}
                  fetchOptions={fetchOptions}
                  selectedRows={selectedRows}
                  handleSaveRows={handleSaveRows}
                  handleActionBarButtonClick={(id: string) => actionClick(id)}
                  handleCancelRowsChange={handleCancelRowsChange}
                  MoreButtonOptionList={MoreButtonOptionList}
                  handleMoreOptions={handleMoreOptions}
                  openAdvFilter={openAdvFilter}
                  handleFetchFilters={handleFetchFilters}
                  handleRemoveFilter={handleRemoveFilter}
                  onHandleApply={onHandleApply}
                  setShowColumnShimmer={setShowColumnShimmer}
                  showColumnShimmer={showColumnShimmer}
                  isSaveClicked={isSaveClicked}
                  sort={sort}
                  filter={filters}
                  handleFilterChange={handleFilterChange}
                />
              }
            </Card>
          </Grid>
          {viewMode === 'mapview' && (
            <DeliveryAssociateMap selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
          )}
        </StyledGrid>
      </Box>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeletionConfirmation && (
        <DeleteConfirmationModal
          showDeletionConfirmation={showDeletionConfirmation}
          setShowDeletionConfirmation={(value: boolean) => setShowDeletionConfirmation(value)}
          deleteSelectedRows={handleDelete}
        />
      )}
      {daUpdateRequest?.activeRequest && (
        <UpdateConfirmation
          daUpdateRequest={daUpdateRequest}
          setDaUpdateRequest={setDaUpdateRequest}
          title={dynamicLabels?.updateConfirmation}
          handleOkAction={handleOkAction}
          content={dynamicLabels?.forceDmUpdateValidationMsg}
        />
      )}

      {/* ACTIVATION CONFIRMATION MODAL */}

      <ActivationConfirmation
        isShowActivationConfirmation={!!daActivationRequest}
        title={dynamicLabels?.statusConfirmation}
        footerButtonGroup={[
          {
            iconVariant: 'icomoon-tick-circled',
            onClick: handleDaActivation,
            primary: true,
            label: dynamicLabels?.ok,
            isVisible: true,
          },
          {
            iconVariant: 'icomoon-close',
            onClick: () => {
              daActivationRequest?.failureCallback && daActivationRequest?.failureCallback(!daActivationRequest.activeRequest);
              setDaActivationRequest(undefined);
            },
            primary: false,
            label: dynamicLabels?.cancel,
            isVisible: true,
          },
        ]}
        confirmationMessage={
          daActivationRequest?.activeRequest
            ? dynamicLabels?.areYouSureYouWantToMarkAsAcitve
            : dynamicLabels?.areYouSureYouWantToMarkAsInactive
        }
        handleClose={() => {
          daActivationRequest?.failureCallback && daActivationRequest?.failureCallback(!daActivationRequest.activeRequest);
          setDaActivationRequest(undefined);
        }}
      />

      {showUploadPopup && (
        <UploadExcel
          isOpen={showUploadPopup}
          featureName='deliveryMedium'
          onSuccess={() => {
            setShowUploadPopup(false);
            handleFetchData(fetchOptions);
          }}
          onClose={() => setShowUploadPopup(false)}
        />
      )}


      {showChangePassword && (
        <ChangePassword
          setShowChangePassword={setShowChangePassword}
          showChangePassword={showChangePassword}
          selectedRows={selectedRows}
        />
      )}
      {showNotify && (
        <Notify
          showNotify={showNotify}
          setShowNotify={setShowNotify}
          selectedRows={selectedRows} />
      )}
      {isPrint && <PrintPage data={rowsSelector} columns={columns} handlePrint={() => handlePrint(setIsPrint)} isPrint={isPrint} />}
      {moreOptionConfirmation.activeRequest && (
        <MoreOptionConfirmation
          moreOptionConfirmation={moreOptionConfirmation}
          setMoreOptionConfirmation={setMoreOptionConfirmation}
          selectedRows={selectedRows}
          landingPage={landingPage}
          fetchDataSilenty={fetchDataSilenty}
          resetSelctedRows={resetSelctedRows}
        />
      )}
      {showBulkUpdate && (
        <BulkUpdate
          showBulkUpdate={showBulkUpdate}
          setShowBulkUpdate={setShowBulkUpdate}
          selectedRows={selectedRows}
          fetchDataSilenty={fetchDataSilenty}
        />
      )}{
        updateConfirmationModal &&
        <InlineEditConfirmationModal
          showCancelConfirmationModal={updateConfirmationModal}
          setShowCancelConfirmationModal={(value: boolean) => setUpdateConfirmationModal(value)}
          handleCancelRows={handleCancelRows}
        />

      }
      {
        showDownload && <DownloadModal
          isShowDownloadModal={showDownload}
          fetchOptions={fetchOptions}
          setShowDownload={setShowDownload}
          selectedRows={selectedRows}
        />
      }
      <CompartmentListViewModal
        isCompartmentListModalVisible={isCompartmentListModalVisible}
        setCompartmentListModalVisible={setCompartmentListModalVisible}
        selectedRow={selectedDA}
        moduleName={'DELIVERY_MEDIUM'}
      />
    </>
  );
};

export default withThemeProvider(withToastProvider(withRedux(withPopup(DeliveryAssociateListView)), 'toast-inject-here'));
