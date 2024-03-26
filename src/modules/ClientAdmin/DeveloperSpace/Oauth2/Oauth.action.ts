import { IListViewRequestPayload } from "../../../../utils/common.interface";
import { IMongoFormStructure, IMongoListViewStructure } from "../../../../utils/mongo/interfaces";


export interface ISetEditMode {
    readonly type: '@@OAUTH/SET_EDIT_MODE';
    payload: boolean;
}

export interface ISetStructureAction {
    readonly type: '@@OAUTH/FETCH_STRUCTURE_SUCCESS';
    payload: IMongoListViewStructure;
}

export interface IFetchStructureAction {
    readonly type: '@@OAUTH/FETCH_STRUCTURE';
}

export interface IFetchDataAction {
    readonly type: '@@OAUTH/FETCH_DATA'
    payload?: IListViewRequestPayload
}

export interface IfetchUpdateStructure {
    readonly type: "@@OAUTH/SET_UPDATED_FORM_STRUCTURE";
    payload: any;
}
export interface IFetchDataSuccessAction {
    readonly type: '@@OAUTH/FETCH_DATA_SUCCESS'
    payload: any
}

export interface ISetLoading {
    readonly type:'@@OAUTH/SET_LOADING'
    payload : any
}

export interface ISetListEmpty {
    readonly type:'@@OAUTH/IS_LIST_EMPTY'
    payload:any
}
export interface IFetchFormStructureAction {
    readonly type: "@@OAUTH/GET_FORM_STRUCTURE";
}

export interface ISetFormLoading {
    readonly type: "@@OAUTH/SET_FORM_LOADING";
    payload: boolean;
  }

export interface IFetchFormStructureActionSuccess {
    readonly type: "@@OAUTH/SET_FORM_STRUCTURE";
    payload: IMongoFormStructure;
}

export interface ISetFormEditable {
    readonly type:"@@OAUTH/SET_FORM_EDITABLE";
    payload: boolean
}
export interface IFetchUpdateData {
    readonly type:"@@OAUTH/GET_UPDATE_DATA";
    payload: any
}

export interface ISetUpdateData {
    readonly type:"@@OAUTH/SET_UPDATE_DATA";
    payload: any
}

export interface ISetFetchStructureSuccessFlag {
    readonly type: "@@OAUTH/SET_FORM_STRUCTURE_FLAG"
    payload: boolean
}


export interface IResetState {
    readonly type: '@@OAUTH/RESET_FORM_DATA'
}



export type OauthAction =
    | ISetEditMode
    | ISetStructureAction
    | IFetchStructureAction
    | IFetchDataAction
    | IFetchDataSuccessAction
    | ISetLoading
    | IFetchFormStructureAction
    | IFetchFormStructureActionSuccess
    | ISetFormLoading
    | ISetListEmpty
    | ISetFormEditable
    | IFetchUpdateData
    | ISetUpdateData
    | ISetFetchStructureSuccessFlag
    | IfetchUpdateStructure
    | IResetState

