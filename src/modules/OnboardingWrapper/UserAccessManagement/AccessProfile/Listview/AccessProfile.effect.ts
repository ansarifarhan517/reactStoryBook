import { put, takeLatest, call, all } from 'redux-saga/effects';
import apiMappings from '../../../../../utils/apiMapping';
import axios from '../../../../../utils/axios';
import { AccessProfileActions,IFetchDataAction,IOrgRoleFetchFetchDataAction,IOrgRoleFetchDataSuccessAction } from './AccessProfile.actions'



function* fetchAccessProfileListViewStructure() {
    const { data: payload } = yield call<any>(axios.get, apiMappings.accessProfile.listView.structure);
    yield put({ type: '@@accessProfile/FETCH_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchAccessProfileListViewStructure() {
    yield takeLatest<AccessProfileActions>('@@accessProfile/FETCH_STRUCTURE', fetchAccessProfileListViewStructure)
}

function* fetchAccessProfileData(action : any) {
    const { data: payload } = yield call<any>(axios.post, apiMappings.accessProfile.listView.data, action.payload.data, { params: action.payload.params });
    yield put({ type: '@@accessProfile/FETCH_DATA_SUCCESS', payload })
}

function* fetchOrgRoleData(action: any) {
    const {data:payload} = yield call<any>(axios.post, apiMappings.accessProfile.listView.organizationDetails, action.payload.data, { params: action.payload.params });
    yield put<IOrgRoleFetchDataSuccessAction>({ type: '@@organizationRole/FETCH_DATA_SUCCESS', payload })
}

export function* watchFetchData() {
    yield takeLatest<IFetchDataAction>('@@accessProfile/FETCH_DATA', fetchAccessProfileData)
    yield takeLatest<IOrgRoleFetchFetchDataAction>('@@organizationRole/FETCH_DATA',fetchOrgRoleData)
}

export function* watchFetchAccessProfileRequest() {
    yield all([
        watchFetchAccessProfileListViewStructure(),
        watchFetchData()
    ])
}