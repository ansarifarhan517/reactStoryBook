import { IMongoListViewStructure } from "../../../../../utils/mongo/interfaces";
import { IClientProperty } from "../../../../common/ClientProperties/interfaces";
import { IDropdown } from "../../../../../utils/common.interface";

export interface IRowData {
  DelivAssocName: number;
  consentType: IDropdown[];
  name: IDropdown[];
  consentVersion: IDropdown[];
  consentVersionStatus: string;
  expiryDate : string;
  expiredInDays : string;
  publishedOnDt : string;
  activationDate :string;
  responseDateTime : string;
  consentTriggerReason : string;
  triggeredOnFields : string;
  responseData? : string
  reportId? : number;
  imgNameUrlMap? : any
}
export interface IConsentStatusReportListState {
  structure: IMongoListViewStructure;
  loading: {
    listView: boolean;
    columns: boolean;
  };
  data: IConsentStatusReportListResponse;
}
export interface IConsentStatusReportListResponse {
  clientBranchId?: number;
  otherCount?: number;
  totalCount: number;
  results: Array<IRowData>;
  clientProperties?: Record<string, IClientProperty>;
}

export interface ICustomField {
  type: string
  value: any
  key: string
}