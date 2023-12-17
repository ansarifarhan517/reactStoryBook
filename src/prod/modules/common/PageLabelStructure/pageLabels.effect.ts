import { IPageLabelsFetchAction, IPageLabelsAction } from './pageLabels.actions';
import { takeLatest, call, put } from 'redux-saga/effects'
import axios from '../../../utils/axios';
import apiMappings from '../../../utils/apiMapping';

function* fetchData() {
  try {
    // prevent extra call. fetch from local storage
    const { data: { page_label_structure } } = yield call<any>(axios.get, apiMappings.common.pageLabelStructure)
    yield put<IPageLabelsAction>({ type: '@@pageLabels/FETCH_DATA_SUCCESS', payload: page_label_structure })
  } catch {
    yield put<IPageLabelsAction>({ type: '@@pageLabels/FETCH_DATA_FAILURE' })
  }
}

export function* watchPageLabelsFetchDataRequest() {
  yield takeLatest<IPageLabelsFetchAction>('@@pageLabels/FETCH_DATA', fetchData);
}