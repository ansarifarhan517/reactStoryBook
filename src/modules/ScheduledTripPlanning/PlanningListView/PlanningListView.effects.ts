import {TripPlanningScheduler , IFetchDataAction } from './PlanningListView.actions';
import { put, takeLatest, call, all } from 'redux-saga/effects'
import axios from '../../../utils/axios'
import apiMappings from '../../../utils/apiMapping';

function* fetchViewStructure() {
  const { data: payload } = yield call<any>(axios.get, apiMappings.tripPlanningScheduler.listView.structure)
  yield put({ type: '@@planningListView/FETCH_STRUCTURE_SUCCESS', payload })

}

function* fetchData(action: IFetchDataAction) {

  yield put<TripPlanningScheduler>({ type: '@@planningListView/SET_LOADING', payload:true })

  try {
    const { data: { data: paylaod } } = yield call(axios.post, apiMappings.tripPlanningScheduler.listView.data, undefined,
      { params: {
        searchBy: action.payload?.searchBy,
        searchText: action.payload?.searchText,
        pageNumber: action.payload?.pageNumber,
        pageSize: action.payload?.pageSize,
        sortBy: action.payload?.sortBy,
        sortOrder: action.payload?.sortOrder,
        dataFetchMode: 'DATA'
      }
      })
    yield put<TripPlanningScheduler>({ type: '@@planningListView/FETCH_DATA_SUCCESS', payload: { data: paylaod } })
    yield put<TripPlanningScheduler>({ type: '@@planningListView/SET_LOADING', payload: false  })

  } catch (error) {
    console.log('ERROR', error)
    yield put<TripPlanningScheduler>({ type: '@@planningListView/SET_LOADING', payload: false  })
  }
}

export function* watchFetchPlanningListViewData() {
  yield takeLatest<IFetchDataAction>('@@planningListView/FETCH_DATA', fetchData);
}

export function* watchFetchPlanningListViewStructureRequest() {
  yield takeLatest<TripPlanningScheduler>('@@planningListView/FETCH_STRUCTURE', fetchViewStructure);
}


export function* watchplanningListView() {
  yield all([
    watchFetchPlanningListViewStructureRequest(),
    watchFetchPlanningListViewData(),
  ])
}
