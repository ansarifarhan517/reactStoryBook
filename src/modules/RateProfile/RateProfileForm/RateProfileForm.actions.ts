import { IClientMetric as IRateProfileClientMetric, ISystemClientMetric } from '../../Vehicle/VehicleForm/VehicleForm.model';
import {
  IMongoFormStructure,
  // ICustomFieldsEntity, IMultiselectEntity, IFileEntity, IAddressEntity
} from './../../../utils/mongo/interfaces';

// import { IRateProfileData, IRateProfileFormData } from './RateProfileForm.model'
/** Actions */
export interface IRateProfileFormFetchStructure {
  readonly type: '@@rateProfileForm/FETCH_STRUCTURE'
}
export interface IRateProfileFormFetchOptions{
  readonly type: '@@rateProfileForm/FETCH_OPTIONS'
}

export interface IRateProfileFormSetStructure {
  readonly type: '@@rateProfileForm/SET_STRUCTURE'
  payload: IMongoFormStructure
}

export interface IRateProfileFormSetLoading {
  readonly type: '@@rateProfileForm/SET_LOADING'
  payload: boolean
}

export interface IRateProfileFormSetEditMode {
  readonly type: '@@rateProfileForm/SET_EDIT_MODE',
  payload: boolean
}

export interface IRateProfileFormSetRateProfileData {
  readonly type: '@@rateProfileForm/SET_RATEPROFILE_DATA',
  payload: any //IRateProfileData
}

export interface ISetFormResetData {
  readonly type: '@@rateProfileForm/SET_FORM_RESET_DATA'
  payload: any //IRateProfileFormData
}

export interface IResetState {
  readonly type: '@@rateProfileForm/RESET_INITIAL_STATE'
}

export interface IInitialLoad {
  readonly type: '@@rateProfileForm/INITIAL_DROPDOWN_LOAD';
}
export interface IRateProfileFormSetSkillSetType {
  type: '@@rateProfileForm/SET_SKILLSET',
  payload: any[]
}

export interface ISystemMetric {
  readonly type: '@@rateProfileForm/SET_SYSTEM_METRIC_SYSTEM';
  payload: ISystemClientMetric[]
}

export interface IClientMetric {
  readonly type: '@@rateProfileForm/SET_CLIENT_METRIC_SYSTEM';
  payload: IRateProfileClientMetric[]
}

export interface IRateProfileFormDistanceOption {
  type: '@@rateProfileForm/SET_DISTANCE_OPTIONS',
  payload: any[]
}


export interface IRateProfileFormWeightOption {
  type: '@@rateProfileForm/SET_WEIGHT_OPTIONS',
  payload: any[]
}

export interface IRateProfileFormVolumeOption {
  type: '@@rateProfileForm/SET_VOLUME_OPTIONS',
  payload: any[]
}

export interface IRateProfileFormPieceOption {
  type: '@@rateProfileForm/SET_PIECE_OPTIONS',
  payload: any[]
}

export interface IRateProfileFormRateNormalOption {
  type: '@@rateProfileForm/SET_RATENORMAL_OPTIONS',
  payload: any[]
}

export interface IRateProfileFormSetBasicElementsStructure {
  type:  '@@rateProfileForm/SET_BASIC_ELEMENTS_STRUCTURE',
  payload: any
}

export type IRateProfileFormActions =
  | IRateProfileFormFetchStructure
  | IRateProfileFormSetStructure
  | IRateProfileFormSetLoading
  | IRateProfileFormSetEditMode
  | IRateProfileFormSetRateProfileData
  | ISetFormResetData
  | IResetState
  | IInitialLoad
  | IRateProfileFormSetSkillSetType
  | ISystemMetric
  | IClientMetric
  | IRateProfileFormDistanceOption
  | IRateProfileFormWeightOption
  | IRateProfileFormVolumeOption
  | IRateProfileFormPieceOption
  | IRateProfileFormRateNormalOption
  | IRateProfileFormSetBasicElementsStructure

