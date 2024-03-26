import { IKpiDataPayload, IBranchDataPayload, ISkillDataPayload, IBranchCompliancePayloadData, IBranchDeliveryAssociateCompliancePayloadData, ITotalOrdersCompliancePayloadData, ITotalOrdersColumnStructurePayloadData, IDeviceCompatibilityPayloadData, IDeviceCompatibilityColumnStructurePayloadData, IPlannedRouteKPIConfigurationPayloadData, ILoginHistoryColumnStructurePayloadData, IDeviceListColumnStructurePayloadData } from "./DriverComplianceAnalytics.reducer";

// fetch card kpis list
export interface IFetchKPIListAction {
  readonly type: '@@driverCompliance/FETCH_KPI_LIST';
}

export interface IFetchKPIListSuccessAction {
  readonly type: '@@driverCompliance/FETCH_KPI_LIST_SUCCESS';
  payload: IKpiDataPayload;
}

export interface IFetchBranchListAction {
  readonly type: '@@driverCompliance/FETCH_BRANCH_LIST';
  clientID: any;
}

export interface IFetchBranchListSuccessAction {
  readonly type: '@@driverCompliance/FETCH_BRANCH_LIST_SUCCESS';
  payload: IBranchDataPayload;
}

export interface IFetchSkillListAction {
  readonly type: '@@driverCompliance/FETCH_SKILL_LIST';
}

export interface IFetchSkillListSuccessAction {
  readonly type: '@@driverCompliance/FETCH_SKILL_LIST_SUCCESS';
  payload: ISkillDataPayload;
}

export interface IFetchTotalBranchComplianceAction {
  readonly type: "@@driverCompliance/FETCH_TOTAL_BRANCH_COMPLIANCE";
  payload?: {
    startDate: string;
    endDate: string;
    branches: Array<number>;
    clientId: number;
    kpiList: Array<string>;
    rangeMin: number;
    rangeMax: number;
    requestFor: string;
    dmType: string[];
  };
}

export interface IFetchTotalBranchComplianceSuccessAction {
  readonly type: "@@driverCompliance/FETCH_TOTAL_BRANCH_COMPLIANCE_SUCCESS";
  payload: IBranchCompliancePayloadData;
}

export interface IFetchBranchDeliveryAssociateComplianceSummaryAction {
  readonly type: "@@driverCompliance/FETCH_BRANCH_DELIVERY_ASSOCIATE_COMPLIANCE_SUMMARY";
  payload?: {
    startDate: string;
    endDate: string;
    branches: Array<number>;
    clientId: number;
    kpiList: Array<string>;
    rangeMin: number;
    rangeMax: number;
    requestFor: string;
    dmType: string[];
  };
}

export interface IFetchBranchDeliveryAssociateComplianceSummarySuccessAction {
  readonly type: "@@driverCompliance/FETCH_BRANCH_DELIVERY_ASSOCIATE_COMPLIANCE_SUMMARY_SUCCESS";
  payload: IBranchDeliveryAssociateCompliancePayloadData
}

export interface IFetchTotalOrdersComplianceSummaryAction {
  readonly type: "@@driverCompliance/FETCH_TOTAL_ORDERS_COMPLIANCE_SUMMARY";
  payload?: {
    startDate: string;
    endDate: string;
    branches: Array<number>;
    clientId: number;
    dmType: Array<string>;
    size: number;
    searchBy: string;
    searchText: string;
    sortBy: string;
    sortOrder: string;
    searchAfter: Array<any>;
  };
}

export interface IFetchTotalOrdersComplianceSummaryActionSuccess {
  readonly type: "@@driverCompliance/FETCH_TOTAL_ORDERS_COMPLIANCE_SUMMARY_SUCCESS";
  payload: ITotalOrdersCompliancePayloadData
}

export interface IFetchTotalOrdersColumnStructureAction {
  readonly type: "@@driverCompliance/FETCH_TOTAL_ORDERS_COLUMN_STRUCTURE";
}

