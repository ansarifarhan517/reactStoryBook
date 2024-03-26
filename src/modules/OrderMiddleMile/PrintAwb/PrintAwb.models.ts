import { ICustomField } from '../../Driver/DriverListView/DriverListView.models'

export interface IPrintAwbTemplateResponse {
  id: string
  name: string
  orderHTML: string
  crateHTML: string
  itemHTML: string
  htmlData: {
    orderHTML: string
    crateHTML: string
    itemHTML: string
  }
  isFavouriteFl?: boolean
}

export interface IItemDetails {
  createdByUserId: number
  createdOnDt: number | string
  id: number
  isActiveFl: boolean
  isDeleteFl: string
  itemCd: string
  itemName: string
  itemPrice: number
  itemQuantity: number
  itemType: string
  itemWeight: number
  loadedQuantity: 0
  shipmentLineItemId: number
  statusCd: string
  unloadedQuantity: number
  updatedByUserId: number
  updatedOnDt: number | string
}
export interface ICrateDetails {
  crateAmount: number
  crateCd: string
  crateType: string
  createdByUserId: number
  createdOnDt: number | string
  id: number
  isActiveFl: true
  isDeleteFl: string
  loadedUnits: number
  noOfUnits: number
  orderNo: string
  shipmentDetailsId: number
  shipmentMappingId: number
  shipmentlineitems: IItemDetails[]
  statusCd: string
  totalItemsVolume: number
  totalItemsWeight: number
  unloadedUnits: number
  updatedByUserId: number
  updatedOnDt: number
  volumeUtilizationPercentage: number
  weightUtilizationPercentage: number
}
export interface IMiddleMileOrderDetails {
  activeMilestoneNo: string
  awbNumber: string
  branch: string
  clientName: string
  currentMilestoneNo: number
  currentMilestoneStatus: string
  customFieldsList?: Array<Partial<ICustomField> & Omit<ICustomField, 'type' | 'value'>>
  deliveryType: string
  destLatitude: number
  destLongitude: number
  detailedOrderStatusCd: string
  deliveryMediumMasterName: string
  endTimeWindow: number | string
  eta: number | string
  isActiveFl: true
  lastTrackingDate: number | string
  milestoneType: string
  movementType: string
  numberOfItems: number
  optimizedPackingStatusCd: string
  orderDispatchDate: number | string
  orderId: number
  orderNo: string
  orderStatus: string
  orderSubTypeCd: string
  orderTypeCd: string
  originAddress: string
  originBranchName: string
  originCustName: string
  originLatitude: number
  originLongitude: number
  serviceType: string
  shipmentId: number
  shippingCost: number
  startTimeWindow: number | string
  totalMilestoneNo: number
  tripNo: string
  crates?: ICrateDetails[]
  shipmentOrderTypeCd?: string
  noOfCrates?: number
  pickupName?: string
  deliverName?: string
  pickupLat?: number
  deliverLat?: number
  pickupAddress?: string
  deliverAddress?: string
  returnName?: string
  returnLat?: number
}

export type tMMODynamicFieldName = keyof IMiddleMileOrderDetails | keyof ICrateDetails | keyof IItemDetails
export interface IDropdownOption {
  value: string
  label: string 
}

export type tLoadingKeys = 'orderDetails'
export interface IMMOPrintAwbReduxState {
  templateOptions: IDropdownOption[]
  templateOptionsMap: Record<string, IPrintAwbTemplateResponse>
  selectedOrderDetails: Partial<IMiddleMileOrderDetails>[]
  loading: Set<tLoadingKeys>
}

export const MMOPrintAwbReduxInitialState: IMMOPrintAwbReduxState = {
  templateOptions: [],
  templateOptionsMap: {},
  selectedOrderDetails: [],
  loading: new Set()
}
