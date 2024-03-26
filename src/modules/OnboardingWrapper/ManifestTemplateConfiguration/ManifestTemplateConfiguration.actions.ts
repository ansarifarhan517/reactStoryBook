import { IListViewRequestPayload } from "../../../utils/common.interface";
import { IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import {
  IDefaultTemplate,
  IManifestTemplateConfigFormData,
  IManifestTemplateConfigListDataPayload,
  IManifestTemplateConfigTagsAPIResponse,
  IPropertyType,
  IRowData,
} from "./ManifestTemplateConfiguration.models";

export interface ISetStructureAction {
  readonly type: "@@manifestTemplateConfig/FETCH_STRUCTURE_SUCCESS";
  payload: IMongoListViewStructure;
}

export interface IFetchStructureAction {
  readonly type: "@@manifestTemplateConfig/FETCH_STRUCTURE";
}

export interface ISetColumnsLoading {
  readonly type: "@@manifestTemplateConfig/SET_COLUMNS_LOADING";
  payload: {
    columns: boolean;
  };
}

export interface IFetchDataAction {
  readonly type: "@@manifestTemplateConfig/FETCH_DATA";
  payload?: IListViewRequestPayload;
}

export interface ISetDataSuccessAction {
  readonly type: "@@manifestTemplateConfig/FETCH_DATA_SUCCESS";
  payload: IManifestTemplateConfigListDataPayload;
}

export interface ISetDataLoading {
  readonly type: "@@manifestTemplateConfig/SET_DATA_LOADING";
  payload: {
    listView: boolean;
  };
}

export interface ISetData {
  readonly type: "@@manifestTemplateConfig/SET_DATA";
  payload: {
    key: string;
    value: any;
  };
}

export interface ISetFormData {
  readonly type: "@@manifestTemplateConfig/SET_FORM_DATA";
  payload: {
    key: string;
    value: any;
  };
}

export interface IManifestTemplateConfigFetchTags {
  readonly type: "@@manifestTemplateConfig/FETCH_TAGS";
}

export interface IManifestTemplateConfigFetchTagsSuccess {
  readonly type: "@@manifestTemplateConfig/FETCH_TAGS_SUCCESS";
  payload: IManifestTemplateConfigTagsAPIResponse;
}

export interface IResetForm {
  type: "@@manifestTemplateConfig/INITIALISE_FORM";
}

export interface IGetDefaultTemplateListAction {
  readonly type: "@@manifestTemplateConfig/FETCH_DEFAULT_TEMPLATE_LIST";
}

export interface IGetDefaultTemplateListActionSuccess {
  readonly type: "@@manifestTemplateConfig/FETCH_DEFAULT_TEMPLATE_LIST_SUCCESS";
  payload: Array<IDefaultTemplate>;
}

export interface ISetDefaultSelectedTemplate {
  type: "@@manifestTemplateConfig/SET_DEFAULT_SELECTED_TEMPLATE";
  payload: IDefaultTemplate;
}

export interface IGetManifestTemplateDetails {
  type: "@@manifestTemplateConfig/GET_MANIFEST_TEMPLATE_DETAILS_DATA";
  payload: {
    templateId: number;
    type: string;
  };
}

export interface ISetManifestTemplateDetails {
  type: "@@manifestTemplateConfig/SET_MANIFEST_TEMPLATE_DETAILS_DATA";
  payload: IManifestTemplateConfigFormData;
}

export interface ISetFormLoading {
  readonly type: "@@manifestTemplateConfig/SET_FORM_LOADING";
  payload: boolean;
}

export interface IGetPropertyTypeAction {
  readonly type: "@@manifestTemplateConfig/FETCH_PROPERTY_TYPE";
}

export interface IGetPropertyTypeActionSuccess {
  readonly type: "@@manifestTemplateConfig/FETCH_PROPERTY_TYPE_SUCCESS";
  payload: IPropertyType;
}

interface IChangeStatusPayload extends Partial<IRowData> {
  templateId: number;
}

export interface IChangeStatus {
  readonly type: "@@manifestTemplateConfig/CHANGE_STATUS";
  payload: IChangeStatusPayload;
}

export type ManifestTemplateConfigActions =
  | ISetStructureAction
  | IFetchStructureAction
  | ISetColumnsLoading
  | IFetchDataAction
  | ISetDataSuccessAction
  | ISetDataLoading
  | ISetData
  | ISetFormData
  | IManifestTemplateConfigFetchTags
  | IManifestTemplateConfigFetchTagsSuccess
  | IResetForm
  | IGetDefaultTemplateListAction
  | IGetDefaultTemplateListActionSuccess
  | ISetDefaultSelectedTemplate
  | IGetManifestTemplateDetails
  | ISetManifestTemplateDetails
  | ISetFormLoading
  | IGetPropertyTypeAction
  | IGetPropertyTypeActionSuccess
  | IChangeStatus;
