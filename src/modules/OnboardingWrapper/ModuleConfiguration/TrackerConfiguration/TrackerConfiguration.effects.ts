import { all, call, put, takeLatest, select } from "redux-saga/effects";
import apiMappings from "../../../../utils/apiMapping";
import axios from "../../../../utils/axios";
import { TrackerConfigurationActions, IFetchTrackerConfigListAction } from "./TrackerConfiguration.actions";
import {IEffectAction} from './TrackerConfiguration.models'

function* fetchAllTrackerConfigListviewStructure() {
    const { data: payload } = yield call(axios.get, apiMappings.tracker.trackerConfiguration.listView.structure)
    yield put<TrackerConfigurationActions>({ type: '@@trackerConfiguration/FETCH_TRACKER_CONFIG_LISTVIEW_STRUCTURE_SUCCESS', payload })
}
export function* watchFetchTrackerConfigListStructureRequest() {
    yield takeLatest<TrackerConfigurationActions>('@@trackerConfiguration/FETCH_TRACKER_CONFIG_LISTVIEW_STRUCTURE', fetchAllTrackerConfigListviewStructure);
}
function* fetchTrackerConfigList(action: IFetchTrackerConfigListAction) {
    const  { data: { data: payload } } = yield call(axios.post, apiMappings.tracker.trackerConfiguration.listView.getAllTrackers, null, { params: action.payload })
    yield put<TrackerConfigurationActions>({ type: '@@trackerConfiguration/FETCH_TRACKERS_CONFIG_LIST_SUCCESS', payload: payload})
}

export function* watchFetchTrackerConfigListRequest() {
    yield takeLatest<IFetchTrackerConfigListAction>('@@trackerConfiguration/FETCH_TRACKERS_CONFIG_LIST', fetchTrackerConfigList);
}
function* fetchDropdownData() {
    try {
        const ownershipList = yield select(state => state?.tracker?.trackerConfiguration?.ownershipList);
        if (ownershipList && ownershipList.length < 1) {
          const { data } = yield call<any>(axios.get, apiMappings.common.lookup.ownershipList);

          let ownership = data.map((type: any) => ({
            label: type?.clientRefMasterCd,
            value: type?.clientRefMasterId,
            id: type?.clientRefMasterId,
            title: type?.clientRefMasterCd,
            clientRefMasterId: type?.clientRefMasterId
          }))
          yield put<TrackerConfigurationActions>({ type: '@@trackerConfiguration/SET_OWNERSHIP_LIST', payload: ownership });
        }
        const trackerTypeList = yield select(state => state?.tracker?.trackerConfiguration?.trackerTypeList);
        if (trackerTypeList && trackerTypeList.length < 1) {
          const { data } = yield call<any>(axios.get, apiMappings.common.lookup.trackerTypeMasterList);
          let trackerType = data.map((type: any) => ({
            label: type?.clientRefMasterCd,
            value: type?.clientRefMasterId,
            id: type?.clientRefMasterId,
            title: type?.clientRefMasterCd,
            clientRefMasterId: type?.clientRefMasterId
          }))
          yield put<TrackerConfigurationActions>({ type: '@@trackerConfiguration/SET_TRACKER_TYPE', payload: trackerType });
        }
  
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
          yield put<TrackerConfigurationActions>({ type: '@@trackerConfiguration/SET_SUPPLIER_LIST', payload: supplierList });
        }
      } catch (error) {
        console.log("Failed to fetch data for Dropdown List Data: ", error)
      }
}
export function* watchFetchDropdownOptions() {
    yield takeLatest<TrackerConfigurationActions>("@@trackerConfiguration/FETCH_DROPDOWN_OPTIONS", fetchDropdownData)
}
function* fetchTrackerFormStructure() {
  const { data: payload } = yield call(
    axios.get,
    apiMappings.tracker.trackerConfiguration.form.structure
  );
  yield put<TrackerConfigurationActions>({
    type: "@@trackerConfiguration/FETCH_FORM_STRUCTURE_SUCCESS",
    payload,
  });
}

export function* watchFetchTrackerFormStructureRequest() {
  yield takeLatest<TrackerConfigurationActions>(
    "@@trackerConfiguration/FETCH_FORM_STRUCTURE",
    fetchTrackerFormStructure
  );
}
function* fetchTrackerById(action:IEffectAction) {
  const { data: { data: payload } } = yield call(axios.get, `${apiMappings.tracker.trackerConfiguration.form.getTrackerById}?trackerConfigId=${action.payload}`)

  yield put<TrackerConfigurationActions>({ type: '@@trackerConfiguration/FETCH_TRACKER_BY_ID_SUCCESS', payload })
}

export function* watchFetchTrackerByIdRequest() {
  yield takeLatest<TrackerConfigurationActions>('@@trackerConfiguration/FETCH_TRACKER_BY_ID', fetchTrackerById);
}

export function* watchTrackerConfigurationRequest() {
    yield all([
        watchFetchTrackerConfigListStructureRequest(),
        watchFetchTrackerConfigListRequest(),
        watchFetchDropdownOptions(),
        watchFetchTrackerFormStructureRequest(),
        watchFetchTrackerByIdRequest()
    ])
}