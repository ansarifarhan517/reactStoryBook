import { put, takeLatest, call, fork } from 'redux-saga/effects'
import axios from '../../../../utils/axios'
import apiMappings from '../../../../utils/apiMapping';
import { ManifestConfigurationActions } from './ManifestConfiguration.actions'




function* fetchManifestTypes() {
    const { data: {data: payload} } = yield call<any>(axios.get, apiMappings.manifestConfiguration.getManifestTypes);
    yield put<ManifestConfigurationActions>({ type: '@@manifestonfiguration/SET__MANIFEST_TYPE', payload })
}

export function* watchFetchManifestType() {
  yield takeLatest<ManifestConfigurationActions>('@@manifestonfiguration/FETCH__MANIFEST_TYPE', fetchManifestTypes);
}


function* fetchGenerateManifest() {
    const { data: {data: payload} } = yield call<any>(axios.get, apiMappings.manifestConfiguration.getManifestFormula);
    yield put<ManifestConfigurationActions>({ type: '@@manifestonfiguration/SET__GENERATE_MANIFEST', payload })
}

export function* watchFetchGenerateManifest() {
  yield takeLatest<ManifestConfigurationActions>('@@manifestonfiguration/FETCH__GENERATE_MANIFEST', fetchGenerateManifest);
}

export function* watchManifestConfigurationRequest() {
  yield fork(watchFetchGenerateManifest);
  yield fork(watchFetchManifestType);
}
