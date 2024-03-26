import { IMongoListViewStructure } from "../../utils/mongo/interfaces";
import { IFilterData, IGetFilterParams } from "../common/AdvancedSearch/interface";
import { IAlertsHistoryDataPayload, IListViewDataRequestPayload, IRowData } from "./AlertsHistory.models";

export interface IsetLoading {
  readonly type: "@@alertsHistory/SET_LOADING";
  payload: boolean;
}

export interface IFetchStructureAction {
  readonly type: "@@alertsHistory/FETCH_STRUCTURE"
}

export interface IfetchStructureSuccessAction {
  readonly type: "@@alertsHistory/FETCH_STRUCTURE_SUCCESS"
  payload: IMongoListViewStructure
}

export interface IFetchDataAction {
  readonly type: '@@alertsHistory/FETCH_DATA'
  payload?: IListViewDataRequestPayload
}

export interface IFetchDataSuccessAction {
  readonly type: '@@alertsHistory/FETCH_DATA_SUCCESS'
  payload: IAlertsHistoryDataPayload
}

interface IUpdateDataPayload extends Partial<IRowData> {
  alertId: number
}

export interface IUpdateData {
  readonly type: '@@alertsHistory/UPDATE_DATA'
  payload: IUpdateDataPayload
}

interface IUpdateNotesPayload extends Partial<IRowData> {
  alertId: number,
  notes: string | undefined
}

export interface IGetFiltersAction {
  readonly type: '@@alertsHistory/GET_FILTERS'
  payload: IGetFilterParams
}

export interface IGetFiltersSuccessAction {
  readonly type: '@@alertsHistory/GET_FILTERS_SUCCESS'
  payload: IFilterData[]
}

export interface IUpdateNotes {
  readonly type: '@@alertsHistory/UPDATE_NOTES'
  payload: IUpdateNotesPayload
}

export interface ISetData {
  readonly type: '@@alertsHistory/SET_DATA'
  payload: {
    key: string,
    value: any
  }
}

export type AlertsHistoryActions =
  | IsetLoading
  | IFetchStructureAction
  | IfetchStructureSuccessAction
  | IFetchDataAction
  | IFetchDataSuccessAction
  | IUpdateData
  | IUpdateNotes
  | IGetFiltersAction
  | IGetFiltersSuccessAction
  | ISetData
