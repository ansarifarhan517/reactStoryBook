
export interface IClientMetricSystem {
  conversionFactor: Float32Array
  name: string
  precision: number
}

/** Actions */
export interface ISetMetricSystemAction {
  readonly type: '@@conversionMetric/SET_CONVERSION_METRIC'
  payload: IClientMetricSystem[]
}

export type IConversionMetricActions =
  | ISetMetricSystemAction