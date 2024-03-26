import { IAdditionalWebhookRecord, IListViewRequestPayload } from "../../../../../utils/common.interface";
import { IMongoListViewStructure } from "../../../../../utils/mongo/interfaces";
import { IBranchWebhookList, IBranchWebhookListDataPayload, IBranchWebhookProfileFormData } from "./BranchWebhookProfile.reducer";
import { IEventsObject, IValidBranchWebhookLink } from "./BranchWebhookProfile.reducer";

export interface ISetEditMode {
    readonly type: '@@branchWebhookProfile/SET_EDIT_MODE';
    payload: any;
}

export interface ISetBranchWebhookLinks {
    readonly type: '@@branchWebhookProfile/SET_WEBHOOKS_LINKS';
    payload: IValidBranchWebhookLink[]
}

export interface IFetchEventsData {
    readonly type: '@@branchWebhookProfile/FETCH_EVENTS_DATA';
}

export interface ISetEventsData {
    readonly type: '@@branchWebhookProfile/SET_EVENTS_DATA';
    payload: Record<string, IEventsObject>
}

export interface ISetBranchWebhookProfileFormData {
    type: '@@branchWebhookProfile/SET_WEBHOOK_PROFILE_FORM_DATA';
    payload: {
        key: string,
        value: any
    }
}

export interface ISetLoading {
    readonly type: '@@branchWebhookProfile/SET_LOADING';
    payload: boolean;
}

interface IListLoading {
    listView?: boolean,
    columns?: boolean
}

export interface ISetListLoading {
    readonly type: '@@branchWebhookProfile/SET_LIST_LOADING';
    payload: IListLoading
}

export interface ISetStructureAction {
    readonly type: '@@branchWebhookProfile/FETCH_STRUCTURE_SUCCESS';
    payload: IMongoListViewStructure;
}

export interface IFetchStructureAction {
    readonly type: '@@branchWebhookProfile/FETCH_STRUCTURE';
}

export interface IFetchDataAction {
    readonly type: '@@branchWebhookProfile/FETCH_DATA'
    payload?: IListViewRequestPayload
}

export interface IFetchDataSuccessAction {
    readonly type: '@@branchWebhookProfile/FETCH_DATA_SUCCESS'
    payload: IBranchWebhookListDataPayload
}

export interface IUpdateData {
    readonly type: '@@branchWebhookProfile/UPDATE_DATA';
    payload: IBranchWebhookList;
}

export interface ISetData {
    type: '@@branchWebhookProfile/SET_DATA';
    payload: {
        key: string,
        value: any
    }
}

export interface IResetForm {
    type: '@@branchWebhookProfile/INITIALISE_FORM'
}

export interface IGetWebhookDetails {
    type: '@@branchWebhookProfile/GET_WEBHOOK_DETAILS_DATA',
    payload: string
}

export interface ISetWebhookDetails {
    type: '@@branchWebhookProfile/SET_WEBHOOK_DETAILS_DATA',
    payload: IBranchWebhookProfileFormData
}

export interface ISetAdditionalHeaders {
    type: '@@branchWebhookProfile/SET_ADDITIONAL_HEADERS',
    payload: IAdditionalWebhookRecord[]
}

export type BranchWebhookProfileActions =
    | ISetEditMode
    | ISetBranchWebhookLinks
    | IFetchEventsData
    | ISetEventsData
    | ISetBranchWebhookProfileFormData
    | ISetLoading
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
