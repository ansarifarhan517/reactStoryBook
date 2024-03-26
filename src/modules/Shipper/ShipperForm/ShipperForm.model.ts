import { IMongoFormStructure, ICustomFieldsEntity, IFileEntity, IAddressEntity } from '../../../utils/mongo/interfaces';

export interface IShipperFormReducerState {
  structure: IMongoFormStructure
  loading: boolean,
  isEditMode: boolean,
  shipperData?: IShipperData,
  resetData?: IShipperFormData,
  rejectReasonList?:IShipperRejectReasonsData,
  rejectionModal?:boolean,
  isApproved:boolean,

}

/** Actions */
export interface IShipperFormFetchStructure {
  readonly type: '@@shipperForm/FETCH_STRUCTURE'
}

export interface IShipperFormSetStructure {
  readonly type: '@@shipperForm/SET_STRUCTURE'
  payload: IMongoFormStructure
}

export interface IShipperFormSetLoading {
  readonly type: '@@shipperForm/SET_LOADING'
  payload: boolean
}
export interface IShipperFormSetEditMode { 
  readonly type: '@@shipperForm/SET_EDIT_MODE',
  payload: boolean
}

export interface IShipperFormSetShipperData { 
  readonly type: '@@shipperForm/SET_SHIPPER_DATA',
  payload: IShipperData
}

export interface ISetFormResetData {
  readonly type: '@@shipperForm/SET_FORM_RESET_DATA'
  payload: IShipperFormData
}

export interface IResetState { 
  readonly type: '@@shipperForm/RESET_INITIAL_STATE'
}

export interface IShipperSetRejectReasonsState { 
  readonly type: '@@shipperForm/FETCH_REJECT_REASON_LIST_DATA'
}



export interface ISetRejectModal {
  readonly type: '@@shipperForm/SET_REJECT_MODAL',
  payload: boolean
}

export interface IApproveShipper {
  readonly type: '@@shipperForm/APPROVE_SHIPPER'
  payload: boolean
}


export type IShipperFormActions = 
  | IShipperFormFetchStructure 
  | IShipperFormSetStructure
  | IShipperFormSetLoading
  | IShipperFormSetEditMode
  | IShipperFormSetShipperData
  | ISetFormResetData
  | IResetState
  | ISetRejectModal
  | IShipperSetRejectReasonsState
  | IApproveShipper
   


export interface IShipperData {
  shipperId: number
  shipperLogo?: IFileEntity[]
  isActiveFl: boolean
  shipperName:string
  adminName:string
  userName?:string
  emailAddress:string
  phoneNumber?: string
  branch?:string
  addressList?: IAddressEntity[],
  customFieldsEntity?: ICustomFieldsEntity[]
  customerSupportNumber?:number
  customerSupportEmail?:string
  status: string
  referenceId?: string
  [key: string]: any
}


export interface IShipperFormData {
  [key: string]: any
}
export interface IShipperRejectReasonsData {
  [key: string]: any
}
export interface ILocalStorageEntries {
  [key: string] : any
}