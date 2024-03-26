
import { all, put, takeLatest, call } from "redux-saga/effects";
import apiMappings from "../../../../utils/apiMapping";
import axios from "../../../../utils/axios";
import { OauthAction } from "./Oauth.action";

function* fetchOauthStructure() {
    const { data: payload } = yield call(axios.get, apiMappings.OauthProfile.listView.structure);
  
    yield put({ type: '@@OAUTH/FETCH_STRUCTURE_SUCCESS', payload })
}

function* fetchOauthData(action){
    yield put({type :"@@OAUTH/SET_LOADING" , payload: true })
    let params = {
      ...action.payload
    }
    const { data: payload } = yield call<any>(axios.post, apiMappings.OauthProfile.listView.data,null,{params});
   
    if(!action.payload.searchBy && payload.data?.totalCount == 0){
      yield put({type :'@@OAUTH/IS_LIST_EMPTY' , payload : true})
    }
    else{
      yield put({type :'@@OAUTH/IS_LIST_EMPTY' , payload : false})
    }
   
    yield put({ type: '@@OAUTH/FETCH_DATA_SUCCESS', payload })
}

function* fetchOauthFormStructure() {
   console.log("hey")
  try {
    yield put<OauthAction>({
      type: "@@OAUTH/SET_FORM_LOADING",
      payload: true,
    });
    const  response = yield call(
      axios.get,
      apiMappings.OauthProfile.form.structure
    );
    if (response?.status === 200) {
      yield put<OauthAction>({
        type: "@@OAUTH/SET_FORM_STRUCTURE",
        payload :response?.data,
      });
      yield put<OauthAction>({
        type: "@@OAUTH/SET_FORM_LOADING",
        payload: false,
      });
      yield put<OauthAction>({
        type:"@@OAUTH/SET_FORM_STRUCTURE_FLAG",
        payload :true
      })
    }
  
  } catch (error) {
    console.log("Error Occured", error);
    yield put<OauthAction>({
      type: "@@OAUTH/SET_FORM_LOADING",
      payload: false,
    });
  }

}

function* fetchUpdateData(action){
  const { data :{data : payload} } = yield call(axios.get, apiMappings.OauthProfile.form.get + '?referenceId=' + action.payload.referenceId );
  console.log(payload,'data')
  yield put<OauthAction>({
    type:"@@OAUTH/SET_UPDATE_DATA",
    payload
  })
}

export function* watchOauthStructure() {
    yield takeLatest<OauthAction>('@@OAUTH/FETCH_STRUCTURE', fetchOauthStructure);
}

export function* watchOauthData(){
    yield takeLatest<OauthAction>('@@OAUTH/FETCH_DATA', fetchOauthData);
}
export function* watchOauthUpdate(){
    yield takeLatest<OauthAction>('@@OAUTH/GET_UPDATE_DATA',fetchUpdateData)
}
export function* watchFetchOauthFormStructureRequest() {
    yield takeLatest<OauthAction>(
      "@@OAUTH/GET_FORM_STRUCTURE",
      fetchOauthFormStructure
    );
  }
  


export function* watchOauth() {
    yield all([
        watchOauthStructure(),
        watchOauthData(),
        watchFetchOauthFormStructureRequest(),
        watchOauthUpdate()
        
        
    ])
}