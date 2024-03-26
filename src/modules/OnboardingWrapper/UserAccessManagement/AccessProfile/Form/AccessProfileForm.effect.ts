import {IAccessProfileFormActions , IAccessProfileFormFetchStructure} from './AccessProfileForm.actions'
import { takeLatest, call, put } from 'redux-saga/effects';
import apiMappings from '../../../../../utils/apiMapping';
import axios from '../../../../../utils/axios';


function* fetchStructure(action :IAccessProfileFormFetchStructure) {
    yield put<IAccessProfileFormActions>({type:'@@accessProfileForm/SET_LOADING', payload:true})
    const {data : payload} = yield call<any>(axios.get, apiMappings.accessProfile.form.structure + "?persona=" +action?.payload)
    
    yield put<IAccessProfileFormActions>({type:'@@accessProfileForm/SET_STRUCTURE',payload})
    yield put<IAccessProfileFormActions>({type:'@@accessProfileForm/SET_LOADING', payload:false})
}

export function* watchFetchStructureRequest() {
yield takeLatest<IAccessProfileFormFetchStructure>('@@accessProfileForm/FETCH_STRUCTURE',fetchStructure);
}
