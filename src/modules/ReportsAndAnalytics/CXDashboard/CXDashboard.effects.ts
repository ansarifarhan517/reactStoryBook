import { all, put, takeLatest, call, takeEvery } from "redux-saga/effects";
import apiMappings from "../../../utils/apiMapping";
import axios from "../../../utils/axios";
import store from "../../../utils/redux/store";
import {
  CXDashboardActions,
  IGetCardData,
  IGetHistogramData,
  IGetFeedbackStructure,
  IGetFeedbackData,
  IGetTrackingCardData,
} from "./CXDashboard.actions";
import { filterCXDateFormatter, filterDateFormatter } from "./Utils/helperFunction";

function* fetchHistogramData(action: IGetHistogramData) {
  yield put<CXDashboardActions>({
    type: "@@CXDashboard/SET_LOADING",
    payload: { COUNTHISTOGRAM: true },
  });
  const filterOptions = store.getState().cxDashboardReducer?.filterOptions;
  const startdate = store.getState().cxDashboardReducer?.calendar?.from
  const enddate =   store.getState().cxDashboardReducer?.calendar?.to
  const params = {
    startDateFilter: filterCXDateFormatter(
      store.getState().cxDashboardReducer?.calendar?.from,"startdate"
    ),
    endDateFilter: filterCXDateFormatter(
      store.getState().cxDashboardReducer?.calendar?.to,"endate"
    ),
    ...filterOptions,
    event:
      action.payload === "totalFeedback" ? "feedbackhistogram" : action.payload,
    groupBy: store.getState().cxDashboardReducer?.groupBy,
    
  };
  if (
    action.payload === "emailhistogram" ||
    action.payload === "smshistogram" ||
    action.payload === "ivrhistogram" ||
    action.payload === "whatsapphistogram"
  ) {
    params[
      "alertMasterId"
    ] = store.getState().cxDashboardReducer?.filterOptions?.alertMasterId;
  }

   
  try {
    const { data: payload } = yield call<any>(
      axios.post,

      apiMappings.reports.cxDashboard.getHistogramData, ///yyy
      { ...params }
    );
    yield put<CXDashboardActions>({
      type: "@@CXDashboard/SET_CHART_DATA",
      payload: {
        chart: action.payload,
        data: payload.data,
      },
    });
    yield put<CXDashboardActions>({
      type: "@@CXDashboard/SET_LOADING",
      payload: { COUNTHISTOGRAM: false },
    });
    // console.log("CXDashboard.effects.ts", payload);
  } catch (e) {
    yield put<CXDashboardActions>({
      type: "@@CXDashboard/SET_LOADING",
      payload: { COUNTHISTOGRAM: false },
    });
    // console.log("CXDashboard.effects.ts error", e);
  }
}

function* getCardData(action: IGetCardData) {
  yield put<CXDashboardActions>({
    type: "@@CXDashboard/SET_LOADING",
    payload: { DATACARDS: true },
  });
  const filterOptions = store.getState().cxDashboardReducer?.filterOptions;
  const params = {
    startDateFilter: filterDateFormatter(
      store.getState().cxDashboardReducer?.calendar?.from
    ),
    endDateFilter: filterDateFormatter(
      store.getState().cxDashboardReducer?.calendar?.to
    ),
    section: action.payload,
    ...filterOptions,
  };
  try {
    const { data } = yield call<any>(
      axios.post,
      apiMappings.reports.cxDashboard.getStats,
      { ...params }
    );
    yield put<CXDashboardActions>({
      type: "@@CXDashboard/SET_LOADING",
      payload: { DATACARDS: false },
    });
    yield put<CXDashboardActions>({
      type: "@@CXDashboard/SET_CARD_DATA",
      payload: {
        section: action.payload,
        data: data.data,
      },
    });
    // console.log("CXDashboard.effects.ts", payload);
  } catch (e) {
    yield put<CXDashboardActions>({
      type: "@@CXDashboard/SET_LOADING",
      payload: { DATACARDS: false },
    });
    // console.log("CXDashboard.effects.ts error", e);
  }
}
function* getTrackingCardData(action: IGetTrackingCardData) {
  yield put<CXDashboardActions>({
    type: "@@CXDashboard/SET_LOADING",
    payload: { TRACKINGCARDS: true },
  });
  const filterOptions = store.getState().cxDashboardReducer?.filterOptions;
  const params = {
    startDateFilter: filterDateFormatter(
      store.getState().cxDashboardReducer?.calendar?.from
    ),
    endDateFilter: filterDateFormatter(
      store.getState().cxDashboardReducer?.calendar?.to
    ),
    section: action.payload,
    ...filterOptions,
  };
 
  try {
    const { data } = yield call<any>(
      axios.post,
      apiMappings.reports.cxDashboard.getStats,  //xxx
      { ...params }
    );
    yield put<CXDashboardActions>({
      type: "@@CXDashboard/SET_LOADING",
      payload: { TRACKINGCARDS: false },
    });
    yield put<CXDashboardActions>({
      type: "@@CXDashboard/SET_TRACKINGCARD_DATA",
      payload: {
        section: action.payload,
        data: data.data,
      },
    });
    // console.log("CXDashboard.effects.ts", payload);
  } catch (e) {
    yield put<CXDashboardActions>({
      type: "@@CXDashboard/SET_LOADING",
      payload: { TRACKINGCARDS: false },
    });
    // console.log("CXDashboard.effects.ts error", e);
  }
}

