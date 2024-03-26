import { call, put, select, takeEvery, takeLatest } from "redux-saga/effects"
import apiMappings from "../../utils/apiMapping"
import axios from "../../utils/axios"
import { AdminDashboardActions } from "./AdminDashboard.actions"

// Fetch Tab Data

function* fetchTabData(action: any) {
  let params = {
    region: action.payload?.region
  }
  const { data: payload } = yield call<any>(axios.get, apiMappings.adminDashboard.tabData, {params})
  yield put({ type: "@@adminDashboard/FETCH_TABDATA_SUCCESS", payload })
}

export function* watchFetchTabData() {

  yield takeLatest<AdminDashboardActions>(
    "@@adminDashboard/FETCH_TABDATA",
    fetchTabData
  )
}


// Fetch Regions List
function* fetchRegionsList() {
  const { data: payload } = yield call<any>(axios.get, apiMappings.adminDashboard.regionsList)
  yield* fetchRegionsCount(payload)
  yield put({ type: "@@adminDashboard/FETCH_REGIONS_LIST_SUCCESS", payload });
 
}

export function* watchFetchRegionsList() {
  yield takeLatest<AdminDashboardActions>(
    "@@adminDashboard/FETCH_REGIONS_LIST",
    fetchRegionsList
  )
}


// Fetch Regions Count
function* fetchRegionsCount(action : any) {
  for(let element of action) {
    const region=element?.region;
    const { data: payload, status } = yield call<any>(axios.get, apiMappings.adminDashboard.regionsCount + "?region=" + region)
    if(status === 200) {
      yield put({ type: "@@adminDashboard/FETCH_REGIONS_COUNT_SUCCESS", payload })
    } else{
      console.log("Backend error")
    }
  }
} 


// Fetch Client Details Structure

function* fetchClientDetailsStructure() {
  const structureApi = apiMappings.adminDashboard.clientDetails.structure
  const { data: payload } = yield call<any>(axios.get, structureApi)
  yield put({ type: "@@adminDashboard/CLIENT_DETAILS/FETCH_STRUCTURE_SUCCESS", payload })
}

export function* watchFetchClientDetailsStrucutreRequest() {
  yield takeLatest<AdminDashboardActions>(
    "@@adminDashboard/FETCH_STRUCTURE",
    fetchClientDetailsStructure
  )
}

// Fetch Client Details Data
export function* fetchClientDetailData(action:any) {
  
  let api = apiMappings.adminDashboard.clientDetails.data;
  //moduleKey=&pageNumber=null&pageSize=null&searchBy=null&searchText=null&sortBy=null&sortOrder=null&clientIds=
  let params = {
    status: 'ALL',
    pageNumber: action.payload?.pageNumber,
    pageSize: action.payload?.pageSize,
    searchBy: action.payload?.searchBy,
    searchText: action.payload?.searchText,
    sortBy: action.payload?.sortBy,
    sortOrder: action.payload?.sortOrder,
    region: action.payload?.region
  }
  // let queryString = Object.keys(action.payload).map(key => key + '=' + (action.payload[key]||null) ).join('&');
  // api = `${api}&${queryString}`;
  let clientIds = []
  if(action.payload?.clientIds?.length){
    clientIds = action.payload?.clientIds;
  } else{
    clientIds = yield select(state => state.adminDashboard.adminDashboard.clientIds);
  }
  
  const { data: payload } = yield call<any>(axios.post, api,clientIds,{params});
  yield put({ type: "@@adminDashboard/CLIENT_DETAILS/FETCH_DATA_SUCCESS", payload, params })
  yield put({ type: "@@adminDashboard/CLIENT_DETAILS/IS_LOADING", payload: false })
}

export function* watchFetchClientDetailsDataRequest() {
  yield takeEvery<AdminDashboardActions>(
    "@@adminDashboard/CLIENT_DETAILS/FETCH_DATA",
    fetchClientDetailData
  )
}

// Fetch Client Details Accounts Structure
function* fetchClientDetailsAccountsStructure() {
  const structureApi = '/LoginApp/framework/structure?modelName=USER&pageName=USER&sectionName=USER_LIST_VIEW'
  const { data: payload } = yield call<any>(axios.get, structureApi)
  yield put({ type: "@@adminDashboard/CLIENT_DETAILS/ACCOUNTS/FETCH_STRUCTURE_SUCCESS", payload })
}

export function* watchFetchClientDetailsAccountsStrucutreRequest() {
  yield takeLatest<AdminDashboardActions>(
    "@@adminDashboard/CLIENT_DETAILS/ACCOUNTS/FETCH_STRUCTURE",
    fetchClientDetailsAccountsStructure
  )
}

// Fetch Client Details Accounts Data
function* fetchClientDetailsAccountsData(action: any) {
  let params = {
    customClientId:action.payload.id,
    pageNumber: action.payload?.pageNumber,
    pageSize: action.payload?.pageSize,
    searchBy: action.payload?.searchBy,
    searchText: action.payload?.searchText,
    sortBy: action.payload?.sortBy,
    sortOrder: action.payload?.sortOrder
  }
  // const structureApi = apiMappings.adminDashboard.clientDetails.structure
  const { data: payload } = yield call<any>(axios.get, `/UserAccessApp/user/list`,{params})
  yield put({ type: "@@adminDashboard/CLIENT_DETAILS/ACCOUNTS/FETCH_DATA_SUCCESS", payload })
}

export function* watchFetchClientDetailsAccountsDataRequest() {
  yield takeEvery<AdminDashboardActions>(
    "@@adminDashboard/CLIENT_DETAILS/ACCOUNTS/FETCH_DATA",
    fetchClientDetailsAccountsData
  )
}


