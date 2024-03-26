import { DriverComplianceAnalyticsActions, IDeliveryAssociateDeviceListPayload } from "./DriverComplianceAnalytics.actions";
import { IMongoListViewStructure } from '../../../../utils/mongo/interfaces';


// Driver compliance
export interface IKpiData {
  clientRefMasterId: number;
  clientRefMasterType: string;
  clientRefMasterCd: string;
  clientRefMasterDesc: string;
  clientId: number;
  isDeleteFl: string;
  id: number;
  name: string;
}

export interface IBranchData {
  id: number;
  value: string;
}

export interface ISkilData {
  clientRefMasterId: number;
  clientRefMasterType: string;
  clientRefMasterCd: string;
  clientRefMasterDesc: string;
  clientId: number;
  isDeleteFl: string;
  id: number;
  name: string;
}

/* types for total orders reports */
export interface IOrdersComplianceData {
  reportCode: string;
  ordersCount: number;
  incOrDecPercentage: number;
  linkedGraphData: {
    orderAttemptedPickupCount: number;
    orderAttemptedDeliveredCount: number;
    orderDeliveredCount: number;
    orderMissedCount: number;
    orderCancelledCount: number;
  };
}

export interface ICheckInOrdersComplianceData {
  reportCode: string;
  ordersCount: number;
  incOrDecPercentage: number;
  linkedGraphData: {
    checkinWithinGeofenceCount: number;
    checkinCompliantCount: number;
    heckinOutsideGeofenceCount: number;
  };
}

export interface IOnTimeDeliveryComplianceData {
  reportCode: string;
  ordersCount: number;
  incOrDecPercentage: number;
  linkedGraphData: {
    deliveryTimeCount: number;
    pickupOnTimeCount: number;
    deliveryDelayedCount: number;
    pickupDelayedCount: number;
    deliveryOnTimeCount: number;
  };
}

export interface IDistanceComplianceData {
  reportCode: string;
  ordersCount: number;
  incOrDecPercentage: number;
  linkedGraphData: {
    deliveryDistanceCompliantCount: number;
    pickupDistanceNotCompliantCount: number;
    distanceCompliantCount: number;
    deliveryDistanceNotCompliantCount: number;
    pickupDistanceCompliantCount: number;
  };
}

export interface IServiceTimeComplianceData {
  reportCode: string;
  ordersCount: number;
  incOrDecPercentage: number;
  linkedGraphData: {
    deliveryServiceTimeNotCompliantCount: number;
    deliveryServiceTimeCompliantCount: number;
    serviceTimeCompliantCount: number;
    pickupServiceTimeCompliantCount: number;
    pickupServiceTimeNotCompliantCount: number;
  };
}

export interface ITotalOrderComplainceReportsData {
  ordersCompliance?: IOrdersComplianceData;
  checkInOrdersCompliance?: ICheckInOrdersComplianceData;
  checkoutOrdersCompliance?: ICheckInOrdersComplianceData;
  onTimeDeliveryCompliance?: IOnTimeDeliveryComplianceData;
  distanceCompliance?: IDistanceComplianceData;
  serviceTimeCompliance?: IServiceTimeComplianceData;
}

export interface ITotalOrderComplainceReportsPayloadData {
  totalOrdersReports: ITotalOrderComplainceReportsData
}

export interface ITotalOrdersCompliance {
  shipmentId: number;
  tripName: string;
  deliveryAssociate: string;
  serName: string;
  phoneNumber: string;
  employeeId: string;
  branch: string;
  orderNo: string;
  orderType: string;
  orderStatus: string;
  estimatedStartDate: string;
  estimatedEndDate: string;
  actualStartDate: string;
  actualEndDate: string;
  plannedSequenceCompliant: boolean;
  plannedTimeCompliant: boolean;
  deliveryTimeComplaint: boolean;
  ordersMarkedDeliveredViaMobileCompliant: boolean;
  pickupCheckIn: string;
  pickupCheckOut: string;
  checkInCompliant: boolean;
  deliveryCheckIn: string;
  deliverycheckOut: string;
  checkOutCompliant: boolean;
  actualDistance: number;
  plannedDistance: number;
  distanceTravelledCompliant: boolean;
  actualCashCollected: number;
  expectedCashCollected: number;
  cashCompliant: boolean;
  actualServiceTime: number;
  plannedServiceTime: number;
  serviceTimeCompliant: boolean;
  eSignCompliant: boolean;
  ePodCompliant: boolean;
  customerRatingCompliant: boolean;
}
export interface ITotalOrdersComplianceData {
  totalCount: number;
  otherCount: number;
  clientBranchId: number;
  results: Array<ITotalOrdersCompliance>;
}

