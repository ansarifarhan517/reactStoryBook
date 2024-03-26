import { IConversionMetricActions } from './interfaces';
import { useDispatch } from 'react-redux';
import { useEffect, Dispatch } from "react"
import { useTypedSelector } from "../../../utils/redux/rootReducer"
import apiMappings from "../../../utils/apiMapping"
import axios from "../../../utils/axios"

const useClientProperties = () => {

  const conversionMetric = useTypedSelector(state => state.conversionMetric)
  const dispatch = useDispatch<Dispatch<IConversionMetricActions>>()

  const fetchConversionMetric = async () => {
    try {
      const { data: { data, status } } = await axios.get(apiMappings.common.clientMetric)
      if (status === 200) {
        dispatch({ type: '@@conversionMetric/SET_CONVERSION_METRIC', payload: data })
        return
      }
      throw status
    } catch (error) {
      console.log('Failed to Fetch Conversion Metric: ', )
    }
  }
  useEffect(() => {
      fetchConversionMetric()
  }, [])

  return conversionMetric
}

export default useClientProperties