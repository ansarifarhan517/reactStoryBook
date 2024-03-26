import { AppState } from '../../../../../utils/redux/rootReducer';
import { IMongoFormStructure } from '../../../../../utils/mongo/interfaces';
import { IHubSetupFormActions } from './HubSetup.model';
import { takeLatest, call, put, all, select } from 'redux-saga/effects';
import apiMappings from '../../../../../utils/apiMapping';
import axios from '../../../../../utils/axios';
import { prepareFormStructure } from '../../../../../utils/components/Form/utils';

function* fetchStructure() {
    yield put<IHubSetupFormActions>({ type: '@@hubSetupForm/SET_LOADING', payload: true })
    const { data: payload } = yield call<any>(axios.get, apiMappings.saas.clientOnboarding.hubStructure )
  
    yield select((state: AppState) => state.dynamicLabels)
  
    const transformedPayload: IMongoFormStructure = prepareFormStructure(payload)
  
    yield put<IHubSetupFormActions>({ type: '@@hubSetupForm/SET_STRUCTURE', payload: transformedPayload })
    yield put<IHubSetupFormActions>({ type: '@@hubSetupForm/SET_LOADING', payload: false })
  }
  
  export function* watchFetchStructureRequest() {
    yield takeLatest<IHubSetupFormActions>('@@hubSetupForm/FETCH_STRUCTURE', fetchStructure)
  }
  
  function* fetchLocale() {
    const { data: payload } = yield call(axios.get, apiMappings.common.lookup.getLocale, { data: {}, headers: {'Content-Type': 'application/json'}})
    yield put<IHubSetupFormActions>({ type: '@@hubSetupForm/SET_LOCALE', payload: payload })
}

export function* watchFetchLocaleRequest() {
    yield takeLatest<IHubSetupFormActions>('@@hubSetupForm/FETCH_LOCALE', fetchLocale)
}

  export function* hubSetupFormSaga() {
    yield all ([
      watchFetchStructureRequest(),
      watchFetchLocaleRequest()
    ])
  }