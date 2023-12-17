type AlertCategory = 'error' | 'warning' | 'info' | 'success'

export type IAlertProps = {
  title?: string
  message: string
  category: AlertCategory
  className?: string
  isCloseable?: boolean
  onCloseHandler?: (e: React.MouseEvent) => void
}

export type IIconCodes = {
  error: string
  warning: string
  info: string
  success: string
}
