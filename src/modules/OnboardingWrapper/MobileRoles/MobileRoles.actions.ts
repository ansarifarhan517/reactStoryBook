import { IListViewRequestPayload } from "../../../utils/common.interface";
import { IMongoFormStructure, IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import { IAccessProfileList, IMobileOrgRole, IMobileRoleByOrgRoleIdRequestPayload, IMobileRoleListDataPayload } from './MobileRoles.models';

export interface IFetchListViewStructureAction {
    readonly type: '@@mobileRoles/FETCH_LISTVIEW_STRUCTURE';
}

export interface IFetchListViewStructureActionSuccess {
    readonly type: '@@mobileRoles/FETCH_LISTVIEW_STRUCTURE_SUCCESS';
    payload: IMongoListViewStructure;
}

export interface IFetchMobileRoleListAction {
    readonly type: '@@mobileRoles/FETCH_MOBILE_ROLE_LIST';
    payload?: IListViewRequestPayload
}

export interface IFetchMobileRoleListActionSuccess {
    readonly type: '@@mobileRoles/FETCH_MOBILE_ROLE_LIST_SUCCESS';
    payload: IMobileRoleListDataPayload
}

export interface IFetchMobileRoleFormStructureAction {
    readonly type: '@@mobileRoles/FETCH_MOBILE_ROLE_FORM_STRUCTURE';
}

export interface IFetchMobileRoleFormStructureActionSuccess {
    readonly type: '@@mobileRoles/FETCH_MOBILE_ROLE_FORM_STRUCTURE_SUCCESS';
    payload: IMongoFormStructure
}

export interface ISetViewType {
    readonly type: '@@mobileRoles/SET_VIEW_TYPE';
    payload: string;
}

export interface IGetMobileRoleByIdAction {
    readonly type: "@@mobileRoles/GET_MOBILE_ROLE_BY_ID";
    payload: number
}

export interface IGetMobileRoleByIdActionSuccess {
    readonly type: "@@mobileRoles/GET_MOBILE_ROLE_BY_ID_SUCCESS";
    payload: IMobileOrgRole

}

export interface ISetEditMode {
    readonly type: "@@mobileRoles/SET_EDIT_MODE";
    payload: boolean;
}

export interface IResetMobileRoleData {
    readonly type: "@@mobileRoles/RESET_MOBILE_ROLE_DATA"
}

export interface IFetchAccessProfilesAction {
    readonly type: "@@mobileRoles/FETCH_ACCESS_PROFILES"
}

export interface IFetchAccessProfilesActionSuccess {
    readonly type: "@@mobileRoles/FETCH_ACCESS_PROFILES_SUCCESS"
    payload: IAccessProfileList[]

}

export interface IsetOrgRoleId {
    readonly type: '@@mobileRoles/SET_ORG_ROLE_ID';
    payload: number;
}


export interface IFetchMobileUsersListViewStructureAction {
    readonly type: '@@mobileRoles/FETCH_MOBILE_USERS_LISTVIEW_STRUCTURE';
}
export interface IFetchMobileUsersListViewStructureActionSuccess {
    readonly type: '@@mobileRoles/FETCH_MOBILE_USERS_LISTVIEW_STRUCTURE_SUCCESS';
    payload: IMongoListViewStructure;
}
export interface IFetchMobileRolesByOrgRoleID {
    readonly type: '@@mobileRoles/FETCH_MOBILE_ROLES_BY_ORG_ROLE_ID';
    payload?:  IMobileRoleByOrgRoleIdRequestPayload

}

export interface IFetchMobileRolesByOrgRoleIDSuccess {
    readonly type: '@@mobileRoles/FETCH_MOBILE_ROLES_BY_ORG_ROLE_ID_SUCCESS';
    payload: IMobileRoleListDataPayload;
}
export interface IFetchMobileRolesByOrgRoleID extends IListViewRequestPayload {
    orgRoleId?: number
  }

export type IMobileRolesActions = 
IFetchListViewStructureAction |
IFetchListViewStructureActionSuccess | 
IFetchMobileRoleListAction |
IFetchMobileRoleListActionSuccess |
IFetchMobileRoleFormStructureAction |
IFetchMobileRoleFormStructureActionSuccess |
ISetViewType |
IGetMobileRoleByIdAction |
IGetMobileRoleByIdActionSuccess |
ISetEditMode |
IResetMobileRoleData |
IFetchAccessProfilesAction | 
IFetchAccessProfilesActionSuccess |
IsetOrgRoleId |
IFetchMobileUsersListViewStructureAction |
IFetchMobileRolesByOrgRoleID |
IFetchMobileUsersListViewStructureActionSuccess |
IFetchMobileRolesByOrgRoleIDSuccess