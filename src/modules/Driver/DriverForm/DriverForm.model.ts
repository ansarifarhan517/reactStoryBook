import { IMongoFormStructure, ICustomFieldsEntity, IMultiselectEntity, IFileEntity, IAddressEntity } from './../../../utils/mongo/interfaces';

export interface IDriverFormReducerState {
  structure: IMongoFormStructure
  loading: boolean
  isEditMode: boolean,
  driverData?: IDriverData,
  resetData?: IDriverFormData
}

/** Actions */
export interface IDriverFormFetchStructure {
  readonly type: '@@driverForm/FETCH_STRUCTURE'
}

export interface IDriverFormSetStructure {
  readonly type: '@@driverForm/SET_STRUCTURE'
  payload: IMongoFormStructure
}

export interface IDriverFormSetLoading {
  readonly type: '@@driverForm/SET_LOADING'
  payload: boolean
}
export interface IDriverFormSetEditMode { 
  readonly type: '@@driverForm/SET_EDIT_MODE',
  payload: boolean
}

export interface IDriverFormSetDriverData { 
  readonly type: '@@driverForm/SET_DRIVER_DATA',
  payload: IDriverData
}

export interface ISetFormResetData {
  readonly type: '@@driverForm/SET_FORM_RESET_DATA'
  payload: IDriverFormData
}

export interface IResetState { 
  readonly type: '@@driverForm/RESET_INITIAL_STATE'
}

export type IDriverFormActions = 
  | IDriverFormFetchStructure 
  | IDriverFormSetStructure
  | IDriverFormSetLoading
  | IDriverFormSetEditMode
  | IDriverFormSetDriverData
  | ISetFormResetData
  | IResetState

export interface IDriverData {
  driverId: number
  driverName: string
  isActiveFl: boolean
  driverTimeZone?: string
  gender?: 'Male' | 'Female'
  guid?: string
  addressList?: IAddressEntity[],
  clientBranchId?: number
  clientBranchName?: string
  customFieldsEntity?: ICustomFieldsEntity[]
  languageList?: IMultiselectEntity[]
  licenseNumber: string
  licenseProof?: IFileEntity[]
  addressProofId?: IFileEntity[]
  licenseType: string
  licenseIssueBy?: string
  maritalStatus?: 'Married' | 'Single'
  phoneNumber?: string
  shiftList: {
    isActiveFl: boolean
    shiftStartTime: number
    shiftEndTime: number
    startTime: number
    endTime: number
    driverId: number
  }[]
  status: string
  referenceId: string
  emailId?: string
  dateOfBirth?: number
  licenseValidity?: number
  managerEmailId?: string
  managerPhoneNumber?: string
  previousCompanyName?: string
  reportingManager?: string
  salary?: string | number
  vehicleNumber?: string | number
  defaultVehicle?: string | number
  driverEmployeeId?: string | number
  experience?: string
  [key: string]: any
}


export interface IDriverFormData {
  /** Pending - Add Form Formats for each */
  [key: string]: any
}

export interface IDriverDynamicLabel {
  /** Pending - Add Form Formats for each */
  [key: string]: any
}