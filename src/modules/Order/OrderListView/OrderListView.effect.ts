import { call, put, select, fork, takeLatest, all } from "redux-saga/effects"
import apiMappings from "../../../utils/apiMapping"
import axios, { axiosNoTransformResp } from "../../../utils/axios"
import { IFetchDataAction, OrderListViewActions } from "./OrderListView.actions"
import { watchFetchAWBHTMLTemplates, watchFetchAWBOrderDetails } from '../PrintAWB/PrintAWB.effects'
import { getQueryParams } from "../../../utils/hybridRouting";
import { AdvancedFilterComponentActions } from "../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions"
import { userAccessInfo } from "../../../utils/constants"
import { transformMongoListViewToColumns } from "../../../utils/mongo/ListView";

function* fetchOrderListViewStructure(action: any) {
  yield all([
    call<any>(initDataAsynOperations),
    call<any>(orderListViewStructureFetch, action),
  ])
}

function* initDataAsynOperations() {
    
  try {
    const isDeliveryType = yield select(state => state?.order?.listView?.deliveryType);
    if (isDeliveryType && isDeliveryType.length < 1) {
      const { data: deliveryType } = yield call<any>(axiosNoTransformResp.get, 'ClientApp/client/getByTypeAndId?type=DELIVERYTYPE');
      yield put<OrderListViewActions>({ type: '@@orderListView/SET_DELIVERY_TYPE', payload: { deliveryType } });
    }

    let orderStatusStored = yield select(state => state?.order?.listView?.orderStatus);
    if (orderStatusStored && orderStatusStored.length < 1) {
      const { data: orderStatus } = yield call<any>(axiosNoTransformResp.get, apiMappings.order.listView.orderStatus);
      yield put<OrderListViewActions>({ type: '@@orderListView/SET_ORDER_STATUS', payload: { orderStatus } });
    }

  } catch(failOk) {
    console.log("services ok to fail should be inside try catch, called with axiosNoTransformResp", failOk)
    // without catch whole page stops working, in case of error
  }

}

function* orderListViewStructureFetch(action: any) {
  const status = action?.payload?.status?.toUpperCase()
  const structureApi = apiMappings.order.listView.structure
  let existingParams = getQueryParams()
  existingParams.page = existingParams.page ? existingParams.page==="allOrders"?"ALL":existingParams.page.toUpperCase(): undefined;

  if ((existingParams && existingParams.page == status) || !existingParams.page) {
    const newStructureApi = structureApi.replace("${status}", status ? status : "ALL")
    const { data: payload } = yield call<any>(axios.get, newStructureApi)
    const isNotificationData = yield select(state => state.order.listView.notificationData);
    if (isNotificationData && isNotificationData < 1) {
      let notificationType;
      if (userAccessInfo.superType === "MIDDLEMILE") {
        notificationType = '?notificationType=MILESTONE';
      }
      else {
        notificationType = '?notificationType=ORDER';
      }
      const { data: notificationData } = yield call<any>(axios.get, apiMappings.order.listView.customerNotificationTemplates + notificationType);
      let notifyDropdown = {}
      let notification_Data = new Array();
      let key_cp=0
      
      try{
      notificationData.data.forEach(function (value: any) {
        if (value.isActiveFl) {
          notifyDropdown["notifyCustomer_" + key_cp] = {
            allowed: false,
            childButtons: {},
            childLength: 0,
            colSpan: 0,
            customField: false,
            editable: false,
            excelDropDownHidden: false,
            fieldName: "button",
            fieldType: "button",
            infoFlag: false,
            label: value.name,
            labelKey: value.name,
            permission: true,
            required: false,
            rowSpan: 2,
            searchable: false,
            sortable: false
          }
          notification_Data.push(value);
          key_cp=key_cp+1;
        }
        
      })
    }catch(err){
      console.log(err)
    }

      yield put<OrderListViewActions>({ type: '@@orderListView/SET_NOTIFICATION_DATA', payload: { notification_Data } });
      if (payload.buttons.Notify && payload.buttons.Notify.childNodes && payload.buttons.Notify.childNodes.notifyCustomer)
        payload.buttons.Notify.childNodes.notifyCustomer.childNodes = notifyDropdown;
    
    }

    // here button sequence needs to be change
    yield put({ type: "@@orderListView/FETCH_STRUCTURE_SUCCESS", payload })

    const DATE_IN_ATTEMPTED_STATUS = yield select(state => state.order.listView.dateInAttemptedStatus);
    if (DATE_IN_ATTEMPTED_STATUS && !DATE_IN_ATTEMPTED_STATUS.length) {
      try {
        const { data: newPayload } = yield call<any>(axios.get, "LoginApp/framework/structure?modelName=ORDERS&pageName=ORDERS&sectionName=DATE_IN_ATTEMPTED_STATUS")
        yield put({ type: "@@orderListView/DATE_IN_ATTEMPTED_STATUS", newPayload })
        // console.log(data);
      } catch (error) {
        console.log(error);
      }

    }
  }
}

