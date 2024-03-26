import moment from "moment-timezone";
import React, { Dispatch, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SortingRule, ColumnInstance } from "react-table";
import {
  Box,
  Card,
  Grid,
  IconButton,
  IListViewColumn,
  ISelectedRows,
  ListView,
  useToast,
  withPopup,
  withToastProvider,
  IFilterOptions,
  ISortOptions,
  IconDropdown
} from "ui-library";
import useClientProperties from "../../../modules/common/ClientProperties/useClientProperties";
import apiMappings from "../../../utils/apiMapping";
import axios from "../../../utils/axios";
import { getQueryParams, hybridRouteTo } from "../../../utils/hybridRouting";
import { transformMongoListViewToColumns } from "../../../utils/mongo/ListView";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import withRedux from "../../../utils/redux/withRedux";
import { withThemeProvider } from "../../../utils/theme";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import { getBreadCrumbOptions } from "../OrderListOptionData/data";
import AllSubComponentContainer from "../SubComponent/AllSubComponentContainer";
import { OrderListViewActions } from "./OrderListView.actions";
import {
  IOrderFetchDataOptions,
  IRowData,
  tStatus,
} from "./OrderListView.models";
import OrderListViewIconBar from "./OrderListViewIconBar"
import { WhiteCard } from './StyledOrderListView';
import OrderListHeader from './OrderListHeader';
import { useGlobalPopup } from '../../common/GlobalPopup/useGlobalPopup'
import { getUrlVars, getUTCDateTZ } from '../OrderListOptionData/utils'
import { tGlobalPopupAction } from '../../common/GlobalPopup/GlobalPopup.reducer'
import OrderMapView from './OrderMapView';
import store from "../../../utils/redux/store";
import { getBaseCurrency } from "../../../utils/core";
import { handleOrderNumberClick, handleTripNumberClick, handleTrackNow, handleCloneOrder, _generateTwoLegs, getPageSelected } from "../utils/orderListViewFunctions";
// import OrderListActionButton from "./OrderListActionButton";
import OrdersNotAvailable from "../SubComponent/OrdersNotAvailable";
import PrintAWBModal from '../PrintAWB/PrintAWBModal';
// import iconsMapping from "../../../utils/mongo/ListView/actionBarIcons.mapping";
// import TextOverflowEllipsis from "../../../utils/components/TextOverflowEllipsis";
import CreateActionBarButton from "../../common/ActionBar/CreateActionBarButton";
import iconsMapping from "../../../utils/mongo/ListView/actionBarIcons.mapping";
// import TextOverflowEllipsis from "../../../utils/components/TextOverflowEllipsis";
import {AdvancedFilterComponentActions} from '../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions'
import {IAddOrderFormActions} from "../AddOrderForm/AddOrderForm.actions";
import {
  AdvancedFilterLabel, AppliedFilterStrip, ButtonWrapper
} from '../../OrderRequest/OrderRequestListView/StyledOrderRequestListView'


