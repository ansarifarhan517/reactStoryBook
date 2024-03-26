import { OrganizationRoleActions, IFetchDataAction,IAccessProfileFetchDataAction, IUserCountFetchDataAction  } from './OrganizationRole.actions';
import { put, takeLatest, call, fork } from 'redux-saga/effects'
import axios from '../../../../../utils/axios'
import apiMappings from '../../../../../utils/apiMapping';

function* watchFetchStructureRequest() {
  yield takeLatest<OrganizationRoleActions>('@@organizationRole/FETCH_STRUCTURE', fetchListStructure);
}

function* fetchListStructure() {
  const { data: payload } = yield call<any>(axios.get, apiMappings.organizationRole.listView.structure)
  yield put<OrganizationRoleActions>({ type: '@@organizationRole/FETCH_STRUCTURE_SUCCESS', payload })
}

function* fetchData(action: any) {
    const {data:payload} = yield call<any>(axios.post, apiMappings.organizationRole.listView.data, action.payload.data, { params: action.payload.params });
    yield put<OrganizationRoleActions>({ type: '@@organizationRole/FETCH_DATA_SUCCESS', payload })
}

function* fetchUserCountData(action: any) {
  const {data:payload} = yield call<any>(axios.post, apiMappings.organizationRole.listView.getUserCountData, action.payload.data, { params: action.payload.params });
  yield put<OrganizationRoleActions>({ type: '@@userCount/FETCH_DATA_SUCCESS', payload })
}

function* fetchAccessProfileData(action: any) {
  const {data:payload} = yield call<any>(axios.post, apiMappings.organizationRole.listView.accessProfileIds, action.payload.data, { params: action.payload.params });
  yield put<OrganizationRoleActions>({ type: '@@accessProfile/FETCH_DATA_SUCCESS', payload })
}

export function* watchFetchDataRequest() {
  yield takeLatest<IFetchDataAction>('@@organizationRole/FETCH_DATA', fetchData);
  yield takeLatest<IAccessProfileFetchDataAction>('@@accessProfile/FETCH_DATA', fetchAccessProfileData);
  yield takeLatest<IUserCountFetchDataAction>("@@userCount/FETCH_DATA", fetchUserCountData );
}

export function* watchOrganizationRoleRequest() {
  yield fork(watchFetchStructureRequest)
  yield fork(watchFetchDataRequest)
}
