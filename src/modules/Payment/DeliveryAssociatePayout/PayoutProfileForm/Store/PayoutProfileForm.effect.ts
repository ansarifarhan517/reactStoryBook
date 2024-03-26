// STEPS:
// 1. Make an action to call this API
// 2. Then make a watcher fror that action
// 3. Then make the generator function call that should be called as soon as that action is dispatched
// 4. NOTE: Don't forget to attach the common watcher with rootSaga.

import { all, call, put, takeLatest, select } from "redux-saga/effects";
import apiMappings from "../../../../../utils/apiMapping";
import axios from "../../../../../utils/axios";
import {
  IPayoutFormActions,
} from "./PayoutProfileForm.actions";

/************  STRUCTURE  *************/
function* fetchFormStructure() {
  try {
    yield put<IPayoutFormActions>({
      type: "@@PAYOUTS/SET_FORM_LOADING",
      payload: true,
    });

    const day = yield select(
      (state) => state.deliveryAssociatePayout.form?.lookup?.day
    );

    if (!day) {
      yield put({ type: '@@PAYOUTS/FETCH_LOOKUPTYPE', key: "day" })
    }

    const response = yield call(axios.get, apiMappings.common.structure, {
      params: {
        modelName: "PAYOUT_CONFIGURATION",
        pageName: "PAYOUT_CONFIGURATION",
        sectionName: "ADD_PAYOUT_PROFILE_FORM",
      },
    });

    if (response?.status === 200) {
      yield put<IPayoutFormActions>({
        type: "@@PAYOUTS/SET_FORM_STRUCTURE",
        payload: response?.data,
      });
      yield put<IPayoutFormActions>({
        type: "@@PAYOUTS/SET_FORM_LOADING",
        payload: false,
      });
    }
  } catch (error: any) {
    console.log("Error Occured", error);
  }
}

function* watchFetchFormStructure() {
  yield takeLatest<IPayoutFormActions>(
    "@@PAYOUTS/FETCH_FORM_STRUCTURE",
    fetchFormStructure
  );
}

/************** FETCH LOOKUP COMMON  **************/
const fieldToApiKeyMapping = {
  day: "WEEKDAYS_LABEL",
};

function* fetchLookup(action: any) {
  const { data: response } = yield call(
    axios.get,
    apiMappings.common.lookup[fieldToApiKeyMapping[action.key]]
  );
  yield put<IPayoutFormActions>({
    type: "@@PAYOUTS/SET_LOOKUP",
    payload: {
      key: action.key,
      value: response,
    },
  });
}

function* watchFetchLookup() {
  yield takeLatest<IPayoutFormActions>(
    "@@PAYOUTS/FETCH_LOOKUPTYPE",
    fetchLookup
  );
}

// Common watcher for all the API's/Saga for Bonus Configuration Module
export function* watchPayoutFormRequests() {
  yield all([watchFetchFormStructure(), watchFetchLookup()]);
}
