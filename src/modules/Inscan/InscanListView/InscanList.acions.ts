import { IMongoListViewStructure } from "../../../utils/mongo/interfaces";
// import { IListViewRequestPayload } from "../../../utils/common.interface";
import { IInscanListDataCountPayload, IInscanListDataPayload, IInscanLIstViewPaylod, IInscanStructureRequestPayload, tBreadcrumbState } from "./InscanList.models";

export interface ISetStructureAction {
    readonly type: '@@inscanList/FETCH_STRUCTURE_SUCCESS';
    payload: IMongoListViewStructure;
}

export interface IFetchStructureAction {
    readonly type: '@@inscanList/FETCH_STRUCTURE';
    payload : IInscanStructureRequestPayload
}

export interface IFetchDataCountAction {
    readonly type: '@@inscanList/FETCH_DATA_COUNT'
    payload?: IInscanLIstViewPaylod
}
  
export interface IFetchDataCountSuccessAction {
    readonly type: '@@inscanList/FETCH_DATA_COUNT_SUCCESS'
    payload: IInscanListDataCountPayload
}

export interface IFetchDataAction {
    readonly type: '@@inscanList/FETCH_DATA'
    payload?: IInscanLIstViewPaylod
}
  
export interface IFetchDataSuccessAction {
    readonly type: '@@inscanList/FETCH_DATA_SUCCESS'
    payload: IInscanListDataPayload
}

export interface IBreadcrumbState {
    readonly type: '@@inscanList/HANDLE_BREADCRUMB_STATE';
    payload: string
}
export interface ISetBreadcrumbState {
    readonly type: '@@inscanList/SET_BREADCRUMB_STATE';
    payload: tBreadcrumbState
}

export interface ISetColumnsLoading {
    readonly type : '@@inscanList/SET_COLUMNS_LOADING';
    payload: {
      columns: boolean;
    };
}
export interface ISetLoading {
    readonly type: '@@inscanList/SET_LOADING',
    payload: {
      listView: boolean
    }
}

export interface IDisableNext {
    readonly type : '@@inscanList/SET_DISABLE_NEXT'
    payload: boolean
  }

export type InscanListActions = 
  | ISetStructureAction
  | IFetchStructureAction
  | IFetchDataCountAction
  | IFetchDataCountSuccessAction
  | IFetchDataAction
  | IFetchDataSuccessAction
  | IBreadcrumbState
  | ISetBreadcrumbState
  | ISetColumnsLoading
  | ISetLoading
  | IDisableNext