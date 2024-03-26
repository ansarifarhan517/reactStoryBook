import { IClientMetricSystem } from "../../../utils/common.interface";
import { IMongoFormStructure } from "../../../utils/mongo/interfaces";

export interface IStructureParams {
    pageName: string;
    sectionName: string;
}

export interface ISkillSetOptionData {
    clientRefMasterCd: string
    clientRefMasterDesc: string
    clientRefMasterId: number
    clientRefMasterType: string
    id: number
}

export interface IRouteConfigurationOptionData {
    routeConfigurationId: number
    routeConfigurationName: string
}

export interface IBranchOptionData {
    branchDescription: string
    branchId: number
    canonicalId: string
    clientNodeId: number
    gmtoffset: string
    id: number
    name: string
    timezoneId: number
}

//MMO - Middle mile order
export interface IMMOBulkUpdateReduxState {
    structure : IMongoFormStructure
    apiLoading: boolean
    clientMetric?: IClientMetricSystem[]
}
  
export const MMOBulkUpdateReduxInitialState: IMMOBulkUpdateReduxState = {
    structure: {},
    apiLoading: false
}