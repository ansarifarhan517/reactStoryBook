import { IMongoFormStructure } from "../../../../../utils/mongo/interfaces";

export interface IConsentStatusReportFormStructureAction {
  readonly type: "@@consentStatusReportForm/FETCH_STRUCTURE";
}

export interface IConsentStatusReportFormStructureActionSuccess {
  readonly type: "@@consentStatusReportForm/SET_STRUCTURE";
  payload: IMongoFormStructure;
}

export interface ISetFormData {
  type: '@@consentStatusReportForm/SET_FORM_DATA';
  payload:  any
}
export interface ISetPageName {
  type: '@@consentStatusReportForm/SET_PAGE_NAME';
  payload:  any
}


export type IConsentStatusReportFormActions =
  | IConsentStatusReportFormStructureAction
  | IConsentStatusReportFormStructureActionSuccess
  | ISetFormData
  | ISetPageName
