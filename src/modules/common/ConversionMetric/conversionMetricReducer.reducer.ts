import { convertArrayToObject } from '../../../utils/helper';
import { IClientMetricSystem, IConversionMetricActions } from './interfaces';


const ConversionMetricReducer = (state: Record<string, IClientMetricSystem> = {}, action: IConversionMetricActions) => {
  switch (action.type) {
    case '@@conversionMetric/SET_CONVERSION_METRIC':
      const metrics= convertArrayToObject(action.payload,'name')
      return {
        ...state,
        ...metrics,
      }

    default:
      return state
  }
}

export default ConversionMetricReducer