export function* watchFetchOrderListViewStrucutreRequest() {
  yield takeLatest<OrderListViewActions>(
    "@@orderListView/FETCH_STRUCTURE",
    fetchOrderListViewStructure
  )
}

function* fetchData(action: IFetchDataAction) {

  yield put<OrderListViewActions>({
    type: "@@orderListView/SET_LOADING",
    payload: { listView: true },
  })

  // GET CLIENT METRIC
  const clientMetric = yield select(state => state.order.listView?.clientMetric);

  if (clientMetric && clientMetric?.length < 1) {
    try {
      const { data, status } = yield call<any>(axios.get, apiMappings.common.clientMetric);
      if (status === 200) {
        yield put({ type: '@@orderListView/SET_CLIENT_METRIC', payload: data.data });
      }
    } catch (error) {
      console.log('cannot load client metric properties')
    }
  }

  const advFilterLoader = yield select(state => state.advanceFilter.advFilterLoader);
  if (!!advFilterLoader) {
    try {
      let fetchDataUrl = apiMappings.order.listView.data;
      let params = {};
      if (action?.payload?.dataFromControlTower?.filter) {
        params = {
          deliveryType: action?.payload?.dataFromControlTower?.deliveryType || '',
          filter: action?.payload?.dataFromControlTower?.filter || '',
          pageNumber: action.payload?.pageNumber,
          pageSize: action.payload?.pageSize,
          status: action?.payload?.status?.toUpperCase() || 'ALL',
          reason : localStorage.getItem("orderReason") ? localStorage.getItem("orderReason") : ""
        }
      } else if (localStorage.getItem("globalSearchText")) {
        params = {
          status: 'ALL',
          pageNumber: action.payload?.pageNumber,
          pageSize: action.payload?.pageSize,
          searchBy: action.payload?.searchBy,
          searchText: action.payload?.searchText,
        }
      } else {
        params = {
          status: action?.payload?.status?.toUpperCase() || 'ALL',
          pageNumber: action.payload?.pageNumber,
          pageSize: action.payload?.pageSize,
          searchBy: action.payload?.searchBy,
          searchText: action.payload?.searchText,
          sortBy: action.payload?.sortBy,
          sortOrder: action.payload?.sortOrder,
          filter: action?.payload?.dataFromControlTower?.filter || null,
          deliverType: action?.payload?.dataFromControlTower?.deliveryType || null,
          startDateFilter: action?.payload?.dataFromControlTower?.filter || localStorage.getItem("globalSearchText") ? "" : action?.payload?.startDateFilter,
          endDateFilter: action?.payload?.dataFromControlTower?.filter || localStorage.getItem("globalSearchText") ? "" : action?.payload?.endDateFilter
        }
      }

      const branches = yield select(state => state.order.listView?.branches);
      if (!branches.length) {
        const { data: branches } = yield call<any>(axios.get, 'LookupApp/lookup/client/branches', {
          data: {},
          params: {
            //  ...getParams()
          },
          headers: {
            'Content-Type': 'application/json'
          }
        });
        yield put<OrderListViewActions>({ type: '@@orderListView/SET_BRANCHES', payload: { branches } });
      }


      const filterListPayload = yield select(state => state.advanceFilter.filterListPayload);
      const data = filterListPayload || undefined

      const { data: { data: payload }, } = yield call(axios.post, fetchDataUrl, data || null, { params })
      setTimeout(function () {
        localStorage.removeItem("globalSearchText");
      }, 1000)
      //paylaod add lopp and continue
      console.log(payload.results, "paylaod here")
      /* payload.results.forEach((element: any) => {
        if (element && element.capacityInWeight) {
          element.capacityInWeight = convertUnit(element.capacityInWeight ? element.capacityInWeight : 0, 'WEIGHT');
        }
        if (element && element.capacityInVolume) {
          element.capacityInVolume = convertUnit(element.capacityInVolume ? element.capacityInVolume : 0, 'VOLUME');
        }
      }); */

      let currentPageLength = payload?.results?.length;
      let currentPageSize = params?.pageSize;

      if(currentPageLength < currentPageSize){
        yield put<OrderListViewActions>({type: '@@orderListView/SET_DISABLE_NEXT', payload: true})
      }else{
        yield put<OrderListViewActions>({type: '@@orderListView/SET_DISABLE_NEXT', payload: false})
      }


      const clientProperties = yield select((state) => state.clientProperties)
      payload.clientProperties = clientProperties

      let isParamsEmpty = (Object.keys(params).length > 1) && !params['searchBy'] && !params['searchText'] && !params['sortBy'] && !params['sortOrder']
      if (isParamsEmpty && payload?.results?.length < 1 && !filterListPayload) {
        yield put<AdvancedFilterComponentActions>({ type: '@@advanceFilter/SET_EMPTY_DATA', payload: true });

      } else {
        yield put<AdvancedFilterComponentActions>({ type: '@@advanceFilter/SET_EMPTY_DATA', payload: false });
      }
      yield put<OrderListViewActions>({
        type: "@@orderListView/FETCH_DATA_SUCCESS",
        payload,
      })

      yield put<OrderListViewActions>({
        type: "@@orderListView/SET_LOADING",
        payload: { listView: false },
      })

      const isOperationData = yield select(state => state.order.listView.operationsData);

      if (isOperationData && Object.keys(isOperationData)?.length < 1) {
        const { data: operationsData } = yield call<any>(axios.get, apiMappings.order.listView.operations)
        yield put<OrderListViewActions>({ type: '@@orderListView/GET_OPERATIONS_DATA', payload: { operationsData } });
      }

      const isserviceType = yield select(state => state?.order?.listView?.serviceType);
      if (isserviceType && isserviceType.length < 1) {

        const { data: serviceType } = yield call<any>(axios.get, 'ClientApp/client/getByTypeAndId?type=SERVICETYPE');
        yield put<OrderListViewActions>({ type: '@@orderListView/SET_SERVICE_TYPE', payload: { serviceType } });
      }

      const isPaymentMode = yield select(state => state?.order?.listView?.paymentMode);
      if (isPaymentMode && isPaymentMode.length < 1) {
        const { data: paymentMode } = yield call<any>(axios.get, 'ClientApp/client/getByTypeAndId?type=PAYMENTTYPE');
        yield put<OrderListViewActions>({ type: '@@orderListView/SET_PAYMENT_MODE', payload: { paymentMode } });
      }


      const isPriority = yield select(state => state.order.listView?.priority);
      if (isPriority && isPriority.length < 1) {
        const { data: priority } = yield call<any>(axios.get, 'ClientApp/client/ref?type=PRIORITY');
        yield put<OrderListViewActions>({ type: '@@orderListView/SET_PRIORITY', payload: { priority } });
      }



      // zonal capacity
      const isZonalCapacity = yield select(state => state.order.listView?.zonalCapacity);

      if (!isZonalCapacity || (isZonalCapacity && isZonalCapacity?.length < 1)) {
        const { data: zonalCapacity } = yield call<any>(axios.get, apiMappings.order.listView.getZonalCapacaity);
        // console.log(zonalCapacity)

        yield put<OrderListViewActions>({ type: '@@orderListView/SET_ZONAL_CAPACITY', payload: zonalCapacity?.data[0]?.propertyValue == 'Y' ? true : false });
      }
      // fetch CrateLine Structure

      const iscrateColumns = yield select(state => state.order.listView.cratecolumns);

      if (iscrateColumns && iscrateColumns?.length < 1) {
        const { data: cratecolumns } = yield call<any>(axios.get, apiMappings.order.listView.getCrateStructure);
        yield put<OrderListViewActions>({ type: '@@orderListView/SET_CRATE_STRUCTURE', payload: { cratecolumns } });
      }
      // fetch CrateLine Item Structure
      const iscrateItemcolumns = yield select(state => state.order.listView.crateItemcolumns);

      if (iscrateItemcolumns && iscrateItemcolumns?.length < 1) {
        const { data: crateItemcolumns } = yield call<any>(axios.get, apiMappings.order.listView.getCrateItemsStructure);
        yield put<OrderListViewActions>({ type: '@@orderListView/SET_CRATE_ITEMS_STRUCTURE', payload: { crateItemcolumns } });
      }
      // fetch temp category
      const istempCategroy = yield select(state => state.order.listView.tempCategroy);

      if (istempCategroy && istempCategroy?.length < 1) {
        const { data: tempCategroy } = yield call<any>(axios.get, apiMappings.order.listView.getTempratureArray);
        yield put<OrderListViewActions>({ type: '@@orderListView/SET_TEMPERATURE_CATEGORY', payload: { tempCategroy } });
      }


    } catch (error) {
      console.log("Failed to fetch data for Order List View: ", error)
      yield put<OrderListViewActions>({
        type: "@@orderListView/SET_LOADING",
        payload: { listView: false },
      })
    }
  }
}

