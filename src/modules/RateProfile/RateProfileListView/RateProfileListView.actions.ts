import { IRateProfileListViewDataPayload, IRowData } from "./RateProfileListView.models";
import { IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import { IListViewRequestPayload } from "../../../utils/common.interface";

export interface ISetStructureAction {
  readonly type: '@@rateProfileListView/FETCH_STRUCTURE_SUCCESS';
  payload: IMongoListViewStructure;
}
export interface IFetchStructureAction {
  readonly type: '@@rateProfileListView/FETCH_STRUCTURE';
}

export interface IFetchDataAction {
  readonly type: '@@rateProfileListView/FETCH_DATA'
  payload?: IListViewRequestPayload
}

export interface IFetchDataSuccessAction {
  readonly type: '@@rateProfileListView/FETCH_DATA_SUCCESS'
  payload: {
    data: IRateProfileListViewDataPayload,
    moreResultsExists?: boolean
  }
}

interface IUpdateDataPayload extends Partial<IRowData> {
  rateProfileId: number
  isActive: boolean
}

export interface IUpdateData {
  readonly type: '@@rateProfileListView/UPDATE_DATA'
  payload: IUpdateDataPayload
}

export interface ISetViewMode {
  readonly type: '@@rateProfileListView/SET_VIEW_MODE'
  payload: 'listview' | 'mapview'
}

export interface ISetEditDetails {
  readonly type: '@@rateProfileListView/SET_EDIT_DETAILS'
  payload: {
    rowId: string
    columnId: string
    value: any
    hasError?: boolean
  }
}

export interface IRemoveEditDetails {
  readonly type: '@@rateProfileListView/REMOVE_EDIT_DETAILS'
  payload: {
    rowId: string
    columnId: string
  }
}
export interface IClearEditDetails {
  readonly type: '@@rateProfileListView/CLEAR_EDIT_DETAILS'
}

export interface ISetLoading {
  readonly type: '@@rateProfileListView/SET_LOADING',
  payload: {
    listView: boolean
  }
}

export interface IUpdateStatus {
  readonly type: '@@rateProfileListView/UPDATE_STATUS',
  payload: {
    customerId: number,
    status: string,
    custom?: {
      [key: string]: any
    }
  }
}

export interface IResetState {
  readonly type: '@@rateProfileListView/RESET_STATE'
}


export type RateProfileListViewActions =
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