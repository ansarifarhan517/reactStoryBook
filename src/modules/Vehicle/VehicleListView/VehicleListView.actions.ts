import { IVehicleListViewDataPayload, IRowData, IBranchName, tBreadcrumbState,IClientMetricSystem, ITrackerViewRequestPayload } from './VehicleListView.models';
import { IMongoListViewStructure } from '../../../utils/mongo/interfaces';
import { IListViewRequestPayload } from '../../../utils/common.interface';

export interface ISetStructureAction {
  readonly type: '@@vehicleListView/FETCH_STRUCTURE_SUCCESS';
  payload: IMongoListViewStructure;
}
export interface IFetchStructureAction {
  readonly type: '@@vehicleListView/FETCH_STRUCTURE';
}

export interface IFetchDataAction {
  readonly type: '@@vehicleListView/FETCH_DATA';
  payload?: IListViewRequestPayload;
}

export interface IFetchDataSuccessAction {
  readonly type: '@@vehicleListView/FETCH_DATA_SUCCESS';
  payload: IVehicleListViewDataPayload;
}

interface IUpdateDataPayload extends Partial<IRowData> {
  vehicleId: number;
}
export interface IUpdateData {
  readonly type: '@@vehicleListView/UPDATE_DATA';
  payload: IUpdateDataPayload;
}

export interface ISetViewMode {
  readonly type: '@@vehicleListView/SET_VIEW_MODE';
  payload: 'listview' | 'mapview';
}

export interface ISetEditDetails {
  readonly type: '@@vehicleListView/SET_EDIT_DETAILS';
  payload: {
    rowId: string;
    columnId: string;
    value: any
    hasError?: boolean;
  };
}

export interface IRemoveEditDetails {
  readonly type: '@@vehicleListView/REMOVE_EDIT_DETAILS';
  payload: {
    rowId: string;
    columnId: string;
  };
}
export interface IClearEditDetails {
  readonly type: '@@vehicleListView/CLEAR_EDIT_DETAILS';
}

export interface ISetLoading {
  readonly type: '@@vehicleListView/SET_LOADING';
  payload: {
    listView: boolean;
  };
}
export interface IUpdateStatus {
  readonly type: '@@vehicleListView/UPDATE_STATUS';
  payload: {
    vehicleId: number;
    status: string;
    custom?: {
      [key: string]: any;
    };
  };
}
export interface IBreadcrumbState {
  readonly type: '@@vehicleListView/HANDLE_BREADCRUMB_STATE';
  payload: string
}
export interface ISetBreadcrumbState {
  readonly type: '@@vehicleListView/SET_BREADCRUMB_STATE';
  payload: tBreadcrumbState
}


export interface ISetInitialState {
  readonly type : '@@vehicleListView/SET_INITIAL_STATE';
}

export interface ISetColumnsLoading {
  readonly type : '@@vehicleListView/SET_COLUMNS_LOADING';
  payload: {
    columns: boolean;
  };
}
export interface ISetBranchName {
  readonly type : '@@vehicleListView/SET_BRANCH_NAME';
  payload: IBranchName[]
} 

export interface IIntransitMessage {
  readonly type: '@@vehicleListView/SET_INTRANSIT_MESSAGE';
  payload: string
}
export interface IClientMetric {
  readonly type : '@@vehicleListView/SET_CLIENT_METRIC_SYSTEM';
  payload: IClientMetricSystem[]
}


export interface ISetEmptyData {
  readonly type : '@@vehicleListView/SET_EMPTY_DATA';
  payload: Boolean
}
export interface IFetchCompartmentListViewStructureAction {
  readonly type: '@@vehicleListView/FETCH_COMPARTMENT_LIST_STRUCTURE';
}
export interface ISetCompartmentStructureAction {
  readonly type: '@@vehicleListView/FETCH_COMPARTMENT_LIST_STRUCTURE_SUCCESS';
  payload: IMongoListViewStructure;
}
export interface IFetchTrackerListViewStructureAction {
  readonly type: '@@vehicleListView/FETCH_TRACKER_LIST_STRUCTURE';
}
export interface ISetTrackerStructureAction {
  readonly type: '@@vehicleListView/FETCH_TRACKER_LIST_STRUCTURE_SUCCESS';
  payload: IMongoListViewStructure;
}
export interface IFetchTrackerDataAction {
  readonly type: '@@vehicleListView/FETCH_TRACKER_LIST_DATA';
  payload?: ITrackerViewRequestPayload;
}
export interface IFetchTrackerDataSuccessAction {
  readonly type: '@@vehicleListView/FETCH_TRACKER_LIST_DATA_SUCCESS';
  payload: IVehicleListViewDataPayload;
}
export type VehicleListViewActions =
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
  | ISetInitialState
  | IBreadcrumbState
  | ISetBreadcrumbState
  | ISetColumnsLoading
  | ISetBranchName
  | IIntransitMessage
  | IClientMetric
  | ISetEmptyData
  | IFetchCompartmentListViewStructureAction
  | ISetCompartmentStructureAction
  | ISetTrackerStructureAction
  | IFetchTrackerListViewStructureAction
  | IFetchTrackerDataAction
  | IFetchTrackerDataSuccessAction
 
