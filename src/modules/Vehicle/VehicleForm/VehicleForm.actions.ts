import { ISystemClientMetric, IClientMetric as IVehicleClientMetric , IDropdown, ICompartmentStucture} from './VehicleForm.model';
import {
  IMongoFormStructure,
  // ICustomFieldsEntity, IMultiselectEntity, IFileEntity, IAddressEntity
} from './../../../utils/mongo/interfaces';

import { IVehicleData, IVehicleFormData } from './VehicleForm.model'
/** Actions */
export interface IVehicleFormFetchStructure {
  readonly type: '@@vehicleForm/FETCH_STRUCTURE'
}

export interface IVehicleFormSetStructure {
  readonly type: '@@vehicleForm/SET_STRUCTURE'
  payload: IMongoFormStructure
}

export interface IVehicleFormSetLoading {
  readonly type: '@@vehicleForm/SET_LOADING'
  payload: boolean
}

export interface IVehicleFormSetEditMode {
  readonly type: '@@vehicleForm/SET_EDIT_MODE',
  payload: boolean
}

export interface IVehicleFormSetVehicleData {
  readonly type: '@@vehicleForm/SET_VEHICLE_DATA',
  payload: IVehicleData
}

export interface ISetFormResetData {
  readonly type: '@@vehicleForm/SET_FORM_RESET_DATA'
  payload: IVehicleFormData
}

export interface IResetState {
  readonly type: '@@vehicleForm/RESET_INITIAL_STATE'
}

export interface IInitialLoad {
  readonly type: '@@vehicleForm/INITIAL_DROPDOWN_LOAD';
}
export interface IVehicleFormSetFleetType {
  type: '@@vehicleForm/SET_FLEET_TYPE',
  payload: any[]
}

export interface ISystemMetric {
  readonly type: '@@vehicleForm/SET_SYSTEM_METRIC_SYSTEM';
  payload: ISystemClientMetric
}

export interface IClientMetric {
  readonly type: '@@vehicleForm/SET_CLIENT_METRIC_SYSTEM';
  payload: IVehicleClientMetric[]
}
export interface ICompartmentFormSetStructure {
  readonly type: '@@vehicleForm/SET_COMPARTMENT_STRUCTURE'
  payload: ICompartmentStucture[]
}
export interface ICompartmentFormSetBaseStructure {
  readonly type: '@@vehicleForm/SET_BASE_COMPARTMENT_STRUCTURE'
  payload: ICompartmentStucture[]
}
export interface IFetchCompartmentMasterList {
  readonly type: '@@vehicleForm/FETCH_COMPARTMENT_MASTER_DATA';
}
export interface ISetCompartmentMasterList {
  readonly type: '@@vehicleForm/SET_COMPARTMENT_MASTER_DATA',
  payload: IDropdown[]
}
export interface IFetchTrackerMasterList {
  readonly type: '@@vehicleForm/FETCH_TRACKER_MASTER_DATA';
  payload: any
}
export interface ISetTrackerMasterList {
  readonly type: '@@vehicleForm/SET_TRACKER_MASTER_DATA',
  payload: IDropdown[]
}
export type IVehicleFormActions =
  | IVehicleFormFetchStructure
  | IVehicleFormSetStructure
  | IVehicleFormSetLoading
  | IVehicleFormSetEditMode
  | IVehicleFormSetVehicleData
  | ISetFormResetData
  | IResetState
  | IInitialLoad
  | IVehicleFormSetFleetType
  | ISystemMetric
  | IClientMetric
  | ICompartmentFormSetStructure
  | ISetCompartmentMasterList
  | IFetchCompartmentMasterList
  | ICompartmentFormSetBaseStructure
  | IFetchTrackerMasterList
  | ISetTrackerMasterList

