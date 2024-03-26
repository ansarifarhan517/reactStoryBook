
import { IListViewRequestPayload } from "../../../../utils/common.interface";
import { IMongoFormStructure, IMongoListViewStructure } from "../../../../utils/mongo/interfaces";
import { IconsentActDataPayload } from "./PdpaConfig.models";
export interface IPdpaListViewStructureAction {
    readonly type: '@@PROTECTIONCONFIG/GET_PDPA_LISTVIEW_STRUCTURE'
}

export interface ISetListLoading {
    readonly type: '@@PROTECTIONCONFIG/SET_LIST_LOADING'
    payload: boolean
}

export interface IPdpaViewStructureActionSuccess {
    readonly type: '@@PROTECTIONCONFIG/SET_PDPA_LISTVIEW_STRUCTURE_SUCCESS'
    payload: IMongoListViewStructure
}



export interface IPdpaDataAction {
    readonly type: '@@PROTECTIONCONFIG/GET_DATA_LISTVIEW'
    payload: IListViewRequestPayload
}


export interface IPdpaDataActionSucess {
    readonly type: '@@PROTECTIONCONFIG/GET_DATA_LISTVIEW_SUCCESS'
    payload: IconsentActDataPayload
  }

export interface IPdpaViewType {
    readonly type :'@@PROTECTIONCONFIG/SET_VIEW_TYPE'
    payload: {viewType : String}
}

export interface IPdpaFetchFormStructure {
    readonly type: "@@PROTECTIONCONFIG/GET_FETCH_FORM"
}

export interface IPdpaSetFormStructure {
    readonly type: "@@PROTECTIONCONFIG/SET_FETCH_FORM"
    payload: IMongoFormStructure
}

export interface IPdpaUpdateFormData {
    readonly type :"@@PROTECTIONCONFIG/FETCH_UPDATE_CONSENT_FORM"
    payload:number
}

export interface IPdpaSetUpdateFormData {
    readonly type :"@@PROTECTIONCONFIG/STORE_UPDATE_CONSENT_FORM"
    payload:any
}

export interface IConsentFormViewUpdate {
    readonly type :'@@PROTECTIONCONFIG/SET_CONSENT_FORM_VIEW_TYPE'
    payload: {viewType : String}
}

export interface IConsentSetPageType {
    readonly type: '@@PROTECTIONCONFIG/SET_PAGETYPE'
    payload: String
}

export type PdpaConfigActions =
    IPdpaListViewStructureAction |
    IPdpaViewStructureActionSuccess |
    IPdpaDataAction |
    ISetListLoading |
    IPdpaDataActionSucess|
    IPdpaViewType |
    IPdpaFetchFormStructure |
    IPdpaSetFormStructure |
    IPdpaUpdateFormData |
    IPdpaSetUpdateFormData |
    IConsentFormViewUpdate | 
    IConsentSetPageType