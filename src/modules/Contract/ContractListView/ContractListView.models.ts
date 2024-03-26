import { IClientProperty } from '../../common/ClientProperties/interfaces'

export interface IRowData {
  branchCount: number
  clientCoLoaderId: number
  clientCoLoaderName: string
  clientId: number
  clientName: string
  contractDate: number
  contractExpiryDate: number
  contractId: number
  contractNumber: string
  isActiveFl: boolean
}

export type tContractStatus = 'ALL' | 'ACTIVE' | 'INACTIVE' 

export interface IContractViewDataPayload {
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


export interface IDropdown {
  label: string
  value: number | string
  [key: string]: any
}

export type tContracttypeModes = 'listview'

export interface IPriorityList {
  clientRefMasterType: string
  clientRefMasterCd: string
  clientRefMasterDesc: string
  clientRefMasterId: number
  sequence: number
}

