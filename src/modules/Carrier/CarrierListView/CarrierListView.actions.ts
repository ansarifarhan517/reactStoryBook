import { ICarrierListViewDataPayload, IRowData} from "./CarrierListView.models";
import { IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import { IListViewRequestPayload } from "../../../utils/common.interface";
export interface ISetStructureAction {
  readonly type: '@@carrierListView/FETCH_STRUCTURE_SUCCESS';
  payload: IMongoListViewStructure;
}
export interface IFetchStructureAction {
  readonly type: '@@carrierListView/FETCH_STRUCTURE';
  payload?: {
    sectionName: string
  }
}

export interface IFetchDataAction {
  readonly type: '@@carrierListView/FETCH_DATA'
  payload?: IListViewRequestPayload
}

export interface IFetchDataSuccessAction {
  readonly type: '@@carrierListView/FETCH_DATA_SUCCESS'
  payload: ICarrierListViewDataPayload
}

interface IUpdateDataPayload extends Partial<IRowData> {
  clientCoLoaderId: number
}
export interface IUpdateData {
  readonly type: '@@carrierListView/UPDATE_DATA'
  payload: IUpdateDataPayload
}

export interface ISetViewMode {
  readonly type: '@@carrierListView/SET_VIEW_MODE'
  payload: 'listview' | 'mapview'
}

export interface ISetEditDetails {
  readonly type: '@@carrierListView/SET_EDIT_DETAILS'
  payload: {
    rowId: string
    columnId: string
    value: any
    hasError?: boolean
  }
}

export interface IRemoveEditDetails {
  readonly type: '@@carrierListView/REMOVE_EDIT_DETAILS'
  payload: {
    rowId: string
    columnId: string
  }
}
export interface IClearEditDetails {
  readonly type: '@@carrierListView/CLEAR_EDIT_DETAILS'
}

export interface ISetLoading {
  readonly type: '@@carrierListView/SET_LOADING',
  payload: {
    listView: boolean
  }
}

export interface IUpdateStatus {
  readonly type: '@@carrierListView/UPDATE_STATUS',
  payload: {
    clientCoLoaderId: number,
    status: string,
    custom?: {
      [key: string]: any
    }
  }
}
export interface ISetBranchStructureAction {
  readonly type: '@@carrierListView/FETCH_BRANCH_STRUCTURE_SUCCESS';
  payload: IMongoListViewStructure;
}
export interface IFetchBranchStructureAction {
  readonly type: '@@carrierListView/FETCH_BRANCH_STRUCTURE';
}

export interface IFetchBranchDataAction {
  readonly type: '@@carrierListView/FETCH_BRANCH_DATA'
  payload: {
    customColoaderId: number
  }
}

export interface IFetchBranchDataSuccessAction {
  readonly type: '@@carrierListView/FETCH_BRANCH_DATA_SUCCESS'
  payload: ICarrierListViewDataPayload
}


export type CarrierListViewActions =
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
  | ISetBranchStructureAction
  | IFetchBranchStructureAction
  | IFetchBranchDataAction
  | IFetchBranchDataSuccessAction
