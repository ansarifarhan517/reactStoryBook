import { all, call, put, takeLatest } from "redux-saga/effects";
import apiMappings from "../../../../utils/apiMapping";
import axios from "../../../../utils/axios";
import { IListViewRequestPayload } from "../../../../utils/common.interface";
import { CompartmentConfigurationActions, IFetchAllCompartmentListAction, IFetchCompartmentDataAction } from "./CompartmentConfiguration.actions";
import { IEffectAction } from "./CompartmentConfiguration.models";

function* fetchAllCompartmentListviewStructure() {
    const { data: payload } = yield call(axios.get, apiMappings.compartmentConfiguration.listView.structure)
    yield put<CompartmentConfigurationActions>({ type: '@@compartmentConfiguration/FETCH_ALL_COMPARTMENT_LISTVIEW_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchCompartmentListviewStructureRequest() {
    yield takeLatest<CompartmentConfigurationActions>('@@compartmentConfiguration/FETCH_ALL_COMPARTMENT_LISTVIEW_STRUCTURE', fetchAllCompartmentListviewStructure);
}
function* fetchAllCompartmentList(action: IFetchAllCompartmentListAction) {
    const  { data: { data: payload } } = yield call(axios.post, apiMappings.compartmentConfiguration.listView.getAllCompartments, null, { params: action.payload })
    let filter: IListViewRequestPayload = { ...action.payload }
    let isParamsEmpty = (Object.keys(filter).length > 1) && !filter['searchBy'] && !filter['searchText'] && !filter['sortBy'] && !filter['sortOrder']
    if(isParamsEmpty && payload?.results?.length < 1){
        yield put<CompartmentConfigurationActions>({ type: '@@compartmentConfiguration/SET_EMPTY_DATA', payload: true})
    }
    else {
        yield put<CompartmentConfigurationActions>({ type: '@@compartmentConfiguration/SET_EMPTY_DATA', payload: false });
    }
    yield put<CompartmentConfigurationActions>({ type: '@@compartmentConfiguration/FETCH_ALL_COMPARTMENT_LIST_SUCCESS', payload: payload})
}

export function* watchFetchAllCompartmentListRequest() {
    yield takeLatest<IFetchAllCompartmentListAction>('@@compartmentConfiguration/FETCH_ALL_COMPARTMENT_LIST', fetchAllCompartmentList);
}

function* fetchCompartmentFormStructure() {
    const { data: payload } = yield call(axios.get, apiMappings.compartmentConfiguration.form.structure)
    yield put<CompartmentConfigurationActions>({ type: '@@compartmentConfiguration/FETCH_FORM_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchCompartmentFormStructureRequest() {
    yield takeLatest<CompartmentConfigurationActions>('@@compartmentConfiguration/FETCH_FORM_STRUCTURE', fetchCompartmentFormStructure);
}

function* fetchClientMetricSystem() {
    const { data, status} = yield call<any>(axios.get, apiMappings.common.clientMetric);
    if(status === 200) {
        yield put<CompartmentConfigurationActions>({ type: '@@compartmentConfiguration/SET_CLIENT_METRIC_SYSTEM', payload: data.data})
    }
}

export function* watchFetchClientMetricSystemRequest() {
    yield takeLatest<IFetchAllCompartmentListAction>('@@compartmentConfiguration/FETCH_CLIENT_METRIC_SYSTEM', fetchClientMetricSystem);
}

function* fetchCompartmentById(action:IEffectAction) {
    const { data: { data: payload } } = yield call(axios.get, `${apiMappings.compartmentConfiguration.form.getCompartmentById}?compartmentId=${action.payload}`)
    yield put<CompartmentConfigurationActions>({ type: '@@compartmentConfiguration/FETCH_COMPARTMENT_BY_ID_SUCCESS', payload })
}

export function* watchFetchCompartmentByIdRequest() {
    yield takeLatest<CompartmentConfigurationActions>('@@compartmentConfiguration/FETCH_COMPARTMENT_BY_ID', fetchCompartmentById);
}
function* fetchCrates() {
    try {
      const { data: crates } = yield call(axios.get, apiMappings.common.lookup.crateNameMasterList);
      yield put<CompartmentConfigurationActions>({ type: '@@compartmentConfiguration/SET_CRATES_DATA', payload: crates?.data });
  
    } catch (error) {
      console.log('Failed to fetch crates data', error)
    }
  
}
export function* watchFetchCratesRequest() {
    yield takeLatest<CompartmentConfigurationActions>('@@compartmentConfiguration/FETCH_CRATES', fetchCrates);
}

function* fetchCompartmentData(action: IFetchCompartmentDataAction) {
    try  {
      const { data: { data: payload } } = yield call(axios.post, apiMappings.compartmentConfiguration.listPopup.getCompartmentListData,
       {}, { params: action.payload }
      )
        yield put({ type: '@@compartmentConfiguration/FETCH_COMPARTMENT_DATA_SUCCESS', payload })
  
    } catch (error) {
        console.log(error);
    }
}
export function* watchFetchCompartmentDataRequest() {
yield takeLatest<IFetchCompartmentDataAction>('@@compartmentConfiguration/FETCH_COMPARTMENT_DATA', fetchCompartmentData);
}
export function* watchCompartmentConfigurationRequest() {
    yield all([
        watchFetchCompartmentListviewStructureRequest(),
        watchFetchAllCompartmentListRequest(),
        watchFetchCompartmentFormStructureRequest(),
        watchFetchClientMetricSystemRequest(),
        watchFetchCompartmentByIdRequest(),
        watchFetchCratesRequest(),
        watchFetchCompartmentDataRequest()
    ])
}