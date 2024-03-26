import { ITrackerFormActions } from "./TrackerForm.actions";
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import axios from "../../../utils/axios";
import apiMappings from "../../../utils/apiMapping";
import { IEffectAction } from "../../OnboardingWrapper/BranchConfiguration/BranchConfiguration.models";



function* fetchTrackerFormStructure() {
  const { data: payload } = yield call(
    axios.get,
    apiMappings.tracker.trackers.form.structure
  );
  yield put<ITrackerFormActions>({
    type: "@@trackerForm/FETCH_FORM_STRUCTURE_SUCCESS",
    payload,
  });
}

export function* watchFetchTrackerFormStructureRequest() {
  yield takeLatest<ITrackerFormActions>(
    "@@trackerForm/FETCH_FORM_STRUCTURE",
    fetchTrackerFormStructure
  );
}

function* fetchDeviceById(action:IEffectAction){

 const {data:{data :payload}} =yield call(axios.get,`${apiMappings.tracker.trackers.form.getDeviceById}?deviceId=${action.payload}`)

 yield put <ITrackerFormActions>({type:'@@trackerForm/FETCH_DEVICE_BY_ID_SUCCESS',payload})
}

export function* watchFetchDeviceByIdRequest(){
  yield takeLatest<ITrackerFormActions>('@@trackerForm/FETCH_DEVICE_BY_ID',fetchDeviceById)
}
function* fetchDropdownData(){
  try{
    const supplierList = yield select(state => state?.tracker?.trackerConfiguration?.supplierList);
    if (supplierList && supplierList.length < 1) {
      const { data } = yield call<any>(axios.get, apiMappings.common.lookup.supplierMasterList);
      let supplierList = data.map((type: any) => ({
        label: type?.clientRefMasterCd,
        value: type?.clientRefMasterId,
        id: type?.clientRefMasterId,
        title: type?.clientRefMasterCd,
        clientRefMasterId: type?.clientRefMasterId
      }))
      yield put<ITrackerFormActions>({ type: '@@trackerForm/SET_SUPPLIER_LIST', payload: supplierList });
    }
    const trackersList = yield select((state)=>state?.tracker?.trackers?.form?.trackersList)
    if(trackersList && trackersList.length<1){
      const {data :{data}}= yield call <any>(axios.get,apiMappings.common.lookup.getTrackerModels);
      yield put<ITrackerFormActions>({type:'@@trackerForm/SET_TRACKERS_LIST',payload: data})
    }
  }
  catch(error: any) {
    console.log("Failed to fetch data for Dropdown List Data: ", error)
  }
}
export function* watchFetchDropdownOptions(){
  yield takeLatest<ITrackerFormActions>('@@trackerForm/FETCH_DEVICE_BY_ID_SUCCESS',fetchDropdownData)
}

export function* watchTrackersRequest() {
  yield all([
    watchFetchTrackerFormStructureRequest(),
    watchFetchDeviceByIdRequest(),
    watchFetchDropdownOptions()
  ])
}