// import { AppState } from './../../../utils/redux/rootReducer';
import { IMongoFormStructure } from './../../../../utils/mongo/interfaces';
import { IShipperPropertiesFormActions } from './ShipperProperties.model'
import { takeLatest, call, put, all } from 'redux-saga/effects';
import apiMappings from '../../../../utils/apiMapping';
import axios from '../../../../utils/axios';
import { prepareFormStructure } from '../../../../utils/components/Form/utils';

function* fetchStructure() {
  yield put<IShipperPropertiesFormActions>({ type: '@@shipperPropertiesForm/SET_LOADING', payload: true })
  const { data: payload } = yield call(axios.get, apiMappings.shipper.properties.structure)
  const transformedPayload: IMongoFormStructure = prepareFormStructure(payload)
  yield put<IShipperPropertiesFormActions>({ type: '@@shipperPropertiesForm/SET_STRUCTURE', payload: transformedPayload })
  const { data: shipperType } = yield call(axios.get, apiMappings.common.getServiceType)
  yield put<IShipperPropertiesFormActions>({ type: '@@shipperPropertiesForm/SET_SERVICETYPE', payload: shipperType })
  const { data: shipperProperties } = yield call(axios.get, apiMappings.shipper.properties.priority)
  yield put<IShipperPropertiesFormActions>({ type: '@@shipperPropertiesForm/SET_PRIORITY_DATA', payload: shipperProperties?.data })
  yield put<IShipperPropertiesFormActions>({ type: '@@shipperPropertiesForm/SET_LOADING', payload: false })     

}

export function* watchFetchStructureRequest() {
  yield takeLatest<IShipperPropertiesFormActions>('@@shipperPropertiesForm/FETCH_STRUCTURE', fetchStructure)
}

function* fetchServiceType() {
  const { data: payload } = yield call(axios.get, apiMappings.common.getServiceType)
  yield put<IShipperPropertiesFormActions>({ type: '@@shipperPropertiesForm/SET_SERVICETYPE', payload: payload })
}
export function* watchFeatchServiceTypes() {
  yield takeLatest<IShipperPropertiesFormActions>('@@shipperPropertiesForm/FETCH_SERVICETYPE', fetchServiceType)
}

export function* watchFetchShipperPropertiesFormRequests() {
  yield all([
    watchFetchStructureRequest(),
    watchFeatchServiceTypes()
  ])
}

