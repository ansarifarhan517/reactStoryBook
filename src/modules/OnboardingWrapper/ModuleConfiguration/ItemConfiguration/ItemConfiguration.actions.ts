import { IMongoListViewStructure } from "../../../../utils/mongo/interfaces";
import {IitemConfigurationDataPayload, IListViewDataRequestPayload} from "./ItemConfiguration.models"

export interface IsetLoading {
  readonly type: "@@itemConfiguration/SET_LOADING";
  payload: boolean
}

export interface IFetchStructureAction {
    readonly type: "@@itemConfiguration/FETCH_STRUCTURE"
}

export interface IfetchStructureSuccessAction {
    readonly type: "@@itemConfiguration/FETCH_STRUCTURE_SUCCESS"
    payload: IMongoListViewStructure
}

export interface IFetchDataAction {
    readonly type: '@@itemConfiguration/FETCH_DATA'
    payload: IListViewDataRequestPayload
}

export interface IFetchDataSuccessAction {
    readonly type: '@@itemConfiguration/FETCH_DATA_SUCCESS'
    payload: IitemConfigurationDataPayload
}

export interface ISetData {
readonly type:'@@itemConfiguration/SET_DATA'
payload: {
    key: string,
    value: any
  }
}



export interface IUpdateData{
  readonly type: "@@itemConfiguration/UPDATE_DATA"
  payload: any
}

export interface IFetchUserDropdownActions {
  readonly type: '@@itemConfiguration/FETCH_USER_OPTIONS'
  payload: number
}

export interface IFetchUserDropdownActionsSuccess {
  readonly type: '@@itemConfiguration/FETCH_USER_OPTIONS_SUCCESS'
  payload: any
}

export interface IFetchTemperatureCategory {
  readonly type: '@@itemConfiguration/FETCH_TEMPERATURE_OPTIONS'
  payload:any
}
export interface IFetchSystemMetric {
  readonly type: '@@itemConfiguration/FETCH_SYSTEM_METRIC'
  payload:any
}

export type ItemConfigurationActions = 
| IsetLoading
| IFetchStructureAction
| IfetchStructureSuccessAction
| IFetchDataAction
| IFetchDataSuccessAction
| ISetData
| IUpdateData
| IFetchUserDropdownActions
| IFetchUserDropdownActionsSuccess
| IFetchTemperatureCategory
| IFetchSystemMetric