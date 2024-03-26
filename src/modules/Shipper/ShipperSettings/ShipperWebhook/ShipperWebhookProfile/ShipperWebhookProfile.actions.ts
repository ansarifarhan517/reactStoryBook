import { IAdditionalWebhookRecord, IListViewRequestPayload } from "../../../../../utils/common.interface";
import { IMongoListViewStructure } from "../../../../../utils/mongo/interfaces";
import { IEventsObject, IGetWebhookDetailsParams, IOrganisationWebhookList, IOrganisationWebhookListDataPayload, IValidWebhookLink, IWebhookProfileFormData } from "./ShipperWebhookProfile.reducer";

export interface ISetEditMode {
    readonly type: '@@shipperWebhookProfile/SET_EDIT_MODE';
    payload: any;
}

export interface ISetLoading {
    readonly type: '@@shipperWebhookProfile/SET_LOADING';
    payload: boolean;
}

interface IListLoading {
    listView?: boolean,
    columns?: boolean
}

export interface ISetListLoading {
    readonly type: '@@shipperWebhookProfile/SET_LIST_LOADING';
    payload: IListLoading
}

export interface ISetWebhookLinks {
    readonly type: '@@shipperWebhookProfile/SET_WEBHOOKS_LINKS';
    payload: IValidWebhookLink[]
}

export interface IFetchEventsData {
    readonly type: '@@shipperWebhookProfile/FETCH_EVENTS_DATA';
    payload: string | number
}

export interface ISetEventsData {
    readonly type: '@@shipperWebhookProfile/SET_EVENTS_DATA';
    payload: Record<string, IEventsObject>
}

export interface ISetWebhookProfileFormData {
    type: '@@shipperWebhookProfile/SET_WEBHOOK_PROFILE_FORM_DATA';
    payload: {
        key: string,
        value: any
    }
}

export interface ISetStructureAction {
    readonly type: '@@shipperWebhookProfile/FETCH_STRUCTURE_SUCCESS';
    payload: IMongoListViewStructure;
}

export interface IFetchStructureAction {
    readonly type: '@@shipperWebhookProfile/FETCH_STRUCTURE';
}

export interface IFetchDataAction {
    readonly type: '@@shipperWebhookProfile/FETCH_DATA'
    payload?: IListViewRequestPayload
}

export interface IFetchDataSuccessAction {
    readonly type: '@@shipperWebhookProfile/FETCH_DATA_SUCCESS'
    payload: IOrganisationWebhookListDataPayload
}

export interface IUpdateData {
    readonly type: '@@shipperWebhookProfile/UPDATE_DATA';
    payload: IOrganisationWebhookList;
}

export interface ISetData {
    type: '@@shipperWebhookProfile/SET_DATA';
    payload: {
        key: string,
        value: any
    }
}

export interface IResetForm {
    type: '@@shipperWebhookProfile/INITIALISE_FORM'
}

export interface IGetWebhookDetails {
    type: '@@shipperWebhookProfile/GET_WEBHOOK_DETAILS_DATA',
    payload: IGetWebhookDetailsParams
}

export interface ISetWebhookDetails {
    type: '@@shipperWebhookProfile/SET_WEBHOOK_DETAILS_DATA',
    payload: IWebhookProfileFormData
}
export interface ISetAdditionalHeaders {
    type: '@@shipperWebhookProfile/SET_ADDITIONAL_HEADERS',
    payload: IAdditionalWebhookRecord[]
}

export type WebhookProfileActions =
    | ISetLoading
    | ISetEditMode
    | ISetWebhookLinks
    | IFetchEventsData
    | ISetEventsData
    | ISetWebhookProfileFormData
    | ISetStructureAction
    | IFetchStructureAction
    | IFetchDataAction
    | IFetchDataSuccessAction
    | IResetForm
    | IUpdateData
    | ISetListLoading
    | ISetData
    | IGetWebhookDetails
    | ISetWebhookDetails
    | ISetAdditionalHeaders