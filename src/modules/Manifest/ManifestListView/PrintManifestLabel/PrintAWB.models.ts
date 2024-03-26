// import { ICustomField } from '../../Driver/DriverListView/DriverListView.models';

export type IOrderPrintAWBTemplateData = {
  orderHTML: string
  crateHTML: string
  itemHTML: string
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

export interface IClientNodeDetails {
  address: string
  apartment: string
  city: string
  clientBranchRefId: number
  clientId: number
  clientNodeCd: string
  clientNodeId: number
  clientNodePhone: string
  clientNodeType: 'from' | 'to' | 'return'
  country: string
  emailAddress: string
  isActiveFl: boolean
  landmark: string
  lat: number
  lng: number
  locality: string
  name: string
  pincode: string
  state: string
  streetName: string
}
export interface IPrintManifestOrderDetails {
  [key:string]: any
}