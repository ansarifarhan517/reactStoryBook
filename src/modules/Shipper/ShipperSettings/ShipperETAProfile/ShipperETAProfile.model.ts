import { IMongoFormStructure} from '../../../../utils/mongo/interfaces';

export interface IShipperETAProfileFormReducerState {
  structure: any
  loading: boolean
  isEditMode: boolean,
  etaProfileData?: IShipperData,
  resetData?: IShipperETAProfileFormData
}

/** Actions */
export interface IShipperETAProfileFormFetchStructure {
  readonly type: '@@shipperETAProfileForm/FETCH_STRUCTURE'
}

export interface IShipperETAProfileFormSetStructure {
  readonly type: '@@shipperETAProfileForm/SET_STRUCTURE'
  payload: IMongoFormStructure
}

export interface IShipperETAProfileFormSetLoading {
  readonly type: '@@shipperETAProfileForm/SET_LOADING'
  payload: boolean
}
export interface IShipperETAProfileFormSetEditMode { 
  readonly type: '@@shipperETAProfileForm/SET_EDIT_MODE',
  payload: boolean
}

export interface IShipperETAProfileFormSetShipperData { 
  readonly type: '@@shipperETAProfileForm/SET_SHIPPER_DATA',
  payload: IShipperETAProfileFormData
}
export interface IShipperETAProfileFormFetchShipperETAProfiles { 
  readonly type: '@@shipperETAProfileForm/FETCH_ALERT_PROFILES'
}

export interface ISetFormResetData {
  readonly type: '@@shipperETAProfileForm/SET_FORM_RESET_DATA'
  payload: IShipperETAProfileFormData
}

export interface IResetState { 
  readonly type: '@@shipperETAProfileForm/RESET_INITIAL_STATE'
}


export type IShipperETAProfileFormActions = 
  | IShipperETAProfileFormFetchStructure 
  | IShipperETAProfileFormSetStructure
  | IShipperETAProfileFormSetLoading
  | IShipperETAProfileFormSetEditMode
  | IShipperETAProfileFormSetShipperData
  | ISetFormResetData
  | IResetState
  | IShipperETAProfileFormFetchShipperETAProfiles
   


export interface IShipperData {
  [key: string]: any
}


export interface IShipperETAProfileFormData {
  /** Pending - Add Form Formats for each */
  [key: string]: any
}

export interface AnswerData {
   propertyKey?: number| string,
   propertyValue?: string 
}