export interface IFetchTotalOrdersColumnStructureActionSuccess {
  readonly type: "@@driverCompliance/FETCH_TOTAL_ORDERS_COLUMN_STRUCTURE_SUCCESS";
  payload: ITotalOrdersColumnStructurePayloadData;
}

export interface IFetchDeviceCompatibilityColumnStructureAction {
  readonly type: "@@driverCompliance/FETCH_DEVICE_COMPATIBILITY_COLUMN_STRUCTURE";
}

export interface IFetchDeviceCompatibilityColumnStructureSuccessAction {
  readonly type: "@@driverCompliance/FETCH_DEVICE_COMPATIBILITY_COLUMN_STRUCTURE_SUCCESS";
  payload: IDeviceCompatibilityColumnStructurePayloadData;
}

export interface IFetchLoginHistoryColumnStructureAction {
  readonly type: "@@driverCompliance/FETCH_LOGIN_HISTORY_COLUMN_STRUCTURE";
}

export interface IFetchLoginHistoryColumnStructureSuccessAction {
  readonly type: "@@driverCompliance/FETCH_LOGIN_HISTORY_COLUMN_STRUCTURE_SUCCESS";
  payload: ILoginHistoryColumnStructurePayloadData;
}

export interface IFetchDeviceListColumnStructureAction {
  readonly type: "@@driverCompliance/FETCH_DEVICE_LIST_COLUMN_STRUCTURE";
}

export interface IFetchDeviceListColumnStructureSuccessAction {
  readonly type: "@@driverCompliance/FETCH_DEVICE_LIST_COLUMN_STRUCTURE_SUCCESS";
  payload: IDeviceListColumnStructurePayloadData;
}

export interface IFetchDeliveryAssociateDeviceCompatibilityAction {
  readonly type: "@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_DEVICE_COMPATIBILITY";
  payload?: {
    startDate: string;
    endDate: string;
    branches: Array<number>;
    clientId: number;
    dmType: Array<string>;
    requestFor: string;
    size: number;
    searchBy: string;
    searchText: string;
    searchAfter: Array<number>;
  }
}

export interface IFetchDeliveryAssociateDeviceCompatibilitySuccessAction {
  readonly type: "@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_DEVICE_COMPATIBILITY_SUCCESS";
  payload: IDeviceCompatibilityPayloadData;
}

export interface IFetchCardDetailsAction {
  readonly type: "@@driverCompliance/FETCH_CARD_DETAILS";
  payload?: {
    startDate: string;
    endDate: string;
    branches: number[];
    clientId: number;
    kpiList: Array<string>;
    dmType: string[];
    requestFor: string;
  };
}

export interface IFetcOrdersCardDetailsAction {
  readonly type: "@@driverCompliance/FETCH_ORDERS_CARD_DETAILS";
  payload?: {
    startDate: string;
    endDate: string;
    branches: Array<number>;
    clientId: number;
    kpiList: Array<string>;
    dmType: string[];
    requestFor: string;
  };
}

export interface IFetcBranchesCardDetailsAction {
  readonly type: "@@driverCompliance/FETCH_BRANCHES_CARD_DETAILS";
  payload?: {
    startDate: string;
    endDate: string;
    branches: Array<number>;
    clientId: number;
    kpiList: Array<string>;
    dmType: string[];
    requestFor: string;
  };
}

export interface IFetchCardDetailsSuccessAction {
  readonly type: '@@driverCompliance/FETCH_CARD_DETAILS_SUCCESS';
  payload: any;
}

export interface IFetchOverAllComplianceSummaryAction {
  readonly type: "@@driverCompliance/FETCH_OVER_ALL_COMPLIANCE_SUMMARY";
  payload?: {
    startDate: string;
    endDate: string;
    branches: number[];
    clientId: number;
    kpiList: string[];
    dmType: string[];
    rangeMin?: number;
    rangeMax?: number;
    requestFor: string;
  };
}


