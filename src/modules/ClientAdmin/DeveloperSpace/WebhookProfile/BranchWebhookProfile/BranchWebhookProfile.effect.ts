import { all, put, takeLatest, call } from "redux-saga/effects";
import apiMappings from "../../../../../utils/apiMapping";
import axios from "../../../../../utils/axios";
import { IFetchDataAction, IGetWebhookDetails, BranchWebhookProfileActions, IFetchEventsData } from "./BranchWebhookProfile.actions";

function* fetchListViewStructure() {
    const { data: payload } = yield call(axios.get, apiMappings.branchWebhookProfile.listView.structure);
    yield put({ type: '@@branchWebhookProfile/FETCH_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchListViewStructure() {
    yield takeLatest<BranchWebhookProfileActions>('@@branchWebhookProfile/FETCH_STRUCTURE', fetchListViewStructure);
}

function* fetchData(action: IFetchDataAction) {
    try {
        const { data: { data: payload } } = yield call(axios.get, `${apiMappings.branchWebhookProfile.listView.fetchData}`, { params: action.payload })
        yield put<BranchWebhookProfileActions>({
            type: '@@branchWebhookProfile/SET_LIST_LOADING', payload: {
                listView: false
            }
        })
        yield put<BranchWebhookProfileActions>({ type: '@@branchWebhookProfile/FETCH_DATA_SUCCESS', payload })
    } catch (error) {
    }
}

export function* watchFetchDataRequest() {
    yield takeLatest<IFetchDataAction>('@@branchWebhookProfile/FETCH_DATA', fetchData);
}

function* fetchWebhookData(action: IGetWebhookDetails) {
    const { data: { data: payload } } = yield call(axios.get, apiMappings.branchWebhookProfile.getWebhookDetails + action.payload, { data: {} });
    yield put<BranchWebhookProfileActions>({ type: '@@branchWebhookProfile/SET_WEBHOOK_DETAILS_DATA', payload })
}

export function* watchFetchWebhookData() {
    yield takeLatest<IGetWebhookDetails>('@@branchWebhookProfile/GET_WEBHOOK_DETAILS_DATA', fetchWebhookData);
}

function* fetchEventsData() {
    const { data: payload } = yield call(axios.get, apiMappings.webhookProfile.getEventsList);
    Object.keys(payload).forEach(key => {
        payload[key].events.forEach((event: { [x: string]: boolean; clientRefMasterDesc: any }) => {  
            if (event.clientRefMasterDesc == "Route Creation") {
                payload[key].events.splice(
                    payload[key].events.findIndex(element => element.clientRefMasterCd === "CREATEROUTENOTIFICATION"), 1
                )
            } else {
                event['value'] = event.clientRefMasterDesc;
                event['checked'] = false
            }
        })
    })
    yield put<BranchWebhookProfileActions>({ type: '@@branchWebhookProfile/SET_EVENTS_DATA', payload })
}

export function* watchFetchEventsData() {
    yield takeLatest<IFetchEventsData>('@@branchWebhookProfile/FETCH_EVENTS_DATA', fetchEventsData);
}

export function* watchBranchWebhookProfileRequest() {
    yield all([
        watchFetchListViewStructure(),
        watchFetchDataRequest(),
        watchFetchWebhookData(),
        watchFetchEventsData()
    ])
}