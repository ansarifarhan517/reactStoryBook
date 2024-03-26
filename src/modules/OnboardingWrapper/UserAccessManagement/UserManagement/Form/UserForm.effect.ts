import { AppState } from '../../../../../utils/redux/rootReducer';
import { IMongoFormStructure } from '../../../../../utils/mongo/interfaces';
import { IUserFormActions } from './UserForm.model';
import { takeLatest, call, put, fork, select } from 'redux-saga/effects';
import apiMappings from '../../../../../utils/apiMapping';
import axios from '../../../../../utils/axios';
import { prepareFormStructure } from '../../../../../utils/components/Form/utils';


function* fetchStructure() {
  yield put<IUserFormActions>({ type: '@@userForm/SET_LOADING', payload: true })
  const { data: payload } = yield call<any>(axios.get, apiMappings.userManagement.form.structure)

  yield select((state: AppState) => state.dynamicLabels)

  const transformedPayload: IMongoFormStructure = prepareFormStructure(payload)
  
  

  yield put<IUserFormActions>({ type: '@@userForm/SET_STRUCTURE', payload: transformedPayload })
  
    yield put<IUserFormActions>({ type: '@@userForm/SET_LOADING', payload: false })

  
  
}

export function* watchFetchStructureRequest() {
  yield takeLatest<IUserFormActions>('@@userForm/FETCH_STRUCTURE', fetchStructure)
}

export function* userFormSaga() {
  yield fork(watchFetchStructureRequest)
}