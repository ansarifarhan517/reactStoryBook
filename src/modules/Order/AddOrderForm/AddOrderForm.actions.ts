import { IMongoFormStructure } from "../../../utils/mongo/interfaces";
import { ICrateData, IDropdownOptionProps, IOrderData, ISetExpandedProps, ISubClients, ITimezoneOptions } from "./AddOrderForm.models";
import { IClientProperty } from './../../common/ClientProperties/interfaces'
import { IClientMetricSystem } from "../../../utils/common.interface"

export interface IAddOrderFormFetchStructure {
    readonly type: '@@addOrderForm/FETCH_STRUCTURE'
}
  
export interface IAddOrderSetStructure {
    readonly type: '@@addOrderForm/SET_STRUCTURE'
    payload: IMongoFormStructure
}

export interface IOptimizePackingFlagFetchData {
    readonly type: '@@addOrderForm/FETCH_OPTIMIZE_FLAG'
}

export interface IOptimizePackingFlagSetData {
    readonly type: '@@addOrderForm/SET_OPTIMIZE_FLAG'
    payload: IClientProperty
}

export interface ICrateTypeFetchData {
    readonly type: '@@addOrderForm/FETCH_CRATE_TYPE'
}

export interface ICrateTypeSetData {
    readonly type: '@@addOrderForm/SET_CRATE_TYPE'
    payload: IClientProperty
}

export interface ICustomerProfilingPickupFetchData {
    readonly type: '@@addOrderForm/FETCH_CUSTOMER_PROFILING_PICKUP'
}

export interface ICustomerProfilingPickupSetData {
    readonly type: '@@addOrderForm/SET_CUSTOMER_PROFILING_PICKUP'
    payload: IClientProperty
}

export interface ICustomerProfilingDeliverFetchData {
    readonly type: '@@addOrderForm/FETCH_CUSTOMER_PROFILING_DELIVER'
}

export interface ICustomerProfilingDeliverSetData {
    readonly type: '@@addOrderForm/SET_CUSTOMER_PROFILING_DELIVER'
    payload: IClientProperty
}
export interface IAddOrderFormSetLoading {
    readonly type: '@@addOrderForm/SET_LOADING'
    payload: boolean
}

export interface ISetStructureData {
    readonly type: '@@addOrderForm/SET_STRUCTURE_DATA',
    payload: IMongoFormStructure
}

export interface ISetGoogleAPIKey {
    readonly type: '@@addOrderForm/GOOGLE_API_KEY'
}
export interface ISetGoogleAPIKeySuccess {
    readonly type: '@@addOrderForm/GOOGLE_API_KEY_SUCCESS',
    payload: string
}


export interface IFetchOrderNumberAction {
    readonly type: '@@addOrderForm/FETCH_ORDER_NUMBER'
}


export interface IFetchOrderNumberSuccessAction {
    readonly type: '@@addOrderForm/FETCH_ORDER_NUMBER_SUCCESS',
    payload: string
}

export interface ISetCrateData {
    readonly type: '@@addOrderForm/SET_CRATE_DATA',
    payload: Array<ICrateData>
}

export interface ISetDynamicLabels {
    readonly type: '@@addOrderForm/SET_DYNAMIC_LABELS',
    payload: Record<string, string>
}

export interface ISetCratePattern {
    readonly type: '@@addOrderForm/SET_CRATE_PATTERN',
    payload: string
}
export interface ISetExpanded {
    readonly type: '@@addOrderForm/SET_EXPANDED',
    payload: ISetExpandedProps
}
export interface ISetCount {
    readonly type: '@@addOrderForm/SET_COUNT',
    payload: number
}

export interface IFetchLocale{
    readonly type: '@@addOrderForm/FETCH_LOCALE'
}

export interface ISetLocale {
    readonly type: '@@addOrderForm/SET_LOCALE'
    payload: IDropdownOptionProps[]
}

export interface ISetFormType {
    readonly type: '@@addOrderForm/SET_FORM_TYPE',
    payload: string
}

export interface IResetFormData {
    readonly type: "@@addOrderForm/SET_FORM_RESET_DATA"
    payload: IOrderData
}
export interface IAddOrderApiLoading {
    readonly type: '@@addOrderForm/SET_API_LOADING'
    payload: boolean
}

export interface IResetForm {
    readonly type: '@@addOrderForm/RESET_FORM'
}
export interface IGetClientMetric {
    readonly type: '@@addOrderForm/GET_CLIENT_METRIC_SYSTEM'
}
export interface IClientMetric {
    readonly type: '@@addOrderForm/SET_CLIENT_METRIC_SYSTEM';
    payload: IClientMetricSystem[]
  }
export interface IFetchSubClients{
    readonly type: '@@addOrderForm/FETCH_SUBCLIENTS'
}
export interface ISetSubClients {
    readonly type: '@@addOrderForm/SET_SUBCLIENTS'
    payload: ISubClients[]
}
export interface IFetchTimezoneList{
    readonly type: '@@addOrderForm/FETCH_TIMEZONELIST'
}

export interface ISetTimezoneList {
    readonly type: '@@addOrderForm/SET_TIMEZONELIST'
    payload: ITimezoneOptions[]
}

export interface ISetOrderCloned {
    readonly type: '@@addOrderForm/SET_ORDER_CLONED'
    payload: boolean
}

export interface IIsMapLoadingFirstTime {
    readonly type: '@@addOrderForm/SET_IS_MAP_LOADING_FIRST_TIME'
    payload: boolean
}
export interface ISelectedCustomerId {
    readonly type: '@@addOrderForm/SET_SELECTED_CUSTOMER_ID',
    payload: string
}
export type IAddOrderFormActions = 
    | IAddOrderFormFetchStructure
    | IAddOrderSetStructure
    | IAddOrderFormSetLoading
    | ISetGoogleAPIKey
    | ISetGoogleAPIKeySuccess
    | IOptimizePackingFlagFetchData
    | IOptimizePackingFlagSetData
    | ICrateTypeFetchData
    | ICrateTypeSetData
    | ICustomerProfilingPickupFetchData
    | ICustomerProfilingPickupSetData
    | ICustomerProfilingDeliverFetchData
    | ICustomerProfilingDeliverSetData
    | IFetchOrderNumberAction
    | IFetchOrderNumberSuccessAction
    | ISetStructureData
    | ISetCrateData
    | ISetDynamicLabels
    | ISetCratePattern
    | ISetExpanded
    | ISetCount
    | IFetchLocale
    | ISetLocale
    | ISetFormType
    | IResetFormData
    | IAddOrderApiLoading
    | IResetForm
    | IGetClientMetric
    | IClientMetric
    | IFetchSubClients
    | ISetSubClients
    | IFetchTimezoneList
    | ISetTimezoneList
    | ISetOrderCloned
    | IIsMapLoadingFirstTime
    | ISelectedCustomerId
