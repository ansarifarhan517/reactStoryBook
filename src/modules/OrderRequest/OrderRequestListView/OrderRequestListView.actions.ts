import { IFetchDataOptions } from 'ui-library'
import { IListViewRequestPayload } from '../../../utils/common.interface';
import { IMongoListViewStructure } from '../../../utils/mongo/interfaces';
import { IFilterData } from '../../common/AdvancedSearch/interface';
import { IStatusLookupResponse, IBranchLookupResponse } from '../../../utils/common.interface';
import { IDropdown, IOrderRequestViewDataPayload, IOrderRequestListViewRowData, tOrderRequestStatus, IPriorityList } from './OrderRequestListView.models';


export interface ISetStructureAction {
  readonly type: '@@orderRequestListView/FETCH_STRUCTURE_SUCCESS';
  payload: IMongoListViewStructure;
}
export interface IFetchStructureAction {
  readonly type: '@@orderRequestListView/FETCH_STRUCTURE';
}

export interface IFetchDataAction {
  readonly type: '@@orderRequestListView/FETCH_DATA'
  payload?: IListViewRequestPayload
}

export interface IFetchDataSuccessAction {
  readonly type: '@@orderRequestListView/FETCH_DATA_SUCCESS'
  payload: IOrderRequestViewDataPayload
}

export interface IUpdateDataPayload extends Partial<IOrderRequestListViewRowData> {
  id: number
}
export interface IUpdateData {
  readonly type: '@@orderRequestListView/UPDATE_DATA'
  payload: IUpdateDataPayload
}

export interface ISetViewMode {
  readonly type: '@@orderRequestListView/SET_VIEW_MODE'
  payload: 'listview'
}

export interface ISetEditDetails {
  readonly type: '@@orderRequestListView/SET_EDIT_DETAILS'
  payload: {
    rowId: string
    columnId: string
    value: any
    hasError?: boolean
  }
}

export interface IRemoveEditDetails {
  readonly type: '@@orderRequestListView/REMOVE_EDIT_DETAILS'
  payload: {
    rowId: string
    columnId: string
  }
}
export interface IClearEditDetails {
  readonly type: '@@orderRequestListView/CLEAR_EDIT_DETAILS'
}

export interface ISetLoading {
  readonly type: '@@orderRequestListView/SET_LOADING',
  payload: {
    listView: boolean
  }
}

export interface IUpdateStatus {
  readonly type: '@@orderRequestListView/UPDATE_STATUS',
  payload: {
    id: number,
    status: string,
    custom?: {
      [key: string]: any
    }
  }
}

export interface IFetchInitialData {
  readonly type: '@@orderRequestListView/INITIAL_LOAD',
}
export interface ISetFetchOptions {
  readonly type: '@@orderRequestListView/SET_FETCH_OPTIONS',
  payload: IFetchDataOptions
}
export interface ISetSelectedRows {
  readonly type: '@@orderRequestListView/SET_SELECTED_ROWS',
  payload: IOrderRequestListViewRowData | {}
}
export interface ISetEditable {
  readonly type: '@@orderRequestListView/SET_IS_EDITABLE',
  payload: boolean
}


export interface ISetUploadModal {
  readonly type: '@@orderRequestListView/SET_UPLOAD_MODAL',
  payload: boolean
}


export interface ISetEditConfirmationModal {
  readonly type: '@@orderRequestListView/SET_EDIT_CONFIRMATION_MODAL',
  payload: boolean
}

export interface ISetIsSaveClicked {
  readonly type: '@@orderRequestListView/SET_IS_SAVE_CLICKED',
  payload: boolean
}

export interface ISetEmptyData {
  readonly type: '@@orderRequestListView/SET_EMPTY_DATA';
  payload: boolean
}

export interface IResetState {
  readonly type: '@@orderRequestListView/RESET_INITIAL_STATE'
}

