import { ICustomFieldsDataPayload, IRowData } from "./CustomFields.models";
import { IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import { IListViewRequestPayload  ,} from "../../../utils/common.interface";

export interface ISetStructureAction {
  readonly type: '@@customFields/FETCH_STRUCTURE_SUCCESS';
  payload: IMongoListViewStructure;
}
export interface IFetchStructureAction {
  readonly type: '@@customFields/FETCH_STRUCTURE';
}
export interface IFetchModuleAction {
  readonly type: '@@customFields/FETCH_MODULES';
}
export interface IFetchModuleSuccessAction {
  readonly type: '@@customFields/FETCH_MODULES_SUCCESS'
  payload: any
}
export interface IFetchFieldTypesAction {
  readonly type: '@@customFields/FETCH_FIELDTYPES';
}
export interface IFetchFieldTypesSuccessAction {
  readonly type: '@@customFields/FETCH_FIELDTYPES_SUCCESS'
  payload: any
}
export interface IFetchDataAction {
  readonly type: '@@customFields/FETCH_DATA'
  payload?: IListViewRequestPayload
}
export interface IFetchDataSuccessAction {
  readonly type: '@@customFields/FETCH_DATA_SUCCESS'
  payload: ICustomFieldsDataPayload
}

interface IUpdateDataPayload extends Partial<IRowData> {
  id: string
}
export interface IUpdateData {
  readonly type: '@@customFields/UPDATE_DATA'
  payload: IUpdateDataPayload
}

export interface ISetLoading {
  readonly type: '@@customFields/SET_LOADING',
  payload: {
    listView: boolean
  }
}

export type CustomFieldsActions =
  | ISetStructureAction
  | IFetchStructureAction
  | IFetchDataAction
  | IFetchDataSuccessAction
  | IUpdateData
  | ISetLoading
  | IFetchModuleAction
  | IFetchModuleSuccessAction
  | IFetchFieldTypesAction
  |IFetchFieldTypesSuccessAction