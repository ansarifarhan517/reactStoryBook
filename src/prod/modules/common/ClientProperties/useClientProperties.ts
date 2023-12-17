import { IClientPropertyActions } from './interfaces';
import { useDispatch } from 'react-redux';
import { useEffect, Dispatch } from "react"
import { useTypedSelector } from "../../../utils/redux/rootReducer"
import apiMappings from "../../../utils/apiMapping"
import axios from "../../../utils/axios"

const useClientProperties = (keys: string[]) => {

  const clientProperties = useTypedSelector(state => state.clientProperties)
  const dispatch = useDispatch<Dispatch<IClientPropertyActions>>()

  const fetchProperties = async (keysToBeFetched: string[]) => {
    try {
      const { data: { data, status } } = await axios.get(apiMappings.common.clientProperty, { params: { propertyKey: keysToBeFetched.join(',') } })
      if (status === 200) {
        dispatch({ type: '@@clientProperties/SET_PROPERTIES', payload: data })
        return
      }
      throw status
    } catch (error) {
      console.log('Failed to Fetch Client Properties: ', keysToBeFetched, error)
    }
  }
  useEffect(() => {
    const keysToBeFetched = keys.filter(key => !clientProperties?.[key])
    if (keysToBeFetched.length) {
      fetchProperties(keysToBeFetched)
    }
  }, [])

  return clientProperties
}

export default useClientProperties