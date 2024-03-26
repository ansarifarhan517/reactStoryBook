import { VehicleListViewActions, IFetchDataAction, IFetchTrackerDataAction } from './VehicleListView.actions';
import { put, takeLatest, call, select, all } from 'redux-saga/effects';
import axios from '../../../utils/axios';
import apiMappings from '../../../utils/apiMapping';
import breadcrumbState from './utils/breadcrumbState'
import { IListViewRequestPayload } from '../../../utils/common.interface';
import { AdvancedFilterComponentActions } from '../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions';
import { metricsConversion } from '../../../utils/helper';



function* fetchVehicleListViewStructure() {

  yield put<VehicleListViewActions>({ type: '@@vehicleListView/SET_COLUMNS_LOADING', payload: { columns: true } });
  const breadCrumbValue = yield select(state => state.vehicle.listView.breadcrumbState);


  // GET STRUCTURE
  try {
    const { data: payload, status } = yield call<any>(axios.get, apiMappings.vehicle.listView.structure[breadCrumbValue]);
    if (status === 200) {
      yield put({ type: '@@vehicleListView/FETCH_STRUCTURE_SUCCESS', payload });
      yield put<VehicleListViewActions>({ type: '@@vehicleListView/SET_COLUMNS_LOADING', payload: { columns: false } });

    }
  } catch (error) {
    yield put<VehicleListViewActions>({ type: '@@vehicleListView/SET_COLUMNS_LOADING', payload: { columns: false } });
  }

}

