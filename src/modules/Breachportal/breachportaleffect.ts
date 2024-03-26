import { call, put, takeEvery, takeLatest,all } from "redux-saga/effects"
import apiMappings from "../../utils/apiMapping";
import axios from "../../utils/axios";
import { breachPortalListViewActions } from "./breachportalListview.action"




function* fetchStructure() {
    const structureApi = apiMappings.Breachportal.listview.structure;
    const params = {
      modelName:'TICKETING_TOOL',
      pageName:'TICKETING_TOOL',
      sectionName:`BREACH_PORTAL_LIST_VIEW`
    }
    const { data: payload } = yield call<any>(axios.get, structureApi, { params });
    yield put({ type: "@@breachPortalListView/FETCH_STRUCTURE_SUCCESS", payload })   
  }
  
  export function* watchFetchbreachStrucutureRequest() {
    yield takeLatest<breachPortalListViewActions>(
      "@@breachPortalListView/FETCH_STRUCTURE",
      fetchStructure
    )
  }

function* fetchBreachData(action: any) {
  try{
    const { data: payload } = yield call<any>(axios.post, apiMappings.Breachportal.listview.getData, null , { params: action.payload.params })
    yield put({ type: "@@breachPortalListView/FETCH_DATA_SUCCESS", payload })
    let currentPageLength = payload?.results?.length;
    let currentPageSize = action.payload.params?.pageSize;

    if(currentPageLength < currentPageSize){
      yield put<breachPortalListViewActions>({type: '@@breachPortalListView/SET_DISABLE_NEXT', payload: true})
    }else{
      yield put<breachPortalListViewActions>({type: '@@breachPortalListView/SET_DISABLE_NEXT', payload: false})
    }
  } catch(err){
    console.error(err)
  }
}
  
  export function* watchFetchbreachData() {
    
    yield takeEvery<breachPortalListViewActions>(
      "@@breachPortalListView/FETCH_DATA",
      fetchBreachData
    )
  }

  export function* watchBreachPortalData() {
    yield all([
      watchFetchbreachData(),
      watchFetchbreachStrucutureRequest()
    ]);
  }