export interface ITotalOrdersCompliancePayloadData {
  totalOrdersComplianceSummaryData: ITotalOrdersComplianceData
}

export interface ITotalOrdersColumnStructurePayloadData {
  structure: IMongoListViewStructure
}
/* types for total orders reports */

export interface IDeviceCompatibilityColumnStructurePayloadData {
  deviceCompatibilityColumnStructure: IMongoListViewStructure
}

export interface ILoginHistoryColumnStructurePayloadData {
  deliveryAssociateLoginHistoryColumnStructure: IMongoListViewStructure
}

export interface IDeviceListColumnStructurePayloadData {
  deliveryAssociateDevicesColumnStructure: IMongoListViewStructure
}

export interface IDeviceCompatibilityAssociates {
  deliveryAssociate: string;
  phoneNumber: string;
  userName: string;
  deviceCount: number;
  deliveryAssociateId: number;
}

export interface IDeviceCompatibilityData {
  totalCount: number;
  otherCount: number;
  clientBranchId: number;
  results: Array<IDeviceCompatibilityAssociates>;
}

export interface IDeviceCompatibilityPayloadData {
  deliveryAssociateDeviceCompatibility: IDeviceCompatibilityData;
}

export interface ITotalBranchComplianceData {
  branchId: number;
  name: string;
  totalCompliance: number;
  kpiCompliance: number;
  avgTotalCompliance: number;
  avgKpiCompliance: number;
}

export interface IBranchComplianceData {
  kpiName: string;
  branchData: Array<ITotalBranchComplianceData>;
}

export interface IBranchCompliancePayloadData {
  totalBranchComplianceData: IBranchComplianceData;
}

export interface IBranchDeliveryAssociateComplianceData {
  deliveryAssociateId: number;
  deliveryAssociateName: string;
  kpiAchievment: number;
}
export interface IBranchDeliveryAssociateComplianceSummaryData {
  kpiCode: string;
  listOfKPIDetails: Array<IBranchDeliveryAssociateComplianceData>;
}

export interface IBranchDeliveryAssociateCompliancePayloadData {
  branchDeliveryAssociateComplianceSummaryData: IBranchDeliveryAssociateComplianceSummaryData;
}
export interface IDeliveryAssociateComplianceSummaryData {
  totalBranchComplianceData: IBranchComplianceData;
}

export interface IKpiDataPayload {
  kpiList: Array<IKpiData>;
}

export interface IBranchDataPayload {
  branchList: Array<IBranchData>;
}
export interface ISkillDataPayload {
  skillList: Array<ISkilData>;
}

export interface IPlannedRouteKPIConfiguration {
  plannedSequence: number;
  onTimeDelivery: number;
  plannedVsActualDistance: number;
  plannedVsActualTime: number;
  missedOrderPenalty: number;
  driverOnBreak: number;
}

export interface IPlannedRouteKPIConfigurationData {
  plannedRouteConfigureKPI: IPlannedRouteKPIConfiguration;
}

export interface IPlannedRouteKPIConfigurationPayloadData {
  plannedRouteConfigureKPI: IPlannedRouteKPIConfigurationData;
}

