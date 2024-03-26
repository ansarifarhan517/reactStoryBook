import { IStateService } from "angular-ui-router"
import { IEditDetails, IMongoListViewStructure, tMongoFieldType } from "../../../../utils/mongo/interfaces"
import { IFetchDataOptions } from 'ui-library'
import { IMongoDynamicHTMLTemplate } from "../../../../utils/common.interface"
import { IOrderPrintAWBTemplateData } from "../../../Order/PrintAWB/PrintAWB.models"
export interface ITripListViewProps {
  ngStateRouter: IStateService
}

export interface IBreadCrumbProps {
  router: ITripListViewProps
}
export type tTripsListMileModes = 'mapview' | 'listview'
export type tTripsListMileBreadcrumbFilter = 'allTrips' | 'started' | 'notStarted' | 'ended'
export type IActionCallback = string | 'startTrip' | 'delete' | 'printMultiDrs' | 'showdrs' | 'update' | 'stopTrip' | 'reviseETA'
export interface IListParams {
  from: string
  to: string
}

export interface IDeliveryMediumNameList {
  alreadyOfferedCnt: number
  coloaderDa: boolean
  considerNearestTripFirstApplied: boolean
  consolidationApplied: boolean
  daFromIntransitSearch: boolean
  deliverServiceTimeInMins: number
  deliverTimeInMinsFromMap: number
  deliveryMediumMasterId: number
  deliveryMediumMasterName: string
  discardDm: boolean
  isActiveFl: boolean
  nearestDm: boolean
  pickupServiceTimeInMins: number
  pickupTimeInMinsFromMap: number
  waitTimeInMins: number
}

export interface ITripStatusList {

}
export interface IAirportList {
  airportIcaoCode: string,
  airportId: number,
  airportName: string,
  latitude: number,
  longitude: number,
  timezone: string
}
export interface ITripFilterOptions {
  pageNumber: number,
  pageSize: number,
  sortOptions?: any,
  filterOptions?: any,
  endDateFilter: string,
  endDateFilterNonUTC: string,
  startDateFilter: string,
  startDateFilterNonUTC: string,
  status: string,
  searchBy?: string,
  [key: string]: any
}
export interface ITripsListMileState {
  viewMode: tTripsListMileModes
  breadcrumbFilter: tTripsListMileBreadcrumbFilter
  from: Date
  to: Date,
  listParams: IListParams,
  loading: {
    [key: string]: boolean
  },
  googleAPIKey: string,
  data: Array<ITripsListMileRowData>,
  apiResponse: {
    data: {
      status?: number,
      message?: string,
      moreResultsExists?: boolean,
      data: {
        totalCount?: number,
        otherCount?: number,
        clientBranchId?: number | string,
        results: Array<
          {
            milkRun: string,
            trips: Array<ITripsListMileRowData>
          }>
      }
    }
  },
  structure: IMongoListViewStructure,
  totalRows: number,
  filters: ITripFilterOptions,
  selectedRows: {
    [key: string]: ITripsListMileRowData
  } | {},
  editDetails: IEditDetails,
  lastUpdatedCell: string,
  dropdownMapping: {
    airports?: Array<IAirportList>,
    tripStatus: [{
      id: 'STARTED',
      label: string
      value: string
    }, {
      id: 'ENDED',
      label: string
      value: string
    }, {
      id: 'NOTSTARTED',
      label: string
      value: string
    }],
    deliveryMediums?: Array<IDeliveryMediumNameList>,
    [key: string]: any
  }
  fetchOptions: IFetchDataOptions
  printDrs : {
    templates: IMongoDynamicHTMLTemplate<IOrderPrintAWBTemplateData>[],
    isModalOpen: boolean
  }
}
export interface ITripsListMileRowData {
  actualDistance: number
  branchDescription: string
  clientBranchId: number
  deliveryMediumBranch: string
  deliveryMediumId: number
  deliveryMediumName: string
  deliveryMediumReferenceId: string
  estimatedDistance: number
  estimatedEndDate: number
  estimatedEndDateTZ: string
  estimatedStartDate: number
  estimatedStartDateTZ: string
  isActiveFl: boolean
  orderCount: number
  phoneNumber: string
  referenceId: string
  routeName: string
  routePlanningId: number
  tripId: number
  tripName: string
  tripStatus: 'NOTSTARTED' | 'STARTED' | 'ENDED'
  uniqueCustomerCount: number
  unitsCapacity: number
  utilizedCapacityInUnits: number
  utilizedCapacityInVolume: number
  utilizedCapacityInWeight: number
  volumeCapacity: number
  weightCapacity: number
  [key: string]: any
}


