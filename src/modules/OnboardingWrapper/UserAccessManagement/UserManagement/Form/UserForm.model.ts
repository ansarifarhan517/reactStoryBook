import { IMongoFormStructure } from '../../../../../utils/mongo/interfaces';

export interface IUserFormReducerState {
  structure: IMongoFormStructure
  loading: boolean
  isEditMode: boolean,
  userData?: IUserData,
  resetData?: IUserFormData
  isDirty?: boolean,
  isSubmitted?: boolean
}

/** Actions */
export interface IUserFormFetchStructure {
  readonly type: '@@userForm/FETCH_STRUCTURE'
}

export interface IUserFormSetStructure {
  readonly type: '@@userForm/SET_STRUCTURE'
  payload: IMongoFormStructure
}

export interface IUserFormSetLoading {
  readonly type: '@@userForm/SET_LOADING'
  payload: boolean
}
export interface IUserFormSetEditMode {
  readonly type: '@@userForm/SET_EDIT_MODE',
  payload: boolean
}

export interface IUserFormSetUserData {
  readonly type: '@@userForm/SET_USER_DATA',
  payload: IUserData
}

export interface ISetFormResetData {
  readonly type: '@@userForm/SET_FORM_RESET_DATA'
  payload: IUserFormData
}

export interface IResetState {
  readonly type: '@@userForm/RESET_INITIAL_STATE'
}

export interface IDirtyFlag{
  readonly type:'@@userForm/SET_FORM_DIRTY_FLAG';
  payload: boolean
}
export interface IUserFormSetIsSubmitted {
  readonly type: '@@userForm/SET_IS_SUBMIT'
  payload: boolean
}

export type IUserFormActions =
  | IUserFormFetchStructure
  | IUserFormSetStructure
  | IUserFormSetLoading
  | IUserFormSetEditMode
  | IUserFormSetUserData
  | ISetFormResetData
  | IResetState
  | IDirtyFlag
  | IUserFormSetIsSubmitted

export interface IUserData {
  
  userId: number
  name: string,
  userGroupName: string,
  clientBranchName: string,
  mobileNumber:number,
  countryName:string
  timeZoneId:number,
  clientName: string,
  persona: string,
  reportingManager: string,
  country: {
    id: number,
    name: string,
    displayName: string,  
    code: string,
    googleCountryCode: string
  },
  distributionCenter: {
    branchId: number,
    name: string,
    id: string,
    clientNodeId: number,
    timezoneId: number,
    canonicalId: string,
    branchDescription: string,
    gmtoffset: string
  },
  emailAddress: string,
  userName: string,
  userGroupId: 
  {
    isActiveFl: boolean,
    name: string,
    id: number,
    statusCode: number,
    persona: string
  },
  clientId: {
    isActiveFl: boolean,
    isSuperFl: string,
    modelType: string,
    id: number,
    name: string
  },
  userTimeZone: {
    timezoneId: number,
    canonicalId: string,
    gmtoffset: string
  },
  parentUserId: {
    userId: number,
    userName: string
  },
  timezoneId:number,
  gmtoffset: string,
  canonicalId:string


}


export interface IUserFormParams {
  userId?: string
}


export interface IUserFormData {
  /** Pending - Add Form Formats for each */
  [key: string]: any
}


export interface IRowData {
  userId: number
  accessProfileRefId: String
  accessprofileName: String
  activeFl: boolean
  attachedUserGroups: number
  defaultProfileFl: boolean
  locked: boolean
}

export interface IUserFormDataPayload {
  clientBranchId: number
  otherCount: 0
  results: Array<IRowData>
  totalCount: number
}