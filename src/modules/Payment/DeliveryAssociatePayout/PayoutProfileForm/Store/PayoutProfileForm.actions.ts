import { IMongoFormStructure } from "../../../../../utils/mongo/interfaces";

// API actions
export interface IFetchFormStructure {
  readonly type: "@@PAYOUTS/FETCH_FORM_STRUCTURE";
}


export interface IFetchLookup {
  readonly type: "@@PAYOUTS/FETCH_LOOKUPTYPE",
  key: string;
}

// Redux Actions
export interface ISetFormStructure {
  readonly type: "@@PAYOUTS/SET_FORM_STRUCTURE";
  payload: IMongoFormStructure;
}

export interface ISetFormLoading {
  readonly type: "@@PAYOUTS/SET_FORM_LOADING";
  payload: boolean;
}

export interface ISetFormIsUpdateFl {
  readonly type: "@@PAYOUTS/SET_FORM_ISUPDATE_FLAG";
  payload: boolean;
}

export interface IResetState {
  readonly type: "@@PAYOUTS/RESET_TO_INITIAL_STATE";
}

export interface ISetDirtyFlag {
  readonly type: "@@PAYOUTS/SET_FORM_DIRTY_FLAG";
  payload: boolean;
}

export interface ISetPayoutIdData {
    readonly type: "@@PAYOUTS/SET_PAYOUT_ID_DATA";
    payload: any
}

export interface ISetLookup {
  readonly type: "@@PAYOUTS/SET_LOOKUP",
  payload: {
    key: string,
    value: any
  }
}

export type IPayoutFormActions =
  | IFetchFormStructure
  | IFetchLookup
  | ISetFormLoading
  | ISetFormStructure
  | IResetState
  | ISetDirtyFlag
  | ISetPayoutIdData
  | ISetLookup
  | ISetFormIsUpdateFl
