import { ReactNode } from 'react'

export interface tDropDownOptions {
  id: string
  label: string | number
  labelKey?: string | number
  value: string | number
  fieldType?: string
  [key: string]: string | number | undefined
}

export interface tFieldTypeObject {
  [key: string]: tTypeObject[]
}

export interface tTypeObject {
  operation: string
  operationSymbol: string
  labelKey?: string
  label: string
  value: string
}

export interface IFilter {
  id: string
  multiFilter?: string[]
  isFavourite?: boolean
  favouriteSections?: string[]
  filterName?: string
  filterObject?: IDropdownData[]
  filterMasterCondition?: string
  filterSortable?: boolean
  filterApplied?: boolean
  sortable?: {
    columnName?: tDropDownOptions | string
    sortOrder?: tDropDownOptions | string
  }
  allowSort?: boolean
  advanceFilterTagReferenceIds?: string[]
}

export interface IDropdownData {
  columnName?: string | Object
  operationType?: string | Object
  element?: string
  value?: string | number
  label?: string | number
}

export interface IThirdElementValue {
  type: string
  [key: string]: any
}

export interface IAdvancedFilter {
  id?: any
  chipsArray: IFilterData[]
  dropDownOptions: IColumnsStructure
  fieldOperation: IOperationTypes
  masterCondition?: boolean
  backButton?: boolean
  backButtonCallback?: () => void
  children: ({ open, setOpen, chips }: tAdvancedFilterChildren) => ReactNode
  onApply?: (filter: IExposeFilters) => void
  onRemove?: (id: string) => void
  onDelete?: (id: string) => void
  onSave?: (filter: IExposeFilters) => void
  onUpdate?: (filter: IExposeFilters) => void
  onFavourite?: (filter: IFilterData) => void
  onAddFilter?: () => void
  onAddCondition?: () => void
  ThirdElement: React.ComponentType<IThirdElementProps>
  style?: React.CSSProperties
  allowFavourites?: boolean
  allowSort?: boolean
  allowMultipleFilters?: boolean
  showOpen?: boolean
  // tooltip props
  saveTooltip?: string
  duplicateTooltip?: string
  cancelTooltip?: string
  removeFavouriteTooltip?: string
  markAsfavouriteTooltip?: string
  appliedFilterId?: string
  ThirdElementFormatter?: (data: IThirdElementValue) => void
}

export interface tAdvancedFilterChildren {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  chips?: IFilter[]
}

export interface IAdvancedFilterCardHeader {
  id: string
  label: string
  name?: string
  setName?: (name: string) => void
  save?: () => void

  favourite?: () => void
  allowFavourites?: boolean
  isFavourite?: boolean
  duplicate?: () => void
  close?: () => void
  // tooltip
  saveTooltip?: string
  duplicateTooltip?: string
  cancelTooltip?: string
  favouriteTooltip?: string
}

export interface IThirdElementProps {
  columnName: string | tDropDownOptions
  operationType: string | tTypeObject
  value: any
  setValue: any
  fieldType?: string
  label?: any
  setLabel?: any
}

export interface IHashSetColumnsData {
  [key: string]: tDropDownOptions
}
export interface IAdvancedFilterBodyProps {
  columnsData: tDropDownOptions[]
  HSetColumnData: IHashSetColumnsData
  fieldOperation: tFieldTypeObject
  chipsArray?: IFilter[]
  handleDelete?: (id: string) => void
  newFilterCard?: boolean
  setNewFilterCard?: (status?: boolean) => void
  showCard?: boolean
  setShowCard?: (status?: boolean) => void
  clearCard?: number
  handleUpdateAndSave?: (filter: IRawExposedData) => void
  onFavourite?: (filter: IRawExposedData) => void
  openCard?: (filter: IFilter) => void
  updateData?: (filters: IRawExposedData) => void
  onAddCondition?: () => void
  masterCondition?: boolean
  sortDropdown?: tDropDownOptions[]
  ThirdElement: React.ComponentType<IThirdElementProps>
  allowFavourites?: boolean
  allowSort?: boolean
  allowMultipleFilters?: boolean
  // tooltip props
  saveTooltip?: string
  duplicateTooltip?: string
  cancelTooltip?: string
  removeFavouriteTooltip?: string
  markAsfavouriteTooltip?: string
  showCardId?: string
  ThirdElementFormatter?: (data: IThirdElementValue) => void
}
export interface IFilterConditions {
  id: string
  readMode?: boolean
  dropdownOptions: string
  operationalOptions: {
    options: tTypeObject[] | null
    value: string
    operationSymbol?: string
    operation?: string
  }
  thirdElement: {
    type: ReactNode | JSX.Element | undefined
    value: any
    label:any
  }
  fieldType?: string
}

/** *** Raw Data interfaces *****/

// Pre defined Filters
export interface IExposedFilters {
  fieldId?: string
  filterData?: string | Record<string, string>
  operationSymbol?: string
  operationLabelKey?: string
  fieldLabelKey?: string | number
  customField?: boolean
}

export interface IExposeFilters {
  id?: string
  filterName: string
  isFavourite?: boolean
  filters: IExposedFilters[]
  operationLogic?: string
}

export interface IRawExposedData {
  filterData: IFilter
  filterConditions: IFilterConditions[]
}
export interface IFilterData {
  id: string
  filterName: string
  ownerUserId?: number
  pageName?: string
  sectionName?: string
  userGroupId?: number[]
  userIds?: number[]
  operationLogic?: string
  advanceFilterTagReferenceIds?: string[]
  filters?: IExposedFilters[]
  sortCriteria?: IExposedFilters[]
  isFavourite?: boolean
  favouriteSections?: string[] | never[]
  filterApplied?: boolean
  [key: string]: any
}

// operation Types
export type tOperations = {
  operation: string
  operationSymbol: string
  labelKey: string
  labelValue: string // visible on dropdown
}
export interface IOperationTypes {
  [key: string]: tOperations[]
}

export interface IColumnsStructure {
  [key: string]: IColumnObject
}

export interface IChildNode {
  id?: string
  label?: string
  childLength?: number
  childNodes?: IEmptyChildNode
  customField?: boolean
  searchable?: boolean
  sortable?: boolean
  fieldName?: string
  fieldType?: string
  [key: string]: any
}
export type IEmptyChildNode = {}
// column Structure
export interface IColumnObject {
  id: string
  label: string
  childLength?: number
  fieldName?: string
  fieldType?: string
  childNodes?: IEmptyChildNode | IChildNode
  customField?: boolean
  searchable?: boolean
  sortable?: boolean
  [key: string]: any
}
