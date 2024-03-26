import { IClientMetricSystem } from "../../../utils/common.interface";
import { IMongoFormStructure } from "../../../utils/mongo/interfaces";
import { IStructureParams } from "./BulkUpdate.models";

export interface IFetchStructure {
    readonly type: '@@MMO/BulkUpdate/FETCH_STRUCTURE'
    payload: IStructureParams
}

export interface ISetStructure {
    readonly type: '@@MMO/BulkUpdate/SET_STRUCTURE'
    payload: IMongoFormStructure
}

export interface ISetApiLoading {
    readonly type: '@@MMO/BulkUpdate/SET_API_LOADING'
    payload: boolean
}

export interface IGetClientMetric {
    readonly type: '@@MMO/BulkUpdate/GET_CLIENT_METRIC_SYSTEM'
}
export interface ISetClientMetric {
    readonly type: '@@MMO/BulkUpdate/SET_CLIENT_METRIC_SYSTEM';
    payload: IClientMetricSystem[]
}

export type tMMOBulkUpdateAction = 
| IFetchStructure
| ISetStructure
| ISetApiLoading
| IGetClientMetric
| ISetClientMetric