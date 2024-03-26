import {
    IMongoFormStructure,
    ICustomFieldsEntity,
    //  IMultiselectEntity,
    IFileEntity,
    //  IAddressEntity
} from './../../../utils/mongo/interfaces';

export interface IVehicleData {
    vehicleId: number
    vehicleName?: string
    clientBranchId?: number
    vehicleType?: string
    vehicleNumber?: string
    vehicleModel?: string
    chasisNumber?: string
    engineNumber?: string
    markerName?: string
    vehiclePermit?: string
    registrationNumber?: string
    registrationCopy?: IFileEntity[]
    pucValidity?: string
    pucCopy?: IFileEntity[]
    insuranceValidity?: Date
    insuranceCopy?: IFileEntity[]
    vehiclePurchaseDate?: string
    ownerName?: string
    transporter?: string
    financer?: string
    accidentHistory?: string
    weeklyOffList?: string[]
    unladdenWeight?: string
    cf_NewField_Date?: string
    previousVehicleNumber?: string
    guid?: string
    removedRegistrationMediaId?: string
    removedInsuranceMediaId?: string
    removedPucMediaId?: string
    ownership?: string
    fleetTypeId?: number
    capacityInWeight: number
    capacityInVolume: number
    capacityInUnits: number
    skillSet?: string
    deliveryType?: string
    fixedCost?: number
    variableCost?: number
    transportTimeCost?: number
    waitingTimeCost?: number
    shiftStartTime?: string
    shiftEndTime?: string
    breakStartTimeWindow?: string
    breakEndTimeWindow?: string
    minSpeed?:string
    maxSpeed?:string
    customFieldsEntity?: ICustomFieldsEntity[]
    [key: string]: any
}

export interface ISystemClientMetric {
    isActiveFl?: boolean
    clientPropertieMasterId?: number
    propertyKey?: string
    propertyValue?: string
    propertyType?: string
    showProperty?: string
    defaults?: string
    description?: string
    modelType?: string
}

export interface singleClientMetric {
    conversionFactor: number
    name: string
    precision: number
}
export interface IClientMetric {
    [key: string]: singleClientMetric
}

export interface IFleetType {
    id: number
    type: string
    make: string
    capacityInUnits: number
    capacityInWeight: number
    capacityInVolume: number
    minCapacityUtilizationInUnits: number
    minCapacityUtilizationInVolume: number
    minCapacityUtilizationInWeight: number
    skillSet?: any[]
}

export interface IVehicleFormReducerState {
    structure: IMongoFormStructure
    loading: boolean
    isEditMode: boolean
    vehicleData?: IVehicleData
    resetData?: IVehicleFormData
    fleetType: IFleetType[]
    systemMetric: ISystemClientMetric
    clientMetric: IClientMetric
    compartmentStructure: any
    compartmentBaseStructure: any
    compartmentMasterList?: IDropdown[]
    trackerMasterList? : IDropdown[]
}
export interface IVehicleDropdown {
    id: string
    name: string
}

export interface IVehicleFormData {
    /** Pending - Add Form Formats for each */
    [key: string]: any
}
export interface IDropdown {
    label: string
    value: number | string
    [key: string]: any
}
export interface ICompartmentStucture {
    [key: string]: {
      [key: string]: any
    }
}
export interface IEffectAction {
    [key: string]: any;
}
