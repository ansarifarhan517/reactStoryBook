import { IMongoFormStructure } from './../../../utils/mongo/interfaces';
import {  IRateProfileFormActions } from './RateProfileForm.actions';
import {
  takeLatest, call, put, fork, select,
  // select
} from 'redux-saga/effects';
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import { prepareFormStructure } from '../../../utils/components/Form/utils';
// import { getBaseCurrency } from '../../../utils/core';
// import { AppState } from '../../../utils/redux/rootReducer';
// import { ISystemClientMetric} from './RateProfileForm.model';

function* fetchStructure() {
  yield put<IRateProfileFormActions>({ type: '@@rateProfileForm/SET_LOADING', payload: true })

  const userAccessInfo: string = localStorage.getItem('userAccessInfo') !== null && JSON.parse(localStorage.getItem('userAccessInfo') || '')
  let clientId: number = userAccessInfo['clientId']
  let access_token = userAccessInfo['accessToken']?.split('BASIC ')?.[1].trim();
  let CLIENT_SECRET_KEY = userAccessInfo['CLIENT_SECRET_KEY']


  // GET SYSTEM METRIC
  const systemMetric = yield select(state => state.rateProfile.form.systemMetric);
  if (systemMetric && Object.keys(systemMetric)?.length < 1) {
    try {
      const { data, status } = yield call(axios.get, apiMappings.settings.organizationProfile.getDetails,{
        params: {
          clientId: clientId,
          CLIENT_SECRET_KEY: CLIENT_SECRET_KEY,
          access_token: access_token,
        }
      });

     
      if (status === 200) {
        const filteredData = data?.clientpropertyDTO?.filter((obj:any) => {
          if(obj.propertyKey === 'DISTANCE' || obj.propertyKey === 'WEIGHT' || obj.propertyKey === 'VOLUME' ) {
            return obj
          }
        })
        yield put({ type: '@@rateProfileForm/SET_SYSTEM_METRIC_SYSTEM', payload:  filteredData});
      }
    } catch (error) { 
      console.log('cannot load client metric properties')
    }
  }


  //  GET CLIENT METRIC
   const clientMetric = yield select(state => state.rateProfile.form.clientMetric);
   if(clientMetric && Object.keys(clientMetric)?.length < 1) {
     try {
       const { data, status} = yield call<any>(axios.get, apiMappings.common.clientMetric);
       if(status === 200) {
         yield put({ type: '@@rateProfileForm/SET_CLIENT_METRIC_SYSTEM', payload: data.data});        
       }
     } catch(error)  {
       console.log('cannot load client metric properties')
     }
   }
   const skillSet = yield select(state => state.rateProfile.form.skillSet);
   if(Object.keys(skillSet)?.length <= 0) {
    const { data} = yield call(axios.get, apiMappings.common.lookup.getSkillType)
    yield put<IRateProfileFormActions>({ type: '@@rateProfileForm/SET_SKILLSET', payload: data })
   }
   

    // fetch all options


  const distance = yield select(state => state.rateProfile.form.distance);
  if (!distance || distance && Object.keys(distance)?.length < 1) {
    try {
      const { data, status } = yield call(axios.get, apiMappings.common.lookup.rateTypeLookupDistance);
      if (status === 200) {
        yield put({ type: '@@rateProfileForm/SET_DISTANCE_OPTIONS', payload:  data});
      }
    } catch (error) { 
      console.log('cannot load client metric properties')
    }
  }
  const weight = yield select(state => state.rateProfile.form.weight);
  if (!weight || weight && Object.keys(weight)?.length < 1) {
    try {
      const { data, status } = yield call(axios.get, apiMappings.common.lookup.rateTypeLookupWeight);
      if (status === 200) {
        yield put({ type: '@@rateProfileForm/SET_WEIGHT_OPTIONS', payload:  data});
      }
    } catch (error) { 
      console.log('cannot load client metric properties')
    }
  }
  
  const volume = yield select(state => state.rateProfile.form.volume);
  if (!volume || volume && Object.keys(weight)?.length < 1) {
    try {
      const { data, status } = yield call(axios.get, apiMappings.common.lookup.rateTypeLookupVolume);
      if (status === 200) {
        yield put({ type: '@@rateProfileForm/SET_VOLUME_OPTIONS', payload:  data});
      }
    } catch (error) { 
      console.log('cannot load client metric properties')
    }
  }

  const piece = yield select(state => state.rateProfile.form.piece);
  if (!piece || piece && Object.keys(piece)?.length < 1) {
    try {
      const { data, status } = yield call(axios.get, apiMappings.common.lookup.rateTypeLookupPiece);
      if (status === 200) {
        yield put({ type: '@@rateProfileForm/SET_PIECE_OPTIONS', payload:  data});
      }
    } catch (error) { 
      console.log('cannot load client metric properties')
    }
  }

  const rateNormal = yield select(state => state.rateProfile.form.rateNormal);
  if (!rateNormal || rateNormal && Object.keys(rateNormal)?.length < 1) {
    try {
      const { data, status } = yield call(axios.get, apiMappings.common.lookup.getFeesType);
      if (status === 200) {
        yield put({ type: '@@rateProfileForm/SET_RATENORMAL_OPTIONS', payload:  data});
      }
    } catch (error) { 
      console.log('cannot load client metric properties')
    }
  }
  

  const { data: payload } = yield call(axios.get, apiMappings.rateProfile.form.structure)
  const transformedPayload: IMongoFormStructure = prepareFormStructure(payload)
  yield put<IRateProfileFormActions>({ type: '@@rateProfileForm/SET_STRUCTURE', payload: transformedPayload })

  const {data: basicStructure} = yield call(axios.get, apiMappings.rateProfile.form.basicRateProfileComponentStructures)
  yield put<IRateProfileFormActions>({ type: '@@rateProfileForm/SET_BASIC_ELEMENTS_STRUCTURE', payload: basicStructure })

  
  yield put<IRateProfileFormActions>({ type: '@@rateProfileForm/SET_LOADING', payload: false })
}




export function* watchFetchStructureRequest() {
  yield takeLatest<IRateProfileFormActions>('@@rateProfileForm/FETCH_STRUCTURE', fetchStructure)

}

export function* rateProfileFormSaga() {
  yield fork(watchFetchStructureRequest)
}