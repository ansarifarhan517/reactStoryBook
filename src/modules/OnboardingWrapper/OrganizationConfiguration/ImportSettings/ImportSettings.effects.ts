import { put, takeLatest, call, fork } from 'redux-saga/effects';
import axios from '../../../../utils/axios';
import apiMappings from '../../../../utils/apiMapping';
import { ImportSettingsActions } from './ImportSettings.actions'

function* fetchImportSettingsStructure() {
  const { data: payload } = yield call<any>(axios.get, apiMappings.importSettings.structure);
  yield put<ImportSettingsActions>({ type: '@@importSettings/FETCH_STRUCTURE_SUCCESS', payload });
}

export function* watchFetchStructureRequest() {
  yield takeLatest<ImportSettingsActions>('@@importSettings/FETCH_STRUCTURE', fetchImportSettingsStructure);
}


function* fetchImportFromLookUpData(){
  try{
    const { data } = yield call<any>(axios.get, apiMappings.importSettings.dropdowns.IMPORT_FROM);
    const payload = data.data;
    yield put<ImportSettingsActions>({type: '@@importSettings/FETCH_IMPORT_FROM_DATA_SUCCESS', payload})
  }catch(err) {
    console.log("fetchImportFromLookUpData: ", err);
  }
}

export function* watchFetchImportFromLookUpData() {
  yield takeLatest<ImportSettingsActions>('@@importSettings/FETCH_IMPORT_FROM_DATA', fetchImportFromLookUpData);
}


function* fetchImportToLookUpData(){
  try{
    const { data } = yield call<any>(axios.get, apiMappings.importSettings.dropdowns.IMPORT_TO);
    const payload = data.data;
    yield put<ImportSettingsActions>({type: '@@importSettings/FETCH_IMPORT_TO_DATA_SUCCESS', payload})

    // Todo: Remove For Super Client UseCase
    yield put<ImportSettingsActions>({type: '@@importSettings/SET_CLIENT', payload: {key: "importTo", value: payload[0]?.id}})
  } catch (err) {
    console.log("fetchImportToLookUpData: ", err);
  }
}

export function* watchFetchImportToLookUpData() {
  yield takeLatest<ImportSettingsActions>('@@importSettings/FETCH_IMPORT_TO_DATA', fetchImportToLookUpData);
}

export function* watchImportSettingsRequest() {
  yield fork(watchFetchStructureRequest);
  yield fork(watchFetchImportFromLookUpData);
  yield fork(watchFetchImportToLookUpData);
}