import { IFetchDataOptions } from "ui-library"
import { ICustomFieldsEntity } from "../../../utils/mongo/interfaces"

export interface IDropdownOptionProps {
    id?: string
    name?: string
    label?: string
    value?: string
    clientNodeId?: string
}

export interface ISetExpandedProps {
    key: string
    value: string
}

export interface ITimezoneOptions extends IDropdownOptionProps {
    canonicalId: string
    dst: string
    gmtoffset: string
    timezoneId: number
}

export interface IClientRefFields {
    PAYMENTTYPE: IDeliveryTypeOptionData
    PRIORITY: IDeliveryTypeOptionData
}

export interface ICustomeFields {
    field: string
    value: string
    type: string
}
export interface IAddOrderFormData {
    orderNo?: string
	moduleKey?: string
	returnShipment?: string
	awbNumber?: string
	numberOfItems?: number
	packageWeight?: number
	packageVolume?: number
	packageValue?: number
	shippingCost?: number
	ServiceTime?: number
	pickupAccountName?: string
	pickupEmail?: string
	pickupPhoneNumber?: string
    pickupWhatsAppOptin?: string
	pickupApartment?: string
	pickupStreetName?: string
	pickupLandmark?: string
	pickupLocality?: string
	pickupCity?: string
	pickupServiceTime?: string
	pickupNotes?: string
	returnAccountName?: string
	returnEmail?: string
	returnPhoneNumber?: string
    returnWhatsAppOptin?: string
	returnApartment?: string
	returnStreetName?: string
	returnLandmark?: string
	returnLocality?: string
	returnCity?: string
	returnServiceTime?: number
	deliverAccountName?: string
	deliverEmail?: string
	deliverPhoneNumber?: string
    deliverWhatsAppOptin?: string
	deliverApartment?: string
	deliverStreetName?: string
	deliverLandmark?: string
	deliverLocality?: string
	deliverCity?: string
	deliverServiceTime?: number
	deliverNotes?: string
	cf_order_description?: string
	shipmentsType?: string
	shipmentOrderDt?: string
	isPartialDeliveryAllowedFl?: string
	returnAllowedFl?: string
	cancellationAllowedFl?: string
	pickupStartTimeWindow?: Date
	pickupEndTimeWindow?: Date
	returnStartTimeWindow?: Date
	returnEndTimeWindow?: Date
	deliverStartTimeWindow?: Date
	deliverEndTimeWindow?: Date
	cf_fileUploadorder?: string
	cf_orderFileUpload?: string
	pickupLatitude?: number
	pickupLongitude?: number
	pickupEndTimeWindowTZ?: string
	pickupStartTimeWindowTZ?: string
	pickupAddressTimezoneId?: number
	deliverLatitude?: number
	deliverLongitude?: number
	deliverEndTimeWindowTZ?: string
	deliverStartTimeWindowTZ?: string
	deliverAddressTimezoneId?: number
	shipmentOrderTypeCd?: string
	distributionCenter?: any
	clientBranchId?: number
	hubClientNodeId?: string
	orderState?: string
	secondLegClientBranchId?: number
	secondLegClientNodeId?: number
	returnLatitude?: number
	returnLongitude?: number
	returnEndTimeWindowTZ?: string
	returnStartTimeWindowTZ?: string
	returnAddressTimezoneId?: number
	shipmentCrateMappings?: ICrateData[]
	customFields?: ICustomeFields[]
	customFieldsEntity?: ICustomeFields[]
	format?: string
    [key: string]: any
}

export interface IDeliveryTypeOptionData {
    clientRefMasterId: number;
    clientRefMasterType: string;
    clientRefMasterCd: string;
    clientRefMasterDesc: string;
    clientId: number;
    isDeleteFl: string;
    id: number;
    name: string;
}

export interface IOrderData {
    actualDestinationNodeId?: number
    addressId?: string
    branchDescription?: string
    branchName?: string
    city?: string
    clientId?: number
    clientName?: string
    contactNumber?: string
    country?: string
    createdOnDt?: number
    createdOnDtTZ?: string
    customerId?: string
    customerName?: string
    deliverAccountName?: string
    deliverApartment?: string
    deliverCity?: string
    deliverEmail?: string
    deliverLandmark?: string
    deliverLatitude?: number
    deliverLocality?: string
    deliverLongitude?: number
    deliverPhoneNumber?: string
    deliverServiceTime?: number
    deliverStreetName?: string
    deliveryOrder?: number
    destinationAddress?: string
    emailAddress?: string
    endTimeWindow?: Date
    endTimeWindowTZ?: string
    isActiveFl?: true
    isCancelAllowedFl?: true
    isP2POrder?: false
    isPartialDeliveryAllowedFl?: string
    isReturnAllowedFl?: true
    lat?: number
    lng?: number
    noOfItems?: number
    orderDate?: Date
    orderDateTZ?: string
    orderNo?: string
    orderState?: string
    orderStatus?: string
    orderType?: string
    originAddress?: string
    originLatitude?: number
    originLongitude?: number
    packageValue?: number
    pickupServiceTime?: string
    pincode?: string
    returnAccountName?: string
    returnCity?: string
    returnClientNodeId?: number
    returnEmail?: string
    returnLatitude?: number
    returnLongitude?: number
    returnPhoneNumber?: string
    returnServiceTime?: number
    returnToSameAddress?: false
    shipmentId?: number
    shippingCost?: number
    startTimeWindow?: Date
    startTimeWindowTZ?: string
    tripId?: number
    apartment?: string
    returnApartment?: string
    returnStreetName?: string
    streetName?: string
    state?: string
    locality?: string
    returnLocality?: string
    serviceTimeInMins?: string
    landmark?: string
    deliverNotes?: string
    returnLandmark?: string
    returnAllowedFl?: string
    deliverStartTimeWindow?: Date
    deliverEndTimeWindow?: Date
    gmtoffset?: string
    canonicalId?: string
    deliverStartTimeWindowTZ?: string
    customFieldsEntity?: ICustomFieldsEntity[]
    capacityInWeight?: number
    capacityInVolume?: number
    ServiceTime?: number
    clientReferenceMaster?: IClientRefFields
    deliveryTypes?: IDeliveryTypeOptionData[]
    moduleKey?: string
    [key: string]: any
}

