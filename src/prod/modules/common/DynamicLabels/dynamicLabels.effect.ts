import { IDynamicLabelsFetchAction, IDynamicLabelsAction } from './dynamicLabels.actions';
import { takeEvery, call, put } from 'redux-saga/effects'
import axios from '../../../utils/axios';
import apiMappings from '../../../utils/apiMapping';

export const setLabelsInSessionStorage = async (labelSet: Record<string, string>) => {
  Object.keys(labelSet).forEach((labelKey) => {
    window?.sessionStorage?.setItem(`logiLabels_${labelKey}`, labelSet[labelKey])
  })
}

function* fetchData({ payload }: IDynamicLabelsFetchAction) {
  try {
    const { data: labelSet } = yield call<any>(axios.get, apiMappings.common.dynamicLabels, { params: { labels: payload } })
    yield put<IDynamicLabelsAction>({ type: '@@dynamicLabels/FETCH_DATA_SUCCESS', payload: labelSet })
    setLabelsInSessionStorage(labelSet)
  } catch {
    yield put<IDynamicLabelsAction>({ type: '@@dynamicLabels/FETCH_DATA_FAILURE' })
  }
}

export function* watchDynamicLabelsFetchDataRequest() {
  yield takeEvery<IDynamicLabelsFetchAction>('@@dynamicLabels/FETCH_DATA', fetchData);
}