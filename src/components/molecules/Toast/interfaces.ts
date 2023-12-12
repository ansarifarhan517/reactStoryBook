export interface AppContextInterface {
  add: (content: string, iconVariant: string, removeButton: boolean) => any
  remove: (toastId: string) => any
}
export interface IToastProps {
  children: any
  remove: any
  iconVariant: string
  handlePause?: (e: MouseEvent) => any
  handleResume?: (e: MouseEvent) => any
  removeButton: boolean
}
export interface IWithToastProvider {
  toastId: string
  content: string
  iconVariant: string
  removeButton: boolean
}

export type tRemoveProps = string
