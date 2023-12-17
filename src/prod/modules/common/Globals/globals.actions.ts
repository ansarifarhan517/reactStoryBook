export type tMetrics = 'weight' | 'volume' | 'distance' | 'speed' | 'dimension'

export interface IMetricsData {
  name: string
  conversionFactor: number
  precision: number
}
export interface IGlobalsState {
  maintenanceMsg?: string
  metrics: Record<string, IMetricsData>
  [key: string]: any
  clientBranches: any
}

export interface ISetData {
  type: '@@globals/SET_DATA',
  payload: Partial<IGlobalsState>
}
export interface ISetClientBranchData {
  type: '@@globals/SET_CLIENT_BRANCH_DATA',
  payload: Array<any>
}


export type tGlobalsAction =
  | ISetData
  | ISetClientBranchData