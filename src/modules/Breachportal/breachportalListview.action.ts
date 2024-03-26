import { IMongoListViewStructure } from "../../utils/mongo/interfaces";


export interface ISetStructureAction {
  readonly type: "@@breachPortalListView/FETCH_STRUCTURE_SUCCESS";
  payload: IMongoListViewStructure;
}
export interface IFetchStructureAction {
  readonly type: "@@breachPortalListView/FETCH_STRUCTURE";
  payload?: { status: string }
}

export interface IFetchDataAction {
  readonly type: "@@breachPortalListView/FETCH_DATA";
  payload?: any
}
export interface IFetchDataSuccessAction {
  readonly type: "@@breachPortalListView/FETCH_DATA_SUCCESS";
  payload?: any
}

export interface ISetClientData {
  readonly type: "@@breachPortalListView/SET_CLIENT_DATA";
  payload?: any
}

export interface ITripsListMile_SetDateRangeFilter {
  readonly type: '@@breachPortalListView/SET_DATERANGE_FILTER'
  payload: {
    from: Date
    to: Date
  }
}

export interface IDisableNext {
  readonly type : '@@breachPortalListView/SET_DISABLE_NEXT'
  payload: boolean
}

export interface ISetLoading{
  readonly type: "@@breachPortalListView/SET_LOADING";
  payload?: any
}


export type breachPortalListViewActions =
  | ISetStructureAction
  | IFetchStructureAction
  |IFetchDataAction
  |IFetchDataSuccessAction
  |ISetClientData
  |ISetLoading
  |ITripsListMile_SetDateRangeFilter
  |IDisableNext