export interface ISettingConfigData {
    locationSearch: boolean
    mapSource: string
    mapTheme: string
    markerMode: string
    osm: boolean
    poi: boolean
    rulerControl: boolean
    terrain_google: boolean
    traffic: boolean
    transit: boolean
}

export type tMapButton = 'apply' | 'save'

export interface ISettingOption {
    title: string
    type: string
    option: Array<IMapSettingsOption>
    permission?: boolean
    label?: string
}
export interface IMapSettingsOption {
    name?: string
    selected?: boolean
    image?: string
    disabled?: boolean
    subOptions?: Array<IMapSettingsOption>
    title?: string
    id?: string
    color?: string
    checked?: boolean
    value?: string
    allow?: boolean
    permission?: boolean
    extraInfo?: string
    enablingToasterMessage?: string
    disablingToasterMessage?: string
    label?: string
}
export interface ISetting {
    'Map Mode': ISettingOption
    Legends: ISettingOption
    'Map Type': ISettingOption
    Geofences: ISettingOption
    'Map Theme': ISettingOption
    Miscellaneous: ISettingOption
}

export type tTiles =
    | 'osm_standard'
    | 'google_satellite'
    | 'google_roadmap'
    | 'google_terrain'
    | 'google_hybrid'
    | 'osm_humanitarian'
    | 'osm_cycle'
    | 'osm_transport'

export interface IOrderFetchDataOptions extends IFetchDataOptions {
    dataFetchMode?: string
    endDateFilter?: string
    startDateFilter?: string
    status?: string
}

export interface ICustomerAddressOptionData {
    address: string
    canonicalId: string
    city: string
    clientId: number
    clientNodeAddressCd: string
    clientNodeCd: string
    clientNodeId: number
    country: string
    countryId: number
    createdByUserId: number
    dst: string
    gmtoffset: string
    isActiveFl: true
    isDeleteFl: string
    isHUBFl: string
    isOwnBranchFl: string
    isPrimaryAddress: string
    lat: number
    latitude: number
    lng: number
    longitude: number
    name: string
    state: string
    streetName: string
    timezoneId: number
    apartment?: string
    pincode?: number
    locality?: string
    landmark?: string
    clientNodeType?: string
    whatsappOptin?: string
}

export interface ICrateItemData {
    id: string
    isDeleteFl: string
    isActiveFl: string
    itemCd?: string
    itemName?: string
    itemPrice?: string
    itemQuantity: string
    itemType?: string
    itemWeight?: string
    itemVolume?: string
    maxTemperature: string
    minTemperature: string
    newItem?: boolean
    temperatureCategory?: any
    shipmentDetailsId?: string
    shipmentLineItemId?: string
    itemCount?: number
    itemBreadth?: string
    itemHeight?: string
    itemLength?:string
    temperatureCategorySelection?: IDropdownOptionProps
}

export interface ICrateData {
    crateAmount?: string
    crateBreadth?: string
    crateCd?: string
    crateHeight?: string
    crateLength?: string
    crateMaxTemperature: string
    crateMinTemperature: string
    crateType?: string
    crateVolume?: string
    crateWeight?: string
    id: string
    isActiveFl: string
    isDeleteFl: string
    itemCounter: number
    newItem?: boolean
    noOfUnits?: number
    shipmentlineitems: Array<ICrateItemData>
    temperatureCategory?: string
    crateCounter?: number
    temperatureCategorySelection?: IDropdownOptionProps
    crateTemperatureCategory: any
    crateName?: any
}

export interface IAddressData {
    address: string
    apartment: string
    canonicalId: string
    city: string
    clientId: number
    clientNodeAddressCd: string
    clientNodeCd: string
    clientNodeId: number
    country: string
    countryId: number
    createdByUserId: number
    dst: string
    gmtoffset: string
    isActiveFl: true
    isDeleteFl: string
    isHUBFl: string
    isOwnBranchFl: string
    isPrimaryAddress: string
    landmark: string
    lat: number
    latitude: number
    lng: number
    locality: string
    longitude: number
    name: string
    pincode: string
    state: string
    streetName: string
    timezoneId: number
    updatedByUserId: number
    clientNodeType?: string
    locationRestriction?: string
}

export interface ICustomerData {
    accountCode: string
    accountName: string
    customerId: number
    isActiveFl: boolean
    emailAddress?: string
    customerPhone?: string
    name?: string
} 

export interface IDragProps {
    destination: {
        droppableId: string 
        index: number
    }
    draggableId: string
    mode: string
    reason: string
    source: {
        index: number 
        droppableId: string
    }
    type: string
}
export interface ISubClients {
    id: number
    isActiveFl: boolean
    name: string
    region?: string
}