import { sendGA } from "../../../utils/ga";
import { throwError, validateRows, validateRowSETimes } from "../../common/InlineEdit/InlineEdit";
import { handleCustomColumnSort, metricsConversion } from "../../../utils/helper";
import { getFormattedDate } from '../../../../src/modules/Order/OrderListOptionData/utils'
const OrderListView = (props: any) => {

  // const userAccessInfo = JSON.parse(localStorage.getItem('userAccessInfo') || '');
  /** General Hooks */
  const { ngStateRouter, manualAssignmentCallBack, renderOrderCrateModal, toggle_DLC_modal, openShippingCostPopup } = props;
  const currencySymbol = 'cur_symbol_' + getBaseCurrency()
  const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.order},${currencySymbol}`);
  const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT", "CURRENCY", "CRATESTRUCTURE", "OPTIMIZEPACKING" , "WEIGHT" , "VOLUME"]);
  const toast = useToast();
  const userAccessInfo = JSON.parse(localStorage.getItem('userAccessInfo') || "{}");

  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<OrderListViewActions>>();
  const orderFormDispatch = useDispatch<Dispatch<IAddOrderFormActions>>();
  const advanceFilterdispatch = useDispatch<Dispatch<AdvancedFilterComponentActions>>();
  const columnsSelector = useTypedSelector((state) => state.order.listView.structure.columns);
  const rowsSelector = useTypedSelector((state) => state.order.listView.data.results);
  const totalRowsSelector = useTypedSelector((state) => state.order.listView.data.totalCount);
  const moreResultsExists = useTypedSelector((state) => state.order.listView.data.moreResultsExists);
  const clientMetric = useTypedSelector(state => state.order.listView.clientMetric);
  const viewMode = useTypedSelector((state) => state.order.listView.viewMode);
  const editDetails = useTypedSelector((state) => state.order.listView.editDetails);
  const loading = useTypedSelector((state) => state.order.listView.loading.listView);
  const columnsLoading = useTypedSelector((state) => state.order.listView.loading.columns);
  const notificationData = useTypedSelector((state) => state.order.listView.notificationData);
  const startDate = useTypedSelector(state => state.order.listView.dateRange.startDate);
  const endDate = useTypedSelector(state => state.order.listView.dateRange.endDate);
  const filterListPayload = useTypedSelector(state => state.advanceFilter.filterListPayload)
  // const openAdvFilter = useTypedSelector(state => state.advanceFilter.openAdvFilter)
  const actionBarButtons = useTypedSelector((state) => state.order.listView.structure.buttons);
  const pageLabels = useTypedSelector((state) => state.pageLabels); // orders
  const structure = useTypedSelector((state) => state.order.listView.structure);
  const dateInAttemptedStatus = useTypedSelector(state => state.order.listView.dateInAttemptedStatus)
  const printAWBData = useTypedSelector(state => state.order.listView.printAWB)
  const updateAddressStructure = useTypedSelector(state => state.order.listView.updateAddressFieldsStructure)
  const updateAddressOrderListStructure = useTypedSelector(state => state.order.listView.allOrderAddressUpdateListStructure)
  const setDisableNext = useTypedSelector(state => state.order.listView.setDisableNext);

  // const templates = useTypedSelector((state) => state.order.listView.printAWB.templates);
  /** State */
  const [reasonMessage, setReasonMessage] = useState([]);
  const [reasonOtherMessage, setReasonOtherMessage] = useState("");
  const [isP2POrder, setIsP2POrder] = useState(false);
  const [columns, setColumns] = useState<IListViewColumn[]>([]);
  const [showDeletionConfirmation, setShowDeletionConfirmation] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [enableAssignNow, setEnableAssignNow] = useState<boolean>(false);
  const [fetchOptions, setFetchOptions] = useState<IOrderFetchDataOptions>({});

  const [isShowReasonModal, setIsShowReasonModal] = useState<boolean>(false);
  const [isOverrideStatus, setIsOverrideStatus] = useState<boolean>(false);
  const [isGeocodeModal, setIsGeocodeModal] = useState<boolean>(false);
  const [tripData, setTripData] = useState({});
  const [reasonSelectedValue, setReasonSelectedValue] = useState({ reason: '', reasonId: '', reasonCd: '', attemptedDate: { pickupStartTime: "", pickupEndTime: "", deliverStartTime: "", deliverEndTime: "" } });
  // RescheduleDate
  const [rescheduledDate, setRescheduledDate] = useState<Date | undefined>()
  const [isAttemtedDate, setIsAttemptedDate] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState<boolean>(false);
  const [showBulkUploadModalFmlm, setShowBulkUploadModalFmlm] = useState<boolean>(false);
  const [showDeliveryProofModal, setShowDeliveryProofModal] = useState<boolean>(false);
  const [showTripDateChangeModal, setShowTripDateChangeModal] = useState<boolean>(false);
  const [showTripDateChangePopupMarkIntransitModal, setShowTripDateChangePopupMarkIntransitModal] = useState<boolean>(false);
  const [neverShowTripDateChangePopup, setNeverShowTripDateChangePopup] = useState<boolean>(false);
  const [showEstimateCostModal, setShowEstimateCostModal] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [notifyList, setNotifyList] = useState<any>([]);
  const [selectedStatus, setSelectedStatus] = useState<tStatus>("ALL");
  const [changedStatus, setChangedStatus] = useState("");
  const [customerNotifyType, setCustomerNotifyType] = useState(false)
  const [notifyTemplateData, setNotifyTemplateData] = useState([]);
  const [showAssignDAModal, setAssignDAModal] = useState<boolean>(false)
  const [isMarkAsIntransit, setIsMarkAsIntransit] = useState<boolean>(false);
  const [deliveryProofStructure, setDeliveryProofStructure] = useState([]);
  const [handleEstimatedCostStructure, setHandleEstimatedCostStructure] = useState([]);
  const [handleEstimatedCostData, setHandleEstimatedCostData] = useState([]);
  const [showDLCModal, setShowDLCModal] = useState(false);
  const [showNotifyFleetModal, setShowNotifyFleetModal] = useState<boolean>(false);
  const [sort, setSort] = useState<SortingRule<object>[]>()
  const [filters, setFilters] = useState<Record<string, string>>()
  const [showInformationModal, setShowInformationModal] = useState(false)
  const [isNoDataAvailable, setIsNoDataAvailable] = useState(false);
  const [tripDate, setTripDate] = useState("");
  const [disableSaveButton, setDisableSaveButton] = useState<boolean>(false);
  const [suggestedTripDisabled, setSuggestedTripDisabled] = useState<boolean>(false);
  const [isFilterDataCalled, setIsFilterDataCalled] = useState<boolean>(false);
  const [isShowRaiseExceptionModal, setIsShowRaiseExceptionModal] = useState<boolean>(false);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>('');
  const advancedFilterData = useTypedSelector(state => state.advanceFilter.advancedFilterData)
  const [showAddressUpdateModal, setShowAddressUpdateModal] = useState<boolean>(false);
  const [displayPickup, setDisplayPickup] = useState<boolean>(false);
  const [displayDeliver, setDisplayDeliver] = useState<boolean>(false);
  const [updateAddressData, setUpdateAddressData] = useState<any>({});
  const [updateAddressOrderData, setUpdateAddressOrderData] = useState<any>({});
  const [idStatus, setIdStatus] = useState<string>('')

  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()
  const AdvanceFilterData = {
    sectionName: 'order'
  }
  /** Variables */
  const breadCrumbOptionList = React.useMemo(() => getBreadCrumbOptions(dynamicLabels), [dynamicLabels]);
  const breadCrumbList = [{ id: "orders", label: "Orders", disabled: true }];
  const dynamicBreadcrumbHeader = breadCrumbOptionList.find(
    (option: any) => option.value.toLowerCase() === selectedStatus.toLowerCase()
  );
  dynamicBreadcrumbHeader &&
    breadCrumbList.push({
      id: dynamicBreadcrumbHeader?.id || "",
      label: dynamicBreadcrumbHeader?.label || "",
      disabled: false,
    });
  const filterDateFormatter = React.useCallback((date?: Date) => {
    let formattedDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
    let timezone = JSON.parse(localStorage.getItem('userAccessInfo') || "")['timezone'] || "";
    return moment.tz(formattedDate, "YYYY-MM-DD HH:mm:ss", timezone,).utc().format("YYYY-MM-DD HH:mm:ss");
  }, []);

  useEffect(() => {
    if(actionBarButtons?.More?.childNodes){
      if(!Object.keys(actionBarButtons.More.childNodes).length){
        delete actionBarButtons['More'];             
      }
    }
  });
  const selectedOrderIds = React.useMemo(() => {
    const selectedIds = Object.keys(selectedRows)
    // toggle the activation of assign buttons & tooltip message
    if (selectedIds.length > 0) {
      setEnableAssignNow(true)
      Object.values(selectedRows).forEach((row: any) => {
        if (row?.orderStatus !== "NOTDISPATCHED") {   //added a null check
          setEnableAssignNow(false)
        }
      })
      if (actionBarButtons && actionBarButtons['assignNow']) {
        actionBarButtons['assignNow'].tooltipLabel = dynamicLabels['followingOrdersCannotBeAssignedTrip']
      }
    } else {
      setEnableAssignNow(false)
    }
    return selectedIds
  }, [selectedRows])

  /** Watchers */
  useEffect(() => {
    if (localStorage.getItem('globalSearchText')) {
      setFilters({ "orderId": localStorage.getItem('globalSearchText') || "" })
    }
    let page = getPageSelected();
    setSelectedStatus(page ? page === "allOrders" ? 'ALL' : page : "ALL");
  }, [window.location.hash]);
  useEffect(() => {
    if (isConfirmed) {
      updateStatus();
    }
  }, [isConfirmed])
  useEffect(() => {
    dispatch({
      type: "@@orderListView/FETCH_STRUCTURE",
      payload: { status: selectedStatus },
    });
  }, [selectedStatus, viewMode]);
  useEffect(() => {
    dispatch({
      type: "@@orderListView/SET_DATE_RANGE",
      payload: { dateRange: { startDate: startDate, endDate: endDate } },
    });
  }, [startDate, endDate]);
  useEffect(() => {
    const mongoStructure = columnsSelector;
    if (Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(
        mongoStructure,
        "order",
        cellCallbackMapping
      );
      advanceFilterdispatch({ type: '@@advanceFilter/SET_COLUMNS_SELECTOR', payload: columnsSelector });
      setColumns(newColumns);
      const statusTransformedColumn = newColumns.map((column: any) => {
        const newcolumn = column;
        if (column.accessor === 'orderNo') {
          newcolumn.hrefdata = "`#/order/mileorderhistoryDetailsNew/details?shipment=${row.original.shipmentId}&lat=${row.original.lat}&lng=${row.original.lng}&ordno=${row.original.orderNo}&clientid=${row.original.branchId}&bc_key=allOrders`";
        }
        if (column.accessor === 'tripNo') {
          newcolumn.hrefdata = "`#/tripHst/tripDetails?tripId=${row.original.tripId}&tripName=${row.original.tripNo}`";
        }
        return newcolumn;
      });
      setColumns(statusTransformedColumn);
    }
  }, [columnsSelector]);
  useEffect(() => {
    handleQueryParams()
    handleFetchFilters()
    handleFetchAddressFields()
    setFetchOptions({
      pageNumber: 1,
      pageSize: 25,
      status: selectedStatus,
      startDateFilter: filterDateFormatter(
        startDate
      ),
      endDateFilter: filterDateFormatter(endDate),
    });
    advanceFilterdispatch({
      type: "@@advanceFilter/UPDATE_FIRST_LOAD",
      payload: false,
    });

    return () => {
      if (window.location.hash.indexOf("#/order?") < 0) {
        dispatch({
          type: "@@orderListView/RESET_DATA",
          payload: {
            results: Array(15).fill(0).map((_, i) => ({ orderListViewId: i + 1 })),
            dateRange: {
              startDate: moment().startOf("day").subtract(7, "days").toDate(),
              endDate: moment().endOf("day").toDate()
            }
          }
        })
      }
      advanceFilterdispatch({ type: '@@advanceFilter/SET_FILTERLIST_PAYLOAD', payload: undefined });
      advanceFilterdispatch({ type: '@@advanceFilter/SET_CURRENT_FILTERS', payload: undefined });
      advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: false });
    }

  }, []);

  useEffect(() => {
    setIsNoDataAvailable(!rowsSelector.length && !getQueryParams()?.searchBy && !filterListPayload)
  }, [rowsSelector]);

  /** advance Filter */
  const handleFetchFilters = async (callBackAdvanceFilter = false) => {
    if ((!isFilterDataCalled && ((advancedFilterData.length > 0 && advancedFilterData[0].sectionName != 'ALL_ORDER_LIST_VIEW') || advancedFilterData?.length == 0)) || callBackAdvanceFilter) {
      setIsFilterDataCalled(true)
      try {
        const { data } = await axios.get(apiMappings.advancedSearch.getFilters, {
          params: {
            pageName: 'ORDERS',
            sectionName: `ALL_ORDER_LIST_VIEW`
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

  const handleRemoveFilter = (showToast: boolean) => {
    advanceFilterdispatch({ type: '@@advanceFilter/SET_FILTERLIST_PAYLOAD', payload: undefined });
    advanceFilterdispatch({ type: '@@advanceFilter/SET_CURRENT_FILTERS', payload: undefined });
    advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: false });
    // handleFetchData(fetchOptions)
    showToast && toast.add(dynamicLabels?.filterRemovedSuccessfully, 'check-round', false);
  }

  /** Cell Callbacks */
  const onSaveColumnPreferences = React.useCallback(
    async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {

      const columns = { ...columnsSelector };
      Object.keys(columns).forEach((columnKey) => {
        columns[columnKey].permission = !!visibleColumns[columnKey];
      });

      const payload = {
        ...structure,
        columns,
      };

      const hash = window.location.hash;
      // seperate hash to get params
      const splitedUrl = hash.includes("?") && hash.split("?")[1];
      const params = (splitedUrl ? getUrlVars(splitedUrl) : undefined) as any;
      // find page param
      const page = params && params?.page ? params?.page : undefined;
      const selectedStatus = page ? page === "allOrders" ? 'ALL' : page : "ALL"
      let statusStructureUrl = apiMappings.order.listView.structure;
      statusStructureUrl = statusStructureUrl.replace('${status}', selectedStatus);
      try {

        const {
          data: { message },
        } = await axios.put(statusStructureUrl, payload);
        message && toast.add(message, "check-round", false);
      } catch (error) {
        console.log(error, error?.response);
      }
    },
    [columnsSelector]
  );

  const handleDeliveryProcess = async (row: ISelectedRows) => {
    try {
      const data = await axios.get(apiMappings.order.listView.deliveryProofStructure);
      if (data.data) {
        setDeliveryProofStructure(data.data);
      }
      setSelectedRows(row);
    } catch (error) {
      toast.add('Something Went Wrong', 'error', false);
    }
    setShowDeliveryProofModal(true);
  };
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
  /********  FILTER CHANGE **************/
  const handleFilterChange = (combinedFilters: IFilterOptions) => {

    if (!filterListPayload) {
      let existingParams = getQueryParams()

      /** Do not push to history when there is no change. */
      if ((!combinedFilters.searchBy && !existingParams.searchBy) || (combinedFilters.searchBy === existingParams.searchBy && combinedFilters.searchText === existingParams.searchText)) {
        return
      }
      const newParams = {
        page: existingParams.page || "ALL",
        startDateFilter: moment(startDate).format(`YYYY-MM-DD HH:mm:ss`),
        endDateFilter: moment(endDate).format(`YYYY-MM-DD HH:mm:ss`),
        ...(existingParams.sortBy ? { sortBy: existingParams.sortBy, sortOrder: existingParams.sortOrder } : {}),
        ...(combinedFilters.searchBy ? { searchBy: combinedFilters.searchBy, searchText: combinedFilters.searchText } : {})
      }
      if (!localStorage.getItem("globalSearchText")) {
        setTimeout(() => {
          ngStateRouter.go('order', newParams, { notify: false, reload: false, inherit: false, location: true })
        }, 100)
      }




    }
  }
  /** Inline Edit */
  const validateSelectedRows = () => {
    const columnStructure = columnsSelector;

    try {
      validateRows(editDetails,columnStructure);
      // for validation to have comparison of other values in row, send additional columns
      validateRowSETimes(editDetails, columnStructure, selectedRows, clientProperties?.['DATEFORMAT']?.propertyValue)
    } catch (error) {
      console.log("Inline Edit Validation Failed.", error?.message);
      throwError(error);

      if (error.message) {
        toast.add(error.message, "", false);
      }
      return false;
    }

    return true;
  };
  const handleSaveRows = async () => {
    setDisableSaveButton(true);
    if (!Object.keys(editDetails).length) {
      handleFetchData(fetchOptions);
      setDisableSaveButton(false);
      setEditMode(false);
      setSelectedRows({});
      fetchOptions.apis?.resetSelection();
      dispatch({ type: "@@orderListView/CLEAR_EDIT_DETAILS" });
      return;
    }
    const isValid = validateSelectedRows();
    if (isValid) {
      const payload: Partial<IRowData>[] = [];
      console.log(' in inline edit', selectedRows, editDetails);      
      Object.values(selectedRows).forEach((row) => {
        const obj: any = {
          shipmentId: row.shipmentId,
        };
        let weight: any = undefined, volume: any = undefined;
        
        if (editDetails?.[row.shipmentId]?.['capacityInWeight']) {
            const clientObj = clientMetric?.find(c => c.name === 'weight')
            const val = metricsConversion(parseFloat(editDetails?.[row.shipmentId]?.['capacityInWeight']?.value), 'POST', clientObj?.conversionFactor)
            weight = Number(val)
        }
        if (editDetails?.[row.shipmentId]?.['capacityInVolume']) {
            const clientObj = clientMetric?.find(c => c.name === 'volume')
            const val = metricsConversion(parseFloat(editDetails?.[row.shipmentId]?.['capacityInVolume']?.value), 'POST', clientObj?.conversionFactor)
            volume = Number(val)
        }
        const customField: any = [];
        Object.keys(columnsSelector).forEach((columnId) => {

          if (
            columnsSelector?.[columnId]?.editable
          ) {
            if (columnId === "endTimeWindow" || columnId === "deliverEndTimeWindow" || columnId === "deliverStartTimeWindow" || columnId === "orderDate" || columnId === "pickupEndTimeWindow" || columnId === "pickupStartTimeWindow" || columnId === "startTimeWindow") {
              obj[columnId] = editDetails?.[row.shipmentId]?.[columnId]?.value ? JSON.parse(JSON.stringify(getUTCDateTZ(editDetails?.[row.shipmentId]?.[columnId]?.value))) : null;
            } else if (columnId == "branchName") {
              let branchNameArr = editDetails?.[row.shipmentId]?.[columnId]?.value.split("~@~");
              if (branchNameArr) {
                obj['clientBranchId'] = branchNameArr[0];
                obj[columnId] = branchNameArr[1] || row[columnId];
              }

            } else if (columnsSelector?.[columnId]?.customField) {
              if (editDetails?.[row.shipmentId]?.[columnId]?.value) {
                customField.push({
                  field: columnsSelector?.[columnId]?.id,
                  value: editDetails?.[row.shipmentId]?.[columnId]?.value || row[columnId],
                  type: columnsSelector?.[columnId]?.fieldType
                })
              }
            } else if (columnId === "deliveryType") {
              obj[columnId] = editDetails?.[row.shipmentId]?.[columnId]?.value
            } else if (columnId === 'orderValue') {
              obj['packageValue'] = editDetails?.[row.shipmentId]?.[columnId]?.value
            } else if (columnId === 'capacityInWeight') {
              obj['packageWeight'] = weight
            } else if (columnId === 'capacityInVolume') {
              obj['packageVolume'] = volume
            } else if (columnId === 'pickupNotes' && selectedRows?.[row.shipmentId]?.orderType === "PICKUP"){
              obj['shipmentNotes'] = editDetails?.[row.shipmentId]?.[columnId]?.value
            } else if (columnId === 'deliverNotes' && selectedRows?.[row.shipmentId]?.orderType === "DELIVER"){
              obj['shipmentNotes'] = editDetails?.[row.shipmentId]?.[columnId]?.value
            } else {
              obj[columnId] = editDetails?.[row.shipmentId]?.[columnId]?.value || row[columnId];
            }
            obj['endTimeWindowTZ'] = selectedRows?.[row.shipmentId]?.endTimeWindowTZ;
            obj['startTimeWindowTZ'] = selectedRows?.[row.shipmentId]?.startTimeWindowTZ;
            obj['deliverEndTimeWindowTZ'] = selectedRows?.[row.shipmentId]?.deliverEndTimeWindowTZ;
            obj['deliverStartTimeWindowTZ'] = selectedRows?.[row.shipmentId]?.deliverStartTimeWindowTZ;
            obj['orderDateTZ'] = selectedRows?.[row.shipmentId]?.orderDateTZ;
            obj['pickupStartTimeWindowTZ'] = selectedRows?.[row.shipmentId]?.pickupStartTimeWindowTZ;
            obj['pickupEndTimeWindowTZ'] = selectedRows?.[row.shipmentId]?.pickupEndTimeWindowTZ;
          }
        });

        obj.previousPhoneNumber = row.phoneNumber;
        obj.customFields = customField;
        payload.push(obj);
        //  }
      });


      if (!payload.length) {
        handleCancelRows();
        return;
      }

      try {
        const {
          data: { message, status },
        } = await axios.put(apiMappings.order.listView.inlineUpdateFmlm, payload);
        if (status === 200) {

          handleFetchData(fetchOptions);
          setEditMode(false);
          setSelectedRows({});
          setDisableSaveButton(false);
          fetchOptions.apis?.resetSelection();
          dispatch({ type: "@@orderListView/CLEAR_EDIT_DETAILS" });
          toast.add(message, "check-round", false);
          return;
        }
        throw message;
      } catch (errorMessage) {
        setDisableSaveButton(false);
        const message = errorMessage?.response?.data?.message;
        toast.add(
          message || dynamicLabels.somethingWendWrong,
          "warning",
          false
        );
      }
    } else {
      setDisableSaveButton(false)
    }
  };
  const handleCancelRows = React.useCallback(() => {
    let editDetails = store.getState().order.listView.editDetails;
    if (Object.keys(editDetails).length) {
      globalPopupDispatch({
        type: '@@globalPopup/SET_PROPS',
        payload: {
          isOpen: true,
          title: dynamicLabels.confirmation || "Confirmation",
          content: dynamicLabels.cancelConfirmationWarning,
          footer: (
            <>
              <IconButton iconVariant='icomoon-tick-circled' primary onClick={() => {
                globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })
                dispatch({ type: "@@orderListView/CLEAR_EDIT_DETAILS" });
                setEditMode(false);
                fetchOptions.apis?.resetSelection();
                setSelectedRows({});
              }}>{dynamicLabels.ok}</IconButton>
              <IconButton iconVariant='icomoon-close' onClick={() => globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })}>{dynamicLabels.cancel}</IconButton>
            </>
          )
        }
      })

    } else {
      dispatch({ type: "@@orderListView/CLEAR_EDIT_DETAILS" });
      setEditMode(false);
      fetchOptions.apis?.resetSelection();
      setSelectedRows({});
    }


  }, [fetchOptions]);
  /** Delete Request */
  const deleteSelectedRows = async () => {
    let inTransit = false;
    Object.values(selectedRows).map((row) => {
      inTransit = row.orderStatus === 'INTRANSIT' ? true : false
    })
    if (inTransit) {
      toast.add('‘In-transit’ orders cannot be deleted', "warning", false);
      return
    } else {
      setShowDeletionConfirmation(true);

    }

    if (showDeletionConfirmation) {
      setShowDeletionConfirmation(false);
      const shipment_ids = Object.values(selectedRows).map((row) => Number(row.shipmentId))
      try {
        const data = await axios.delete(`${apiMappings.order.listView.deleteRequest}${shipment_ids.join()}`);
        const message = 'Id does not exist'
        const status = data?.status
        if (status === 200) {
          toast.add(data.data.message ? data.data.message : "Success", "check-round", false);
          setSelectedRows({});
          fetchOptions.apis?.resetSelection();
          handleFetchData(fetchOptions);
          setShowDeletionConfirmation(false);
          return;
        }
        throw message;
      } catch (errorMessage) {
        console.log("Failed to Delete orders: ", errorMessage);
        toast.add(dynamicLabels.somethingWendWrong, "warning", false);
      }
    }

  };
  const handleMoreOptions = React.useCallback(

    async (id: string) => {
      setIsAttemptedDate(false);
      if (id === "markAs") {
        return;
      }
      let type: string = '';
      sendGA('Event New', `Orders - ${id}-record`)
      switch (id) {
        case 'cancelled':
          type = 'CANCELREASONS';
          break;
        case 'delivered':
          type = '';
          break;
        case 'intransit':
          type = '';
          mark_as_intransit();
          break;
        case 'notDelivered':
          setIsAttemptedDate(true)
          type = 'NOTDELIVERED';
          break;
        case 'notDispatched':
          type = '';
          break;
        case 'notPickedUp':
          setIsAttemptedDate(true)
          type = 'NOTPICKEDUP';
          break;
        case 'pickedUp':
          type = '';
          break;
        case 'return':
          type = '';
          break;
        case 'rtm':
          type = '';
          break;
        case 'default':
          type = "";
          break;
      }
      if (id != "intransit") {
        if (type) {
          try {
            const res = await axios.get(apiMappings.order.listView.getReasons, {
              params: {
                type: type
              }
            })
            if (res.status === 200) {
              setReasonMessage(res.data);
              setIsShowReasonModal(true);
            } else {
              throw res
            }
          } catch (error) {
            toast.add(error?.message || dynamicLabels.somethingWendWrong, '', false)
          }
        } else {
          setShowConfirmationModal(true);
        }
        setChangedStatus(id);
        console.log("Handle switch logic for -", id);
      }

    },
    [selectedRows, dynamicLabels]
  );
  const handleOverrideStatusOptions = React.useCallback(
    async (id: string) => {
      sendGA('Event New', `Orders - ${id}-record`)
      setIsOverrideStatus(true);
      let type: string = '';
      switch (id) {
        case 'cancelled':
          type = 'OVERRIDECANCELREASONS';
          break;
        case 'delivered':
          type = 'OVERRIDEDELIVEREDREASONS';
          break;
        case 'notDelivered':
          type = 'OVERRIDENOTDELIVEREDREASONS';
          break;
        case 'notDispatched':
          type = 'OVERRIDENOTDISPACTHEDREASONS';
          break;
        case 'default':
          type = "";
          break;
      }
      if (type) {
        try {
          const res = await axios.get(apiMappings.order.listView.getReasons, {
            params: {
              type: type
            }
          })
          if (res.status === 200) {
            setReasonMessage(res.data);
            setIsShowReasonModal(true);
          } else {
            throw res
          }
        } catch (error) {
          toast.add(error?.message || dynamicLabels.somethingWendWrong, '', false)
        }
      } else {
        setShowConfirmationModal(true);
      }
      setChangedStatus(id);
    }, [selectedRows, dynamicLabels]
  );
  const updateCustomerNotificationTemplates = async function (templateDataIndex: string, type: string) {
    if (type.indexOf('Notification') > -1) {
      type = type.split('Notification')[0];
    }
    type = type.toUpperCase();
    setNotifyTemplateData(notificationData[templateDataIndex]);
  };
  const handleNotifyCustomer = React.useCallback(
    async (index: string) => {
      if (index) {
        updateCustomerNotificationTemplates(index, "Order");
        setCustomerNotifyType(true);
      }
      // updateCustomerNotificationTemplates(index, "Order");
      // setCustomerNotifyType(true);
    }, [selectedRows, dynamicLabels]
  )
  /** List View Callbacks */
  const handleFetchData = React.useCallback(
    ({
      dataFetchMode,
      endDateFilter,
      pageSize,
      pageNumber,
      startDateFilter,
      sortOptions,
      filterOptions,
      apis,
      removeFilterForControlTower
    }: IOrderFetchDataOptions) => {

      sortOptions = handleCustomColumnSort(sortOptions)
      dispatch({
        type: "@@orderListView/SET_LOADING",
        payload: { listView: true },
      });
      setFetchOptions({
        dataFetchMode,
        endDateFilter: endDateFilter || filterDateFormatter(endDate),
        pageSize,
        pageNumber,
        status: getQueryParams().page || selectedStatus,
        startDateFilter: startDateFilter ||
          filterDateFormatter(startDate),
        sortOptions,
        filterOptions,
        apis,
      });

      dispatch({
        type: "@@orderListView/FETCH_DATA",
        payload: {
          dataFetchMode: "DATA",
          endDateFilter: endDateFilter || filterDateFormatter(endDate),
          pageNumber: pageNumber,
          pageSize: pageSize,
          status: getQueryParams().page == "allOrders" ? "ALL" : getQueryParams().page || selectedStatus,
          startDateFilter: startDateFilter || filterDateFormatter(startDate),
          searchBy: localStorage.getItem('globalSearchText') ? "orderNo" : filterOptions?.searchBy,
          searchText: localStorage.getItem('globalSearchText') ? localStorage.getItem('globalSearchText') || "" : filterOptions?.searchText,
          sortBy: sortOptions?.sortBy,
          sortOrder: sortOptions?.sortOrder,
          filterDataList: filterListPayload,
          dataFromControlTower: removeFilterForControlTower ? {} : { ...getQueryParams() }

        },
      });
      if (1 === pageNumber) {
      dispatch({
        type: "@@orderListView/FETCH_COUNT",
        payload: {
          dataFetchMode: "COUNT",
          endDateFilter: endDateFilter || filterDateFormatter(endDate),
          pageNumber: pageNumber,
          pageSize: pageSize,
          status: getQueryParams().page == "allOrders" ? "ALL" : getQueryParams().page || selectedStatus,
          startDateFilter: startDateFilter || filterDateFormatter(startDate),
          searchBy: filterOptions?.searchBy,
          searchText: filterOptions?.searchText,
          sortBy: sortOptions?.sortBy,
          sortOrder: sortOptions?.sortOrder,
          filterDataList: filterListPayload,
          dataFromControlTower: removeFilterForControlTower ? {} : { ...getQueryParams() }
        },
      });
    }
    }, [startDate, endDate, filterListPayload])

  const handleLastTrackingColumnCall = async (row: any) => {
    let lastTrackRoute =`order/locationhistory?page=orders&bc_key=allorders`
    if(row.tripId) lastTrackRoute += `&tripId=${row.tripId}`
    if(row.tripNo) lastTrackRoute += `&tripName=${row.tripNo}`
    if(row.shipmentId) lastTrackRoute += `&shipmentId=${row.shipmentId}`
    if(row.endDt) lastTrackRoute += `&endDt=${row.endDt}`
    if(row.startDt) lastTrackRoute += `&startDt=${row.startDt}`
    if(row.lat) lastTrackRoute += `&lat=${row.lat}`
    if(row.lng) lastTrackRoute += `&long=${row.lng}`
    if(row.destLatitude) lastTrackRoute += `&hublat=${row.destLatitude}`
    if(row.destLongitude) lastTrackRoute += `&hublng=${row.destLongitude}`
    hybridRouteTo(lastTrackRoute)
  }

  const handleEstimatedCost = async (row: any) => {
    try {
      const structureData = await axios.get(apiMappings.order.listView.estimateCost);
      if (structureData) {
        setHandleEstimatedCostStructure(structureData.data)
      }
    }
    catch (error) {
      console.log(error);
    }

    try {
      const param = {
        shipmentId: row.shipmentId,
        shippingCostType: 'ESTIMATED'
      }
      const data = await axios.post(`ShipmentApp/shipment/fmlm/getCostCalculationForShipment?shipmentId=${row.shipmentId}&shippingCostType=ESTIMATED`, param)
      if (data.data) {
        setHandleEstimatedCostData(data.data.data);
      }
    } catch (error) {
      console.log(error);
    }
    setShowEstimateCostModal(true);
    return;
  }

  const handleActualCost = (row: any) => {
    openShippingCostPopup(row.shipmentId)
  }
  ///// FILTERS

  const onRowSelect = React.useCallback((s: ISelectedRows) => {
    setSelectedRows(s);
    dispatch({
      type: "@@orderListView/SELECTEDROWS",
      payload: s,
    });

    if (Object.keys(s).length == 1 && (Object.values(s)[0]?.orderStatus == "INTRANSIT" || Object.values(s)[0]?.orderStatus == "NOTDISPATCHED")) {
      setSuggestedTripDisabled(false);
    } else {
      setSuggestedTripDisabled(true);
    }

  }, []);

  const onSortChange = (sortOptions: ISortOptions) => {
    const existingParams = getQueryParams()

    /** Do not push to history when there is no change. */
    if ((!sortOptions.sortBy && !existingParams.sortBy) || (sortOptions.sortBy === existingParams.sortBy && sortOptions.sortOrder === existingParams.sortOrder)) {
      return
    }

    /** Construct new set of Query Params */
    const newParams = {
      page: existingParams.page || "ALL",
      startDateFilter: moment(startDate)?.format(`YYYY-MM-DD HH:mm:ss`),
      endDateFilter: moment(endDate)?.format(`YYYY-MM-DD HH:mm:ss`),
      ...(sortOptions.sortBy ? { sortBy: sortOptions.sortBy, sortOrder: sortOptions.sortOrder } : {}),
      ...(existingParams.searchBy ? { searchBy: existingParams.searchBy, searchText: existingParams.searchText } : {})
    }

    setTimeout(() => {
      ngStateRouter.go('order', newParams, { notify: false, reload: false, inherit: false, location: true })
    }, 2000)
  }



  const handleActionBarButtonClick = React.useCallback((id: string) => {
    sendGA('Event New', `Orders - ${id}-record`)
    if (id.indexOf("notifyCustomer") > -1) {
      let index = id.split("_")[1];
      handleNotifyCustomer(index);
    } else {
      switch (id) {
        case "delete":
          deleteSelectedRows();
          break;
        case "update":
          let showToaster = true;
          let isEditable = true;
          Object.values(selectedRows).forEach((row: any) => {
            if (row.orderStatus === "NOTDISPATCHED" || (row.orderStatus === "INTRANSIT" && userAccessInfo['superType'] !== 'MIDDLEMILE') || (row.orderStatus === 'PICKEDUP' && row.orderType === 'DELIVER')) {
              showToaster = false;
            } else {
              isEditable = false;  
              showToaster && toast.add(dynamicLabels['inline_update_invalid_status'] && userAccessInfo['superType'] !== 'MIDDLEMILE' ? dynamicLabels['inline_update_invalid_status'] : dynamicLabels.youCanUpdateOnlyNotDispatchedOrders || 'You can update only Not Dispatched Packages.', "warning", false);
              return;
            }            
          })
          if (isEditable) {
            setEditMode(true);
          }
          break;
        case "bulkUpdate":
          bulkUpdate();
          break;
        case "cloneOrder":
          if (Object.keys(selectedRows).length > 1) {
            toast.add(dynamicLabels.live_assignSequenceOneOrderAtATime, "warning", false);
            return;
          } else {
            orderFormDispatch({ type: '@@addOrderForm/SET_ORDER_CLONED', payload: true})
            handleCloneOrder(selectedRows, ngStateRouter);
          }
          break;
        case "updateStatus":
          toggle_DLC_modal(selectedRows)
          break;
        case "manualAssign":
          manualAssignmentCallBack(selectedRows);
          break;
        case "notify":
          notifyClick();
          break;
        case "optimizePacking":
          optimizePacking();
          break;
        case "printAwb":
          //printAwb(selectedRows, fetchOptions, dynamicLabels);
          if (printAWBData.templates.length > 0) {
            dispatch({ type: '@@orderListView/SET_AWB_MODAL_OPEN', payload: true })
          } else {
            toast.add(dynamicLabels.printAwbNoTemplates, "warning", false);
          }
          break;
        case 'cancelled':
        case 'delivered':
        case 'notDelivered':
        case 'notDispatched':
          handleOverrideStatusOptions(id)
          break;
        case "raiseException":
          setIsShowRaiseExceptionModal(true);
          break;
        case "updateorderAddress":
          if (Object.keys(selectedRows).length > 1) {
            toast.add(dynamicLabels.live_assignSequenceOneOrderAtATime, "warning", false);
            return;
          } else {
            updateorderAddress();
          }
          break;
        case "more":
          break;

      }
    }

  }, [selectedRows]);

  const optimizePacking = async function () {
    let isCount = false;
    let crateStructure = clientProperties?.['CRATESTRUCTURE'];
    if (crateStructure && crateStructure?.propertyValue !== 'CRATEITEM') {
      toast.add("Packing optimization is only supported for Crates with Items.", "warning", false);
      return;
    }
    let selectedRecords: any = [];
    var invalidStatus = false
    Object.values(selectedRows).map(function (value) {
      if (!value.noOfItems || value.noOfItems == 0) {
        isCount = true;
      }
      if (value.orderStatus == "NOTDISPATCHED" && value.noOfItems) {
        selectedRecords.push(value.shipmentId);
      } else {
        invalidStatus = true;
      }
    })
    if (invalidStatus) {
      let orderNum: any = [];
      Object.values(selectedRows).map(function (value) {
        if (value.orderStatus != "NOTDISPATCHED") {
          orderNum.push(value.orderNo)
        }
      })
      toast.add("You can optimize only Not Dispatched orders " + orderNum.join(",") + "", "warning", false);
    }
    if (isCount) {
      toast.add("Crate details are mandatory for packing optimization", 'failure', false);
    }
    if (selectedRecords.length != 0) {
      const data = await axios.post(apiMappings.order.listView.bulkOptimize, selectedRecords);

      if (data.data) {
        toast.add(dynamicLabels.bulkOptmizeInprogressMessage, 'check-round', false);
      }
    }

  }
  const notifyClick = () => {
    let notifyList: any = [];
    let count = 0;
    Object.values(selectedRows).map(function (e) {
      if (e.orderStatus == 'DELIVERED' || e.deliveryMediumMasterId == undefined || e.deliveryMediumMasterId == null) {
        count += 1
      } else {
        notifyList.push({ "name": e.orderNo, "id": e.deliveryMediumMasterId });
      }
    })

    if (count == 0) {
      setShowNotifyFleetModal(true);
      setNotifyList(notifyList);
    } else {
      toast.add(dynamicLabels.orderNotifyErrorPrompt, 'warning', false);
    }
  }

  const handleAssignNow = () => {
    sendGA('Event New', `Orders - Assign Now`)
    // if any not dispatched entry found in selection show warning else open modal
    if (!enableAssignNow) {
      // deselect not dispatched value-pending
      toast.add(dynamicLabels['followingOrdersCannotBeAssignedTrip'], 'warning', false)
      setSelectedRows({});
      fetchOptions.apis?.resetSelection();
    } else {
      setIsMarkAsIntransit(false);
      setAssignDAModal(true)
      setTripDate("");
      setTripData("");
    }
  }
  const manualAssign = (tripData: any) => {
    setTripData(tripData);
  }
  const manualAssignClick = () => {

    if (!Object.keys(tripData).length) {
      toast.add(dynamicLabels.pleaseSelectTrip, "warning", false);
    } else {
      setAssignDAModal(false);
      let isNearest = "";
      let startAndAssign = "";
      manualAssignOrdersToTrip(selectedRows, tripData, isNearest, 'assign', startAndAssign)
    }
  }
  const manualAssignOrdersToTrip = async (selectedOrder: any, tripData: any, _isNearest: string, mode: string, _startAndAssign: string) => {
    let formData: any[] = [];
    var getPayload = function (row: any) {
      var assignmentMode = (mode == "assignToDb") ? mode : 'assignToTrip';
      var oldAssignToId = (mode == "assignToDb") ? null : selectedRows[row]['tripId'];
      var newAssignToId = (mode == "assignToDb") ? tripData['deliveryMediumMasterId'] : (tripData ? tripData[Object.keys(tripData)[0]].tripId : null);
      formData = formData.concat(_generateTwoLegs(selectedRows[row], assignmentMode, oldAssignToId, newAssignToId));

    }

    Object.keys(selectedOrder).map(function (key: any) {
      getPayload(key);
    })
    try {
      let url = apiMappings.order.listView.manualAssign;
      if (tripDate) {
        const tripDateFormat = moment(tripDate).format('YYYY-MM-DD HH:mm:ss');
        const timezone = clientProperties?.TIMEZONE?.propertyValue;
        url = `${url}&startNow=true&tripStartDt=${moment.tz(tripDateFormat, timezone).utc().format('YYYY-MM-DD HH:mm:ss')}`;
      } else if (isMarkAsIntransit) {
        url = `${url}&startNow=true`
      }
      const response = await axios.post(url, formData);
      if (response && response.status == 200) {

        handleFetchData(fetchOptions);
        setSelectedRows({});
         //53041 trip name and data show undefine
        // setTripDate("");
        // setTripData("");
        fetchOptions.apis?.resetSelection();
        if (!isMarkAsIntransit && !neverShowTripDateChangePopup && tripData[Object.keys(tripData)[0]].tripStatus === "NOTSTARTED") {
          if (!response.data.hasError) {
            setShowTripDateChangeModal(true);
          } else { toast.add(response.data.message, 'check-round', false); }
        } else {
          toast.add(response.data.message, 'check-round', false);
        }

      } else {
        setTripDate("");
        toast.add(response.data.message, "success", false);
      }
    } catch (error) {
      toast.add(dynamicLabels.somethingWendWrong, "warning", false);
    }
  }
  const bulkUpdate = () => {
    if (Object.keys(selectedRows).length > 200) {
      toast.add(dynamicLabels.orderUpdateError, 'error', false);
      return;
    }
    if (Object.keys(selectedRows).length < 1) {
      toast.add(dynamicLabels.pleaseSelectAtLeastAnOrder, 'error', false);
      return;
    }
    var count = 0;
    var p2pCount = 0;
    var rowCount = 0;
    const selectedShipmentId: any = [];
    Object.keys(selectedRows).map((key) => {
      const PickedupWithDeliverType = selectedRows[key].orderStatus === 'PICKEDUP' && selectedRows[key].orderType === 'DELIVER'
      rowCount++;
      selectedShipmentId.push(selectedRows[key].shipmentId);
      if (!isP2POrder) {
        selectedRows[key].isP2POrder ? setIsP2POrder(true) : setIsP2POrder(false);
      }
      if (selectedRows[key].isP2POrder) {
        p2pCount++;
      }
      if (selectedRows[key].orderStatus !== 'NOTDISPATCHED' && selectedRows[key].orderStatus !== 'INTRANSIT' &&  !PickedupWithDeliverType &&  userAccessInfo['superType'] !== 'MIDDLEMILE') {
        count += 1
      }
      if (selectedRows[key].orderStatus !== 'NOTDISPATCHED' &&  !PickedupWithDeliverType &&  userAccessInfo['superType'] === 'MIDDLEMILE') {
        count += 1
      }
    })
    const selectedStatus = [...Array.from(new Set(Object.values(selectedRows).map((ord: any) => ord.orderStatus)))]
    if (selectedStatus.length > 1) {
      toast.add(dynamicLabels.FMLM_BULK_UPDATE_DIFFERENT_ORDER_STATUS, "warning", false);
      return;
    } else {
      setSelectedOrderStatus(selectedStatus[0]);
    }
    
    if ((p2pCount > 0 && p2pCount !== rowCount)) {
      toast.add(dynamicLabels.selectSameTypeOfOrder, "warning", false);
      setShowBulkUploadModal(false);
    }

    if (count > 0 && userAccessInfo['superType'] !== 'MIDDLEMILE') {
      toast.add(dynamicLabels['inline_update_invalid_status'] || "You can update only Not Dispatched and Intransit orders", "warning", false);
      return;
    }
    if (count > 0 && userAccessInfo['superType'] === 'MIDDLEMILE') {
      toast.add(dynamicLabels.youCanUpdateOnlyNotDispatchedOrders, "warning", false);
      return;
    }
    if (!(p2pCount > 0 && p2pCount !== rowCount) && !count) {
      if (userAccessInfo['superType'] === 'MIDDLEMILE') {        
        setShowBulkUploadModal(true);
      } else {
        setShowBulkUploadModalFmlm(true);
      }
    }

    if (userAccessInfo['superType'] === 'MIDDLEMILE') {        
      setShowBulkUploadModal(true);
    } else {
      setShowBulkUploadModalFmlm(true);
    }
    return;
  }
  const updateorderAddress = async function () {
    let count = 0;
    setDisplayDeliver(false)
    setDisplayPickup(false)
    let selectRowObj = selectedRows[Object.keys(selectedRows)[0]]
    Object.keys(selectedRows).map((key) => {
      if ((selectedRows[key].orderType === 'DELIVER' && selectedRows[key].orderStatus !== 'PICKEDUP') && selectedRows[key].orderStatus !== 'NOTDISPATCHED' && selectedRows[key].orderStatus !== 'INTRANSIT' &&  userAccessInfo['superType'] !== 'MIDDLEMILE') {
        count += 1
      }
    })
    if (count > 0 && userAccessInfo['superType'] !== 'MIDDLEMILE') {
      toast.add(dynamicLabels['inline_update_invalid_status'] || "You can update only Not Dispatched and Intransit orders", "warning", false);
      return;
    }
    else {
      dispatch({type: '@@orderListView/FETCH_ALL_ORDER_ADDRESS_UPDATE_LIST'});
        const { data } = await axios.get(`${apiMappings.order.listView.getCustomerOrderAddress}?shipmentId=${selectedRows[Object.keys(selectedRows)[0]].shipmentId}`)
        if (data) {
          if (data.data && data.data['pickup'] && data.data['pickup']['country'] !== "") {
            data.data['pickup']['country'] = { id: data.data['pickup']['countryId'], name: data.data['pickup']['country'], displayName: data.data['pickup']['country'], code: "", googleCountryCode: "" }
            if (data.data['pickup']['state'] !== "") {
                data.data['pickup']['state'] = { id: data.data['pickup']['stateId'], name: data.data['pickup']['state'], displayName: data.data['pickup']['state'], code: "", countryCode: "", countryId: data.data['pickup']['countryID'] }
            }
          }
          if (data.data && data.data['deliver'] && data.data['deliver']['country'] !== "") {
              data.data['deliver']['country'] = { id: data.data['deliver']['countryId'], name: data.data['deliver']['country'], displayName: data.data['deliver']['country'], code: "", googleCountryCode: "" }
              if (data.data['deliver']['state'] !== "") {
                  data.data['deliver']['state'] = { id: data.data['deliver']['stateId'], name: data.data['deliver']['state'], displayName: data.data['deliver']['state'], code: "", countryCode: "", countryId: data.data['deliver']['countryID'] }
              }
          }
          if (data.data && data.data['pickup'] && data.data['pickup']['pincode'] && data.data['pickup']['pincode'] !== "") {
            data.data['pickup']['pincode'] = { displayName: data.data['pickup']['pincode'], name: data.data['pickup']['pincode'], pincode: data.data['pickup']['pincode'], pincodeId: data.data['pickup']['pincodeId'], id: data.data['pickup']['pincodeId'], pincode_lable: data.data['pickup']['pincode'] }
          }
          if (data.data && data.data['deliver'] && data.data['deliver']['pincode'] && data.data['deliver']['pincode'] !== "") {
              data.data['deliver']['pincode'] = { displayName: data.data['deliver']['pincode'], name: data.data['deliver']['pincode'], pincode: data.data['deliver']['pincode'], pincodeId: data.data['deliver']['pincodeId'], id: data.data['deliver']['pincodeId'], pincode_lable: data.data['deliver']['pincode'] }
          }
          if(data.data && data.data['relatedDeliveries'] && data.data['relatedDeliveries'].length){
            data.data['relatedDeliveries'].map((order: any ) => {
              order.startTimeWindow = getFormattedDate(order.startTimeWindow,'')
              order.endTimeWindow = getFormattedDate(order.endTimeWindow,'')
            })
          }
          if(data.data && data.data['relatedPickups'] && data.data['relatedPickups'].length){
            data.data['relatedPickups'].map((order: any ) => {
              order.startTimeWindow = getFormattedDate(order.startTimeWindow,'')
              order.endTimeWindow = getFormattedDate(order.endTimeWindow,'')
            })
          }
          if (selectRowObj.orderType == 'PICKUP' && (selectRowObj.orderStatus == "NOTDISPATCHED" || selectRowObj.orderStatus == "INTRANSIT")) {
            setDisplayPickup(true);
            setUpdateAddressOrderData(selectRowObj)
          } else if (selectRowObj.orderType == 'DELIVER' && (selectRowObj.orderStatus == "NOTDISPATCHED"  || selectRowObj.orderStatus == "INTRANSIT" || selectRowObj.orderStatus == "PICKEDUP") && !selectRowObj.isP2POrder) {
            setDisplayDeliver(true);
            setUpdateAddressOrderData(selectRowObj)
          } else if (selectRowObj.orderType == 'DELIVER') {
              if (selectRowObj['isP2POrder']) {
                if (selectRowObj.orderStatus == "NOTDISPATCHED" || selectRowObj.orderStatus == "INTRANSIT") {
                  setDisplayPickup(true);
                  setDisplayDeliver(true);
                  let selectRowObjTemp ={...selectRowObj}
                  selectRowObjTemp['listData'] = {}
                  selectRowObjTemp['listData'] = data.data
                  setUpdateAddressOrderData(selectRowObjTemp)
                }
                if (selectRowObj.orderStatus == "PICKEDUP") {
                  setDisplayDeliver(true);
                  setUpdateAddressOrderData(selectRowObj)
                }
              }
          } else {
            toast.add(dynamicLabels['inline_update_invalid_status'] || "You can update only Not Dispatched and Intransit orders", "warning", false);
            return;
          }
        let addressData = {}
        if ((selectRowObj.orderType == 'PICKUP' && (selectRowObj.orderStatus == "NOTDISPATCHED" || selectRowObj.orderStatus == "INTRANSIT")) || 
          (selectRowObj['isP2POrder'] && (selectRowObj.orderStatus == "NOTDISPATCHED" || selectRowObj.orderStatus == "INTRANSIT"))) {
            let pickupData = data.data?.['pickup']
            pickupData['State'] = pickupData['state']
            addressData = pickupData
            addressData['orderRowData'] = []
            addressData['orderRowData'] = data.data?.['relatedPickups'] ? data.data?.['relatedPickups'] : []
            setUpdateAddressData(addressData)
        } else {
            let deliverData = data.data?.['deliver']
            deliverData['State'] = deliverData['state']
            addressData = deliverData
            addressData['orderRowData'] = []
            addressData['orderRowData'] = data.data?.['relatedDeliveries'] ? data.data?.['relatedDeliveries'] : []
            setUpdateAddressData(addressData)
        }
        }
      setShowAddressUpdateModal(true)
    }
  }
  const successCallBack = () => {
    setSelectedRows({});
    fetchOptions.apis?.resetSelection();
    handleFetchData(fetchOptions);
  }

  const handleGeocoding = (row: ISelectedRows) => {
    setSelectedRows(row);
    setIsGeocodeModal(true);
  }

  const handleCrateLinePopup = (row: ISelectedRows) => {
    renderOrderCrateModal(row.shipmentId, row);
  }

  const cellCallbackMapping = {
    orderNo: handleOrderNumberClick,
    tripNo: handleTripNumberClick,
    trackNow: handleTrackNow,
    deliveryProcess: handleDeliveryProcess,
    estimatedCost: handleEstimatedCost,
    lastTrackingDt: handleLastTrackingColumnCall,
    actualCost: handleActualCost,
    isGeocoded: handleGeocoding,
    noOfItems: handleCrateLinePopup
  };


  const globalPopup = useGlobalPopup()

  const mark_as_intransit = () => {
    var isTripNotAssociated = false;
    var throwErrorStatus = false;
    Object.values(selectedRows).map(function (e) {
      if (!e.tripId) {
        isTripNotAssociated = true;
      }
      if (e.orderStatus != 'NOTDISPATCHED') {
        throwErrorStatus = true;
      }
    })
    if (isTripNotAssociated && !throwErrorStatus) {
      assignNow();
    } else if (!throwErrorStatus) {
      setShowTripDateChangePopupMarkIntransitModal(true)
    } else {
      toast.add(dynamicLabels.youCanUpdateOnlyNotDispatchedOrders, 'warning', false);
    }
  }

  const assignNow = () => {
    if(!enableAssignNow){
      toast.add(dynamicLabels.followingOrdersCannotBeAssignedTrip, 'error', false);
    }
    setAssignDAModal(true)
    setTripDate("");
    setTripData("");
    setIsMarkAsIntransit(true)
  }



  const updateStatus = async () => {
    let customFields: any = [];
    let payload: any = Object.keys(selectedRows).map((key) => {
    let timezone = selectedRows[key]?.startTimeWindowTZ || "";
      if (dateInAttemptedStatus?.length || dateInAttemptedStatus?.["general details"]) {
        Object.values(dateInAttemptedStatus["general details"]).map(function (key: any) {
          let data = {};
          switch (key.id) {
            case "deliverEndTimeWindow":
              if (reasonSelectedValue.attemptedDate.deliverEndTime) {
                data = {
                  "field": key.id,
                  "value": JSON.parse(JSON.stringify(getUTCDateTZ(reasonSelectedValue.attemptedDate.deliverEndTime, clientProperties?.DATEFORMAT.propertyValue.toUpperCase() + ' HH:mm', timezone))),
                  "type": key?.fieldType
                }

                customFields.push(data);
              }
              return
            case "deliverStartTimeWindow":
              if (reasonSelectedValue.attemptedDate.deliverStartTime) {
                data = {
                  "field": key.id,
                  "value": JSON.parse(JSON.stringify(getUTCDateTZ(reasonSelectedValue.attemptedDate.deliverStartTime, clientProperties?.DATEFORMAT.propertyValue.toUpperCase() + ' HH:mm', timezone))),
                  "type": key.fieldType
                }
                customFields.push(data);
              }

              return
            case "pickupEndTimeWindow":
              if (reasonSelectedValue.attemptedDate.pickupEndTime) {
                data = {
                  "field": key.id,
                  "value": JSON.parse(JSON.stringify(getUTCDateTZ(reasonSelectedValue.attemptedDate.pickupEndTime, clientProperties?.DATEFORMAT.propertyValue.toUpperCase() + ' HH:mm', timezone))),
                  "type": key.fieldType
                }
                customFields.push(data);
              }

              return
            case "pickupStartTimeWindow":
              if (reasonSelectedValue.attemptedDate.pickupStartTime) {
                data = {
                  "field": key.id,
                  "value": JSON.parse(JSON.stringify(getUTCDateTZ(reasonSelectedValue.attemptedDate.pickupStartTime, clientProperties?.DATEFORMAT.propertyValue.toUpperCase() + ' HH:mm', timezone))),
                  "type": key.fieldType
                }
                customFields.push(data);
              }

              return
          }
        })
      }


      const requestObject = {
        currentStatus: changedStatus.toUpperCase(),
        reason: reasonSelectedValue?.reason == "Other" ? reasonOtherMessage : reasonSelectedValue?.reason,
        reasonId: reasonSelectedValue?.reasonId,
        reasonSelected: reasonSelectedValue?.reason,
        shipmentId: parseInt(key),
        customFields: customFields
      }
      if (reasonSelectedValue?.reasonCd.toLowerCase().includes('reschedule') && rescheduledDate && selectedRows[key].orderType === 'DELIVER') {
        requestObject['rescheduledOrderDate'] = `${moment(rescheduledDate).format('YYYY-MM-DD')}T00:00:00`;
        requestObject['orderNo'] = selectedRows[key].orderNo;
      }

      return requestObject;

    })

    let url: string = ""
    if (isOverrideStatus) {
      url = apiMappings.order.listView.overrideStatus;
    } else {
      url = apiMappings.order.listView.changeStatus;
    }
    setIsOverrideStatus(false);
    setIsShowReasonModal(false);
    setIsConfirmed(false);
    setRescheduledDate(undefined);
    setReasonOtherMessage("");

    const data = await axios.put(`${url}?status=${changedStatus.toUpperCase()}`, payload);
    if (data.status === 200 && !data.data.hasError) {
      toast.add(data.data.message, 'check-round', false);
      setReasonSelectedValue({ reason: '', reasonId: '', reasonCd: '', attemptedDate: { pickupStartTime: "", pickupEndTime: "", deliverStartTime: "", deliverEndTime: "" } })
      handleFetchData(fetchOptions);
      fetchOptions.apis?.resetSelection();
    } else {
      toast.add(data.data.message, "warning", false);
      setReasonSelectedValue({ reason: '', reasonId: '', reasonCd: '', attemptedDate: { pickupStartTime: "", pickupEndTime: "", deliverStartTime: "", deliverEndTime: "" } })
    }

  }
  const handleFetchAddressFields = async () => {
    dispatch({type: '@@orderListView/FETCH_UPDATE_ADDRESS_STRUCTURE'});
  }
  const saveUpdatedAddress = async (payload:any, showSuccess: any, orderType: string) => {
    try {
      let url = apiMappings.order.listView.updateShipmentAddress;
      const response = await axios.put(url, payload);
      if (response && response.status == 200) {
        handleFetchData(fetchOptions);
        setSelectedRows({});
        fetchOptions.apis?.resetSelection();
          if (!response.data.hasError) {
            if(showSuccess){
              setShowAddressUpdateModal(false);
            }
            toast.add((orderType === 'PICKUP' ? dynamicLabels['PICKUP_ADDRESS_UPDATE_SUCCESS_MSG'] : dynamicLabels['DELIVER_ADDRESS_UPDATE_SUCCESS_MSG']), 'check-round', false)
          } else { toast.add(response.data.message, 'check-round', false); }
        } else {
          toast.add(response.data.message, 'check-round', false);
        }
    } catch (error) {
      toast.add(dynamicLabels.somethingWendWrong, "warning", false);
    }
  }
  //   const buttonToolTipTextList = {
  //     // 'assignNow', 'manualAssign', 'bulkUpdate', 'updateOrder', 'markAs', 'Notify','More'
  //     assignNow: ` ${dynamicLabels?.assign}.`,
  //     manualAssign: `${dynamicLabels?.suggestTrip}.`,
  //     bulkUpdate: `${dynamicLabels?.bulkUpdate}.`,
  //     updateOrder: `${dynamicLabels?.update}.`,
  //     markAs: `${dynamicLabels?.markAs}.`,
  //     notify: `${dynamicLabels?.notify}.`,
  //     More: `${dynamicLabels?.more}.`,

  // };
  useEffect(() => {
    if (userAccessInfo.superType == 'MIDDLEMILE') {
      setIdStatus("milestone");
    } else {
      setIdStatus('order');
    }
  }, [userAccessInfo.superType])

  return (
    <>
      <div id="toast-inject-here"></div>
      <PrintAWBModal orderIds={selectedOrderIds} />
      {

        <>

          <Box display="flex" flexDirection='column' style={{ width: '100%', height: 'calc(100vh - 64px)', marginTop: '64px' }} px='15px' pb='15px'>
            <OrderListHeader handleFetchData={handleFetchData} fetchOptions={fetchOptions} setSelectedStatus={setSelectedStatus} selectedStatus={selectedStatus} ngStateRouter={ngStateRouter} filterListPayload={filterListPayload} />

            <Grid container spacing={5} style={{ flexGrow: 1, width: "100%", boxShadow: "0 2px 20px -10px #000", position: "relative" }}>
              {isNoDataAvailable && <OrdersNotAvailable hybridRouteTo={hybridRouteTo} addPermission={userAccessInfo.superType == 'MIDDLEMILE' ? pageLabels?.ordersMiddleMile.buttons.add : pageLabels?.orders?.buttons.add}/>}
              <Grid className='grid-customised-scroll-bar' item md={viewMode === "listview" ? 12 : 4} style={{ display: "flex", overflow: "hidden" }}>
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
                  {columns.length > 0 && (
                    <ListView
                      rowIdentifier="shipmentId"
                      style={{ display: "flex", height: "100%", overflow: "auto" }}
                      columns={columns}
                      data={rowsSelector}
                      onFetchData={handleFetchData}
                      hasRowSelection={true}
                      onRowSelect={onRowSelect}
                      onSortChange={onSortChange}
                      sorts={sort}
                      hideRefresh={loading}
                      onFilterChange={handleFilterChange}
                      onSaveColumnPreferences={onSaveColumnPreferences}
                      totalRows={totalRowsSelector}
                      loading={loading}
                      isColumnLoading={columnsLoading}
                      filters={filters}
                      isEditMode={isEditMode}
                      onRowEditClick={(row) => {
                        hybridRouteTo(`updateorder/?orderid=${row.shipmentId}`);
                      }}
                      hasRadioSelection={viewMode == "mapview"}
                      hasSelectAllRows={viewMode == "listview"}
                      moreResultsExists={moreResultsExists}
                      disableNext={setDisableNext}
                    >
                      {viewMode === "listview" && columns.length
                        ? {
                          IconBar: (
                            <OrderListViewIconBar selectedRows={selectedRows} selectedStatus={selectedStatus} fetchOptions={fetchOptions} showInformationModal={showInformationModal} setShowInformationModal={setShowInformationModal} handleFetchData={handleFetchData} handleFetchFilters={handleFetchFilters} handleRemoveFilter={handleRemoveFilter} AdvanceFilterData={AdvanceFilterData}></OrderListViewIconBar>
                          ),
                          ActionBar: (
                            <Box style={{ marginLeft: "2px", marginTop: "2px" }} display="flex" horizontalSpacing="5px">
                              {isEditMode ? (
                                <>
                                  <span style={{ display: "inline-block" }}>
                                    <IconButton
                                      intent="table"
                                      id="listView-actionBar-save"
                                      iconVariant="icomoon-save"
                                      onClick={handleSaveRows}
                                      disabled={!Object.keys(selectedRows).length || disableSaveButton}
                                    >Save</IconButton>
                                  </span>
                                  <span style={{ display: "inline-block" }}>
                                    <IconButton
                                      intent="table"
                                      id="listView-actionBar-cancel"
                                      iconVariant="icomoon-close"
                                      onClick={handleCancelRows}
                                      disabled={!Object.keys(selectedRows).length || disableSaveButton}
                                    >
                                      Cancel
                                </IconButton>
                                  </span>
                                </>
                              ) : (
                                  //  <OrderListActionButton selectedRows={selectedRows} handleActionBarButtonClick={handleActionBarButtonClick} handleAssignNow={handleAssignNow} handleOverrideStatusOptions={handleOverrideStatusOptions} handleMoreOptions={handleMoreOptions} handleNotifyCustomer={handleNotifyCustomer}></OrderListActionButton>
                                  selectedRows && Object.keys(actionBarButtons)?.map(
                                    (buttonKey, index) => {
                                      switch (buttonKey) {
                                        case 'advancedSearch':
                                          return null;
                                        case 'assignNow':
                                          return <span style={{ display: "inline-block" }}> <IconDropdown
                                            id={`${idStatus}--actionbar--${buttonKey}`}
                                            key={buttonKey}
                                            variant={'button-dropdown'}
                                            optionList={[{ value: "assignNow", label: "Manually Assign to a Trip" }]}
                                            width='auto'
                                            iconButtonDetails={[
                                              iconsMapping[buttonKey],
                                              actionBarButtons[buttonKey].label,
                                              'icomoon-angle-bottom'
                                            ]}
                                            disabled={!enableAssignNow}
                                            intent='table'
                                            tooltipProps = {{
                                              tooltipDirection: "bottom",
                                              messagePlacement: "start",
                                            }}
                                            onChange={handleAssignNow}
                                            isSingleClickOption
                                            tooltipMessage={!enableAssignNow ? (actionBarButtons[buttonKey]?.tooltipLabel || dynamicLabels[`${buttonKey}_order`]) : dynamicLabels[`${buttonKey}_order`] || actionBarButtons[buttonKey].label}
                                          /></span>
                                        case 'markAs': {
                                          return <CreateActionBarButton
                                           id = "order-List-actionbar-{{buttonKey}}"
                                            pageName={idStatus}
                                            buttonKey={buttonKey}
                                            buttonIndex={index}
                                            actionBarButton={actionBarButtons[buttonKey]}
                                            buttonToolTipTextList={actionBarButtons[buttonKey].label}
                                            selectedRows={selectedRows}
                                            handleActionBarButtonClick={handleMoreOptions}
                                            isButtonDisabled={!Object.keys(selectedRows)?.length} />
                                        }
                                        case 'notify': {
                                          return <CreateActionBarButton
                                            id = "order-List-actionbar-{{buttonKey}}"
                                            pageName={idStatus}
                                            buttonKey={buttonKey}
                                            buttonIndex={index}
                                            actionBarButton={actionBarButtons[buttonKey]}
                                            buttonToolTipTextList={actionBarButtons[buttonKey].label}
                                            selectedRows={selectedRows}
                                            handleActionBarButtonClick={handleActionBarButtonClick}
                                            isButtonDisabled={!Object.keys(selectedRows)?.length} />
                                        }
                                        case 'manualAssign': {
                                          return <CreateActionBarButton
                                            id = "order-List-actionbar-{{buttonKey}}"
                                            pageName={idStatus}
                                            buttonKey={buttonKey}
                                            buttonIndex={index}
                                            actionBarButton={actionBarButtons[buttonKey]}
                                            buttonToolTipTextList={actionBarButtons[buttonKey].label}
                                            selectedRows={selectedRows}
                                            handleActionBarButtonClick={handleActionBarButtonClick}
                                            isButtonDisabled={
                                              suggestedTripDisabled
                                            }

                                          />
                                        }
                                        default: {
                                          return <CreateActionBarButton
                                           id = "order-List-actionbar-{{buttonKey}}"
                                            pageName={idStatus}
                                            buttonKey={buttonKey}
                                            buttonIndex={index}
                                            actionBarButton={actionBarButtons[buttonKey]}
                                            buttonToolTipTextList={actionBarButtons[buttonKey].label}
                                            selectedRows={selectedRows}
                                            handleActionBarButtonClick={handleActionBarButtonClick}
                                            isButtonDisabled={!Object.keys(selectedRows)?.length} />
                                        }
                                      }
                                    })
                                )
                              }
                            </Box>
                          ),
                        }
                        : undefined}
                    </ListView>
                  )}
                </WhiteCard>
              </Grid>
              {viewMode === "mapview" && (
                <Grid item md={8} spacing={2}>
                  <Card style={{ backgroundColor: "#fff", height: "80vh" }}>
                    <OrderMapView selectedRows={selectedRows} setSelectedRows={setSelectedRows}></OrderMapView>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Box></>}
      {/* {
        isNoDataAvailable && <Box display="flex" flexDirection='column' style={{ width: '100%', height: 'calc(100vh - 50px)', marginTop: '50px' }} px='15px' pb='15px'>
          <OrderListHeader handleFetchData={handleFetchData} fetchOptions={fetchOptions} setSelectedStatus={setSelectedStatus} selectedStatus={selectedStatus} filterListPayload={filterListPayload} handleRemoveFilter={handleRemoveFilter} ngStateRouter={ngStateRouter} />
          <OrdersNotAvailable hybridRouteTo={hybridRouteTo} />
        </Box>
      } */}
      {globalPopup}
      <AllSubComponentContainer isAttemtedDate={isAttemtedDate} setRescheduledDate={setRescheduledDate} showAssignDAModal={showAssignDAModal} setAssignDAModal={setAssignDAModal} manualAssign={manualAssign} manualAssignClick={manualAssignClick} showDeletionConfirmation={showDeletionConfirmation} setShowDeletionConfirmation={setShowDeletionConfirmation} deleteSelectedRows={deleteSelectedRows} showTripDateChangeModal={showTripDateChangeModal} setShowTripDateChangeModal={setShowTripDateChangeModal} tripData={tripData} neverShowTripDateChangePopup={neverShowTripDateChangePopup} setNeverShowTripDateChangePopup={setNeverShowTripDateChangePopup} selectedRows={selectedRows} isShowReasonModal={isShowReasonModal} fetchOptions={fetchOptions} selectedStatus={selectedStatus} setIsShowReasonModal={setIsShowReasonModal} reasonMessage={reasonMessage} setReasonOtherMessage={setReasonOtherMessage} reasonOtherMessage={reasonOtherMessage} setShowConfirmationModal={setShowConfirmationModal} setReasonSelectedValue={setReasonSelectedValue} reasonSelectedValue={reasonSelectedValue} showConfirmationModal={showConfirmationModal} setIsConfirmed={setIsConfirmed} showBulkUploadModal={showBulkUploadModal} setShowBulkUploadModal={setShowBulkUploadModal} showBulkUploadModalFmlm={showBulkUploadModalFmlm} setShowBulkUploadModalFmlm={setShowBulkUploadModalFmlm} handleFetchData={handleFetchData} successCallBack={successCallBack} showDeliveryProofModal={showDeliveryProofModal} setShowDeliveryProofModal={setShowDeliveryProofModal} deliveryProofStructure={deliveryProofStructure} showEstimateCostModal={showEstimateCostModal} setShowEstimateCostModal={setShowEstimateCostModal} handleEstimatedCostStructure={handleEstimatedCostStructure} handleEstimatedCostData={handleEstimatedCostData} customerNotifyType={customerNotifyType} setSelectedRows={setSelectedRows} notifyTemplateData={notifyTemplateData} setCustomerNotifyType={setCustomerNotifyType} isGeocodeModal={isGeocodeModal} setIsGeocodeModal={setIsGeocodeModal} showDLCModal={showDLCModal} setShowDLCModal={setShowDLCModal} showNotifyFleetModal={showNotifyFleetModal} setShowNotifyFleetModal={setShowNotifyFleetModal} notifyList={notifyList} showTripDateChangePopupMarkIntransitModal={showTripDateChangePopupMarkIntransitModal} setShowTripDateChangePopupMarkIntransitModal={setShowTripDateChangePopupMarkIntransitModal} showInformationModal={showInformationModal} setShowInformationModal={(value: boolean) => setShowInformationModal(value)} isMarkAsIntransit={isMarkAsIntransit} tripDate={tripDate} setTripDate={setTripDate} 
      isShowRaiseExceptionModal={isShowRaiseExceptionModal} setIsShowRaiseExceptionModal={setIsShowRaiseExceptionModal} selectedOrderStatus={selectedOrderStatus} showAddressUpdateModal={showAddressUpdateModal} setShowAddressUpdateModal={setShowAddressUpdateModal} updateAddressStructure={updateAddressStructure} displayPickup={displayPickup} displayDeliver={displayDeliver} updateAddressData={updateAddressData} updateAddressOrderData={updateAddressOrderData} updateAddressOrderListStructure={updateAddressOrderListStructure} saveUpdatedAddress={saveUpdatedAddress}/>

    </>

  );
};

export default withThemeProvider(
  withToastProvider(withRedux(withPopup(OrderListView)), "toast-inject-here")
);
