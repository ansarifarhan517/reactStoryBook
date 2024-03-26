import { IMongoListViewStructure } from "../../utils/mongo/interfaces";



export interface ISetTabData {
  readonly type: "@@adminDashboard/FETCH_TABDATA_SUCCESS";
  payload: any;
}
export interface IFetchTabData {
  readonly type: "@@adminDashboard/FETCH_TABDATA";
  // payload?: { status: string }
  payload?: any;
}

export interface ISetRegionsList {
  readonly type: "@@adminDashboard/FETCH_REGIONS_LIST_SUCCESS";
  payload: any;
}

export interface IFetchRegionsList {
  readonly type: "@@adminDashboard/FETCH_REGIONS_LIST";
}

export interface ISetRegionsCount {
  readonly type: "@@adminDashboard/FETCH_REGIONS_COUNT_SUCCESS";
  payload: any;
}

export interface IFetchRegionsCount {
  readonly type: "@@adminDashboard/FETCH_REGIONS_COUNT";
}

export interface ISetStructureAction {
  readonly type: "@@adminDashboard/CLIENT_DETAILS/FETCH_STRUCTURE_SUCCESS";
  payload: IMongoListViewStructure;
}
export interface IFetchStructureAction {
  readonly type: "@@adminDashboard/FETCH_STRUCTURE";
  payload?: { status: string }
}

export interface ISetClientDetailDataAction {
  readonly type: "@@adminDashboard/CLIENT_DETAILS/FETCH_DATA_SUCCESS";
  payload?: any
}

export interface IFetchClientDetailDataAction {
  readonly type: "@@adminDashboard/CLIENT_DETAILS/FETCH_DATA";
  payload?: any
}

export interface ISetClientDetailLoadingAction {
  readonly type: "@@adminDashboard/CLIENT_DETAILS/IS_LOADING";
  payload?: boolean
}

export interface ISelectTab {
  readonly type: "@@adminDashboard/SELECT_TAB";
  payload?: string
}

export interface ISetClinetDetailsAccountsStructureAction {
  readonly type: "@@adminDashboard/CLIENT_DETAILS/ACCOUNTS/FETCH_STRUCTURE_SUCCESS";
  payload: IMongoListViewStructure;
}
export interface IFetchClinetDetailsAccountsStructureAction {
  readonly type: "@@adminDashboard/CLIENT_DETAILS/ACCOUNTS/FETCH_STRUCTURE";
  payload?: { status: string }
}
export interface IFetchClinetDetailsAccountsData {
  readonly type: "@@adminDashboard/CLIENT_DETAILS/ACCOUNTS/FETCH_DATA";
  payload: { id: string }
}

export interface IFetchClinetDetailsAccountsDataSuccess {
  readonly type: "@@adminDashboard/CLIENT_DETAILS/ACCOUNTS/FETCH_DATA_SUCCESS";
  payload: any
}


export interface ISetClientActivityStructureAction {
  readonly type: "@@adminDashboard/CLIENT_ACTIVITY/FETCH_STRUCTURE_SUCCESS";
  payload: IMongoListViewStructure;
}
export interface IFetchSClientActivitytructureAction {
  readonly type: "@@adminDashboard/CLIENT_ACTIVITY/FETCH_STRUCTURE";
  payload?: { status: string }
}

export interface ISetClientActivityDataAction {
  readonly type: "@@adminDashboard/CLIENT_ACTIVITY/FETCH_DATA_SUCCESS";
  payload?: any
}

export interface IFetchClientActivityDataAction {
  readonly type: "@@adminDashboard/CLIENT_ACTIVITY/FETCH_DATA";
  payload?: any
}


export interface IFetchClientDetailsPodDataAction {
  readonly type: "@@adminDashboard/CLIENT_DETAILS/FETCH_POD_DATA";
  payload?: any
}
export interface ISetClientDetailsPodDataAction {
  readonly type: "@@adminDashboard/CLIENT_DETAILS/FETCH_POD_DATA_SUCCESS";
  payload?: any
}

export interface ISetPlanType {
  readonly type: "@@adminDashboard/PLAN_TYPE";
  payload?: any
}
export interface ISetClientIds {
  readonly type: "@@adminDashboard/CLIENT_DETAILS/SET_CLIENT_IDS";
  payload?: any
}


export interface ISetBDM {
  readonly type: "@@adminDashboard/SET_BDM";
  payload?: any
}

export interface ISetOM {
  readonly type: "@@adminDashboard/SET_OM";
  payload?: any
}

export interface ISetAM {
  readonly type: "@@adminDashboard/SET_AM";
  payload?: any
}

