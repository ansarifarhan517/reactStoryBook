import { IMongoListViewStructure } from "../../../utils/mongo/interfaces";

export interface ISetStructureAction {
  readonly type: "@@ticketingToolListView/FETCH_STRUCTURE_SUCCESS";
  payload: IMongoListViewStructure;
}
export interface IFetchStructureAction {
  readonly type: "@@ticketingToolListView/FETCH_STRUCTURE";
  payload?: { status: string }
}

export interface IFetchDataAction {
  readonly type: "@@ticketingToolListView/FETCH_DATA";
  payload?: any
}
export interface IFetchDataSuccessAction {
  readonly type: "@@ticketingToolListView/FETCH_DATA_SUCCESS";
  payload?: any
}

export interface ISetClientData {
  readonly type: "@@ticketingToolListView/SET_CLIENT_DATA";
  payload?: any
}

export interface ISetTicketStatus{
  readonly type: "@@ticketingToolListView/TICKET_STATUS";
  payload?: any
}

export interface ISetViewMode{
  readonly type: "@@ticketingToolListView/SET_VIEW_MODE";
  payload?: any
}

export interface ISetPeers{
  readonly type: "@@ticketingToolListView/SET_PEERS";
  payload?: any
}

export interface ISetLoading{
  readonly type: "@@ticketingToolListView/SET_LOADING";
  payload?: any
}

export interface ISetSelectedStatus{
  readonly type: "@@ticketingToolListView/SET_SELECTED_STATUS";
  payload?: any
}

export type TicketingToolListViewActions =
  | ISetStructureAction
  | IFetchStructureAction
  |IFetchDataAction
  |IFetchDataSuccessAction
  |ISetClientData
  |ISetTicketStatus
  |ISetViewMode
  |ISetPeers
  |ISetLoading
  |ISetSelectedStatus;