export interface IFetchOverAllComplianceSummarySuccessAction {
  readonly type: "@@driverCompliance/FETCH_OVER_ALL_COMPLIANCE_SUMMARY_SUCCESS";
  payload: any
}

export interface IFetchDeliveryAssociateComplianceSummaryAction {
  readonly type: "@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_COMPLIANCE_SUMMARY";
  payload?: {
    startDate: string;
    endDate: string;
    branches: number[];
    clientId: number;
    kpiList: string[];
    dmType: string[];
    rangeMin?: number;
    rangeMax?: number;
  };
}

export interface IFetchOrdersComplianceReportAction {
  readonly type: "@@driverCompliance/FETCH_TOTAL_ORDERS_REPORT";
  payload?: {
    startDate: string;
    endDate: string;
    branches: Array<number>;
    clientId: number;
    dmType: Array<string>;
    reportCode: string;
  };
}

export interface IFetchCheckInOrdersComplianceReportAction {
  readonly type: "@@driverCompliance/FETCH_CHECKIN_ORDERS_REPORT";
  payload?: {
    startDate: string;
    endDate: string;
    branches: Array<number>;
    clientId: number;
    dmType: Array<string>;
    reportCode: string;
  };
}

export interface IFetchCheckoutOrdersComplianceReportAction {
  readonly type: "@@driverCompliance/FETCH_CHECKOUT_ORDERS_REPORT";
  payload?: {
    startDate: string;
    endDate: string;
    branches: Array<number>;
    clientId: number;
    dmType: Array<string>;
    reportCode: string;
  };
}

export interface IFetchOnTimeDeliveryComplianceReportAction {
  readonly type: "@@driverCompliance/FETCH_ONTIME_DELIVERY_REPORT";
  payload?: {
    startDate: string;
    endDate: string;
    branches: Array<number>;
    clientId: number;
    dmType: Array<string>;
    reportCode: string;
  };
}

export interface IFetchDistanceComplianceReportAction {
  readonly type: "@@driverCompliance/FETCH_DISTANCE_COMPLIANCE_REPORT";
  payload?: {
    startDate: string;
    endDate: string;
    branches: Array<number>;
    clientId: number;
    dmType: Array<string>;
    reportCode: string;
  };
}

export interface IFetchServiceTimeComplianceReportAction {
  readonly type: "@@driverCompliance/FETCH_SERVICE_TIME_COMPLIANCE_REPORT";
  payload?: {
    startDate: string;
    endDate: string;
    branches: Array<number>;
    clientId: number;
    dmType: Array<string>;
    reportCode: string;
  };
}



export interface IFetchTotalOrderReportSuccessAction {
  readonly type: "@@driverCompliance/FETCH_TOTAL_ORDERS_REPORT_SUCCESS";
  payload: any
}

export interface ISetFilterDataAction {
  readonly type: "@@driverCompliance/SET_FILTER_DATA";
  payload?: {
    selectedBranches: Array<number>;
    selectedSkills: Array<number>;
    selectedDates: Array<Date>;
  };
}

export interface ISetFilterDataActionSuccessAction {
  readonly type: "@@driverCompliance/SET_FILTER_DATA_SUCCESS";
  payload: any
}

export interface IFetchDeliveryAssociateComplianceSummarySuccessAction {
  readonly type: "@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_COMPLIANCE_SUMMARY_SUCCESS";
  payload: any
}

export interface IFetchComplianceTrendAction {
  readonly type: '@@driverCompliance/FETCH_COMPLIANCE_TREND';
  payload?: {
    startDate: string;
    endDate: string;
    branches: [];
    dmType: [];
    clientId: number;
    kpiList: string[];
    requestFor: string;
    deliveryAssociateIds: number[];
    interval: string;
  };
}

