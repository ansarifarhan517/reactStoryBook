import { all, put, takeLatest, call } from "redux-saga/effects";
import apiMappings from "../../../../../utils/apiMapping";
import axios from "../../../../../utils/axios";
import { IFetchDataAction, IFetchEventsData, IGetWebhookDetails, WebhookProfileActions } from "./ShipperWebhookProfile.actions";

function* fetchListViewStructure() {
    const { data: payload } = yield call(axios.get, apiMappings.shipperWebhookProfile.listView.structure);
    yield put({ type: '@@shipperWebhookProfile/FETCH_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchListViewStructure() {
    yield takeLatest<WebhookProfileActions>('@@shipperWebhookProfile/FETCH_STRUCTURE', fetchListViewStructure);
}

function* fetchData(action: IFetchDataAction) {
    try {
        const { data: { data: payload } } = yield call(axios.get, `${apiMappings.shipperWebhookProfile.listView.fetchData}`, { params: action.payload })
        yield put<WebhookProfileActions>({
            type: '@@shipperWebhookProfile/SET_LIST_LOADING', payload: {
                listView: false
            }
        })
        yield put<WebhookProfileActions>({ type: '@@shipperWebhookProfile/FETCH_DATA_SUCCESS', payload })
    } catch (error) {
        console.log(error);
    }
}

export function* watchFetchDataRequest() {
    yield takeLatest<IFetchDataAction>('@@shipperWebhookProfile/FETCH_DATA', fetchData);
}

function* fetchWebhookData(action: IGetWebhookDetails) {
    try {
        const { data: { data: payload } } = yield call(axios.get, apiMappings.shipperWebhookProfile.getWebhookDetails, { params: action?.payload });
        yield put<WebhookProfileActions>({ type: '@@shipperWebhookProfile/SET_WEBHOOK_DETAILS_DATA', payload })
    } catch (error) {
        console.log(error)
    }

}

export function* watchFetchWebhookData() {
    yield takeLatest<IGetWebhookDetails>('@@shipperWebhookProfile/GET_WEBHOOK_DETAILS_DATA', fetchWebhookData);
}

function* fetchEventsData(action: IFetchEventsData) {
    const { data: { data: payload } } = yield call(axios.get, apiMappings.shipperWebhookProfile.getEventsList + action?.payload);
    Object.keys(payload).forEach(key => {
        payload[key].events.forEach((event: { [x: string]: boolean; clientRefMasterDesc: any }) => {
            event['value'] = event.clientRefMasterDesc;
            event['checked'] = false
        })
    })
    yield put<WebhookProfileActions>({ type: '@@shipperWebhookProfile/SET_EVENTS_DATA', payload })
}

export function* watchFetchEventsData() {
    yield takeLatest<IFetchEventsData>('@@shipperWebhookProfile/FETCH_EVENTS_DATA', fetchEventsData);
}

export function* watchShipperWebhookProfileRequest() {
    yield all([
        watchFetchListViewStructure(),
        watchFetchDataRequest(),
        watchFetchWebhookData(),
        watchFetchEventsData()
    ])
}