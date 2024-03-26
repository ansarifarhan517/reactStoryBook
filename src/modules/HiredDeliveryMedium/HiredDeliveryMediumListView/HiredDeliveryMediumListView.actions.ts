import { IRowData, IBranchName} from './HiredDeliveryMediumListView.models';

interface IUpdateDataPayload extends Partial<IRowData> {
  deliveryMediumId: number;
}
export interface IUpdateData {
  readonly type: '@@hiredDeliveryMediumListView/UPDATE_DATA';
  payload: IUpdateDataPayload;
}

export interface ISetViewMode {
  readonly type: '@@hiredDeliveryMediumListView/SET_VIEW_MODE';
  payload: 'listview' | 'mapview';
}

export interface ISetEditDetails {
  readonly type: '@@hiredDeliveryMediumListView/SET_EDIT_DETAILS';
  payload: {
    rowId: string;
    columnId: string;
    value: any
    hasError?: boolean;
  };
}

export interface IRemoveEditDetails {
  readonly type: '@@hiredDeliveryMediumListView/REMOVE_EDIT_DETAILS';
  payload: {
    rowId: string;
    columnId: string;
  };
}
export interface IClearEditDetails {
  readonly type: '@@hiredDeliveryMediumListView/CLEAR_EDIT_DETAILS';
}

export interface ISetLoading {
  readonly type: '@@hiredDeliveryMediumListView/SET_LOADING';
  payload: {
    listView: boolean;
  };
}
export interface IUpdateStatus {
  readonly type: '@@hiredDeliveryMediumListView/UPDATE_STATUS';
  payload: {
    status: string;
    custom?: {
      [key: string]: any;
    };
  };
}


export interface ISetInitialState {
  readonly type : '@@hiredDeliveryMediumListView/SET_INITIAL_STATE';
}

export interface ISetColumnsLoading {
  readonly type : '@@hiredDeliveryMediumListView/SET_COLUMNS_LOADING';
  payload: {
    columns: boolean;
  };
}
export interface ISetBranchName {
  readonly type : '@@hiredDeliveryMediumListView/SET_BRANCH_NAME';
  payload: IBranchName[]
} 

export interface ISendDaData{
  readonly type : '@@hiredDeliveryMediumListView/SEND_DA_DATA';
  payload: any
}
export interface ISetDates {
  readonly type: '@@hiredDeliveryMediumListView/SET_DATES';
  payload: {
    maxDate?: string
    minDate?: string
  };
}






export type HiredDeliveryMediumListViewActions =
  | IUpdateData
  | ISetViewMode
  | ISetEditDetails
  | IRemoveEditDetails
  | IClearEditDetails
  | ISetLoading
  | IUpdateStatus
  | ISetInitialState
  | ISetColumnsLoading
  | ISetBranchName
  | ISendDaData
  | ISetDates
   
 
