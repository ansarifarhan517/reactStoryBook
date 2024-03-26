export interface IGlobalToastState {
  message?: string,
  icon?: string,
  remove?: boolean
}

export interface IGlobalToastAdd {
  readonly type: '@@globalToast/add'
  payload: IGlobalToastState
}

export interface IGlobalToastClear {
  readonly type: '@@globalToast/clear'
}

export type tGlobalToastActions = IGlobalToastAdd | IGlobalToastClear
const GlobalToastReducer = (state: IGlobalToastState = {}, action: tGlobalToastActions): IGlobalToastState => {
  switch (action.type) {
    case '@@globalToast/add':
      return action.payload

    case '@@globalToast/clear':
      return {}

    default: return state
  }
}

export default GlobalToastReducer