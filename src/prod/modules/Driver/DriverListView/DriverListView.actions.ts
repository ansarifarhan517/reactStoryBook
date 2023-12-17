import { IDriverListViewDataPayload, IRowData } from "./DriverListView.models";
import { IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import { IListViewRequestPayload } from "../../../utils/common.interface";

export interface ISetStructureAction {
  readonly type: '@@driverListView/FETCH_STRUCTURE_SUCCESS';
  payload: IMongoListViewStructure;
}
export interface IFetchStructureAction {
  readonly type: '@@driverListView/FETCH_STRUCTURE';
}

export interface IFetchDataAction {
  readonly type: '@@driverListView/FETCH_DATA'
  payload?: IListViewRequestPayload
}

export interface IFetchDataSuccessAction {
  readonly type: '@@driverListView/FETCH_DATA_SUCCESS'
  payload: IDriverListViewDataPayload
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

export interface ISetLoading {
  readonly type: '@@driverListView/SET_LOADING',
  payload: {
    listView: boolean
    inputVal: boolean
  }
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
  | IFetchStructureAction
  | IFetchDataAction
  | IFetchDataSuccessAction
  | IUpdateData
  | ISetViewMode
  | ISetEditDetails
  | IRemoveEditDetails
  | IClearEditDetails
  | ISetLoading
  | IUpdateStatus
  | IResetState