export function* watchFetchOrderListViewDataRequest() {
  yield takeLatest<IFetchDataAction>("@@orderListView/FETCH_DATA", fetchData)
}

function* fetchCount(action: IFetchDataAction) {

  try {
    const fetchCountUrl =
      apiMappings.order.listView.count;
    let params = {};
    if (action?.payload?.dataFromControlTower?.filter) {
      params = {
        deliveryType: action?.payload?.dataFromControlTower?.deliveryType || '',
        filter: action?.payload?.dataFromControlTower?.filter || '',
        pageNumber: action.payload?.pageNumber,
        pageSize: action.payload?.pageSize,
        status: action?.payload?.status?.toUpperCase() || 'ALL',
        reason : localStorage.getItem("orderReason") ? localStorage.getItem("orderReason") : ""
      }
    }
    else if (localStorage.getItem("globalSearchText")) {
      params = {
        status: 'ALL',
        pageNumber: action.payload?.pageNumber,
        pageSize: action.payload?.pageSize,
        searchBy: action.payload?.searchBy,
        searchText: action.payload?.searchText,
      }
    }
    else {
      params = {
        status: action?.payload?.status?.toUpperCase() || 'ALL',
        pageNumber: action.payload?.pageNumber,
        pageSize: action.payload?.pageSize,
        searchBy: action.payload?.searchBy,
        searchText: action.payload?.searchText,
        sortBy: action.payload?.sortBy,
        sortOrder: action.payload?.sortOrder,
        filter: action?.payload?.dataFromControlTower?.filter || null,
        deliverType: action?.payload?.dataFromControlTower?.deliveryType || null,
        startDateFilter: action?.payload?.dataFromControlTower?.filter || localStorage.getItem("globalSearchText") ? "" : action?.payload?.startDateFilter,
        endDateFilter: action?.payload?.dataFromControlTower?.filter || localStorage.getItem("globalSearchText") ? "" : action?.payload?.endDateFilter
      }
    }
    // const fetchUrl = apiMappings.order.listView.data + '&endDateFilter=' + action.payload.endDateFilter + '&pageNumber=' + action.payload.pageNumber + '&pageSize='50'&startDateFilter='2020-09-04+04:00:00&'status='ALL
    const data = yield call(axios.post, fetchCountUrl, action.payload?.filterDataList || null, { params })
    const clientProperties = yield select((state) => state.clientProperties)
    data.data.data.clientProperties = clientProperties
    data.data.data.moreResultsExists = data.data.moreResultsExists

    yield put<OrderListViewActions>({
      type: "@@orderListView/FETCH_COUNT_SUCCESS",
      payload: data.data.data,
    })
  } catch (error) {
    console.log("Failed to fetch data for Order List View: ", error)
    yield put<OrderListViewActions>({
      type: "@@orderListView/SET_LOADING",
      payload: { listView: false },
    })
  }
}

