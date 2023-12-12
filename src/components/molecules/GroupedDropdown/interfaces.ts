import { ValueType, OptionTypeBase as OptionType } from 'react-select'

export interface ICategory {
  id: string
  label: string
  value: string
  [key: string]: string
}

export interface ICategoryData {
  id: string
  categoryId: string
  [key: string]: any
  hideInAll?:boolean
}

export interface IData {
  category: ICategory[]
  data: {
    [key: string]: ICategoryData[]
  }
}

export interface IGroupedDropdownProps {
  data: ICategoryData[]
  category: ICategory[]
  width?: string
  height?: string
  handleOnChange: (data: ValueType<OptionType>, category: ICategory) => void
  searchFieldLabel?: string
  searchFieldPlaceholder?: string
  allLabel?: string
}

export interface IGroupedDropdownWrapper
  extends React.HTMLAttributes<HTMLDivElement> {
  width?: string
  height?: string
}

export interface ICategoryProps {
  category: ICategory[]
  onTabChange: (id: string) => void
  currentCategory: string
}

export interface IListProps {
  options?: ICategoryData[]
  value?: ICategoryData
  onChange: (value: ICategoryData) => void
  placeholder: string
  label: string
}
