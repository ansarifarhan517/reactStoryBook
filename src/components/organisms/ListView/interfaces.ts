import { IIconButtonProps } from './../../atoms/IconButton/index'
import { Column, Cell, ColumnInstance, SortingRule } from 'react-table'
import { ComponentType, Dispatch, SetStateAction } from 'react'

export interface IActionBar {
  ActionBar?: JSX.Element
  NoDataFound?: JSX.Element
  IconBar?: JSX.Element
}

export interface ISortOptions {
  sortBy?: string
  sortOrder?: string
}

export interface IFetchDataOptions {
  pageSize?: number
  pageNumber?: number
  sortOptions?: ISortOptions
  filterOptions?: IFilterOptions
  apis?: {
    setSelection: React.Dispatch<React.SetStateAction<ISelectedRows>>
    resetSelection: () => void
  }
  isPaginationChange?: boolean
}

export interface IListViewColumn {
  accessor: string
  Header: string
  isSortable?: boolean
  isEditable?: boolean
  isFilterable?: boolean
  isVisible?: boolean
  Cell?: ComponentType<Cell>
  EditableCell?: ComponentType<Cell>
  Filter?: ComponentType<IFilterProps>
  infoTip?: string
  cellCallback?: Function
  [key: string]: any
}

export interface IListViewRow {
  isSelected?: string
  hasSelectionDisabled?: boolean
  ignoreSelectAll?: boolean
  checkboxTooltipText?: string
  editIconButtonProps?: IIconButtonProps
  [key: string]: any
}
export interface IListViewProps extends React.HTMLAttributes<HTMLDivElement> {
  columns: Array<IListViewColumn>
  data: Array<IListViewRow>
  totalRows?: number
  totalActualCount?: number
  rowIdentifier?: string
  isColumnLoading?: boolean
  isTotalCountLoading?: boolean
  moreResultsExists?: boolean
  loading?: boolean
  isEditMode?: boolean
  disableNext?: boolean
  children?: IActionBar
  hasRowSelection?: boolean
  hasSelectAllRows?: boolean
  hasRowSelectionWithEdit?: boolean
  permanentColumns?: Record<string, boolean>
  onRowEditClick?(row: IListViewRow): void
  onRowSelect?(selectedRows: ISelectedRows): void
  onFetchData?(options: IFetchDataOptions): void
  onSaveColumnPreferences?(
    visibleColumnIds: Record<string, ColumnInstance<IListViewColumn>>
  ): void
  paginationPageSize?: number
  disableScrollOverlay?: boolean
  labels?: {
    columnSelectionExceedingLimit?: string
  }

  /** GA Callbacks */
  onShowMoreColumns?: () => void
  onApply?: (selectedColumns: Record<string, boolean>) => void
  onPageChange?: (pageNumber: number, pageSize: number) => void

  /** Filter Persistence Props */
  filters?: Record<string, string>
  onFilterChange?: (
    combinedFilters: IFilterOptions,
    filters: Record<string, string>
  ) => void

  /** Sort Persistence Props */
  sorts?: SortingRule<object>[]
  onSortChange?(
    sortOptions: ISortOptions,
    sortObject?: SortingRule<object>[]
  ): void

  hideRefresh?: boolean
  hideColumnSettings?: boolean
  hidePaginationBar?: boolean
  hideToolbar?: boolean
  heightBuffer?: number
  rowSelectionResetter?: number

  /** Internal Callbacks */
  onResize?: () => void

  // show Radio instead of checkbox
  hasRadioSelection?: boolean

  // show Favourite Star
  showFavouriteStar?: boolean
}

export interface ISelectedRows {
  [key: string]: Record<string, any>
}
export interface IFilterOptions {
  searchBy?: string
  searchText?: string
}

export interface ITextFieldProps {
  id: string
  type: string
  // value: string
  // onChange?: (e: React.FormEvent<HTMLInputElement>) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onClear: () => void
}

export interface ISelectFieldProps {
  id: string
  type: string
  value: any
  onChange?: (value: string | undefined) => void
  // onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export interface IFilterProps {
  textFieldProps?: ITextFieldProps
  selectFieldProps?: ISelectFieldProps
  filters: Record<string, string>
  setFilters: Dispatch<SetStateAction<Record<string, string>>>
}

export interface ICustomFiltersInstance {
  filters: Record<string, string>
  setFilters: Dispatch<SetStateAction<Record<string, string>>>
  getTextFieldProps(column: Column): ITextFieldProps
  getSelectFieldProps(column: Column): ISelectFieldProps
  combinedFilterOptions(): IFilterOptions
  resetFilters(): void
}

export interface IResizerProps extends React.HTMLAttributes<HTMLDivElement> {
  isResizing: boolean
}

export interface IPinnedColumn {
  offset: number
  width: number
}
export interface IPinnedColumnState {
  left: Record<string, IPinnedColumn>
  right: Record<string, IPinnedColumn>
}

export interface IPinnedColumnTotalWidthState {
  left: number
  right: number
}

export interface IPinnedColumnProps
  extends React.HTMLAttributes<HTMLDivElement> {
  pinnedColumn?: IPinnedColumn
  direction?: 'left' | 'right'
  columnId?: string
}

export interface IEditableCellProps extends Cell {
  error?: boolean
}
