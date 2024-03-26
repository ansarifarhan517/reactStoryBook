import { IMongoListViewStructure } from "../../../../../utils/mongo/interfaces";
import {IuserManagementDataPayload, IListViewDataRequestPayload} from "./UserManagement.models"

export interface IsetLoading {
  readonly type: "@@userManagement/SET_LOADING";
  payload: boolean
}

export interface IFetchStructureAction {
    readonly type: "@@userManagement/FETCH_STRUCTURE"
}

export interface IfetchStructureSuccessAction {
    readonly type: "@@userManagement/FETCH_STRUCTURE_SUCCESS"
    payload: IMongoListViewStructure
}

export interface IFetchDataAction {
    readonly type: '@@userManagement/FETCH_DATA'
    payload: IListViewDataRequestPayload
}

export interface IFetchDataSuccessAction {
    readonly type: '@@userManagement/FETCH_DATA_SUCCESS'
    payload: IuserManagementDataPayload
}

export interface ISetData {
readonly type:'@@userManagement/SET_DATA'
payload: {
    key: string,
    value: any
  }
}



export interface IUpdateData{
  readonly type: "@@userManagement/UPDATE_DATA"
  payload: any
}

export interface IFetchUserDropdownActions {
  readonly type: '@@userManagement/FETCH_USER_OPTIONS'
  payload: number
}

export interface IFetchUserDropdownActionsSuccess {
  readonly type: '@@userManagement/FETCH_USER_OPTIONS_SUCCESS'
  payload: any
}

export type UserManagementActions = 
| IsetLoading
| IFetchStructureAction
| IfetchStructureSuccessAction
| IFetchDataAction
| IFetchDataSuccessAction
| ISetData
| IUpdateData
| IFetchUserDropdownActions
| IFetchUserDropdownActionsSuccess