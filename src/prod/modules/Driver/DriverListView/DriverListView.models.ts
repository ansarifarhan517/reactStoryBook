import { IClientProperty } from './../../common/ClientProperties/interfaces';

export interface IRowData {
  attendance?: string
  clientBranchName?: string
  driverId: number
  driverName?: string
  gpsStatus?: string
  isActiveFl?: boolean
  isPresent?: boolean
  phoneNumber?: string
  status?: string
  workHour?: number
  customFieldsJSONString?: string
}

export interface IDriverListViewDataPayload {
  clientBranchId?: number,
  otherCount?: number,
  totalCount: number,
  results: Array<IRowData>,
  clientProperties?: Record<string, IClientProperty>
}

export interface ICustomField {
  type: string,
  field?: string,
  value: any
}