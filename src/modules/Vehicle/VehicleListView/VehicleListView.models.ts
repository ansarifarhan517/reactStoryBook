import { IMongoField } from '../../../utils/mongo/interfaces';
import { IClientProperty } from '../../common/ClientProperties/interfaces';


export interface IRowData {
  customFieldsJSONString: any
  branchDescription?:string
  branchName:string
  capacityInUnits: number
  capacityInVolume: number
  capacityInWeight: number
  engineNumber: string
  gpsStatus: string
  isActiveFl: boolean
  minCapacityUtilizationInUnits: number
  minCapacityUtilizationInVolume: number
  minCapacityUtilizationInWeight: number
  ownership:string
  referenceId: string
  skillSet:string[]
  status: string
  transporter: string
  vehicleId: number
  vehicleNumber: string
  vehiclePermit:string
  vehicleType: string
  vehicleMake?: string
  vehicleModel?: string
  typeOfBody?: string
  batteryPercentage?:string
  lat?: number
  lng?: number
  lastTrackingDate?: number
  deviceId?: tDeviceId
  speed?:number
  linkedDeviceId?:number
  linkedBarcode?: string
  ignition?:string
  driverPhoneNumber?:string
  minSpeed?:number
  maxSpeed?:number
  minTemperature?:number
  maxTemperature?:number
}

export type tDeviceId = {
  deviceId: number,
  barcode: string,
  trackeeId: string
    
}
export interface IVehicleListViewDataPayload {
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

export interface IMongoCompartmentListViewStructure {
  columns: {
    [key: string]: IMongoField
  }
}
export interface ITrackerViewRequestPayload {
  pageNumber?: number
  pageSize?: number
  searchBy?: string
  searchText?: string
  sortBy?: string
  sortOrder?: string
  filterDataList?: any
  isLoading?: boolean
  page?: string
  status?: string,
  filter?: string,
  vehicleId?: number
}
export type tBreadcrumbState = 'All' | 'Available' | 'Intransit' | 'Inactive' 