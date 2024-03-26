export interface IDynamicLabelsFetchSuccessAction {
  type: '@@dynamicLabels/FETCH_DATA_SUCCESS'
  payload: Record<string, string>
}

export interface IDynamicLabelsFetchFailureAction {
  type: '@@dynamicLabels/FETCH_DATA_FAILURE'
}

export interface IDynamicLabelsFetchAction {
  type: '@@dynamicLabels/FETCH_DATA'
  payload: string
}

export type IDynamicLabelsAction = 
| IDynamicLabelsFetchAction 
| IDynamicLabelsFetchSuccessAction 
| IDynamicLabelsFetchFailureAction