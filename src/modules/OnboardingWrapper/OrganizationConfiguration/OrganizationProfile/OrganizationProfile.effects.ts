import { AppState } from '../../../../utils/redux/rootReducer';
import { IMongoFormStructure } from '../../../../utils/mongo/interfaces';
import { IOrganizationProfileFormActions } from './OrganizationProfile.model';
import { takeLatest, call, put, all, select } from 'redux-saga/effects';
import apiMappings from '../../../../utils/apiMapping';
import axios from '../../../../utils/axios';
import { prepareFormStructure } from '../../../../utils/components/Form/utils';


function* fetchStructure(config) {
    const structureType = config?.payload?.config || null;
    yield put<IOrganizationProfileFormActions>({ type: '@@organizationProfileForm/SET_LOADING', payload: true })
    const { data: payload } = yield call<any>(axios.get, structureType && structureType?.stepName === "ORG_PROFILE" ?  apiMappings.saas.clientOnboarding.structure : apiMappings.settingScreen.organizationProfileForm.structure )
    yield select((state: AppState) => state.dynamicLabels)
  
    const transformedPayload: IMongoFormStructure = prepareFormStructure(payload)
    yield put<IOrganizationProfileFormActions>({ type: '@@organizationProfileForm/SET_STRUCTURE', payload: transformedPayload })
    yield put<IOrganizationProfileFormActions>({ type: '@@organizationProfileForm/SET_LOADING', payload: false })
  }
  
  export function* watchFetchStructureRequest() {
    yield takeLatest<IOrganizationProfileFormActions>('@@organizationProfileForm/FETCH_STRUCTURE', fetchStructure)
  }
  
  function* fetchLocale() {
    const { data: payload } = yield call(axios.get, apiMappings.common.lookup.getLocale, { data: {}, headers: {'Content-Type': 'application/json'}})
    yield put<IOrganizationProfileFormActions>({ type: '@@organizationProfileForm/SET_LOCALE', payload: payload })
}

export function* watchFetchLocaleRequest() {
    yield takeLatest<IOrganizationProfileFormActions>('@@organizationProfileForm/FETCH_LOCALE', fetchLocale)
}

  export function* organizationProfileFormSaga() {
    yield all ([
      watchFetchStructureRequest(),
      watchFetchLocaleRequest()
    ])
  }