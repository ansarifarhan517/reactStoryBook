import { IMongoListViewStructure } from "../../../../../utils/mongo/interfaces";
import { IOrganizationRoleDataPayload,IListViewDataRequestPayload, IRowData,IPersonaList,ILandingPageList,INoOfAccessProfileRequest, INoOfUsersRequest, IAccessProfileDataPayload, IUserCountDataPayload } from "./OrganizationRole.models";

export interface IsetLoading {
  readonly type: "@@organizationRole/SET_LOADING";
  payload: boolean
}

export interface IFetchStructureAction {
  readonly type: "@@organizationRole/FETCH_STRUCTURE"
}

export interface IfetchStructureSuccessAction {
  readonly type: "@@organizationRole/FETCH_STRUCTURE_SUCCESS"
  payload: IMongoListViewStructure
}

export interface IFetchDataAction {
  readonly type: '@@organizationRole/FETCH_DATA'
  payload: IListViewDataRequestPayload
}

export interface IFetchDataSuccessAction {
  readonly type: '@@organizationRole/FETCH_DATA_SUCCESS'
  payload: IOrganizationRoleDataPayload
}

export interface ISetData {
  readonly type: '@@organizationRole/SET_DATA'
  payload: {
    key: string,
    value: any
  }
}

export interface IResetState {
  readonly type: '@@organizationRole/RESET_STATE'
}


interface IUpdateDataPayload extends Partial<IRowData> {
  orgRoleId: number
}
export interface IUpdateData {
  readonly type: '@@organizationRole/UPDATE_DATA'
  payload: IUpdateDataPayload
}


export interface ISetPersona {
  readonly type : '@@organizationRole/SET_PERSONA';
  payload: IPersonaList[]
}

export interface ISetLandingPage {
  readonly type : '@@organizationRole/SET_LANDINGPAGE';
  payload: ILandingPageList[]
}

export interface ISetNoOfAccessProfile{
  readonly type : '@@organizationRole/SET_NO_OF_ACCESSPROFILE_MODAL';
  payload : INoOfAccessProfileRequest
}

export interface ISetNoOfUsers{
  readonly type : '@@organizationRole/SET_NO_OF_USERS_MODAL';
  payload : INoOfUsersRequest
}

export interface IAccessProfileFetchDataAction {
  readonly type: '@@accessProfile/FETCH_DATA'
  payload: IListViewDataRequestPayload
}

export interface IAccessProfileFetchDataSuccessAction {
  readonly type: '@@accessProfile/FETCH_DATA_SUCCESS'
  payload: IAccessProfileDataPayload
}

export interface IAccessProfileSetData {
  readonly type: '@@accessProfile/SET_DATA'
  payload: {
      key: string,
      value: any
  }
}

export interface IUserCountFetchDataAction {
  readonly type: '@@userCount/FETCH_DATA'
  payload: IListViewDataRequestPayload
}

export interface IUserCountFetchDataSuccessAction {
  readonly type: '@@userCount/FETCH_DATA_SUCCESS'
  payload: IUserCountDataPayload
}

export interface IUserCountSetData {
  readonly type: '@@userCount/SET_DATA'
  payload: {
      key: string,
      value: any
  }
}
export type OrganizationRoleActions =
  | IsetLoading
  | IFetchStructureAction
  | IfetchStructureSuccessAction
  | IFetchDataAction
  | IFetchDataSuccessAction
  | ISetData
  | IResetState
  | ISetNoOfUsers
  | IUpdateData
  | ISetPersona
  | ISetLandingPage
  | ISetNoOfAccessProfile
  | IAccessProfileFetchDataAction
  | IAccessProfileFetchDataSuccessAction
  | IAccessProfileSetData
  | IUserCountFetchDataAction
  | IUserCountFetchDataSuccessAction
  | IUserCountSetData