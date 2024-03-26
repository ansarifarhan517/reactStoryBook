import { IListViewRequestPayload } from "../../../utils/common.interface";
import { IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import { IAlertMessageTemplateListDataPayload, IDefaultTemplatePayloadData, IDefaultTemplate } from "./AlertMessage.models";

export interface IFetchListViewStructureAction {
    readonly type: '@@alertMessage/FETCH_LISTVIEW_STRUCTURE';
}

export interface IFetchListViewStructureActionSuccess {
    readonly type: '@@alertMessage/FETCH_LISTVIEW_STRUCTURE_SUCCESS';
    payload: IMongoListViewStructure;
}

export interface IAlertTemplateListAction {
    readonly type: '@@alertMessage/FETCH_ALERT_TEMPLATE_LIST';
    payload?: IListViewRequestPayload;
}


export interface IAlertTemplateListActionSuccess {
    readonly type: '@@alertMessage/FETCH_ALERT_TEMPLATE_LIST_SUCCESS';
    payload: IAlertMessageTemplateListDataPayload;
}

export interface IGetDefaultTemplateListAction {
    readonly type: '@@alertMessage/FETCH_DEFAULT_TEMPLATE_LIST';
}

export interface IGetDefaultTemplateListActionSuccess {
    readonly type: '@@alertMessage/FETCH_DEFAULT_TEMPLATE_LIST_SUCCESS';
    payload: IDefaultTemplatePayloadData
}

export interface ISetAlertMessageFormData {
    type: '@@alertMessage/SET_ALERT_MESSAGE_FORM_DATA';
    payload: {
        key: string,
        value: any
    }
}

export interface IGetTemplateByIdAction {
    type: '@@alertMessage/FETCH_TEMPLATE_BY_ID';
    payload: {
        emailTemplateId: number
    }
}

export interface ISetDefaultSelectedTemplate {
    type: '@@alertMessage/SET_DEFAULT_SELECTED_TEMPLATE';
    payload: IDefaultTemplate
}

export interface IGetTemplateByIdActionSuccess {
    type: '@@alertMessage/FETCH_TEMPLATE_BY_ID_SUCCESS';
    payload: {
        key: string,
        value: any
    }
}
export interface IResetSelectedTemplate {
    type: '@@alertMessage/RESET_SELECTED_TEMPLATE';
}
export interface ISetColumnsLoading {
    readonly type : '@@alertMessage/SET_COLUMNS_LOADING';
    payload: {
      columns: boolean;
    };
}

export interface ISetLoading {
    readonly type: '@@alertMessage/SET_LOADING',
    payload: {
      listView: boolean
    }
}

export interface ISetData {
    type: '@@alertMessage/SET_DATA';
    payload: {
        key: string,
        value: any
    }
}

export interface ISetUpdate {
    type: '@@alertMessage/SET_UPDATE';
    payload: boolean
}

export interface ISetFormLoading {
    readonly type: '@@alertMessage/SET_FORM_LOADING',
    payload: boolean
}

export interface IResetFormData{
    readonly type: '@@alertMessage/RESET_FORMDATA'
}



export type AlertMessageActions =
  | IFetchListViewStructureAction
  | IFetchListViewStructureActionSuccess
  | IAlertTemplateListAction
  | IAlertTemplateListActionSuccess
  | IGetTemplateByIdAction
  | IGetTemplateByIdActionSuccess
  | IResetSelectedTemplate
  | IGetDefaultTemplateListAction
  | IGetDefaultTemplateListActionSuccess
  | ISetDefaultSelectedTemplate
  | ISetAlertMessageFormData
  | ISetColumnsLoading
  | ISetLoading
  | ISetUpdate
  | ISetFormLoading
  | ISetColumnsLoading
  | ISetLoading
  | ISetData
  | IResetFormData
