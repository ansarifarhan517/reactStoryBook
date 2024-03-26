import { IListViewRequestPayload } from "../../../utils/common.interface";
import { IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import { IManifestLabelConfigTagsAPIResponse, IAWBListDataPayload, IManifestTemplateFormData, IDefaultTemplate, IPropertyType, IRowData } from "./ManifestLabelConfiguration.models";

export interface ISetStructureAction {
    readonly type: '@@manifestLabelConfig/FETCH_STRUCTURE_SUCCESS';
    payload: IMongoListViewStructure;
}

export interface IFetchStructureAction {
    readonly type: '@@manifestLabelConfig/FETCH_STRUCTURE';
}

export interface IFetchDataAction {
    readonly type: '@@manifestLabelConfig/FETCH_DATA';
    payload?: IListViewRequestPayload;
}
export interface IFetchDataSuccessAction {
    readonly type: '@@manifestLabelConfig/FETCH_DATA_SUCCESS';
    payload: IAWBListDataPayload;
}

interface IChangeStatusPayload extends Partial<IRowData>  {
    awbTemplateId: number;
}

export interface IChangeStatus {
  readonly type: '@@manifestLabelConfig/CHANGE_STATUS';
  payload: IChangeStatusPayload;
}

export interface ISetColumnsLoading {
    readonly type : '@@manifestLabelConfig/SET_COLUMNS_LOADING';
    payload: {
      columns: boolean;
    };
}
export interface ISetLoading {
    readonly type: '@@manifestLabelConfig/SET_LOADING',
    payload: {
      listView: boolean
    }
}

export interface ISetPageTypeData {
    type: '@@manifestLabelConfig/SET_PAGE_TYPE';
    payload: any
}

export interface ISetData {
  type: '@@manifestLabelConfig/SET_DATA';
  payload: {
      key: string,
      value: any
  }
}

export interface ISetFormData {
    type: '@@manifestLabelConfig/SET_FORM_DATA';
    payload: {
        key: string,
        value: any
    }
}

export interface ISetDefaultSelectedTemplate {
    type: '@@manifestLabelConfig/SET_DEFAULT_SELECTED_TEMPLATE';
    payload: IDefaultTemplate
}

export interface IAwbLableConfigFetchTags {
    readonly type: '@@manifestLabelConfig/FETCH_TAGS'
  }
  
export interface IAwbLableConfigFetchTagsSuccess {
    readonly type: '@@manifestLabelConfig/FETCH_TAGS_SUCCESS'
    payload: IManifestLabelConfigTagsAPIResponse
}

export interface IGetAwbLabelTemplateDetails {
  type: '@@manifestLabelConfig/GET_AWB_TEMPLATE_DETAILS_DATA',
  payload: {
    templateId: number,
    type: string
  }
}

export interface ISetAwbLabelTemplateDetails {
  type: '@@manifestLabelConfig/SET_AWB_TEMPLATE_DETAILS_DATA',
  payload: IManifestTemplateFormData
}

export interface ISetFormLoading {
  readonly type: '@@manifestLabelConfig/SET_FORM_LOADING',
  payload:  boolean
}

export interface IResetForm {
  type: '@@manifestLabelConfig/INITIALISE_FORM'
}

export interface IGetDefaultTemplateListAction {
  readonly type: '@@manifestLabelConfig/FETCH_DEFAULT_TEMPLATE_LIST';
}

export interface IGetDefaultTemplateListActionSuccess {
  readonly type: '@@manifestLabelConfig/FETCH_DEFAULT_TEMPLATE_LIST_SUCCESS';
  payload: Array<IDefaultTemplate>
}

export interface IGetPropertyTypeAction {
  readonly type: '@@manifestLabelConfig/FETCH_PROPERTY_TYPE'
}

export interface IGetPropertyTypeActionSuccess {
  readonly type: '@@manifestLabelConfig/FETCH_PROPERTY_TYPE_SUCCESS'
  payload: IPropertyType
}

export type ManifestLabelConfigActions = 
    | ISetStructureAction
    | IFetchStructureAction
    | IFetchDataAction
    | IFetchDataSuccessAction
    | IChangeStatus
    | ISetColumnsLoading
    | ISetLoading
    | ISetPageTypeData
    | ISetFormData
    | ISetDefaultSelectedTemplate
    | IAwbLableConfigFetchTags
    | IAwbLableConfigFetchTagsSuccess
    | ISetData
    | IGetAwbLabelTemplateDetails
    | ISetAwbLabelTemplateDetails
    | ISetFormLoading
    | IResetForm
    | IGetDefaultTemplateListAction
    | IGetDefaultTemplateListActionSuccess
    | IGetPropertyTypeAction
    | IGetPropertyTypeActionSuccess