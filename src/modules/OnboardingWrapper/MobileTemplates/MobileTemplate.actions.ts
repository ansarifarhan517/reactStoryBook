import { IListViewRequestPayload } from "../../../utils/common.interface";
import { IMongoFormStructure, IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import { IMobileRoleByAccessProfileIdRequestPayload, IMobileRoleListDataPayload, IMobileTemplate, IMobileTemplateAccordianStructure, IDynamicCardTileList, IMobileTemplateListDataPayload, IDynamicOrderMasterStructure, IFormInputs, ITripStartTimePayload } from "./MobileTemplate.models";

export interface IFetchListViewStructureAction {
    readonly type: '@@mobileTemplates/FETCH_LISTVIEW_STRUCTURE';
}

export interface IFetchListViewStructureActionSuccess {
    readonly type: '@@mobileTemplates/FETCH_LISTVIEW_STRUCTURE_SUCCESS';
    payload: IMongoListViewStructure;
}

export interface IFetchMobileTemplateListAction {
    readonly type: '@@mobileTemplates/FETCH_MOBILE_TEMPLATE_LIST';
    payload?: IListViewRequestPayload
}

export interface IFetchMobileTemplateListActionSuccess {
    readonly type: '@@mobileTemplates/FETCH_MOBILE_TEMPLATE_LIST_SUCCESS';
    payload: IMobileTemplateListDataPayload
}

export interface IFetchMobileTemplateFormStructureAction {
    readonly type: '@@mobileTemplates/FETCH_MOBILE_TEMPLATES_FORM_STRUCTURE';
}

export interface IFetchMobileTemplateFormStructureActionSuccess {
    readonly type: '@@mobileTemplates/FETCH_MOBILE_TEMPLATES_FORM_STRUCTURE_SUCCESS';
    payload: IMongoFormStructure
}

export interface IFetchMobileRolesListViewStructureAction {
    readonly type: '@@mobileTemplates/FETCH_MOBILE_ROLES_LISTVIEW_STRUCTURE';
}

export interface IFetchMobileRolesListViewStructureActionSuccess {
    readonly type: '@@mobileTemplates/FETCH_MOBILE_ROLES_LISTVIEW_STRUCTURE_SUCCESS';
    payload: IMongoListViewStructure;
}

export interface IFetchMobileRolesByAccessProfileIdAction {
    readonly type: '@@mobileTemplates/FETCH_MOBILE_ROLES_BY_ACCESS_PROFILE_ID';
    payload?: IMobileRoleByAccessProfileIdRequestPayload
}

export interface IFetchMobileRolesByAccessProfileIdActionSuccess {
    readonly type: '@@mobileTemplates/FETCH_MOBILE_ROLES_BY_ACCESS_PROFILE_ID_SUCCESS';
    payload: IMobileRoleListDataPayload;
}

export interface ISetViewType {
    readonly type: '@@mobileTemplates/SET_VIEW_TYPE';
    payload: string
}

export interface ISetAccessProfileId {
    readonly type: '@@mobileTemplates/SET_ACCESS_PROFILE_ID';
    payload: number;
}

export interface IFetchMobileTemplatesFormAccordionStructureAction {
    readonly type: '@@mobileTemplates/FETCH_MOBILE_TEMPLATE_ACCORDION_STRUCTURE';
}

export interface IFetchMobileTemplatesFormAccordionStructureActionSuccess { 
    readonly type: '@@mobileTemplates/FETCH_MOBILE_TEMPLATE_ACCORDION_STRUCTURE_SUCCESS';
    payload: IMobileTemplateAccordianStructure
}

export interface IFetchMobileTemplateByIdAction {
    readonly type: '@@mobileTemplates/GET_MOBILE_TEMPLATE_BY_ID';
    payload: number;
}

export interface IFetchTripStartFormAction {
    readonly type: '@@mobileTemplates/SET_TRIP_START_FORM_VALUES';
    payload: {
        accessReferenceIds: Array<string | undefined>,
        tripStartDetails: ITripStartTimePayload
    }
}

export interface IFetchMobileTemplateByIdActionSuccess {
    readonly type: '@@mobileTemplates/GET_MOBILE_TEMPLATE_BY_ID_SUCCESS';
    payload: IMobileTemplate;
}

export interface ISetEditMode {
    readonly type: '@@mobileTemplates/SET_EDIT_MODE';
    payload: boolean;
}

export interface IResetMobileTemplateData {
    readonly type: '@@mobileTemplates/RESET_MOBILE_TEMPLATE_DATA'
}

export interface IGetNewOrderTileListAction {
    readonly type: '@@mobileTemplates/GET_NEW_ORDER_TILE_LIST'
    payload: string;
}

export interface IGetNewOrderTileListByAccessIdAction {
    readonly type: '@@mobileTemplates/GET_NEW_ORDER_TILE_LIST_BY_ID'
    payload: {
        orderType: string;
        accessProfileId: number;
    };
}

export interface IGetNewOrderTileListActionSuccess {
    readonly type: '@@mobileTemplates/GET_NEW_ORDER_TILE_LIST_SUCCESS'
    payload: IDynamicCardTileList;
}

export interface IFetchDynamicOrderMasterStructureAction {
    readonly type: '@@mobileTemplates/FETCH_DYNAMIC_ORDER_MASTER_STRUCTURE'
    payload: string;
}

export interface IFetchDynamicOrderMasterStructureActionSuccess {
    readonly type: '@@mobileTemplates/FETCH_DYNAMIC_ORDER_MASTER_STRUCTURE_SUCCESS'
    payload: IDynamicOrderMasterStructure;
}

export interface ISetOrderType {
    readonly type: '@@mobileTemplates/SET_ORDER_TYPE'
    payload: string;
}

export interface ISetOrderConfigured {
    readonly type: '@@mobileTemplates/SET_ORDER_CONFIGURED'
    payload: boolean;
}

export interface ISetMobileDynamicStructure {
    readonly type: '@@mobileTemplates/SET_DYNAMIC_MOBILE_STRUCTURE'
    payload: IDynamicCardTileList[]
}

export interface IResetSetMobileDynamicStructure {
    readonly type: '@@mobileTemplates/RESET_DYNAMIC_MOBILE_STRUCTURE'
}

export interface ISetOrderConfiguring {
    readonly type: '@@mobileTemplates/SET_ORDER_CONFIGURING'
    payload: boolean;
}

export interface ISetFormValues {
    readonly type: '@@mobileTemplates/SET_FORM_VALUES'
    payload: IFormInputs
}

export interface ISetAccessReferenceIds {
    readonly type: '@@mobileTemplates/SET_ACCESS_IDS'
    payload: Array<string | undefined>;

}

export interface IFetchAddressFieldsAction {
    readonly type: '@@mobileTemplates/FETCH_ADDRESS_FIELDS'
    payload: {
        country: string;
        fields: string[];
    }
}

export interface IFetchAddressFieldsActionSuccess {
    readonly type: '@@mobileTemplates/FETCH_ADDRESS_FIELDS_SUCCESS'
    payload: {[key: string]: any}
}

export type IMobileTemplateActions = 
IFetchListViewStructureAction |
IFetchListViewStructureActionSuccess |
IFetchMobileTemplateFormStructureAction |
IFetchMobileTemplateFormStructureActionSuccess |
IFetchMobileTemplateListAction |
IFetchMobileTemplateListActionSuccess |
ISetViewType |
IFetchMobileRolesListViewStructureAction |
IFetchMobileRolesListViewStructureActionSuccess |
IFetchMobileRolesByAccessProfileIdAction |
IFetchMobileRolesByAccessProfileIdActionSuccess |
ISetAccessProfileId |
IFetchMobileTemplatesFormAccordionStructureAction |
IFetchMobileTemplatesFormAccordionStructureActionSuccess | 
IFetchMobileTemplateByIdAction |
IFetchMobileTemplateByIdActionSuccess |
IFetchTripStartFormAction |
ISetEditMode |
IResetMobileTemplateData |
IGetNewOrderTileListAction |
IGetNewOrderTileListActionSuccess |
IFetchDynamicOrderMasterStructureAction |
IFetchDynamicOrderMasterStructureActionSuccess |
ISetOrderType |
IGetNewOrderTileListByAccessIdAction |
ISetOrderConfigured |
ISetMobileDynamicStructure |
ISetOrderConfiguring |
ISetFormValues |
ISetAccessReferenceIds |
IFetchAddressFieldsAction |
IFetchAddressFieldsActionSuccess |
IResetSetMobileDynamicStructure
