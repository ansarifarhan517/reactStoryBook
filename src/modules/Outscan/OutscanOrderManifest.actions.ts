import { IClientMetricSystem } from "../../utils/common.interface";
import { IMongoFormStructure, IMongoListViewStructure } from "../../utils/mongo/interfaces";
import { IExceptionData, IManifestData, IManifestOfManifestsListviewDataPayload, IScannedOrderListviewDataPayload } from "./OutscanOrderManifest.models";

export interface ISetViewType {
    readonly type: '@@outscanOrderManifest/SET_VIEW_TYPE'
    payload: string
}

export interface IFetchAdmanifestFormStructureAction {
    readonly type: '@@outscanOrderManifest/FETCH_ADD_MANIFEST_FORM_STRUCTURE'
}

export interface IFetchAdmanifestFormStructureActionSuccess {
    readonly type: '@@outscanOrderManifest/FETCH_ADD_MANIFEST_FORM_STRUCTURE_SUCCESS'
    payload: IMongoFormStructure
}

export interface IFetchOrderOutscanListviewStructureAction {
    readonly type: '@@outscanOrderManifest/FETCH_ORDER_OUTSCAN_LISTVIEW_STRUCTURE'
}

export interface IFetchOrderOutscanListviewStructureActionSuccess {
    readonly type: '@@outscanOrderManifest/FETCH_ORDER_OUTSCAN_LISTVIEW_STRUCTURE_SUCCESS'
    payload: IMongoListViewStructure
}

export interface ISetOrderOutscanListviewLoading {
    readonly type: '@@outscanOrderManifest/SET_ORDER_OUTSCAN_LISTVIEW_LOADING'
    payload: boolean
}

export interface IFetchScannedOrderListAction {
    readonly type: '@@outscanOrderManifest/FETCH_SCANNED_ORDER_LIST'
}

export interface IFetchScannedOrderListActionSuccess {
    readonly type: '@@outscanOrderManifest/FETCH_SCANNED_ORDER_LIST_SUCCESS'
    payload: IScannedOrderListviewDataPayload
}

export interface IFetchManifestOfManifestcanListviewStructureAction {
    readonly type: '@@outscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LISTVIEW_STRUCTURE'
}

export interface IFetchManifestOfManifestcanListviewStructureActionSuccess {
    readonly type: '@@outscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LISTVIEW_STRUCTURE_SUCCESS'
    payload: IMongoListViewStructure
}
export interface ISetManifestOfManifestListviewLoading {
    readonly type: '@@outscanOrderManifest/SET_MANIFEST_OF_MANIFEST_LISTVIEW_LOADING'
    payload: boolean
}

export interface IFetchManifestOfManifestsListAction {
    readonly type: '@@outscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LIST'
}

export interface IFetchManifestOfManifestsActionSuccess {
    readonly type: '@@outscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LIST_SUCCESS'
    payload: IManifestOfManifestsListviewDataPayload
}

export interface ISetFormEditable {
    readonly type: '@@outscanOrderManifest/SET_FORM_EDITABLE'
    payload: boolean
}
export interface ISetFormLoading {
    readonly type: '@@outscanOrderManifest/SET_FORM_LOADING'
    payload: boolean
}

export interface IFetchManifestDataById {
    readonly type: '@@outscanOrderManifest/FETCH_MANIFEST_DATA_BY_ID'
    payload: number
}

export interface IFetchManifestDataByIdSuccess {
    readonly type: '@@outscanOrderManifest/FETCH_MANIFEST_DATA_BY_ID_SUCCESS'
    payload: IManifestData
}

export interface IResetManifestData {
    readonly type: '@@outscanOrderManifest/RESET_MANIFEST_DATA'
} 

export interface IFetchExceptionListviewStructure {
    readonly type: '@@outscanOrderManifest/FETCH_EXCEPTION_LISTVIEW_STRUCTURE'
}

export interface IFetchExceptionListviewStructureSuccess {
    readonly type: '@@outscanOrderManifest/FETCH_EXCEPTION_LISTVIEW_STRUCTURE_SUCCESS'
    payload: IMongoListViewStructure
}

export interface ISetExceptionListviewLoading {
    readonly type: '@@outscanOrderManifest/SET_EXCEPTION_LISTVIEW_LOADING'
    payload: boolean
}

export interface ISetExceptionListviewData {
    readonly type: '@@outscanOrderManifest/SET_EXCEPTION_LISTVIEW_DATA'
    payload: IExceptionData
}

export interface IGetMetricSystemAction {
    readonly type: '@@outscanOrderManifest/GET_CLIENT_METRIC_SYSTEM'
}

export interface ISetMetricSystemSAction {
    readonly type: '@@outscanOrderManifest/SET_CLIENT_METRIC_SYSTEM'
    payload: IClientMetricSystem[]
}
export interface ISetDispatchNumber {
    readonly type: '@@outscanOrderManifest/SET_DISPATCH_NUMBER'
    payload: number
}

export type OutscanOrderManifestActions = 
  | ISetViewType
  | IFetchAdmanifestFormStructureAction
  | IFetchAdmanifestFormStructureActionSuccess
  | IFetchOrderOutscanListviewStructureAction
  | IFetchOrderOutscanListviewStructureActionSuccess
  | ISetOrderOutscanListviewLoading
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
  | IGetMetricSystemAction
  | ISetMetricSystemSAction
  | ISetDispatchNumber