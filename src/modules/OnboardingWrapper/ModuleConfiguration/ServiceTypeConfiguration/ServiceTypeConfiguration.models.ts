import { IFetchDataOptions  } from 'ui-library'
export interface IEffectAction {
  [key: string]: any;
}
export interface IRowData {
  branchId: []
  clientRefMasterId?: number
  considerHolidays: string
  cutOffTime: string
  deliverSLA?: number
  description: string
  name: string
  serviceDays: string
  serviceEndTime: string
  serviceStartTime: string
  serviceTypeDetailsId?: number
  status?: string
  deliverSLAUnit? : string
  deliveryBeforeTime: string
  deliveryType: []
  autoAllocate: string
  branchMovement: string
}
export interface IAllServiceTypesDataPayload {
  totalCount: number,
  results: Array<IRowData>
}
export interface IDropdown {
  label: string
  value: number | string
  [key: string]: any
}
export interface IFormFields {
  [key: string]: any
}
export interface ICreatePayload {
  name: string
  description: string
  considerHolidays: string
  serviceStartTime: string
  serviceEndTime: string
  cutOffTime: string
  deliveryBeforeTime: string
  deliverSLA: number
  deliverSLAUnit: string
  branchId: number[]
  serviceDays: string[]
  deliveryType: string[]
}
export interface IActiveDeactiveConfirmation {
  setShowActivateDeactivateModal : Function
  fetchOptions : IFetchDataOptions
  handleFetchData: Function
  statusChangeData: any
  setStatusChangeData : Function
  showActivateDeactivateModal: boolean
}
export interface IRouteParams {
  serviceTypeDetailsId?: string;
}

export interface IAutoAllocateValues{
  autoAssignToNearestDA ?: string
  AutoAssignToAnExistingRoute ?: string
  ManuallyAssignToARun ?: string 
}

export interface IBranchMovementValues{
  yes ?: string
  no ?: string
}