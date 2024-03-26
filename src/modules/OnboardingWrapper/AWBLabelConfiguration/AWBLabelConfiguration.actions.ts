import { IListViewRequestPayload } from "../../../utils/common.interface";
import { IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import { IAwbLabelConfigTagsAPIResponse, IAWBListDataPayload, IAwbTemplateFormData, IDefaultTemplate, IPropertyType, IRowData } from "./AWBLabelConfiguration.models";

export interface ISetStructureAction {
    readonly type: '@@awbLabelConfig/FETCH_STRUCTURE_SUCCESS';
    payload: IMongoListViewStructure;
}

export interface IFetchStructureAction {
    readonly type: '@@awbLabelConfig/FETCH_STRUCTURE';
}

export interface IFetchDataAction {
    readonly type: '@@awbLabelConfig/FETCH_DATA';
    payload?: IListViewRequestPayload;
}
export interface IFetchDataSuccessAction {
    readonly type: '@@awbLabelConfig/FETCH_DATA_SUCCESS';
    payload: IAWBListDataPayload;
}

interface IChangeStatusPayload extends Partial<IRowData>  {
    awbTemplateId: number;
}

export interface IChangeStatus {
  readonly type: '@@awbLabelConfig/CHANGE_STATUS';
  payload: IChangeStatusPayload;
}

export interface ISetColumnsLoading {
    readonly type : '@@awbLabelConfig/SET_COLUMNS_LOADING';
    payload: {
      columns: boolean;
    };
}
export interface ISetLoading {
    readonly type: '@@awbLabelConfig/SET_LOADING',
    payload: {
      listView: boolean
    }
}

export interface ISetPageTypeData {
    type: '@@awbLabelConfig/SET_PAGE_TYPE';
    payload: any
}

export interface ISetData {
  type: '@@awbLabelConfig/SET_DATA';
  payload: {
      key: string,
      value: any
  }
}

export interface ISetFormData {
    type: '@@awbLabelConfig/SET_FORM_DATA';
    payload: {
        key: string,
        value: any
    }
}

export interface ISetDefaultSelectedTemplate {
    type: '@@awbLabelConfig/SET_DEFAULT_SELECTED_TEMPLATE';
    payload: IDefaultTemplate
}

export interface IAwbLableConfigFetchTags {
    readonly type: '@@awbLabelConfig/FETCH_TAGS'
  }
  
export interface IAwbLableConfigFetchTagsSuccess {
    readonly type: '@@awbLabelConfig/FETCH_TAGS_SUCCESS'
    payload: IAwbLabelConfigTagsAPIResponse
}

export interface IGetAwbLabelTemplateDetails {
  type: '@@awbLabelConfig/GET_AWB_TEMPLATE_DETAILS_DATA',
  payload: {
    awbTemplateId: number
  }
}

export interface ISetAwbLabelTemplateDetails {
  type: '@@awbLabelConfig/SET_AWB_TEMPLATE_DETAILS_DATA',
  payload: IAwbTemplateFormData
}

export interface ISetFormLoading {
  readonly type: '@@awbLabelConfig/SET_FORM_LOADING',
  payload:  boolean
}

export interface IResetForm {
  type: '@@awbLabelConfig/INITIALISE_FORM'
}

export interface IGetDefaultTemplateListAction {
  readonly type: '@@awbLabelConfig/FETCH_DEFAULT_TEMPLATE_LIST';
}

export interface IGetDefaultTemplateListActionSuccess {
  readonly type: '@@awbLabelConfig/FETCH_DEFAULT_TEMPLATE_LIST_SUCCESS';
  payload: Array<IDefaultTemplate>
}

export interface IGetPropertyTypeAction {
  readonly type: '@@awbLabelConfig/FETCH_PROPERTY_TYPE'
}

export interface IGetPropertyTypeActionSuccess {
  readonly type: '@@awbLabelConfig/FETCH_PROPERTY_TYPE_SUCCESS'
  payload: IPropertyType
}

export type AWBLabelConfigActions = 
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