import { IMongoFormStructure} from '../../../../utils/mongo/interfaces';

export interface IShipperAlertProfileFormReducerState {
  structure: IMongoFormStructure
  loading: boolean
  isEditMode: boolean,
  alertProfileData?: IShipperData,
  resetData?: IShipperAlertProfileFormData
}

/** Actions */
export interface IShipperAlertProfileFormFetchStructure {
  readonly type: '@@shipperAlertProfileForm/FETCH_STRUCTURE'
}

export interface IShipperAlertProfileFormSetStructure {
  readonly type: '@@shipperAlertProfileForm/SET_STRUCTURE'
  payload: IMongoFormStructure
}

export interface IShipperAlertProfileFormSetLoading {
  readonly type: '@@shipperAlertProfileForm/SET_LOADING'
  payload: boolean
}
// export interface IShipperAlertProfileFormSetEditMode { 
//   readonly type: '@@shipperAlertProfileForm/SET_EDIT_MODE',
//   payload: boolean
// }

export interface IShipperAlertProfileFormSetShipperData { 
  readonly type: '@@shipperAlertProfileForm/SET_SHIPPER_DATA',
  payload: IShipperAlertProfileFormData
}
export interface IShipperAlertProfileFormFetchShipperAlertProfiles { 
  readonly type: '@@shipperAlertProfileForm/FETCH_ALERT_PROFILES'
}

export interface ISetFormResetData {
  readonly type: '@@shipperAlertProfileForm/SET_FORM_RESET_DATA'
  payload: IShipperAlertProfileFormData
}

export interface IResetState { 
  readonly type: '@@shipperAlertProfileForm/RESET_INITIAL_STATE'
}


export type IShipperAlertProfileFormActions = 
  | IShipperAlertProfileFormFetchStructure 
  | IShipperAlertProfileFormSetStructure
  | IShipperAlertProfileFormSetLoading
  // | IShipperAlertProfileFormSetEditMode
  | IShipperAlertProfileFormSetShipperData
  | ISetFormResetData
  | IResetState
  | IShipperAlertProfileFormFetchShipperAlertProfiles
   


export interface IShipperData {
  [key: string]: any
}


export interface IShipperAlertProfileFormData {
  /** Pending - Add Form Formats for each */
  [key: string]: any
}

export interface IShipperOptionsList{
  label: string, 
  value: string | number
}