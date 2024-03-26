import { put, takeLatest, call, all , select} from 'redux-saga/effects';
import apiMappings from '../../utils/apiMapping';
import axios from '../../utils/axios';
import { AlertsHistoryActions } from './AlertsHistory.actions';
import {AdvancedFilterComponentActions} from '../common/AdvancedFilterComponent/AdvancedFilterComponent.actions'

function* fetchAlertsHistoryListViewStructure() {
    const { data: payload } = yield call<any>(axios.get, apiMappings.alertsHistory.getColumnsList);
    yield put({ type: '@@alertsHistory/FETCH_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchAlertsHistoryListViewStructure() {
    yield takeLatest<AlertsHistoryActions>('@@alertsHistory/FETCH_STRUCTURE', fetchAlertsHistoryListViewStructure);
}

function* fetchAlertsHistoryData(action: any) {

  const advFilterLoader = yield select(state => state.advanceFilter.advFilterLoader);
  if (!!advFilterLoader) {

    const filterListPayload = yield select(state => state.advanceFilter.filterListPayload);
    const data = filterListPayload || undefined


    const { data: { data: payload } } = yield call<any>(axios.post, apiMappings.alertsHistory.getAlertsData, data, { params: action.payload.params });
    /********* CHECK WHETHER PAYLOAD AND PARAMS ARE BOTH EMPTY THEN NO DATA *************/
    let isParamsEmpty = (Object.keys(action.payload.params).length > 1) && !action.payload.params['searchBy'] && !action.payload.params['searchText'] && !action.payload.params['sortBy'] && !action.payload.params['sortOrder']
    if (isParamsEmpty && payload?.results?.length < 1 && !filterListPayload) {
      yield put<AdvancedFilterComponentActions>({ type: '@@advanceFilter/SET_EMPTY_DATA', payload: true });
    } else {
      yield put<AdvancedFilterComponentActions>({ type: '@@advanceFilter/SET_EMPTY_DATA', payload: false });
    }
    yield put({ type: '@@alertsHistory/FETCH_DATA_SUCCESS', payload })
    
  }
}

export function* watchFetchAlertsHistoryData() {
    yield takeLatest<AlertsHistoryActions>('@@alertsHistory/FETCH_DATA', fetchAlertsHistoryData);
}


export function* watchAlretsHistoryRequest() {
    yield all([
        watchFetchAlertsHistoryListViewStructure(),
        watchFetchAlertsHistoryData()
    ])
}
