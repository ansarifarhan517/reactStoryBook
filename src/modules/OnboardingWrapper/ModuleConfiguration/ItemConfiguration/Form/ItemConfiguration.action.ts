import { IMongoFormStructure } from '../../../../../utils/mongo/interfaces';
import { IItemFormData, IUserData } from './ItemConfiguration.model';

export interface IItemFormReducerState {
  structure: IMongoFormStructure
  loading: boolean
  isEditMode: boolean,
  userData?: IUserData,
  resetData?: IItemFormData
  isDirty: boolean
  systemMetric?:any[]
}

/** Actions */
export interface IItemFormFetchStructure {
  readonly type: '@@itemForm/FETCH_STRUCTURE'
}

export interface IItemFormSetStructure {
  readonly type: '@@itemForm/SET_STRUCTURE'
  payload: IMongoFormStructure
}

export interface IItemFormSetLoading {
  readonly type: '@@itemForm/SET_LOADING'
  payload: boolean
}
export interface IItemFormSetEditMode {
  readonly type: '@@itemForm/SET_EDIT_MODE',
  payload: boolean
}

export interface IItemFormSetUserData {
  readonly type: '@@itemForm/SET_USER_DATA',
  payload: IUserData
}

export interface ISetFormResetData {
  readonly type: '@@itemForm/SET_FORM_RESET_DATA'
  payload: IItemFormData
}

export interface IResetState {
  readonly type: '@@itemForm/RESET_INITIAL_STATE'
}

export interface IDirtyFlag{
  readonly type:'@@itemForm/SET_FORM_DIRTY_FLAG';
  payload: boolean
}


export interface ISystemMetric {
  readonly type: '@@itemForm/FETCH_SYSTEM_METRIC';
  payload: any
}

export type IItemFormActions =
  | IItemFormFetchStructure
  | IItemFormSetStructure
  | IItemFormSetLoading
  | IItemFormSetEditMode
  | IItemFormSetUserData
  | ISetFormResetData
  | IResetState
  | IDirtyFlag
  | ISystemMetric
