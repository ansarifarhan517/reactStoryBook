import { IListViewRequestPayload, IMongoDynamicHTMLTemplate } from '../../../../utils/common.interface';
import { IMongoListViewStructure } from './../../../../utils/mongo/interfaces';
import { tTripsListMileModes, tTripsListMileBreadcrumbFilter, IListParams, ITripsListMileRowData, ITripFilterOptions, IDeliveryMediumNameList, ISetMapDataResponse, ITripPrintDRSTemplateData } from "./TripsListView.model";
import { ISelectedRows, IFetchDataOptions } from 'ui-library'





interface ISetOriginAirportNameDropdownList {

}
interface ISetDestinationAirportNameDropdownList {

}

interface ISetFleetDetailsDropdownList {
  deliveryAssociateName: IDeliveryMediumNameList,
  drivers: {
    driverId: number
    guid: string
    isActiveFl: boolean
  }[],
  vehicles: {
    clientBranchId:number
    referenceId:string
    status:string
    vehicleNumber: string
    isActiveFl: boolean
    vehicleId: number
  }[]
}

interface ISetAvailableFleetDetailsDropdownList{
  availableVehicles: {
    clientBranchId:number
    referenceId:string
    vehicleNumber: string
    isActiveFl: boolean
    vehicleId: number
  }[]
}
export interface ITripsListMile_SetViewMode {
  readonly type: '@@tripsListViewMile/SET_VIEW_MODE',
  payload: tTripsListMileModes
}

export interface ITripsListView_SetBreadcrumbFilter {
  readonly type: '@@tripsListViewMile/SET_BREADCRUMB_FILTER',
  payload: tTripsListMileBreadcrumbFilter
}

export interface ITripsListMile_SetDateRangeFilter {
  readonly type: '@@tripsListViewMile/SET_DATERANGE_FILTER'
  payload: {
    from: Date
    to: Date
  }
}

export interface ITripsListMile_UpdateListParams {
  readonly type: '@@tripsListViewMile/UPDATE_LIST_PARAMS'
  payload: Partial<IListParams>
}

export interface ITripsListMile_FetchData {
  readonly type: '@@tripsListViewMile/FETCH_DATA'
  payload?: IListViewRequestPayload
}

export interface ITripsListMile_SetData {
  readonly type: '@@tripsListViewMile/SET_DATA'
  payload: Array<ITripsListMileRowData>
}
export interface ITripsListMile_SetDataFromAPI {
  readonly type: '@@tripsListViewMile/SET_DATA_FROM_API'
  payload: ITripsListMileRowData
}


export interface ITripsListMile_FetchStructure {
  readonly type: '@@tripsListViewMile/FETCH_STRUCTURE'
  payload?: string
}

export interface ITripsSetLoading {
  readonly type: '@@tripsListViewMile/SET_LOADING',
  payload: {
    [key: string]: boolean
  }
}

export interface ITripsListMile_SetStructure {
  readonly type: '@@tripsListViewMile/SET_STRUCTURE'
  payload: IMongoListViewStructure
}

export interface ISetTripsGoogleMapAPI {
  readonly type: '@@tripsListViewMile/SET_GOOGLE_API'
  payload: string
}
export interface ISetTripCount {
  readonly type: '@@tripsListViewMile/SET_DATA_COUNT'
  payload: number
}

export interface ISetTripFilterData {
  readonly type: '@@tripsListViewMile/SET_DATA_FILTER'
  payload: ITripFilterOptions
}

export interface ISetSelectedTripRows {
  readonly type: '@@tripsListViewMile/SET_SELECTED_TRIP_ROWS'
  payload: ISelectedRows
}

export interface ISetEditDetails {
  readonly type: '@@tripsListViewMile/SET_EDIT_DETAILS'
  payload: {
    rowId: string
    columnId: string
    value: any
    hasError?: boolean
  }
}

export interface IRemoveEditDetails {
  readonly type: '@@tripsListViewMile/REMOVE_EDIT_DETAILS'
  payload: {
    rowId: string
    columnId: string
  }
}
export interface IClearEditDetails {
  readonly type: '@@tripsListViewMile/CLEAR_EDIT_DETAILS'
}

export interface ISetOriginAirportName {
  readonly type: '@@tripsListViewMile/ISetOriginAirportName'
  payload?: ISetOriginAirportNameDropdownList
}

export interface ISetFleetDetailsDropdown {
  readonly type: '@@tripsListViewMile/SET_FLEETDETAILS_DROPDOWN'
  payload?: ISetFleetDetailsDropdownList
}

export interface ISetAvailableFleetDetailsDropdown {
  readonly type: '@@tripsListViewMile/SET_AVAILABLE_FLEETDETAILS_DROPDOWN'
  payload?: ISetAvailableFleetDetailsDropdownList
}
export interface ISetDestinationAirportName {
  readonly type: '@@tripsListViewMile/ISetDestinationAirportName'
  payload?: ISetDestinationAirportNameDropdownList
}
export interface ISetTripStatus {
  readonly type: '@@tripsListViewMile/ISetTripStatus'
  payload?: [{
    id: 'STARTED',
    label: 'Started'
    value: 'Started'
  }, {
    id: 'ENDED',
    label: 'Ended'
    value: 'Ended'
  }, {
    id: 'NOTSTARTED',
    label: 'Not Started'
    value: 'Not Started'
  }]
}
export interface ISetFetchOptions {
  readonly type: '@@tripsListViewMile/SET_FETCH_OPTIONS',
  payload: IFetchDataOptions
}




export interface ISetMapData {
  readonly type: '@@tripsListViewMile/SET_MAP_DATA';
  payload: ISetMapDataResponse
}
export interface ISetPrintDRSModalOpen{
  type:'@@tripsListViewMile/SET_DRS_MODAL_OPEN',
  payload: boolean
 }
 
 export interface IFetchDRSHTMLTemplates {
  type: '@@tripsListViewMile/FETCH_DRS_HTML_TEMPLATES'
}

export interface IFetchDRSHTMLTemplatesSuccess {
  type: '@@tripsListViewMile/FETCH_DRS_HTML_TEMPLATES_SUCCESS'
  payload: IMongoDynamicHTMLTemplate<ITripPrintDRSTemplateData>[]
}

export interface IFetchLookupData {
  type: '@@tripsListViewMile/FETCH_LOOKUP_DATA';
}


export type tTripsListMileActions =
  | ITripsListMile_SetViewMode
  | ITripsListView_SetBreadcrumbFilter
  | ITripsListMile_SetDateRangeFilter
  | ITripsListMile_UpdateListParams
  | ITripsListMile_FetchData
  | ITripsListMile_SetData
  | ITripsListMile_FetchStructure
  | ITripsListMile_SetStructure
  | ISetTripsGoogleMapAPI
  | ITripsSetLoading
  | ITripsListMile_SetDataFromAPI
  | ISetTripCount
  | ISetTripFilterData
  | ISetSelectedTripRows
  | ISetEditDetails
  | IRemoveEditDetails
  | IClearEditDetails
  | ISetFleetDetailsDropdown
  | IFetchLookupData
  | ISetAvailableFleetDetailsDropdown

  //Map View

  | ISetMapData


  //advanced Filter

  | ISetFetchOptions

  // Print DRS 
  | ISetPrintDRSModalOpen
  | IFetchDRSHTMLTemplates
  | IFetchDRSHTMLTemplatesSuccess



