import { IMongoFormStructure } from './../../../utils/mongo/interfaces';
import {  } from './PlanningForm.model'
import { TripPlanningScheduler} from './PlanningForm.actions';
import { takeLatest, call, put, fork, all } from 'redux-saga/effects';
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import { prepareFormStructure } from '../../../utils/components/Form/utils';


function* fetchStructure() {
  const { data, status } = yield call<any>(axios.get, apiMappings.common.clientMetric);
  if (status === 200) {
    yield put({ type: '@@planningForm/SET_CLIENT_METRIC_SYSTEM', payload: data.data });
  }
  yield put<TripPlanningScheduler>({ type: '@@planningForm/SET_LOADING', payload: true })
  const { data: payload } = yield call(axios.get, apiMappings.tripPlanningScheduler.form.general)
  const transformedPayload: IMongoFormStructure = prepareFormStructure(payload)
  yield put<TripPlanningScheduler>({ type: '@@planningForm/SET_GENERAL_STRUCTURE', payload: transformedPayload })
  // fetch order details
  yield put<TripPlanningScheduler>({ type: '@@planningForm/SET_LOADING', payload: false })
  
}

function* fetchOutSourcedFleetStructure() {
  yield put<TripPlanningScheduler>({ type: '@@planningForm/SET_LOADING', payload: true })
  const { data: payload } = yield call(axios.get, apiMappings.tripPlanningScheduler.form.getOutsourcedFleetsStructure)
  const transformedPayload: IMongoFormStructure = prepareFormStructure(payload)
  yield put<TripPlanningScheduler>({ type: '@@planningForm/SET_OUTSOURCEDFLEET_STRUCTURE', payload: transformedPayload })
  // // fetch order details
  // const { data: orderStructure } = yield call(axios.get, apiMappings.tripPlanningScheduler.form.orders)
  // const transformedOrderPayload: IMongoFormStructure = prepareFormStructure(orderStructure)
  // yield put<TripPlanningScheduler>({ type: '@@planningForm/SET_ORDER_DETAILS_STRUCTURE', payload: transformedOrderPayload })
  yield put<TripPlanningScheduler>({ type: '@@planningForm/SET_LOADING', payload: false })
  
}

function* fetchOwnedFleetStructure() {
  yield put<TripPlanningScheduler>({ type: '@@planningForm/SET_LOADING', payload: true })
  const { data: payload } = yield call(axios.get, apiMappings.tripPlanningScheduler.form.getOwnedFleetsStructure)
  const transformedPayload: IMongoFormStructure = prepareFormStructure(payload)
  yield put<TripPlanningScheduler>({ type: '@@planningForm/SET_OWNED_FLEET_STRUCTURE', payload: transformedPayload })
  // fetch order details
  // const { data: orderStructure } = yield call(axios.get, apiMappings.tripPlanningScheduler.form.orders)
  // const transformedOrderPayload: IMongoFormStructure = prepareFormStructure(orderStructure)
  // yield put<TripPlanningScheduler>({ type: '@@planningForm/SET_ORDER_DETAILS_STRUCTURE', payload: transformedOrderPayload })
  yield put<TripPlanningScheduler>({ type: '@@planningForm/SET_LOADING', payload: false })
}
function* fetchTerritoryProfiles() {
  const { data: payload , status } = yield call(axios.get, apiMappings.common.lookup.getTerritoryProfileListing)
  if(status==200){
    yield put<TripPlanningScheduler>({ type: '@@planningForm/SET_TERRITORY_PROFILE_LIST', payload: payload.data })
  }

}
function* fetchPlanningProfiles() {
  const { data: payload , status } = yield call(axios.get, apiMappings.common.lookup.getPlanningProfiles)
  if(status==200){
    yield put<TripPlanningScheduler>({ type: '@@planningForm/SET_PLANNING_PROFILE_LIST', payload: payload.data })
  }

}
function* fetchBranches() {
  const { data: payload , status } = yield call(axios.get, apiMappings.common.lookup.getBranches)
  if(status==200){
    yield put<TripPlanningScheduler>({ type: '@@planningForm/SET_BRANCH_LIST', payload: payload.data })
  }
}
function* watchFetchTerritoriesList({payload}: any) {
  const { data: newpayload , status } = yield call(axios.get, apiMappings.geofenceMaster.listView.getTerritoryProfileById+'?id='+payload)
  if(status==200){
    yield put<TripPlanningScheduler>({ type: '@@planningForm/SET_TERRITORY_LIST', payload: newpayload.data })
  }
}

function* fetchOrderDetailsStruture() {
  const { data: payload , status } = yield call(axios.get, apiMappings.tripPlanningScheduler.form.getOrderListStructure)
  if(status==200){
    yield put<TripPlanningScheduler>({ type: '@@planningForm/SET_ORDER_DETAILS_LIST_STRUCTURE', payload: payload })
  }
  const { data: orderStructure } = yield call(axios.get, apiMappings.tripPlanningScheduler.form.orders)
  const transformedOrderPayload: IMongoFormStructure = prepareFormStructure(orderStructure)
  yield put<TripPlanningScheduler>({ type: '@@planningForm/SET_ORDER_DETAILS_STRUCTURE', payload: transformedOrderPayload })
}


