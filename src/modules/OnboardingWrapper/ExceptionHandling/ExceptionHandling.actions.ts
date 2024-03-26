import { IListViewRequestPayload } from "../../../utils/common.interface";
import { IMongoFormStructure, IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import { IAllExceptionsDataPayload, IDropDownOption, IExceptionData, IExceptionEvents, IManifestsExceptionsListData, IOrderExceptionsListData, tBreadcrumbState, ViewTypes } from "./ExceptionHandling.models";

export interface IFetchFormStructureActionSuccess {
    readonly type: '@@exceptionHandling/FETCH_FORM_STRUCTURE_SUCCESS';
    payload: IMongoFormStructure;
  }
export interface IFetchFormStructureAction {
  readonly type: '@@exceptionHandling/FETCH_FORM_STRUCTURE';
}

export interface ISetViewType {
  readonly type: '@@exceptionHandling/SET_VIEW_TYPE'
  payload: ViewTypes
}

export interface IFetchExceptionsEventsAction {
  readonly type:'@@exceptionHandling/FETCH_EXCEPTION_EVENTS'
}

export interface IFetchExceptionsEventsActionSuccess {
  readonly type:'@@exceptionHandling/FETCH_EXCEPTION_EVENTS_SUCCESS';
  payload: IExceptionEvents[]
}

export interface IAllExceptionsListViewStructureAction {
  readonly type: '@@exceptionHandling/FETCH_ALL_EXCEPTIONS_LISTVIEW_STRUCTURE'
}

export interface IAllExceptionsListViewStructureActionSuccess {
  readonly type: '@@exceptionHandling/FETCH_ALL_EXCEPTIONS_LISTVIEW_STRUCTURE_SUCCESS'
  payload: IMongoListViewStructure
}

export interface IFetchAllExceptionListAction {
  readonly type: '@@exceptionHandling/FETCH_ALL_EXCEPTIONS_LIST'
  payload: IListViewRequestPayload  //xxx
}

export interface IFetchAllExceptionListActionSuccess {
  readonly type: '@@exceptionHandling/FETCH_ALL_EXCEPTIONS_LIST_SUCCESS'
  payload: IAllExceptionsDataPayload
}

export interface IFetchExceptionStageListAction {
  readonly type: '@@exceptionHandling/FETCH_EXCEPTION_STAGE_LIST'
}

export interface IFetchExceptionStageListActionSuccess {
  readonly type: '@@exceptionHandling/FETCH_EXCEPTION_STAGE_LIST_SUCCESS'
  payload: IDropDownOption[]
}

export interface IFetchExceptionTypeListAction {
  readonly type: '@@exceptionHandling/FETCH_EXCEPTION_TYPE_LIST'
}
export interface IFetchExceptionTypeListActionSuccess {
  readonly type: '@@exceptionHandling/FETCH_EXCEPTION_TYPE_LIST_SUCCESS'
  payload: IDropDownOption[]
}

export interface IFetchExceptionAppliesToListAction {
  readonly type: '@@exceptionHandling/FETCH_EXCEPTION_APPLIES_TO'
}
export interface IFetchExceptionAppliesToListActionSuccess {
  readonly type: '@@exceptionHandling/FETCH_EXCEPTION_APPLIES_TO_SUCCESS'
  payload: IDropDownOption[]
}

export interface IFetchExceptionByIdAction {
  readonly type: '@@exceptionHandling/FETCH_EXCEPTION_BY_ID'
  payload: string
}

export interface IFetchExceptionByIdActionSuccess {
  readonly type: '@@exceptionHandling/FETCH_EXCEPTION_BY_ID_SUCCESS'
  payload: IExceptionData
}
export interface IResetExceptionData {
  readonly type: '@@exceptionHandling/RESET_EXCEPTION_DATA'
}
export interface ISetFormEditable {
  readonly type: '@@exceptionHandling/SET_FORM_EDITABLE'
  payload: boolean
}

export interface ISetFormLoading {
  readonly type: '@@exceptionHandling/SET_FORM_LOADING'
  payload: boolean
}

export interface IFetchOrderExceptionsListviewStructureAction {
  readonly type: '@@exceptionHandling/FETCH_ORDER_EXCEPTIONS_LISTVIEW_STRUCTURE'
}
export interface IFetchOrderExceptionsListviewStructureActionSuccess {
  readonly type: '@@exceptionHandling/FETCH_ORDER_EXCEPTIONS_LISTVIEW_STRUCTURE_SUCCESS'
  payload: IMongoListViewStructure
}

export interface IFetchManifestExceptionsListviewStructureAction {
  readonly type: '@@exceptionHandling/FETCH_MANIFEST_EXCEPTIONS_LISTVIEW_STRUCTURE'
}
export interface IFetchManifestExceptionsListviewStructureActionSuccess {
  readonly type: '@@exceptionHandling/FETCH_MANIFEST_EXCEPTIONS_LISTVIEW_STRUCTURE_SUCCESS'
  payload: IMongoListViewStructure
}

export interface ISetBreadcrumbState {
  readonly type: '@@exceptionHandling/SET_BREADCRUMB_STATE'
  payload: tBreadcrumbState
}

export interface IFetchOrdersExceptionListAction {
  readonly type: '@@exceptionHandling/FETCH_ORDER_EXCEPTIONS_LIST'
  payload: IListViewRequestPayload
}

export interface IFetchOrdersExceptionListActionSuccess {
  readonly type: '@@exceptionHandling/FETCH_ORDER_EXCEPTIONS_LIST_SUCCESS'
  payload: IOrderExceptionsListData
}

export interface IFetchManifestsExceptionListAction {
  readonly type: '@@exceptionHandling/FETCH_MANIFEST_EXCEPTIONS_LIST'
  payload: IListViewRequestPayload
}

export interface IFetchManifestsExceptionListActionSuccess {
  readonly type: '@@exceptionHandling/FETCH_MANIFEST_EXCEPTIONS_LIST_SUCCESS'
  payload: IManifestsExceptionsListData
}

export interface IFetchExceptionsStatusAction {
  readonly type: '@@exceptionHandling/FETCH_EXCEPTION_STATUS'
}

export interface IFetchExceptionsStatusActionSuccess {
  readonly type: '@@exceptionHandling/FETCH_EXCEPTION_STATUS_SUCCESS'
  payload: IDropDownOption[]
}
export interface IFetchOrderStatusAction {
  readonly type: '@@exceptionHandling/FETCH_ORDER_STATUS'
}
export interface IFetchOrderStatusActionSuccess {
  readonly type: '@@exceptionHandling/FETCH_ORDER_STATUS_SUCCESS'
  payload: IDropDownOption[]
}

export interface IResetFormStructure {
  readonly type: '@@exceptionHandling/RESET_FORM_STRUCTURE'
}
export type ExceptionHandlingActions = 
IFetchFormStructureAction |
IFetchFormStructureActionSuccess |
ISetViewType | 
IFetchExceptionsEventsAction |
IFetchExceptionsEventsActionSuccess |
IAllExceptionsListViewStructureAction |
IAllExceptionsListViewStructureActionSuccess |
IFetchAllExceptionListAction | 
IFetchAllExceptionListActionSuccess |
IFetchExceptionStageListAction |
IFetchExceptionStageListActionSuccess |
IFetchExceptionTypeListAction |
IFetchExceptionTypeListActionSuccess |
IFetchExceptionAppliesToListAction |
IFetchExceptionAppliesToListActionSuccess |
IFetchExceptionByIdAction |
IFetchExceptionByIdActionSuccess |
IResetExceptionData |
ISetFormEditable |
ISetFormLoading |
IFetchOrderExceptionsListviewStructureAction |
IFetchOrderExceptionsListviewStructureActionSuccess |
IFetchManifestExceptionsListviewStructureAction |
IFetchManifestExceptionsListviewStructureActionSuccess |
ISetBreadcrumbState |
IFetchOrdersExceptionListAction |
IFetchOrdersExceptionListActionSuccess |
IFetchManifestsExceptionListAction |
IFetchManifestsExceptionListActionSuccess |
IFetchExceptionsStatusAction | 
IFetchExceptionsStatusActionSuccess |
IFetchOrderStatusAction | 
IFetchOrderStatusActionSuccess |
IResetFormStructure;