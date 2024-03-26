
export interface IEffectAction {
  [key: string]: any;
}
export interface IRowData {
  isActiveFl: boolean
  compartmentId?: number
  compartmentName: string
  capacityInUnits?: number
  capacityInWeight?: number
  capacityInVolume?: number
  length?: number
  breadth?: number
  height?: number
  temperatureCategoryCd: string
  minTemperature?: number
  maxTemperature?: number
  crateIds? : Array<number>
}
export interface IAllCompartmentDataPayload {
  totalCount: number,
  results: Array<IRowData>,
  listLoading?: boolean
}
export interface IDropdown {
  label: string
  value: number | string
  [key: string]: any
}
export interface IFormFields {
  [key: string]: any
}
export interface IRouteParams {
  compartmentId?: string;
}
export interface IClientMetricSystem {
  conversionFactor: Float32Array
  name: string
  precision: number
}