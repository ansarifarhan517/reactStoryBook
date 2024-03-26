import { IMongoListViewStructure } from "../../../../../utils/mongo/interfaces";
import { ILandingPageList, IPersonaList } from "../../OrganizationRole/Listview/OrganizationRole.models";
import { IAccessProfileDataPayload, IListViewDataRequestPayload, IOrganizationRoleDataPayload,IOrgRoleListViewDataRequestPayload } from "./AccessProfile.models"

export interface IsetLoading {
  readonly type: "@@accessProfile/SET_LOADING";
  payload: boolean;
}

export interface IFetchStructureAction {
  readonly type: "@@accessProfile/FETCH_STRUCTURE"
}

export interface IfetchStructureSuccessAction {
  readonly type: "@@accessProfile/FETCH_STRUCTURE_SUCCESS"
  payload: IMongoListViewStructure
}

export interface IFetchDataAction {
  readonly type: "@@accessProfile/FETCH_DATA"
  payload?: IListViewDataRequestPayload
}

export interface IFetchDataSuccessAction {
  readonly type: '@@accessProfile/FETCH_DATA_SUCCESS'
  payload: IAccessProfileDataPayload
}

export interface ISetData {
  readonly type: '@@accessProfile/SET_DATA'
  payload: {
    key: string,
    value: any
  }
}

export interface IOrgRoleFetchFetchDataAction {
  readonly type: '@@organizationRole/FETCH_DATA'
  payload: IOrgRoleListViewDataRequestPayload
}

export interface IOrgRoleFetchDataSuccessAction {
  readonly type: '@@organizationRole/FETCH_DATA_SUCCESS'
  payload: IOrganizationRoleDataPayload
}

export interface IOrgRoleFetchSetData {
  readonly type: '@@organizationRole/SET_DATA'
  payload: {
    key: string,
    value: any
  }
}

export interface ISetPersona {
  readonly type : '@@organizationRole/SET_PERSONA';
  payload: IPersonaList[]
}

export interface ISetLandingPage {
  readonly type : '@@organizationRole/SET_LANDINGPAGE';
  payload: ILandingPageList[]
}

export type AccessProfileActions =
  | IsetLoading
  | IFetchStructureAction
  | IfetchStructureSuccessAction
  | IFetchDataAction
  | IFetchDataSuccessAction
  | ISetData
  | IOrgRoleFetchFetchDataAction
  | IOrgRoleFetchDataSuccessAction
  | IOrgRoleFetchSetData
  | ISetPersona
  | ISetLandingPage