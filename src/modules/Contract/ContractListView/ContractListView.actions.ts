import { IFetchDataOptions } from 'ui-library'
import { IListViewRequestPayload } from '../../../utils/common.interface';
import { IMongoListViewStructure } from '../../../utils/mongo/interfaces';
import { IFilterData } from '../../common/AdvancedSearch/interface';
import { IStatusLookupResponse, IBranchLookupResponse } from '../../../utils/common.interface';
import { IDropdown, IContractViewDataPayload, IRowData, tContractStatus, IPriorityList } from './ContractListView.models';


export interface ISetStructureAction {
  readonly type: '@@contractListView/FETCH_STRUCTURE_SUCCESS';
  payload: IMongoListViewStructure;
}
export interface IFetchStructureAction {
  readonly type: '@@contractListView/FETCH_STRUCTURE';
}

export interface IFetchDataAction {
  readonly type: '@@contractListView/FETCH_DATA'
  payload?: IListViewRequestPayload
}

export interface IFetchDataSuccessAction {
  readonly type: '@@contractListView/FETCH_DATA_SUCCESS'
  payload: IContractViewDataPayload
}

export interface IUpdateDataPayload extends Partial<IRowData> {
  id: number
}
export interface IUpdateData {
  readonly type: '@@contractListView/UPDATE_DATA'
  payload: IUpdateDataPayload
}

export interface ISetViewMode {
  readonly type: '@@contractListView/SET_VIEW_MODE'
  payload: 'listview'
}

export interface ISetEditDetails {
  readonly type: '@@contractListView/SET_EDIT_DETAILS'
  payload: {
    rowId: string
    columnId: string
    value: any
    hasError?: boolean
  }
}

export interface IRemoveEditDetails {
  readonly type: '@@contractListView/REMOVE_EDIT_DETAILS'
  payload: {
    rowId: string
    columnId: string
  }
}
export interface IClearEditDetails {
  readonly type: '@@contractListView/CLEAR_EDIT_DETAILS'
}

export interface ISetLoading {
  readonly type: '@@contractListView/SET_LOADING',
  payload: {
    listView: boolean
  }
}

export interface IUpdateStatus {
  readonly type: '@@contractListView/UPDATE_STATUS',
  payload: {
    id: number,
    status: string,
    custom?: {
      [key: string]: any
    }
  }
}

export interface IFetchInitialData {
  readonly type: '@@contractListView/INITIAL_LOAD',
}
export interface ISetFetchOptions {
  readonly type: '@@contractListView/SET_FETCH_OPTIONS',
  payload: IFetchDataOptions
}
export interface ISetSelectedRows {
  readonly type: '@@contractListView/SET_SELECTED_ROWS',
  payload: IRowData | {}
}
export interface ISetEditable {
  readonly type: '@@contractListView/SET_IS_EDITABLE',
  payload: boolean
}

export interface IResetState {
  readonly type: '@@contractListView/RESET_STATE'
}
export interface ISetUploadModal {
  readonly type: '@@contractListView/SET_UPLOAD_MODAL',
  payload: boolean
}


export interface ISetEditConfirmationModal {
  readonly type: '@@contractListView/SET_EDIT_CONFIRMATION_MODAL',
  payload: boolean
}

export interface ISetIsSaveClicked {
  readonly type: '@@contractListView/SET_IS_SAVE_CLICKED',
  payload: boolean
}

export interface ISetEmptyData {
  readonly type: '@@contractListView/SET_EMPTY_DATA';
  payload: boolean
}

export interface IResetState {
  readonly type: '@@contractListView/RESET_STATE'
}

export interface IContractListView_SetBreadcrumbFilter {
  readonly type: '@@contractListView/SET_BREADCRUMB_STATE',
  payload: tContractStatus
}
export interface IServiceType {
  readonly type: '@@contractListView/GET_SERVICE_TYPE',
  payload: IStatusLookupResponse[]
}
export interface ISetAppliedAdvFilterData {
  readonly type: '@@contractListView/SET_APPLIED_ADV_FILTER_DATA',
  payload: any
}
export interface ISetAdvFilterData {
  readonly type: '@@contractListView/SET_ADV_FILTER_DATA',
  payload: any
}
export interface IUpdateFirstLoad {
  readonly type: '@@contractListView/UPDATE_FIRST_LOAD',
  payload: boolean
}
export interface ISetAdvFilterLoading {
  readonly type: '@@contractListView/SET_ADV_FILTER_LOADING'
  payload: boolean
}
export interface ISetCurrentFilter {
  readonly type: '@@contractListView/SET_CURRENT_FILTERS'
  payload: IFilterData | undefined
}

export interface ISetOpenAdvFilter {
  readonly type: '@@contractListView/SET_OPEN_ADV_FILTER'
  payload: boolean
}

export interface ISetFilterListPayload {
  readonly type: '@@contractListView/SET_FILTERLIST_PAYLOAD'
  payload: any
}

export interface IFetchPriorityList {
  readonly type: '@@contractListView/FETCH_PRIORITY_LIST',
  payload: IPriorityList[]
}
export interface ISetSelectedDate {
  readonly type: '@@contractListView/SET_SELECTED_DATE',
  payload: {
    minDate: any,
    maxDate: any
  }
}
export interface IBranchList {
  readonly type: '@@contractListView/UPDATE_BRANCH_LIST',
  payload: {
    branchList: IBranchLookupResponse[]
  }
}

export interface IDeliveryStatus {
  readonly type: '@@contractListView/GET_DELIVERY_STATUS',
  payload: IDropdown[]
}

export interface ISetDateRange {
  readonly type: '@@contractListView/SET_OPEN_DATERANGE',
  payload: boolean
}

export interface ISetAppoveModal {
  readonly type: '@@contractListView/SET_APPROVE_MODAL',
  payload: boolean
}
export interface ISetRejectModal {
  readonly type: '@@contractListView/SET_REJECT_MODAL',
  payload: boolean
}
export interface IRejectReasonList {
  readonly type: '@@contractListView/FETCH_REJECT_REASON_LIST',
  payload: IStatusLookupResponse[]
}
export interface IOrderStatusList {
  readonly type: '@@contractListView/FETCH_ORDER_STATUS_LIST',
  payload: IStatusLookupResponse[]
}
export interface IOrderPaymentTypeList {
  readonly type: '@@contractListView/FETCH_PAYMENT_TYPE_LIST',
  payload: IStatusLookupResponse[]
}
export interface IDeliveryType {
  readonly type: '@@contractListView/GET_DELIVERY_TYPE',
  payload: IDropdown[]
}

export type ContractListViewActions =
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
  | IContractListView_SetBreadcrumbFilter
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