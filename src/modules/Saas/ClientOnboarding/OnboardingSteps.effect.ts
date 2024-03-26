import { IOnboardingClientActions } from "./OnboardingSteps.model";
import { takeLatest, call, put, fork, all} from 'redux-saga/effects';
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';

function* fetchStructure() {
   
    yield put<IOnboardingClientActions>({ type: '@@onboardingClient/SET_LOADING', payload: true })
    yield put<IOnboardingClientActions>({ type: '@@onboardingClient/SET_STRUCTURE_ERROR', payload: false })
    try{
        const { data : payload } = yield call(axios.get, apiMappings.saas.clientOnboarding.mainStructure+localStorage.getItem('guid'))
        const transformedPayload: any = payload
        if(!payload.data){
            yield put<IOnboardingClientActions>({ type: '@@onboardingClient/SET_STRUCTURE_ERROR', payload: true })
            yield put<IOnboardingClientActions>({ type: '@@onboardingClient/SET_LOADING', payload: false })
        }else{
            yield put<IOnboardingClientActions>({ type: '@@onboardingClient/SET_STRUCTURE', payload: transformedPayload.data })
            yield put<IOnboardingClientActions>({ type: '@@onboardingClient/SET_LOADING', payload: false })
            yield put<IOnboardingClientActions>({ type: '@@onboardingClient/SET_STRUCTURE_ERROR', payload: false })
        }
    }catch(e){
        yield put<IOnboardingClientActions>({ type: '@@onboardingClient/SET_STRUCTURE_ERROR', payload: true })
        yield put<IOnboardingClientActions>({ type: '@@onboardingClient/SET_LOADING', payload: false })
    }
    
}

function* fetchDraftData() {
   
    yield put<IOnboardingClientActions>({ type: '@@onboardingClient/SET_LOADING', payload: true })
    yield put<IOnboardingClientActions>({ type: '@@onboardingClient/SET_STRUCTURE_ERROR', payload: false })
    try{
        const { data : payload } = yield call(axios.get, apiMappings.saas.clientOnboarding.draftData+localStorage.getItem('guid'));
        const transformedPayload: any = payload
        yield put<IOnboardingClientActions>({ type: '@@onboardingClient/SET_DATA', payload: transformedPayload ? transformedPayload?.configurationSteps : [] })
        let currentStep = transformedPayload ? transformedPayload.configurationSteps.length - 1 : 0
        yield put<IOnboardingClientActions>({ type: '@@onboardingClient/SET_STEP', payload: currentStep })
        yield put<IOnboardingClientActions>({ type: '@@onboardingClient/SET_LOADING', payload: false })
        yield put<IOnboardingClientActions>({ type: '@@onboardingClient/SET_STRUCTURE_ERROR', payload: false })
    }catch(e){
        yield put<IOnboardingClientActions>({ type: '@@onboardingClient/SET_STRUCTURE_ERROR', payload: true })
        yield put<IOnboardingClientActions>({ type: '@@onboardingClient/SET_LOADING', payload: false })
    }
}

function* launchClient() {
    let payloadGuid = {
        guid : localStorage.getItem('guid')
    }
    yield put<IOnboardingClientActions>({ type: '@@onboardingClient/SET_STRUCTURE_ERROR', payload: false })
    try{
        yield put<IOnboardingClientActions>({ type: '@@onboardingClient/SET_LAUNCH_LOADING', payload: true })
        const payload = yield call(axios.post, apiMappings.saas.clientOnboarding.launch, payloadGuid);
        yield put<IOnboardingClientActions>({ type: '@@onboardingClient/SET_LAUNCH_DATA', payload: payload ? payload : [] })
        yield put<IOnboardingClientActions>({ type: '@@onboardingClient/SET_STRUCTURE_ERROR', payload: false })
    }catch(e){
        yield put<IOnboardingClientActions>({ type: '@@onboardingClient/SET_LAUNCH_LOADING', payload: false })
        yield put<IOnboardingClientActions>({ type: '@@onboardingClient/SET_STRUCTURE_ERROR', payload: true })
    }
    //yield put<IOnboardingClientActions>({ type: '@@onboardingClient/SET_LAUNCH_LOADING', payload: false })
}

export function* watchFetchStructureRequest() {
    yield takeLatest<IOnboardingClientActions>('@@onboardingClient/FETCH_STRUCTURE', fetchStructure)
}

export function* watchFetchDraftDataRequest() {
    yield takeLatest<IOnboardingClientActions>('@@onboardingClient/FETCH_DATA', fetchDraftData)
}

export function* watchFetchIndustryList() {
    yield takeLatest<IOnboardingClientActions>('@@onboardingClient/FETCH_INDUSTRY_LIST', fetchIndustryList)
}

export function* watchFetchDefaultIndustry() {
    yield takeLatest<IOnboardingClientActions>('@@onboardingClient/FETCH_DEFAULT_INDUSTRY', fetchDefaultIndustry)
}

function* fetchIndustryList() {
    const { data: payload } = yield call(axios.get, apiMappings.common.lookup.getIndustryTypes, { data: {}, headers: {'Content-Type': 'application/json'}})
    yield put<IOnboardingClientActions>({ type: '@@onboardingClient/SET_INDUSTRY_LIST', payload: payload.data })
}

function* fetchDefaultIndustry() {
    const { data: payload } = yield call(axios.get, apiMappings.saas.clientOnboarding.defaultIndustry+localStorage.getItem('guid'), { data: {}, headers: {'Content-Type': 'application/json'}})
    yield put<IOnboardingClientActions>({ type: '@@onboardingClient/SET_INDUSTRY_DEFAULT_TYPE', payload: payload.data })
}

export function* watchLaunchAction() {
    yield takeLatest<IOnboardingClientActions>('@@onboardingClient/LAUNCH_ONBOARDING', launchClient)
}

export function* onboardingClientSaga() {
    yield all([fork(watchFetchStructureRequest),
     fork(watchFetchDraftDataRequest),
     fork(watchLaunchAction),
     fork(watchFetchIndustryList),
     fork(watchFetchDefaultIndustry)
    ])
}