export interface IDriverComplianceState {
  kpiList: any;
  kpiDropdownData : any;
  cardDetails: any;
  deliveryAssociateComplianceSummaryData: any;
  overallDeliveryAssociateComplianceSummaryData: any;
  branchDeliveryAssociateComplianceSummaryData: any;
  branchList: any;
  skillList: any;
  totalBranchComplianceData: any;
  overAllComplianceSummaryData: any;
  filterData: any;
  totalOrdersReports: any;
  loading: boolean;
  totalOrdersComplianceSummaryData: any;
  structure: any;
  deliveryAssociatesComplianceTrend: [];
  deviceCompatibilityColumnStructure: any;
  deliveryAssociateLoginHistory: any;
  deliveryAssociateDevices: any;
  deliveryAssociateDeviceList: IDeliveryAssociateDeviceListPayload;
  deliveryAssociateDeviceCompatibility: any;
  loaderCount: number;
  plannedRouteConfigureKPI: any;
  currentTab: string;
  listview: IListViewLoading;
  deliveryAssociateLoginHistoryColumnStructure: any;
  deliveryAssociateDevicesColumnStructure: any;
}

export interface IFilterData {
  selectedBranches: Array<number>;
  selectedSkills: Array<number>;
  selectedDates: Array<Date>;
}

export interface IFilterDataPayload {
  filterData: IFilterData;
}

export interface IDeliiveryAssociateLoginHistory {
  loginTime: string;
  logOutTime: string;
  loginDuration: number;
}
export interface IDeliveryAssociateLoginHistoryData {
  deliveryMediumMasterId: number;
  avgLoginDurationInMins: number;
  loginHistory: Array<IDeliiveryAssociateLoginHistory>;
}

export interface IDeliveryAssociateLoginHistoryPayload {
  deliveryAssociateLoginHistory: IDeliveryAssociateLoginHistoryData
}

export interface IDeliveryAssociateDevices {
  phoneModel: string;
  phoneModelCompliance: number;
  osversion: number;
  appVersionCodeCompliance: number;
  osversionCompliance: number;
  appVersionCode: number;
}

export interface IDeliveryAssociateDevicesPayload {
  deliveryAssociateDevices: Array<IDeliveryAssociateDevices>;
  deliveryAssociateDeviceList: Array<IDeliveryAssociateDevices>;
}

export interface IListViewLoading {
  deviceCompatibility: boolean;
  loginHistory: boolean;
  deviceList: boolean;
  totalOrders: boolean;
}

const initialState: IDriverComplianceState = {
  kpiList: [],
  kpiDropdownData : {},
  branchList: [],
  skillList: [],
  totalBranchComplianceData: {},
  cardDetails: {},
  overAllComplianceSummaryData: {},
  deliveryAssociateComplianceSummaryData: {},
  overallDeliveryAssociateComplianceSummaryData: {},
  branchDeliveryAssociateComplianceSummaryData: {},
  filterData: {},
  loading: false,
  totalOrdersReports: {},
  totalOrdersComplianceSummaryData: {
    totalCount: 0,
    results: []
  },
  structure: {
    columns: {},
    buttons: {}
  },
  deliveryAssociatesComplianceTrend: [],
  deviceCompatibilityColumnStructure: {
    columns: {},
    buttons: {}
  },
  deliveryAssociateDeviceCompatibility: {},
  deliveryAssociateLoginHistory: {},
  deliveryAssociateDevices: [],
  deliveryAssociateDeviceList: {
    clientBranchId: 0,
    otherCount: 0,
    results: [],
    totalCount: 0
  },
  loaderCount: 0,
  plannedRouteConfigureKPI: {},
  currentTab: "average-compliance",
  listview: {
    deviceCompatibility: false,
    loginHistory: false,
    deviceList: false,
    totalOrders: false
  },
  deliveryAssociateLoginHistoryColumnStructure: {
    columns: {},
    buttons: {}
  },
  deliveryAssociateDevicesColumnStructure: {
    columns: {},
    buttons: {}
  }
};



