import { IMongoFormStructure } from '../../../../utils/mongo/interfaces';
import { IShipperAlertProfileFormActions } from './ShipperAlertProfile.model'
import { takeLatest, call, put, fork, all } from 'redux-saga/effects';
import apiMappings from '../../../../utils/apiMapping';
import axios from '../../../../utils/axios';
import { prepareFormStructure } from '../../../../utils/components/Form/utils';

function* fetchStructure() {
  yield put<IShipperAlertProfileFormActions>({ type: '@@shipperAlertProfileForm/SET_LOADING', payload: true })
  const { data: payload } = yield call(axios.get, apiMappings.shipper.alertProfile.structure)
  const transformedPayload: IMongoFormStructure = prepareFormStructure(payload)
  yield put<IShipperAlertProfileFormActions>({ type: '@@shipperAlertProfileForm/SET_STRUCTURE', payload: transformedPayload })
  yield put<IShipperAlertProfileFormActions>({ type: '@@shipperAlertProfileForm/SET_LOADING', payload: false })
}

function* fetchProfiles() {
  yield put<IShipperAlertProfileFormActions>({ type: '@@shipperAlertProfileForm/SET_LOADING', payload: true })
  const { data: payload } = yield call(axios.get, apiMappings.shipper.alertProfile.getProfileList)
  yield put<IShipperAlertProfileFormActions>({ type: '@@shipperAlertProfileForm/SET_SHIPPER_DATA', payload: payload })
  yield put<IShipperAlertProfileFormActions>({ type: '@@shipperAlertProfileForm/SET_LOADING', payload: false })
}

export function* watchFetchStructureRequest() {
  yield takeLatest<IShipperAlertProfileFormActions>('@@shipperAlertProfileForm/FETCH_STRUCTURE', fetchStructure)
}
export function* watchFetchAlertProfiles() {
  yield takeLatest<IShipperAlertProfileFormActions>('@@shipperAlertProfileForm/FETCH_ALERT_PROFILES', fetchProfiles)
}

export function* watchShipperAlertProfileFormRequests() {
  yield fork(watchFetchStructureRequest)
}

export function* watchFetchShipperAlertProfileFormRequests() {
  yield all([
    watchShipperAlertProfileFormRequests(),
    watchFetchAlertProfiles()
  ])
}
