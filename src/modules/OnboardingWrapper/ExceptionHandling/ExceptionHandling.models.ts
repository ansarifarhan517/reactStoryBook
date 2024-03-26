// import { IMongoFormStructure } from "../../../utils/mongo/interfaces";
export interface IDropDownValue {
    clientId: number
    clientRefMasterCd: string
    clientRefMasterDesc: string
    clientRefMasterId: number
    clientRefMasterType: string
    id: number
    isDeleteFl: string
    name: string
  }

  export interface IEffectAction {
    [key: string]: any;
  }

  export interface IExceptionEvents {
    isActiveFl: boolean;
    exceptionCode: string;
    exceptionName: string;
    exceptionDescription: string;
    exceptionStage: string[],
    appliesTo: string[]
  }

  export interface IRowData {
    isActiveFl: boolean
    exceptionMode: string
    exceptionCode: string
    exceptionName: string
    exceptionType: string
    exceptionStage: string[]
    exceptionAppliesTo: string[]
    exceptionMessage: string
    exceptionGroupId: string
    exceptionStatus?: string
    ignoreSelectAll?: boolean
  }
  
  export interface IAllExceptionsDataPayload {
    clientBranchId?: number,
    otherCount?: number,
    totalCount: number,
    results: Array<IRowData>
  }

  export interface IFormFields {
    [key: string]: any
  }
  
  export const iconsMapping = {
    delete: 'icomoon-delete-empty',
    markAs: 'icomoon-funnel-options'
  }

export interface IDropDownOption {
  clientRefMasterId: number
  clientRefMasterType: string
  clientRefMasterCd: string
  clientRefMasterDesc: string
  clientId: number
  isDeleteFl: string
  reasonCd?: string
  id: number
  name: string
}

export interface ICreatePayload {
  exceptionMode: string;
  exceptionCode: string;
  exceptionName: string;
  exceptionMessage: string;
  exceptionStage: string[];
  exceptionType: string;
  exceptionAppliesTo: string[];
  eventCode?: string
  exceptionGroupId?: string
  applyToConstituents ?: boolean
  displayOnTrackingLink?: boolean
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
  eventCode?: string
  applyToConstituents ?: boolean
  displayOnTrackingLink?: boolean
}

export interface IExceptionHandlingRouteParams {
  exceptionGroupId?: string;
}

export type ViewTypes = 'addExceptionForm' | 'allExceptions' | string

export type tBreadcrumbState = 'allExceptions' | 'closedExceptions' | 'openExceptions' | 'rejectedExceptions'

export interface IOrderException {
  id: string
  moduleName: string
  moduleId: number
  orderNo: string
  moduleStatus: string
  origin: string
  destination: string
  exceptionGroupId: string
  exceptionCode: string
  exceptionName: string
  exceptionMessage: string
  exceptionStatus: string
  clientId: number
  isDeleteFl: boolean
  isActiveFl: boolean
  createdOnDt: number
  createdByUserId: number
}

export interface IOrderExceptionsListData {
  clientBranchId?: number,
  otherCount?: number,
  totalCount: number,
  results: Array<IRowData>
}

export const exceptionStatusMapping = {
  allExceptions: "ALL",
  openExceptions: 'OPEN',
  closedExceptions: 'CLOSED',
  rejectedExceptions: 'REJECTED'
}

export interface IManifestsException {
  id: string
  moduleName: string
  moduleId: number
  manifestId: string
  moduleStatus: string
  exceptionGroupId: string
  exceptionCode: string
  exceptionName: string
  exceptionMessage: string
  exceptionStatus: string
  clientId: number
  isDeleteFl: boolean
  isActiveFl: boolean
  createdOnDt: number
  createdByUserId: number
}

export interface IManifestsExceptionsListData {
  clientBranchId?: number
  otherCount?: number
  totalCount: number
  results: Array<IRowData>
}

export const orderStatusMappings = {
  DELIVERED: "Delivered",
  INTRANSIT: "Intransit",
  NOTDISPATCHED: "Not Dispatched",
  PICKEDUP: "Picked Up",
  NOTPICKEDUP: "Attempted Pickup",
  NOTDELIVERED: "Attempted Delivery",
  CANCELLED: "Cancelled",
  DELIVER: "Delivery",
  FORWARD: "Forward",
  REVERSE: "Reverse",
  RTM: "RTM",
  PICKUP: "Pickup",
  DELIVERYLOCATION: "Delivery Location",
  PICKUPLOCATION: "Pickup Location",
  STARTED: "Started",
  NOTSTARTED: "Not Started",
  ENDED: "Ended",
  ARRIVED: "Arrived"
}

export const exceptionStatusMappingCell = {
  OPEN: 'open_s',
  CLOSED: 'closed_s',
  REJECTED: 'rejected_s'
}

export const exceptionTypeMapping = {
  Informational: 'Informational',
  Restrictive: 'Action Required'
}

export interface ILocalStorageEntries {
  [key: string] : any
}