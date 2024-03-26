import { takeLatest, call, all, put, takeEvery } from "@redux-saga/core/effects";
import { fork } from "redux-saga/effects";
import apiMappings from "../../../../utils/apiMapping";
import axios from "../../../../utils/axios";

import {
  IFetchThresholdData,
  IPutThresholdUpdatedData,
  IUsageAnalyticsActions,
} from "./UsageAnalytics.actions";

export function* putUpdatedThreshold(action: IPutThresholdUpdatedData) {
  try {
    const response = yield call(
      axios.post,
      apiMappings.usageAnalytics.updateThreshold,
      action.payload
    );

    console.log(response, "response for updating threshold");
  } catch (error) {
    console.log(error);
  }
}

export function* fetchThresholdData(action: IFetchThresholdData) {
  try {
    const {data: response} = yield call(
      axios.post,
      apiMappings.usageAnalytics.getThreshold,
      action.payload
    );

    yield put<IUsageAnalyticsActions>({
      type: "@@usageAnalytics/SET_THRESHOLD_DATA",
      payload: { key: action.payload.type, value: response },
    });
  } catch (error) {
    console.log(error);
  }
}


export function* watchPutUpdatedThreshold() {
  yield takeLatest<IPutThresholdUpdatedData>(
    "@@usageAnalytics/PUT_THRESHOLD_UPDATED_DATA",
    putUpdatedThreshold
  );
}

export function* watchFetchThreshold() {
  yield takeEvery<IFetchThresholdData>(
    "@@usageAnalytics/FETCH_THRESHOLD_DATA",
    fetchThresholdData
  );
}

export function* usageAnalyticsSaga() {
  yield all([
    fork(watchPutUpdatedThreshold),
    fork(watchFetchThreshold),
  ]);
}
