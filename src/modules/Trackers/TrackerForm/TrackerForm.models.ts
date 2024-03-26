import { IMongoFormStructure } from '../../../utils/mongo/interfaces';
import { IDropdown } from "../../../utils/common.interface";

export interface IEffectAction {
  [key: string]: any;
}
export interface ITrackerFormReducerState {
    structure: IMongoFormStructure
    loading: boolean
    isFormEditable: boolean,   
    isDirty: boolean
    trackerConfigList : IDropdown[]
    trackerId: string,
    trackerData : IRowData
    supplierList?: IDropdown[]
    trackersList?: IDropdown[]
  }

  export interface IRowData {
    trackerDescription?: string,
    barcode?:string ,
    clientBranchId?:any,
    imei?:string,
    isActiveFl?: string,
    supplierRefId?:{},
    trackeeId?:string,
    trackerConfigId?:{},
    trackerTypeRefId?:{},
    deviceId?: number
    clientBranchName?: string,
    trackerModel?: string,
    lastTrackedDt?: number
  }

  export interface IRouteParams {
    deviceId?: string;
  }