import { ICustomerListViewDataPayload, INotifyDropdown, INotifyDynamicTagsStructureOptions, IRowData } from "./CustomerListView.models";
import { IMongoListViewStructure } from "../../../utils/mongo/interfaces";

export interface ISetStructureAction {
  readonly type: '@@customerListView/FETCH_STRUCTURE_SUCCESS';
  payload: IMongoListViewStructure;
}
export interface IFetchStructureAction {
  readonly type: '@@customerListView/FETCH_STRUCTURE';
}


interface IUpdateDataPayload extends Partial<IRowData> {
  customerId: number
  isactive: boolean
}
export interface IUpdateData {
  readonly type: '@@customerListView/UPDATE_DATA'
  payload: IUpdateDataPayload
}

export interface ISetViewMode {
  readonly type: '@@customerListView/SET_VIEW_MODE'
  payload: 'listview' | 'mapview'
}

export interface ISetEditDetails {
  readonly type: '@@customerListView/SET_EDIT_DETAILS'
  payload: {
    rowId: string
    columnId: string
    value: any
    hasError?: boolean
  }
}

export interface IRemoveEditDetails {
  readonly type: '@@customerListView/REMOVE_EDIT_DETAILS'
  payload: {
    rowId: string
    columnId: string
  }
}
export interface IClearEditDetails {
  readonly type: '@@customerListView/CLEAR_EDIT_DETAILS'
}

export interface ISetLoading {
  readonly type: '@@customerListView/SET_LOADING',
  payload: {
    listView: boolean
  }
}

export interface IUpdateStatus {
  readonly type: '@@customerListView/UPDATE_STATUS',
  payload: {
    customerId: number,
    status: string,
    custom?: {
      [key: string]: any
    }
  }
}

export interface IResetState {
  readonly type: '@@customerListView/RESET_STATE'
}

export interface ISetNotify {
  readonly type: '@@customerListView/SET_NOTIFY_TYPE'
  payload: INotifyDropdown[]
}

export interface ISetNotifyDynamicTags {
  readonly type: '@@customerListView/SET_NOTIFY_TYPE_DYNAMIC_TAGS'
  payload: INotifyDynamicTagsStructureOptions[]
}





export type CustomerListViewActions =
  | ISetStructureAction
  | IFetchStructureAction
  | IUpdateData
  | ISetViewMode
  | ISetEditDetails
  | IRemoveEditDetails
  | IClearEditDetails
  | ISetLoading
  | IUpdateStatus
  | IResetState
  | ISetNotify
  | ISetNotifyDynamicTags