import { all, call, put, takeLatest } from "redux-saga/effects";
import apiMappings from "../../../../utils/apiMapping";
import axios from "../../../../utils/axios";
import store from "../../../../utils/redux/store";
import { ServiceTypeConfigurationActions, IFetchAllServiceTypeListAction } from "./ServiceTypeConfiguration.actions";
import { IEffectAction } from "./ServiceTypeConfiguration.models";



function* fetchAllServiceTypeListviewStructure() {
    const { data: payload } = yield call(axios.get, apiMappings.serviceTypeConfiguration.listView.structure)
    yield put<ServiceTypeConfigurationActions>({ type: '@@serviceTypeConfiguration/FETCH_ALL_SERVICETYPE_LISTVIEW_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchAllServiceTypeListviewStructureRequest() {
    yield takeLatest<ServiceTypeConfigurationActions>('@@serviceTypeConfiguration/FETCH_ALL_SERVICETYPE_LISTVIEW_STRUCTURE', fetchAllServiceTypeListviewStructure);
}
function* fetchAllServiceTypeList(action: IFetchAllServiceTypeListAction) {
    const  { data: { data: payload } } = yield call(axios.post, apiMappings.serviceTypeConfiguration.listView.getAllServiceTypes, null, { params: action.payload })
    
    const autoAllocateLabels = store.getState().serviceTypeConfiguration.autoAllocateLabels; 
    const branchMovementLabels = store.getState().serviceTypeConfiguration.branchMovementLabels;
    payload.results.map(index => {
        if(index.autoAllocate === 'Y'){
            index.autoAllocate = autoAllocateLabels?.autoAssignToNearestDA
        }if(index.autoAllocate === 'P'){
            index.autoAllocate = autoAllocateLabels?.AutoAssignToAnExistingRoute
        }if(index.autoAllocate === 'N'){
            index.autoAllocate = autoAllocateLabels?.ManuallyAssignToARun
        }if(index.branchMovement === 'Y'){
            index.branchMovement = branchMovementLabels?.yes
        }if(index.branchMovement === 'N'){
            index.branchMovement = branchMovementLabels?.no
        }
    })
    
    yield put<ServiceTypeConfigurationActions>({ type: '@@serviceTypeConfiguration/FETCH_ALL_SERVICETYPE_LIST_SUCCESS', payload: payload})
}

export function* watchFetchAllServiceTypeListRequest() {
    yield takeLatest<IFetchAllServiceTypeListAction>('@@serviceTypeConfiguration/FETCH_ALL_SERVICETYPE_LIST', fetchAllServiceTypeList);
}
function* fetchInitialData() {
    try {
  
      const { data: weeks } = yield call(axios.get, apiMappings.common.weeklyOff);
      yield put<ServiceTypeConfigurationActions>({ type: '@@serviceTypeConfiguration/GET_SERVICE_DAYS', payload: weeks });
  
  
      const { data: type } = yield call(axios.get, apiMappings.common.delMedType);
      yield put<ServiceTypeConfigurationActions>({ type: '@@serviceTypeConfiguration/GET_DELIVERY_TYPE', payload: type });

      const { data: branch } = yield call(axios.get, apiMappings.common.lookup.getBranches,{
        data: {},
        params: {},
        headers: {
          'Content-Type': 'application/json',
        }});
      yield put<ServiceTypeConfigurationActions>({ type: '@@serviceTypeConfiguration/GET_BRANCHES', payload: branch });
    } catch (error) {
      console.log('Failed to fetch data for Service Type List View: ', error)
    }
  
}
export function* watchInitialLoad() {
    yield takeLatest<ServiceTypeConfigurationActions>('@@serviceTypeConfiguration/INITIAL_LOAD', fetchInitialData);
}

function* fetchServiceTypeFormStructure() {
    const { data: payload } = yield call(axios.get, apiMappings.serviceTypeConfiguration.form.structure)
    yield put<ServiceTypeConfigurationActions>({ type: '@@serviceTypeConfiguration/FETCH_FORM_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchServiceTypeFormStructureRequest() {
    yield takeLatest<ServiceTypeConfigurationActions>('@@serviceTypeConfiguration/FETCH_FORM_STRUCTURE', fetchServiceTypeFormStructure);
}

function* fetchServiceTypeById(action:IEffectAction) {
    const { data: { data: payload } } = yield call(axios.get, `${apiMappings.serviceTypeConfiguration.form.getServiceTypeById}?serviceTypeDetailsId=${action.payload}`)
    yield put<ServiceTypeConfigurationActions>({ type: '@@serviceTypeConfiguration/FETCH_SERVICETYPE_BY_ID_SUCCESS', payload })
}

export function* watchFetchServiceTypeByIdRequest() {
    yield takeLatest<ServiceTypeConfigurationActions>('@@serviceTypeConfiguration/FETCH_SERVICETYPE_BY_ID', fetchServiceTypeById);
}
export function* watchServiceTypeConfigurationRequest() {
    yield all([
        watchFetchAllServiceTypeListviewStructureRequest(),
        watchFetchAllServiceTypeListRequest(),
        watchInitialLoad(),
        watchFetchServiceTypeFormStructureRequest(),
        watchFetchServiceTypeByIdRequest()
    ])
}