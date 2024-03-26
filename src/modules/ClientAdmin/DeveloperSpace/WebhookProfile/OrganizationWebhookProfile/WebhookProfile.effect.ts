import { all, put, takeLatest, call } from "redux-saga/effects";
import apiMappings from "../../../../../utils/apiMapping";
import axios from "../../../../../utils/axios";
import { IFetchDataAction, IFetchEventsData, IGetWebhookDetails, WebhookProfileActions } from "./WebhookProfile.actions";

function* fetchListViewStructure() {
    const { data: payload } = yield call(axios.get, apiMappings.webhookProfile.listView.structure);
    yield put({ type: '@@webhookProfile/FETCH_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchListViewStructure() {
    yield takeLatest<WebhookProfileActions>('@@webhookProfile/FETCH_STRUCTURE', fetchListViewStructure);
}

function* fetchData(action: IFetchDataAction) {
    try {
        const { data: { data: payload } } = yield call(axios.get, `${apiMappings.webhookProfile.listView.fetchData}`, { params: action.payload })
        yield put<WebhookProfileActions>({
            type: '@@webhookProfile/SET_LIST_LOADING', payload: {
                listView: false
            }
        })
        yield put<WebhookProfileActions>({ type: '@@webhookProfile/FETCH_DATA_SUCCESS', payload })
    } catch (error) {
        console.log(error);
    }
}

export function* watchFetchDataRequest() {
    yield takeLatest<IFetchDataAction>('@@webhookProfile/FETCH_DATA', fetchData);
}

function* fetchtoken(){

    const { data: result } = yield call<any>(axios.post, apiMappings.OauthProfile.listView.data,null,undefined);
    console.log(result.data.results, "das") 
    const payload = result.data.results.map(obj => {
        return {
          value: obj.tokenName,
          label: obj.tokenName,
          title: obj.tokenName,
          referenceId : obj.referenceId
        };
      });
    yield put({ type: '@@webhookProfile/FETCH_DATA_TOKEN_SUCCESS', payload })
}

export function* watchOauthToken() {
    yield takeLatest<IFetchDataAction>('@@webhookProfile/SET_OAUTH_TOKEN', fetchtoken);
  
}

function* fetchWebhookData(action: IGetWebhookDetails) {
    const { data: { data: payload } } = yield call(axios.get, apiMappings.webhookProfile.getWebhookDetails + action.payload);
    yield put<WebhookProfileActions>({ type: '@@webhookProfile/SET_WEBHOOK_DETAILS_DATA', payload })
}

export function* watchFetchWebhookData() {
    yield takeLatest<IGetWebhookDetails>('@@webhookProfile/GET_WEBHOOK_DETAILS_DATA', fetchWebhookData);
}

function* fetchEventsData() {    
    const { data: payload } = yield call(axios.get, apiMappings.webhookProfile.getEventsList);
    Object.keys(payload).forEach(key => {
        payload[key].events.forEach((event: { [x: string]: boolean; clientRefMasterDesc: any }) => {
            let clientRefMasterDesc = event['name'];
            event['clientRefMasterDesc'] = clientRefMasterDesc;
            event['value'] = clientRefMasterDesc;
            event['checked'] = false
        })
    })
    yield put<WebhookProfileActions>({ type: '@@webhookProfile/SET_EVENTS_DATA', payload })
}

export function* watchFetchEventsData() {
    yield takeLatest<IFetchEventsData>('@@webhookProfile/FETCH_EVENTS_DATA', fetchEventsData);
}

export function* watchWebhookProfileRequest() {
    yield all([
        watchFetchListViewStructure(),
        watchFetchDataRequest(),
        watchFetchWebhookData(),
        watchFetchEventsData(),
        watchOauthToken()
    ])
}