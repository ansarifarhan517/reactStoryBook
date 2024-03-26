import { IMongoFormStructure } from "../../../../../utils/mongo/interfaces";

export interface IConsentStatusReportReducerState {
  structure: IMongoFormStructure;
  loading: boolean;
  formData : any;
  pageName : string
}