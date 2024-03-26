import { IClientMetricSystem, IDropdown} from "../../../utils/common.interface";
import { IMongoColumnOnlyStructure, IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import { ICheckpointCodes, ICheckpointsListDataPayload, ICheckpointsListViewPayload, ICheckpointsMappedRoutesListData, IMappedCheckpointCodes, IRowData } from "./CheckpointsListView.models";
import { IFetchDataOptions } from 'ui-library'

export interface ISetStructureAction {
    readonly type: '@@checkpointsListView/FETCH_STRUCTURE_SUCCESS';
    payload: IMongoListViewStructure;
}
  
export interface IFetchStructureAction {
    readonly type: '@@checkpointsListView/FETCH_STRUCTURE';
}

export interface IFetchMapStructureAction {
    readonly type: '@@checkpointsListView/FETCH_MAP_VIEW_STRUCTURE';
}

export interface ISetColumnsLoading {
    readonly type : '@@checkpointsListView/SET_COLUMNS_LOADING';
    payload: { columns: boolean };
}

export interface IFetchDataAction {
    readonly type: '@@checkpointsListView/FETCH_DATA'
    payload?: ICheckpointsListViewPayload
}
  
export interface ISetFetchOptions {
  readonly type: '@@checkpointsListView/SET_FETCH_OPTIONS',
  payload: IFetchDataOptions
}
export interface IFetchDataSuccessAction {
    readonly type: '@@checkpointsListView/FETCH_DATA_SUCCESS'
    payload: ICheckpointsListDataPayload
}

export interface ISetDataLoading {
    readonly type: "@@checkpointsListView/SET_DATA_LOADING";
    payload: {
      listView: boolean;
    };
}
  
export interface ISetFormEditable {
  readonly type: "@@checkpointsListView/SET_FORM_EDITABLE";
  payload: boolean
}

export interface IClientMetric {
    readonly type: '@@checkpointsListView/SET_CLIENT_METRIC_SYSTEM';
    payload: IClientMetricSystem[]
}

interface IChangeStatusPayload extends Partial<IRowData> {
  checkpointId: number;
}

export interface IChangeStatus {
  readonly type: "@@checkpointsListView/CHANGE_STATUS";
  payload: IChangeStatusPayload;
}

export interface ISetViewMode {
  readonly type: "@@checkpointsListView/SET_VIEW_MODE";
  payload: "listview" | "mapview";
}
export interface ISetUploadModal {
  readonly type: '@@checkpointsListView/SET_UPLOAD_MODAL',
  payload: boolean
}

interface IUpdateDataPayload extends Partial<IRowData> {
  checkpointId: number
}
export interface IUpdateData {
  readonly type: '@@checkpointsListView/UPDATE_DATA'
  payload: IUpdateDataPayload
}

export interface IFetchModalListViewStructure {
  readonly type: "@@checkpointsListView/FETCH_MODAL_LISTVIEW_STRUCTURE";
}
export interface ISetModalListViewStructure {
  readonly type: "@@checkpointsListView/SET_MODAL_LISTVIEW_STRUCTURE";
  payload: IMongoColumnOnlyStructure
}

export interface IFetchDropdownData {
  readonly type: '@@checkpointsListView/FETCH_DROPDOWN_OPTIONS';
}

export interface ISetCategory {
  readonly type: '@@checkpointsListView/SET_CATEGORY_LIST',
  payload: IDropdown[]
}

export interface IOpenModal {
  readonly type: '@@checkpointsListView/SET_MODAL_OPEN',
  payload : boolean
}

export interface IOpenCheckpointsMappedToRoutesModal {
  readonly type: '@@checkpointsListView/SET_CHECKPOINTS_MAPPED_TO_ROUTES_MODAL',
  payload : boolean
}

export interface IFetchCheckpointsMappedRoutesListStructure {
  readonly type: "@@checkpointsListView/FETCH_CHECKPOINTS_MAPPED_ROUTES_LIST_STRUCTURE";
}

export interface ISetCheckpointsMappedRoutesListStructure {
  readonly type: "@@checkpointsListView/SET_CHECKPOINTS_MAPPED_ROUTES_LIST_STRUCTURE";
  payload: IMongoColumnOnlyStructure
}

export interface IFetchCheckpointsMappedRoutesListData {
  readonly type: '@@checkpointsListView/FETCH_CHECKPOINTS_MAPPED_ROUTES_LIST_DATA'
  payload?: ICheckpointsListViewPayload
}

export interface IFetchCheckpointsMappedRoutesListDataSuccess {
  readonly type: '@@checkpointsListView/FETCH_CHECKPOINTS_MAPPED_ROUTES_LIST_DATA_SUCCESS'
  payload: ICheckpointsMappedRoutesListData
}

export interface IFetchCheckpointCodes {
  readonly type: '@@checkpointsListView/FETCH_CHECKPOINT_CODES'
  payload?: {searchText: String}
}

export interface ISetCheckpointCodes {
  readonly type: '@@checkpointsListView/SET_CHECKPOINT_CODES',
  payload: Array<ICheckpointCodes>
}

export interface ISetCheckpointProps {
  readonly type: '@@checkpointsListView/SET_CHECKPOINT_PROPS',
  payload: Array<Array<IMappedCheckpointCodes>>
}

export interface ISetRowIds {
  readonly type: '@@checkpointsListView/SET_ROW_IDS',
  payload: Array<number>
}

export type CheckpointsListViewActions = 
    | ISetStructureAction
    | IFetchStructureAction
    | IFetchMapStructureAction
    | ISetColumnsLoading
    | IFetchDataAction
    | IFetchDataSuccessAction
    | ISetDataLoading
    | ISetFormEditable
    | IChangeStatus
    | ISetViewMode
    | ISetUploadModal
    | IUpdateData
    | IFetchModalListViewStructure
    | ISetModalListViewStructure
    | IFetchDropdownData
    | ISetCategory
    | IOpenModal
    | IOpenCheckpointsMappedToRoutesModal
    | IFetchCheckpointsMappedRoutesListStructure
    | ISetCheckpointsMappedRoutesListStructure
    | IFetchCheckpointsMappedRoutesListData
    | IFetchCheckpointsMappedRoutesListDataSuccess
    | IFetchCheckpointCodes
    | ISetCheckpointCodes
    | ISetCheckpointProps
    | ISetFetchOptions
    | ISetRowIds
