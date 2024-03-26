import { AdvancedSearchActions } from './AdvancedSearch.actions';
import { takeLatest, call, put, all } from 'redux-saga/effects'
import axios from '../../../utils/axios';
import apiMappings from '../../../utils/apiMapping';

function* fetchData() {
    try {
        const { data: operations } = yield call<any>(axios.get, apiMappings.advancedSearch.getOperations);
        yield put({ type: '@@advancedSearch/FETCH_DATA_SUCCESS', payload: operations })
    } catch {
        yield put({ type: '@@advancedSearch/FETCH_DATA_FAILURE' });
    }
}

export function* watchFetchDataRequest() {
    yield takeLatest<AdvancedSearchActions>('@@advancedSearch/FETCH_DATA', fetchData);
}

export function* watchAdvancedSearchRequest() {
    yield all([
        watchFetchDataRequest()
    ])
}
