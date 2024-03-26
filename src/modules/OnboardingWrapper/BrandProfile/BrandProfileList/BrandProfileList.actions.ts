import { IMongoListViewStructure } from "../../../../utils/mongo/interfaces";
import { IBrandProfileFormData, IBrandProfileListDataPayload, IBrandProfileRequestPayload, IDefaultTemplateData, IPromotionLink, IRowData } from "./BrandProfileList.models";

export interface ISetStructureAction {
    readonly type: '@@brandProfileList/FETCH_STRUCTURE_SUCCESS';
    payload: IMongoListViewStructure;
}
export interface IFetchStructureAction {
    readonly type: '@@brandProfileList/FETCH_STRUCTURE';
}
export interface IFetchDataAction {
    readonly type: '@@brandProfileList/FETCH_DATA';
    payload?: IBrandProfileRequestPayload;
}
export interface IFetchDataSuccessAction {
    readonly type: '@@brandProfileList/FETCH_DATA_SUCCESS';
    payload: IBrandProfileListDataPayload;
}
interface IChangeStatusPayload extends Partial<IRowData>  {
    brandProfileId: number;
}
export interface IChangeStatus {
  readonly type: '@@brandProfileList/CHANGE_STATUS';
  payload: IChangeStatusPayload;
}
export interface ISetData {
    type: '@@brandProfileList/SET_DATA';
    payload: {
        key: string,
        value: any
    }
}
export interface ISetProfileLinks {
    readonly type: '@@brandProfileList/SET_PROFILE_LINKS';
    payload: IPromotionLink[]
}
export interface IGetBrandProfileDetails {
    type: '@@brandProfileList/GET_BRAND_PROFILE_DETAILS_DATA',
    payload: {
        brandProfileId: number,
        subClientId?: number
    }
}
export interface ISetBrandProfileFormData {
    type: '@@brandProfileList/SET_BRAND_PROFILE_FORM_DATA';
    payload: {
        key: string,
        value: any
    }
}
export interface ISetBrandProfileDetails {
    type: '@@brandProfileList/SET_BRAND_PROFILE_DETAILS_DATA',
    payload: IBrandProfileFormData
}
export interface IResetForm {
    type: '@@brandProfileList/INITIALISE_FORM'
}
export interface ISetDefaultTemplateData {
    readonly type: '@@brandProfileList/GET_DEFAULT_TEMPLATE_DATA_SUCCESS';
    payload: IDefaultTemplateData;
}
export interface IFetchDefaultTemplateData {
    type: '@@brandProfileList/GET_DEFAULT_TEMPLATE_DATA'
}
export interface ISetColumnsLoading {
    readonly type : '@@brandProfileList/SET_COLUMNS_LOADING';
    payload: {
      columns: boolean;
    };
}
export interface ISetLoading {
    readonly type: '@@brandProfileList/SET_LOADING',
    payload: {
      listView: boolean
    }
}
export interface ISetFormLoading {
    readonly type: '@@brandProfileList/SET_FORM_LOADING',
    payload:  boolean
}
  
export type BrandProfileListActions =
  | ISetStructureAction
  | IFetchStructureAction
  | IFetchDataAction
  | IFetchDataSuccessAction
  | IChangeStatus
  | ISetData
  | ISetProfileLinks
  | IGetBrandProfileDetails
  | ISetBrandProfileDetails
  | IResetForm
  | ISetBrandProfileFormData
  | ISetDefaultTemplateData
  | IFetchDefaultTemplateData
  | ISetColumnsLoading
  | ISetLoading
  | ISetFormLoading