// Fetch Client Activity Structure

function* fetchClientActivityStructure(action: any) {
  const structureApi = apiMappings.adminDashboard.clintActivity.structure
  const { data: payload } = yield call<any>(axios.get, structureApi)
  yield put({ type: "@@adminDashboard/CLIENT_ACTIVITY/FETCH_STRUCTURE_SUCCESS", payload })
}

export function* watchFetchClientActivityStrucutreRequest() {
  yield takeLatest<AdminDashboardActions>(
    "@@adminDashboard/CLIENT_ACTIVITY/FETCH_STRUCTURE",
    fetchClientActivityStructure
  )
}
// Fetch Client Activity Data
export function* fetchClientActivityData(action:any) {
  let api = apiMappings.adminDashboard.clintActivity.data;
  //let queryString = Object.keys(action.payload).map(key => key + '=' + action.payload[key]).join('&');
  //api = `${api}&${queryString}`;
  let payloadReq = {
    fromDate: "2021-06-08T18:30:00",
    toDate:"2021-06-16T18:29:59",
    moduleKey: "",
  }
  let params = {
   
    pageNumber: action.payload?.pageNumber,
    pageSize: action.payload?.pageSize,
    searchBy: action.payload?.searchBy,
    searchText: action.payload?.searchText?.trim(" "),
    sortBy: action.payload?.sortBy,
    sortOrder: action.payload?.sortOrder,
    region: action.payload?.region
  }
  const { data: payload } = yield call<any>(axios.post, api,payloadReq,{params});
  yield put({ type: "@@adminDashboard/CLIENT_ACTIVITY/FETCH_DATA_SUCCESS", payload,params })
  yield put({ type: "@@adminDashboard/CLIENT_ACTIVITY/IS_LOADING", payload: false })
}

export function* watchFetchClientActivityDataRequest() {
  yield takeEvery<AdminDashboardActions>(
    "@@adminDashboard/CLIENT_ACTIVITY/FETCH_DATA",
    fetchClientActivityData
  )
}

// Fetch Pods Data

export function* fetchClientDetailsPodsData(action: any) {
  let api = apiMappings.adminDashboard.clientDetails.cardSummaryDetails;
  const clientIds = yield select(state => state.adminDashboard.adminDashboard.tabData.clientIds);
  let params = {
    region: action.payload?.region
  }

  const { data: payload } = yield call<any>(axios.post, api,{cardModes:["ALL"],clientIds}, {params});
  yield put({ type: "@@adminDashboard/CLIENT_DETAILS/FETCH_POD_DATA_SUCCESS", payload })
}

export function* watchFetchClientDetailsPodsRequest() {
  yield takeEvery<AdminDashboardActions>(
    "@@adminDashboard/CLIENT_DETAILS/FETCH_POD_DATA",
    fetchClientDetailsPodsData
  )
}


// Fetch Client Details Structure

function* fetchPendingActivationStructure() {
  const structureApi = apiMappings.adminDashboard.pendingAction.structure
  const { data: payload } = yield call<any>(axios.get, structureApi)

  yield put({ type: "@@adminDashboard/PENDING_ACTIVATION/FETCH_STRUCTURE_SUCCESS", payload })
}

export function* watchFetchPendingActivationRequest() {
  yield takeLatest<AdminDashboardActions>(
    "@@adminDashboard/PENDING_ACTIVATION/FETCH_STRUCTURE",
    fetchPendingActivationStructure
  )
}

// Fetch Client Details Data
export function* fetchPendingActivationData(action:any) {
  
  let api = apiMappings.adminDashboard.pendingAction.data;

    // let queryString = Object.keys(action.payload).filter((key)=> {
    //   return action.payload[key]
    // }).map((key)=>{
    //   return `${key}=${action.payload[key]}`
    // }).join('&');
    // debugger;
    // api = `${api}?${queryString}`;
  //moduleKey=&pageNumber=null&pageSize=null&searchBy=null&searchText=null&sortBy=null&sortOrder=null&clientIds=
  let params = {
    pageNumber: action.payload?.pageNumber,
    pageSize: action.payload?.pageSize,
    searchBy: action.payload?.searchBy,
    searchText: action.payload?.searchText,
    sortBy: action.payload?.sortBy,
    sortOrder: action.payload?.sortOrder
  }
  const { data: payload } = yield call<any>(axios.get, api,{params});
  yield put({ type: "@@adminDashboard/PENDING_ACTIVATION/FETCH_DATA_SUCCESS", payload })
  yield put({ type: "@@adminDashboard/PENDING_ACTIVATION/IS_LOADING", payload: false })
}

export function* watchFetchPendingActivationDataRequest() {
  yield takeEvery<AdminDashboardActions>(
    "@@adminDashboard/PENDING_ACTIVATION/FETCH_DATA",
    fetchPendingActivationData
  )
}

function* fetchOffboardOptionsData() {
  const { data: payload } = yield call<any>(axios.get, `/ClientApp/client/getByTypeAndId?type=OFFBOARD_OPTIONS`)
  yield put({ type: "@@adminDashboard/CLIENT_DETAILS/OFFBOARD/FETCH_OPTIONS_SUCCESS", payload: payload })
}

export function* watchFetchOffboardOptionsDataRequest() {
  yield takeLatest<AdminDashboardActions>(
    "@@adminDashboard/CLIENT_DETAILS/OFFBOARD/FETCH_OPTIONS",
    fetchOffboardOptionsData
  )
}