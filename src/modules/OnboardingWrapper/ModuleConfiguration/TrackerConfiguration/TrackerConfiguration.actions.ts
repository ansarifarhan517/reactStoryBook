import { IListViewRequestPayload, IDropdown } from "../../../../utils/common.interface";
import { IMongoFormStructure, IMongoListViewStructure } from "../../../../utils/mongo/interfaces";
import { ITrackerConfigDataPayload, IRowData } from "./TrackerConfiguration.models"

export interface ISetViewType {
    readonly type: '@@trackerConfiguration/SET_VIEW_TYPE'
    payload: string
}
export interface ITrackerConfigListViewStructureAction {
    readonly type: '@@trackerConfiguration/FETCH_TRACKER_CONFIG_LISTVIEW_STRUCTURE'
}
export interface ITrackerConfigListViewStructureActionSuccess {
    readonly type: '@@trackerConfiguration/FETCH_TRACKER_CONFIG_LISTVIEW_STRUCTURE_SUCCESS'
    payload: IMongoListViewStructure
}
export interface IFetchTrackerConfigListAction {
    readonly type: '@@trackerConfiguration/FETCH_TRACKERS_CONFIG_LIST'
    payload: IListViewRequestPayload
}
export interface IFetchTrackerConfigListActionSuccess {
    readonly type: '@@trackerConfiguration/FETCH_TRACKERS_CONFIG_LIST_SUCCESS'
    payload: ITrackerConfigDataPayload
}
export interface IFetchDropdownData {
    readonly type: '@@trackerConfiguration/FETCH_DROPDOWN_OPTIONS';
}
export interface ISetTrackerType {
    readonly type: '@@trackerConfiguration/SET_TRACKER_TYPE',
    payload: IDropdown[]
}
export interface ISetSupplier {
    readonly type: '@@trackerConfiguration/SET_SUPPLIER_LIST',
    payload: IDropdown[]
}
export interface ISetOwnership {
    readonly type: '@@trackerConfiguration/SET_OWNERSHIP_LIST',
    payload: IDropdown[]
}
export interface IFetchFormStructureAction {
    readonly type: "@@trackerConfiguration/FETCH_FORM_STRUCTURE";
}
export interface IFetchFormStructureActionSuccess {
    readonly type: "@@trackerConfiguration/FETCH_FORM_STRUCTURE_SUCCESS";
    payload: IMongoFormStructure;
}
export interface IResetTrackerData {
    readonly type: '@@trackerConfiguration/RESET_TRACKER_DATA'
}
export interface IResetTrackerDropdownData {
    readonly type: '@@trackerConfiguration/RESET_TRACKER_DROPDOWN_DATA'
}
export interface ISetFormEditable {
    readonly type: '@@trackerConfiguration/SET_FORM_EDITABLE'
    payload: boolean
}
export interface IFetchTrackerByIdAction {
    readonly type: '@@trackerConfiguration/FETCH_TRACKER_BY_ID'
    payload: string
}
  
export interface IFetchTrackerByIdActionSuccess {
    readonly type: '@@trackerConfiguration/FETCH_TRACKER_BY_ID_SUCCESS'
    payload: IRowData
}

export interface IResetState {
    readonly type: '@@trackerConfiguration/RESET_STATE'
}
  
export type TrackerConfigurationActions = ISetViewType
| ITrackerConfigListViewStructureAction
| ITrackerConfigListViewStructureActionSuccess
| IFetchTrackerConfigListAction
| IFetchTrackerConfigListActionSuccess
| IFetchDropdownData
| ISetTrackerType
| ISetSupplier 
| ISetOwnership
| IFetchFormStructureAction
| IFetchFormStructureActionSuccess
| IResetTrackerData
| ISetFormEditable
| IFetchTrackerByIdAction
| IFetchTrackerByIdActionSuccess
| IResetTrackerDropdownData
| IResetState
