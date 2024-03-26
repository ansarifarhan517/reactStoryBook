import { AppState } from '../../../../../utils/redux/rootReducer';
import { IMongoFormStructure } from '../../../../../utils/mongo/interfaces';
import { IItemFormActions } from './ItemConfiguration.action';
import { takeLatest, call, put, fork, select } from 'redux-saga/effects';
import apiMappings from '../../../../../utils/apiMapping';
import axios from '../../../../../utils/axios';
import { prepareFormStructure } from '../../../../../utils/components/Form/utils';


function* fetchStructure() {
  yield put<IItemFormActions>({ type: '@@itemForm/SET_LOADING', payload: true })
  const { data: payload } = yield call<any>(axios.get, apiMappings.itemConfiguration.form.structure)

  yield select((state: AppState) => state.dynamicLabels)
  const transformedPayload: IMongoFormStructure = prepareFormStructure(payload)

  yield put<IItemFormActions>({ type: '@@itemForm/SET_STRUCTURE', payload: transformedPayload })
  yield put<IItemFormActions>({ type: '@@itemForm/SET_LOADING', payload: false })


  const systemMetric = yield select(state => state.itemConfiguration.form.systemMetric);
  if(!systemMetric || systemMetric?.length < 1) {
    const { data: {data: payload} } = yield call<any>(axios.get, apiMappings.common.clientMetric)
    yield put<IItemFormActions>({ type: '@@itemForm/FETCH_SYSTEM_METRIC', payload })
  }

}

export function* watchFetchStructureRequest() {
  yield takeLatest<IItemFormActions>('@@itemForm/FETCH_STRUCTURE', fetchStructure)
}

export function* itemFormSaga() {
  yield fork(watchFetchStructureRequest)
}