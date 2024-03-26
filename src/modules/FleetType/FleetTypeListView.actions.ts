import { IFetchDataOptions } from 'ui-library'
import { IClientMetricSystem, IListViewRequestPayload } from '../../utils/common.interface';
import { IMongoListViewStructure } from '../../utils/mongo/interfaces';
import { IFilterData } from '../common/AdvancedSearch/interface';

import { IDropdown, IFleetListViewDataPayload, IFleetTypeListViewRowData, IFleetTypeRequest, tFleetStatus } from './FleetTypeListView.models';


export interface ISetStructureAction {
  readonly type: '@@fleetTypeListView/FETCH_STRUCTURE_SUCCESS';
  payload: IMongoListViewStructure;
}
export interface IFetchStructureAction {
  readonly type: '@@fleetTypeListView/FETCH_STRUCTURE';
}

export interface IFetchDataAction {
  readonly type: '@@fleetTypeListView/FETCH_DATA'
  payload?: IListViewRequestPayload
}

export interface IFetchDataSuccessAction {
  readonly type: '@@fleetTypeListView/FETCH_DATA_SUCCESS'
  payload: IFleetListViewDataPayload
}

export interface IUpdateDataPayload extends Partial<IFleetTypeListViewRowData> {
  id: number
}
export interface IUpdateData {
  readonly type: '@@fleetTypeListView/UPDATE_DATA'
  payload: IUpdateDataPayload
}

export interface ISetViewMode {
  readonly type: '@@fleetTypeListView/SET_VIEW_MODE'
  payload: 'listview'
}

export interface ISetEditDetails {
  readonly type: '@@fleetTypeListView/SET_EDIT_DETAILS'
  payload: {
    rowId: string
    columnId: string
    value: any
    hasError?: boolean
  }
}

export interface IRemoveEditDetails {
  readonly type: '@@fleetTypeListView/REMOVE_EDIT_DETAILS'
  payload: {
    rowId: string
    columnId: string
  }
}
export interface IClearEditDetails {
  readonly type: '@@fleetTypeListView/CLEAR_EDIT_DETAILS'
}

export interface ISetLoading {
  readonly type: '@@fleetTypeListView/SET_LOADING',
  payload: {
    listView: boolean
  }
}

export interface IUpdateStatus {
  readonly type: '@@fleetTypeListView/UPDATE_STATUS',
  payload: {
    id: number,
    status: string,
    custom?: {
      [key: string]: any
    }
  }
}

export interface IFetchInitialData {
  readonly type: '@@fleetTypeListView/INITIAL_LOAD',
}
export interface ISetFetchOptions {
  readonly type: '@@fleetTypeListView/SET_FETCH_OPTIONS',
  payload: IFetchDataOptions
}
export interface ISetSelectedRows {
  readonly type: '@@fleetTypeListView/SET_SELECTED_ROWS',
  payload: IFleetTypeListViewRowData | {}
}
export interface ISetEditable {
  readonly type: '@@fleetTypeListView/SET_IS_EDITABLE',
  payload: boolean
}
export interface IFleetActivation {
  readonly type: '@@fleetTypeListView/SET_FLEET_ACTIVATION',
  payload: IFleetTypeRequest | undefined
}

export interface ISetUploadModal {
  readonly type: '@@fleetTypeListView/SET_UPLOAD_MODAL',
  payload: boolean
}


export interface ISetEditConfirmationModal {
  readonly type: '@@fleetTypeListView/SET_EDIT_CONFIRMATION_MODAL',
  payload: boolean
}

export interface ISetIsSaveClicked {
  readonly type: '@@fleetTypeListView/SET_IS_SAVE_CLICKED',
  payload: boolean
}

export interface ISetEmptyData {
  readonly type: '@@fleetTypeListView/SET_EMPTY_DATA';
  payload: boolean
}

export interface IResetState {
  readonly type: '@@fleetTypeListView/RESET_INITIAL_STATE'
}
export interface IWeeklyOff {
  readonly type: '@@fleetTypeListView/UPDATE_WEEKLY_OFF',
  payload: IDropdown[]
}
export interface IFleetListView_SetBreadcrumbFilter {
  readonly type: '@@fleetTypeListView/SET_BREADCRUMB_STATE',
  payload: tFleetStatus
}
export interface IDeliveryType {
  readonly type: '@@fleetTypeListView/GET_DELIVERY_TYPE',
  payload: IDropdown[]
}
export interface ISetAppliedAdvFilterData {
  readonly type: '@@fleetTypeListView/SET_APPLIED_ADV_FILTER_DATA',
  payload: any
}
export interface ISetAdvFilterData {
  readonly type: '@@fleetTypeListView/SET_ADV_FILTER_DATA',
  payload: any
}
export interface IUpdateFirstLoad {
  readonly type: '@@fleetTypeListView/UPDATE_FIRST_LOAD',
  payload: boolean
}
export interface ISetAdvFilterLoading {
  readonly type: '@@fleetTypeListView/SET_ADV_FILTER_LOADING'
  payload: boolean
}
export interface ISetCurrentFilter {
  readonly type: '@@fleetTypeListView/SET_CURRENT_FILTERS'
  payload: IFilterData | undefined
}

export interface ISetOpenAdvFilter {
  readonly type: '@@fleetTypeListView/SET_OPEN_ADV_FILTER'
  payload: boolean
}

export interface ISetFilterListPayload {
  readonly type: '@@fleetTypeListView/SET_FILTERLIST_PAYLOAD'
  payload: any
}

export interface IClientMetric {
  readonly type: '@@fleetTypeListView/SET_CLIENT_METRIC_SYSTEM';
  payload: IClientMetricSystem[]
}
export interface IFetchCompartmentListViewStructureAction {
  readonly type: '@@fleetTypeListView/FETCH_COMPARTMENT_LIST_STRUCTURE';
}
export interface ISetCompartmentStructureAction {
  readonly type: '@@fleetTypeListView/FETCH_COMPARTMENT_LIST_STRUCTURE_SUCCESS';
  payload: IMongoListViewStructure;
}

export type tFleetTypeListViewAcions =
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
  | IFetchInitialData
  | ISetFetchOptions
  | ISetSelectedRows
  | ISetEditable
  | IFleetActivation
  | ISetUploadModal
  | ISetEditConfirmationModal
  | ISetIsSaveClicked
  | ISetEmptyData
  | IResetState
  | IWeeklyOff
  | IFleetListView_SetBreadcrumbFilter
  | IDeliveryType
  | ISetAdvFilterData
  | ISetAppliedAdvFilterData
  | IUpdateFirstLoad
  | ISetAdvFilterLoading
  | ISetCurrentFilter
  | ISetOpenAdvFilter
  | ISetFilterListPayload
  | IClientMetric
  | IFetchCompartmentListViewStructureAction
  | ISetCompartmentStructureAction