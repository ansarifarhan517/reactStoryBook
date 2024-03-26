import {  IResults, IRowData, IModuleTypes, IEventTypes, IPaginationFl } from "./WebHookListView.models";
// IWebHookListViewDataPayload,
import { IMongoListViewStructure } from "../../../utils/mongo/interfaces";
// import { IListViewRequestPayload } from "../../../utils/common.interface";
import { IWebHookListViewDataPayload, IWebHookDetail} from '../WebHookList/WebHookListView.models';

export interface ISetStructureAction {
  readonly type: '@@webhooklistview/FETCH_STRUCTURE_SUCCESS';
  payload: IMongoListViewStructure;
}
export interface IFetchStructureAction {
  readonly type: '@@webhooklistview/FETCH_STRUCTURE';
}

export interface IFetchDataAction {
  readonly type: '@@webhooklistview/FETCH_DATA'
  payload?: IWebHookListViewDataPayload
}

export interface IFetchDataSuccessAction {
  readonly type: '@@webhooklistview/FETCH_DATA_SUCCESS'
  payload: IResults
}

interface IUpdateDataPayload extends Partial<IRowData> {
  customFormGroupId: number
}
export interface IUpdateData {
  readonly type: '@@webhooklistview/UPDATE_DATA'
  payload: IUpdateDataPayload
}

export interface ISetEditDetails {
  readonly type: '@@webhooklistview/SET_EDIT_DETAILS'
  payload: {
    rowId: string
    columnId: string
    value: any
    hasError?: boolean
  }
}

export interface IRemoveEditDetails {
  readonly type: '@@webhooklistview/REMOVE_EDIT_DETAILS'
  payload: {
    rowId: string
    columnId: string
  }
}
export interface IClearEditDetails {
  readonly type: '@@webhooklistview/CLEAR_EDIT_DETAILS'
}

export interface ISetLoading {
  readonly type: '@@webhooklistview/SET_LOADING',
  payload: {
    listView: boolean
  }
}

export interface ISetModuleTypes {
  readonly type: '@@webhooklistview/SET_MODULE_TYPES',
  payload: IModuleTypes[]
}

export interface ISetEventTypes {
  readonly type: '@@webhooklistview/SET_EVENT_TYPES',
  payload: IEventTypes[]
}

export interface ISetWebHookPage {
  readonly type: '@@webhooklistview/SET_WEBHOOK_DETAIL'
  payload: IWebHookDetail
}

export interface ISetCurrentModule {
  readonly type : '@@webhooklistview/SET_CURRENT_MODULE'
  payload: string
}

export interface ISetStatus {
  readonly type: '@@webhooklistview/SET_STATUS'
  payload: any[]
}

export interface ISetResponseCode {
  readonly type: '@@webhooklistview/SET_RESPONSE_CODE'
  payload: any[]
}

export interface IMoreResultExist {
  readonly type: '@@webhooklistview/SET_MORE_RESULT_EXISTS'
  payload: IPaginationFl
}


export type WebHookListViewActions =
  | ISetStructureAction
  | IFetchStructureAction
  | IFetchDataAction
  | IFetchDataSuccessAction
  | IUpdateData
  | ISetEditDetails
  | IRemoveEditDetails
  | IClearEditDetails
  | ISetLoading
  | ISetModuleTypes
  | ISetEventTypes
  | ISetCurrentModule
  | ISetStatus
  | ISetResponseCode
  | IMoreResultExist