import { IPriorityList, IShipperListViewDataPayload, IShipperListViewRowData, IStatusList, tShipperStatus, IRequestConversionList, IServiceAreaProfileNameList } from "./ShipperListView.models";
import { IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import { IListViewRequestPayload } from "../../../utils/common.interface";
import { IFetchDataOptions } from 'ui-library'
import { INoOfUserRequest, IShipperRequest } from './SubComponent/SubComponent.models';


export interface ISetStructureAction {
  readonly type: '@@shipperListView/FETCH_STRUCTURE_SUCCESS';
  payload: IMongoListViewStructure;
}
export interface IFetchStructureAction {
  readonly type: '@@shipperListView/FETCH_STRUCTURE';
}

export interface IFetchDataAction {
  readonly type: '@@shipperListView/FETCH_DATA'
  payload?: IListViewRequestPayload
}

export interface IFetchDataSuccessAction {
  readonly type: '@@shipperListView/FETCH_DATA_SUCCESS'
  payload: IShipperListViewDataPayload
}

interface IUpdateDataPayload extends Partial<IShipperListViewRowData> {
  shipperDetailsId: number
}
export interface IUpdateData {
  readonly type: '@@shipperListView/UPDATE_DATA'
  payload: IUpdateDataPayload
}

export interface ISetViewMode {
  readonly type: '@@shipperListView/SET_VIEW_MODE'
  payload: 'listview' | 'mapview'
}

export interface ISetEditDetails {
  readonly type: '@@shipperListView/SET_EDIT_DETAILS'
  payload: {
    rowId: string
    columnId: string
    value: any
    hasError?: boolean
  }
}

export interface IRemoveEditDetails {
  readonly type: '@@shipperListView/REMOVE_EDIT_DETAILS'
  payload: {
    rowId: string
    columnId: string
  }
}
export interface IClearEditDetails {
  readonly type: '@@shipperListView/CLEAR_EDIT_DETAILS'
}

export interface ISetLoading {
  readonly type: '@@shipperListView/SET_LOADING',
  payload: {
    listView: boolean
  }
}

export interface IUpdateStatus {
  readonly type: '@@shipperListView/UPDATE_STATUS',
  payload: {
    shipperDetailsId: number,
    status: string,
    custom?: {
      [key: string]: any
    }
  }
}
export interface IUpdateShipperStatus {
  readonly type: '@@shipperListView/FETCH_STATUS_LIST',
  payload: {
    data: IStatusList[],
  }
}
export interface IRejectReasonList {
  readonly type: '@@shipperListView/FETCH_REJECT_REASON_LIST',
  payload: IStatusList[]
}

export interface IDeactivationList {
  readonly type: '@@shipperListView/FETCH_DEACTIVATION_REASON_LIST',
  payload: IStatusList[]
}
export interface IShipperListView_SetBreadcrumbFilter {
  readonly type: '@@shipperListView/SET_BREADCRUMB_FILTER',
  payload: tShipperStatus
}

export interface IFetchInitialData {
  readonly type: '@@shipperListView/INITIAL_LOAD',
}
export interface ISetFetchOptions {
  readonly type: '@@shipperListView/SET_FETCH_OPTIONS',
  payload: IFetchDataOptions
}
export interface ISetSelectedRows {
  readonly type: '@@shipperListView/SET_SELECTED_ROWS',
  payload: IShipperListViewRowData | {}
}
export interface ISetEditable {
  readonly type: '@@shipperListView/SET_IS_EDITABLE',
  payload: boolean
}
export interface IShipperActivation {
  readonly type: '@@shipperListView/SET_SHIPPER_ACTIVATION',
  payload: IShipperRequest | undefined
}

export interface ISetNoOfUserModal {
  readonly type: '@@shipperListView/SET_NO_OF_USERS_MODAL',
  payload: INoOfUserRequest
}

export interface ISetApprovalModal {
  readonly type: '@@shipperListView/SET_APPROVAL_MODAL',
  payload: boolean
}

export interface ISetRejectModal {
  readonly type: '@@shipperListView/SET_REJECT_MODAL',
  payload: boolean
}

export interface ISetUploadModal {
  readonly type: '@@shipperListView/SET_UPLOAD_MODAL',
  payload: boolean
}

export interface IFetchPriorityList {
  readonly type: '@@shipperListView/FETCH_PRIORITY_LIST',
  payload: IPriorityList[]
}

export interface IFetchServiceAreaProfileNameList {
  readonly type: '@@shipperListView/FETCH_SERVICE_AREA_NAME_LIST',
  payload: IServiceAreaProfileNameList[]
}

export interface IFetchRequestConversionList {
readonly type: '@@shipperListView/FETCH_REQUEST_CONVERSION_LIST',
  payload: IRequestConversionList[]
}

export interface ISetEditConfirmationModal {
  readonly type: '@@shipperListView/SET_EDIT_CONFIRMATION_MODAL',
  payload: boolean
}

export interface ISetIsSaveClicked {
  readonly type: '@@shipperListView/SET_IS_SAVE_CLICKED',
  payload: boolean
}

export interface ISetEmptyData {
  readonly type: '@@shipperListView/SET_EMPTY_DATA';
  payload: boolean
}

export interface IResetState {
  readonly type: '@@shipperListView/RESET_INITIAL_STATE'
}


export type tShipperListViewAcions =
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
  | IUpdateShipperStatus
  | IRejectReasonList
  | IDeactivationList
  | IShipperListView_SetBreadcrumbFilter
  | IFetchInitialData
  | ISetFetchOptions
  | ISetSelectedRows
  | ISetEditable
  | IShipperActivation
  | ISetNoOfUserModal
  | ISetApprovalModal
  | ISetRejectModal
  | ISetUploadModal
  | IFetchPriorityList
  | IFetchServiceAreaProfileNameList
  | IFetchRequestConversionList
  | ISetEditConfirmationModal
  | ISetIsSaveClicked
  | ISetEmptyData
  | IResetState