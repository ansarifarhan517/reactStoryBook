import { IMongoField } from "../../../../../../utils/mongo/interfaces";
import { tAddressType, tDropdown } from "../model";

// Store actions
export interface ISetAddressType {
  readonly type: "@@ALL_ADDRESSES/SET_ADDRESS_TYPE";
  payload: Array<tAddressType>;
}

export interface ISetWeekDays {
  readonly type: "@@ALL_ADDRESSES/SET_WEEK_DAYS";
  payload: Array<tDropdown>;
}

export interface ISetInlineEdits {
  readonly type: '@@ALL_ADDRESSES/SET_INLINE_EDITS'
  payload: {
    rowId: string
    columnId: string
    value: any
    hasError?: boolean
  }
}

export interface IRemoveInlineEdits {
  readonly type: '@@ALL_ADDRESSES/REMOVE_INLINE_EDITS'
  payload: {
    rowId: string
    columnId: string
  }
}

export interface IClearInlineEdits {
  readonly type: '@@ALL_ADDRESSES/CLEAR_INLINE_EDITS'
}

export interface IResetToInitialState {
  readonly type: "@@ALL_ADDRESSES/RESET_TO_INITIALSTATE";
}

export interface ISetListViewColumnStructure {
  readonly type: "@@ALL_ADDRESSES/SET_LISTVIEW_COLUMN_STRUCTURE";
  payload: {
    [key: string]: IMongoField
  };
}

// API actions
export interface IGetAddressType {
  readonly type: "@@ALL_ADDRESSES/GET_ADDRESS_TYPE";
}

export interface IGetWeekDays {
  readonly type: "@@ALL_ADDRESSES/GET_WEEK_DAYS";
}

export type IAllAddressListActions =
  | IResetToInitialState
  | ISetAddressType
  | ISetWeekDays
  | ISetInlineEdits
  | IRemoveInlineEdits
  | IClearInlineEdits
  | ISetListViewColumnStructure
  | IGetWeekDays
  | IGetAddressType;
