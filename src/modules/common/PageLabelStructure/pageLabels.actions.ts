export interface IPageLabel {
  allowed: boolean
  buttons: Record<string, string>
  format: string
  upload: string
  childLength: number
  colSpan: number
  customField: boolean
  descLabel: string
  editable: boolean
  excelDropDownHidden: boolean
  infoFlag: boolean
  isTitleDropdown: boolean
  label: string
  pageTitle: string
  permission: boolean
  required: boolean
  rowSpan: number
  searchable: boolean
  sortable: boolean
  viewOptions: Record<string, string>
  dropdownValues?: object
}

export interface IPageLabelsFetchSuccessAction {
  type: '@@pageLabels/FETCH_DATA_SUCCESS'
  payload: Record<string, IPageLabel>
}

export interface IPageLabelsFetchFailureAction {
  type: '@@pageLabels/FETCH_DATA_FAILURE'
}

export interface IPageLabelsFetchAction {
  type: '@@pageLabels/FETCH_DATA'
}

export type IPageLabelsAction =
  | IPageLabelsFetchAction
  | IPageLabelsFetchSuccessAction
  | IPageLabelsFetchFailureAction