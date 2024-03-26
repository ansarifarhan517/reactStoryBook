// import { IMongoFormStructure } from './../../../../utils/mongo/interfaces';
import { IShipperPreferenceFormActions } from './ShipperPreference.model'
import { takeLatest, call, put, fork, all } from 'redux-saga/effects';
import apiMappings from '../../../../utils/apiMapping';
import axios from '../../../../utils/axios';
// import { prepareFormStructure } from '../../../../utils/components/Form/utils';

function* fetchStructure() {
  yield put<IShipperPreferenceFormActions>({ type: '@@shipperPreferenceForm/SET_LOADING', payload: true })
  const { data: payload } = yield call(axios.get, apiMappings.shipper.preference.structure)
  // const transformedPayload: IMongoFormStructure = prepareFormStructure(payload)
  yield put<IShipperPreferenceFormActions>({ type: '@@shipperPreferenceForm/SET_STRUCTURE', payload: payload })
  yield put<IShipperPreferenceFormActions>({ type: '@@shipperPreferenceForm/SET_LOADING', payload: false })
}

export function* watchFetchStructureRequest() {
  yield takeLatest<IShipperPreferenceFormActions>('@@shipperPreferenceForm/FETCH_STRUCTURE', fetchStructure)
}

export function* watchFetchShipperPreferenceForm() {
  yield fork(watchFetchStructureRequest)
}


export function* watchFetchShipperPreferenceFormRequests() {
  yield all([
    watchFetchShipperPreferenceForm(),
  ])
}
