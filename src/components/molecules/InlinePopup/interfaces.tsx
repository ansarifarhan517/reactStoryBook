import { CSSProperties } from 'styled-components'

export interface IHeaderProps {
  children: JSX.Element | string
  closeButton?: boolean
  handleClose?: () => void
}

export interface IInlinePopupProps {
  isOpen: boolean
  title: string
  onClose?: () => void
  width: number | string
  height: number | string
  style?: CSSProperties
  children: JSX.Element
  content: JSX.Element
  id: string
  className?: string
  draggable?: boolean
}
