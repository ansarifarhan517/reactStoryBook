import { HTMLAttributes } from 'react'

export interface IFilterMultiselectOption {
  /** Unique Identifier */
  id: string
  /** Display Label */
  label: string
  /** Value that an option holds */
  value: any
  /** Default Checked */
  checked?: boolean
}

export interface IFilterMultiselectProps
  extends HTMLAttributes<HTMLDivElement> {
  label?: string
  options?: IFilterMultiselectOption[]
  onSelectionChange?: (
    id: string,
    checked: boolean,
    options: IFilterMultiselectOption[],
    selectedOptions: IFilterMultiselectOption[]
  ) => void
}
