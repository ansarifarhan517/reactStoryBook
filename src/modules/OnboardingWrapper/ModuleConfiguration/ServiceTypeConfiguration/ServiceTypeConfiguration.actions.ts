import { IListViewRequestPayload } from "../../../../utils/common.interface";
import { IMongoFormStructure, IMongoListViewStructure } from "../../../../utils/mongo/interfaces";
import { IRowData, IDropdown, IAllServiceTypesDataPayload } from "../ServiceTypeConfiguration/ServiceTypeConfiguration.models";
import {IAutoAllocateValues, IBranchMovementValues} from "./ServiceTypeConfiguration.models"

export interface IAllServiceTypeListViewStructureAction {
    readonly type: '@@serviceTypeConfiguration/FETCH_ALL_SERVICETYPE_LISTVIEW_STRUCTURE'
}
export interface IAllServiceTypeListViewStructureActionSuccess {
    readonly type: '@@serviceTypeConfiguration/FETCH_ALL_SERVICETYPE_LISTVIEW_STRUCTURE_SUCCESS'
    payload: IMongoListViewStructure
}
export interface IFetchAllServiceTypeListAction {
    readonly type: '@@serviceTypeConfiguration/FETCH_ALL_SERVICETYPE_LIST'
    payload: IListViewRequestPayload
}
export interface IFetchAllServiceTypeListActionSuccess {
    readonly type: '@@serviceTypeConfiguration/FETCH_ALL_SERVICETYPE_LIST_SUCCESS'
    payload: IAllServiceTypesDataPayload
}
export interface IFetchInitialData {
    readonly type: '@@serviceTypeConfiguration/INITIAL_LOAD',
}
export interface IServiceDays {
    readonly type: '@@serviceTypeConfiguration/GET_SERVICE_DAYS',
    payload: IDropdown[]
}
export interface IDeliveryType {
    readonly type: '@@serviceTypeConfiguration/GET_DELIVERY_TYPE',
    payload: IDropdown[]
}
export interface IBranches {
    readonly type: '@@serviceTypeConfiguration/GET_BRANCHES',
    payload: IDropdown[]
}
export interface IFetchFormStructureAction {
  readonly type: '@@serviceTypeConfiguration/FETCH_FORM_STRUCTURE';
}
export interface IFetchFormStructureActionSuccess {
    readonly type: '@@serviceTypeConfiguration/FETCH_FORM_STRUCTURE_SUCCESS';
    payload: IMongoFormStructure;
  }
export interface ISetFormLoading {
    readonly type: '@@serviceTypeConfiguration/SET_FORM_LOADING'
    payload: boolean
}
export interface ISetViewType {
    readonly type: '@@serviceTypeConfiguration/SET_VIEW_TYPE'
    payload: string
}
export interface IFetchServiceTypeByIdAction {
    readonly type: '@@serviceTypeConfiguration/FETCH_SERVICETYPE_BY_ID'
    payload: string
}
  
export interface IFetchServiceTypeByIdActionSuccess {
    readonly type: '@@serviceTypeConfiguration/FETCH_SERVICETYPE_BY_ID_SUCCESS'
    payload: IRowData
}
export interface ISetFormEditable {
    readonly type: '@@serviceTypeConfiguration/SET_FORM_EDITABLE'
    payload: boolean
}
export interface IResetServiceTypeData {
    readonly type: '@@serviceTypeConfiguration/RESET_SERVICETYPE_DATA'
}
export interface IHandleAutoAllocateValues{
    readonly type: '@@serviceTypeConfiguration/SET_AUTO_ALLOCATE_VALUES'
    payload: IAutoAllocateValues
}

export interface IHandleBranchMovementValues{
    readonly type: '@@serviceTypeConfiguration/SET_BRANCH_MOVEMENT_VALUES'
    payload: IBranchMovementValues
}

export type ServiceTypeConfigurationActions = 
IAllServiceTypeListViewStructureAction |
IAllServiceTypeListViewStructureActionSuccess |
IFetchAllServiceTypeListAction |
IFetchAllServiceTypeListActionSuccess |
IFetchInitialData |
IServiceDays |
IDeliveryType |
IBranches |
IFetchFormStructureAction |
IFetchFormStructureActionSuccess |
ISetFormLoading |
ISetViewType |
IFetchServiceTypeByIdAction |
IFetchServiceTypeByIdActionSuccess |
ISetFormEditable |
IHandleAutoAllocateValues |
IHandleBranchMovementValues|
IResetServiceTypeData