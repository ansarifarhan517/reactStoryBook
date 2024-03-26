import { IDynamicLabelsAction } from './dynamicLabels.actions';
import { useEffect, Dispatch } from 'react';
// import DYNAMIC_LABELS_MAPPING from './dynamicLabels.mapping';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../../utils/redux/rootReducer';


const useDynamicLabels = (key: string) => {
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
  const dispatch = useDispatch<Dispatch<IDynamicLabelsAction>>()

  useEffect(() => {
    const labelKeys = key

    if (!labelKeys) {
      return
    }

    const labelKeysList: string[] = labelKeys.split(',')

    /** Store existing labels from Session storage */
    const labelSet: Record<string, string> = {}

    /** Store keys for fetching from Backend */
    const labelKeysForAPI: string[] = []

    /** Populate labelSet & labelKeysForAPI */
    labelKeysList.forEach((labelKey) => {
      const labelValueFromSessionStorage = window?.sessionStorage?.[`logiLabels_${labelKey}`] && window?.sessionStorage?.[`logiLabels_${labelKey}`]
      if (labelValueFromSessionStorage) {
        labelSet[labelKey] = labelValueFromSessionStorage
      } else {
        labelKeysForAPI.push(labelKey)
      }
    })

    /** Set data in redux from Session Storage */
    if (Object.keys(labelSet).length) {
      dispatch({ type: '@@dynamicLabels/FETCH_DATA_SUCCESS', payload: labelSet })
    }

    /** Dispatch Action to fetch label from Backend & cache them in Session Storage */
    if (labelKeysForAPI.length) {
      dispatch({ type: '@@dynamicLabels/FETCH_DATA', payload: labelKeysForAPI.join(',') })
    }

  }, [key])

  return dynamicLabels
}

export default useDynamicLabels