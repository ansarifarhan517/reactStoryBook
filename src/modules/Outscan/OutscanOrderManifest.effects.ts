import { AxiosResponse } from 'axios';
import { all, call, put, takeLatest } from "redux-saga/effects";
import apiMappings from '../../utils/apiMapping';
import axios from '../../utils/axios';
import { IMongoListViewStructure, IMongoFormStructure } from '../../utils/mongo/interfaces';
import store from '../../utils/redux/store';
import { IFetchManifestDataById, OutscanOrderManifestActions } from './OutscanOrderManifest.actions';
import { IManifestData, IManifestOfManifestsListviewDataPayload, IScannedOrderListviewDataPayload } from './OutscanOrderManifest.models';

function* fetchAddManifestFormStructure() {
    try {
      const { data: payload  }:AxiosResponse<IMongoFormStructure> = yield call(axios.get, apiMappings.outscan.form.structure);
      yield put<OutscanOrderManifestActions>({ type: '@@outscanOrderManifest/FETCH_ADD_MANIFEST_FORM_STRUCTURE_SUCCESS', payload: payload })
      const isFormEditable = store.getState().outscan.form.isEditable;
      if(!isFormEditable) {
        yield put<OutscanOrderManifestActions>({ type: '@@outscanOrderManifest/SET_FORM_LOADING', payload: false })
      }
  
    } catch(error) {
      console.log(error, error?.response);
    }
  }
  
  export function* watchFetchAddManifestFormStructure() {
    yield takeLatest<OutscanOrderManifestActions>('@@outscanOrderManifest/FETCH_ADD_MANIFEST_FORM_STRUCTURE', fetchAddManifestFormStructure)
  }
  
  function* fetchOrderOutscanListviewStructure() {
    try {
      yield put<OutscanOrderManifestActions>({ type: '@@outscanOrderManifest/SET_ORDER_OUTSCAN_LISTVIEW_LOADING', payload: true });
      const { data: payload  }:AxiosResponse<IMongoListViewStructure> = yield call(axios.get, apiMappings.outscan.listview.orders.structure);
      yield put<OutscanOrderManifestActions>({ type: '@@outscanOrderManifest/FETCH_ORDER_OUTSCAN_LISTVIEW_STRUCTURE_SUCCESS', payload: payload })
      yield put<OutscanOrderManifestActions>({ type: '@@outscanOrderManifest/SET_ORDER_OUTSCAN_LISTVIEW_LOADING', payload: false });
    } catch(error) {
      yield put<OutscanOrderManifestActions>({ type: '@@outscanOrderManifest/SET_ORDER_OUTSCAN_LISTVIEW_LOADING', payload: true });
      console.log(error, error?.response);
    }
  }
  
  export function* watchFetchOrderOutscanListviewStructure() {
    yield takeLatest<OutscanOrderManifestActions>('@@outscanOrderManifest/FETCH_ORDER_OUTSCAN_LISTVIEW_STRUCTURE', fetchOrderOutscanListviewStructure)
  }
  
  function* fetchScannedOrderList() {
    try {
      yield put<OutscanOrderManifestActions>({ type: '@@outscanOrderManifest/SET_ORDER_OUTSCAN_LISTVIEW_LOADING', payload: true });
      const { data: payload  }:AxiosResponse<IScannedOrderListviewDataPayload> = yield call(axios.get, apiMappings.outscan.listview.orders.data);
      yield put<OutscanOrderManifestActions>({ type: '@@outscanOrderManifest/FETCH_SCANNED_ORDER_LIST_SUCCESS', payload: payload })
      yield put<OutscanOrderManifestActions>({ type: '@@outscanOrderManifest/SET_ORDER_OUTSCAN_LISTVIEW_LOADING', payload: false });
    } catch(error) {
      yield put<OutscanOrderManifestActions>({ type: '@@outscanOrderManifest/SET_ORDER_OUTSCAN_LISTVIEW_LOADING', payload: true });
      console.log(error, error?.response);
    }
  }
  
  export function* watchfetchScannedOrderListRequest() {
    yield takeLatest<OutscanOrderManifestActions>('@@outscanOrderManifest/FETCH_SCANNED_ORDER_LIST', fetchScannedOrderList)
  }
  
  function* fetchManifestOfManifestListviewStructure() {
    try {
      yield put<OutscanOrderManifestActions>({ type: '@@outscanOrderManifest/SET_MANIFEST_OF_MANIFEST_LISTVIEW_LOADING', payload: true });
      const { data: payload  }:AxiosResponse<IMongoListViewStructure> = yield call(axios.get, apiMappings.outscan.listview.manifestOfManifests.structure);
      yield put<OutscanOrderManifestActions>({ type: '@@outscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LISTVIEW_STRUCTURE_SUCCESS', payload: payload })
      yield put<OutscanOrderManifestActions>({ type: '@@outscanOrderManifest/SET_MANIFEST_OF_MANIFEST_LISTVIEW_LOADING', payload: false });
    } catch(error) {
      yield put<OutscanOrderManifestActions>({ type: '@@outscanOrderManifest/SET_MANIFEST_OF_MANIFEST_LISTVIEW_LOADING', payload: true });
      console.log(error, error?.response);
    }
  }
  
  export function* watchFetchManifestOfManifestListviewStructure() {
    yield takeLatest<OutscanOrderManifestActions>('@@outscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LISTVIEW_STRUCTURE', fetchManifestOfManifestListviewStructure)
  }
  
  function* fetchManifestOfManifestsList() {
    try {
      yield put<OutscanOrderManifestActions>({ type: '@@outscanOrderManifest/SET_ORDER_OUTSCAN_LISTVIEW_LOADING', payload: true });
      const { data: payload  }:AxiosResponse<IManifestOfManifestsListviewDataPayload> = yield call(axios.get, apiMappings.outscan.listview.manifestOfManifests.data);
      yield put<OutscanOrderManifestActions>({ type: '@@outscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LIST_SUCCESS', payload: payload })
      yield put<OutscanOrderManifestActions>({ type: '@@outscanOrderManifest/SET_ORDER_OUTSCAN_LISTVIEW_LOADING', payload: false });
    } catch(error) {
      yield put<OutscanOrderManifestActions>({ type: '@@outscanOrderManifest/SET_ORDER_OUTSCAN_LISTVIEW_LOADING', payload: true });
      console.log(error, error?.response);
    }
  }
  
  export function* watchFetchManifestOfManifestsListRequest() {
    yield takeLatest<OutscanOrderManifestActions>('@@outscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LIST', fetchManifestOfManifestsList)
  }

  function* fetchManifestDataById(action:IFetchManifestDataById) {
    try {
      yield put<OutscanOrderManifestActions>({ type: '@@outscanOrderManifest/SET_FORM_LOADING', payload: true });
      const { data: { data: payload } } = yield call(axios.get, `${apiMappings.outscan.form.getData}?manifestId=${action.payload}`);
      yield put<OutscanOrderManifestActions>({ type: '@@outscanOrderManifest/FETCH_MANIFEST_DATA_BY_ID_SUCCESS', payload: payload })
      yield put<OutscanOrderManifestActions>({ type: '@@outscanOrderManifest/SET_FORM_LOADING', payload: false });
    } catch(error) {
      yield put<OutscanOrderManifestActions>({ type: '@@outscanOrderManifest/SET_FORM_LOADING', payload: true });
      console.log(error, error?.response);
    }
  }
  
  export function* watchFetchManifestDataByIdRequest() {
    yield takeLatest<IFetchManifestDataById>('@@outscanOrderManifest/FETCH_MANIFEST_DATA_BY_ID', fetchManifestDataById)
  }

  function* fetchExceptionListviewStructure() {
    try {
      yield put<OutscanOrderManifestActions>({ type: '@@outscanOrderManifest/SET_EXCEPTION_LISTVIEW_LOADING', payload: true });
      const { data: payload  }:AxiosResponse<IMongoListViewStructure> = yield call(axios.get, apiMappings.outscan.listview.exceptions.structure);
      yield put<OutscanOrderManifestActions>({ type: '@@outscanOrderManifest/FETCH_EXCEPTION_LISTVIEW_STRUCTURE_SUCCESS', payload: payload })
      yield put<OutscanOrderManifestActions>({ type: '@@outscanOrderManifest/SET_EXCEPTION_LISTVIEW_LOADING', payload: false });
    } catch(error) {
      yield put<OutscanOrderManifestActions>({ type: '@@outscanOrderManifest/SET_EXCEPTION_LISTVIEW_LOADING', payload: true });
      console.log(error, error?.response);
    }
  }
  
  export function* watchFetchExceptionListviewStructure() {
    yield takeLatest<OutscanOrderManifestActions>('@@outscanOrderManifest/FETCH_EXCEPTION_LISTVIEW_STRUCTURE', fetchExceptionListviewStructure)
  }

  function* fetchClientMetrics() {
    const { data, status} = yield call(axios.get, apiMappings.common.clientMetric);
    if(status === 200) {
      yield put({ type: '@@outscanOrderManifest/SET_CLIENT_METRIC_SYSTEM', payload: data.data});        
    }
}
export function* watchFetchClientMetrics() {
    yield takeLatest<OutscanOrderManifestActions>('@@outscanOrderManifest/GET_CLIENT_METRIC_SYSTEM', fetchClientMetrics)
}

  export function* watchOutscanOrderManifestRequest() {
    yield all([
      watchFetchAddManifestFormStructure(),
      watchFetchOrderOutscanListviewStructure(),
      watchfetchScannedOrderListRequest(),
      watchFetchManifestOfManifestListviewStructure(),
      watchFetchManifestOfManifestsListRequest(),
      watchFetchManifestDataByIdRequest(),
      watchFetchExceptionListviewStructure(),
      watchFetchClientMetrics()
    ])
  }