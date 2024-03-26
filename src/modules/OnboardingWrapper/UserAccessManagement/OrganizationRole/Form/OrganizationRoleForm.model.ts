import { IMongoFormStructure, ICustomFieldsEntity, IMultiselectEntity } from '../../../../../utils/mongo/interfaces';

export interface IOrganizationRoleFormReducerState {
  structure: IMongoFormStructure
  loading: boolean
  isEditMode: boolean,
  organizationRoleData?: IOrganizationRoleData,
  resetData?: IOrganizationRoleFormData
  accessprofiledata?: IName[]
  isDirty: boolean
}

/** Actions */
export interface IOrganizationRoleFormFetchStructure {
  readonly type: '@@organizationRoleForm/FETCH_STRUCTURE'
}

export interface IOrganizationRoleFormSetStructure {
  readonly type: '@@organizationRoleForm/SET_STRUCTURE'
  payload: IMongoFormStructure
}

export interface IOrganizationRoleFormSetLoading {
  readonly type: '@@organizationRoleForm/SET_LOADING'
  payload: boolean
}
export interface IOrganizationRoleFormSetEditMode {
  readonly type: '@@organizationRoleForm/SET_EDIT_MODE',
  payload: boolean
}

export interface IOrganizationRoleFormSetOrganizationRoleData {
  readonly type: '@@organizationRoleForm/SET_ORGANIZATION_ROLE_DATA',
  payload: IOrganizationRoleData
}

export interface ISetFormResetData {
  readonly type: '@@organizationRoleForm/SET_FORM_RESET_DATA'
  payload: IOrganizationRoleFormData
}

export interface IResetState {
  readonly type: '@@organizationRoleForm/RESET_INITIAL_STATE'
}


export interface IInitialLoad {
  readonly type: '@@organizationRoleForm/INITIAL_DROPDOWN_LOAD';
}

export interface ISetAccessProfile {
  readonly type: '@@organizationRoleForm/SET_ACCESSPROFILE_DATA';
  payload: IName[]
}

export interface IDirtyFlag{
  readonly type:'@@organizationRoleForm/SET_FORM_DIRTY_FLAG';
  payload: boolean
}

export type IOrganizationRoleFormActions =
  | IOrganizationRoleFormFetchStructure
  | IOrganizationRoleFormSetStructure
  | IOrganizationRoleFormSetLoading
  | IOrganizationRoleFormSetEditMode
  | IOrganizationRoleFormSetOrganizationRoleData
  | ISetFormResetData
  | IResetState
  | IInitialLoad
  | ISetAccessProfile
  | IDirtyFlag

export interface IOrganizationRoleData {
  activeFl: boolean
  clientId: number
  defaultAccess: boolean
  isMobileGroupId: string
  isSSOMandatoryFl: boolean
  locked: boolean
  mappingId: number
  accessprofileName: string
  accessProfileReferenceId: string
  accessProfileIds?: IMultiselectEntity[]
  orgRoleDescription: string
  orgRoleId: number
  orgRoleAccessProfile?: IMultiselectEntity[]
  accessProfileListData?:IMultiselectEntity[]
  accessProfileId: number

  orgRoleLandingPage?: string

  orgRoleLandingPageId: number
  orgRoleName: string
  orgRoleRefId: number

  persona: string
  validationStatusCode: 0
  customFieldsEntity?: ICustomFieldsEntity[]
}

export interface IOrganizationRoleFormParams {
  orgRoleId?: string 
}


export interface IOrganizationRoleFormData {

  [key: string]: any
}


export interface IName {
  
  accessProfileId?: string,
  accessProfileRefId?: string,
  accessprofileName?: string,
  accessprofileDesc?: string,
  clientId?: number,
  defaultProfileFl?: boolean,
  locked?: boolean,
  activeFl?: boolean,
  accessProfileReferenceId?:string
  
}

