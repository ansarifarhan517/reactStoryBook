import { IFetchDataOptions } from "ui-library"
import { IClientProperty } from "../../common/ClientProperties/interfaces"
import { tPopupRef } from '../../../utils/components/Map/interface';

export interface IOrderFetchDataOptions extends IFetchDataOptions {
  dataFetchMode?: string
  endDateFilter?: string
  startDateFilter?: string
  status?: string,
  removeFilterForControlTower?:boolean
}

export interface IOrderListViewDataPayload {
  clientBranchId?: number
  otherCount?: number
  totalCount: number
  results: Array<IRowData>
  clientProperties?: Record<string, IClientProperty>,
  moreResultsExists?: boolean
}

export interface ICustomField {
  type: string
  field: string
  value: any
}

export interface PodList {
  shipmentImageId: number
  shipmentDetailsId: number
  imageLocation: string
  imageName: string
  imageType: string
  url: string
  shipmentLocationId: number
  comments: string
}

export interface EsignList {
  shipmentImageId: number
  shipmentDetailsId: number
  imageLocation: string
  imageName: string
  imageType: string
  url: string
  shipmentLocationId: number
  comments: string
}

export interface IRowData {
  createdOnDt: any
  isActiveFl: boolean
  createdOnDtTZ: string
  id: number
  referenceId: string
  shipmentId: number
  orderNo: string
  orderType: string
  orderStatus: string
  orderState: string
  originAddress: string
  destinationAddress: string
  destClientNodeId: number
  destClientNodeName: string
  originClientNodeId: number
  originClientNodeName: string
  originClientNodePhone: string
  startTimeWindow: any
  endTimeWindow: any
  noOfAttempts: number
  isGeocoded: boolean
  awbNumber: string
  lat: number
  lng: number
  clientName: string
  branchName: string
  orderDate: any
  paymentType: string
  amount: number
  isCancelAllowedFl: boolean
  isReturnAllowedFl: boolean
  isPartialDeliveryAllowedFl: boolean
  isPartialDeliveredFl: boolean
  noOfItems: number
  projectDistance: number
  distanceFromHub: number
  capacityInWeight: number
  capacityInVolume: number
  originClientNodeCd: string
  destClientNodeCd: string
  addressDetails: string
  originLatitude: number
  originLongitude: number
  destLatitude: number
  destLongitude: number
  customerName: string
  branchCity: string
  pickupStartTimeWindow: any
  pickupEndTimeWindow: any
  deliverStartTimeWindow: any
  deliverEndTimeWindow: any
  isDelayed: boolean
  branchId: number
  packageValue: number
  shippingCost: number
  customerId: string
  clientId: number
  autoAllocateFl: string
  latitude: number
  longitude: number
  deliverAccountCode: string
  deliverAccountName: string
  deliverStreetName: string
  deliverLocality: string
  deliverState: string
  deliverCity: string
  deliverPinCode: string
  deliverServiceTime: number
  returnToSameAddress: boolean
  returnServiceTime: number
  pickupAccountCode: string
  pickupAccountName: string
  pickupEmail: string
  pickupStreetName: string
  pickupLocality: string
  pickupState: string
  pickupCity: string
  pickupPinCode: string
  pickupServiceTime: number
  pickupServiceTimeInMins: number
  deliverServiceTimeInMins: number
  pickupNotes: string
  deliverNotes: string
  geofenceName: string
  isDMDelete: boolean
  isDMActive: boolean
  pickupAddressId: string
  deliverAddressId: string
  pickupShipmentLocationId: number
  deliverShipmentLocationId: number
  startTimeWindowTZ: string
  endTimeWindowTZ: string
  orderDateTZ: string
  pickupStartTimeWindowTZ: string
  pickupEndTimeWindowTZ: string
  deliverStartTimeWindowTZ: string
  deliverEndTimeWindowTZ: string
  isP2POrder: boolean
  packageLength: number
  packageBreadth: number
  packageHeight: number
  branchDescription: string
  preparationTime: number
  timeWindowConfirmedBy: string
  delayedBy?: number
  statusUpdateDate?: number
  tripId?: number
  tripNo: string
  eta?: number
  lastTrackingDt?: number
  deliveryMediumMasterId: number
  deliveryMediumPhoneNumber: string
  deliveryMediumName: string
  calculatedStartDt?: number
  startDt?: number
  deliveryOrder?: number
  isManualAssigned?: boolean
  deliverEmail: string
  pickupDeliveryOrder?: number
  deliverDeliveryOrder?: number
  employeeId: string
  customFields: string
  pickupEta?: number
  deliverEta?: number
  etaTZ: string
  calculatedStartDtTZ: string
  startDtTZ: string
  deliveryMediumMasterBranchName: string
  deliveryMediumReferenceId: string
  tripReferenceId: string
  descClientNodePhone: string
  endDt?: number
  actualArrivalTime?: number
  deliveryLocationType: string
  actualAmount?: number
  actualDistance?: number
  customerRating?: number
  serviceTimeInMins?: number
  podList: PodList[]
  esignList: EsignList[]
  checkInTime?: number
  checkOutTime?: number
  receiverName: string
  updatedByUserName: string
  pickupCheckInTime?: number
  pickupCheckOutTime?: number
  deliverCheckInTime?: number
  deliverCheckOutTime?: number
  pickupCheckinLatitude?: number
  pickupCheckinLongitude?: number
  pickupCheckOutLatitude?: number
  pickupCheckOutLongitude?: number
  deliverCheckinLatitude?: number
  deliverCheckinLongitude?: number
  deliverCheckOutLatitude?: number
  deliverCheckOutLongitude?: number
  openingCash?: number
  closingCash?: number
  mismatchReason: string
  paymentSubType: string
  transactionId: string
  distanceBetweenOrders?: number
  endDtTZ: string
  actualArrivalTimeTZ: string
  checkInTimeTZ: string
  checkOutTimeTZ: string
  statusUpdateDateTZ: string
  pickupCheckInTimeTZ: string
  pickupCheckOutTimeTZ: string
  deliverCheckInTimeTZ: string
  deliverCheckOutTimeTZ: string
  customerPhoneNo: string
  plannedCashAtDelivery?: number
  customerComments: string
  recalculatedValue?: number
  reason: string
  isOrderAcceptedFl: string
  partialDeliveryReason: string
  plannedCashAtPickup?: number
  customFieldsJSONString?: any
  orderId?: any
}