function* fetchData(action: IFetchDataAction) {

  // GET CLIENT METRIC
  const clientMetric = yield select(state => state.vehicle.listView.clientMetric);

  if (clientMetric && clientMetric?.length < 1) {
    try {
      const { data, status } = yield call<any>(axios.get, apiMappings.common.clientMetric);
      if (status === 200) {
        yield put({ type: '@@vehicleListView/SET_CLIENT_METRIC_SYSTEM', payload: data.data });
      }
    } catch (error) {
      console.log('cannot load client metric properties')
    }
  }
  yield put<VehicleListViewActions>({ type: '@@vehicleListView/SET_LOADING', payload: { listView: true } });

  const advFilterLoader = yield select(state => state.advanceFilter.advFilterLoader);

  if (!!advFilterLoader) {

    const breadCrumbValue = yield select(state => state.vehicle.listView.breadcrumbState);
    const filterListPayload = yield select(state => state.advanceFilter.filterListPayload);
    const minDate = yield select(state => state.vehicle.listView.minDate);
    const maxDate = yield select(state => state.vehicle.listView.maxDate);

    let filter: IListViewRequestPayload = { ...action.payload }
   
    if (breadCrumbValue && breadCrumbValue !== 'All') {
      if (action?.payload?.searchBy && action?.payload?.searchText) {
        filter = {
          ...filter,
          searchBy: breadcrumbState[breadCrumbValue]?.searchBy + '#@#' + action.payload?.searchBy,
          searchText: breadcrumbState[breadCrumbValue].searchText + '#@#' + action.payload?.searchText,
        }
      } else {
        filter = {
          ...filter,
          searchBy: breadcrumbState[breadCrumbValue]?.searchBy,
          searchText: breadcrumbState[breadCrumbValue]?.searchText,
        }
      }
    }
   
    const data = filterListPayload || undefined
    try {
      delete filter?.isLoading
      const { data: { data: payload } } = yield call(axios.post, apiMappings.vehicle.listView.data, data,
        {
          params: {
            ...filter,
            endDateFilter: maxDate,
            startDateFilter: minDate,
            status: breadCrumbValue
          },
        }
      )

      const clientProperties = yield select(state => state.clientProperties)
      payload.clientProperties = clientProperties

      /********* CHECK WHETHER PAYLOAD AND PARAMS ARE BOTH EMPTY THEN NO DATA *************/
      let isParamsEmpty = (Object.keys(filter).length > 1) && !filter['searchBy'] && !filter['searchText'] && !filter['sortBy'] && !filter['sortOrder']
      if (isParamsEmpty && payload?.results?.length < 1 && !filterListPayload) {
        yield put<AdvancedFilterComponentActions>({ type: '@@advanceFilter/SET_EMPTY_DATA', payload: true });
        yield put<VehicleListViewActions>({ type: '@@vehicleListView/SET_EMPTY_DATA', payload: true });
      } else {
        yield put<VehicleListViewActions>({ type: '@@vehicleListView/FETCH_DATA_SUCCESS', payload: payload });
        yield put<AdvancedFilterComponentActions>({ type: '@@advanceFilter/SET_EMPTY_DATA', payload: false });

      }

      yield put<VehicleListViewActions>({ type: '@@vehicleListView/SET_LOADING', payload: { listView: false } })

    } catch (error) {
      console.log('Failed to fetch data for OrderRequest List View: ', error)
      yield put<VehicleListViewActions>({ type: '@@vehicleListView/SET_LOADING', payload: { listView: false } })
    }
  }
}
function* fetchCompartmentListViewStructure() {
  try  {
      const { data: payload } = yield call(axios.get, apiMappings.compartmentConfiguration.listPopup.structure);
      yield put({ type: '@@vehicleListView/FETCH_COMPARTMENT_LIST_STRUCTURE_SUCCESS', payload })

  } catch (error) {
      console.log(error);
  }
}
export function* watchFetchCompartmentListViewStructure() {
  yield takeLatest<VehicleListViewActions>('@@vehicleListView/FETCH_COMPARTMENT_LIST_STRUCTURE', fetchCompartmentListViewStructure);
}
function* fetchTrackerListViewStructure() {
  const trackerListStructure = yield select(state => state.vehicle.listView.trackerListStructure);
  if (trackerListStructure?.columns && Object.keys(trackerListStructure?.columns).length > 0) {
    yield put({ type: '@@vehicleListView/FETCH_TRACKER_LIST_STRUCTURE_SUCCESS', trackerListStructure })
  }
  else {
    try {
      const { data: payload } = yield call(axios.get, apiMappings.vehicle.listView.structure.trackerListStructure);
      yield put({ type: '@@vehicleListView/FETCH_TRACKER_LIST_STRUCTURE_SUCCESS', payload })
    } catch (error) {
      console.log(error);
    }
  }
}
export function* watchFetchTrackerListViewStructure() {
  yield takeLatest<VehicleListViewActions>('@@vehicleListView/FETCH_TRACKER_LIST_STRUCTURE', fetchTrackerListViewStructure);
}
function* fetchtrackerData(action: IFetchTrackerDataAction) {
    try  {
      const { data: { data: payload } } = yield call(axios.post, apiMappings.vehicle.listView.trackerListData,
       {}, { params: action.payload }
      )
        yield put({ type: '@@vehicleListView/FETCH_TRACKER_LIST_DATA_SUCCESS', payload })
  
    } catch (error) {
        console.log(error);
    }
}
export function* watchFetchTrackerDataRequest() {
  yield takeLatest<IFetchTrackerDataAction>('@@vehicleListView/FETCH_TRACKER_LIST_DATA', fetchtrackerData);
}
export function* watchFetchVehicleStructureRequest() {
  yield takeLatest<VehicleListViewActions>('@@vehicleListView/FETCH_STRUCTURE', fetchVehicleListViewStructure);
}
export function* watchFetchVehicleDataRequest() {
  yield takeLatest<IFetchDataAction>('@@vehicleListView/FETCH_DATA', fetchData);
}

export function* watchVehicleListView() {
  yield all([
    watchFetchVehicleDataRequest(),
    watchFetchVehicleStructureRequest(),
    watchFetchCompartmentListViewStructure(),
    watchFetchTrackerListViewStructure(),
    watchFetchTrackerDataRequest()
  ])
}
