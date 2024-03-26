import { call, put, select,takeEvery, takeLatest } from "redux-saga/effects"
import apiMappings from "../../../utils/apiMapping"
import axios from "../../../utils/axios"
import { getQueryParams } from "../../../utils/hybridRouting";

import { TicketingToolListViewActions } from "./TicketingToolListView.actions"

function* fetchStructure() {
  // const ticketStatus = yield select((state) => state.ticketingTool.selectedStatus); 
  let existingParams = getQueryParams();
  let clientData = yield select((state) => state.ticketingTool.clientData);
  let viewMode = yield select((state) => state.ticketingTool.viewMode);
    if(!clientData){
      let username = JSON.parse(localStorage.getItem('userAccessInfo') || "")['userName'] || "";
      const { data } = yield call<any>(axios.get, '/ThirdPartyPlugins/ticketing/user/authenticate?userName=' + username)
      yield put({ type: "@@ticketingToolListView/SET_CLIENT_DATA", payload: data.data })
    }
    clientData = yield select((state) => state.ticketingTool.clientData);
    const {data:peers} = yield call<any>(axios.get, apiMappings.ticktingTool.listview.getPeers+'?userId='+clientData.userId);
    yield put({ type: "@@ticketingToolListView/SET_PEERS", payload:peers.data })
    const structureApi = apiMappings.ticktingTool.listview.structure;
    const pageName = viewMode == "FEATURE" ? "FEATURE" : existingParams.page?existingParams.page:'ALL';

    const params = {modelName:'TICKETING_TOOL',
                    pageName:'TICKETING_TOOL',
                    sectionName:`${pageName}_TICKETING_TOOL_LIST_VIEW`
    }
    const { data: payload } = yield call<any>(axios.get, structureApi,{params});
    yield put({ type: "@@ticketingToolListView/FETCH_STRUCTURE_SUCCESS", payload })
    // yield put({ type: "@@ticketingToolListView/SET_LOADING", payload:{column: false,listView :true} })
    // "@@ticketingToolListView/SET_LOADING"

  }
  
  export function* watchFetchStrucutureRequest() {
    yield takeLatest<TicketingToolListViewActions>(
      "@@ticketingToolListView/FETCH_STRUCTURE",
      fetchStructure
    )
  }

  function* fetchTicketData(action:any) {
    yield put({ type: "@@ticketingToolListView/SET_LOADING", payload:{column: false,listView :true} })
    const selectedStatus = yield select((state) => state.ticketingTool.selectedStatus);
    const ticketStatus = yield select((state) => state.ticketingTool.ticketStatus);
    let searchBy =null;
    let searchText = null;
    
    if(selectedStatus !== "ALL" && Object.keys(ticketStatus).length){
      searchBy = 'status';
      searchText = ticketStatus[selectedStatus].value;
    }
    let params = {
      pageNumber: action.payload?.pageNumber,
      pageSize: action.payload?.pageSize,
      searchBy: action.payload?.searchBy || searchBy ,
      searchText: action.payload?.searchText || searchText,
      sortBy: action.payload?.sortBy,
      sortOrder: action.payload?.sortOrder
    }
    const viewMode = yield select((state) => state.ticketingTool.viewMode);
    let clientData = yield select((state) => state.ticketingTool.clientData);
    const peers = yield select ((state)=>state.ticketingTool.peers);
    const peerAuthorIds =  peers.map((value:any)=>{
      return value.id;
    })
    let projectData = {
      "projectId": clientData.project.id,
      "authorId": clientData.userId,
      "tracker": viewMode,
      "peerAuthorIds": peerAuthorIds,
      "statusIds": action.payload.searchBy == 'status' ? action.payload?.searchText : null,
      sowProjectId: viewMode == "FEATURE" ?clientData.sowProject.id : null
    }
    const { data: payload } = yield call<any>(axios.post, apiMappings.ticktingTool.listview.getData,projectData,{params})
    
    yield put({ type: "@@ticketingToolListView/FETCH_DATA_SUCCESS", payload})
    yield put({ type: "@@ticketingToolListView/SET_LOADING", payload:{column: false,listView :false} })
  }
  
  export function* watchFetchTicketData() {
    
    yield takeEvery<TicketingToolListViewActions>(
      "@@ticketingToolListView/FETCH_DATA",
      fetchTicketData
    )
  }