import { all, call, put, takeLatest } from "redux-saga/effects";
import apiMappings from "../../../utils/apiMapping";
import axios from "../../../utils/axios";
import { tMMOBulkUpdateAction } from "./BulkUpdate.actions";

function* fetchStructure(action: any) {
    yield put<tMMOBulkUpdateAction>({type: "@@MMO/BulkUpdate/SET_API_LOADING", payload: true })  
    const url = apiMappings.middleMileOrder.listView.bulkUpdate.bulkUpdateStructure;
    const urlParams = Object.entries(action?.payload).map(([key, val]) => `${key}=${val}`).join('&');
    const { data: structureData } = yield call<any>(axios.get, `${url}?${urlParams}`);
    yield put<tMMOBulkUpdateAction>({ type: '@@MMO/BulkUpdate/SET_STRUCTURE', payload: structureData });
    yield put<tMMOBulkUpdateAction>({type: "@@MMO/BulkUpdate/SET_API_LOADING", payload: false }) 
}

function* watchFetchStructure() {
    yield takeLatest('@@MMO/BulkUpdate/FETCH_STRUCTURE', fetchStructure)
}

function* fetchClientMetrics() {
    const { data, status} = yield call<any>(axios.get, apiMappings.common.clientMetric);
    if(status === 200) {
      yield put({ type: '@@MMO/BulkUpdate/SET_CLIENT_METRIC_SYSTEM', payload: data.data});        
    }
}
export function* watchFetchClientMetrics() {
    yield takeLatest<tMMOBulkUpdateAction>('@@MMO/BulkUpdate/GET_CLIENT_METRIC_SYSTEM', fetchClientMetrics)
    
}

export function* MMOBulkUpdateSaga() {
    yield all([watchFetchStructure(), watchFetchClientMetrics()])
}