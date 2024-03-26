
import { IMongoFormStructure } from '../../../../../utils/mongo/interfaces';
import { IOrganizationRoleFormActions} from './OrganizationRoleForm.model';
import { takeLatest, call, put, fork } from 'redux-saga/effects';
import apiMappings from '../../../../../utils/apiMapping';
import axios from '../../../../../utils/axios';
import { prepareFormStructure } from '../../../../../utils/components/Form/utils';

function* fetchStructure() {
  yield put<IOrganizationRoleFormActions>({ type: '@@organizationRoleForm/SET_LOADING', payload: true })
 
  const { data: payload } = yield call<any>(axios.get, apiMappings.organizationRole.form.structure)
  const transformedPayload: IMongoFormStructure = prepareFormStructure(payload)
  
  yield put<IOrganizationRoleFormActions>({ type: '@@organizationRoleForm/SET_STRUCTURE', payload: transformedPayload })
  yield put<IOrganizationRoleFormActions>({ type: '@@organizationRoleForm/SET_LOADING', payload: false })
}

export function* watchFetchStructureRequest() {
  yield takeLatest<IOrganizationRoleFormActions>('@@organizationRoleForm/FETCH_STRUCTURE', fetchStructure)

}

export function* organizationRoleFormSaga() {
  yield fork(watchFetchStructureRequest)
}