import { tDAListViewActions, IFetchDataAction } from './DeliveryAssociate.actions';
import { put, takeLatest, call, select, all } from 'redux-saga/effects';
import axios from '../../../utils/axios';
import apiMappings from '../../../utils/apiMapping';
import store from '../../../utils/redux/store';
import { getGoogleAPIKey } from '../../../utils/components/Map/MapHelper';
import { AdvancedFilterComponentActions } from '../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions';
//import { hybridRouteTo } from '../../../utils/hybridRouting';

function* fetchDAListViewStructure() {
  const viewMode = store.getState().deliveryMedium.listView.viewMode;
  const params = {
    modelName: 'DELIVERYMEDIUM',
    pageName: 'DELIVERYMEDIUM',
    sectionName: viewMode === 'listview' ? 'DELIVERY_MEDIUM_LIST_VIEW' : 'DELIVERY_MEDIUM_MAP_VIEW'
  }
  const { data: payload } = yield call<any>(axios.get, apiMappings.deliveryMedium.listView.structure, {
    params
  });
  yield put({ type: '@@daListView/FETCH_STRUCTURE_SUCCESS', payload });
}

export function* watchFetchDAStrucutreRequest() {
  yield takeLatest<tDAListViewActions>('@@daListView/FETCH_STRUCTURE', fetchDAListViewStructure);
}

function* fetchData(action: IFetchDataAction) {

  const isLoading = action?.payload?.isLoading
  if (isLoading) {
    yield put<tDAListViewActions>({ type: '@@daListView/SET_LOADING', payload: { listView: true } });
    yield put<tDAListViewActions>({ type: '@@daListView/SET_COUNT_LOADER', payload: true });
  }

  const advFilterLoader = yield select(state => state.advanceFilter.advFilterLoader);
  if (!!advFilterLoader) {
    try {
      const params = {
        pageNumber: action.payload?.pageNumber,
        pageSize: action.payload?.pageSize,
        searchBy: action.payload?.searchBy,
        searchText: action.payload?.searchText,
        sortBy: action.payload?.sortBy,
        sortOrder: action.payload?.sortOrder,
        dataFetchMode: 'DATA'
      }
      const filterListPayload = yield select(state => state.advanceFilter.filterListPayload);
      const data = filterListPayload || undefined
      const isDispatchedIncluded = action.payload?.searchText?.includes('DISPATCHED')

      // when you put a intransit filter status that time dont send ignoreSelectAll other wise keep it for ignore in all selections
      yield put<tDAListViewActions>({ type: '@@daListView/IS_INTRANSIT', payload: !!isDispatchedIncluded });
      const {
        data: { data: payload },
      } = yield call(axios.post, apiMappings.deliveryMedium.listView.data, data, {
        params
      });
      const clientProperties = yield select(state => state.clientProperties);
      payload.clientProperties = clientProperties;
      /********* CHECK WHETHER PAYLOAD AND PARAMS ARE BOTH EMPTY THEN NO DATA *************/
      let isParamsEmpty = (Object.keys(params).length > 1) && !params['searchBy'] && !params['searchText'] && !params['sortBy'] && !params['sortOrder']
      if (isParamsEmpty && payload?.results?.length < 1 && !filterListPayload) {
        yield put<AdvancedFilterComponentActions>({ type: '@@advanceFilter/SET_EMPTY_DATA', payload: true });
      } else {
        yield put<tDAListViewActions>({ type: '@@daListView/FETCH_DATA_SUCCESS', payload });
        yield put<AdvancedFilterComponentActions>({ type: '@@advanceFilter/SET_EMPTY_DATA', payload: false });

      }

      yield put<tDAListViewActions>({ type: '@@daListView/SET_LOADING', payload: { listView: false } });


      params.dataFetchMode = 'COUNT';
      const {
        data: totalCountPayload
      } = yield call(axios.post, apiMappings.deliveryMedium.listView.data, data, {
        params
      });
      yield put<tDAListViewActions>({ type: '@@daListView/FETCH_COUNT_SUCCESS', payload: totalCountPayload });
      yield put<tDAListViewActions>({ type: '@@daListView/SET_COUNT_LOADER', payload: false });
    } catch (error) {
      console.log('Failed to fetch data for DA List View: ', error);
      yield put<tDAListViewActions>({ type: '@@daListView/SET_LOADING', payload: { listView: false } });
    }
  }
}



