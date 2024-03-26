import { IClientProperty } from "../common/ClientProperties/interfaces";

export interface IRowData {
  actualMessage: string
  alertDate: number
  alertId: number
  branchId: number
  createdOnDt: number
  deliveryMediumName: string
  deliveryMediumPhoneNumber: string
  destination: string
  isActiveFl: boolean
  isResolved: boolean
  isResolvedFl: string
  name: string
  orderNo: string
  orderStatus: string
  origin: string
  originLatitude: number
  originLongitude: number
  shipmentDetailsId: number
  trackingDate: number
  tripId: number
  notes?: string
}

export interface IAlertsHistoryDataPayload {
  clientBranchId?: number,
  otherCount?: number,
  totalCount: number,
  results: Array<IRowData>,
  clientProperties?: Record<string, IClientProperty>
}

export interface IAlertName {
  alertMasterId: number,
  name: string,
  shortName: string,
}

export interface IOrderStatusLabels {
  clientId: number
  clientRefMasterCd: string
  clientRefMasterDesc: string
  clientRefMasterId: number
  clientRefMasterType: string
  id: number
  isDeleteFl: string
  name: string
  reasonCd: string
}

export interface IVehicleType {
  clientId: number
  clientRefMasterCd: string
  clientRefMasterDesc: string
  clientRefMasterId: number
  clientRefMasterType: string
  id: number
  isDeleteFl: string
  name: string
}

export interface IListViewDataRequestParams {
  pageNumber?: number
  pageSize?: number
  searchBy?: string
  searchText?: string
  sortBy?: string
  sortOrder?: string
  endDateFilter: string | Date
  startDateFilter: string | Date
  access_token?: string
}

export interface IListViewDataRequestData {
  fieldId?: string
  fieldLabelKey?: string
  filterData?: string
  operationLabelKey?: string
  operationSymbol?: string
}

export interface IListViewDataRequestPayload {
  params: IListViewDataRequestParams
  isLoading?: boolean
}