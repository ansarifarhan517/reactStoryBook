import { IListViewRequestPayload } from "../../../../utils/common.interface";
import { IMongoListViewStructure } from "../../../../utils/mongo/interfaces"
import { IDrsTempConfigTagsAPIResponse, IDefaultTemplate, IDRSListDataPayload, IDrsTemplateFormData, IRowData } from "./DRSTemplateConfiguration.models";


export interface IFetchStructureAction {
  readonly type: '@@drsTemplateConfig/GET_STRUCTURE'
}

export interface ISetStructureAction {
  readonly type: '@@drsTemplateConfig/SET_STRUCTURE'
  payload: IMongoListViewStructure;
}

export interface ISetColumnsLoading {
  readonly type: '@@drsTemplateConfig/SET_COLUMNS_LOADING';
  payload: {
    columns: boolean;
  };
}

export interface ISetLoading {
  readonly type: '@@drsTemplateConfig/SET_LOADING',
  payload: {
    listView: boolean
  }
}

export interface IFetchDataAction {
  readonly type: '@@drsTemplateConfig/FETCH_DATA';
  payload?: IListViewRequestPayload;
}

export interface IFetchDataSuccessAction {
  readonly type: '@@drsTemplateConfig/FETCH_DATA_SUCCESS';
  payload: IDRSListDataPayload;
}

export interface IChangeStatus {
  readonly type: '@@drsTemplateConfig/CHANGE_STATUS';
  payload: IChangeStatusPayload;
}

interface IChangeStatusPayload extends Partial<IRowData> {
  drsTemplateId: number;
}


export interface ISetData {
  type: '@@drsTemplateConfig/SET_DATA';
  payload: {
    key: string,
    value: any
  }
}

export interface ISetFormData {
  type: '@@drsTemplateConfig/SET_FORM_DATA';
  payload: {
    key: string,
    value: any
  }
}


export interface IGetDefaultTemplateListAction {
  readonly type: '@@drsTemplateConfig/GET_DEFAULT_TEMPLATE_LIST';
}

export interface IGetDefaultTemplateListActionSuccess {
  readonly type: '@@drsTemplateConfig/SET_DEFAULT_TEMPLATE_LIST';
  payload: Array<IDefaultTemplate>
}

export interface ISetDefaultSelectedTemplate {
  type: '@@drsTemplateConfig/SET_DEFAULT_SELECTED_TEMPLATE';
  payload: IDefaultTemplate
}

export interface IResetForm {
  type: '@@drsTemplateConfig/INITIALISE_FORM'
}

export interface IDrsTemplateConfigFetchTags {
  readonly type: '@@drsTemplateConfig/GET_TAGS'
}
export interface IDrsTemplateConfigFetchTagsSuccess {
  readonly type: '@@drsTemplateConfig/SET_TAGS'
  payload: IDrsTempConfigTagsAPIResponse
}

export interface ISetFormLoading {
  readonly type: '@@drsTemplateConfig/SET_FORM_LOADING',
  payload: boolean
}

export interface IGetDrsTemplateConfigDetails {
  type: '@@drsTemplateConfig/GET_DRS_TEMPLATE_DETAILS_DATA',
  payload: {
    templateId: number,
    type: string
  }
}
export interface ISetDrsTemplateConfigDetails {
  type: '@@drsTemplateConfig/SET_DRS_TEMPLATE_DETAILS_DATA',
  payload: IDrsTemplateFormData
}

export type DRSTemplateConfigActions =
  | IFetchStructureAction
  | ISetStructureAction
  | ISetColumnsLoading
  | ISetLoading
  | IFetchDataAction
  | IFetchDataSuccessAction
  | IChangeStatus
  | ISetFormData
  | ISetData
  | IGetDefaultTemplateListAction
  | IGetDefaultTemplateListActionSuccess
  | ISetDefaultSelectedTemplate
  | IResetForm
  | IDrsTemplateConfigFetchTags
  | IDrsTemplateConfigFetchTagsSuccess
  | ISetFormLoading
  | IGetDrsTemplateConfigDetails
  | ISetDrsTemplateConfigDetails
