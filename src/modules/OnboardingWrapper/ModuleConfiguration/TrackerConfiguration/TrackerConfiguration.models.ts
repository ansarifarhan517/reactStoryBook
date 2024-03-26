import { IFetchDataOptions  } from 'ui-library'
export interface IEffectAction {
  [key: string]: any;
}
export interface IRowData {
  isActiveFl?: boolean
  ownership?: string
  supplierRefCd?: string
  supplierRefId?: number
  trackerConfigId: number
  trackerModel?: string
  trackerTypeRefCd?: string
  trackerTypeRefId?: number
  clientRefMasterId?:number
  clientRefMasterCd?: string
}
export interface ITrackerConfigDataPayload {
  totalCount: number,
  results: Array<IRowData>,
  listLoading?: boolean
}
export interface IActiveDeactiveConfirmation {
  setShowActivateDeactivateModal : Function
  fetchOptions : IFetchDataOptions
  handleFetchData: Function
  statusChangeData: any
  setStatusChangeData : Function
  showActivateDeactivateModal: boolean
}
export interface IFormFields {
  [key: string]: any
}

export interface IDropdown {
  label: string
  value: number | string
  [key: string]: any
}
export interface IRouteParams {
  trackerConfigId?: string;
}
