import { AlertMessageActions } from './AlertMessage.actions';
import { put, takeLatest, call, all } from 'redux-saga/effects'
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';


function* fetchAlertMessageListviewStructure() {
    yield put<AlertMessageActions>({ type: '@@alertMessage/SET_COLUMNS_LOADING', payload: { columns: true } });
    try {
        const { data: payload } = yield call<any>(axios.get, apiMappings.alertMessage.listView.structure)
        yield put({ type: '@@alertMessage/FETCH_LISTVIEW_STRUCTURE_SUCCESS', payload })
        yield put<AlertMessageActions>({ type: '@@alertMessage/SET_COLUMNS_LOADING', payload: { columns: false } });
    } catch ( error ) {
      yield put<AlertMessageActions>({ type: '@@alertMessage/SET_COLUMNS_LOADING', payload: { columns: false } });
    }
}
  
export function* watchFetchStrucutreRequest() {
    yield takeLatest<AlertMessageActions>('@@alertMessage/FETCH_LISTVIEW_STRUCTURE', fetchAlertMessageListviewStructure);
}

function* fetchAlertMessageList(action: any) {
    yield put<AlertMessageActions>({ type: '@@alertMessage/SET_LOADING', payload: { listView: true } })
    try {
      const { data: { data: payload } } = yield call(axios.get, apiMappings.alertMessage.listView.data, { params: action.payload })
      yield put<AlertMessageActions>({ type: '@@alertMessage/FETCH_ALERT_TEMPLATE_LIST_SUCCESS', payload: payload })
      yield put<AlertMessageActions>({ type: '@@alertMessage/SET_LOADING', payload: { listView: false } })
    } catch (error) {
      yield put<AlertMessageActions>({ type: '@@alertMessage/SET_LOADING', payload: { listView: false } })
    }
}

export function* watchFetchDataRequest() {
    yield takeLatest<AlertMessageActions>('@@alertMessage/FETCH_ALERT_TEMPLATE_LIST', fetchAlertMessageList);
}

export function* fetchTemplateById (action: any) {
  try {
    const { data: { data: payload } } = yield call(axios.get, apiMappings.alertMessage.listView.getTemplateById, { params: action.payload })
    console.log(payload)
    yield put<AlertMessageActions>({ type: '@@alertMessage/FETCH_TEMPLATE_BY_ID_SUCCESS', payload: payload })
  } catch (error) {
    console.log(error);
  }
}


export function* watchGeTemplatetByIdRequest() {
  yield takeLatest<AlertMessageActions>('@@alertMessage/FETCH_TEMPLATE_BY_ID', fetchTemplateById);
}

function* fetchDefaultTemplates() {
  yield put<AlertMessageActions>({ type: '@@alertMessage/SET_LOADING', payload: { listView: true } });
  try {
    const { data: { data: payload } } = yield call(axios.get, apiMappings.alertMessage.listView.getDefaultTemplate)
    yield put<AlertMessageActions>({ type: '@@alertMessage/FETCH_DEFAULT_TEMPLATE_LIST_SUCCESS', payload: payload })
    yield put<AlertMessageActions>({ type: '@@alertMessage/SET_LOADING', payload: { listView: false } })
  } catch (error) {
    yield put<AlertMessageActions>({ type: '@@alertMessage/SET_LOADING', payload: { listView: false } })
  }
}

export function* watchFetchDefaultTemplates() {
  yield takeLatest<AlertMessageActions>('@@alertMessage/FETCH_DEFAULT_TEMPLATE_LIST', fetchDefaultTemplates);
}

export function* watchAlertMessageRequest() {
    yield all ([
        watchFetchStrucutreRequest(),
        watchFetchDataRequest(),
        watchGeTemplatetByIdRequest(),
        watchFetchDefaultTemplates()
    ])
}
