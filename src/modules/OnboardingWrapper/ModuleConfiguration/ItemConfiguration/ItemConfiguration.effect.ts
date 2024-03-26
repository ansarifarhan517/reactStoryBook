import { put, takeLatest, call, fork, select } from 'redux-saga/effects'
import axios from '../../../../utils/axios'
import apiMappings from '../../../../utils/apiMapping';
import { ItemConfigurationActions, IFetchDataAction } from './ItemConfiguration.actions'
import store from '../../../../utils/redux/store';
import { metricsConversion } from '../../../../utils/helper';

function* fetchUserListViewStructure() {
  // fetch system metric before
  const systemMetric = yield select(state => state.itemConfiguration.listView.systemMetric);
  if(!systemMetric || systemMetric?.length === 0) {
    const { data: {data: payload} } = yield call<any>(axios.get, apiMappings.common.clientMetric)
    yield put<ItemConfigurationActions>({ type: '@@itemConfiguration/FETCH_SYSTEM_METRIC', payload })
  }

  const { data: payload } = yield call<any>(axios.get, apiMappings.itemConfiguration.listView.structure)
  yield put<ItemConfigurationActions>({ type: '@@itemConfiguration/FETCH_STRUCTURE_SUCCESS', payload })

  const isTempCategory = yield select(state => state.itemConfiguration.listView.temperatureCategory);
  if(!isTempCategory || isTempCategory?.length < 1) {
    const { data: payload } = yield call<any>(axios.get, apiMappings.common.lookup.temperatureCategory)
    yield put<ItemConfigurationActions>({ type: '@@itemConfiguration/FETCH_TEMPERATURE_OPTIONS', payload })
  }
  
  
  
}

export function* watchFetchStrucutreRequest() {
  yield takeLatest<ItemConfigurationActions>('@@itemConfiguration/FETCH_STRUCTURE', fetchUserListViewStructure);
}

function* fetchData(action: any) {
    const { data: {data: payload} } = yield call<any>(axios.post, apiMappings.itemConfiguration.listView.getListData, action.payload.data ,{ params: action.payload.params });
    yield put<ItemConfigurationActions>({ type: '@@itemConfiguration/FETCH_DATA_SUCCESS', payload })
}

export function* watchFetchDataRequest() {
  yield takeLatest<IFetchDataAction>('@@itemConfiguration/FETCH_DATA', fetchData);
}

export function* watchItemConfigurationRequest() {
  yield fork(watchFetchStrucutreRequest)
  yield fork(watchFetchDataRequest)
}