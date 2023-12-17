import { Dispatch, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { IMetricsData, tGlobalsAction, tMetrics } from '../Globals/globals.actions'
import axios from '../../../utils/axios'
import apiMappings from '../../../utils/apiMapping'
import { ILogiAPIResponse } from '../../../utils/api.interfaces'
import { useTypedSelector } from '../../../utils/redux/rootReducer'

const useMetricsConversion = () => {
  const globalsDispatch = useDispatch<Dispatch<tGlobalsAction>>()
  const metrics = useTypedSelector(state => state.globals.metrics)

  const fetchMetrics = useCallback(async () => {
    try {
      const { data: response } = await axios.get<ILogiAPIResponse<IMetricsData[]>>(apiMappings.common.clientMetric)
      if (response.status === 200) {
        globalsDispatch({
          type: '@@globals/SET_DATA', payload: {
            metrics: response.data.reduce((accumulator, current) => ({ ...accumulator, [current.name]: current }), {})
          }
        })
        return
      }
      throw response
    } catch (error) {
      console.log('Failed to Fetch Metrics Data: ', error, error?.response)
    }
  }, [globalsDispatch])

  const convertMetricsForDisplay = useCallback((value: number = 0, type: tMetrics): string => {
    return (value * metrics[type].conversionFactor).toFixed(metrics[type].precision)
  }, [metrics])
  
  const convertMetricsForSave = useCallback((value: number, type: tMetrics): number => {
    return Number((value * 1.0 / metrics[type].conversionFactor).toFixed(metrics[type].precision))
  }, [metrics])

  return { fetchMetrics, convertMetricsForDisplay, convertMetricsForSave }
}

export default useMetricsConversion
