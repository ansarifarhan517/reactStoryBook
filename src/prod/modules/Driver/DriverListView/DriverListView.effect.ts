import { DriverListViewActions, IFetchDataAction } from './DriverListView.actions';
import { put, takeLatest, call, select } from 'redux-saga/effects'
import axios from '../../../utils/axios'
import apiMappings from '../../../utils/apiMapping';

function* fetchDriverListViewStructure() {
  const { data: payload } = yield call<any>(axios.get, apiMappings.driver.listView.structure)
  yield put({ type: '@@driverListView/FETCH_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchStrucutreRequest() {
  yield takeLatest<DriverListViewActions>('@@driverListView/FETCH_STRUCTURE', fetchDriverListViewStructure);
}

function* fetchData(action: IFetchDataAction) {
  yield put<DriverListViewActions>({ type: '@@driverListView/SET_LOADING', payload: { listView: true, inputVal:true } })
  try {
    const { data: { data: payload } } = yield call(axios.get, apiMappings.driver.listView.data, { params: action.payload })
    const clientProperties = yield select(state => state.clientProperties)
    payload.clientProperties = clientProperties
    yield put<DriverListViewActions>({ type: '@@driverListView/FETCH_DATA_SUCCESS', payload })
    yield put<DriverListViewActions>({ type: '@@driverListView/SET_LOADING', payload: { listView: false, inputVal:false } })
  } catch (error) {
    console.log('Failed to fetch data for Driver List View: ', error)
    yield put<DriverListViewActions>({ type: '@@driverListView/SET_LOADING', payload: { listView: false, inputVal:false } })
  }
}

export function* watchFetchDataRequest() {
  yield takeLatest<IFetchDataAction>('@@driverListView/FETCH_DATA', fetchData);
}