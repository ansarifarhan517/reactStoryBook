import { CustomFieldsActions, IFetchDataAction } from './CustomFields.actions';
import { put, takeLatest, call } from 'redux-saga/effects'
import axios from '../../../utils/axios'
import apiMappings from '../../../utils/apiMapping';

function* fetchCustomFieldsStructure() {
  const { data: payload } = yield call<any>(axios.get, apiMappings.customFields.listView.structure)
  yield put({ type: '@@customFields/FETCH_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchCustomFieldsStrucutreRequest() {
  yield takeLatest<CustomFieldsActions>('@@customFields/FETCH_STRUCTURE', fetchCustomFieldsStructure);
}
function* fetchCustomFieldsModules() {
  const { data: payload } = yield call<any>(axios.get, apiMappings.customFields.listView.moduleList)
  payload.sort((a:object, b:object) => (a['clientRefMasterDesc']).localeCompare((b['clientRefMasterDesc'])));
  yield put({ type: '@@customFields/FETCH_MODULES_SUCCESS', payload })
}

export function* watchFetchCustomFieldsModulesRequest() {
  yield takeLatest<CustomFieldsActions>('@@customFields/FETCH_MODULES', fetchCustomFieldsModules);
}

function* fetchCustomFieldTypes() {
  const { data: payload } = yield call<any>(axios.get, apiMappings.customFields.listView.customFieldTypes)
  yield put({ type: '@@customFields/FETCH_FIELDTYPES_SUCCESS', payload })
}

export function* watchFetchCustomFieldsTypesRequest() {
  yield takeLatest<CustomFieldsActions>('@@customFields/FETCH_FIELDTYPES', fetchCustomFieldTypes);
}

function* fetchData(action: IFetchDataAction) {
  const isLoading = action?.payload?.isLoading
  yield put<CustomFieldsActions>({ type: '@@customFields/SET_LOADING', payload: { listView: !!isLoading  } })
  try {
    const newParams = action?.payload 
    delete newParams?.isLoading
    const  { data: { data: payload } } = yield call(axios.get, apiMappings.customFields.listView.data , { params: newParams })
    yield put<CustomFieldsActions>({ type: '@@customFields/FETCH_DATA_SUCCESS', payload })
    yield put<CustomFieldsActions>({ type: '@@customFields/SET_LOADING', payload: { listView: false } })
  } catch (error) {
    console.log('Failed to fetch data for Custom Fields List View: ', error)
    yield put<CustomFieldsActions>({ type: '@@customFields/SET_LOADING', payload: { listView: false } })
  }
}
export function* watchFetchCustomFieldsDataRequest() {
    yield takeLatest<IFetchDataAction>('@@customFields/FETCH_DATA', fetchData);
  }