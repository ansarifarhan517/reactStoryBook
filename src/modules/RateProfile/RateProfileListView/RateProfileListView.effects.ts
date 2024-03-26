import { RateProfileListViewActions, IFetchDataAction } from './RateProfileListView.actions';
import { put, takeLatest, call, all } from 'redux-saga/effects'
import axios from '../../../utils/axios'
import apiMappings from '../../../utils/apiMapping';
import { routeContains } from '../../../utils/hybridRouting';

function* fetchRateProfileListViewStructure() {
  const { data: payload } = yield call<any>(axios.get, apiMappings.rateProfile.listView[routeContains('carrier') ? 'carrierStructure' : 'structure'])
  yield put({ type: '@@rateProfileListView/FETCH_STRUCTURE_SUCCESS', payload })

}

function* fetchData(action: IFetchDataAction) {

  yield put<RateProfileListViewActions>({ type: '@@rateProfileListView/SET_LOADING', payload: { listView: true } })

  try {
    const { data: { data: paylaod } } = yield call(axios.post, apiMappings.rateProfile.listView.data, null, { params: action.payload })
    yield put<RateProfileListViewActions>({ type: '@@rateProfileListView/FETCH_DATA_SUCCESS', payload: { data: paylaod } })
    yield put<RateProfileListViewActions>({ type: '@@rateProfileListView/SET_LOADING', payload: { listView: false } })

  } catch (error) {
    console.log('ERROR', error)
    yield put<RateProfileListViewActions>({ type: '@@rateProfileListView/SET_LOADING', payload: { listView: false } })
  }
}

export function* watchFetchRateProfileListViewData() {
  yield takeLatest<IFetchDataAction>('@@rateProfileListView/FETCH_DATA', fetchData);
}

export function* watchFetchRateProfileListViewStructureRequest() {
  yield takeLatest<RateProfileListViewActions>('@@rateProfileListView/FETCH_STRUCTURE', fetchRateProfileListViewStructure);
}


export function* watchRateProfileListView() {
  yield all([
    watchFetchRateProfileListViewStructureRequest(),
    watchFetchRateProfileListViewData(),
  ])
}
