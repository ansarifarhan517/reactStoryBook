import { put, takeLatest, call, select, all } from 'redux-saga/effects'
import apiMappings from '../../utils/apiMapping';
import axios from '../../utils/axios';
import { IListViewRequestPayload } from '../../utils/common.interface';
import { convertArrayToObject, metricsConversion } from '../../utils/helper';
import { AdvancedFilterComponentActions } from '../common/AdvancedFilterComponent/AdvancedFilterComponent.actions';
import { tFleetTypeListViewAcions, IFetchDataAction } from './FleetTypeListView.actions';


function* fetchFleetListViewStructure() {
  try {
    const breadcrumbFilter = yield select(state => state.fleet.listView.breadcrumbFilter)
    const { data: payload } = yield call(axios.get, apiMappings.common.structure, {
      params: {
        modelName: 'DELIVERYMEDIUM',
        pageName: 'DELIVERYMEDIUM',
        sectionName: breadcrumbFilter === 'ALL' ? 'FLEET_TYPE_MASTER_LIST_VIEW' : `FLEET_TYPE_MASTER_LIST_VIEW_${breadcrumbFilter}`

      }
    })
    yield put({ type: '@@fleetTypeListView/FETCH_STRUCTURE_SUCCESS', payload })
  } catch (error) {
    console.log('Failed to fetch data for Fleet List View: ', error)
    yield put<tFleetTypeListViewAcions>({ type: '@@fleetTypeListView/SET_LOADING', payload: { listView: false } })
  }
}

export function* watchFetchFleetStrucutreRequest() {
  yield takeLatest<tFleetTypeListViewAcions>('@@fleetTypeListView/FETCH_STRUCTURE', fetchFleetListViewStructure);
}

export const breadcrumbState = {
  ALL: {
    searchBy: '',
    searchText: ''
  },
  ACTIVE: {
    searchBy: "isActiveFl",
    searchText: "Y"
  },
  INACTIVE: {
    searchBy: "isActiveFl",
    searchText: "N"
  }
}

function* fetchData(action: IFetchDataAction) {
  yield put<tFleetTypeListViewAcions>({ type: '@@fleetTypeListView/SET_LOADING', payload: { listView: !!action?.payload?.isLoading } })

  const conversionMetric = yield select(state => state.conversionMetric);
  const clientMetric = yield select(state => state.fleet.listView.clientMetric);
  // metric not there in fleet reducer then only go inside
  if (Object.keys(clientMetric).length === 0) {
    // if its not there in fleet reducer bt in global state then put in fleet reducer bt if not present in global state then call and take data
    if (Object.keys(conversionMetric).length === 0) {
      const { data, status } = yield call<any>(axios.get, apiMappings.common.clientMetric);
      if (status === 200) {
        const convertedObj = convertArrayToObject(data?.data, 'name')
        yield put<tFleetTypeListViewAcions>({ type: '@@fleetTypeListView/SET_CLIENT_METRIC_SYSTEM', payload: convertedObj });
      }
    } else {
      yield put<tFleetTypeListViewAcions>({ type: '@@fleetTypeListView/SET_CLIENT_METRIC_SYSTEM', payload: clientMetric });
    }
  }
  const advFilterLoader = yield select(state => state.advanceFilter.advFilterLoader);
  if (!!advFilterLoader) {
    const breadCrumbValue = yield select(state => state.fleet.listView.breadcrumbFilter);
    const filterListPayload = yield select(state => state.advanceFilter.filterListPayload);

    let filter: IListViewRequestPayload = { ...action.payload }

    if (breadCrumbValue && breadCrumbValue !== 'ALL') {
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
    const data = filterListPayload || {}
    try {
      delete filter?.isLoading
      filter.status = breadCrumbValue

      const { data: { data: payload } } = yield call(axios.post, apiMappings.fleet.listView.data, data,
        {
          params: filter

        }
      )
      const clientProperties = yield select(state => state.clientProperties)
      payload.clientProperties = clientProperties

      /********* CHECK WHETHER PAYLOAD AND PARAMS ARE BOTH EMPTY THEN NO DATA *************/
      let isParamsEmpty = (Object.keys(filter).length > 1) && !filter['searchBy'] && !filter['searchText'] && !filter['sortBy'] && !filter['sortOrder']
      if (isParamsEmpty && payload?.results?.length < 1 && !filterListPayload) {
        yield put<AdvancedFilterComponentActions>({ type: '@@advanceFilter/SET_EMPTY_DATA', payload: true });

      } else {
        yield put<AdvancedFilterComponentActions>({ type: '@@advanceFilter/SET_EMPTY_DATA', payload: false });
        yield put<tFleetTypeListViewAcions>({ type: '@@fleetTypeListView/FETCH_DATA_SUCCESS', payload: payload });

      }

      yield put<tFleetTypeListViewAcions>({ type: '@@fleetTypeListView/SET_LOADING', payload: { listView: false } })

    } catch (error) {
      console.log('Failed to fetch data for fleet List View: ', error)
      yield put<tFleetTypeListViewAcions>({ type: '@@fleetTypeListView/SET_LOADING', payload: { listView: false } })
    }
  }
}

export function* watchFetchFleetDataRequest() {
  yield takeLatest<IFetchDataAction>('@@fleetTypeListView/FETCH_DATA', fetchData);
}
function* fetchInitialData() {
  try {

    const { data: weeks } = yield call(axios.get, apiMappings.common.weeklyOff);
    yield put<tFleetTypeListViewAcions>({ type: '@@fleetTypeListView/UPDATE_WEEKLY_OFF', payload: weeks });


    const { data: type } = yield call(axios.get, apiMappings.common.delMedType);
    yield put<tFleetTypeListViewAcions>({ type: '@@fleetTypeListView/GET_DELIVERY_TYPE', payload: type });

  } catch (error) {
    console.log('Failed to fetch data for Fleet List View: ', error)
    yield put<tFleetTypeListViewAcions>({ type: '@@fleetTypeListView/SET_LOADING', payload: { listView: false } })
  }

}
export function* watchInitialLoad() {
  yield takeLatest<tFleetTypeListViewAcions>('@@fleetTypeListView/INITIAL_LOAD', fetchInitialData);
}
function* fetchCompartmentListViewStructure() {
  try  {
      const { data: payload } = yield call(axios.get, apiMappings.compartmentConfiguration.listPopup.structure);
      yield put({ type: '@@fleetTypeListView/FETCH_COMPARTMENT_LIST_STRUCTURE_SUCCESS', payload })

  } catch (error) {
      console.log(error);
  }
}
export function* watchFetchCompartmentListViewStructure() {
  yield takeLatest<tFleetTypeListViewAcions>('@@fleetTypeListView/FETCH_COMPARTMENT_LIST_STRUCTURE', fetchCompartmentListViewStructure);
}
export function* watchFleetTypeListView() {
  yield all([
    watchFetchFleetDataRequest(),
    watchFetchFleetStrucutreRequest(),
    watchInitialLoad(),
    watchFetchCompartmentListViewStructure(),
  ])
}