import { IMongoFormStructure, IMongoListViewStructure } from "../../utils/mongo/interfaces";
import { IManifestData, IManifestOfManifestsListviewDataPayload, IScannedOrderListviewDataPayload, IExceptionData } from "./InscanOrderManifest.models";

export interface ISetViewType {
    readonly type: '@@inscanOrderManifest/SET_VIEW_TYPE'
    payload: string
}

export interface IFetchAdmanifestFormStructureAction {
    readonly type: '@@inscanOrderManifest/FETCH_ADD_MANIFEST_FORM_STRUCTURE'
}

export interface IFetchAdmanifestFormStructureActionSuccess {
    readonly type: '@@inscanOrderManifest/FETCH_ADD_MANIFEST_FORM_STRUCTURE_SUCCESS'
    payload: IMongoFormStructure
}

export interface IFetchOrderInscanListviewStructureAction {
    readonly type: '@@inscanOrderManifest/FETCH_ORDER_INSCAN_LISTVIEW_STRUCTURE'
}

export interface IFetchOrderInscanListviewStructureActionSuccess {
    readonly type: '@@inscanOrderManifest/FETCH_ORDER_INSCAN_LISTVIEW_STRUCTURE_SUCCESS'
    payload: IMongoListViewStructure
}

export interface ISetOrderInscanListviewLoading {
    readonly type: '@@inscanOrderManifest/SET_ORDER_INSCAN_LISTVIEW_LOADING'
    payload: boolean
}

export interface IFetchScannedOrderListAction {
    readonly type: '@@inscanOrderManifest/FETCH_SCANNED_ORDER_LIST'
}

export interface IFetchScannedOrderListActionSuccess {
    readonly type: '@@inscanOrderManifest/FETCH_SCANNED_ORDER_LIST_SUCCESS'
    payload: IScannedOrderListviewDataPayload
}

export interface IFetchManifestOfManifestcanListviewStructureAction {
    readonly type: '@@inscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LISTVIEW_STRUCTURE'
}

export interface IFetchManifestOfManifestcanListviewStructureActionSuccess {
    readonly type: '@@inscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LISTVIEW_STRUCTURE_SUCCESS'
    payload: IMongoListViewStructure
}
export interface ISetManifestOfManifestListviewLoading {
    readonly type: '@@inscanOrderManifest/SET_MANIFEST_OF_MANIFEST_LISTVIEW_LOADING'
    payload: boolean
}

export interface IFetchManifestOfManifestsListAction {
    readonly type: '@@inscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LIST'
}

export interface IFetchManifestOfManifestsActionSuccess {
    readonly type: '@@inscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LIST_SUCCESS'
    payload: IManifestOfManifestsListviewDataPayload
}

export interface ISetFormEditable {
    readonly type: '@@inscanOrderManifest/SET_FORM_EDITABLE'
    payload: boolean
}
export interface ISetFormLoading {
    readonly type: '@@inscanOrderManifest/SET_FORM_LOADING'
    payload: boolean
}

export interface IFetchManifestDataById {
    readonly type: '@@inscanOrderManifest/FETCH_MANIFEST_DATA_BY_ID'
    payload: number
}

export interface IFetchManifestDataByIdSuccess {
    readonly type: '@@inscanOrderManifest/FETCH_MANIFEST_DATA_BY_ID_SUCCESS'
    payload: IManifestData
}

export interface IResetManifestData {
    readonly type: '@@inscanOrderManifest/RESET_MANIFEST_DATA'
} 

export interface IFetchExceptionListviewStructure {
    readonly type: '@@inscanOrderManifest/FETCH_EXCEPTION_LISTVIEW_STRUCTURE'
}

export interface IFetchExceptionListviewStructureSuccess {
    readonly type: '@@inscanOrderManifest/FETCH_EXCEPTION_LISTVIEW_STRUCTURE_SUCCESS'
    payload: IMongoListViewStructure
}

export interface ISetExceptionListviewLoading {
    readonly type: '@@inscanOrderManifest/SET_EXCEPTION_LISTVIEW_LOADING'
    payload: boolean
}

export interface ISetExceptionListviewData {
    readonly type: '@@inscanOrderManifest/SET_EXCEPTION_LISTVIEW_DATA'
    payload: IExceptionData
}

export interface ISetSearchText {
    readonly type: '@@inscanOrderManifest/SET_SEARCH_TEXT'
    payload: string
}

export type InscanOrderManifestActions = 
  | ISetViewType
  | IFetchAdmanifestFormStructureAction
  | IFetchAdmanifestFormStructureActionSuccess
  | IFetchOrderInscanListviewStructureAction
  | IFetchOrderInscanListviewStructureActionSuccess
  | ISetOrderInscanListviewLoading
  | IFetchScannedOrderListAction
  | IFetchScannedOrderListActionSuccess
  | IFetchManifestOfManifestcanListviewStructureAction
  | IFetchManifestOfManifestcanListviewStructureActionSuccess
  | ISetManifestOfManifestListviewLoading
  | IFetchManifestOfManifestsListAction
  | IFetchManifestOfManifestsActionSuccess
  | IFetchManifestOfManifestsListAction
  | IFetchManifestOfManifestsActionSuccess
  | ISetFormEditable
  | IFetchManifestDataById
  | ISetFormLoading
  | IFetchManifestDataByIdSuccess
  | IResetManifestData
  | IFetchExceptionListviewStructure
  | IFetchExceptionListviewStructureSuccess
  | ISetExceptionListviewLoading
  | ISetExceptionListviewData
  | ISetSearchText