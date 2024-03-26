import { all, call, put, takeLatest } from "redux-saga/effects";
import apiMappings from "../../../utils/apiMapping";
import axios from "../../../utils/axios";
import { ExceptionHandlingActions } from "./ExceptionHandling.actions";
import { IEffectAction } from "./ExceptionHandling.models";

function* fetchExceptionFormStructure() {
    const { data: payload } = yield call(axios.get, apiMappings.exceptionHandling.form.structure)
    yield put<ExceptionHandlingActions>({ type: '@@exceptionHandling/FETCH_FORM_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchExceptionFormStructureRequest() {
    yield takeLatest<ExceptionHandlingActions>('@@exceptionHandling/FETCH_FORM_STRUCTURE', fetchExceptionFormStructure);
}

function* fetchExceptionEvents() {
    const { data: { data: payload } } = yield call(axios.get, apiMappings.exceptionHandling.form.events)
    yield put<ExceptionHandlingActions>({ type: '@@exceptionHandling/FETCH_EXCEPTION_EVENTS_SUCCESS', payload })
}

export function* watchFetchExceptionEventsRequest() {
    yield takeLatest<ExceptionHandlingActions>('@@exceptionHandling/FETCH_EXCEPTION_EVENTS', fetchExceptionEvents);
}

function* fetchAllExceptionsListviewStructure() {
    const { data: payload } = yield call(axios.get, apiMappings.exceptionHandling.listview.allExceptions.structure)
    yield put<ExceptionHandlingActions>({ type: '@@exceptionHandling/FETCH_ALL_EXCEPTIONS_LISTVIEW_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchAllExceptionsListviewStructureRequest() {
    yield takeLatest<ExceptionHandlingActions>('@@exceptionHandling/FETCH_ALL_EXCEPTIONS_LISTVIEW_STRUCTURE', fetchAllExceptionsListviewStructure);
}

function* fetchAllExceptionsList(action:IEffectAction) {
    const  { data: { data: payload } } = yield call(axios.post, apiMappings.exceptionHandling.listview.allExceptions.data,null, { params: action.payload })
    yield put<ExceptionHandlingActions>({ type: '@@exceptionHandling/FETCH_ALL_EXCEPTIONS_LIST_SUCCESS', payload })
}

export function* watchFetchAllExceptionsListRequest() {
    yield takeLatest<ExceptionHandlingActions>('@@exceptionHandling/FETCH_ALL_EXCEPTIONS_LIST', fetchAllExceptionsList);
}

function* fetchExceptionStageList() {
    const  { data: payload } = yield call(axios.get, apiMappings.common.lookup.exceptionStage)
    yield put<ExceptionHandlingActions>({ type: '@@exceptionHandling/FETCH_EXCEPTION_STAGE_LIST_SUCCESS', payload })
}

export function* watchFetchExceptionStageListRequest() {
    yield takeLatest<ExceptionHandlingActions>('@@exceptionHandling/FETCH_EXCEPTION_STAGE_LIST', fetchExceptionStageList);
}

function* fetchExceptionTypeList() {
    const  { data: payload } = yield call(axios.get, apiMappings.common.lookup.exceptionType)
    yield put<ExceptionHandlingActions>({ type: '@@exceptionHandling/FETCH_EXCEPTION_TYPE_LIST_SUCCESS', payload })
}

export function* watchFetchExceptionTypeListRequest() {
    yield takeLatest<ExceptionHandlingActions>('@@exceptionHandling/FETCH_EXCEPTION_TYPE_LIST', fetchExceptionTypeList);
}

function* fetchExceptionAppliesToList() {
    const  { data: payload } = yield call(axios.get, apiMappings.common.lookup.exceptionAppliesTo)
    yield put<ExceptionHandlingActions>({ type: '@@exceptionHandling/FETCH_EXCEPTION_APPLIES_TO_SUCCESS', payload })
}

export function* watchFetchExceptionAppliesToListRequest() {
    yield takeLatest<ExceptionHandlingActions>('@@exceptionHandling/FETCH_EXCEPTION_APPLIES_TO', fetchExceptionAppliesToList);
}

function* fetchExceptionById(action:IEffectAction) {
    const { data: { data: payload } } = yield call(axios.get, `${apiMappings.exceptionHandling.form.getById}?exceptionGroupId=${action.payload}`)
    yield put<ExceptionHandlingActions>({ type: '@@exceptionHandling/FETCH_EXCEPTION_BY_ID_SUCCESS', payload })
}

export function* watchFetchExceptionByIdRequest() {
    yield takeLatest<ExceptionHandlingActions>('@@exceptionHandling/FETCH_EXCEPTION_BY_ID', fetchExceptionById);
}

function* fetchOrderExceptionListviewStructure() {
    const { data:  payload  } = yield call(axios.get, apiMappings.exceptionHandling.listview.raisedExceptions.orders.structure)
    yield put<ExceptionHandlingActions>({ type: '@@exceptionHandling/FETCH_ORDER_EXCEPTIONS_LISTVIEW_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchOrderExceptionListviewStructureRequest() {
    yield takeLatest<ExceptionHandlingActions>('@@exceptionHandling/FETCH_ORDER_EXCEPTIONS_LISTVIEW_STRUCTURE', fetchOrderExceptionListviewStructure);
}

function* fetchManifestExceptionListviewStructure() {
    const { data:  payload  } = yield call(axios.get, apiMappings.exceptionHandling.listview.raisedExceptions.manifests.structure)
    yield put<ExceptionHandlingActions>({ type: '@@exceptionHandling/FETCH_MANIFEST_EXCEPTIONS_LISTVIEW_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchManifestExceptionListviewStructureRequest() {
    yield takeLatest<ExceptionHandlingActions>('@@exceptionHandling/FETCH_MANIFEST_EXCEPTIONS_LISTVIEW_STRUCTURE', fetchManifestExceptionListviewStructure);
}

function* fetchOrdersExceptionsList(action:IEffectAction) {
    const  { data: { data: payload } } = yield call(axios.post, apiMappings.exceptionHandling.listview.raisedExceptions.orders.data,null, { params: action.payload })
    yield put<ExceptionHandlingActions>({ type: '@@exceptionHandling/FETCH_ORDER_EXCEPTIONS_LIST_SUCCESS', payload })
}

export function* watchFetchOrdersExceptionsListRequest() {
    yield takeLatest<ExceptionHandlingActions>('@@exceptionHandling/FETCH_ORDER_EXCEPTIONS_LIST', fetchOrdersExceptionsList);
}

function* fetchManifestsExceptionsList(action:IEffectAction) {
    const  { data: { data: payload } } = yield call(axios.post, apiMappings.exceptionHandling.listview.raisedExceptions.orders.data,null, { params: action.payload })
    yield put<ExceptionHandlingActions>({ type: '@@exceptionHandling/FETCH_MANIFEST_EXCEPTIONS_LIST_SUCCESS', payload })
}

export function* watchFetchManifestsExceptionsListRequest() {
    yield takeLatest<ExceptionHandlingActions>('@@exceptionHandling/FETCH_MANIFEST_EXCEPTIONS_LIST', fetchManifestsExceptionsList);
}

function* fetchExceptionStatusList() {
    const  { data: payload } = yield call(axios.get, apiMappings.exceptionHandling.lookup.exceptionStatus)
    yield put<ExceptionHandlingActions>({ type: '@@exceptionHandling/FETCH_EXCEPTION_STATUS_SUCCESS', payload })
}

export function* watchFetchExceptionStatusListRequest() {
    yield takeLatest<ExceptionHandlingActions>('@@exceptionHandling/FETCH_EXCEPTION_STATUS', fetchExceptionStatusList);
}

function* fetchOrderStatusList() {
    const  { data: payload } = yield call(axios.get, apiMappings.common.getOrderStatus)
    yield put<ExceptionHandlingActions>({ type: '@@exceptionHandling/FETCH_ORDER_STATUS_SUCCESS', payload })
}

export function* watchFetchOrderStatusListRequest() {
    yield takeLatest<ExceptionHandlingActions>('@@exceptionHandling/FETCH_ORDER_STATUS', fetchOrderStatusList);
}

export function* watchExceptionHandlingRequest() {
    yield all([
        watchFetchExceptionFormStructureRequest(),
        watchFetchExceptionEventsRequest(),
        watchFetchAllExceptionsListviewStructureRequest(),
        watchFetchAllExceptionsListRequest(),
        watchFetchExceptionStageListRequest(),
        watchFetchExceptionTypeListRequest(),
        watchFetchExceptionAppliesToListRequest(),
        watchFetchExceptionByIdRequest(),
        watchFetchOrderExceptionListviewStructureRequest(),
        watchFetchManifestExceptionListviewStructureRequest(),
        watchFetchOrdersExceptionsListRequest(),
        watchFetchManifestsExceptionsListRequest(),
        watchFetchExceptionStatusListRequest(),
        watchFetchOrderStatusListRequest()
    ])
}