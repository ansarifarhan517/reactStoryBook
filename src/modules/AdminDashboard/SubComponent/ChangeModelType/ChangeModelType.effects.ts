import { IChangeModelTypeFormActions} from './ChangeModelType.Model';
import { IMongoFormStructure } from './../../../../utils/mongo/interfaces';
import { takeLatest, call, put } from 'redux-saga/effects';
import axios from '../../../../utils/axios';
import { prepareFormStructure } from '../../../../utils/components/Form/utils';
import apiMappings from '../../../../utils/apiMapping';



function* fetchStructure() {
    yield put<IChangeModelTypeFormActions>({ type: '@@changeModelTypeForm/SET_LOADING', payload: true })
    const { data: payload } = yield call(axios.get, apiMappings.adminDashboard.changeModelType.structure)
    const transformedPayload: IMongoFormStructure = prepareFormStructure(payload)
    yield put<IChangeModelTypeFormActions>({ type: '@@changeModelTypeForm/SET_STRUCTURE', payload: transformedPayload })
    yield put<IChangeModelTypeFormActions>({ type: '@@changeModelTypeForm/SET_LOADING', payload: false })
  }

export function* watchChangeModelTypeFetchStructureRequest() {
    yield takeLatest<IChangeModelTypeFormActions>('@@changeModelTypeForm/FETCH_STRUCTURE', fetchStructure)
}