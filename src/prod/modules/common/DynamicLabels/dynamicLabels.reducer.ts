import { IDynamicLabelsAction } from './dynamicLabels.actions';

const DynamicLabelsReducer = (state: Record<string, string> = {}, action: IDynamicLabelsAction): Record<string, string> => {
  switch (action.type) {
    case '@@dynamicLabels/FETCH_DATA_SUCCESS':
      return { ...state, ...action.payload }

    case '@@dynamicLabels/FETCH_DATA_FAILURE':
      return state

    default: return state
  }
}

export default DynamicLabelsReducer