export interface IFetchComplianceTrendSuccessAction {
  readonly type: "@@driverCompliance/FETCH_COMPLIANCE_TREND_SUCCESS";
  payload: any
}
export interface IFetchPlannedRouteKpiConfigurationAction {
  readonly type: "@@driverCompliance/FETCH_PLANNED_ROUTE_KPI_CONFIGURATION";
}

export interface IFetchPlannedRouteKpiConfigurationSuccessAction {
  readonly type: "@@driverCompliance/FETCH_PLANNED_ROUTE_KPI_CONFIGURATION_SUCCESS";
  payload: IPlannedRouteKPIConfigurationPayloadData;
}

export interface ISetLoading {
  readonly type: '@@driverCompliance/SET_LOADING';
}

export interface ITabChanged {
  readonly type: '@@driverCompliance/TAB_CHANGE';
  payload: string
}

export interface IFetchDeliveryAssociateLoginHistoryAction {
  readonly type: "@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_LOGIN_HISTORY";
  payload?: {
    startDate: string;
    endDate: string;
    deliveryAssociateIds: Array<number>;
  }
}


export interface IDeliiveryAssociateLoginHistory {
  loginTime: string;
  logOutTime: string;
  loginDuration: number;
}
export interface IFetchDeliveryAssociateLoginHistorySuccessAction {
  readonly type: "@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_LOGIN_HISTORY_SUCCESS";
  payload?: {
    deliveryMediumMasterId: number;
    avgLoginDurationInMins: number;
    loginHistory: Array<IDeliiveryAssociateLoginHistory>;
  }
}

export interface IFetchDeliveryAssociateDevicesAction {
  readonly type: "@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_DEVICES";
  payload?: {
    startDate: string;
    endDate: string;
    deliveryAssociateIds: Array<number>;
  }
}

export interface IDeliveryAssociateDevices {
  phoneModel: string;
  phoneModelCompliance: number;
  osversion: number;
  appVersionCodeCompliance: number;
  osversionCompliance: number;
  appVersionCode: number;
}

export interface IFetchDeliveryAssociateDevicesSuccessAction {
  readonly type: "@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_DEVICES_SUCCESS";
  payload?: {
    clientBranchId: number;
    otherCount: number;
    results: Array<IDeliveryAssociateDevices>;
    totalCount: number;
  };
}

export interface IDeliveryAssociateDeviceListPayload {
    clientBranchId: number;
    otherCount: number;
    results: Array<IDeliveryAssociateDevices>;
    totalCount: number;
}
export interface ISetDeliveryAssociateDeviceListSuccessAction {
  readonly type: "@@driverCompliance/SET_DELIVERY_ASSOCIATE_DEVICES";
  payload: IDeliveryAssociateDeviceListPayload
}

export interface ISetLoaderCount {
  readonly type: "@@driverCompliance/SET_LOADER_COUNT";
  payload: number;
}

export interface ISetListViewLoading {
  readonly type: "@@driverCompliance/SET_LISTVIEW_LOADING";
  payload: {
    listview: string;
    status: boolean;
  };
}

export interface IFetchDAComplianceSummaryAction {
  readonly type: "@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_COMPLIANCE_SUMMARY";
  
  payload?: {
    startDate: string;
    endDate: string;
    branches: number[];
    clientId: number;
    kpiList: string[];
    dmType: string[];
    rangeMin?: number;
    rangeMax?: number;
  };
}

export interface IFetchOverallDeliveryAssociateComplianceSummaryAction { 
  readonly type: "@@driverCompliance/FETCH_OVERALL_DELIVERY_ASSOCIATE_COMPLIANCE_SUMMARY";
  payload?: {
    startDate: string;
    endDate: string;
    branches: number[];
    clientId: number;
    kpiList: string[];
    dmType: string[];
    rangeMin?: number;
    rangeMax?: number;
  };
}

export interface IFetchOverallDeliveryAssociateComplianceSummarySuccessAction { 
  readonly type: "@@driverCompliance/FETCH_OVERALL_DELIVERY_ASSOCIATE_COMPLIANCE_SUMMARY_SUCCESS";
  payload: any
}

