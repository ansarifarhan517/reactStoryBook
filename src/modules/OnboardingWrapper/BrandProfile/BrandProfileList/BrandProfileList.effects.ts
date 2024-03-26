import { put, takeLatest, call, select, all } from 'redux-saga/effects'
import apiMappings from '../../../../utils/apiMapping';
import axios from '../../../../utils/axios';
import { BrandProfileListActions } from './BrandProfileList.actions';

function* fetchBrandProfileListStructure() {
    yield put<BrandProfileListActions>({ type: '@@brandProfileList/SET_COLUMNS_LOADING', payload: { columns: true } });
    try {
        const { data: payload } = yield call<any>(axios.get, apiMappings.brandProfile.listView.structure)
        yield put({ type: '@@brandProfileList/FETCH_STRUCTURE_SUCCESS', payload })
        yield put<BrandProfileListActions>({ type: '@@brandProfileList/SET_COLUMNS_LOADING', payload: { columns: false } });
    } catch ( error ) {
      yield put<BrandProfileListActions>({ type: '@@brandProfileList/SET_COLUMNS_LOADING', payload: { columns: false } });
    }
}
  
export function* watchFetchStrucutreRequest() {
    yield takeLatest<BrandProfileListActions>('@@brandProfileList/FETCH_STRUCTURE', fetchBrandProfileListStructure);
}

function* fetchData(action: any) {
    yield put<BrandProfileListActions>({ type: '@@brandProfileList/SET_LOADING', payload: { listView: true } })
    try {
      // const { data: { data: payload } } = yield call(axios.post, apiMappings.cashTransaction.listView.data, {})\
      const { data: { data: payload } } = yield call(axios.get, apiMappings.brandProfile.listView.data, { params: action.payload })
      const clientProperties = yield select(state => state.clientProperties)
      payload.clientProperties = clientProperties
      yield put<BrandProfileListActions>({ type: '@@brandProfileList/FETCH_DATA_SUCCESS', payload })
      yield put<BrandProfileListActions>({ type: '@@brandProfileList/SET_LOADING', payload: { listView: false } })
    } catch (error) {
      yield put<BrandProfileListActions>({ type: '@@brandProfileList/SET_LOADING', payload: { listView: false } })
    }
}
  
export function* watchFetchDataRequest() {
    yield takeLatest<BrandProfileListActions>('@@brandProfileList/FETCH_DATA', fetchData);
}

function* fetchBrandProfileDetailsData(action: any) {
    yield put<BrandProfileListActions>({ type: '@@brandProfileList/SET_FORM_LOADING', payload: true  })
    try {
      // const { data: { data: payload } } = yield call(axios.post, apiMappings.cashTransaction.listView.data, {})\
      const { data: { data: payload } } = yield call(axios.get, apiMappings.brandProfile.listView.getBrandProfileDetails, { params: action.payload })
      const clientProperties = yield select(state => state.clientProperties)
      payload.clientProperties = clientProperties
      yield put<BrandProfileListActions>({ type: '@@brandProfileList/SET_BRAND_PROFILE_DETAILS_DATA', payload })
      yield put<BrandProfileListActions>({ type: '@@brandProfileList/SET_FORM_LOADING', payload: false })
    } catch (error) {
      yield put<BrandProfileListActions>({ type: '@@brandProfileList/SET_FORM_LOADING', payload: false })
    }
}

export function* watchFetchBrandProfileDetailsDataRequest() {
    yield takeLatest<BrandProfileListActions>('@@brandProfileList/GET_BRAND_PROFILE_DETAILS_DATA', fetchBrandProfileDetailsData);
}

function* fetchDefaultTemplateData(action: any) {
  yield put<BrandProfileListActions>({ type: '@@brandProfileList/SET_COLUMNS_LOADING', payload: { columns: true } });
    try {
        const { data: {data : payload} } = yield call<any>(axios.get, apiMappings.brandProfile.listView.getDefaultTemplate, { params: action.payload })
        yield put({ type: '@@brandProfileList/GET_DEFAULT_TEMPLATE_DATA_SUCCESS', payload })
        yield put<BrandProfileListActions>({ type: '@@brandProfileList/SET_COLUMNS_LOADING', payload: { columns: false } });
    } catch ( error ) {
      yield put<BrandProfileListActions>({ type: '@@brandProfileList/SET_COLUMNS_LOADING', payload: { columns: false } });
    }
}

export function* watchFetchDefaultTemplateDataRequest() {
  yield takeLatest<BrandProfileListActions>('@@brandProfileList/GET_DEFAULT_TEMPLATE_DATA', fetchDefaultTemplateData);
}

export function* watchBrandProfileList () {
    yield all ([
        watchFetchStrucutreRequest(),
        watchFetchDataRequest(),
        watchFetchBrandProfileDetailsDataRequest(),
        watchFetchDefaultTemplateDataRequest()
    ])
}
