import { IMongoFormStructure } from '../../../utils/mongo/interfaces';

export interface IFleetTypeFormReducerState {
    structure: IMongoFormStructure
    loading: boolean
    isEditMode: boolean,
    fleetTypeData?: IFleetTypeData,
    resetData?: IFleetTypeData
    clientMetric: IClientMetricData
    isDirty: boolean
    compartmentStructure:any
    compartmentMasterList?: IDropdown[],
  }

  export interface IFleetTypeData {
    id?: number
    type?: string
    make?: string
    capacityInUnits?: number
    capacityInVolume?: number
    capacityInWeight?: number
    minCapacityUtilizationInUnits?: number
    minCapacityUtilizationInVolume?: number
    minCapacityUtilizationInWeight?: number
    skillSet?: string[]
    fixedCost?: number
    variableCost?: number
    waitingTimeCost?: number
    transportTimeCost?: number
    shiftStartTime?: string
    shiftEndTime?: string
    breakStartTimeWindow?: string
    breakEndTimeWindow?: string
    breakDurationInMins?: number
    weeklyOffList?: string[]
    maxDistance?: number
    loadingTimeInMins?: number
    compartmentList?: ICompartmentDetails[]
    rateProfileId?: number
    rateProfileName?: string
    payoutProfileId?: number
    payoutProfileName?: string
    minSpeed? :number
    maxSpeed? :number
  }

  export interface IResetFleetTypeData {
    [key: string]: any
  }

  export interface IFleetTypeDynamicLabel {
    /** Pending - Add Form Formats for each */
    [key: string]: any
  }

  export interface singleClientMetric {
    conversionFactor: number
    name: string
    precision: number
}
export interface IClientMetricData {
    [key: string]: singleClientMetric
}
export interface ICompartmentDetails {
  compartmentId: number | string;
  noOfUnits: number;
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