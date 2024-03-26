import { IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import { IRowData } from "./DriverListView.models";

export interface ISetStructureAction {
  readonly type: '@@driverListView/SET_STRUCTURE';
  payload: IMongoListViewStructure;
}
interface IUpdateDataPayload extends Partial<IRowData> {
  driverId: number
}
export interface IUpdateData {
  readonly type: '@@driverListView/UPDATE_DATA'
  payload: IUpdateDataPayload
}

export interface ISetViewMode {
  readonly type: '@@driverListView/SET_VIEW_MODE'
  payload: 'listview' | 'mapview'
}

export interface ISetEditDetails {
  readonly type: '@@driverListView/SET_EDIT_DETAILS'
  payload: {
    rowId: string
    columnId: string
    value: any
    hasError?: boolean
  }
}

export interface IRemoveEditDetails {
  readonly type: '@@driverListView/REMOVE_EDIT_DETAILS'
  payload: {
    rowId: string
    columnId: string
  }
}
export interface IClearEditDetails {
  readonly type: '@@driverListView/CLEAR_EDIT_DETAILS'
}


export interface IUpdateStatus {
  readonly type: '@@driverListView/UPDATE_STATUS',
  payload: {
    driverId: number,
    status: string,
    custom?: {
      [key: string]: any
    }
  }
}

export interface IResetState {
  readonly type: '@@driverListView/RESET_STATE'
}
export type DriverListViewActions =
  | ISetStructureAction
  | IUpdateData
  | ISetViewMode
  | ISetEditDetails
  | IRemoveEditDetails
  | IClearEditDetails
  | IUpdateStatus
  | IResetState