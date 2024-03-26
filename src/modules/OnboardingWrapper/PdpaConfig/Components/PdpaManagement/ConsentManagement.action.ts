import {
  IConsentManagementListData,
  IConsentManagementListDataPayload,
} from "./ConsentManagement.models";

export interface IConsentTypeDetailsListViewAction {
  readonly type: "@@consentManagement/FETCH_CONSENT_TYPE_DETAILS_LISTVIEW";
}
export interface IConsentTypeDetailsListViewActionSuccess {
  readonly type: "@@consentManagement/FETCH_CONSENT_TYPE_DETAILS_LISTVIEW_SUCCESS";
  payload: IConsentManagementListDataPayload;
}

export interface IResetConsentManagementData {
  readonly type: "@@consentManagement/RESET_CONSENT_MANAGEMENT_DATA";
}

export interface ISaveConsentActiveFieldData {
  readonly type: "@@consentManagement/SAVE_CONSENT_ACTIVE_FIELD_DATA";
  payload: IConsentManagementListData;
}

export interface IResetActiveFieldData {
  readonly type: "@@consentManagement/RESET_ACTIVE_FIELD_DATA";
}

export interface IToggleConsentAction {
  readonly type: "@@consentManagement/TOGGLE_CONSENT_ACTION";
  payload: boolean;
}

export type ConsentManagementActions =
  | IConsentTypeDetailsListViewAction
  | IConsentTypeDetailsListViewActionSuccess
  | IResetConsentManagementData
  | ISaveConsentActiveFieldData
  | IResetActiveFieldData
  | IToggleConsentAction;
