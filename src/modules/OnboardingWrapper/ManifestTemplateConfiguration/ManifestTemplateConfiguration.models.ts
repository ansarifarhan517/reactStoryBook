import moment from "moment";
import { ReactNode } from "react";
import { IClientProperty } from "../../common/ClientProperties/interfaces";

export interface IRowData {
    templateName: string;
    templateDesc: string;
    isActiveFl: boolean;
    templateId: number;
    isDefault: boolean;
    referenceId: string;
    isFavourite: boolean;
}

export interface IManifestTemplateConfigListDataPayload {
    clientBranchId?: number;
    otherCount?: number;
    totalCount: number;
    results: Array<IRowData>;
    clientProperties?: Record<string, IClientProperty>;
}

export interface IManifestTemplateConfigTagGroup {
    key: string
    value: number
    label: string
}

export interface IManifestTemplateConfigTag {
    dynamicTagKey: string
    dynamicTagLabelKey: string
    dynamicTagLabelValue: string
    tagValueSize: number
    tagGroupId: number
    isCustomField?: boolean
}

export interface IManifestTemplateConfigTagsAPIResponse {
    id: string
    tagGroupMappingList: IManifestTemplateConfigTagGroup[]
    dynamicTagKeys: IManifestTemplateConfigTag[]
}

export interface IManifestTemplateConfigFormData {
    templateId: number
    templateName: string
    templateDesc: string
    orderHTML: string
    ordersHTML: string
    manifestsHTML: string
    htmlData: {
        orderHTML: string
        ordersHTML: string
        manifestsHTML: string
    }
}

export interface IDefaultTemplate {
    isActiveFl: boolean;
    templateName: string;
    isDefault: boolean;
    htmlData: {
        orderHTML: string;
        ordersHTML: string;
        manifestsHTML: string;
    }
}

export interface IPreviewProps {
    children?: ReactNode
    className?: string;
    onClick: () => void;
}

export interface IPropertyType {
    clientId: number
    clientPropertyId: number
    createdByUserId: number
    createdOnDt: number
    isActiveFl: boolean
    isDeleteFl: string
    propertyKey: string
    propertyValue: string
    updatedByUserId: number
    updatedOnDt: number
}