function* fetchFeedbackData(action: any) {
  yield put<CXDashboardActions>({
    type: "@@CXDashboard/SET_LOADING",
    payload: { LISTVIEW: true },
  });
  const params = {
    startDateFilter: filterDateFormatter(
      store.getState().cxDashboardReducer?.calendar?.from
    ),
    endDateFilter: filterDateFormatter(
      store.getState().cxDashboardReducer?.calendar?.to
    ),
  };
  try {
    const { data } = yield call<any>(
      axios.post,
      apiMappings.reports.cxDashboard.getFeedbackListView,
      { ...params },
      { params: { ...action.payload } }
    );
    
    yield put<CXDashboardActions>({
      type: "@@CXDashboard/SET_FEEDBACK_COUNT",
      // payload: data.data.totalCount
      payload: data.data.totalCount
    })
    yield put<CXDashboardActions>({
      type: "@@CXDashboard/SET_FEEDBACK_DATA",
      payload: data.data.results,
    });
    yield put<CXDashboardActions>({
      type: "@@CXDashboard/SET_LOADING",
      payload: { LISTVIEW: false },
    });
    // console.log("CXDashboard.effects.ts feedback", data.data);
  } catch (e) {
    yield put<CXDashboardActions>({
      type: "@@CXDashboard/SET_LOADING",
      payload: { LISTVIEW: false },
    });
    // console.log("CXDashboard.effects.ts error", e);
  }
}

function* fetchTagCloudData() {
  yield put<CXDashboardActions>({
    type: "@@CXDashboard/SET_LOADING",
    payload: { TAGCLOUD: true },
  });
  const params = {
    startDateFilter: filterDateFormatter(
      store.getState().cxDashboardReducer?.calendar?.from
    ),
    endDateFilter: filterDateFormatter(
      store.getState().cxDashboardReducer?.calendar?.to
    ),
  };
  try {
    const { data } = yield call<any>(
      axios.post,
      apiMappings.reports.cxDashboard.tagCloud,
      { ...params }
    );
    yield put<CXDashboardActions>({
      type: "@@CXDashboard/SET_TAGCLOUD_DATA",
      payload: data.data,
    });
    yield put<CXDashboardActions>({
      type: "@@CXDashboard/SET_LOADING",
      payload: { TAGCLOUD: false },
    });
    // console.log("CXDashboard.effects.ts feedback", data.data);
  } catch (e) {
    yield put<CXDashboardActions>({
      type: "@@CXDashboard/SET_LOADING",
      payload: { TAGCLOUD: false },
    });
    // console.log("CXDashboard.effects.ts error", e);
  }
}

function* fetchFeedbackStructure() {
  yield put<CXDashboardActions>({
    type: "@@CXDashboard/SET_LOADING",
    payload: { LISTVIEW: true },
  });
  try {
    const { data: payload } = yield call<any>(
      axios.get,
      apiMappings.reports.cxDashboard.feedbackStructure
    );
    yield put<CXDashboardActions>({
      type: "@@CXDashboard/SET_FEEDBACK_STRUCTURE",
      payload: payload,
    });
    yield put<CXDashboardActions>({
      type: "@@CXDashboard/SET_LOADING",
      payload: { LISTVIEW: false },
    });
    // console.log("CXDashboard.effects.ts", payload);
  } catch (error) {}
}

