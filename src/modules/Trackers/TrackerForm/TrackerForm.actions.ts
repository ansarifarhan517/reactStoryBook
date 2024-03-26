import { IMongoFormStructure } from "../../../utils/mongo/interfaces";
import { IRowData } from "./TrackerForm.models";
import { IDropdown } from "../../../utils/common.interface";

export interface IFetchFormStructureAction {
    readonly type: "@@trackerForm/FETCH_FORM_STRUCTURE";
}

export interface IFetchFormStructureActionSuccess {
    readonly type: "@@trackerForm/FETCH_FORM_STRUCTURE_SUCCESS";
    payload: IMongoFormStructure;
}

export interface ISetFormEditable {
    readonly type: '@@trackerForm/SET_FORM_EDITABLE'
    payload: boolean
}

export interface IResetTrackerData {
    readonly type: '@@trackerForm/RESET_TRACKER_DATA'
}
export interface IFetchDeviceByIdAction {
    readonly type: '@@trackerForm/FETCH_DEVICE_BY_ID'
    payload: string
}

export interface IFetchDeviceByIdActionSuccess {
    readonly type: '@@trackerForm/FETCH_DEVICE_BY_ID_SUCCESS'
    payload: IRowData
}

export interface IFetchDropdownData {
    readonly type: '@@trackerForm/FETCH_DROPDOWN_OPTIONS';
}
export interface ISetTrackers {
    readonly type: '@@trackerForm/SET_TRACKERS_LIST',
    payload: IDropdown[]
}
export interface ISetSupplier {
    readonly type: '@@trackerForm/SET_SUPPLIER_LIST',
    payload: IDropdown[]
}

export type ITrackerFormActions = IFetchFormStructureAction |
                                IFetchFormStructureActionSuccess |
                                ISetFormEditable|
                                IResetTrackerData |
                                IFetchDeviceByIdAction|
                                IFetchDeviceByIdActionSuccess|
                                IFetchDropdownData |
                                ISetSupplier |
                                ISetTrackers
                                
                                
                
