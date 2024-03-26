import { IUatFormActions } from "./UatForm.model";
import { IMongoFormStructure } from './../../../utils/mongo/interfaces';
import { takeLatest, call, put, fork} from 'redux-saga/effects';
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import { prepareFormStructure } from '../../../utils/components/Form/utils';

function* fetchStructure() {
    yield put<IUatFormActions>({ type: '@@uatForm/SET_LOADING', payload: true })
    const { data : payload } = yield call(axios.get, apiMappings.saas.uat.structure)
    const transformedPayload: IMongoFormStructure = prepareFormStructure(payload)
    
    yield put<IUatFormActions>({ type: '@@uatForm/SET_STRUCTURE', payload: transformedPayload })
    yield put<IUatFormActions>({ type: '@@uatForm/SET_LOADING', payload: false })
}

export function* watchFetchStructureRequest() {
    yield takeLatest<IUatFormActions>('@@uatForm/FETCH_STRUCTURE', fetchStructure)
}

export function* uatFormSaga() {
    yield fork(watchFetchStructureRequest)
}