export interface IUndeliveredTripRow {
  shipmentId: number,
  tripId: number,
  subClientId: number,
  clientBranchId: number,
  originAddr: string,
  destinationAddr: string,
  createdByUserId: number,
  createdOnDt: number,
  clientId: number,
  origDestLatitude: number,
  origDestLongitude: number,
  startDt: number,
  packageStatusCd: string,
  destClientNodeId: number,
  tripName: string,
  orderno: string,
  timezoneMap: any,
  p2POrder: boolean
}

export interface IUndeliveredTripListResponse {
  totalCount?: number,
  otherCount?: number,
  clientBranchId?: number,
  results?: [
    {
      tripId: number,
      shipments: Array<IUndeliveredTripRow>,
      tripStarted: boolean
    }
  ]
}

export interface IDeliveryRunSheet {
  shipmentId: number,
  orderNo: string,
  packageStatusCd: string,
  orderType: string,
  destClientNodeId: string,
  destClientNodeName: string,
  destClientNodePhone: number,
  address: string,
  partialDelivery: string,
  startTimeWindow: number,
  endTimeWindow: number,
  isPartialDeliveredFl: string,
  eta: number,
  estimatedDistance: number,
  origLat: number,
  origLng: number,
  destLat: number,
  destLng: number,
  itemCount: number,
  deliveryOrder: number,
  calculatedStartDt: number,
  calculatedEndDt: number,
  shipmentLocationId: number,
  paymentType: string,
  shipmentOrderTypeCd: string,
  awbNumber: number,
  noOfAttempts: number,
  clientBranchId: number,
  startTimeWindowTZ: string,
  endTimeWindowTZ: string,
  calculatedStartDtTZ: string,
  calculatedEndDtTZ: string,
  branchName: string,
  totalLoadingTime: number,
  totalUnLoadingTime: number,
  totalServiceTime: number,
  intransitTime: number,
  clientNodeId: number,
  addressId: string,
  isGeocoded: boolean
}

export interface ISetMapDataResponse {

  status: number,
  message: string,
  moreResultsExists: boolean,
  data: {
    totalCount: number,
    otherCount: number,
    clientBranchId: number,
    results:
    {
      homeLatitude: number
      homeLongitude: number
      isActiveFl: boolean,
      originAddr: string,
      originLatitude: number,
      originLongitude: number,
      tripName: string,
      clientBranchId: number,
      tripId: number,
      deliveryRunSheet: IDeliveryRunSheet[],
      resourceOrderHubSame: boolean,
      otmcall: boolean
    }[]

  },
  hasError: boolean

}

export type ITripPrintDRSTemplateData = {
  crateHTML: string
  itemHTML: string
  orderHTML: string
  tripHTML: string
  customerHTML: string
}

export interface ICustomFieldsEntity {
  field: string
  type: tMongoFieldType
  value: any
}

export interface ITrackers {
  barcode: string
  trackeeId: string
  clientBranchId: number
  trackerDescription: string
  imei: string
  trackerModel: string
  deviceType: string
  clientBranchName: string
  lastTrackedDt: number
  latitude: number
  longitude: number
  batteryPerc: number
  speed: number
  temperature: number
  messageType: string
  reeferActive: boolean
  harshDriving: number
  doorStatus: boolean
}