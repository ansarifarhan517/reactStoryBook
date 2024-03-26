// STEPS:
// 1. Make an action to call this API
// 2. Then make a watcher fror that action
// 3. Then make the generator function call that should be called as soon as that action is dispatched
// 4. NOTE: Don't forget to attach the common watcher with rootSaga.

import { all, call, put, takeLatest, select } from "redux-saga/effects";
import apiMappings from "../../../utils/apiMapping";
import axios from "../../../utils/axios";
import { IBonusFormActions } from "./BonusesForm.action";

/************  STRUCTURE  *************/
function* fetchFormStructure() {

  //  GET CLIENT METRIC
  const clientMetric = yield select(state => state.bonuses.form?.clientMetric);
  if(clientMetric && Object.keys(clientMetric)?.length < 1) {
    try {
      const { data, status} = yield call<any>(axios.get, apiMappings.common.clientMetric);
      if(status === 200) {
        yield put({ type: '@@bonuses/SET_CLIENT_METRIC_SYSTEM', payload: data.data});        
      }
    } catch(error: any)  {
      console.log('cannot load client metric properties')
    }
  }

  try {
    yield put<IBonusFormActions>({
      type: "@@bonuses/SET_FORM_LOADING",
      payload: true,
    });

    const type = yield select(
      (state) => state.bonuses.form.lookup?.type
    );

    const skillSet = yield select(
      (state) => state.bonuses.form.lookup?.skillSet
    );

    const category = yield select(
      (state) => state.bonuses.form.lookup?.category
    );

    const paymentMode = yield select(
      (state) => state.bonuses.form.lookup?.paymentMode
    );

    const metric = yield select(
      (state) => state.bonuses.form.lookup?.metric
    );

    const eventDay = yield select(
      (state) => state.bonuses.form.lookup?.eventDay
    );

    if (
      !eventDay &&
      !metric &&
      !paymentMode &&
      !category &&
      !skillSet &&
      !type
    ) {
      yield* fetchLookup("eventDay");
      yield* fetchLookup("metric");
      yield* fetchLookup("paymentMode");
      yield* fetchLookup("category");
      yield* fetchLookup("skillSet");
      yield* fetchLookup("type");
    }

    const response = yield call(axios.get, apiMappings.common.structure, {
      params: {
        modelName: "BONUS_CONFIGURATIONS",
        pageName: "BONUS_CONFIGURATIONS",
        sectionName: "ADD_BONUS_CONFIGURATIONS_FORM",
      },
    });

    if (response?.status === 200) {
      yield put<IBonusFormActions>({
        type: "@@bonuses/SET_FORM_STRUCTURE",
        payload: response?.data,
      });
      yield put<IBonusFormActions>({
        type: "@@bonuses/SET_FORM_LOADING",
        payload: false,
      });


      // FETCH ADVANCED FILTER COLUMNS
      const advancedFilterColumns = yield select(
        (state) => state.bonuses.form?.advancedFilterColumns?.columns
      );
      if (!Object.keys(advancedFilterColumns)?.length) {
        yield* fetchAdvancedFilterColumns();
      }
    }
  } catch (error: any) {
    console.log("Error Occured", error);
  }
}

function* watchFetchFormStructure() {
  yield takeLatest<IBonusFormActions>(
    "@@bonuses/FETCH_FORM_STRUCTURE",
    fetchFormStructure
  );
}

/************  ADVANCEDFILTER COLUMNS  *************/
function* fetchAdvancedFilterColumns() {
  try {
    yield put<IBonusFormActions>({
      type: "@@bonuses/SET_FORM_LOADING",
      payload: true,
    });

    const response = yield call(axios.get, apiMappings.common.structure, {
      params: {
        modelName: "BONUS_CONFIGURATIONS",
        pageName: "BONUS_CONFIGURATIONS",
        sectionName: "ADVANCED_FILTER_COLUMNS",
      },
    });

    if (response?.status === 200) {
      yield put<IBonusFormActions>({
        type: "@@bonuses/SET_ADVANCED_FILTER_COLUMNS",
        payload: response?.data,
      });

      yield put<IBonusFormActions>({
        type: "@@bonuses/SET_FORM_LOADING",
        payload: false,
      });
    }
  } catch (error: any) {
    console.log("Error Occured", error);
  }
}

/************** FETCH LOOKUP COMMON  **************/
function* fetchLookup(lookupType: string) {
  const fieldToApiKeyMapping = {
    skillSet: "deliveryType",
    category: "BONUSCATEGORY",
    type: "BONUSTYPE",
    paymentMode: "paymentMode",
    metric: "BONUSMETRIC",
    eventDay: "WEEKDAYS_LABEL",
  };
  const { data: response } = yield call(
    axios.get,
    apiMappings.common.lookup[fieldToApiKeyMapping[lookupType]]
  );
  yield put<IBonusFormActions>({
    type: "@@bonuses/SET_LOOKUP",
    payload: {
      key: lookupType,
      value: response,
    },
  });
}

// Common watcher for all the API's/Saga for Bonus Configuration Module
export function* watchBonusesFormRequests() {
  yield all([watchFetchFormStructure()]);
}
