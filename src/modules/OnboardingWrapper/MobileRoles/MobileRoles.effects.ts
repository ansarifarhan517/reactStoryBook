import { all, call,put, takeLatest } from 'redux-saga/effects';
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import { IMobileRolesActions } from './MobileRoles.actions';
import { IEffectAction } from './MobileRoles.models';

function* fetchMobileRolesListviewStructure() {
    try {
        const { data: payload } = yield call(axios.get, apiMappings.settingScreen.mobileRoles.listview.structure)
        yield put({ type: '@@mobileRoles/FETCH_LISTVIEW_STRUCTURE_SUCCESS', payload })
    } catch ( error ) {
        console.log(error);
    }
}

export function* watchfetchMobileRolesListviewStructureRequest() {
    yield takeLatest<IMobileRolesActions>('@@mobileRoles/FETCH_LISTVIEW_STRUCTURE', fetchMobileRolesListviewStructure);
}

function* fetchMobileRoleList(action: IEffectAction) {
    try {
        const { data: payload } = yield call(axios.post, apiMappings.settingScreen.mobileRoles.listview.data,{}, { params: action.payload });
        yield put({ type: '@@mobileRoles/FETCH_MOBILE_ROLE_LIST_SUCCESS', payload })
    } catch ( error ) {
        console.log(error);
    }
}

export function* watchFetchMobileRoleList() {
    yield takeLatest<IMobileRolesActions>('@@mobileRoles/FETCH_MOBILE_ROLE_LIST', fetchMobileRoleList);
}

function* fetchMobileRoleFormStructure() {
    try {
        const { data: payload } = yield call(axios.get, apiMappings.settingScreen.mobileRoles.form.structure);
        yield put({ type: '@@mobileRoles/FETCH_MOBILE_ROLE_FORM_STRUCTURE_SUCCESS', payload })
    } catch ( error ) {
        console.log(error);
    }
}

export function* watchFetchMobileRoleFormStructure() {
    yield takeLatest<IMobileRolesActions>('@@mobileRoles/FETCH_MOBILE_ROLE_FORM_STRUCTURE', fetchMobileRoleFormStructure);
}

function* fetchMobileRoleById(action: IEffectAction) {
    try {
        const { data: { data: payload } } = yield call(axios.get, apiMappings.settingScreen.mobileRoles.listview.getMobileRoleById+`&orgRoleId=${action.payload}`);
        yield put({ type: '@@mobileRoles/GET_MOBILE_ROLE_BY_ID_SUCCESS', payload })
    } catch ( error ) {
        console.log(error);
    }
}

export function* watchFetchMobileRoleById() {
    yield takeLatest<IMobileRolesActions>('@@mobileRoles/GET_MOBILE_ROLE_BY_ID', fetchMobileRoleById);
}

function* fetchAccessProfiles() {
    try {
        const { data: { data: payload } } = yield call(axios.get, apiMappings.settingScreen.mobileRoles.form.accessProfiles);
        yield put({ type: '@@mobileRoles/FETCH_ACCESS_PROFILES_SUCCESS', payload })
    } catch ( error ) {
        console.log(error);
    }
}

export function* watchFetchAccessProfiles() {
    yield takeLatest<IMobileRolesActions>('@@mobileRoles/FETCH_ACCESS_PROFILES', fetchAccessProfiles);
}
function* fetchMobileUserStructure() {
    try {
        const { data: payload }  = yield call(axios.get, apiMappings.settingScreen.mobileRoles.listview.mobileUsersListView.structure);
        yield put({ type: '@@mobileRoles/FETCH_MOBILE_USERS_LISTVIEW_STRUCTURE_SUCCESS', payload })
    } catch ( error ) {
        console.log(error);
    }
}

export function* watchFetchMobileUserStructure() {
    yield takeLatest<IMobileRolesActions>('@@mobileRoles/FETCH_MOBILE_USERS_LISTVIEW_STRUCTURE', fetchMobileUserStructure);
}
function* fetchMobileRoleByOrgRoleId(action: IEffectAction) {
    try {
        const { data: payload } = yield call(axios.post, apiMappings.settingScreen.mobileRoles.listview.mobileUsersListView.data, {}, { params: action.payload })
        yield put({ type: '@@mobileRoles/FETCH_MOBILE_ROLES_BY_ORG_ROLE_ID_SUCCESS', payload })
    } catch ( error ) {
        console.log(error);
    }
}

export function* watchFetchMobileRoleByOrgRoleId() {
    yield takeLatest<IMobileRolesActions>('@@mobileRoles/FETCH_MOBILE_ROLES_BY_ORG_ROLE_ID', fetchMobileRoleByOrgRoleId);
}

export function* watchMobileRolesRequest() {
    yield all ([ 
        watchfetchMobileRolesListviewStructureRequest(),
        watchFetchMobileRoleList(),
        watchFetchMobileRoleFormStructure(),
        watchFetchMobileRoleById(),
        watchFetchAccessProfiles(),
        watchFetchMobileUserStructure(),
        watchFetchMobileRoleByOrgRoleId()
    ])
}