export const orderCrateDetails = [{
    actualDestinationId: 15660003,
    manifestNumber: "435-16685675",
    clientLogo: "https://s3-ap-southeast-1.amazonaws.com/loginext-client-logo-demo/Vendor_Demo_445.jfif",
    clientNodeDTOs: [
        {
            address: "228 Park Ave S, New York, NY",
            apartment: "A",
            city: "New York City",
            clientBranchRefId: 14591,
            clientId: 445,
            clientNodeCd: "John Doe",
            clientNodeId: 259227,
            clientNodePhone: "1234567",
            clientNodeType: "from",
            country: "United States",
            emailAddress: "john.doe@gmail.com",
            isActiveFl: true,
            landmark: "address2",
            lat: 19.1215084,
            lng: 72.8975717,
            locality: ".",
            name: "John Doe",
            state: "New York",
            streetName: "Park Ave S",
        }, {
            address: "3645, Geneva Street, Chicago ,Illinois, UNITED STATES, 60602",
            apartment: "3645",
            city: "Chicago",
            clientId: 4254,
            clientNodeCd: "64374689",
            clientNodeId: 15660003,
            clientNodePhone: "7411003184",
            clientNodeType: "to",
            country: "UNITED STATES",
            emailAddress: "john.doe@gmail.com",
            isActiveFl: true,
            landmark: "Geneva Street",
            lat: 19.451,
            lng: 72.82,
            locality: "virar east",
            name: "Gary Jason",
            pincode: "60602",
            state: "Illinois",
            streetName: "Geneva Street",
        }, {
            apartment: "3645",
            city: "Chicago",
            clientBranchRefId: 14591,
            clientId: 445,
            clientNodeCd: "John Doe",
            clientNodeId: 259227,
            clientNodePhone: "1234567",
            clientNodeType: "return",
            country: "UNITED STATES",
            emailAddress: "john.doe@gmail.com",
            isActiveFl: true,
            landmark: "address2",
            lat: 19.1215084,
            lng: 72.8975717,
            locality: ".",
            name: "John Doe",
            state: "Illinois",
            streetName: "Geneva Street"
        }
    ],
    shipmentsLst: [
        {
           shipmentId: 22472424,
           orderNo: "Rajesh-221909_M2",
           originAddress: "Pune",
           destinationAddress: "Fitness Planet,SV Road,Jogeshwari West,Opp ANI na,Mumbai,Maharashtra,INDIA,400082",
           orderState: "FORWARD",
           packageStatusCd: "INTRANSIT",
           shipmentOrderTypeCd: "DELIVER",
           outwardMFId: "ParentManifestScan",
           hubScanStatus: "OUTSCANNED",
           awbNo: "PragatiAWB",
           branchName: "Pune",
           tripId: 2305057,
           tripName: "TRIP-675",
           packageWeight: 10.5,
           packageVolume: 450.12
        },
        {
           shipmentId: 22472426,
           orderNo: "Rajesh-726240_M2",
           originAddress: "Pune",
           destinationAddress: "Fitness Planet,SV Road,Jogeshwari West,Opp ANI na,Mumbai,Maharashtra,INDIA,400082",
           orderState: "FORWARD",
           packageStatusCd: "INTRANSIT",
           shipmentOrderTypeCd: "DELIVER",
           outwardMFId: "ParentManifestScan",
           hubScanStatus: "OUTSCANNED",
           awbNo: "PragatiAWB",
           branchName: "Pune",
           tripId: 2305057,
           tripName: "TRIP-675",
           packageWeight: 10.5,
           packageVolume: 450.12
        }
    ],
    childManifests:[
        {
           isActiveFl: true,
           manifestId: 4618,
           manifestName: "ChildManifest",
           manifestType: "ORDER",
           hubScanStatus: "OUTSCANNED",
           orderCount: 2,
           generateCustomId: false,
           useExistingId: false,
           packageStatusCd: "INTRANSIT",
           parentManifestId: 4619,
           totalCrates: 4,
           totalWeight: 21,
           totalVolume: 900.24
        }
    ],
    customFieldList: [{field: 'cf_standardHarvest', value: 'Standard Harvest'}, {field: 'cf_customizedHarvest', value: 'Customized'}],
    cratesJSONString: "[{\"crateAmount\":100,\"crateBreadth\":\"20 in\",\"crateCd\":\"C4922\",\"crateHeight\":\"30 in\",\"crateLength\":\"20 in\",\"crateName\":\"Crate 1\",\"crateType\":\"Perishable\",\"crateVolume\":\"50 l\",\"crateWeight\":\"50 lb\",\"createdByUserId\":31690,\"createdOnDt\":\"15, Jun 2021 07:23 PM\",\"id\":30618667,\"isActiveFl\":true,\"isDeleteFl\":\"N\",\"isOptimizedCrate\":false,\"loadedUnits\":1,\"noOfUnits\":10,\"orderNo\":\"DELIVERorder\",\"shipmentDetailsId\":22121274,\"shipmentMappingId\":30618667,\"crateTemperatureCategory\":\"Ambient\",\"crateMinTemperature\":\"0 c\",\"crateMaxTemperature\":\"2 c\",\"shipmentlineitems\":[{\"createdOnDt\":\"15, Jun 2021 07:23 PM\",\"id\":14693718,\"isActiveFl\":true,\"isDeleteFl\":\"N\",\"itemBreadth\":\"10 in\",\"itemCd\":\"I1022\",\"barcode\":\"11213456\",\"itemHeight\":\"30 in\",\"itemLength\":\"20 in\",\"itemName\":\"Vegetables\",\"itemPrice\":\"$ 30\",\"itemQuantity\":20,\"itemType\":\"Fresh Produce\",\"itemVolume\":\"50 l\",\"itemWeight\":\"10 lb\",\"loadedQuantity\":1,\"maxTemperature\":\"0 C\",\"minTemperature\":\"2 C\",\"shipmentLineItemId\":14693718,\"statusCd\":\"UNLOADED\",\"temperatureCategory\":\"Ambient\",\"unloadedQuantity\":1,\"updatedByUserId\":31690,\"updatedOnDt\":\"15, Jun 2021 07:25 PM\"},{\"createdOnDt\":\"15, Jun 2021 07:23 PM\",\"id\":14693719,\"isActiveFl\":true,\"isDeleteFl\":\"N\",\"itemBreadth\":\"14 in\",\"itemCd\":\"I1161\",\"barcode\":\"11213456\",\"itemHeight\":\"25 in\",\"itemLength\":\"25 in\",\"itemName\":\"Bottled Water\",\"itemPrice\":\"$ 40\",\"itemQuantity\":15,\"itemType\":\"Bottled\",\"itemVolume\":\"60 l\",\"itemWeight\":\"15 lb\",\"loadedQuantity\":2,\"maxTemperature\":\"0 c\",\"minTemperature\":\"2 C\",\"shipmentLineItemId\":14693719,\"statusCd\":\"UNLOADED\",\"temperatureCategory\":\"Frozen\",\"unloadedQuantity\":2,\"updatedByUserId\":31690,\"updatedOnDt\":\"15, Jun 2021 07:25 PM\"}],\"statusCd\":\"UNLOADED\",\"totalItemsVolume\":524.3864,\"totalItemsWeight\":9.0718,\"unloadedUnits\":1,\"updatedByUserId\":31690,\"updatedOnDt\":1623765351000,\"volumeUtilizationPercentage\":0,\"weightUtilizationPercentage\":0},{\"crateAmount\":900,\"crateBreadth\":\"10 in\",\"crateCd\":\"C4561\",\"crateHeight\":\"30 in\",\"crateLength\":\"20 in\",\"crateName\":\"Crate 2\",\"crateType\":\"Frozen\",\"crateVolume\":\"50 l\",\"crateWeight\":\"50 lb\",\"createdByUserId\":31690,\"createdOnDt\":\"15, Jun 2021 07:23 PM\",\"id\":30618667,\"isActiveFl\":true,\"isDeleteFl\":\"N\",\"isOptimizedCrate\":false,\"loadedUnits\":1,\"noOfUnits\":10,\"orderNo\":\"DELIVERorder\",\"shipmentDetailsId\":22121274,\"shipmentMappingId\":30618667,\"crateTemperatureCategory\":\"Ambient\",\"crateMinTemperature\":\"0 c\",\"crateMaxTemperature\":\"2 c\",\"shipmentlineitems\":[{\"createdOnDt\":\"15, Jun 2021 07:23 PM\",\"id\":14693718,\"isActiveFl\":true,\"isDeleteFl\":\"N\",\"itemBreadth\":\"14 in\",\"itemCd\":\"I1022\",\"barcode\":\"11213456\",\"itemHeight\":\"30 in\",\"itemLength\":\"20 in\",\"itemName\":\"Vegetables\",\"itemPrice\":\"$ 30\",\"itemQuantity\":20,\"itemType\":\"Fresh Produce\",\"itemVolume\":\"50 l\",\"itemWeight\":\"10 lb\",\"loadedQuantity\":1,\"maxTemperature\":\"0 c\",\"minTemperature\":\"2 C\",\"shipmentLineItemId\":14693718,\"statusCd\":\"UNLOADED\",\"temperatureCategory\":\"Ambient\",\"unloadedQuantity\":1,\"updatedByUserId\":31690,\"updatedOnDt\":\"15, Jun 2021 07:25 PM\"},{\"createdOnDt\":\"15, Jun 2021 07:23 PM\",\"id\":14693719,\"isActiveFl\":true,\"isDeleteFl\":\"N\",\"itemBreadth\":45.72,\"itemCd\":\"I1161\",\"barcode\":\"11213456\",\"itemHeight\":\"25 in\",\"itemLength\":\"25 in\",\"itemName\":\"Bottled Water\",\"itemPrice\":\"$ 40\",\"itemQuantity\":15,\"itemType\":\"Bottled\",\"itemVolume\":\"60 l\",\"itemWeight\":\"15 lb\",\"loadedQuantity\":2,\"maxTemperature\":\"0 C\",\"minTemperature\":\"2 C\",\"shipmentLineItemId\":14693719,\"statusCd\":\"UNLOADED\",\"temperatureCategory\":\"Frozen\",\"unloadedQuantity\":2,\"updatedByUserId\":31690,\"updatedOnDt\":\"15, Jun 2021 07:25 PM\"}],\"statusCd\":\"UNLOADED\",\"totalItemsVolume\":524.3864,\"totalItemsWeight\":9.0718,\"unloadedUnits\":1,\"updatedByUserId\":31690,\"updatedOnDt\":1623765351000,\"volumeUtilizationPercentage\":0,\"weightUtilizationPercentage\":0},{\"crateAmount\":100,\"crateBreadth\":\"20 in\",\"crateCd\":\"C4922\",\"crateHeight\":\"30 in\",\"crateLength\":\"20 in\",\"crateName\":\"Crate 3\",\"crateType\":\"Perishable\",\"crateVolume\":\"50 l\",\"crateWeight\":\"50 lb\",\"createdByUserId\":31690,\"createdOnDt\":\"15, Jun 2021 07:23 PM\",\"id\":30618667,\"isActiveFl\":true,\"isDeleteFl\":\"N\",\"isOptimizedCrate\":false,\"loadedUnits\":1,\"noOfUnits\":10,\"orderNo\":\"DELIVERorder\",\"shipmentDetailsId\":22121274,\"shipmentMappingId\":30618667,\"crateTemperatureCategory\":\"Ambient\",\"crateMinTemperature\":\"0 c\",\"crateMaxTemperature\":\"2 c\",\"shipmentlineitems\":[{\"createdOnDt\":\"15, Jun 2021 07:23 PM\",\"id\":14693718,\"isActiveFl\":true,\"isDeleteFl\":\"N\",\"itemBreadth\":\"10 in\",\"itemCd\":\"I1022\",\"barcode\":\"11213456\",\"itemHeight\":\"30 in\",\"itemLength\":\"20 in\",\"itemName\":\"Vegetables\",\"itemPrice\":\"$ 30\",\"itemQuantity\":20,\"itemType\":\"Fresh Produce\",\"itemVolume\":\"50 l\",\"itemWeight\":\"10 lb\",\"loadedQuantity\":1,\"maxTemperature\":\"0 C\",\"minTemperature\":\"2 C\",\"shipmentLineItemId\":14693718,\"statusCd\":\"UNLOADED\",\"temperatureCategory\":\"Ambient\",\"unloadedQuantity\":1,\"updatedByUserId\":31690,\"updatedOnDt\":\"15, Jun 2021 07:25 PM\"},{\"createdOnDt\":\"15, Jun 2021 07:23 PM\",\"id\":14693719,\"isActiveFl\":true,\"isDeleteFl\":\"N\",\"itemBreadth\":\"14 in\",\"itemCd\":\"I1161\",\"barcode\":\"11213456\",\"itemHeight\":\"25 in\",\"itemLength\":\"25 in\",\"itemName\":\"Bottled Water\",\"itemPrice\":\"$ 40\",\"itemQuantity\":15,\"itemType\":\"Bottled\",\"itemVolume\":\"60 l\",\"itemWeight\":\"15 lb\",\"loadedQuantity\":2,\"maxTemperature\":\"0 c\",\"minTemperature\":\"2 C\",\"shipmentLineItemId\":14693719,\"statusCd\":\"UNLOADED\",\"temperatureCategory\":\"Frozen\",\"unloadedQuantity\":2,\"updatedByUserId\":31690,\"updatedOnDt\":\"15, Jun 2021 07:25 PM\"}],\"statusCd\":\"UNLOADED\",\"totalItemsVolume\":524.3864,\"totalItemsWeight\":9.0718,\"unloadedUnits\":1,\"updatedByUserId\":31690,\"updatedOnDt\":1623765351000,\"volumeUtilizationPercentage\":0,\"weightUtilizationPercentage\":0}]",
    customFieldListString: "[]",
    customerName: "Gary Jason",
    deliverAddress: "3645, Geneva Street, Chicago ,Illinois, UNITED STATES, 60602",
    deliverAddressType: "Home",
    deliverApartment: "3645",
    deliverCity: "Chicago",
    deliverClientNodeCd: "64374689",
    deliverClientNodeId: 15660003,
    deliverClientNodePhone: "7411003184",
    deliverContact: "202-555-0166",
    deliverCountry: "UNITED STATES",
    deliverEmailAddress: "john.doe@gmail.com",
    deliverIsActiveFl: true,
    deliverLandmark: "Geneva Street",
    deliverLat: 19.451,
    deliverLng: 72.82,
    deliverLocality: "Chicago",
    deliverName: "Gary Jason",
    deliverAccountName: "Gary Jason",
    deliverPincode: "60602",
    deliverStartTimeWindow: undefined,
    deliverState: "Illinois",
    deliverStreetName: "Geneva Street",
    deliveryLocationType: "Home",
    deliveryOrder: "Order",
    deliveryTypeCd: "DELIVERYLOCATION",
    deliveryType: "Fragile, Hazmat",
    destClientNodeId: 15660003,
    geofenceName: "Geofence Not Mapped",
    items: "Conductive",
    noOfCrates: 1,
    orderNo: "Order12873323",
    orderState: "FORWARD",
    originClientNodeId: 259227,
    packageValue: 500,
    packageWeight: 4.5359,
    paymentType: "Prepaid",
    pickupAddressType: "Home",
    pickupContact: "202-555-0111",
    pickupAddress: "228 Park Ave S, New York, NY ",
    pickupApartment: "228",
    pickupCity: "New York City",
    pickupClientNodeCd: "John Doe",
    pickupClientNodeId: 259227,
    pickupClientNodePhone: "1234567",
    pickupCountry: "UNITED STATES",
    pickupEmailAddress: "john.doe@gmail.com",
    pickupIsActiveFl: true,
    pickupLandmark: "Park Ave S",
    pickupLat: 19.1215084,
    pickupLng: 72.8975717,
    pickupLocality: "Greenport",
    pickupPincode: "10001",
    pickupName: "John Doe",
    pickupState: "New York",
    pickupStreetName: "Park Ave S",
    returnAddress: "228 Park Ave S, New York, NY ",
    returnApartment: "228",
    returnCity: "New York",
    returnClientNodeCd: "John Doe",
    returnClientNodeId: 259227,
    returnClientNodePhone: "1234567",
    returnCountry: "UNITED STATES",
    returnEmailAddress: "john.doe@gmail.com",
    returnIsActiveFl: true,
    returnLandmark: "Park Ave S",
    returnLat: 19.1215084,
    returnLng: 72.8975717,
    returnLocality: "Greenport",
    returnPincode: "10001",
    returnName: "John Doe",
    returnState: "New York",
    returnStreetName: "Park Ave S",
    shipmentId: 22121274,
    shipmentNotes: "Delivered",
    shipmentOrderTypeCd: "DELIVER",
    startTimeWindow: moment(Date()).format("YYYY-MM-DD"),
    subClientName: "TestLogoShipper",
    serviceType: "Standard",
    originBranchName: "Chicago Main Hub",
    destBranchName: 'New York Main Hub',
    tripNo: "1234567890",
    priority: 'High',
    pickupPhoneNumber: '202-555-0111',
    deliverPhoneNumber: '202-555-0166',
    pickupClientNodeType: 'Office',
    deliverClientNodeType: 'Office',
    cf_orgname: 'Herzog PLC',
    shippedBy: 'John Doe',
    orderDispatchDate: moment(Date()).format("YYYY-MM-DD"),
    endTimeWindow: '4:00 PM',
    shipmentOrderDt: moment(Date()).format("YYYY-MM-DD"),
}]