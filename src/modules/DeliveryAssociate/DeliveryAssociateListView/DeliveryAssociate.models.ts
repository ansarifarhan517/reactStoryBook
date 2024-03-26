
import { tIconRef, tPopupRef } from '../../../utils/components/Map/interface';
import { IClientProperty } from '../../common/ClientProperties/interfaces';
import { IMongoField } from '../../../utils/mongo/interfaces'

export interface IRowData {
  editIconButtonProps?: any
  ignoreSelectAll?: boolean
  deviceStatus: string
  type: string
  alreadyOfferedCnt: number
  batteryPerc: number
  branchDescription: string
  branchName: string
  branchTimeZone: string
  capacityInUnits: number
  capacityInVolume: number
  capacityInWeight: number
  minCapacityUtilizationInUnits: number
  minCapacityUtilizationInVolume: number
  minCapacityUtilizationInWeight: number
  variableCost: number
  cashBalance: number
  cashCollected: number
  cashPaid: number
  clientBranchId: number
  coloaderDa: boolean
  considerNearestTripFirstApplied: boolean
  consolidatedCurrentAddress: string
  consolidatedPermanentAddress: string
  consolidationApplied: boolean
  customFieldsJSONString?: string
  deliverServiceTimeInMins: number
  deliverTimeInMinsFromMap: number
  deliveryMediumLoginDetails: { deliveryMediumMasterId: number, type: string }
  deliveryMediumMasterId: number
  deliveryMediumMasterName: string
  deliveryMediumMasterTypeCd?: string
  deliveryType?:string
  deviceType: string
  discardDm: boolean
  dmTimeZone: string
  employeeId: string
  gcmRegistrationCode: string
  id: number
  imei: string
  isActiveFl: boolean
  isAttandanceFl: boolean
  isOnBreakFl: string
  isPresentFl: boolean
  isSuperFl: string
  lat: number
  latestAvailableDate: number
  lng: number
  nearestDm: boolean
  networkStatus: string
  osVersion: string
  phoneModel: string
  phoneNumber: string
  pickupServiceTimeInMins: number
  pickupTimeInMinsFromMap: number
  referenceId: string
  statusCd: string
  trackingDate: number
  trackingDt: number
  tripId: number
  tripName: string
  tripStartDt: number
  tripStartDtTZ: string
  tripStatus: string
  userId: number
  userName: string
  versionCode: number
  waitTimeInMins: number
}

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
  iconRef: tIconRef
  lat: number
  lng: number
  networkStatus: string
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
export interface IUpdateReasons {
  clientRefMasterType: string
  clientRefMasterCd: string
  clientRefMasterDesc: string
  clientRefMasterId: number
  sequence: number
  name: string
}

export interface IVehicleList {
  id?: number
  name?: string
  vehicleId?: number
  vehicleNumber?: string
}

export type tMoreOption = 'absent' | 'present' | 'active' | 'inActive' | 'sendActivationLink'

export interface IMongoCompartmentListViewStructure {
  columns: {
    [key: string]: IMongoField
  }
}