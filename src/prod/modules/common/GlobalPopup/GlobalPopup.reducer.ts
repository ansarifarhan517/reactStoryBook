interface IPopupProps {
  isOpen?: boolean
  title?: string
  onClose?: () => void
  footer?: React.ReactNode
  content?: React.ReactNode
  width?: string,
  size?: "sm" | "md" | "lg" | undefined
}
export type IGlobalPopupProps = undefined | IPopupProps

export interface ISetPopupPropsAction {
  readonly type: '@@globalPopup/SET_PROPS',
  payload?: IGlobalPopupProps
}
export interface IClosePopupAction {
  readonly type: '@@globalPopup/CLOSE_POPUP',
}

export interface IOpenPopupAction {
  readonly type: '@@globalPopup/OPEN_POPUP',
}

export type tGlobalPopupAction = ISetPopupPropsAction | IClosePopupAction | IOpenPopupAction
export const GlobalPopupReducer = (state: IGlobalPopupProps = {}, action: tGlobalPopupAction) => {
  switch (action.type) {
    case '@@globalPopup/SET_PROPS':
      return action.payload

    case '@@globalPopup/OPEN_POPUP':
      return { ...state, isOpen: true }

    case '@@globalPopup/CLOSE_POPUP':
      return { ...state, isOpen: false }

    default:
      return state
  }
}