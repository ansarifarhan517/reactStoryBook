export interface IMultiSelectDropdownProps {

  title: string
  value?: string
  options: Array<{
    label: string
    value: number | string
  }>
  disabled?: boolean
  invalid?: boolean
  className?: string
  labelMap?: string
  valueMap?: string
  controlClassName?: string
  isRequired: boolean
  onChangeHandler?: (arg0: onChangeHandlerParameter) => void
  name: string
  setOptions: React.Dispatch<React.SetStateAction<Array<{
    label: string
    value: string | number
  }>>>
}

type onChangeHandlerParameter = Record<string, string[]>

export type ISelectedOption = Record<string, string>

export interface IDropdownState {
  selectedOptions: string[]
  deletedOptions: Array<{
    label: string
    value: string | number
  }>
}
