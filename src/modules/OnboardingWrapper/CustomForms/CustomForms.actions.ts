import { IAccountNames, ICustomFormData, ICustomFormsDataPayload, IDropDownOptions, IRowData, ITriggerEvents } from "./CustomForms.models";
import { IMongoListViewStructure, IMongoFormStructure } from "../../../utils/mongo/interfaces";
import { IListViewRequestPayload } from "../../../utils/common.interface";
import { ITriggerEventsStructure } from "./CustomForms.models";

export interface ISetStructureAction {
  readonly type: '@@customForms/FETCH_STRUCTURE_SUCCESS';
  payload: IMongoListViewStructure;
}
export interface IFetchStructureAction {
  readonly type: '@@customForms/FETCH_STRUCTURE';
}

export interface IFetchDataAction {
  readonly type: '@@customForms/FETCH_DATA'
  payload?: IListViewRequestPayload
}

export interface IFetchDataSuccessAction {
  readonly type: '@@customForms/FETCH_DATA_SUCCESS'
  payload: ICustomFormsDataPayload
}

interface IUpdateDataPayload extends Partial<IRowData> {
  customFormGroupId: number
}
export interface IUpdateData {
  readonly type: '@@customForms/UPDATE_DATA'
  payload: IUpdateDataPayload
}

export interface ISetEditDetails {
  readonly type: '@@customForms/SET_EDIT_DETAILS'
  payload: {
    rowId: string
    columnId: string
    value: any
    hasError?: boolean
  }
}

export interface IRemoveEditDetails {
  readonly type: '@@customForms/REMOVE_EDIT_DETAILS'
  payload: {
    rowId: string
    columnId: string
  }
}
export interface IClearEditDetails {
  readonly type: '@@customForms/CLEAR_EDIT_DETAILS'
}

export interface ISetLoading {
  readonly type: '@@customForms/SET_LOADING',
  payload: {
    listView: boolean
  }
}

export interface IDisableSaveButton {
  readonly type: '@@customForms/DISABLE_SAVE_BUTTON',
  payload: boolean
}

export interface ISetViewType {
  readonly type: '@@customForms/SET_VIEW_TYPE',
  payload: string
}

export interface IFetchFormStructureAction {
  readonly type: '@@customForms/FETCH_FORM_STRUCTURE'
}

export interface IFetchFormStructureActionSuccess {
  readonly type: '@@customForms/FETCH_FORM_STRUCTURE_SUCCESS'
  payload: IMongoFormStructure
}

export interface ISetTriggerEventsList {
  readonly type: '@@customForms/SET_TRIGGER_EVENTS_LIST'
  payload: ITriggerEventsStructure[]
}

export interface ISetFormLoading {
  readonly type: '@@customForms/SET_FORM_LOADING'
  payload: boolean;
}

export interface IFetchTriggerEventsByIdAction {
  readonly type: '@@customForms/FETCH_TRIGGER_EVENTS_BY_ID'
  payload: number;
}

export interface IFetchTriggerEventsByIdActionSuccess {
  readonly type: '@@customForms/FETCH_TRIGGER_EVENTS_BY_ID_SUCCESS'
  payload: ICustomFormData;
}

export interface ISetTriggerEventsData {
  readonly type: '@@customForms/SET_TRIGGER_EVENTS_DATA'
  payload: ITriggerEvents[]
}

export interface ISetFormEditable {
  readonly type: '@@customForms/SET_FORM_EDITABLE'
  payload: boolean
}

export interface IFetchOrderTypesAction {
  readonly type: '@@customForms/FETCH_ORDER_TYPES'
}

export interface IFetchOrderTypesActionSuccess {
  readonly type: '@@customForms/FETCH_ORDER_TYPES_SUCCESS'
  payload: IDropDownOptions[]
}

export interface IFetchOrderStatesAction {
  readonly type: '@@customForms/FETCH_ORDER_STATES'
}

export interface IFetchOrderStatesActionSuccess {
  readonly type: '@@customForms/FETCH_ORDER_STATES_SUCCESS'
  payload: IDropDownOptions[]
}

export interface IFetchOrderLocationsAction {
  readonly type: '@@customForms/FETCH_ORDER_LOCATIONS'
}

export interface IFetchOrderLocationsActionSuccess {
  readonly type: '@@customForms/FETCH_ORDER_LOCATIONS_SUCCESS'
  payload: IDropDownOptions[]
}

export interface IFetchTriggerElementsAction {
  readonly type: '@@customForms/FETCH_TRIGGER_ELEMENTS'
}

export interface IFetchTriggerElementsActionSuccess {
  readonly type: '@@customForms/FETCH_TRIGGER_ELEMENTS_SUCCESS'
  payload: IDropDownOptions[]
}

export interface IFetchServiceTypesAction {
  readonly type: '@@customForms/FETCH_SERVICE_TYPES'
}

export interface IFetchServiceTypesActionSuccess {
  readonly type: '@@customForms/FETCH_SERVICE_TYPES_SUCCESS'
  payload: IDropDownOptions[]
}

export interface IFetchDeliveryTypesAction {
  readonly type: '@@customForms/FETCH_DELIVERY_TYPES'
}

export interface IFetchDeliveryTypesActionSuccess {
  readonly type: '@@customForms/FETCH_DELIVERY_TYPES_SUCCESS'
  payload: IDropDownOptions[]
}

export interface IFetchAccountNamesAction {
  readonly type: '@@customForms/FETCH_ACCOUNT_NAMES'
}

export interface IFetchAccountNamesActionSuccess {
  readonly type: '@@customForms/FETCH_ACCOUNT_NAMES_SUCCESS'
  payload: IAccountNames[]
}


export type CustomFormsActions =
  | ISetStructureAction
  | IFetchStructureAction
  | IFetchDataAction
  | IFetchDataSuccessAction
  | IUpdateData
  | ISetEditDetails
  | IRemoveEditDetails
  | IClearEditDetails
  | ISetLoading
  | IDisableSaveButton
  | ISetViewType
  | IFetchFormStructureAction
  | IFetchFormStructureActionSuccess
  | ISetTriggerEventsList
  | ISetFormLoading
  | IFetchTriggerEventsByIdAction
  | IFetchTriggerEventsByIdActionSuccess
  | ISetFormEditable
  | ISetTriggerEventsData
  | IFetchOrderTypesAction
  | IFetchOrderTypesActionSuccess
  | IFetchOrderStatesAction
  | IFetchOrderStatesActionSuccess
  | IFetchOrderLocationsAction
  | IFetchOrderLocationsActionSuccess
  | IFetchTriggerElementsAction
  | IFetchTriggerElementsActionSuccess
  | IFetchServiceTypesAction
  | IFetchServiceTypesActionSuccess
  | IFetchDeliveryTypesAction
  | IFetchDeliveryTypesActionSuccess
  | IFetchAccountNamesAction
  | IFetchAccountNamesActionSuccess