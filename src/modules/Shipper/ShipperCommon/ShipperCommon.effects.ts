
import { IShipperCommonFormActions } from './ShipperCommon.model'
import { takeLatest, call, put, fork } from 'redux-saga/effects';
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import { getQueryParams } from '../../../utils/hybridRouting'

function* fetchStructure() {
  const { token } = getQueryParams()  
  const { data: payload } = yield call(axios.get, apiMappings.shipper.form.onBoarding,  { params: { token: token}})
  yield put<IShipperCommonFormActions>({ type: '@@shipperOnboarding/SET_STRUCTURE', payload: payload })
}

export function* watchFetchStructureRequest() {
  yield takeLatest<IShipperCommonFormActions>('@@shipperOnboarding/FETCH_STRUCTURE', fetchStructure)
}

export function* watchFetchShipperOnboardingStructure() {
  yield fork(watchFetchStructureRequest)
}
