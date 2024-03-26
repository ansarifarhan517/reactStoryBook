import { all, call, put, takeLatest } from "redux-saga/effects";
import apiMappings from "../../../../utils/apiMapping";
import axios from "../../../../utils/axios";
import { PdpaConfigActions } from "./PdpaConfig.action";



function* fetchPdpaStructure() {
    const { data: payload } = yield call(axios.get, apiMappings.consent.list.structure)
    yield put<PdpaConfigActions>({ type: '@@PROTECTIONCONFIG/SET_PDPA_LISTVIEW_STRUCTURE_SUCCESS', payload })
}

function* fetchPdpaData(action:any) {  // check this or think this if anu bug occure
    
    const  { data: { data: payload } } = yield call(axios.post, apiMappings.consent.list.list,null, { params: action.payload })
    yield put<PdpaConfigActions>({ type: '@@PROTECTIONCONFIG/GET_DATA_LISTVIEW_SUCCESS', payload })
}

function* fetchFormStructure(){
    const { data: payload } = yield call<any>(axios.get, apiMappings.consent.form.structure)
    yield put<PdpaConfigActions>({ type: '@@PROTECTIONCONFIG/SET_FETCH_FORM', payload })
}

function*  fetchUpdateData(action : any){
    const  { data: { data: payload } } = yield call(axios.get, apiMappings.consent.list.update + "?id=" + action.payload)
    yield put<PdpaConfigActions>({type:"@@PROTECTIONCONFIG/STORE_UPDATE_CONSENT_FORM" , payload})
}
export function* watchFetchUpdateFormData(){
    yield takeLatest<PdpaConfigActions>('@@PROTECTIONCONFIG/FETCH_UPDATE_CONSENT_FORM' ,fetchUpdateData)
}


export function* watchFetchStructureRequest() {
    yield takeLatest<PdpaConfigActions>('@@PROTECTIONCONFIG/GET_PDPA_LISTVIEW_STRUCTURE', fetchPdpaStructure);
}

export function* watchFetchDataRequest() {
    yield takeLatest<PdpaConfigActions>('@@PROTECTIONCONFIG/GET_DATA_LISTVIEW', fetchPdpaData);
}

export function* wacthFetchFormStructure(){
    yield takeLatest<PdpaConfigActions>('@@PROTECTIONCONFIG/GET_FETCH_FORM' ,  fetchFormStructure)
}


export function* watchPdpaHandling () {
    yield all([
        watchFetchStructureRequest(),
        watchFetchDataRequest(),
        wacthFetchFormStructure(),
        watchFetchUpdateFormData()
    ])
}