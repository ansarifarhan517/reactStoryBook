import { IMongoFormStructure, IMultiselectEntity} from '../../../../utils/mongo/interfaces';

export interface IShipperPropertiesFormReducerState {
  structure: IMongoFormStructure
  loading: boolean
  shipperData?: IShipperData,
  resetData?: IShipperPropertiesFormData,
  priorityData:IShipperPropertiesFormData,
  serviceType:IServiceType[]
}

/** Actions */
export interface IShipperPropertiesFormFetchStructure {
  readonly type: '@@shipperPropertiesForm/FETCH_STRUCTURE'
}

export interface IShipperPropertiesFormSetStructure {
  readonly type: '@@shipperPropertiesForm/SET_STRUCTURE'
  payload: IMongoFormStructure
}

export interface IShipperPropertiesFormFetchServiceType {
  readonly type: '@@shipperPropertiesForm/FETCH_SERVICETYPE'
}

export interface IShipperPropertiesFormSetServiceType {
  readonly type: '@@shipperPropertiesForm/SET_SERVICETYPE'
  payload: IServiceType[]
}

export interface IShipperPropertiesFormSetLoading {
  readonly type: '@@shipperPropertiesForm/SET_LOADING'
  payload: boolean
}
export interface IShipperPropertiesFormSetEditMode { 
  readonly type: '@@shipperPropertiesForm/SET_EDIT_MODE',
  payload: boolean
}

export interface IShipperPropertiesFormSetShipperData { 
  readonly type: '@@shipperPropertiesForm/SET_SHIPPER_DATA',
  payload: IShipperData
}
export interface IShipperPropertiesFormSetPriorityData { 
  readonly type: '@@shipperPropertiesForm/SET_PRIORITY_DATA',
  payload: IShipperPropertiesFormData
}

export interface ISetFormResetData {
  readonly type: '@@shipperPropertiesForm/SET_FORM_RESET_DATA'
  payload: IShipperPropertiesFormData
}

export interface IResetState { 
  readonly type: '@@shipperPropertiesForm/RESET_INITIAL_STATE'
}


export type IShipperPropertiesFormActions = 
  | IShipperPropertiesFormFetchStructure 
  | IShipperPropertiesFormSetStructure
  | IShipperPropertiesFormSetLoading
  | IShipperPropertiesFormSetEditMode
  | IShipperPropertiesFormSetShipperData
  | ISetFormResetData
  | IResetState
  | IShipperPropertiesFormSetPriorityData 
  | IShipperPropertiesFormFetchServiceType
  | IShipperPropertiesFormSetServiceType



export interface IShipperData {
  shipperId: number
  isActiveFl: boolean
  clientProperties: IShipperPropertiesFormData
  priority:string
  serviceType:IMultiselectEntity[],
  serviceAreaProfileName:string
  rateChartName:string
  orderReAttempts:number
  orderConversion:string
  status: string
  [key: string]: any
}

export interface IServiceType {
  clientId: number
  clientRefMasterCd: string
  clientRefMasterDesc: string
  clientRefMasterId: number
  clientRefMasterType: string
  id: number
  isDeleteFl: string
  name: string
}

export interface IShipperPropertiesFormData {
  /** Pending - Add Form Formats for each */
  [key: string]: any
}
export interface IShipperRejectReasonsData {
  /** Pending - Add Form Formats for each */
  [key: string]: any
}
export interface ILocalStorageEntries {
  [key: string] : any
}