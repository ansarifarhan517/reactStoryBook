import { IListViewRequestPayload, IDropdown, IClientMetricSystem } from "../../../utils/common.interface";
import { IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import { ITrackerDataPayload } from "./TrackersListView.models"

export interface ITrackerListViewStructureAction {
    readonly type: '@@trackersListView/FETCH_TRACKER_LISTVIEW_STRUCTURE'
}
export interface ITrackerListViewStructureActionSuccess {
    readonly type: '@@trackersListView/FETCH_TRACKER_LISTVIEW_STRUCTURE_SUCCESS'
    payload: IMongoListViewStructure
}
export interface IFetchTrackerListAction {
    readonly type: '@@trackersListView/FETCH_TRACKERS_LIST'
    payload: IListViewRequestPayload
}
export interface IFetchTrackerListActionSuccess {
    readonly type: '@@trackersListView/FETCH_TRACKERS_LIST_SUCCESS'
    payload: ITrackerDataPayload
}
export interface ISetTrackerType {
    readonly type: '@@trackersListView/SET_TRACKER_TYPE',
    payload: IDropdown[]
}
export interface ISetTrackersConfigList {
    readonly type: '@@trackersListView/SET_TRACKERS_CONFIG_LIST',
    payload: IDropdown[]
}
export interface ISetBranchList {
    readonly type: '@@trackersListView/SET_BRANCH_LIST',
    payload: IDropdown[]
}
export interface ISetUploadModal {
    readonly type: '@@trackerListView/SET_UPLOAD_MODAL',
    payload: boolean
}

export interface IFetchDropdownData {
    readonly type: '@@trackersListView/FETCH_DROPDOWN_OPTIONS';
}
export interface IResetTrackerDropdownData {
    readonly type: '@@trackersListView/RESET_TRACKER_DROPDOWN_DATA'
}
export interface ISetViewMode {
    readonly type: '@@trackersListView/SET_VIEW_MODE'
    payload: 'listview' | 'mapview'
}
export interface ISetGoogleAPIKey {
    readonly type: '@@trackersListView/GOOGLE_API_KEY',
    payload: string
}
export interface IFetchClientMetric {
    readonly type: '@@trackersListView/FETCH_CLIENT_METRIC_SYSTEM';
}
export interface ISetClientMetric {
    readonly type: '@@trackersListView/SET_CLIENT_METRIC_SYSTEM';
    payload: IClientMetricSystem[]
}
export type TrackersListViewActions = ITrackerListViewStructureAction
| ITrackerListViewStructureActionSuccess
| IFetchTrackerListAction
| IFetchTrackerListActionSuccess
| ISetTrackerType
| ISetTrackersConfigList
| ISetUploadModal
| ISetBranchList
| IFetchDropdownData
| IResetTrackerDropdownData
| ISetViewMode
| ISetGoogleAPIKey
| IFetchClientMetric
| ISetClientMetric