import { IMongoFormStructure } from './../../../utils/mongo/interfaces';
import { IFleetTypeActions } from './FleetTypeForm.actions';
import {
    takeLatest, call, put, fork,
    select
  } from 'redux-saga/effects';
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import { prepareFormStructure } from '../../../utils/components/Form/utils';
import { AppState } from '../../../utils/redux/rootReducer';
import { getBaseCurrency } from '../../../utils/core';
import { IFleetTypeDynamicLabel,IClientMetricData, ICompartmentStucture} from './FleetTypeForm.models'


function* fetchStructure() {

  yield put<IFleetTypeActions>({ type: '@@fleetTypeForm/SET_LOADING', payload: true })



  const clientMetric:IClientMetricData = yield select(state => state.fleet.form.clientMetric);

   if(clientMetric && Object.keys(clientMetric)?.length < 1) {
     try {
       const { data, status} = yield call<any>(axios.get, apiMappings.common.clientMetric);
       if(status === 200) {
         yield put({ type: '@@fleetTypeForm/SET_CLIENT_METRIC_SYSTEM', payload: data.data});        
       }
     } catch(error)  {
       console.log('cannot load client metric properties')
     }
   }

  const dynamicLabels:IFleetTypeDynamicLabel = yield select((state: AppState) => state.dynamicLabels)

  const { data: payload } = yield call(axios.get, apiMappings.fleet.form.structure)
  const transformedPayload: IMongoFormStructure = prepareFormStructure(payload)

  if (transformedPayload['cost details']?.fixedCost) {
    transformedPayload['cost details'].fixedCost.label += ` (${dynamicLabels[`cur_symbol_${getBaseCurrency()}`]})`
  }
  if (transformedPayload['cost details']?.variableCost) {
    transformedPayload['cost details'].variableCost.label += ` (${dynamicLabels[`cur_symbol_${getBaseCurrency()}`]})`
  }
  if (transformedPayload['cost details']?.transportTimeCost.label) {
    transformedPayload['cost details'].transportTimeCost.label += ` (${dynamicLabels[`cur_symbol_${getBaseCurrency()}`]})`
  }
  if (transformedPayload['cost details']?.waitingTimeCost) {
    transformedPayload['cost details'].waitingTimeCost.label += ` (${dynamicLabels[`cur_symbol_${getBaseCurrency()}`]})`
  }
  let compartmentStructureArray: ICompartmentStucture[] = [];
  let obj = {}
  obj['compartmentId'] = null;
  obj['compartmentName'] = transformedPayload['fleetType details']?.['compartmentName']
  obj['noOfUnits'] = transformedPayload['fleetType details']?.['noOfUnits']
  compartmentStructureArray.push(obj)
  yield put<IFleetTypeActions>({ type: '@@fleetTypeForm/SET_STRUCTURE', payload: transformedPayload })
  yield put<IFleetTypeActions>({ type: '@@fleetTypeForm/SET_LOADING', payload: false })
  yield put<IFleetTypeActions>({ type: '@@fleetTypeForm/SET_COMPARTMENT_STRUCTURE', payload: compartmentStructureArray })
}

function* fetchCompartmentMasterLookup() {
  const compartmentMasterList:any = yield select(state => state.fleet.form.compartmentMasterList);

   if(compartmentMasterList && Object.keys(compartmentMasterList)?.length < 1) {
     try {
       const { data, status} = yield call<any>(axios.get, apiMappings.common.lookup.getCompartmentList);
       if(status === 200) {
         yield put({ type: '@@fleetTypeForm/SET_COMPARTMENT_MASTER_DATA', payload: data?.data});        
       }
     } catch(error)  {
       console.log('cannot load compartment list properties')
     }
   }
}

function* watchFetchCompartmentMasterLookup() {
  yield takeLatest<IFleetTypeActions>('@@fleetTypeForm/FETCH_COMPARTMENT_MASTER_DATA', fetchCompartmentMasterLookup)
}
export function* watchFetchStructureRequest() {
    yield takeLatest<IFleetTypeActions>('@@fleetTypeForm/FETCH_STRUCTURE', fetchStructure)
}

export function* fleetTypeFormSaga() {
    yield fork(watchFetchStructureRequest)
    yield fork(watchFetchCompartmentMasterLookup)
}