import { put, takeLatest, call, fork } from 'redux-saga/effects'
import axios from '../../../../../utils/axios'
import apiMappings from '../../../../../utils/apiMapping';
import { UserManagementActions, IFetchDataAction } from './UserManagement.actions'

function* fetchUserListViewStructure() {
  const { data: payload } = yield call<any>(axios.get, apiMappings.userManagement.listView.structure)
  yield put<UserManagementActions>({ type: '@@userManagement/FETCH_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchStrucutreRequest() {
  yield takeLatest<UserManagementActions>('@@userManagement/FETCH_STRUCTURE', fetchUserListViewStructure);
}

function* fetchData(action: any) {
    const { data: payload } = yield call<any>(axios.post, apiMappings.userManagement.listView.getListData, action.payload.data ,{ params: action.payload.params });
    yield put<UserManagementActions>({ type: '@@userManagement/FETCH_DATA_SUCCESS', payload })
}

export function* watchFetchDataRequest() {
  yield takeLatest<IFetchDataAction>('@@userManagement/FETCH_DATA', fetchData);
}

function* fetchUserOptions(action : any) {
const { data: payload } = yield call<any>(axios.get, `${apiMappings.userManagement.form.users}${action.payload}`);
  yield put<UserManagementActions>({ type: '@@userManagement/FETCH_USER_OPTIONS_SUCCESS', payload : payload.results })
}

export function * watchUserOptions() {
  yield takeLatest<IFetchDataAction>('@@userManagement/FETCH_USER_OPTIONS', fetchUserOptions);
}

export function* watchUserManagementRequest() {
  yield fork(watchFetchStrucutreRequest)
  yield fork(watchFetchDataRequest)
  yield fork(watchUserOptions)
}