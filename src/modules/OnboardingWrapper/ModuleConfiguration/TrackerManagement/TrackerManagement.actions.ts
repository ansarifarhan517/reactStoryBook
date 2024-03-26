import { IMongoListViewStructure } from "../../../../utils/mongo/interfaces";
import { IDropdown } from "../../../../utils/common.interface";
export interface ITrackerTypeListViewStructureAction {
    readonly type: '@@trackerManagement/FETCH_TRACKER_TYPE_LISTVIEW_STRUCTURE'
}
export interface ITrackerTypeListViewStructureActionSuccess {
    readonly type: '@@trackerManagement/FETCH_TRACKER_TYPE_LISTVIEW_STRUCTURE_SUCCESS'
    payload: IMongoListViewStructure
}
export interface ISupplierListViewStructureAction {
    readonly type: '@@trackerManagement/FETCH_SUPPLIER_LISTVIEW_STRUCTURE'
}
export interface ISupplierListViewStructureActionSuccess {
    readonly type: '@@trackerManagement/FETCH_SUPPLIER_LISTVIEW_STRUCTURE_SUCCESS'
    payload: IMongoListViewStructure
}
export interface IFetchTrackerTypeData {
    readonly type: '@@trackerManagement/FETCH_TRACKER_TYPE_DATA';
}
export interface IFetchSupplierData {
    readonly type: '@@trackerManagement/FETCH_SUPPLIER_DATA';
}
export interface ISetTrackerType {
    readonly type: '@@trackerManagement/SET_TRACKER_TYPE',
    payload: IDropdown[]
}
export interface ISetSupplier {
    readonly type: '@@trackerManagement/SET_SUPPLIER_LIST',
    payload: IDropdown[]
}
export interface IResetTrackerData {
    readonly type: '@@trackerManagement/RESET_TRACKER_DATA'
}
  
export type TrackerManagementActions = ITrackerTypeListViewStructureAction
| ITrackerTypeListViewStructureActionSuccess
| ISupplierListViewStructureAction
| ISupplierListViewStructureActionSuccess
| IFetchTrackerTypeData
| IFetchSupplierData
| ISetTrackerType
| ISetSupplier
| IResetTrackerData

