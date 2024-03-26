import { IBranchLookupResponse, IListViewRequestPayload } from "../../../../../utils/common.interface";
import { IMongoListViewStructure } from "../../../../../utils/mongo/interfaces";

// Store actions

export interface ISetListViewData {
  readonly type: "@@PAYOUTS/SET_LISTVIEW_DATA";
  payload: {
    results: [],
    totalCount: number,
  };
}

export interface ISetBranchProfileMapping {
  readonly type: "@@PAYOUTS/SET_BRANCHPROIFLE_MAPPING";
  payload: any;
}


export interface ISetListViewStructure {
  readonly type: "@@PAYOUTS/SET_LISTVIEW_STRUCTURE";
  payload: IMongoListViewStructure;
}

export interface ISetIsListViewEmpty {
  readonly type: "@@PAYOUTS/SET_IS_LIST_EMPTY";
  payload: boolean;
}

interface ISetBranchAttached {
  readonly type: '@@PAYOUTS/SET_BRANCH_ATTACHED'
  payload: IBranchLookupResponse[]
}


// API actions
export interface ISetLoading {
  readonly type: '@@PAYOUTS/SET_LOADING';
  payload: {
    listView: boolean;
  };
}
export interface ISetColumnsLoading {
  readonly type : '@@PAYOUTS/SET_COLUMNS_LOADING';
  payload: {
    columns: boolean;
  };
}

export interface IFetchListViewData {
  readonly type: "@@PAYOUTS/FETCH_LISTVIEW_DATA";
  payload?: IListViewRequestPayload;
}

export interface IFetchModalListViewStructure {
  readonly type: "@@PAYOUTS/FETCH_MODAL_LISTVIEW_STRUCTURE";
}

export interface IFetchListViewStructure {
  readonly type: "@@PAYOUTS/FETCH_LISTVIEW_STRUCTURE";
}

export interface IResetToInitialState {
  readonly type: "@@PAYOUTS/RESET_TO_INITIALSTATE";
}

interface IFetchAttachedBranch {
  readonly type: '@@PAYOUTS/FETCH_ATTACHED_BRANCH'
}

export interface ISetListParams {
  readonly type: "@@PAYOUTS/SET_LIST_PARAMS",
  payload: any
}


export type tPayoutProfilesActions =
  | IFetchListViewData
  | ISetListViewData
  | ISetListViewStructure
  | IFetchListViewStructure
  | IResetToInitialState
  | ISetIsListViewEmpty
  | ISetBranchAttached
  | IFetchAttachedBranch
  | ISetLoading
  | ISetColumnsLoading
  | ISetListParams
  | ISetBranchProfileMapping;
