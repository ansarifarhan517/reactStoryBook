import { all, call, put, takeLatest, select } from "redux-saga/effects";
import apiMappings from "../../../utils/apiMapping";
import axios from "../../../utils/axios";
import { TrackersListViewActions, IFetchTrackerListAction } from "./TrackersListView.actions";
import { getGoogleAPIKey } from '../../../utils/components/Map/MapHelper';
import store from '../../../utils/redux/store';

function* fetchAllTrackerListviewStructure() {
    const viewMode = store.getState().tracker.trackers.listView.viewMode;
    const { data: payload } = yield call(axios.get, apiMappings.tracker.trackers.listView.structure+ `${viewMode === 'mapview'? 'TRACKER_MAP_VIEW': 'TRACKER_LIST_VIEW'}`)
    // payload.columns.batteryPerc.fieldType = 'number'
    yield put<TrackersListViewActions>({ type: '@@trackersListView/FETCH_TRACKER_LISTVIEW_STRUCTURE_SUCCESS', payload })
}
export function* watchFetchTrackerListStructureRequest() {
    yield takeLatest<TrackersListViewActions>('@@trackersListView/FETCH_TRACKER_LISTVIEW_STRUCTURE', fetchAllTrackerListviewStructure);
}
function* fetchTrackerList(action: IFetchTrackerListAction) {
    const advFilterLoader = yield select(state => state.advanceFilter.advFilterLoader);
    if (!!advFilterLoader) {
    try {
      const params = {
        pageNumber: action.payload?.pageNumber,
        pageSize: action.payload?.pageSize,
        searchBy: action.payload?.searchBy,
        searchText: action.payload?.searchText,
        sortBy: action.payload?.sortBy,
        sortOrder: action.payload?.sortOrder,
        dataFetchMode: 'DATA'
      }
      const filterListPayload = yield select(state => state.advanceFilter.filterListPayload);
      const data = filterListPayload || undefined
    const  { data: { data: payload } } = yield call(axios.post, apiMappings.tracker.trackers.listView.getAllTrackers, data, { params })
    yield put<TrackersListViewActions>({ type: '@@trackersListView/FETCH_TRACKERS_LIST_SUCCESS', payload: payload})
    } catch (error) {
        console.log('Failed to fetch data for Tracker List View: ', error);
    }
    }
}

export function* watchFetchTrackerListRequest() {
    yield takeLatest<IFetchTrackerListAction>('@@trackersListView/FETCH_TRACKERS_LIST', fetchTrackerList);
}
function* fetchDropdownData() {
    try {
        const googleApiKey = getGoogleAPIKey()
        yield put<TrackersListViewActions>({ type: '@@trackersListView/GOOGLE_API_KEY', payload: googleApiKey });

        let branchList = yield select(state => state?.tracker.trackers.listView.branchList);
        const { data: response } = yield call<any>(axios.get, apiMappings.common.lookup.getDistributionCenterBranch, {data: {}, params: {},
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: false
        })
        branchList = response
        branchList = branchList.map((branches: any) => ({
            label: branches?.name,
            value: branches?.name,
            id: branches?.branchId,
            title: branches?.name,
            name: branches?.name
        }))
        yield put<TrackersListViewActions>({ type: '@@trackersListView/SET_BRANCH_LIST', payload: branchList });

        let trackerTypeList = yield select(state => state?.tracker.trackers.listView.trackerTypeList);
        const { data } = yield call<any>(axios.get, apiMappings.common.lookup.trackerTypeMasterList);
        trackerTypeList = data.map((type: any) => ({
            label: type?.clientRefMasterCd,
            value: type?.clientRefMasterCd,
            id: type?.clientRefMasterId,
            title: type?.clientRefMasterCd,
            name: type?.clientRefMasterCd
        }))
        yield put<TrackersListViewActions>({ type: '@@trackersListView/SET_TRACKER_TYPE', payload: trackerTypeList });

        let trackerConfigList = yield select(state => state?.tracker.trackers.listView.trackersList);
            const { data : trackers} = yield call<any>(axios.get, apiMappings.common.lookup.getTrackerModels)
            trackerConfigList = trackers?.data?.map((type: any) => ({
                label: type?.trackerModel,
                value: type?.trackerModel,
                id: type?.trackerConfigId,
                title: type?.trackerModel,
                clientRefMasterId: type?.trackerConfigId
            }))
            yield put<TrackersListViewActions>({type:'@@trackersListView/SET_TRACKERS_CONFIG_LIST',payload :trackerConfigList})

      } catch (error) {
        console.log("Failed to fetch data for Dropdown List Data: ", error)
      }
}
export function* watchFetchDropdownOptions() {
    yield takeLatest<TrackersListViewActions>("@@trackersListView/FETCH_DROPDOWN_OPTIONS", fetchDropdownData)
}
function* fetchClientMetricSystem() {
    const { data, status} = yield call<any>(axios.get, apiMappings.common.clientMetric);
    if(status === 200) {
        yield put<TrackersListViewActions>({ type: '@@trackersListView/SET_CLIENT_METRIC_SYSTEM', payload: data.data})
    }
}

export function* watchFetchClientMetricSystemRequest() {
    yield takeLatest<TrackersListViewActions>('@@trackersListView/FETCH_CLIENT_METRIC_SYSTEM', fetchClientMetricSystem);
}
export function* watchTrackersListRequest() {
    yield all([
        watchFetchTrackerListStructureRequest(),
        watchFetchTrackerListRequest(),
        watchFetchDropdownOptions(),
        watchFetchClientMetricSystemRequest()
    ])
}