// In here make all the actions that should be called to change the store state.
// NOTE: There can be certain actions written here to make the API call too. It is for the purpose of code Modularization

// STEPS ->
// 1. Make the interface for that action and then export it as a common type.

import { IListViewRequestPayload } from "../../../utils/common.interface";
import { IMongoColumnOnlyStructure, IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import { tLoadingKey } from "./BonusesList.model";

// Store actions
export interface ISetLoading {
  readonly type: "@@bonuses/SET_LISTVIEW_LOADING";
  payload: {
    key: tLoadingKey;
    value: boolean;
  };
}


export interface ISetListViewData {
  readonly type: "@@bonuses/SET_LISTVIEW_DATA";
  payload: {
    results: [],
    totalCount: number,
  };
}

export interface ISetListViewStructure {
  readonly type: "@@bonuses/SET_LISTVIEW_STRUCTURE";
  payload: IMongoListViewStructure;
}

export interface ISetIsListViewEmpty {
  readonly type: "@@bonuses/SET_IS_LIST_EMPTY";
  payload: boolean;
}

// Include this action only if you have modal list view in your listView
export interface ISetModalListViewStructure {
  readonly type: "@@bonuses/SET_MODAL_LISTVIEW_STRUCTURE";
  payload: IMongoColumnOnlyStructure
}

// API actions
export interface IFetchListViewData {
  readonly type: "@@bonuses/FETCH_LISTVIEW_DATA";
  payload?: IListViewRequestPayload;
}

export interface IFetchModalListViewStructure {
  readonly type: "@@bonuses/FETCH_MODAL_LISTVIEW_STRUCTURE";
}

export interface IFetchListViewStructure {
  readonly type: "@@bonuses/FETCH_LISTVIEW_STRUCTURE";
}

export interface IResetToInitialState {
  readonly type: "@@bonuses/RESET_TO_INITIALSTATE";
}

export type IBonusesListActions =
  | ISetLoading
  | IFetchListViewData
  | ISetListViewData
  | ISetListViewStructure
  | IFetchListViewStructure
  | IResetToInitialState
  | ISetIsListViewEmpty
  // Include below action only if you have modal list view in your listView
  | IFetchModalListViewStructure
  | ISetModalListViewStructure;
