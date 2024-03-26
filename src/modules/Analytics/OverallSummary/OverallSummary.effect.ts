import {
    IFetchDataAction,
    OverallSummaryListViewActions,
  } from "./OverallSummary.actions";
  import {
    put,
    takeLatest,
    call,
    select,
    all,
    takeEvery,
  } from "redux-saga/effects";
  import apiMappings from "../../../utils/apiMapping";
  import axios from "../../../utils/axios";
  import { IListViewRequestPayload } from "../../../utils/common.interface";
  
  function* fetchOverallSummaryListStructure() {
    yield put<OverallSummaryListViewActions>({
      type: "@@OverallSummaryListAction/SET_COLUMNS_LOADING",
      payload: { columns: true },
    });
  
    try {
      const { data: payload, status } = yield call<any>(
        axios.get,
        apiMappings.overallSummary.listview.structure
      );
      if (status === 200) {
        yield put({
          type: "@@OverallSummaryListAction/FETCH_STRUCTURE_SUCCESS",
          payload: payload,
        });
        yield put<OverallSummaryListViewActions>({
          type: "@@OverallSummaryListAction/SET_COLUMNS_LOADING",
          payload: { columns: false },
        });
      }
    } catch (error) {
      yield put<OverallSummaryListViewActions>({
        type: "@@OverallSummaryListAction/SET_COLUMNS_LOADING",
        payload: { columns: false },
      });
    }
  }
  
  function* fetchOverallSummaryFilterStructure() {
    try {
      const { data: payload, status } = yield call<any>(
        axios.get,
        apiMappings.overallSummary.advancedFilterStructure
      );
      if (status === 200) {
        yield put({
          type: "@@OverallSummaryListAction/FETCH_ADVANCED_FILTER_STRUCTURE_SUCCESS",
          payload: payload,
        });
      }
    } catch (error) {
      console.log("Advanced Filter Failed");
    }
  }
  
  function* fetchData(action: IFetchDataAction) {
    yield put<OverallSummaryListViewActions>({
      type: "@@OverallSummaryListAction/SET_LOADING",
      payload: { listView: true },
    });
  
    const minDate = yield select(
      (state) => state.overallSummaryListView.DatePayload.minDate
    );
    const maxDate = yield select(
      (state) => state.overallSummaryListView.DatePayload.maxDate
    );
    const filterListPayload = yield select(
      (state) => state.advanceFilter.filterListPayload
    );
    let filter: IListViewRequestPayload = { ...action.payload };
  
    const filtersPayload = filterListPayload || undefined;
    try {
      if (maxDate && minDate) {
        const {
          data: { data: payload },
        } = yield call(
          axios.post,
          apiMappings.overallSummary.listview.data,
          filtersPayload,
          {
            params: {
              ...filter,
              endTimeWindow: maxDate,
              startTimeWindow: minDate,
            },
          }
        );
        const clientProperties = yield select((state) => state.clientProperties);
        payload.clientProperties = clientProperties;
  
        yield put<OverallSummaryListViewActions>({
          type: "@@OverallSummaryListAction/FETCH_DATA_SUCCESS",
          payload: payload,
        });
        yield put<OverallSummaryListViewActions>({
          type: "@@OverallSummaryListAction/SET_LOADING",
          payload: { listView: false },
        });
      }
    } catch (error) {
      yield put<OverallSummaryListViewActions>({
        type: "@@OverallSummaryListAction/SET_LOADING",
        payload: { listView: false },
      });
    }
  }
  
  export function* fetchTripSummaryData(action: any) {
    let api = apiMappings.overallSummary.tripSummaryApi;
  
    const filterListPayload = yield select(
      (state) => state.advanceFilter.filterListPayload
    );
    let filter: IListViewRequestPayload = { ...action.payload };
  
    const filtersPayload = filterListPayload || undefined;
  
    try {
      const { data: payload } = yield call<any>(axios.post, api, filtersPayload, {
        params: {
          ...filter,
          endTimeWindow: action.payload.endTimeWindow,
          startTimeWindow: action.payload.startTimeWindow,
        },
      });
      yield put({
        type: "@@OverallSummaryListAction/FETCH_TRIP_DATA_SUCCESS",
        payload,
      });
      yield put({
        type: "@@OverallSummaryListAction/TRIP_API_SUCCESS",
        payload: { apiSuccess: true },
      });
    } catch (error) {
      console.log(error, "trip API Failed");
      yield put({
        type: "@@OverallSummaryListAction/TRIP_API_SUCCESS",
        payload: { apiSuccess: false },
      });
    }
  }
  
  export function* fetchOrderSummaryData(action: any) {
    let api = apiMappings.overallSummary.orderSummaryApi;
  
    const filterListPayload = yield select(
      (state) => state.advanceFilter.filterListPayload
    );
    let filter: IListViewRequestPayload = { ...action.payload };
  
    const filtersPayload = filterListPayload || undefined;
  
    try {
      const { data: payload } = yield call<any>(axios.post, api, filtersPayload, {
        params: {
          ...filter,
          endTimeWindow: action.payload.endTimeWindow,
          startTimeWindow: action.payload.startTimeWindow,
        },
      });
      yield put({
        type: "@@OverallSummaryListAction/FETCH_ORDER_DATA_SUCCESS",
        payload,
      });
      yield put({
        type: "@@OverallSummaryListAction/ORDER_API_SUCCESS",
        payload: { apiSuccess: true },
      });
    } catch (error) {
      yield put({
        type: "@@OverallSummaryListAction/ORDER_API_SUCCESS",
        payload: { apiSuccess: false },
      });
      console.log(error, "ORDER API FAILED");
    }
  }
  
  export function* fetchDASummaryData(action: any) {
    let api = apiMappings.overallSummary.deliveryMediumSummaryApi;
    const filterListPayload = yield select(
      (state) => state.advanceFilter.filterListPayload
    );
    let filter: IListViewRequestPayload = { ...action.payload };
  
    const filtersPayload = filterListPayload || undefined;
    let delMedData: any = [];
    try {
      const { data: payload } = yield call<any>(axios.post, api, filtersPayload, {
        params: {
          ...filter,
          endTimeWindow: action.payload.endTimeWindow,
          startTimeWindow: action.payload.startTimeWindow,
        },
      });
  
      if(payload?.data?.deliveryMediumData){
      payload.data.deliveryMediumData.map((item) => {
        let delObject: Object = {
          name: item.deliveryMediumName,
          Cancelled: item.cancelledOrders,
          Attempted: item.notDeliveredOrders,
          Completed: item.completedOrders,
          Missed: item.missedOrders,
        };
        delMedData.push(delObject);
        delObject = {};
      });
    }else{
        delMedData = [];
    }   
      yield put({
        type: "@@OverallSummaryListAction/FETCH_DA_DATA_SUCCESS",
        payload,
      });
      yield put({
        type: "@@OverallSummaryListAction/DA_API_SUCCESS",
        payload: { apiSuccess: true },
      });
      yield put({
        type: "@@OverallSummaryListAction/DA_GRAPH_SUCCESS",
        payload: delMedData,
      });
    } catch (error) {
      console.log(error, "DA API FAILED");
      yield put({
        type: "@@OverallSummaryListAction/DA_API_SUCCESS",
        payload: { apiSuccess: false },
      });
    }
  }
  
  export function* watchFetchDASummaryDataRequest() {
    yield takeLatest<OverallSummaryListViewActions>(
      "@@OverallSummaryListAction/FETCH_DA_DATA",
      fetchDASummaryData
    );
  }
  
  export function* watchFetchOrderSummaryDataRequest() {
    yield takeLatest<OverallSummaryListViewActions>(
      "@@OverallSummaryListAction/FETCH_ORDER_DATA",
      fetchOrderSummaryData
    );
  }
  
  export function* watchFetchTripSummaryDataRequest() {
    yield takeLatest<OverallSummaryListViewActions>(
      "@@OverallSummaryListAction/FETCH_TRIP_DATA",
      fetchTripSummaryData
    );
  }
  
  export function* watchFetchOverallSummaryFilterRequest() {
    yield takeLatest<OverallSummaryListViewActions>(
      "@@OverallSummaryListAction/FETCH_ADVANCED_FILTER_STRUCTURE",
      fetchOverallSummaryFilterStructure
    );
  }
  
  export function* watchFetchOverallSummaryStructureRequest() {
    yield takeLatest<OverallSummaryListViewActions>(
      "@@OverallSummaryListAction/FETCH_STRUCTURE",
      fetchOverallSummaryListStructure
    );
  }
  
  export function* watchFetchOverallSummaryListDataRequest() {
    yield takeLatest<IFetchDataAction>(
      "@@OverallSummaryListAction/FETCH_DATA",
      fetchData
    );
  }
  
  export function* watchOverallSummaryList() {
    yield all([
      watchFetchOverallSummaryStructureRequest(),
      watchFetchOverallSummaryListDataRequest(),
      watchFetchTripSummaryDataRequest(),
      watchFetchOrderSummaryDataRequest(),
      watchFetchDASummaryDataRequest(),
      watchFetchOverallSummaryFilterRequest(),
    ]);
  }
  