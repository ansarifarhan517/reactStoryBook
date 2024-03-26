import { IClientMetricSystem} from "../../../utils/common.interface";
import { IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import { ICategoryData, IDAOptionsData, IGeofenceDataPayload, ITerritoryListDataPayload, ITerritoryLIstViewPaylod, IRowData, IGeofenceProfileData } from "./TerritoryList.models";

export interface ISetStructureAction {
    readonly type: '@@territoryList/FETCH_STRUCTURE_SUCCESS';
    payload: IMongoListViewStructure;
}
  
export interface IFetchStructureAction {
    readonly type: '@@territoryList/FETCH_STRUCTURE';
}

export interface ISetViewMode {
    readonly type: '@@territoryList/SET_VIEW_MODE'
    payload: 'listview' | 'mapview'
}

export interface IBreadcrumbState {
    readonly type: '@@territoryList/HANDLE_BREADCRUMB_STATE';
    payload: string
}
export interface ISetBreadcrumbState {
    readonly type: '@@territoryList/SET_BREADCRUMB_STATE';
    payload: string
}

export interface ISetColumnsLoading {
    readonly type : '@@territoryList/SET_COLUMNS_LOADING';
    payload: { columns: boolean };
}

export interface ISetLoading {
    readonly type : '@@territoryList/SET_LOADING';
    payload: { listView: boolean };
}

export interface IFetchDataAction {
    readonly type: '@@territoryList/FETCH_DATA'
    payload?: ITerritoryLIstViewPaylod
}
  
export interface IFetchDataSuccessAction {
    readonly type: '@@territoryList/FETCH_DATA_SUCCESS'
    payload: ITerritoryListDataPayload
}

export interface ISetBreadcrumbData {
    readonly type: '@@territoryList/FETCH_BREADCRUMBDATA_SUCCESS'
    payload: Array<IGeofenceDataPayload>
}

export interface IFetchBreadcrumbData {
    readonly type: '@@territoryList/FETCH_BREADCRUMBDATA'
}

export interface IFetchInitialData {
    readonly type: '@@territoryList/INITIAL_LOAD'
}

export interface ISetGoogleAPIKey {
    readonly type: '@@territoryList/GOOGLE_API_KEY',
    payload: string
}

export interface IFetchDAList {
    readonly type: '@@territoryList/FETCH_DA_LIST'
    payload: IDAOptionsData[]
}

export interface IFetchCategoryList {
    readonly type: '@@territoryList/FETCH_CATEGORY_LIST'
    payload: ICategoryData[]
}
export interface ISetEditDetails {
    readonly type: '@@territoryList/SET_EDIT_DETAILS'
    payload: {
      rowId: string
      columnId: string
      value: any
      hasError?: boolean
    }
}
export interface IClearEditDetails {
    readonly type: '@@territoryList/CLEAR_EDIT_DETAILS'
}
interface IUpdateDataPayload extends Partial<IRowData> {
    geofenceId: number
}
export interface IUpdateData {
    readonly type: '@@territoryList/UPDATE_DATA'
    payload: IUpdateDataPayload
}

export interface ISetFavouriteGeofence {
    readonly type: '@@territoryList/SET_FAVOURITE_GEOFENCE'
    payload: IGeofenceProfileData
}

export interface IFetchGeofenceById {
    readonly type: '@@territoryList/FETCH_GEOFENCEBYID'
    payload: string
}

export interface ISetEmptyData {
    readonly type: '@@territoryList/SET_EMPTY_DATA'
    payload: boolean
}

export interface ISetShowAdvanceFilter {
    readonly type: '@@territoryList/SET_SHOW_ADVANCE_FILTER'
    payload: boolean
}

export interface ISetIsSaveClicked {
    readonly type: '@@territoryList/SET_SAVE_CLICK'
    payload: boolean
}

export interface IClientMetric {
    readonly type: '@@territoryList/SET_CLIENT_METRIC_SYSTEM';
    payload: IClientMetricSystem[]
  }

export interface ISetDAList {
    readonly type: '@@territoryList/SET_DA_LIST';
    payload: IDAOptionsData[]
}
export interface ISetInitialBreadcrumbData {
    readonly type: '@@territoryList/INITIAL_FAV_BREADCRUMB'
    payload: Array<IGeofenceDataPayload>
}


export type tTerritoryListActions = 
    | ISetStructureAction
    | IFetchStructureAction
    | ISetViewMode
    | ISetBreadcrumbState
    | ISetColumnsLoading
    | IFetchDataAction
    | IFetchDataSuccessAction
    | ISetBreadcrumbData
    | IFetchBreadcrumbData
    | ISetLoading
    | IFetchInitialData
    | ISetGoogleAPIKey
    | IFetchDAList
    | IFetchCategoryList
    | ISetEditDetails
    | IClearEditDetails
    | IUpdateData
    | ISetFavouriteGeofence
    | IFetchGeofenceById
    | ISetEmptyData
    | ISetShowAdvanceFilter
    | ISetIsSaveClicked
    | IClientMetric
    | ISetDAList
    | ISetInitialBreadcrumbData