import { IClientProperty } from '../../common/ClientProperties/interfaces';


export interface IRowData {
  employeeId : string;
  fullName : string;
  emailId : string;
  contactNumber : string;
  clientBranchName : string;
  status : string;
}

export type tDeviceId = {
  deviceId: number,
  barcode: string,
  trackeeId: string
    
}
export interface IHiredDeliveryMediumListViewDataPayload {
  clientBranchId?: number;
  otherCount?: number;
  totalCount: number;
  results: Array<IRowData>;
  clientProperties?: Record<string, IClientProperty>;
}

export interface ICustomField {
  type: string;
  field: string;
  value: any;
}

export interface IBranchName {
  branchDescription :string
  canonicalId?:string
  clientNodeId?: number
  gmtoffset?: string
  id: number
  branchId?: number
  name?: string
  label?: string
  value?: string
  timezoneId: number
}

export interface IClientMetricSystem {
  conversionFactor: Float32Array
  name: string
  precision: number
}


export type tBreadcrumbState = 'All' | 'Available' | 'Intransit' | 'Inactive' 