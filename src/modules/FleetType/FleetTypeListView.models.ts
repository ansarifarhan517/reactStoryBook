import { IMongoField } from '../../utils/mongo/interfaces'
import { IClientProperty } from '../common/ClientProperties/interfaces'

export interface IFleetTypeListViewRowData {
  capacityInUnits: number
  capacityInVolume: number
  capacityInWeight: number
  clientId: number
  clientName: string
  id: number
  isActiveFl: boolean
  make: string
  minCapacityUtilizationInUnits: number
  minCapacityUtilizationInVolume: number
  minCapacityUtilizationInWeight: number
  skillSet: string[]
  type: string
  breakDurationInMins?: any
  breakEndTimeWindow?: string
  breakStartTimeWindow?: string
  fixedCost?: any
  loadingTimeInMins?: number
  maxDistance?: number
  transportTimeCost?: number
  weeklyOffList?: any
  waitingTimeCost?: number
  variableCost?: number
  customFieldsJSONString?: string
  minSpeed? : number
  maxSpeed? : number
  minTemperature? : number
  maxTemperature? : number
}
export type tFleetStatus = 'ALL' | 'ACTIVE' | 'INACTIVE'

export interface IFleetListViewDataPayload {
  clientBranchId?: number,
  otherCount?: number,
  totalCount: number,
  results: Array<IFleetTypeListViewRowData>,
  clientProperties?: Record<string, IClientProperty>
}

export interface ICustomField {
  type: string,
  field: string,
  value: any
}


export interface IDropdown {
  label: string
  value: number | string
  [key: string]: any
}

export type tFleettypeModes = 'listview'

export interface IFleetTypeRequest {
  activeRequest: boolean
  id: Record<number, boolean>
  failureCallback: React.Dispatch<React.SetStateAction<boolean>>
  showModal?: boolean
}

export interface IIconDropdownChildren {
  selectedOption?: IDropdown
  menuIsOpen: boolean
  setMenuIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export interface IActivationConfirmation {
  isShowActivationConfirmation: boolean
  confirmationMessage: string
  title: string
  footerButtonGroup: IActivationModalButtonGroup[]
  handleClose: () => void
}
export interface IActivationModalButtonGroup {
  iconVariant: string
  primary: boolean
  label: string
  onClick: () => void
  isVisible?: true
}
export interface IMongoCompartmentListViewStructure {
  columns: {
    [key: string]: IMongoField
  }
}
// export interface Icolumn {
//   breakDurationInMins:string
//   breakEndTimeWindow:string
//   breakStartTimeWindow
//   capacity-done
//   fixedCost
//   isActiveFl
//   loadingTimeInMins
//   make
//   maxDistance
//   minCapacityUtil-done
//   transportTimeCost
//   type
//   variableCost
//   waitingTimeCost
//   weeklyOffList
// }

