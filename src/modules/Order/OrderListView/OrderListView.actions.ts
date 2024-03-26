import { IOrderListViewRequestPayload } from "../../../utils/common.interface";
import { IMongoFormStructure, IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import { IOrderListViewDataPayload, IRowData, IFilterInfo, IExceptionData } from "./OrderListView.models";
import { IFetchAWBHTMLTemplates, IFetchAWBHTMLTemplatesSuccess, IFetchPrintAWBOrderDetails, IFetchPrintAWBOrderDetailsSuccess, ISetPrintAWBModalOpen } from '../PrintAWB/PrintAWB.actions'
import { IOperationTypes } from 'ui-library'
export interface ISetStructureAction {
  readonly type: "@@orderListView/FETCH_STRUCTURE_SUCCESS";
  payload: IMongoListViewStructure;
}
export interface IFetchStructureAction {
  readonly type: "@@orderListView/FETCH_STRUCTURE";
  payload?: { status: string }
}

export interface IFetchDataAction {
  readonly type: "@@orderListView/FETCH_DATA";
  payload?: IOrderListViewRequestPayload;
}

export interface IFetchDataSuccessAction {
  readonly type: "@@orderListView/FETCH_DATA_SUCCESS";
  payload: IOrderListViewDataPayload;
}

export interface IFetchCountAction {
  readonly type: "@@orderListView/FETCH_COUNT";
  payload?: IOrderListViewRequestPayload;
}

export interface IFetchCountSuccessAction {
  readonly type: "@@orderListView/FETCH_COUNT_SUCCESS";
  payload: IOrderListViewDataPayload;
}

interface IUpdateDataPayload extends Partial<IRowData> {
  orderId: number;
}
export interface IUpdateData {
  readonly type: "@@orderListView/UPDATE_DATA";
  payload: IUpdateDataPayload;
}

export interface ISetViewMode {
  readonly type: "@@orderListView/SET_VIEW_MODE";
  payload: "listview" | "mapview";
}

export interface ISetEditDetails {
  readonly type: "@@orderListView/SET_EDIT_DETAILS";
  payload: {
    rowId: string;
    columnId: string;
    value: any;
    hasError?: boolean;
  };
}

export interface IRemoveEditDetails {
  readonly type: "@@orderListView/REMOVE_EDIT_DETAILS";
  payload: {
    rowId: string;
    columnId: string;
  };
}
export interface IClearEditDetails {
  readonly type: "@@orderListView/CLEAR_EDIT_DETAILS";
}

export interface ISetLoading {
  readonly type: "@@orderListView/SET_LOADING";
  payload: {
    listView: boolean;
  };
}

export interface IUpdateStatus {
  readonly type: "@@orderListView/UPDATE_STATUS";
  payload: {
    orderId: number;
    status: string;
    custom?: {
      [key: string]: any;
    };
  };
}
export interface IOperationsData {
  readonly type: '@@orderListView/GET_OPERATIONS_DATA',
  payload: {
    operationsData: IOperationTypes
  }
}

export interface IFilterData {
  readonly type: '@@orderListView/GET_FILTER_DATA',
  payload: {
    filterData: IFilterInfo[]
  }
}

export interface IUpdateFirstLoad {
  readonly type: '@@orderListView/UPDATE_FIRST_LOAD',
  payload: boolean
}

export interface ISetAdvFilterLoading {
  readonly type: '@@orderListView/SET_ADV_FILTER_LOADING'
  payload: boolean
}

export interface ISetOrderStatus {
  readonly type: '@@orderListView/SET_ORDER_STATUS'
  payload: any
}

export interface ISetGeofence {
  readonly type: '@@orderListView/SET_GEOFENCE'
  payload: any
}

export interface IDeliveryType {
  readonly type: '@@orderListView/SET_DELIVERY_TYPE'
  payload: any
}

export interface IServiceType {
  readonly type: '@@orderListView/SET_SERVICE_TYPE'
  payload: any
}

export interface IPaymentMode {
  readonly type: '@@orderListView/SET_PAYMENT_MODE'
  payload: any
}

export interface IPriority {
  readonly type: '@@orderListView/SET_PRIORITY'
  payload: any
}
export interface IBranches {
  readonly type: '@@orderListView/SET_BRANCHES'
  payload: any
}

export interface INotificationData {
  readonly type: '@@orderListView/SET_NOTIFICATION_DATA'
  payload: any
}

export interface IClientMetric {
  readonly type: '@@orderListView/SET_CLIENT_METRIC'
  payload:any
}

export interface IZonalCapacity {
  readonly type: '@@orderListView/SET_ZONAL_CAPACITY'
  payload: boolean
}
export interface ICrateStructure {
  readonly type: '@@orderListView/SET_CRATE_STRUCTURE'
  payload: any
}

export interface ICrateItemsStructure {
  readonly type: '@@orderListView/SET_CRATE_ITEMS_STRUCTURE'
  payload: any
}

export interface ISetTemperatureCategory {
  readonly type: '@@orderListView/SET_TEMPERATURE_CATEGORY'
  payload: any
}

export interface ISetDateRange {
  readonly type: '@@orderListView/SET_DATE_RANGE'
  payload: any
}

export interface ISetReason {
  readonly type: '@@orderListView/SET_REASON'
  payload: any
}
export interface ISetIsFilterRemoved {
  readonly type: '@@orderListView/IS_FILTER_REMOVED'
  payload: any
}

export interface ISetFilterListPayload {
  readonly type: '@@orderListView/SET_FILTER_LIST_PAYLOAD'
  payload: any
}

export interface IResetData {
  readonly type: "@@orderListView/RESET_DATA";
  payload: any;
}

export interface ISetCurrentFilter {
  readonly type: '@@orderListView/SET_CURRENT_FILTERS'
  payload:  any
}

export interface IDateInAttemptedStatus{
  readonly type: "@@orderListView/DATE_IN_ATTEMPTED_STATUS"
  newPayload: any
}
export interface ISelectedRow{
  readonly type: "@@orderListView/SELECTEDROWS"
  payload: any
}
export interface IFetchExceptionDataAction {
  readonly type: "@@orderListView/FETCH_EXCEPTION_DATA";
  listViewType: string;
}
export interface ISetExceptionList{
  readonly type: "@@orderListView/SET_EXCEPTION_LIST"
  payload: {
    data: IExceptionData[]
  };
}

export interface IFetchStructure {
  readonly type: '@@orderListView/FETCH_BULK_UPDATE_STRUCTURE'
}

export interface ISetStructure {
  readonly type: '@@orderListView/SET_BULK_UPDATE_STRUCTURE'
  payload: IMongoFormStructure
}

export interface ISetApiLoading {
  readonly type: '@@orderListView/SET_API_LOADING'
  payload: boolean
}
export interface IFetchUpdateAddressStructure {
  readonly type: '@@orderListView/FETCH_UPDATE_ADDRESS_STRUCTURE'
}
export interface ISetUpdateAddressStructureAction {
  readonly type: "@@orderListView/SET_UPDATE_ADDRESS_STRUCTURE";
  payload: IMongoFormStructure;
}
export interface IFetchAllOrderAddressUpdateStructure {
  readonly type: '@@orderListView/FETCH_ALL_ORDER_ADDRESS_UPDATE_LIST'
}
export interface ISetAllOrderAddressUpdateStructure {
  readonly type: "@@orderListView/SET_ALL_ORDER_ADDRESS_UPDATE_LIST";
  payload: any;
}

export interface IDisableNext {
  readonly type : '@@orderListView/SET_DISABLE_NEXT'
  payload: boolean
}

export interface IOptimizePackingStatus {
  readonly type : '@@orderListView/FETCH_OPTIMIZE_PACKING_STATUS',
  payload: any
}

export type OrderListViewActions =
  | ISetStructureAction
  | IFetchStructureAction
  | IFetchDataAction
  | IFetchDataSuccessAction
  | IFetchCountAction
  | IFetchCountSuccessAction
  | IUpdateData
  | ISetViewMode
  | ISetEditDetails
  | IRemoveEditDetails
  | IClearEditDetails
  | ISetLoading
  | IUpdateStatus
  | IOperationsData
  | IFilterData
  | IUpdateFirstLoad
  | ISetAdvFilterLoading
  | ISetOrderStatus
  | ISetGeofence
  | IDeliveryType
  | IPriority
  | IServiceType
  | IPaymentMode
  | IBranches
  | INotificationData
  | IClientMetric
  | IZonalCapacity
  | ICrateStructure
  | ICrateItemsStructure
  | ISetTemperatureCategory
  | ISetDateRange
  | ISetReason
  | ISetIsFilterRemoved
  | ISetFilterListPayload
  | IFetchAWBHTMLTemplates
  | IFetchAWBHTMLTemplatesSuccess
  | ISetPrintAWBModalOpen
  | IFetchPrintAWBOrderDetails
  | IFetchPrintAWBOrderDetailsSuccess
  | IResetData
  | ISetCurrentFilter
  | IDateInAttemptedStatus
  | ISelectedRow
  | IFetchExceptionDataAction
  | ISetExceptionList
  | IFetchStructure
  | ISetStructure
  | ISetApiLoading
  | IFetchUpdateAddressStructure
  | ISetUpdateAddressStructureAction
  | IFetchAllOrderAddressUpdateStructure
  | ISetAllOrderAddressUpdateStructure
  | IDisableNext
  | IOptimizePackingStatus