const DriverComplianceAnalyticsReducer = (
  state = initialState,
  action: DriverComplianceAnalyticsActions
): IDriverComplianceState => {
  switch (action.type) {
    case "@@driverCompliance/FETCH_KPI_LIST":
    case "@@driverCompliance/FETCH_CARD_DETAILS":
    case "@@driverCompliance/FETCH_TOTAL_BRANCH_COMPLIANCE":
    case "@@driverCompliance/FETCH_OVER_ALL_COMPLIANCE_SUMMARY":
    case "@@driverCompliance/SET_LOADING":
    case "@@driverCompliance/FETCH_TOTAL_ORDERS_COLUMN_STRUCTURE":
    case "@@driverCompliance/FETCH_DEVICE_COMPATIBILITY_COLUMN_STRUCTURE":
      return {
        ...state,
        loading: true,
        loaderCount: state.loaderCount + 1
      };
      
    case "@@driverCompliance/FETCH_DEVICE_COMPATIBILITY_COLUMN_STRUCTURE":
    case "@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_DEVICE_COMPATIBILITY":
      return {
        ...state,
        listview: {
          ...state.listview,
          deviceCompatibility: true
        }
      }
    case "@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_DEVICES":
    case "@@driverCompliance/SET_DEVICELIST_LOADING":
      return {
        ...state,
        listview: {
          ...state.listview,
          deviceList: true
        }
      }
    case "@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_LOGIN_HISTORY":
    case "@@driverCompliance/SET_DELIVERY_ASSOCIATE_LOGIN_HISTORY_LOADING":
      return {
        ...state,
        listview: {
          ...state.listview,
          loginHistory: true
        }
      }
      
    case "@@driverCompliance/FETCH_TOTAL_ORDERS_COMPLIANCE_SUMMARY":
    case "@@driverCompliance/FETCH_TOTAL_ORDERS_COLUMN_STRUCTURE":
      return {
        ...state,
        listview: {
          ...state.listview,
          totalOrders: true
        }
      }

    case "@@driverCompliance/FETCH_KPI_LIST_SUCCESS":
      return {
        ...state,
        kpiList: action.payload
      };

    case "@@driverCompliance/FETCH_BRANCH_LIST_SUCCESS":
      return {
        ...state,
        branchList: action.payload,
      };

    case "@@driverCompliance/FETCH_SKILL_LIST_SUCCESS":
      return {
        ...state,
        skillList: action.payload,
      };

    case "@@driverCompliance/FETCH_TOTAL_BRANCH_COMPLIANCE_SUCCESS":
      return {
        ...state,
        totalBranchComplianceData: action.payload,
        loading: !state.loaderCount ? false : true,
      };

    case "@@driverCompliance/FETCH_CARD_DETAILS_SUCCESS":
      return {
        ...state,
        cardDetails: Object.assign({}, state.cardDetails, action.payload),
      };

    case "@@driverCompliance/FETCH_OVER_ALL_COMPLIANCE_SUMMARY_SUCCESS":
      var data  = state.kpiDropdownData ?  state.kpiDropdownData : {};
      var newData = Object.assign(data,action.payload.deliveryAssociateOverallComplianceSummaryDTO.reduce((map,dto)=>{
        map[dto.kpiCode] = dto;
        return map;
      },{}));
      var responsedata  = state.overAllComplianceSummaryData?.deliveryAssociateOverallComplianceSummaryDTO ?  state.overAllComplianceSummaryData?.deliveryAssociateOverallComplianceSummaryDTO: [];
      var temp = action.payload.deliveryAssociateOverallComplianceSummaryDTO;
      var newResponseData = [...responsedata, ...temp];
      console.log(newResponseData,"newResponseData");
      action.payload.deliveryAssociateOverallComplianceSummaryDTO = newResponseData;
      console.log(action.payload,"action.payload");
      return {
        ...state,
        kpiDropdownData : newData,
        overAllComplianceSummaryData: action.payload,
        loading: !state.loaderCount && state.currentTab !== 'average-compliance' ? false : true,
      };
    case "@@driverCompliance/RESET_DELIVERY_ASSOCIATE_COMPLIANCE_DATA":
      return {
        ...state,
        overAllComplianceSummaryData: action.payload,
        loading: !state.loaderCount && state.currentTab !== 'average-compliance' ? false : true,
      };
      
    case "@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_COMPLIANCE_SUMMARY_SUCCESS":
      return {
        ...state,
        deliveryAssociateComplianceSummaryData: action.payload,
        loading: !state.loaderCount ? false : true,
      };
    case "@@driverCompliance/FETCH_OVERALL_DELIVERY_ASSOCIATE_COMPLIANCE_SUMMARY_SUCCESS":
        return {
          ...state,
          overallDeliveryAssociateComplianceSummaryData: action.payload,
          loading: !!state.loaderCount,
      };  

    case "@@driverCompliance/FETCH_BRANCH_DELIVERY_ASSOCIATE_COMPLIANCE_SUMMARY_SUCCESS":
      return {
        ...state,
        branchDeliveryAssociateComplianceSummaryData: action.payload,
        loading: !state.loaderCount ? false : true,
      };

    case "@@driverCompliance/SET_FILTER_DATA":
      return {
        ...state,
        filterData: action.payload,
      };

    case "@@driverCompliance/FETCH_TOTAL_ORDERS_REPORT_SUCCESS":
      return { ...state, totalOrdersReports: { ...state.totalOrdersReports, [action.payload.reportCode]: action.payload }, loading: !state.loaderCount ? false : true, }

    case "@@driverCompliance/TAB_CHANGE":
      return {
        ...state,
        currentTab: action.payload,
        totalBranchComplianceData: {},
        branchDeliveryAssociateComplianceSummaryData: {},
        totalOrdersReports: {}
      }

    case "@@driverCompliance/FETCH_TOTAL_ORDERS_COMPLIANCE_SUMMARY_SUCCESS":
      return { ...state, totalOrdersComplianceSummaryData: action.payload, loading: !state.loaderCount ? false : true, listview: {...state.listview, totalOrders: false} }

    case "@@driverCompliance/FETCH_TOTAL_ORDERS_COLUMN_STRUCTURE_SUCCESS":
      return {
        ...state, structure: action.payload,
        loading: !state.loaderCount ? false : true,
        listview: {...state.listview, totalOrders: false}
      }

    case '@@driverCompliance/FETCH_COMPLIANCE_TREND_SUCCESS':
      return { ...state, deliveryAssociatesComplianceTrend: action.payload ? action.payload : [], loading: !state.loaderCount ? false : true, };

    case "@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_LOGIN_HISTORY_SUCCESS":
      return { ...state, deliveryAssociateLoginHistory: action.payload, listview : { ...state.listview, loginHistory: false } }

    case "@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_DEVICES_SUCCESS":
      return { ...state, deliveryAssociateDevices: action.payload, listview : { ...state.listview, deviceList: false } } 

    case "@@driverCompliance/SET_DELIVERY_ASSOCIATE_DEVICES":
      return { ...state, deliveryAssociateDeviceList: action.payload, loading: !state.loaderCount ? false : true, }

    case "@@driverCompliance/FETCH_DEVICE_COMPATIBILITY_COLUMN_STRUCTURE_SUCCESS":
      return {
        ...state, deviceCompatibilityColumnStructure: action.payload,
        loading: !state.loaderCount ? false : true,
        listview: {
          ...state.listview,
          deviceCompatibility: false
        }
      }

    case "@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_DEVICE_COMPATIBILITY_SUCCESS":
      return { ...state, deliveryAssociateDeviceCompatibility: action.payload, loading: !state.loaderCount ? false : true, listview: {...state.listview, deviceCompatibility: false } }

    case "@@driverCompliance/FETCH_PLANNED_ROUTE_KPI_CONFIGURATION_SUCCESS":
      return { ...state, plannedRouteConfigureKPI: action.payload.plannedRouteConfigureKPI, loading: false }

    case "@@driverCompliance/FETCH_LOGIN_HISTORY_COLUMN_STRUCTURE_SUCCESS": 
      return {
        ...state, deliveryAssociateLoginHistoryColumnStructure: action.payload,
        loading: !state.loaderCount ? false : true
      }  

    case "@@driverCompliance/FETCH_DEVICE_LIST_COLUMN_STRUCTURE_SUCCESS": 
      return {
        ...state, deliveryAssociateDevicesColumnStructure: action.payload,
        loading: !state.loaderCount ? false : true
    }  
    case "@@driverCompliance/SET_LOADER_COUNT":
      return { ...state, loaderCount: action.payload }

    case "@@driverCompliance/SET_LISTVIEW_LOADING": 
      return {...state, listview: {...state.listview, [action.payload.listview]: action.payload.status }}

    default:
      return state;
  }
};

export default DriverComplianceAnalyticsReducer;
