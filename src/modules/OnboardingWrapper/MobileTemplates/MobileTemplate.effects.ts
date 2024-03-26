import { all, takeLatest, put, call } from "redux-saga/effects";
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import store from "../../../utils/redux/store";
import { IMobileTemplateActions } from './MobileTemplate.actions';
import { IEffectAction } from "./MobileTemplate.models";
import { addMissingFields } from "./utils";


function* fetchMobileTemplateListviewStructure() {
    try {
        const { data: payload } = yield call(axios.get, apiMappings.settingScreen.mobileTemplates.listview.structure)
        yield put({ type: '@@mobileTemplates/FETCH_LISTVIEW_STRUCTURE_SUCCESS', payload })
    } catch ( error ) {
        console.log(error);
    }
}

export function* watchFetchMobileTemplateListviewStructureRequest() {
    yield takeLatest<IMobileTemplateActions>('@@mobileTemplates/FETCH_LISTVIEW_STRUCTURE', fetchMobileTemplateListviewStructure);
}

function* fetchMobileTemplateFormStructure() {
    try {
        const { data: payload } = yield call(axios.get, apiMappings.settingScreen.mobileTemplates.form.structure)
        yield put({ type: '@@mobileTemplates/FETCH_MOBILE_TEMPLATES_FORM_STRUCTURE_SUCCESS', payload })
    } catch ( error ) {
        console.log(error);
    }
}

export function* watchFetchMobileTemplateFormStructure() {
    yield takeLatest<IMobileTemplateActions>('@@mobileTemplates/FETCH_MOBILE_TEMPLATES_FORM_STRUCTURE', fetchMobileTemplateFormStructure);
}

function* fetchMobileTemplateList(action: IEffectAction) {
    try {
        const { data: payload } = yield call(axios.post, apiMappings.settingScreen.mobileTemplates.listview.data, {}, { params: action.payload })
        yield put({ type: '@@mobileTemplates/FETCH_MOBILE_TEMPLATE_LIST_SUCCESS', payload })
    } catch ( error ) {
        console.log(error);
    }
}

export function* watchFetchMobileTemplateList() {
    yield takeLatest<IMobileTemplateActions>('@@mobileTemplates/FETCH_MOBILE_TEMPLATE_LIST', fetchMobileTemplateList);
}

function* fetchMobileRolesListviewStructure() {
    try {
        const { data: payload } = yield call(axios.get, apiMappings.settingScreen.mobileTemplates.listview.mobileRolesListView.structure)
        yield put({ type: '@@mobileTemplates/FETCH_MOBILE_ROLES_LISTVIEW_STRUCTURE_SUCCESS', payload })
    } catch ( error ) {
        console.log(error);
    }
}

export function* watchFetchMobileRolesListviewStructure() {
    yield takeLatest<IMobileTemplateActions>('@@mobileTemplates/FETCH_MOBILE_ROLES_LISTVIEW_STRUCTURE', fetchMobileRolesListviewStructure);
}

function* fetchMobileRoleByAccessProfileId(action: IEffectAction) {
    try {
        const { data: payload } = yield call(axios.post, apiMappings.settingScreen.mobileTemplates.listview.mobileRolesListView.data, {}, { params: action.payload })
        yield put({ type: '@@mobileTemplates/FETCH_MOBILE_ROLES_BY_ACCESS_PROFILE_ID_SUCCESS', payload })
    } catch ( error ) {
        console.log(error);
    }
}

export function* watchFetchMobileRoleByAccessProfileId() {
    yield takeLatest<IMobileTemplateActions>('@@mobileTemplates/FETCH_MOBILE_ROLES_BY_ACCESS_PROFILE_ID', fetchMobileRoleByAccessProfileId);
}

function* fetchMobileTemplateAccordionStructure() {
    try {
        const { data: {data: payload} } = yield call(axios.get, apiMappings.settingScreen.mobileTemplates.form.accordian);
        yield put({ type: '@@mobileTemplates/FETCH_MOBILE_TEMPLATE_ACCORDION_STRUCTURE_SUCCESS', payload })
    } catch ( error ) {
        console.log(error);
    }
}

export function* watchFetchMobileTemplateAccordionStructure() {
    yield takeLatest<IMobileTemplateActions>('@@mobileTemplates/FETCH_MOBILE_TEMPLATE_ACCORDION_STRUCTURE', fetchMobileTemplateAccordionStructure);
}