export interface IOrderRequestListView_SetBreadcrumbFilter {
  readonly type: '@@orderRequestListView/SET_BREADCRUMB_STATE',
  payload: tOrderRequestStatus
}
export interface IServiceType {
  readonly type: '@@orderRequestListView/GET_SERVICE_TYPE',
  payload: IStatusLookupResponse[]
}
export interface ISetAppliedAdvFilterData {
  readonly type: '@@orderRequestListView/SET_APPLIED_ADV_FILTER_DATA',
  payload: any
}
export interface ISetAdvFilterData {
  readonly type: '@@orderRequestListView/SET_ADV_FILTER_DATA',
  payload: any
}
export interface IUpdateFirstLoad {
  readonly type: '@@orderRequestListView/UPDATE_FIRST_LOAD',
  payload: boolean
}
export interface ISetAdvFilterLoading {
  readonly type: '@@orderRequestListView/SET_ADV_FILTER_LOADING'
  payload: boolean
}
export interface ISetCurrentFilter {
  readonly type: '@@orderRequestListView/SET_CURRENT_FILTERS'
  payload: IFilterData | undefined
}

export interface ISetOpenAdvFilter {
  readonly type: '@@orderRequestListView/SET_OPEN_ADV_FILTER'
  payload: boolean
}

export interface ISetFilterListPayload {
  readonly type: '@@orderRequestListView/SET_FILTERLIST_PAYLOAD'
  payload: any
}

export interface IFetchPriorityList {
  readonly type: '@@orderRequestListView/FETCH_PRIORITY_LIST',
  payload: IPriorityList[]
}
export interface ISetSelectedDate {
  readonly type: '@@orderRequestListView/SET_SELECTED_DATE',
  payload: {
    minDate: any,
    maxDate: any
  }
}
export interface IBranchList {
  readonly type: '@@orderRequestListView/UPDATE_BRANCH_LIST',
  payload: {
    branchList: IBranchLookupResponse[]
  }
}

export interface IDeliveryStatus {
  readonly type: '@@orderRequestListView/GET_DELIVERY_STATUS',
  payload: IDropdown[]
}

export interface ISetDateRange {
  readonly type: '@@orderRequestListView/SET_OPEN_DATERANGE',
  payload: boolean
}

export interface ISetAppoveModal {
  readonly type: '@@orderRequestListView/SET_APPROVE_MODAL',
  payload: boolean
}
export interface ISetRejectModal {
  readonly type: '@@orderRequestListView/SET_REJECT_MODAL',
  payload: boolean
}
export interface IRejectReasonList {
  readonly type: '@@orderRequestListView/FETCH_REJECT_REASON_LIST',
  payload: IStatusLookupResponse[]
}
export interface IOrderStatusList {
  readonly type: '@@orderRequestListView/FETCH_ORDER_STATUS_LIST',
  payload: IStatusLookupResponse[]
}
export interface IOrderPaymentTypeList {
  readonly type: '@@orderRequestListView/FETCH_PAYMENT_TYPE_LIST',
  payload: IStatusLookupResponse[]
}
export interface IDeliveryType {
  readonly type: '@@orderRequestListView/GET_DELIVERY_TYPE',
  payload: IDropdown[]
}

export type tOrderRequestListViewAcions =
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
  | ISetUploadModal
  | ISetEditConfirmationModal
  | ISetIsSaveClicked
  | ISetEmptyData
  | IResetState
  | IOrderRequestListView_SetBreadcrumbFilter
  | ISetAdvFilterData
  | ISetAppliedAdvFilterData
  | IUpdateFirstLoad
  | ISetAdvFilterLoading
  | ISetCurrentFilter
  | ISetOpenAdvFilter
  | ISetFilterListPayload
  | IFetchPriorityList
  | ISetSelectedDate
  | IServiceType
  | IBranchList
  | IDeliveryStatus
  | ISetDateRange
  | ISetAppoveModal
  | ISetRejectModal
  | IRejectReasonList
  | IOrderStatusList
  | IOrderPaymentTypeList
  | IDeliveryType