import {IMongoFormStructure} from "../../../utils/mongo/interfaces";
import { IClientMetricSystem, IListViewRequestPayload } from "../../../utils/common.interface";
export interface IFetchStructureAction {
  readonly type: '@@planningForm/FETCH_STRUCTURE';
}
export interface IFetchOutSourcedFleetStructureAction {
  readonly type: '@@planningForm/FETCH_OUTSOURCEDFLEET_STRUCTURE';
}

export interface IFetchOwnedFleetStructureAction {
  readonly type: '@@planningForm/FETCH_OWNEDFLEET_STRUCTURE';
}

export interface IFetchTerritoriesList {
  readonly type: '@@planningForm/FETCH_TERRITORY_LIST';
  payload:number
}
export interface ISetTerritoriesList {
  readonly type: '@@planningForm/SET_TERRITORY_LIST';
  payload:any
}
export interface IFetchTerritoryProfileList {
  readonly type: '@@planningForm/FETCH_TERRITORY_PROFILE_LIST';
}
export interface IFetchPlanningProfileList {
  readonly type: '@@planningForm/FETCH_PLANNING_PROFILE_LIST';
}
export interface IFetchBranchList {
  readonly type: '@@planningForm/FETCH_BRANCH_LIST';
}
export interface ISetTerritoryProfileList {
  readonly type: '@@planningForm/SET_TERRITORY_PROFILE_LIST';
  payload?:any
}
export interface ISetPlanningProfileList {
  readonly type: '@@planningForm/SET_PLANNING_PROFILE_LIST';
  payload?:any
}
export interface ISetBranchList {
  readonly type: '@@planningForm/SET_BRANCH_LIST';
  payload?:any
}
export interface ISetEditMode {
  readonly type: '@@planningForm/SET_EDIT_MODE';
  payload?:boolean
}
export interface IFetchDataAction {
  readonly type: '@@planningForm/FETCH_DATA'
  payload?: IListViewRequestPayload
}

export interface IFetchOrderDetailsStructureAction {
  readonly type: '@@planningForm/FETCH_ORDER_DETAILS_STRUCTURE'
  payload?: IListViewRequestPayload
}
export interface ISetOrderDetailsStructureAction {
  readonly type: '@@planningForm/SET_ORDER_DETAILS_LIST_STRUCTURE'
  payload: IMongoFormStructure
}
export interface ISetLoading {
  readonly type: '@@planningForm/SET_LOADING',
  payload: boolean
}

export interface IResetState {
  readonly type: '@@planningForm/RESET_INITIAL_STATE'
}

export interface IFormSetGeneralDetailsStructure {
    readonly type: '@@planningForm/SET_GENERAL_STRUCTURE'
    payload: IMongoFormStructure
}
export interface IFormSetOutsourcedFleetStructure {
  readonly type: '@@planningForm/SET_OUTSOURCEDFLEET_STRUCTURE'
  payload: IMongoFormStructure
}
export interface IFormSetOrderDetailsStructure {
    readonly type: '@@planningForm/SET_ORDER_DETAILS_STRUCTURE'
    payload: IMongoFormStructure
}
export interface IFormSetOwnedFleetStructure {
    readonly type: '@@planningForm/SET_OWNED_FLEET_STRUCTURE'
    payload: IMongoFormStructure
}
export interface IFormFetchOutsourcedFleetData {
    readonly type: '@@planningForm/FETCH_OUTSOURCEDFLEET_DATA'
    payload: IMongoFormStructure
}
export interface IFormSetOutsourcedFleetData {
  readonly type: '@@planningForm/SET_OUTSOURCEDFLEET_DATA'
  payload: IMongoFormStructure
}
export interface IFormFetchOwnedFleetData {
  readonly type: '@@planningForm/FETCH_OWNEDFLEET_DATA'
  payload: IMongoFormStructure
}
export interface IFormSetOwnedFleetData {
readonly type: '@@planningForm/SET_OWNEDFLEET_DATA'
payload: IMongoFormStructure
}
export interface IClientMetric {
  readonly type: '@@planningForm/SET_CLIENT_METRIC_SYSTEM';
  payload: IClientMetricSystem[]
}
export interface IUpdateStepperConfig {
  readonly type: '@@planningForm/UPDATE_STEPPER_CONFIG'
  payload:any
}
export interface IResetStepperConfig {
  readonly type: '@@planningForm/STEPPER_CONFIG'
}
export interface ISetOrderDetailsFilter {
  readonly type: '@@planningForm/SET_ORDER_DETAILS_FILTER'
  payload:any
}
export interface ISetDAFILTER {
  readonly type: '@@planningForm/SET_DA_DETAILS_FILTER'
  payload:any
}
export interface ISaveFormData {
  readonly type: '@@planningForm/SAVE_FORM_DATA'
  payload:any
}
export interface IUpdateFormData {
  readonly type: '@@planningForm/UPDATE_FORM_DATA'
  payload:any
}
export interface ISetSelectedOwnedFleets {
  readonly type: '@@planningForm/SET_SELECTED_OWNED_FLEETS'
  payload:any
}
export interface ISetEditedOwnedFleets {
  readonly type: '@@planningForm/SET_EDITED_OWNED_FLEETS'
  payload:any
}
export interface ISetEditedOutsourcedFleets {
  readonly type: '@@planningForm/SET_EDITED_OUTSOURCED_FLEETS'
  payload:any
}
export interface ISetSelectedOutSourcedFleets {
  readonly type: '@@planningForm/SET_SELECTED_OUTSOURCED_FLEETS'
  payload:any
}
export interface IShowAttachedTerritoriesModal {
  readonly type: '@@planningForm/SHOW_ATTACH_TERRITORIES_MODAL'
  payload:any
}
export interface IHideAttachedTerritoriesModal {
  readonly type: '@@planningForm/HIDE_ATTACH_TERRITORIES_MODAL'
  payload?:{
    rowId:string
  }
}
export interface IAttachedTerritoriesToFleet {
  readonly type: '@@planningForm/ATTACH_FLEET_TO_TERRITORIES'
  payload:any
}

export type TripPlanningScheduler =
  | IFetchStructureAction
  | IFetchDataAction
  | ISetLoading
  | IResetState
  | IFormSetGeneralDetailsStructure
  | IFormSetOrderDetailsStructure
  | IFormSetOwnedFleetStructure
  | IFormSetOutsourcedFleetStructure
  | IUpdateStepperConfig
  | IFetchOutSourcedFleetStructureAction
  | IFormFetchOutsourcedFleetData
  | IFormSetOutsourcedFleetData
  | IFormFetchOwnedFleetData
  | IFormSetOwnedFleetData
  | IFetchOwnedFleetStructureAction
  | IClientMetric
  | ISaveFormData
  | IFetchTerritoryProfileList
  | ISetTerritoryProfileList
  | ISetSelectedOwnedFleets
  | ISetSelectedOutSourcedFleets
  | IFetchOrderDetailsStructureAction
  | ISetOrderDetailsStructureAction
  | ISetOrderDetailsFilter
  | ISetDAFILTER
  | IFetchPlanningProfileList
  | ISetPlanningProfileList
  | ISetEditMode
  | ISetEditedOwnedFleets
  | IUpdateFormData
  | ISetBranchList
  | IFetchBranchList
  | IResetStepperConfig
  | IShowAttachedTerritoriesModal
  | ISetEditedOutsourcedFleets
  | IAttachedTerritoriesToFleet
  | IHideAttachedTerritoriesModal
  | IFetchTerritoriesList
  | ISetTerritoriesList