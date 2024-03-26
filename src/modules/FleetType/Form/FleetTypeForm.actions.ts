import { IMongoFormStructure } from './../../../utils/mongo/interfaces';
import {IFleetTypeData, IResetFleetTypeData, IClientMetricData, IDropdown, ICompartmentStucture} from './FleetTypeForm.models'

export interface IFleetTypeFormFetchStructure {
    readonly type: '@@fleetTypeForm/FETCH_STRUCTURE'
  }

  export interface IFleetTypeFormSetStructure {
    readonly type: '@@fleetTypeForm/SET_STRUCTURE'
    payload: IMongoFormStructure
  }

  export interface IFleetTypeSetLoading {
    readonly type: '@@fleetTypeForm/SET_LOADING'
    payload: boolean
  }

  export interface IFleetTypeSetEditMode {
    readonly type: '@@fleetTypeForm/SET_EDIT_MODE',
    payload: boolean
  }

  export interface IFleetTypeSetVehicleData {
    readonly type: '@@fleetTypeForm/SET_FLEETTYPE_DATA',
    payload: IFleetTypeData
  }

  export interface ISetFormResetData {
    readonly type: '@@fleetTypeForm/SET_FORM_RESET_DATA'
    payload: IResetFleetTypeData
  }

  export interface IResetState {
    readonly type: '@@fleetTypeForm/RESET_INITIAL_STATE'
  }

  export interface IClientMetric {
    readonly type: '@@fleetTypeForm/SET_CLIENT_METRIC_SYSTEM';
    payload: IClientMetricData[]
  }
  export interface ICompartmentFormSetStructure {
    readonly type: '@@fleetTypeForm/SET_COMPARTMENT_STRUCTURE'
    payload: ICompartmentStucture[]
  }
  export interface IFetchCompartmentMasterList {
    readonly type: '@@fleetTypeForm/FETCH_COMPARTMENT_MASTER_DATA';
  }
  export interface ISetCompartmentMasterList {
    readonly type: '@@fleetTypeForm/SET_COMPARTMENT_MASTER_DATA',
    payload: IDropdown[]
  }
  export type IFleetTypeActions =
  | IFleetTypeFormFetchStructure
  | IFleetTypeFormSetStructure
  | IFleetTypeSetLoading
  | IFleetTypeSetEditMode
  | IFleetTypeSetVehicleData
  | ISetFormResetData
  | IResetState
  | IClientMetric
  | ICompartmentFormSetStructure
  | IFetchCompartmentMasterList
  | ISetCompartmentMasterList

