import { IBranchInfo, IDeliveryListViewDataPayload, IRowData, IDropdown, IFilterInfo, IDeviceStatusInfo, IUpdateReasons, IVehicleList } from "./DeliveryAssociate.models";
import { IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import { IClientMetricSystem, IListViewCountResponsePayload, IListViewRequestPayload } from "../../../utils/common.interface";
import { IOperationTypes } from 'ui-library'

export interface ISetStructureAction {
  readonly type: '@@daListView/FETCH_STRUCTURE_SUCCESS';
  payload: IMongoListViewStructure;
}


export interface IFetchStructureAction {
  readonly type: '@@daListView/FETCH_STRUCTURE';
}

export interface IFetchDataAction {
  readonly type: '@@daListView/FETCH_DATA'
  payload?: IListViewRequestPayload
}
export interface IFetchDataSuccessAction {
  readonly type: '@@daListView/FETCH_DATA_SUCCESS'
  payload: IDeliveryListViewDataPayload
}

export interface IUpdateDataPayload extends Partial<IRowData> {
  deliveryMediumMasterId: number
  reason? : string
}
export interface IUpdateData {
  readonly type: '@@daListView/UPDATE_DATA'
  payload: IUpdateDataPayload
}

export interface ISetViewMode {
  readonly type: '@@daListView/SET_VIEW_MODE'
  payload: 'listview' | 'mapview'
}

export interface ISetEditDetails {
  readonly type: '@@daListView/SET_EDIT_DETAILS'
  payload: {
    rowId: string
    columnId: string
    value: any
    hasError?: boolean
  }
}

export interface IRemoveEditDetails {
  readonly type: '@@daListView/REMOVE_EDIT_DETAILS'
  payload: {
    rowId: string
    columnId: string
  }
}
export interface IClearEditDetails {
  readonly type: '@@daListView/CLEAR_EDIT_DETAILS'
}

export interface ISetLoading {
  readonly type: '@@daListView/SET_LOADING',
  payload: {
    listView: boolean
  }
}

export interface IUpdateStatus {
  readonly type: '@@daListView/UPDATE_STATUS',
  payload: {
    deliveryMediumMasterId: number,
    status: string,
    custom?: {
      [key: string]: any
    }
  }
}

export interface IBranchList {
  readonly type: '@@daListView/UPDATE_BRANCH_LIST',
  payload: {
    branchList: IBranchInfo[]
  }
}

export interface IFilterData {
  readonly type: '@@daListView/GET_FILTER_DATA',
  payload: {
    filterData: IFilterInfo[]
  }
}

export interface IOperationsData {
  readonly type: '@@daListView/GET_OPERATIONS_DATA',
  payload: {
    operationsData: IOperationTypes
  }
}
export interface IWeeklyOff {
  readonly type: '@@daListView/UPDATE_WEEKLY_OFF',
  payload: IDropdown[]
}

export interface IDeliveryStatus {
  readonly type: '@@daListView/GET_DELIVERY_STATUS',
  payload: IDropdown[]
}
export interface IDeliveryType {
  readonly type: '@@daListView/GET_DELIVERY_TYPE',
  payload: IDropdown[]
}

export interface IDeviceStatus {
  readonly type: '@@daListView/SET_DEVICE_STATUS',
  payload: IDeviceStatusInfo
}
export interface IInTransitStatus {
  readonly type: '@@daListView/IS_INTRANSIT',
  payload: boolean
}

export interface ISetGoogleAPIKey {
  readonly type: '@@daListView/GOOGLE_API_KEY',
  payload: string
}

export interface ISetColumns {
  readonly type: '@@daListView/SET_COLUMNS',
  payload: Record<string, boolean>
}


export interface IUpdateFirstLoad {
  readonly type: '@@daListView/UPDATE_FIRST_LOAD',
  payload: boolean
}

export interface IResetState {
  readonly type: '@@daListView/RESET_INITIAL_STATE'
}
export interface ISetAdvFilterLoading {
  readonly type: '@@daListView/SET_ADV_FILTER_LOADING'
  payload: boolean
}
export interface IInitialLoad {
  readonly type: '@@daListView/INITIAL_DATA_LOAD';
}

export interface ISetNetWrokStatusTimer {
  readonly type: '@@daListView/SET_NETWORK_STATUS_TIMER';
  payload: {
    time: any,
    isClicked: boolean
  }
}

export interface IClientMetric {
  readonly type: '@@daListView/SET_CLIENT_METRIC_SYSTEM';
  payload: IClientMetricSystem[]
}

export interface ISetCountLoaderAction {
  readonly type: '@@daListView/SET_COUNT_LOADER'
  payload: boolean
}

export interface IFetchCountSuccessAction {
  readonly type: '@@daListView/FETCH_COUNT_SUCCESS'
  payload: IListViewCountResponsePayload
}
export interface IStatusUpdateReasons {
  readonly type: '@@daListView/GET_STATUS_UPDATE_REASONS',
  payload: IUpdateReasons[]
}
export interface ISetInitialLoadDone {
  readonly type: '@@daListView/SET_INITIAL_FETCH_DONE'
  payload: boolean
}

export interface IVehicleInfo {
  readonly type: '@@daListView/UPDATE_VEHICLE_LIST',
  payload: any
}
export interface IFetchCompartmentListViewStructureAction {
  readonly type: '@@daListView/FETCH_COMPARTMENT_LIST_STRUCTURE';
}
export interface ISetCompartmentStructureAction {
  readonly type: '@@daListView/FETCH_COMPARTMENT_LIST_STRUCTURE_SUCCESS';
  payload: IMongoListViewStructure;
}


export type tDAListViewActions =
  | ISetStructureAction
  | IFetchStructureAction
  | IFetchDataAction
  | IFetchDataSuccessAction
  | IUpdateData
  | ISetViewMode
  | ISetEditDetails
  | IRemoveEditDetails
  | IClearEditDetails
  | ISetLoading
  | IUpdateStatus
  | IBranchList
  | IFilterData
  | IOperationsData
  | IWeeklyOff
  | IDeliveryStatus
  | IDeliveryType
  | IDeviceStatus
  | IInTransitStatus
  | ISetGoogleAPIKey
  | ISetColumns
  | IUpdateFirstLoad
  | IResetState
  | ISetAdvFilterLoading
  | IInitialLoad
  | ISetNetWrokStatusTimer
  | IClientMetric
  | IFetchCountSuccessAction
  | ISetCountLoaderAction
  | IStatusUpdateReasons
  | ISetInitialLoadDone
  | IVehicleInfo
  | IFetchCompartmentListViewStructureAction
  | ISetCompartmentStructureAction;
