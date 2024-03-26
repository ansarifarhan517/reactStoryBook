import { IClientMetricSystem } from "../../../utils/common.interface";
import { IMongoColumnOnlyStructure, IMongoFormStructure } from "../../../utils/mongo/interfaces";
import { ISlabRow } from "./BonusesForm.reducer";

// API actions
export interface IFetchFormStructure {
  readonly type: "@@bonuses/FETCH_FORM_STRUCTURE";
}



// Redux Actions
export interface ISetFormStructure {
  readonly type: "@@bonuses/SET_FORM_STRUCTURE";
  payload: IMongoFormStructure;
}

export interface ISetClientMetrics {
  readonly type: "@@bonuses/SET_CLIENT_METRIC_SYSTEM";
  payload: IClientMetricSystem[];
}

export interface ISetSlabData {
  readonly type: "@@bonuses/SET_SLAB_DATA";
  payload?: Array<ISlabRow>;
}

export interface ISetAdvancedFilterColumns {
  readonly type: "@@bonuses/SET_ADVANCED_FILTER_COLUMNS";
  payload: IMongoColumnOnlyStructure
}

export interface ISetDAFilter {
  readonly type: "@@bonuses/SET_DA_FILTER";
  payload: any
}

export interface ISetFormLoading {
  readonly type: "@@bonuses/SET_FORM_LOADING";
  payload: boolean;
}

export interface ISetFormIsUpdateFl {
  readonly type: "@@bonuses/SET_FORM_ISUPDATE_FLAG";
  payload: boolean;
}

export interface ISetFormIsCopyFl {
  readonly type: "@@bonuses/SET_FORM_ISCOPY_FLAG";
  payload: boolean;
}

export interface ISetFormResetData {
  readonly type: "@@bonuses/RESET_FORM_DATA";
  payload: any;
}

export interface IResetState {
  readonly type: "@@bonuses/RESET_TO_INITIAL_STATE";
}

export interface ISetDirtyFlag {
  readonly type: "@@bonuses/SET_FORM_DIRTY_FLAG";
  payload: boolean;
}

export interface ISetBonusIdData {
    readonly type: "@@bonuses/SET_BONUSID_DATA";
    payload: any
}

export interface ISetLookup {
  readonly type: "@@bonuses/SET_LOOKUP",
  payload: {
    key: string,
    value: any
  }
}

export type IBonusFormActions =
  | IFetchFormStructure
  | ISetFormResetData
  | ISetFormLoading
  | ISetFormStructure
  | IResetState
  | ISetDirtyFlag
  | ISetBonusIdData
  | ISetLookup
  | ISetFormIsCopyFl
  | ISetFormIsUpdateFl
  | ISetAdvancedFilterColumns
  | ISetDAFilter
  | ISetSlabData
  | ISetClientMetrics;
