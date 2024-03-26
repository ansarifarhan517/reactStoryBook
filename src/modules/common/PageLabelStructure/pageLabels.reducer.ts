import { IPageLabelsAction, IPageLabel } from './pageLabels.actions';

const PageLabelsReducer = (state: Record<string, IPageLabel> = {}, action: IPageLabelsAction): Record<string, IPageLabel> => {
  switch (action.type) {
    case '@@pageLabels/FETCH_DATA_SUCCESS':
      return { ...state, ...action.payload }

    case '@@pageLabels/FETCH_DATA_FAILURE':
      return state

    default: return state
  }
}

export default PageLabelsReducer