export interface ISetPendingActivationStructureAction {
  readonly type: "@@adminDashboard/PENDING_ACTIVATION/FETCH_STRUCTURE_SUCCESS";
  payload: IMongoListViewStructure;
}
export interface IFetchPendingActivationStructureAction {
  readonly type: "@@adminDashboard/PENDING_ACTIVATION/FETCH_STRUCTURE";
  payload?: { status: string }
}

export interface ISetPendingActivationDataAction {
  readonly type: "@@adminDashboard/PENDING_ACTIVATION/FETCH_DATA_SUCCESS";
  payload?: any
}

export interface IFetchPendingActivationDataAction {
  readonly type: "@@adminDashboard/PENDING_ACTIVATION/FETCH_DATA";
  payload?: any
}


export interface ISetEditDetails {
  readonly type: "@@adminDashboard/CLIENT_DETAILS/SET_EDIT_DETAILS";
  payload: {
    rowId: string;
    columnId: string;
    value: any;
    hasError?: boolean;
  };
}

export interface IRemoveEditDetails {
  readonly type: "@@adminDashboard/CLIENT_DETAILS/REMOVE_EDIT_DETAILS";
  payload: {
    rowId: string;
    columnId: string;
  };
}
export interface IClearEditDetails {
  readonly type: "@@adminDashboard/CLIENT_DETAILS/CLEAR_EDIT_DETAILS";
}
export interface ISetDateRange {
  readonly type: '@@adminDashboard/SET_DATE_RANGE'
  payload: any
}

export interface ISetUsageMode {
  readonly type: '@@adminDashboard/SET_USAGE_MODE'
  payload: any
}

export interface IFetchOffboardOptionsData {
  readonly type: "@@adminDashboard/CLIENT_DETAILS/OFFBOARD/FETCH_OPTIONS";
}

export interface IFetchOffboardOptionsDataSuccess {
  readonly type: "@@adminDashboard/CLIENT_DETAILS/OFFBOARD/FETCH_OPTIONS_SUCCESS";
  payload: any;
}

export interface ISetEditPendingDetails {
  readonly type: "@@adminDashboard/PENDING_ACTIVATION/SET_EDIT_DETAILS";
  payload: {
    saasRowId: string;
    saasColumnId: string;
    saasValue: any;
    saasHasError?: boolean;
  };
}

export interface IRemoveEditPendingDetails {
  readonly type: "@@adminDashboard/PENDING_ACTIVATION/REMOVE_EDIT_DETAILS";
  payload: {
    rowId: string;
    columnId: string;
  };
}

export interface IClearEditPendingDetails {
  readonly type: "@@adminDashboard/PENDING_ACTIVATION/CLEAR_EDIT_DETAILS";
}

export interface ISetPendingActivationLoadingAction {
  readonly type: "@@adminDashboard/PENDING_ACTIVATION/IS_LOADING";
  payload?: boolean
}
export interface ISetChartData {
  readonly type: '@@adminDashboard/CLIENT_ACTICITY/SET_CHART_DATA';
  payload: any
}

export interface ISetRemovedLegends {
  readonly type: '@@adminDashboard/CLIENT_ACTICITY/SET_REMOVE_LEGENDS';
  payload: any
}


export type AdminDashboardActions =
    ISetTabData
  | IFetchTabData
  | ISetRegionsList
  | IFetchRegionsList
  | ISetRegionsCount
  | IFetchRegionsCount
  | ISetStructureAction
  | IFetchStructureAction
  | ISetClientDetailDataAction
  | IFetchClientDetailDataAction
  | ISetClientDetailLoadingAction
  | ISelectTab
  | ISetClinetDetailsAccountsStructureAction
  | IFetchClinetDetailsAccountsStructureAction
  | IFetchClinetDetailsAccountsData
  | IFetchClinetDetailsAccountsDataSuccess
  | ISetClientActivityStructureAction
  | IFetchSClientActivitytructureAction
  | ISetClientActivityDataAction
  | IFetchClientActivityDataAction
  | IFetchClientDetailsPodDataAction
  | ISetClientDetailsPodDataAction
  | ISetPlanType
  | ISetClientIds
  | ISetBDM
  | ISetAM
  | ISetOM
  | ISetPendingActivationStructureAction
  | IFetchPendingActivationStructureAction
  | ISetPendingActivationDataAction
  | IFetchPendingActivationDataAction
  |ISetEditDetails
  |IRemoveEditDetails
  |IClearEditDetails
  |ISetDateRange
  |ISetUsageMode
  | IFetchOffboardOptionsData
  | IFetchOffboardOptionsDataSuccess
  | ISetEditPendingDetails 
  | IRemoveEditPendingDetails
  | IClearEditPendingDetails
  | ISetPendingActivationLoadingAction
  |ISetChartData
  |ISetRemovedLegends