export type tStatus =
  | "ALL"
  | "NOTDISPATCHED"
  | "INTRANSIT"
  | "COMPLETED"
  | "CANCELLED"
  | "NOTCOMPLETED"
  | "DELETED"

export interface IChildren {
  selectedOption?: OptionType
  menuIsOpen: boolean
  setMenuIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}
type OptionType = {
  value: string
  label: string
  [key: string]: any
}


///// FROM DA LIST VIEW




export interface IDeliveryListViewDataPayload {
  clientBranchId?: number,
  otherCount?: number,
  totalCount: number,
  results: Array<IRowData>,
  clientProperties?: Record<string, IClientProperty>
}

export interface ICustomField {
  type: string,
  field: string,
  value: any
}

export interface IBranchInfo {
  branchDescription?: string
  branchId?: number
  canonicalId?: string
  clientNodeId?: number
  dst?: string
  gmtoffset?: string
  id?: number
  name?: string
  label?: string
}

export interface IMarkers {
  id: any
  position: [number, number]
  title: string
  type: string
  popupRef: tPopupRef
  iconRef: string
  lat: number
  lng: number
  networkStatus: string,
  orderStatus: string
}

export interface IFilters {
  customField?: boolean
  fieldId?: string
  fieldLabelKey: string
  filterData: string
  operationLabelKey: string
  operationSymbol: string
}

export interface ISortCriteria {
  customField?: boolean
  fieldId: string
  fieldLabelKey: string
  operationLabelKey: string
  operationSymbol: string
}

export interface IFilterInfo {
  advanceFilterTagReferenceIds: any[]
  filterName: string
  filters: any[]
  customField: boolean
  fieldId: string
  fieldLabelKey: string
  filterData: string
  operationLabelKey: string
  operationSymbol: string
  id: string
  isFavourite: boolean
  favouriteSections: string[]
  sortCriteria?: ISortCriteria[]
  operationLogic: string
  ownerUserId: any
  pageName: string
  sectionName: string
  userGroupIds: number[]
  userIds: number[]
}
export interface IDropdown {
  label: string
  value: number | string
  [key: string]: any
}
interface networkStatus {
  [key: number]: string
}

export interface IDeviceStatusInfo {
  networkStatusList?: networkStatus,
  deviceStatusLoading?: boolean,
  userId?: number | undefined
}

export interface IUniversalDropdownChildren {
  selectedOption?: IDropdown
  menuIsOpen: boolean
  setMenuIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export interface IDateRange {
  startDate?: Date
  endDate?: Date
  
}
export interface IExceptionData {
  isActiveFl: boolean
  exceptionMode: string
  exceptionCode: string
  exceptionName: string
  exceptionType: string
  exceptionStage: string[]
  exceptionAppliesTo: string[]
  exceptionMessage: string
  exceptionGroupId: string
}
export type tMoreOption = 'absent' | 'present' | 'active' | 'inactive' | 'sendActivationLinkDm'

export interface IStructureParams {
  pageName: string;
  sectionName: string;
}