function* fetchOutSourcedFleetData(action: any) {
  yield put<TripPlanningScheduler>({ type: '@@planningForm/SET_LOADING', payload:true});
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
   const {
      data: { data: payload },
    } = yield call(axios.get, apiMappings.tripPlanningScheduler.form.getOutsourcedFleetsData,  {
      params
    });
    // const clientProperties = yield select(state => state.clientProperties);
    // payload.clientProperties = clientProperties;

    yield put<TripPlanningScheduler>({ type: '@@planningForm/SET_OUTSOURCEDFLEET_DATA', payload });
    yield put<TripPlanningScheduler>({ type: '@@planningForm/SET_LOADING', payload:false});
  } catch (error) {
    console.log('Failed to fetch data for DA List View: ', error);
    yield put<TripPlanningScheduler>({ type: '@@planningForm/SET_LOADING', payload: false });
  }
}
function* fetchOwnedFleetData(action: any) {
  try {
    const params = {
      pageNumber: action.payload?.pageNumber,
      pageSize: action.payload?.pageSize,
      searchBy: action.payload?.searchBy,
      searchText: action.payload?.searchText,
      sortBy: action.payload?.sortBy,
      sortOrder: action.payload?.sortOrder,
      // dataFetchMode: 'DATA'
    }
   const {
      data: { data: payload },
    } = yield call(axios.get, apiMappings.tripPlanningScheduler.form.getOwnedFleetsData,  {
      params
    });
    // const clientProperties = yield select(state => state.clientProperties);
    // payload.clientProperties = clientProperties;

    yield put<TripPlanningScheduler>({ type: '@@planningForm/SET_OWNEDFLEET_DATA', payload });
    yield put<TripPlanningScheduler>({ type: '@@planningForm/SET_LOADING', payload:false});
  } catch (error) {
    console.log('Failed to fetch data for DA List View: ', error);
    yield put<TripPlanningScheduler>({ type: '@@planningForm/SET_LOADING', payload: false });
  }
}

export function* watchFetchStructureRequest() {
  yield takeLatest<TripPlanningScheduler>('@@planningForm/FETCH_STRUCTURE', fetchStructure)
}
export function* watchFetchOutsourcedFleetsStructureRequest() {
  yield takeLatest<TripPlanningScheduler>('@@planningForm/FETCH_OUTSOURCEDFLEET_STRUCTURE', fetchOutSourcedFleetStructure)
}
export function* watchFetchOutsourcedFleetsDataRequest() {
  yield takeLatest<TripPlanningScheduler>('@@planningForm/FETCH_OUTSOURCEDFLEET_DATA', fetchOutSourcedFleetData)
}
export function* watchFetchOwnedFleetsStructureRequest() {
  yield takeLatest<TripPlanningScheduler>('@@planningForm/FETCH_OWNEDFLEET_STRUCTURE', fetchOwnedFleetStructure)
}
export function* watchFetchOwnedFleetsDataRequest() {
  yield takeLatest<TripPlanningScheduler>('@@planningForm/FETCH_OWNEDFLEET_DATA', fetchOwnedFleetData)
}
export function* watchFetchTerritoryProfileListRequest() {
  yield takeLatest<TripPlanningScheduler>('@@planningForm/FETCH_TERRITORY_PROFILE_LIST', fetchTerritoryProfiles)
}
export function* watchFetchPlanningProfileListRequest() {
  yield takeLatest<TripPlanningScheduler>('@@planningForm/FETCH_PLANNING_PROFILE_LIST', fetchPlanningProfiles)
}
export function* watchFetchBranchListRequest() {
  yield takeLatest<TripPlanningScheduler>('@@planningForm/FETCH_BRANCH_LIST', fetchBranches)
}
export function* watchFetchOrderDetailsStructureRequest() {
  yield takeLatest<TripPlanningScheduler>('@@planningForm/FETCH_ORDER_DETAILS_STRUCTURE', fetchOrderDetailsStruture)
}
export function* watchFetchTerritoriesRequest() {
  yield takeLatest<TripPlanningScheduler>('@@planningForm/FETCH_TERRITORY_LIST', watchFetchTerritoriesList)
}

export function* watchFetchTripPlanningSchedulerFormStructure() {
  yield fork(watchFetchStructureRequest)
}
export function* watchFetchOutsourcedFleets() {
  yield fork(watchFetchOutsourcedFleetsStructureRequest)
}
export function* watchFetchOwnedFleets() {
  yield fork(watchFetchOwnedFleetsStructureRequest)
}

export function* watchFetchOutsourcedFleetsData() {
  yield fork(watchFetchOutsourcedFleetsDataRequest)
}
export function* watchFetchOwnedFleetsData() {
  yield fork(watchFetchOwnedFleetsDataRequest)
}
export function* watchFetchTerritoryProfileList(){
  yield fork(watchFetchTerritoryProfileListRequest)
}
export function* watchFetchPlanningProfileList(){
  yield fork(watchFetchPlanningProfileListRequest)
}
export function* watchFetchBranchList(){
  yield fork(watchFetchBranchListRequest)
}
export function* watchFetchOrderDetailsStructure(){
  yield fork(watchFetchOrderDetailsStructureRequest)
}
export function* watchFetchTerritories(){
  yield fork(watchFetchTerritoriesRequest)
}
export function* watchFetchTripPlanningSchedulerFormRequests() {
  yield all([
    watchFetchTripPlanningSchedulerFormStructure(),
    watchFetchOutsourcedFleets(),
    watchFetchOutsourcedFleetsData(),
    watchFetchOwnedFleets(),
    watchFetchOwnedFleetsData(),
    watchFetchTerritoryProfileList(),
    watchFetchPlanningProfileList(),
    watchFetchBranchList(),
    watchFetchOrderDetailsStructure(),
    watchFetchTerritories()
  ])
}