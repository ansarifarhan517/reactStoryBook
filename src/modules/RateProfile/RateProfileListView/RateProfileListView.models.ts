import { IClientProperty } from '../../common/ClientProperties/interfaces';



export interface IRowData {
  createdOnDt?: number
  description?: string
  isActiveFl?: boolean
  name?: string
  rateProfileId: number
  [key:string]: any
}

export interface IRateProfileListViewDataPayload {
  clientBranchId?: number
  otherCount?: number
  totalCount: number
  results: Array<IRowData>
  clientProperties?: Record<string, IClientProperty>
}

export interface ICustomField {
  type: string
  field: string
  value: any
}