export function* watchFetchOrderListViewCountRequest() {
  yield takeLatest<IFetchDataAction>("@@orderListView/FETCH_COUNT", fetchCount)
}
function* fetchExceptionData(action: any) {
  try {
      const url = action.listViewType && action.listViewType === 'Manifest' ? apiMappings.exceptionHandling.listview.raisedExceptions.manifests.manifestExceptionList : apiMappings.exceptionHandling.listview.raisedExceptions.orders.ordersExceptionList;
      const { data: payload } = yield call(axios.get, url)
      yield put({ type: '@@orderListView/SET_EXCEPTION_LIST', payload })
  } catch ( error ) {
      console.log(error);
  }
}

export function* watchFetchExceptionsList() {
  yield takeLatest<OrderListViewActions>('@@orderListView/FETCH_EXCEPTION_DATA', fetchExceptionData);
}

function* fetchBulkUpdateStructure() {
  yield put<OrderListViewActions>({type: "@@orderListView/SET_API_LOADING", payload: true })  
  const url = apiMappings.order.listView.bulkUpdateStructure;
  const { data: structureData } = yield call<any>(axios.get, url);
  yield put<OrderListViewActions>({ type: '@@orderListView/SET_BULK_UPDATE_STRUCTURE', payload: structureData });
  yield put<OrderListViewActions>({type: "@@orderListView/SET_API_LOADING", payload: false }) 
}

