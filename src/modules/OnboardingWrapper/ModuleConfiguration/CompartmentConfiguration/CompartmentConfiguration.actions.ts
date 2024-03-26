import { IListViewRequestPayload } from "../../../../utils/common.interface";
import { IMongoFormStructure, IMongoListViewStructure } from "../../../../utils/mongo/interfaces";
import { IRowData, IDropdown, IAllCompartmentDataPayload , IClientMetricSystem} from "../CompartmentConfiguration/CompartmentConfiguration.models";

export interface IAllCompartmentListViewStructureAction {
    readonly type: '@@compartmentConfiguration/FETCH_ALL_COMPARTMENT_LISTVIEW_STRUCTURE'
}
export interface ICompartmentListViewStructureActionSuccess {
    readonly type: '@@compartmentConfiguration/FETCH_ALL_COMPARTMENT_LISTVIEW_STRUCTURE_SUCCESS'
    payload: IMongoListViewStructure
}
export interface IFetchAllCompartmentListAction {
    readonly type: '@@compartmentConfiguration/FETCH_ALL_COMPARTMENT_LIST'
    payload: IListViewRequestPayload
}
export interface IFetchAllCompartmentListActionSuccess {
    readonly type: '@@compartmentConfiguration/FETCH_ALL_COMPARTMENT_LIST_SUCCESS'
    payload: IAllCompartmentDataPayload
}
export interface ISetEmptyData {
    readonly type: '@@compartmentConfiguration/SET_EMPTY_DATA'
    payload: boolean
}
export interface ISetViewType {
    readonly type: '@@compartmentConfiguration/SET_VIEW_TYPE'
    payload: string
}
export interface IFetchFormStructureAction {
  readonly type: '@@compartmentConfiguration/FETCH_FORM_STRUCTURE';
}
export interface IFetchFormStructureActionSuccess {
    readonly type: '@@compartmentConfiguration/FETCH_FORM_STRUCTURE_SUCCESS';
    payload: IMongoFormStructure;
}
export interface ISetFormLoading {
    readonly type: '@@compartmentConfiguration/SET_FORM_LOADING'
    payload: boolean
}
export interface IFetchClientMetric {
    readonly type: '@@compartmentConfiguration/FETCH_CLIENT_METRIC_SYSTEM';
}
export interface ISetClientMetric {
    readonly type: '@@compartmentConfiguration/SET_CLIENT_METRIC_SYSTEM';
    payload: IClientMetricSystem[]
}
export interface IFetchCrates {
    readonly type: '@@compartmentConfiguration/FETCH_CRATES';
}
export interface ISetCrates {
    readonly type: '@@compartmentConfiguration/SET_CRATES_DATA',
    payload: IDropdown[]
}
export interface IFetchCompartmentByIdAction {
    readonly type: '@@compartmentConfiguration/FETCH_COMPARTMENT_BY_ID'
    payload: string
}
  
export interface IFetchCompartmentByIdActionSuccess {
    readonly type: '@@compartmentConfiguration/FETCH_COMPARTMENT_BY_ID_SUCCESS'
    payload: IRowData
}
export interface ISetFormEditable {
    readonly type: '@@compartmentConfiguration/SET_FORM_EDITABLE'
    payload: boolean
}
export interface IResetCompartmentData {
    readonly type: '@@compartmentConfiguration/RESET_COMPARTMENT_DATA'
}
export interface IFetchCompartmentDataAction {
    readonly type: '@@compartmentConfiguration/FETCH_COMPARTMENT_DATA'
    payload?: any
}

export interface IFetchCompartmentDataSuccessAction {
    readonly type: '@@compartmentConfiguration/FETCH_COMPARTMENT_DATA_SUCCESS'
    payload: IAllCompartmentDataPayload
}
export type CompartmentConfigurationActions = 
IAllCompartmentListViewStructureAction |
ICompartmentListViewStructureActionSuccess |
IFetchAllCompartmentListAction |
IFetchAllCompartmentListActionSuccess |
ISetEmptyData |
IFetchCrates |
ISetCrates |
IFetchFormStructureAction |
IFetchFormStructureActionSuccess |
ISetFormLoading |
ISetViewType |
IFetchClientMetric |
ISetClientMetric |
IFetchCompartmentByIdAction |
IFetchCompartmentByIdActionSuccess |
ISetFormEditable |
IResetCompartmentData |
IFetchCompartmentDataAction |
IFetchCompartmentDataSuccessAction