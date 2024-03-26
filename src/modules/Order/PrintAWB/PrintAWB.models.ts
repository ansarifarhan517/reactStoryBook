import { ICustomField } from '../../Driver/DriverListView/DriverListView.models';

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

interface IClientNodeDetails {
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
export interface IPrintAWBOrderDetails {
  actualDestinationId: number
  awbNumber: string
  clientNodeDTOs: IClientNodeDetails[]
  deliveryTypeCd: string
  destClientNodeId: number
  geofenceName: string
  orderNo: string
  orderState: string
  originClientNodeId: number
  paymentType: string
  shipmentId: number
  shipmentOrderTypeCd: string
  startTimeWindow: string | number
  deliverStartTimeWindow: string | number
  subClientName: string
  crates?: ICrateDetails[]
  customFieldList?: Array<Partial<ICustomField> & Omit<ICustomField, 'type' | 'value'>> 
  
  /** Below fields will be dynamically computed at UI based on the date present in clientNodeDTOs */
  clientLogo: string
  
  tripNo?: string
  customerName?: string
  deliveryOrder?: string

  customFieldListString?: string
  cratesJSONString: string

  returnAddress?: string
  returnApartment?: string
  returnCity?: string
  returnClientNodeCd?: string
  returnClientNodeId?: number
  returnClientNodePhone?: string
  returnCountry?: string
  returnEmailAddress?: string
  returnIsActiveFl?: boolean
  returnLandmark?: string
  returnLat?: number
  returnLng?: number
  returnLocality?: string
  returnName?: string
  returnPincode?: string
  returnState?: string
  returnStreetName?: string
  
  pickupAddress?: string
  pickupApartment?: string
  pickupCity?: string
  pickupClientNodeCd?: string
  pickupClientNodeId?: number
  pickupClientNodePhone?: string
  pickupCountry?: string
  pickupEmailAddress?: string
  pickupIsActiveFl?: boolean
  pickupLandmark?: string
  pickupLat?: number
  pickupLng?: number
  pickupLocality?: string
  pickupName?: string
  pickupPincode?: string
  pickupState?: string
  pickupStreetName?: string

  deliverAddress?: string
  deliverApartment?: string
  deliverCity?: string
  deliverClientNodeCd?: string
  deliverClientNodeId?: number
  deliverClientNodePhone?: string
  deliverCountry?: string
  deliverEmailAddress?: string
  deliverIsActiveFl?: boolean
  deliverLandmark?: string
  deliverLat?: number
  deliverLng?: number
  deliverLocality?: string
  deliverName?: string
  deliverPincode?: string
  deliverState?: string
  deliverStreetName?: string
}