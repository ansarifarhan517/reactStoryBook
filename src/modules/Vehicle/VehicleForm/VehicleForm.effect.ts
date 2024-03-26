import { IMongoFormStructure } from './../../../utils/mongo/interfaces';
import {  IVehicleFormActions } from './VehicleForm.actions';
import {
  takeLatest, call, put, fork,
  select
} from 'redux-saga/effects';
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import { prepareFormStructure } from '../../../utils/components/Form/utils';
import { getBaseCurrency } from '../../../utils/core';
import { AppState } from '../../../utils/redux/rootReducer';
import { ISystemClientMetric, ICompartmentStucture, IEffectAction} from './VehicleForm.model';

function* fetchStructure() {
  yield put<IVehicleFormActions>({ type: '@@vehicleForm/SET_LOADING', payload: true })

  // GET CLIENT METRIC
  const systemMetric = yield select(state => state.vehicle.form.systemMetric);
  
  if (systemMetric && Object.keys(systemMetric)?.length < 1) {
    try {
      const { data, status } = yield call(axios.get, apiMappings.common.clientSystemProperty,{
        params: {
          modelType:'FMLM',
          propertyType:'system property'
        }
      });
      const distance = data?.find((c: ISystemClientMetric) => c?.propertyKey === 'DISTANCE')

      if (status === 200) {
        yield put({ type: '@@vehicleForm/SET_SYSTEM_METRIC_SYSTEM', payload: distance });
      }
    } catch (error) {
      console.log('cannot load client metric properties')
    }
  }

   // GET CLIENT METRIC
   const clientMetric = yield select(state => state.vehicle.form.clientMetric);

   if(clientMetric && Object.keys(clientMetric)?.length < 1) {
     try {
       const { data, status} = yield call<any>(axios.get, apiMappings.common.clientMetric);
       if(status === 200) {
         yield put({ type: '@@vehicleForm/SET_CLIENT_METRIC_SYSTEM', payload: data.data});        
       }
     } catch(error)  {
       console.log('cannot load client metric properties')
     }
   }



  const dynamicLabels = yield select((state: AppState) => state.dynamicLabels)

  const { data: payload } = yield call(axios.get, apiMappings.vehicle.form.structure)
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
  if (transformedPayload['vehicle details']?.deviceIds) {
    transformedPayload['vehicle details'].deviceIds['clientBranchId'] = 'clientBranchId'
  }
  let compartmentStructureArray: ICompartmentStucture[] = [];
  let obj = {}
  obj['compartmentId'] = null;
  obj['compartmentName'] = transformedPayload['fleet details']?.['compartmentName']
  obj['noOfUnits'] = transformedPayload['fleet details']?.['noOfUnits']
  compartmentStructureArray.push(obj)
  yield put<IVehicleFormActions>({ type: '@@vehicleForm/SET_STRUCTURE', payload: transformedPayload })
  yield put<IVehicleFormActions>({ type: '@@vehicleForm/SET_LOADING', payload: false })
  yield put<IVehicleFormActions>({ type: '@@vehicleForm/SET_COMPARTMENT_STRUCTURE', payload: compartmentStructureArray })
  yield put<IVehicleFormActions>({ type: '@@vehicleForm/SET_BASE_COMPARTMENT_STRUCTURE', payload: compartmentStructureArray })
}

function* fetchDropdownOptions() {
  const { data: { data: fleetType } } = yield call(axios.get, apiMappings.common.lookup.fleetType)
  yield put<IVehicleFormActions>({ type: '@@vehicleForm/SET_FLEET_TYPE', payload: fleetType })
}

export function* watchFetchStructureRequest() {
  yield takeLatest<IVehicleFormActions>('@@vehicleForm/FETCH_STRUCTURE', fetchStructure)
  yield takeLatest<IVehicleFormActions>('@@vehicleForm/INITIAL_DROPDOWN_LOAD', fetchDropdownOptions)
}
function* fetchCompartmentMasterLookup() {
  const compartmentMasterList:any = yield select(state => state.fleet.form.compartmentMasterList);
   if(compartmentMasterList && Object.keys(compartmentMasterList)?.length < 1 && localStorage.userAccessInfo && JSON.parse(localStorage.userAccessInfo).modelType !== "LH") {
     try {
       const { data, status} = yield call<any>(axios.get, apiMappings.common.lookup.getCompartmentList);
       if(status === 200) {
         yield put({ type: '@@vehicleForm/SET_COMPARTMENT_MASTER_DATA', payload: data?.data});        
       }
     } catch(error)  {
       console.log('cannot load compartment list properties')
     }
   }
}

function* watchFetchCompartmentMasterLookup() {
  yield takeLatest<IVehicleFormActions>('@@vehicleForm/FETCH_COMPARTMENT_MASTER_DATA', fetchCompartmentMasterLookup)
}
function* fetchTrackerMasterLookup(action:IEffectAction) {
  const trackerMasterList:any = yield select(state => state.vehicle.form.trackerMasterList);
   if(trackerMasterList && Object.keys(trackerMasterList)?.length < 1) {
      try {
        const { data, status} = yield call<any>(axios.get, `${apiMappings.common.lookup.getUnlinkedTrackers}?clientBranchId=${action.payload.clientBranchId}&vehicleId=${action.payload.vehicleId}`);
        if(status === 200) {
          yield put({ type: '@@vehicleForm/SET_TRACKER_MASTER_DATA', payload: data});       
        }
      } catch(error)  {
       console.log('cannot load tracker list properties')
     }
   }
}

function* watchFetchTrackerMasterLookup() {
  yield takeLatest<IVehicleFormActions>('@@vehicleForm/FETCH_TRACKER_MASTER_DATA', fetchTrackerMasterLookup)
}
export function* vehicleFormSaga() {
  yield fork(watchFetchStructureRequest)
  yield fork(watchFetchCompartmentMasterLookup)
  yield fork(watchFetchTrackerMasterLookup)
}