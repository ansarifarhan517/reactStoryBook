import { IListViewRequestPayload } from "../../../../../utils/common.interface";
import { IMongoListViewStructure } from "../../../../../utils/mongo/interfaces";
import { IAdditionalWebhookRecord, IEventsObject, IOrganisationWebhookList, IOrganisationWebhookListDataPayload, IValidWebhookLink, IWebhookProfileFormData } from "./WebhookProfile.reducer";

export interface ISetEditMode {
    readonly type: '@@webhookProfile/SET_EDIT_MODE';
    payload: any;
}

export interface ISetLoading {
    readonly type: '@@webhookProfile/SET_LOADING';
    payload: boolean;
}

interface IListLoading {
    listView?: boolean,
    columns?: boolean
}

export interface ISetListLoading {
    readonly type: '@@webhookProfile/SET_LIST_LOADING';
    payload: IListLoading
}

export interface ISetWebhookLinks {
    readonly type: '@@webhookProfile/SET_WEBHOOKS_LINKS';
    payload: IValidWebhookLink[]
}

export interface IFetchEventsData {
    readonly type: '@@webhookProfile/FETCH_EVENTS_DATA';
}

export interface ISetEventsData {
    readonly type: '@@webhookProfile/SET_EVENTS_DATA';
    payload: Record<string, IEventsObject>
}

export interface ISetWebhookProfileFormData {
    type: '@@webhookProfile/SET_WEBHOOK_PROFILE_FORM_DATA';
    payload: {
        key: string,
        value: any
    }
}

export interface ISetStructureAction {
    readonly type: '@@webhookProfile/FETCH_STRUCTURE_SUCCESS';
    payload: IMongoListViewStructure;
}

export interface IFetchStructureAction {
    readonly type: '@@webhookProfile/FETCH_STRUCTURE';
}

export interface IFetchDataAction {
    readonly type: '@@webhookProfile/FETCH_DATA'
    payload?: IListViewRequestPayload
}

export interface IFetchDataSuccessAction {
    readonly type: '@@webhookProfile/FETCH_DATA_SUCCESS'
    payload: IOrganisationWebhookListDataPayload
}

export interface IUpdateData {
    readonly type: '@@webhookProfile/UPDATE_DATA';
    payload: IOrganisationWebhookList;
}

export interface ISetData {
    type: '@@webhookProfile/SET_DATA';
    payload: {
        key: string,
        value: any
    }
}

export interface IResetForm {
    type: '@@webhookProfile/INITIALISE_FORM'
}

export interface IGetWebhookDetails {
    type: '@@webhookProfile/GET_WEBHOOK_DETAILS_DATA',
    payload: string
}

export interface ISetWebhookDetails {
    type: '@@webhookProfile/SET_WEBHOOK_DETAILS_DATA',
    payload: any
}

export interface ISetAdditionalHeaders {
    type: '@@webhookProfile/SET_ADDITIONAL_HEADERS',
    payload: IAdditionalWebhookRecord[]
}

export interface ISetOauthDropDown {
    type: '@@webhookProfile/SET_OAUTH_TOKEN',
}

export interface IsetToken {
    type: "@@webhookProfile/FETCH_DATA_TOKEN_SUCCESS",
    payload : any
}
export interface IsetTokename {
    type: '@@Oauth/SET_ADDITIONAL_TOKEN',
    payload: any
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
    | IsetTokename
    | IsetToken
    | ISetOauthDropDown