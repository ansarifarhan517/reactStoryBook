import { IListViewRequestPayload } from "../../../utils/common.interface";
import { IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import { IOverallSummaryListViewDataPayload } from "./OverallSummary.models";

export interface ISetStructureAction {
  readonly type: "@@OverallSummaryListAction/FETCH_STRUCTURE_SUCCESS";
  payload: IMongoListViewStructure;
}

export interface IFetchStructureAction {
  readonly type: "@@OverallSummaryListAction/FETCH_STRUCTURE";
}

export interface ISetFilterStructureAction {
  readonly type: "@@OverallSummaryListAction/FETCH_ADVANCED_FILTER_STRUCTURE_SUCCESS";
  payload: IMongoListViewStructure;
}

export interface IFetchFilterStructureAction {
  readonly type: "@@OverallSummaryListAction/FETCH_ADVANCED_FILTER_STRUCTURE";
}

export interface ISetDataAction {
  readonly type: "@@OverallSummaryListAction/FETCH_DATA_SUCCESS";
  payload: IOverallSummaryListViewDataPayload;
}

export interface IFetchDataAction {
  readonly type: "@@OverallSummaryListAction/FETCH_DATA";
  payload: IListViewRequestPayload;
}

export interface ISetListViewLoading {
  readonly type: "@@OverallSummaryListAction/SET_LOADING";
  payload: {
    listView: boolean;
  };
}

export interface ISetColumnsLoading {
  readonly type: "@@OverallSummaryListAction/SET_COLUMNS_LOADING";
  payload: {
    columns: boolean;
  };
}

export interface ISetDates {
  readonly type: "@@OverallSummaryListAction/SET_DATES";
  payload: {
    minDate?: string;
    maxDate?: string;
  };
}

export interface IFetchTripData {
  readonly type: "@@OverallSummaryListAction/FETCH_TRIP_DATA";
  payload?: any;
}

export interface ISetTripData {
  readonly type: "@@OverallSummaryListAction/FETCH_TRIP_DATA_SUCCESS";
  payload?: any;
}

export interface IFetchOrderData {
  readonly type: "@@OverallSummaryListAction/FETCH_ORDER_DATA";
  payload?: any;
}

export interface ISetOrderData {
  readonly type: "@@OverallSummaryListAction/FETCH_ORDER_DATA_SUCCESS";
  payload?: any;
}

export interface ISetDAData {
  readonly type: "@@OverallSummaryListAction/FETCH_DA_DATA";
  payload?: any;
}

export interface IFetchDAData {
  readonly type: "@@OverallSummaryListAction/FETCH_DA_DATA_SUCCESS";
  payload?: any;
}

export interface IOrderApiSuccess {
  readonly type: "@@OverallSummaryListAction/ORDER_API_SUCCESS";
  payload?: any;
}

export interface ITripApiSuccess {
  readonly type: "@@OverallSummaryListAction/TRIP_API_SUCCESS";
  payload?: any;
}

export interface IDaApiSuccess {
  readonly type: "@@OverallSummaryListAction/DA_API_SUCCESS";
  payload?: any;
}

export interface IDaGraphSuccess {
  readonly type: "@@OverallSummaryListAction/DA_GRAPH_SUCCESS";
  payload?: any;
}

export type OverallSummaryListViewActions =
  | ISetStructureAction
  | IFetchStructureAction
  | ISetDataAction
  | IFetchDataAction
  | ISetListViewLoading
  | ISetColumnsLoading
  | ISetDates
  | IFetchTripData
  | ISetTripData
  | IFetchOrderData
  | ISetDAData
  | IFetchDAData
  | ISetFilterStructureAction
  | IFetchFilterStructureAction
  | IOrderApiSuccess
  | ITripApiSuccess
  | IDaApiSuccess
  | IDaGraphSuccess;
