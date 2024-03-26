import { IListViewRequestPayload } from "../../../../../utils/common.interface";
import { IMongoListViewStructure } from "../../../../../utils/mongo/interfaces";
import { IConsentStatusReportListResponse } from "./ConsentStatusReportList.models";

export interface IConsentStatusReportListStructureAction {
  readonly type: "@@consentStatusReportList/FETCH_STRUCTURE";
}
export interface IConsentDetailedReportListStructureAction {
  readonly type: "@@consentDetailedReportList/FETCH_STRUCTURE";
}

export interface ISetColumnsLoading {
  readonly type: "@@consentStatusReportList/SET_COLUMNS_LOADING";
  payload: {
    columns: boolean;
  };
}

export interface ISetLoading {
  readonly type: "@@consentStatusReportList/SET_LOADING";
  payload: {
    listView: boolean;
  };
}

export interface IConsentStatusReportListStructureActionSuccess {
  readonly type: "@@consentStatusReportList/SET_STRUCTURE";
  payload: IMongoListViewStructure;
}

export interface IFetchDataAction {
  readonly type: "@@consentStatusReportList/FETCH_DATA";
  payload?: IListViewRequestPayload;
}

export interface IFetchDataSuccessAction {
  readonly type: "@@consentStatusReportList/FETCH_DATA_SUCCESS";
  payload: IConsentStatusReportListResponse;
}


export interface IConsentStatusReportListResetAction {
  readonly type: "@@consentStatusReportList/RESET_STATE";
}

export type IConsentStatusReportListActions =
  | IConsentStatusReportListStructureAction
  | ISetLoading
  | ISetColumnsLoading
  | IConsentStatusReportListStructureActionSuccess
  | IFetchDataAction
  | IFetchDataSuccessAction
  | IConsentDetailedReportListStructureAction
  | IConsentStatusReportListResetAction