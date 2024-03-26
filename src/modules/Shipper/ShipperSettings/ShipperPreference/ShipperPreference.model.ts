import { IMongoFormStructure} from '../../../../utils/mongo/interfaces';

export interface IShipperPreferenceFormReducerState {
  structure: IMongoFormStructure
  loading: boolean
  isEditMode: boolean,
  preferenceData?: IShipperPreferenceFormData,
  resetData?: IShipperPreferenceFormData,
  sameAsParentSystemProps:boolean,
  countries?: any, 
  dateformat?: any,
  baselang?: any
}

/** Actions */
export interface IShipperPreferenceFormFetchStructure {
  readonly type: '@@shipperPreferenceForm/FETCH_STRUCTURE'
}

export interface IShipperPreferenceFormSetStructure {
  readonly type: '@@shipperPreferenceForm/SET_STRUCTURE'
  payload: IMongoFormStructure
}

export interface IShipperPreferenceFormSetLoading {
  readonly type: '@@shipperPreferenceForm/SET_LOADING'
  payload: boolean
}
export interface IShipperPreferenceFormSetEditMode { 
  readonly type: '@@shipperPreferenceForm/SET_EDIT_MODE',
  payload: boolean
}

export interface IShipperPreferenceFormSetShipperData { 
  readonly type: '@@shipperPreferenceForm/SET_SHIPPER_DATA',
  payload: IShipperPreferenceFormData
}

export interface ISetFormResetData {
  readonly type: '@@shipperPreferenceForm/SET_FORM_RESET_DATA'
  payload: IShipperPreferenceFormData
}

export interface IResetState { 
  readonly type: '@@shipperPreferenceForm/RESET_INITIAL_STATE'
}
export interface ISetCountries { 
  readonly type: '@@shipperPreferenceForm/SET_COUNTRIES'
  payload: ISetCountries
}
export interface ISetParentPref { 
  readonly type: '@@shipperPreferenceForm/SET_SAME_AS_SYSTEMPREF'
  payload: boolean
}
export interface ISetDATEFORMAT { 
  readonly type: '@@shipperPreferenceForm/SET_DATEFORMAT'
  payload: IShipperLookupData
}

export interface ISetBASELANG { 
  readonly type: '@@shipperPreferenceForm/SET_BASELANGUAGE'
  payload: ISetBASELANG
}


export type IShipperPreferenceFormActions = 
  | IShipperPreferenceFormFetchStructure 
  | IShipperPreferenceFormSetStructure
  | IShipperPreferenceFormSetLoading
  | IShipperPreferenceFormSetEditMode
  | IShipperPreferenceFormSetShipperData
  | ISetFormResetData
  | IResetState
  | ISetParentPref
  | ISetCountries
  | ISetDATEFORMAT
  | ISetBASELANG

export interface IShipperData {
  "BASECOUNTRY": propertyType
  "TIMEZONE": propertyType
  "BASECURRENCY":propertyType
  "DATEFORMAT":propertyType
  "BASELANGUAGE":propertyType
  "UNITSYSTEM":propertyType
  "DISTANCE":propertyType
  "SPEED":propertyType
  "WEIGHT": propertyType
  "VOLUME": propertyType
  "DIMENSION":propertyType
  "TEMPERATURE":propertyType
  [key: string]: any
}

export interface propertyType{
  id: string,
  name: string
}

export interface IShipperPreferenceFormData {
  [key: string]: any
}

export interface IShipperUnitSystemData {
  [key: string]: any
}

export interface IShipperUnitSystemProperty{
   label: string, 
   value: string 
}

export interface ICurrencyLookup {
  code?:string,
  name?:string
}

export interface ITimezoneLookup {
  canonicalId?:string,
  gmtoffset?:string
}

export interface ILocaleLookup {
  clientRefMasterCd?: string,
  clientRefMasterDesc?: string 
}

export interface IShipperLookupData {
  id?: any,
  name?: string
}
export interface ISetCountries {
  code?: string,
  displayName?: string,
  googleCountryCode?: string,
  id?: any,
  name?: string
}
export interface ISetBASELANG {
  clientId?: number,
  clientRefMasterCd?: string,
  clientRefMasterDesc?: string,
  clientRefMasterId?: number,
  clientRefMasterType?: string,
  id: number,
  isDeleteFl?: string,
  name?: string
}