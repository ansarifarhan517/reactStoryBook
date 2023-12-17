import { AppState } from './../../../utils/redux/rootReducer';
import { IMongoFormStructure } from './../../../utils/mongo/interfaces';
import { IDriverFormActions , IDriverDynamicLabel} from './DriverForm.model';
import { takeLatest, call, put, fork, select } from 'redux-saga/effects';
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import { prepareFormStructure } from '../../../utils/components/Form/utils';
import { getBaseCurrency } from '../../../utils/core';

function* fetchStructure() {
  yield put<IDriverFormActions>({ type: '@@driverForm/SET_LOADING', payload: true })
  const { data: payload } = yield call(axios.get, apiMappings.driver.form.structure)

  const dynamicLabels:IDriverDynamicLabel = yield select((state: AppState) => state.dynamicLabels)

  const transformedPayload: IMongoFormStructure = prepareFormStructure(payload)
  transformedPayload['Driver Details'].salary.decimalPlaces = 2
  transformedPayload['Driver Details'].salary.label += ` (${dynamicLabels[`cur_symbol_${getBaseCurrency()}`]})`

  yield put<IDriverFormActions>({ type: '@@driverForm/SET_STRUCTURE', payload: transformedPayload })
  yield put<IDriverFormActions>({ type: '@@driverForm/SET_LOADING', payload: false })
}

export function* watchFetchStructureRequest() {
  yield takeLatest<IDriverFormActions>('@@driverForm/FETCH_STRUCTURE', fetchStructure)
}

export function* driverFormSaga() {
  yield fork(watchFetchStructureRequest)
}