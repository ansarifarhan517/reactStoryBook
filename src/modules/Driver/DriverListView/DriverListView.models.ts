import { IClientProperty } from './../../common/ClientProperties/interfaces';
import { IListViewRow } from 'ui-library'

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

export interface ILoadingObject {
  loading : boolean
  inputVal: boolean
}

export interface IDriverListData {
  clientBranchId: number
  otherCount : number
  results: IListViewRow[]
  totalCount : number
}