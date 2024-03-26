import { IDropdown } from "../../../utils/common.interface";
import { IMongoFormStructure } from "../../../utils/mongo/interfaces";
import { IRowData } from "../CheckpointsListView/CheckpointsListView.models";


export interface IFetchFormStructure {
    readonly type: "@@checkpointsForm/FETCH_FORM_STRUCTURE";
}

export interface ISetFormStructure {
    readonly type: "@@checkpointsForm/SET_FORM_STRUCTURE";
    payload: IMongoFormStructure;
}
  
export interface ISetFormLoading {
    readonly type: "@@checkpointsForm/SET_FORM_LOADING";
    payload: boolean;
}

export interface ISetData {
    readonly type: "@@checkpointsForm/SET_DATA";
    payload: IRowData
}

export interface ISetOpenAlertSettings {
    readonly type: "@@checkpointsForm/SET_OPEN_ALERT_SETTINGS"
    payload: boolean
}

export interface IFetchAlertFormStructure {
    readonly type: "@@checkpointsForm/FETCH_ALERT_FORM_STRUCTURE";
}

export interface ISetAlertFormStructure {
    readonly type: "@@checkpointsForm/SET_ALERT_FORM_STRUCTURE";
    payload: IMongoFormStructure;
}

export interface ISetToggleState {
    readonly type: '@@checkpointsForm/SET_TOOGLE_STATE'
    payload: {
      key: string,
      value: boolean
    }
}

export interface ISetAlertsData {
    readonly type: '@@checkpointsForm/SET_ALERTS_DATA'
    payload: any
}

  export interface IFetchCheckpointByIdAction {
    readonly type: '@@checkpointsForm/FETCH_CHECKPOINT_BY_ID'
    payload: number
}

export interface IFetchDeviceByIdActionSuccess {
    readonly type: '@@checkpointsForm/FETCH_CHECKPOINT_BY_ID_SUCCESS'
    payload: IRowData
}

export interface IFetchDropdownData {
    readonly type: '@@checkpointsForm/FETCH_DROPDOWN_OPTIONS';
}

export interface ISetCategoryList {
    readonly type: '@@checkpointsForm/SET_CATEGORY_LIST',
    payload: IDropdown[]
}
export interface ISetFleetList {
    readonly type: '@@checkpointsForm/SET_FLEET_TYPE_LIST',
    payload: IDropdown[]
}

export interface ISetVehicleList {
    readonly type: '@@checkpointsForm/SET_VEHICLE_TYPE_LIST',
    payload: IDropdown[]
}

export interface ISetHubList {
    readonly type: '@@checkpointsForm/SET_HUB_TYPE_LIST',
    payload: IDropdown[]
}

export interface ISetShiftTimings {
    readonly type: '@@checkpointsForm/SET_SHIFT_TIMINGS',
    key: string
    payload: any
}

export interface IResetShiftTimings {
    readonly type: '@@checkpointsForm/RESET_SHIFT_TIMINGS'
}

export interface IRemoveShiftTimings {
    readonly type: '@@checkpointsForm/REMOVE_SHIFT_TIMINGS',
    key: number
}

export interface ISetSaveAlertModalFlag {
    readonly type: "@@checkpointsForm/SET_SAVE_ALERT_MODAL_FLAG"
    payload: boolean
}

export interface IResetState {
    readonly type: "@@checkpointsForm/RESET_STATE"
}

export interface ISetFetchStructureSuccessFlag {
    readonly type: "@@checkpointsForm/SET_FORM_STRUCTURE_FLAG"
    payload: boolean
}

export interface IUpdateToggleState {
    readonly type: '@@checkpointsForm/UPDATE_TOOGLE_STATE'
    payload:  any
}

export interface IFetchDropDownOptionSuccessFlag {
    readonly type: "@@checkpointsForm/FETCH_DROPDOWNOPTIONS_SUCCESS_FLAG"
    payload: boolean
}


export type CheckpointsFormActions = 
    | IFetchFormStructure
    | ISetFormStructure
    | ISetFormLoading
    | ISetData
    | ISetOpenAlertSettings
    | IFetchAlertFormStructure
    | ISetAlertFormStructure
    | ISetToggleState
    | ISetAlertsData
    | IFetchCheckpointByIdAction
    | IFetchDeviceByIdActionSuccess
    | IFetchDropdownData
    | ISetCategoryList
    | ISetFleetList
    | ISetVehicleList
    | ISetHubList
    | ISetShiftTimings
    | IRemoveShiftTimings
    | ISetSaveAlertModalFlag
    | IResetState
    | ISetFetchStructureSuccessFlag
    | IUpdateToggleState
    | IFetchDropDownOptionSuccessFlag
    | IResetShiftTimings