function* fetchInitialData() {
  try {
    const googleApiKey = getGoogleAPIKey()
    yield put<tDAListViewActions>({ type: '@@daListView/GOOGLE_API_KEY', payload: googleApiKey });

    const { data, status } = yield call<any>(axios.get, apiMappings.common.clientMetric);
    if (status === 200) {
      yield put({ type: '@@daListView/SET_CLIENT_METRIC_SYSTEM', payload: data.data });
    }

    const { data: branchList } = yield call<any>(axios.get, apiMappings.deliveryMedium.listView.getDistributionCenterBranch, {
      url: apiMappings.deliveryMedium.listView.getDistributionCenterBranch,
      data: {},
      params: {},
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: false,
    });
    yield put<tDAListViewActions>({ type: '@@daListView/UPDATE_BRANCH_LIST', payload: { branchList } });

    const { data: statusUpdateReasons}  = yield call<any>(axios.get, apiMappings.common.lookup.getStatusUpdateReasons);
    yield put<tDAListViewActions>({ type: '@@daListView/GET_STATUS_UPDATE_REASONS', payload: statusUpdateReasons });

    const { data: operationsData } = yield call<any>(axios.get, apiMappings.deliveryMedium.listView.operations)
    yield put<tDAListViewActions>({ type: '@@daListView/GET_OPERATIONS_DATA', payload: { operationsData } });

    const { data: weeks } = yield call<any>(axios.get, apiMappings.deliveryMedium.listView.weeklyOff);
    yield put<tDAListViewActions>({ type: '@@daListView/UPDATE_WEEKLY_OFF', payload: weeks });

    const { data: daStatus } = yield call<any>(axios.get, apiMappings.deliveryMedium.listView.getStatus);
    yield put<tDAListViewActions>({ type: '@@daListView/GET_DELIVERY_STATUS', payload: daStatus });

    const { data: type } = yield call<any>(axios.get, apiMappings.deliveryMedium.listView.delMedType);
    yield put<tDAListViewActions>({ type: '@@daListView/GET_DELIVERY_TYPE', payload: type });

    const { data: vehicleList } = yield call<any>(axios.get, apiMappings.deliveryMedium.listView.unassignedVehicles);
    yield put<tDAListViewActions>({ type: '@@daListView/UPDATE_VEHICLE_LIST', payload: vehicleList.data });

    yield put<tDAListViewActions>({ type: '@@daListView/SET_INITIAL_FETCH_DONE', payload: true });


  } catch (error) {
    console.log('Failed to fetch data for DA List View: ', error);
    yield put<tDAListViewActions>({ type: '@@daListView/SET_LOADING', payload: { listView: false } });
  }

}
export function* watchInitialDataLoad() {
  yield takeLatest<tDAListViewActions>('@@daListView/INITIAL_DATA_LOAD', fetchInitialData);
}

export function* watchFetchDADataRequest() {
  yield takeLatest<IFetchDataAction>('@@daListView/FETCH_DATA', fetchData);
}


export function* fetchDAListFiLterData() {
  const { data: payload } = yield call<any>(axios.get, apiMappings.deliveryMedium.listView.filterData);
  yield put({ type: '@@daListView/GET_FILTER_DATA', payload });
}

function* fetchCompartmentListViewStructure() {
  try  {
      const { data: payload } = yield call(axios.get, apiMappings.compartmentConfiguration.listPopup.structure);
      yield put({ type: '@@daListView/FETCH_COMPARTMENT_LIST_STRUCTURE_SUCCESS', payload })

  } catch (error) {
      console.log(error);
  }
}
export function* watchFetchCompartmentListViewStructure() {
  yield takeLatest<tDAListViewActions>('@@daListView/FETCH_COMPARTMENT_LIST_STRUCTURE', fetchCompartmentListViewStructure);
}
export function* watchDeliveryAssociateList() {
  yield all([
    watchFetchDAStrucutreRequest(),
    watchFetchDADataRequest(),
    watchInitialDataLoad(),
    watchFetchCompartmentListViewStructure()
  ])
}

