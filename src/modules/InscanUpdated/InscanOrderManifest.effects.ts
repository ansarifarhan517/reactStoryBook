import { AxiosResponse } from 'axios';
import { all, call, put, takeLatest } from "redux-saga/effects";
import apiMappings from '../../utils/apiMapping';
import axios from '../../utils/axios';
import { IMongoListViewStructure, IMongoFormStructure } from '../../utils/mongo/interfaces';
import { IFetchManifestDataById, InscanOrderManifestActions } from './InscanOrderManifest.actions';
import { IManifestOfManifestsListviewDataPayload, IScannedOrderListviewDataPayload } from './InscanOrderManifest.models';

function* fetchAddManifestFormStructure() {
    try {
      const { data: payload  }:AxiosResponse<IMongoFormStructure> = yield call(axios.get, apiMappings.inscanUpdate.form.structure);
      yield put<InscanOrderManifestActions>({ type: '@@inscanOrderManifest/FETCH_ADD_MANIFEST_FORM_STRUCTURE_SUCCESS', payload: payload })
  
    } catch(error) {
      console.log(error);
    }
  }
  
  export function* watchFetchAddManifestFormStructure() {
    yield takeLatest<InscanOrderManifestActions>('@@inscanOrderManifest/FETCH_ADD_MANIFEST_FORM_STRUCTURE', fetchAddManifestFormStructure)
  }
  
  function* fetchOrderInscanListviewStructure() {
    try {
      yield put<InscanOrderManifestActions>({ type: '@@inscanOrderManifest/SET_ORDER_INSCAN_LISTVIEW_LOADING', payload: true });
      const { data: payload  }:AxiosResponse<IMongoListViewStructure> = yield call(axios.get, apiMappings.inscanUpdate.listview.orders.structure);
      yield put<InscanOrderManifestActions>({ type: '@@inscanOrderManifest/FETCH_ORDER_INSCAN_LISTVIEW_STRUCTURE_SUCCESS', payload: payload })
      yield put<InscanOrderManifestActions>({ type: '@@inscanOrderManifest/SET_ORDER_INSCAN_LISTVIEW_LOADING', payload: false });
    } catch(error) {
      yield put<InscanOrderManifestActions>({ type: '@@inscanOrderManifest/SET_ORDER_INSCAN_LISTVIEW_LOADING', payload: true });
      console.log(error);
    }
  }
  
  export function* watchFetchOrderInscanListviewStructure() {
    yield takeLatest<InscanOrderManifestActions>('@@inscanOrderManifest/FETCH_ORDER_INSCAN_LISTVIEW_STRUCTURE', fetchOrderInscanListviewStructure)
  }
  
  function* fetchScannedOrderList() {
    try {
      yield put<InscanOrderManifestActions>({ type: '@@inscanOrderManifest/SET_ORDER_INSCAN_LISTVIEW_LOADING', payload: true });
      const { data: payload  }:AxiosResponse<IScannedOrderListviewDataPayload> = yield call(axios.get, apiMappings.inscanUpdate.listview.orders.data);
      yield put<InscanOrderManifestActions>({ type: '@@inscanOrderManifest/FETCH_SCANNED_ORDER_LIST_SUCCESS', payload: payload })
      yield put<InscanOrderManifestActions>({ type: '@@inscanOrderManifest/SET_ORDER_INSCAN_LISTVIEW_LOADING', payload: false });
    } catch(error) {
      yield put<InscanOrderManifestActions>({ type: '@@inscanOrderManifest/SET_ORDER_INSCAN_LISTVIEW_LOADING', payload: true });
      console.log(error);
    }
  }
  
  export function* watchfetchScannedOrderListRequest() {
    yield takeLatest<InscanOrderManifestActions>('@@inscanOrderManifest/FETCH_SCANNED_ORDER_LIST', fetchScannedOrderList)
  }
  
  function* fetchManifestOfManifestListviewStructure() {
    try {
      yield put<InscanOrderManifestActions>({ type: '@@inscanOrderManifest/SET_MANIFEST_OF_MANIFEST_LISTVIEW_LOADING', payload: true });
      const { data: payload  }:AxiosResponse<IMongoListViewStructure> = yield call(axios.get, apiMappings.inscanUpdate.listview.manifestOfManifests.structure);
      yield put<InscanOrderManifestActions>({ type: '@@inscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LISTVIEW_STRUCTURE_SUCCESS', payload: payload })
      yield put<InscanOrderManifestActions>({ type: '@@inscanOrderManifest/SET_MANIFEST_OF_MANIFEST_LISTVIEW_LOADING', payload: false });
    } catch(error) {
      yield put<InscanOrderManifestActions>({ type: '@@inscanOrderManifest/SET_MANIFEST_OF_MANIFEST_LISTVIEW_LOADING', payload: true });
      console.log(error);
    }
  }
  
  export function* watchFetchManifestOfManifestListviewStructure() {
    yield takeLatest<InscanOrderManifestActions>('@@inscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LISTVIEW_STRUCTURE', fetchManifestOfManifestListviewStructure)
  }
  
  function* fetchManifestOfManifestsList() {
    try {
      yield put<InscanOrderManifestActions>({ type: '@@inscanOrderManifest/SET_ORDER_INSCAN_LISTVIEW_LOADING', payload: true });
      const { data: payload  }:AxiosResponse<IManifestOfManifestsListviewDataPayload> = yield call(axios.get, apiMappings.inscanUpdate.listview.manifestOfManifests.data);
      yield put<InscanOrderManifestActions>({ type: '@@inscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LIST_SUCCESS', payload: payload })
      yield put<InscanOrderManifestActions>({ type: '@@inscanOrderManifest/SET_ORDER_INSCAN_LISTVIEW_LOADING', payload: false });
    } catch(error) {
      yield put<InscanOrderManifestActions>({ type: '@@inscanOrderManifest/SET_ORDER_INSCAN_LISTVIEW_LOADING', payload: true });
      console.log(error);
    }
  }
  
  export function* watchFetchManifestOfManifestsListRequest() {
    yield takeLatest<InscanOrderManifestActions>('@@inscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LIST', fetchManifestOfManifestsList)
  }

  function* fetchManifestDataById(action:IFetchManifestDataById) {
    try {
      yield put<InscanOrderManifestActions>({ type: '@@inscanOrderManifest/SET_FORM_LOADING', payload: true });
      const { data: { data: payload } } = yield call(axios.get, `${apiMappings.inscanUpdate.form.getData}?manifestId=${action.payload}`);
      yield put<InscanOrderManifestActions>({ type: '@@inscanOrderManifest/FETCH_MANIFEST_DATA_BY_ID_SUCCESS', payload: payload })
      yield put<InscanOrderManifestActions>({ type: '@@inscanOrderManifest/SET_FORM_LOADING', payload: false });
    } catch(error) {
      yield put<InscanOrderManifestActions>({ type: '@@inscanOrderManifest/SET_FORM_LOADING', payload: true });
      console.log(error);
    }
  }
  
  export function* watchFetchManifestDataByIdRequest() {
    yield takeLatest<IFetchManifestDataById>('@@inscanOrderManifest/FETCH_MANIFEST_DATA_BY_ID', fetchManifestDataById)
  }

  function* fetchExceptionListviewStructure() {
    try {
      yield put<InscanOrderManifestActions>({ type: '@@inscanOrderManifest/SET_EXCEPTION_LISTVIEW_LOADING', payload: true });
      const { data: payload  }:AxiosResponse<IMongoListViewStructure> = yield call(axios.get, apiMappings.inscanUpdate.listview.exceptions.structure);
      yield put<InscanOrderManifestActions>({ type: '@@inscanOrderManifest/FETCH_EXCEPTION_LISTVIEW_STRUCTURE_SUCCESS', payload: payload })
      yield put<InscanOrderManifestActions>({ type: '@@inscanOrderManifest/SET_EXCEPTION_LISTVIEW_LOADING', payload: false });
    } catch(error) {
      yield put<InscanOrderManifestActions>({ type: '@@inscanOrderManifest/SET_EXCEPTION_LISTVIEW_LOADING', payload: true });
      console.log(error);
    }
  }

  export function* watchFetchExceptionListviewStructure() {
    yield takeLatest<InscanOrderManifestActions>('@@inscanOrderManifest/FETCH_EXCEPTION_LISTVIEW_STRUCTURE', fetchExceptionListviewStructure)
  }

  export function* watchInscanOrderManifestRequest() {
    yield all([
      watchFetchAddManifestFormStructure(),
      watchFetchOrderInscanListviewStructure(),
      watchfetchScannedOrderListRequest(),
      watchFetchManifestOfManifestListviewStructure(),
      watchFetchManifestOfManifestsListRequest(),
      watchFetchManifestDataByIdRequest(),
      watchFetchExceptionListviewStructure()
      // watchFetchOrdersDataByIDRequest()
    ])
  }