function* watchFetchBulkUpdateStructure() {
  yield takeLatest('@@orderListView/FETCH_BULK_UPDATE_STRUCTURE', fetchBulkUpdateStructure)
}
function* fetchUpdateAddressStructure() {
  const url = apiMappings.order.listView.addressUpdatefieldsStructure;
  const { data: structureData } = yield call<any>(axios.get, url);
  let addressParams = structureData?.['address details']?.['addressFields']?.['childNodes']
  if (addressParams && Object.keys(addressParams).length > 0) {
    let countryFieldName = "";
    Object.entries(addressParams).map(([key, value]) => {
        if (key == 'country') {
            countryFieldName = value['id'];
        }
        if (key == 'state' || key == 'pincode' || key == 'State') {
            value['countryFieldName'] = countryFieldName;
        }
    })
  }
  yield put<OrderListViewActions>({type: "@@orderListView/SET_UPDATE_ADDRESS_STRUCTURE",payload: addressParams}); 
}

function* watchFetchUpdateAddressStructure() {
  yield takeLatest('@@orderListView/FETCH_UPDATE_ADDRESS_STRUCTURE', fetchUpdateAddressStructure)
}
function* fetchAllOrderAddressUpdateStructure() {
  const url = apiMappings.order.listView.allOrdersAddressUpdateListStructure;
  const { data: structureData } = yield call<any>(axios.get, url);
  const mongoStructure = structureData.columns;
  if (Object.keys(mongoStructure).length) {
    const newColumns = transformMongoListViewToColumns(mongoStructure, 'updateAddress')
    const statusTransformedColumn = newColumns.map((column: any) => {
        const newcolumn = column;
        if (column.accessor === 'tripNo') {
          newcolumn.hrefdata = "`#/tripHst/tripDetails?tripId=${row.original.tripId}&tripName=${row.original.tripNo}`";
        }
        return newcolumn;
      });
      yield put<OrderListViewActions>({type: "@@orderListView/SET_ALL_ORDER_ADDRESS_UPDATE_LIST",payload: statusTransformedColumn}); 
}
  
}

function* watchFetchAllOrderAddressUpdateStructure() {
  yield takeLatest('@@orderListView/FETCH_ALL_ORDER_ADDRESS_UPDATE_LIST', fetchAllOrderAddressUpdateStructure)
}
export function* watchOrderListView() {
  yield fork(watchFetchAWBHTMLTemplates)
  yield fork(watchFetchAWBOrderDetails)
  yield fork(watchFetchExceptionsList)
  yield fork(watchFetchBulkUpdateStructure)
  yield fork(watchFetchUpdateAddressStructure)
  yield fork(watchFetchAllOrderAddressUpdateStructure)
}


