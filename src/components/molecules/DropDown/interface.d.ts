import { ReactNode } from 'react'
import { InputActionMeta, ValueType } from 'react-select'
import { tIntent } from '../../atoms/Button'
import { ITooltipProps } from '../Tooltip'

export type tSelectVariant =
  | 'form-select'
  | 'bread-crumb'
  | 'list-view'
  | 'default-select'
  | 'pagination-size'
  | 'button-dropdown'
  | 'column-filter'
  | 'date-picker'
  | 'default-dropdown'
  | 'inline-edit'
  | 'dashed-dropdown'
  | 'multilevel-breadcrumb'

export interface dropdownPosition {
  left: string
  top: string
}

export interface ISelectFieldProps
  extends React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
  > {
  fullWidth?: boolean
  error?: boolean
}
interface ISelectProps extends ISelectFieldProps{
  id?:string
  isSortable?: boolean
  disabled?: boolean
  variant: tSelectVariant
  optionList: Array<OptionType>
  label?: string
  labelColor?: string
  required?: boolean
  error?: boolean
  errorMessage?: string
  placeholder?: string
  loading?: boolean
  menuIsOpen?: boolean
  onChange?: (id: string | undefined) => void
  handleClick?: (id: string | undefined) => void
  value?: string
  width?: string
  primary?: boolean
  intent?: tIntent
  isMenuOpen?: boolean
  iconButtonDetails?: string[]
  isSingleClickOption?: boolean
  showDownArrow?: boolean
  isMultiRegionStyled?: boolean
  onMenuOpen?: () => void
  onMenuClose?: () => void
  children?: ({
    selectedOption,
    menuIsOpen,
    setMenuIsOpen
  }: IUniversalDropdownChildren) => ReactNode
  optionComponent?: ReactNode
  customStyle?: any
  onInputChange?: (newValue: string, actionMeta: InputActionMeta) => void
  showDescription?: boolean
  tooltipMessage?: string
  tooltipProps?: Omit<ITooltipProps, 'children'>
  showOptionIcon?: boolean
  dropdownPosition?: dropdownPosition
  onSetAsFavourite?: (favourite: OptionType) => void
  showDropdownIndicator?: boolean
  showNoDataText?: boolean
  showCrossIcon?: boolean
  limitOptionsList?: number
  defaultOpen?: 'right' | 'left'
  align?: "right" | "left" | "center" | undefined
  withIcon?: boolean,
  iconVariant?: string
  iconSize?: number | 'sm' | 'xs' | 'md' | 'lg' | 'xl'
  iconStyle?: React.CSSProperties
  iconBorder?: boolean
  onIconClick?: ((
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void) &
  ((event: React.MouseEvent<HTMLSelectElement, MouseEvent>) => void)
  id?:any
}

export type OptionType = {
  value: string
  label: string
  iconVariant?: string
  color?: color
  isFavourite?: boolean
  [key: string]: any
  options?: OptionType[]
}

export interface IDefaultProps extends ISelectFieldProps{
  options: OptionType[]
  isLoading?: boolean
  placeholder?: string
  onInputChange?: (newValue: string, actionMeta: InputActionMeta) => void
  onChange?: (input: ValueType<OptionType>) => void
  onFocus?: () => void
  isSearchable?: boolean
  variant: tSelectVariant
  primary?: boolean
  intent?: tIntent
  iconButtonDetails?: string[]
  value?: ValueType<OptionType>
  isMenuOpen?: boolean
  onMenuOpen?: () => void
  onMenuClose?: () => void
  customStyle?: any
  tooltipMessage?: string
  disabled?: boolean
  tooltipProps?: Omit<ITooltipProps, 'children'>
  labelColor?: string
  limitOptionsList?: number
  arrowPlacement?: "end" | "start" | "center" | undefined
  messagePlacement?: "end" | "start" | "center" | undefined
  tooltipDirection?: "top" | "bottom" | "right" | "left" | undefined
  align?:  "right" | "left" | "center" | undefined
  withIcon?: boolean,
  iconVariant?: string
  iconSize?: number | 'sm' | 'xs' | 'md' | 'lg' | 'xl'
  iconStyle?: React.CSSProperties,
  iconBorder?: boolean,
  onIconClick?: ((
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void) &
  ((event: React.MouseEvent<HTMLSelectElement, MouseEvent>) => void)
}
interface IFormSelect {
  error: boolean
  errorMessage: string
  label: string
  required: boolean
  defaultProps: IDefaultProps
  showDescription?: boolean
  showDropdownIndicator?: boolean
  showNoDataText?: boolean
  showCrossIcon?: boolean
  isSortable ?: boolean
}

interface IListView {
  setIsCrossVisible: (isCrossVisible: boolean) => void
  isCrossVisible: boolean
  defaultProps: IDefaultProps
  handleCloseChange: (event: any) => void
}

interface IButtonDropdown {
  width?: string
  defaultProps: IDefaultProps
  theme: any
}
export type IUniversalDropdownChildren = {
  selectedOption: OptionType
  menuIsOpen: boolean
  setMenuIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export interface IIconDropdown {
  id?:string
  variant: tSelectVariant
  primary?: boolean
  placeholder?: string
  intent?: tIntent
  iconButtonDetails?: string[]
  options: OptionType[]
  value: ValueType<OptionType>
  width: string
  theme: any
  onChange?: (input: ValueType<OptionType>) => void
  showDownArrow?: boolean
  optionComponent: ReactNode
  children?: ({
    selectedOption,
    menuIsOpen,
    setMenuIsOpen
  }: IUniversalDropdownChildren) => ReactNode
  customStyle?: any
  menuIsOpen?: boolean
  tooltipMessage?: string
  disabled?: boolean
  tooltipProps?: Omit<ITooltipProps, 'children'>
  showOptionIcon?: boolean
  dropdownPosition?: dropdownPosition
  isMultiRegionStyled?: boolean
  onSetAsFavourite?: (option: OptionType) => void
  id?: any
}

export interface IIconMultilevelDropdown {
  variant: tSelectVariant
  primary?: boolean
  placeholder?: string
  intent?: tIntent
  iconButtonDetails?: string[]
  options: any
  value: ValueType<any>
  width: string
  theme: any
  handleClick?: any
  showDownArrow?: boolean
  optionComponent: ReactNode
  children?: ({
    selectedOption,
    menuIsOpen,
    setMenuIsOpen
  }: IUniversalDropdownChildren) => ReactNode
  customStyle?: any
  menuIsOpen?: boolean
  tooltipMessage?: string
  disabled?: boolean
  tooltipProps?: Omit<ITooltipProps, 'children'>
  defaultOpen?: 'right' | 'left'
  id?: any
}