function* fetchPromotionsData(action: any) {
  yield put<CXDashboardActions>({
    type: "@@CXDashboard/SET_LOADING",
    payload: { LISTVIEW: true },
  });
  const params = {
    startDateFilter: filterDateFormatter(
      store.getState().cxDashboardReducer?.calendar?.from
    ),
    endDateFilter: filterDateFormatter(
      store.getState().cxDashboardReducer?.calendar?.to
    ),
    ...action.payload,
  };
  try {
    const { data } = yield call<any>(
      axios.post,
      apiMappings.reports.cxDashboard.getPromotionListView,
      { ...params },
      { params: { ...action.payload } }
    );
      const listData = data.data.map((row) => {
        let transformedRow = {   //no need to create new object every time use same object and push data in it
          ...row,
        };
        
        let actionLink = transformedRow.link;
        let displayImg = transformedRow.image;
        transformedRow["actionLink"] = actionLink;
        transformedRow["displayImg"] = displayImg;
        return transformedRow;     
      });
      console.log("CXDashboard.effects.ts promotion", listData);
      console.log("CXDashboard.effects.ts promotion");

    yield put<CXDashboardActions>({
      type: "@@CXDashboard/SET_PROMOTION_DATA",
      payload: listData,
    });
    yield put<CXDashboardActions>({
      type: "@@CXDashboard/SET_LOADING",
      payload: { LISTVIEW: false },
    });
     
  } catch (e) {
    yield put<CXDashboardActions>({
      type: "@@CXDashboard/SET_LOADING",
      payload: { LISTVIEW: false },
    });
    // console.log("CXDashboard.effects.ts error", e);
  }
}

function* fetchPromotionsStructure() {
  yield put<CXDashboardActions>({
    type: "@@CXDashboard/SET_LOADING",
    payload: { LISTVIEW: true },
  });
  try {
    const { data: payload } = yield call<any>(
      axios.get,
      apiMappings.reports.cxDashboard.promotionStructure
    );
    yield put<CXDashboardActions>({
      type: "@@CXDashboard/SET_PROMOTION_STRUCTURE",
      payload: payload,
    });
    yield put<CXDashboardActions>({
      type: "@@CXDashboard/SET_LOADING",
      payload: { LISTVIEW: false },
    });
    // console.log("CXDashboard.effects.ts", payload);
  } catch (error) {}
}

function* fetchAlertList() {
  try {
    const { data } = yield call<any>(
      axios.get,
      apiMappings.reports.cxDashboard.alertList
    );
    yield put<CXDashboardActions>({
      type: "@@CXDashboard/SET_DROPDOWN_OPTIONS",
      payload: {
        alertList: data,
      },
    });
  } catch (error) {}
}

function* watchCardData() {
  yield takeEvery<IGetCardData>("@@CXDashboard/GET_CARD_DATA", getCardData);
}
function* watchTrackingCardData() {
  yield takeEvery<IGetTrackingCardData>(
    "@@CXDashboard/GET_TRACKINGCARD_DATA",
    getTrackingCardData
  );
}

function* watchHistogramData() {
  yield takeEvery<IGetHistogramData>(
    "@@CXDashboard/GET_CHART_DATA",
    fetchHistogramData
  );
}

function* watchFeedbackStructure() {
  yield takeLatest<IGetFeedbackStructure>(
    "@@CXDashboard/GET_FEEDBACK_STRUCTURE",
    fetchFeedbackStructure
  );
}

function* watchPromotionsData() {
  yield takeLatest<any>(
    "@@CXDashboard/GET_PROMOTION_DATA",
    fetchPromotionsData
  );
}
function* watchPromotionStructure() {
  yield takeLatest<IGetFeedbackStructure>(
    "@@CXDashboard/GET_PROMOTION_STRUCTURE",
    fetchPromotionsStructure
  );
}
function* watchFeedbackData() {
  yield takeEvery<any>("@@CXDashboard/GET_FEEDBACK_DATA", fetchFeedbackData);
}
function* watchFeedbackTagCloudData() {
  yield takeEvery<any>("@@CXDashboard/GET_TAGCLOUD_DATA", fetchTagCloudData);
}

function* watchAlertListData() {
  yield takeEvery<any>("@@CXDashboard/GET_ALERTLIST_DATA", fetchAlertList);
}

export function* watchCXDashboard() {
  yield all([
    watchHistogramData(),
    watchCardData(),
    watchTrackingCardData(),
    watchFeedbackStructure(),
    watchFeedbackData(),
    watchPromotionsData(),
    watchPromotionStructure(),
    watchFeedbackTagCloudData(),
    watchAlertListData(),
  ]);
}
