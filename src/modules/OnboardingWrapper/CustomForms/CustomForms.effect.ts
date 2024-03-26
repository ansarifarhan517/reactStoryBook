import { CustomFormsActions, IFetchDataAction } from './CustomForms.actions';
import { put, takeLatest, call, all } from 'redux-saga/effects'
import axios from '../../../utils/axios'
import apiMappings from '../../../utils/apiMapping';


function* fetchCustomFormsStructure() {
  const { data: payload } = yield call<any>(axios.get, apiMappings.customForms.listView.structure)
  yield put({ type: '@@customForms/FETCH_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchCustomFormsStrucutreRequest() {
  yield takeLatest<CustomFormsActions>('@@customForms/FETCH_STRUCTURE', fetchCustomFormsStructure);
}

function* fetchData(action: IFetchDataAction) {
  const isLoading = action?.payload?.isLoading
  yield put<CustomFormsActions>({ type: '@@customForms/SET_LOADING', payload: { listView: !!isLoading  } })
  try {
    const newParams = action?.payload 
    delete newParams?.isLoading
    const { data: payload  } = yield call(axios.get, apiMappings.customForms.listView.data + '?groupForms=true', { params: newParams })
    yield put<CustomFormsActions>({ type: '@@customForms/FETCH_DATA_SUCCESS', payload })
    yield put<CustomFormsActions>({ type: '@@customForms/SET_LOADING', payload: { listView: false } })
  } catch (error) {
    console.log('Failed to fetch data for Driver List View: ', error)
    yield put<CustomFormsActions>({ type: '@@customForms/SET_LOADING', payload: { listView: false } })
  }
}
export function* watchFetchCustomFormsDataRequest() {
    yield takeLatest<IFetchDataAction>('@@customForms/FETCH_DATA', fetchData);
  }

function* fetchFormStructure() {
  yield put<CustomFormsActions>({type: '@@customForms/SET_FORM_LOADING', payload: true});
  const { data: payload } = yield call<any>(axios.get, apiMappings.customForms.form.structure)
  yield put<CustomFormsActions>({type: '@@customForms/SET_FORM_LOADING', payload: false});
  yield put<CustomFormsActions>({ type: '@@customForms/FETCH_FORM_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchFromStructureRequest() {
  yield takeLatest<IFetchDataAction>('@@customForms/FETCH_FORM_STRUCTURE', fetchFormStructure);
}


function* fetchTriggerEventsById(action: IFetchDataAction) {
  yield put<CustomFormsActions>({type: '@@customForms/SET_FORM_LOADING', payload: true});
  const { data: {data: payload} } = yield call(axios.get, apiMappings.customForms.form.getTriggerEventById+`?customFormGroupId=${action.payload}`);
  yield put<CustomFormsActions>({ type: '@@customForms/SET_TRIGGER_EVENTS_DATA', payload })
  yield put<CustomFormsActions> ({type: '@@customForms/SET_FORM_EDITABLE', payload: true});
}

export function* watchFetchTriggerEventsByIdRequest() {
  yield takeLatest<IFetchDataAction>('@@customForms/FETCH_TRIGGER_EVENTS_BY_ID', fetchTriggerEventsById);
}

function* fetchOrderTypes() {
  const userAccessInfo: string = localStorage.getItem('userAccessInfo') !== null && JSON.parse(localStorage.getItem('userAccessInfo') || '')
  let modeltype: string = "CUSTOMFORMORDERTYPE_" + userAccessInfo['modelType']
  const { data: payload}  = yield call(axios.get, apiMappings.common.lookup.getOrderTypes+`?type=${modeltype}`);
  yield put<CustomFormsActions> ({type: '@@customForms/FETCH_ORDER_TYPES_SUCCESS', payload: payload});
}


export function* watchFetchOrderTypesRequest() {
  yield takeLatest<CustomFormsActions>('@@customForms/FETCH_ORDER_TYPES', fetchOrderTypes);
}

function* fetchOrderStates() {
  const { data: payload}  = yield call(axios.get, apiMappings.common.lookup.getOrderStates);
  yield put<CustomFormsActions> ({type: '@@customForms/FETCH_ORDER_STATES_SUCCESS', payload: payload});
}


export function* watchFetchOrderStatesRequest() {
  yield takeLatest<CustomFormsActions>('@@customForms/FETCH_ORDER_STATES', fetchOrderStates);
}

function* fetchOrderLocations() {
  const userAccessInfo: string = localStorage.getItem('userAccessInfo') !== null && JSON.parse(localStorage.getItem('userAccessInfo') || '')
  let modeltype: string = "CUSTOMFORMORDERTYPE_" + userAccessInfo['modelType']
  const { data: payload}  = yield call(axios.get, apiMappings.common.lookup.getOrderLocations+`?type=${modeltype}`);
  yield put<CustomFormsActions> ({type: '@@customForms/FETCH_ORDER_LOCATIONS_SUCCESS', payload: payload});
}


export function* watchFetchOrderLocationsRequest() {
  yield takeLatest<CustomFormsActions>('@@customForms/FETCH_ORDER_LOCATIONS', fetchOrderLocations);
}

function* fetchTriggerElements() {
  const { data: payload}  = yield call(axios.get, apiMappings.common.lookup.getTriggerElements);
  yield put<CustomFormsActions> ({type: '@@customForms/FETCH_TRIGGER_ELEMENTS_SUCCESS', payload: payload});
}

export function* watchFetchTriggerElementsRequest() {
  yield takeLatest<CustomFormsActions>('@@customForms/FETCH_TRIGGER_ELEMENTS', fetchTriggerElements);
}

function* fetchServiceTypes() {
  const { data: payload}  = yield call(axios.get, apiMappings.common.lookup.serviceType);
  yield put<CustomFormsActions> ({type: '@@customForms/FETCH_SERVICE_TYPES_SUCCESS', payload: payload});
}

export function* watchFetchServiceTypesRequest() {
  yield takeLatest<CustomFormsActions>('@@customForms/FETCH_SERVICE_TYPES', fetchServiceTypes);
}

function* fetchDeliveryTypes() {
  const { data: payload}  = yield call(axios.get, apiMappings.common.lookup.deliveryType);
  yield put<CustomFormsActions> ({type: '@@customForms/FETCH_DELIVERY_TYPES_SUCCESS', payload: payload});
}

export function* watchFetchDeliveryTypesRequest() {
  yield takeLatest<CustomFormsActions>('@@customForms/FETCH_DELIVERY_TYPES', fetchDeliveryTypes);
}

function* fetchSubClients() {
  const { data: payload}  = yield call(axios.get, apiMappings.common.lookup.getSubClients, { data: {}, headers: {'Content-Type': 'application/json'}});
  yield put<CustomFormsActions> ({type: '@@customForms/FETCH_ACCOUNT_NAMES_SUCCESS', payload: payload});
}

export function* watchFetchSubClientsRequest() {
  yield takeLatest<CustomFormsActions>('@@customForms/FETCH_ACCOUNT_NAMES', fetchSubClients);
}
  
export function* watchCustomFormRequest() {
  yield all ([ 
    watchFetchCustomFormsStrucutreRequest(),
    watchFetchCustomFormsDataRequest(),
    watchFetchFromStructureRequest(),
    watchFetchTriggerEventsByIdRequest(),
    watchFetchOrderTypesRequest(),
    watchFetchOrderStatesRequest(),
    watchFetchOrderLocationsRequest(),
    watchFetchTriggerElementsRequest(),
    watchFetchServiceTypesRequest(),
    watchFetchDeliveryTypesRequest(),
    watchFetchSubClientsRequest()
  ])

}