function* fetchMobileTemplateById(action:IEffectAction) {
    try {
        const { data: {data: payload} } = yield call(axios.get, apiMappings.settingScreen.mobileTemplates.listview.getMobileTemplateById + `?accessProfileId=${action.payload}`);
        yield put({ type: '@@mobileTemplates/GET_MOBILE_TEMPLATE_BY_ID_SUCCESS', payload })
    } catch ( error ) {
        console.log(error);
    }
}

export function* watchFetchMobileTemplateById() {
    yield takeLatest<IMobileTemplateActions>('@@mobileTemplates/GET_MOBILE_TEMPLATE_BY_ID', fetchMobileTemplateById);
}

function* fetchNewOrderTileList(action: IEffectAction) {
    try {
        const { data: {data: payload} } = yield call(axios.get, apiMappings.settingScreen.mobileTemplates.dynamicOrder.dynamicStructure[`${action.payload}`]);
        const masterStructure = store.getState().settingScreen.mobileTemplates.dynamicOrder.masterStructure;
        if(Object.keys(masterStructure.structure.columns).length > 0) {
            yield put({ type: '@@mobileTemplates/GET_NEW_ORDER_TILE_LIST_SUCCESS', payload: addMissingFields(payload) })
        }
    } catch ( error ) {
        console.log(error);
    }
}
export function* watchFetchNewOrderTileList() {
    yield takeLatest<IMobileTemplateActions>('@@mobileTemplates/GET_NEW_ORDER_TILE_LIST', fetchNewOrderTileList);
}

function* fetchDynamicOrderMasterStructure(action: IEffectAction) {
    try {
        const { data: {data: payload} } = yield call(axios.get, apiMappings.settingScreen.mobileTemplates.dynamicOrder.masterStructure[`${action.payload}`]);
        yield put({ type: '@@mobileTemplates/FETCH_DYNAMIC_ORDER_MASTER_STRUCTURE_SUCCESS', payload })
    } catch ( error ) {
        console.log(error);
    }
}

export function* watchFetchDynamicOrderMasterStructure() {
    yield takeLatest<IMobileTemplateActions>('@@mobileTemplates/FETCH_DYNAMIC_ORDER_MASTER_STRUCTURE', fetchDynamicOrderMasterStructure);
}

function* fetchNewOrderTileListById(action: IEffectAction) {
    try {
        const { data: {data: payload} } = yield call(axios.get, apiMappings.settingScreen.mobileTemplates.dynamicOrder.dynamicStructure[`${action.payload.orderType}`] + `&accessProfileId=${action.payload.accessProfileId}`);
        yield put({ type: '@@mobileTemplates/GET_NEW_ORDER_TILE_LIST_SUCCESS', payload: addMissingFields(payload) })
    } catch ( error ) {
        console.log(error);
    }
}

export function* watchFetchNewOrderTileListById() {
    yield takeLatest<IMobileTemplateActions>('@@mobileTemplates/GET_NEW_ORDER_TILE_LIST_BY_ID', fetchNewOrderTileListById);
}

function* fetchAddressFields(action: IEffectAction) {
    try {
        const { data: payload} = yield call(axios.post, apiMappings.settingScreen.mobileTemplates.dynamicOrder.masterStructure.address+`&country=${action.payload.country}`, action.payload.fields);
        yield put({ type: '@@mobileTemplates/FETCH_ADDRESS_FIELDS_SUCCESS', payload })
    } catch ( error ) {
        console.log(error);
    }
}

export function* watchFetchAddressFields() {
    yield takeLatest<IMobileTemplateActions>('@@mobileTemplates/FETCH_ADDRESS_FIELDS', fetchAddressFields);
}

export function* watchMobileTemplateRequest() {
    yield all ([ 
        watchFetchMobileTemplateListviewStructureRequest(),
        watchFetchMobileTemplateFormStructure(),
        watchFetchMobileTemplateList(),
        watchFetchMobileRolesListviewStructure(),
        watchFetchMobileRoleByAccessProfileId(),
        watchFetchMobileTemplateAccordionStructure(),
        watchFetchMobileTemplateById(),
        watchFetchNewOrderTileList(),
        watchFetchDynamicOrderMasterStructure(),
        watchFetchNewOrderTileListById(),
        watchFetchAddressFields()
    ])
}