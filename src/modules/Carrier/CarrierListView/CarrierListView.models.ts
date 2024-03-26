import { IClientProperty } from './../../common/ClientProperties/interfaces';

export interface IRowData {
  address: string
  clientCoLoaderId: number
  clientId: number
  clientName: string
  coLoaderName: string
  emailAddress: string
  isActiveFl: boolean
  latitude: any
  linkedBranchCount: number
  longitude: any
  mobileNumber: string
  name: string
  referenceId: string
  shortName: string
  customFieldsJSONString?: string
}



export interface ICarrierListViewDataPayload {
  clientBranchId?: number,
  otherCount?: number,
  totalCount: number,
  results: Array<IRowData>,
  clientProperties?: Record<string, IClientProperty>
}