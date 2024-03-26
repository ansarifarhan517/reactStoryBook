import { all, call, put, takeLatest, select } from "redux-saga/effects";
import apiMappings from "../../../../utils/apiMapping";
import axios from "../../../../utils/axios";
import { TrackerManagementActions } from "./TrackerManagement.actions";

function* fetchAllTrackerTypeListviewStructure() {
    const { data: payload } = yield call(axios.get, apiMappings.tracker.trackerManagement.form.trackerTypeListStructure)
    yield put<TrackerManagementActions>({ type: '@@trackerManagement/FETCH_TRACKER_TYPE_LISTVIEW_STRUCTURE_SUCCESS', payload })
}
export function* watchFetchTrackerTypeListStructureRequest() {
    yield takeLatest<TrackerManagementActions>('@@trackerManagement/FETCH_TRACKER_TYPE_LISTVIEW_STRUCTURE', fetchAllTrackerTypeListviewStructure);
}
function* fetchAllSupplierListviewStructure() {
  const { data: payload } = yield call(axios.get, apiMappings.tracker.trackerManagement.form.supplierListStructure)
  yield put<TrackerManagementActions>({ type: '@@trackerManagement/FETCH_SUPPLIER_LISTVIEW_STRUCTURE_SUCCESS', payload })
}
export function* watchFetchSupplierListStructureRequest() {
  yield takeLatest<TrackerManagementActions>('@@trackerManagement/FETCH_SUPPLIER_LISTVIEW_STRUCTURE', fetchAllSupplierListviewStructure);
}
function* fetchTrackerTypeData() {
    try {
          const { data } = yield call<any>(axios.get, apiMappings.common.lookup.trackerTypeMasterList);
          let trackerType = data.map((type: any) => ({
            clientRefMasterCd: type?.clientRefMasterCd,
            value: type?.clientRefMasterId,
            id: type?.clientRefMasterId,
            title: type?.clientRefMasterCd,
            clientRefMasterId: type?.clientRefMasterId,
            clientRefMasterDesc: type?.clientRefMasterDesc
          }))
          yield put<TrackerManagementActions>({ type: '@@trackerManagement/SET_TRACKER_TYPE', payload: trackerType });
      } catch (error) {
        console.log("Failed to fetch data for Dropdown List Data: ", error)
      }
}
export function* watchFetchTrackerTypeData() {
    yield takeLatest<TrackerManagementActions>("@@trackerManagement/FETCH_TRACKER_TYPE_DATA", fetchTrackerTypeData)
}
function* fetchSupplierData() {
  try {
        const { data } = yield call<any>(axios.get, apiMappings.common.lookup.supplierMasterList);
        let supplierList = data.map((type: any) => ({
          clientRefMasterCd: type?.clientRefMasterCd,
          value: type?.clientRefMasterId,
          id: type?.clientRefMasterId,
          title: type?.clientRefMasterCd,
          clientRefMasterId: type?.clientRefMasterId,
          clientRefMasterDesc: type?.clientRefMasterDesc
        }))
        yield put<TrackerManagementActions>({ type: '@@trackerManagement/SET_SUPPLIER_LIST', payload: supplierList });
    } catch (error) {
      console.log("Failed to fetch data for Supplier List Data: ", error)
    }
}
export function* watchSupplierData() {
  yield takeLatest<TrackerManagementActions>("@@trackerManagement/FETCH_SUPPLIER_DATA", fetchSupplierData)
}

export function* watchTrackerManagementRequest() {
    yield all([
        watchFetchTrackerTypeListStructureRequest(),
        watchFetchSupplierListStructureRequest(),
        watchFetchTrackerTypeData(),
        watchSupplierData()
    ])
}