export interface ISetDeviceListLoading {
  readonly type: "@@driverCompliance/SET_DEVICELIST_LOADING"
}

export interface ISetLoginHistoryLoading {
  readonly type: "@@driverCompliance/SET_DELIVERY_ASSOCIATE_LOGIN_HISTORY_LOADING"
}
export interface IResetOversummaryData {
  readonly type: "@@driverCompliance/RESET_DELIVERY_ASSOCIATE_COMPLIANCE_DATA"
  payload: any
}
export interface IResetOversummaryDataSuccessAction {
  readonly type: "@@driverCompliance/RESET_DELIVERY_ASSOCIATE_COMPLIANCE_DATA_SUCCESS"
  payload: any
}

export type DriverComplianceAnalyticsActions =
  | IFetchKPIListAction
  | IFetchKPIListSuccessAction
  | IFetchCardDetailsAction
  | IFetcBranchesCardDetailsAction
  | IFetcOrdersCardDetailsAction
  | IFetchCardDetailsSuccessAction
  | IFetchOverAllComplianceSummaryAction
  | IFetchOverAllComplianceSummarySuccessAction
  | IFetchDeliveryAssociateComplianceSummaryAction
  | IFetchDeliveryAssociateComplianceSummarySuccessAction
  | IFetchBranchListAction
  | IFetchBranchListSuccessAction
  | IFetchSkillListAction
  | IFetchSkillListSuccessAction
  | IFetchTotalBranchComplianceAction
  | IFetchTotalBranchComplianceSuccessAction
  | IFetchBranchDeliveryAssociateComplianceSummaryAction
  | IFetchBranchDeliveryAssociateComplianceSummarySuccessAction
  | ISetFilterDataAction
  | ISetFilterDataActionSuccessAction
  | ISetLoading
  | ITabChanged
  | IFetchOrdersComplianceReportAction
  | IFetchCheckInOrdersComplianceReportAction
  | IFetchCheckoutOrdersComplianceReportAction
  | IFetchOnTimeDeliveryComplianceReportAction
  | IFetchDistanceComplianceReportAction
  | IFetchServiceTimeComplianceReportAction
  | IFetchTotalOrderReportSuccessAction
  | IFetchTotalOrdersComplianceSummaryAction
  | IFetchTotalOrdersComplianceSummaryActionSuccess
  | IFetchTotalOrdersColumnStructureAction
  | IFetchTotalOrdersColumnStructureActionSuccess
  | IFetchComplianceTrendAction
  | IFetchComplianceTrendSuccessAction
  | IFetchDeliveryAssociateLoginHistoryAction
  | IFetchDeliveryAssociateLoginHistorySuccessAction
  | IFetchDeliveryAssociateDevicesAction
  | IFetchDeliveryAssociateDevicesSuccessAction
  | IFetchDeliveryAssociateDeviceCompatibilityAction
  | IFetchDeliveryAssociateDeviceCompatibilitySuccessAction
  | IFetchDeviceCompatibilityColumnStructureAction
  | IFetchDeviceCompatibilityColumnStructureSuccessAction
  | ISetLoaderCount
  | IFetchPlannedRouteKpiConfigurationAction
  | IFetchPlannedRouteKpiConfigurationSuccessAction
  | ISetListViewLoading
  | IFetchOverallDeliveryAssociateComplianceSummaryAction
  | IFetchOverallDeliveryAssociateComplianceSummarySuccessAction
  | IFetchLoginHistoryColumnStructureAction
  | IFetchLoginHistoryColumnStructureSuccessAction
  | IFetchDeviceListColumnStructureAction
  | IFetchDeviceListColumnStructureSuccessAction
  | ISetDeliveryAssociateDeviceListSuccessAction
  | ISetDeviceListLoading
  | ISetLoginHistoryLoading
  | IResetOversummaryData