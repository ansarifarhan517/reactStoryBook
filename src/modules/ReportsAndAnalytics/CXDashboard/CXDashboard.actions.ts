import { IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import { IFeedbackData, tActionCard, tGroupBy } from "./CXDashboard.model";

export interface ISetLoading {
  type: "@@CXDashboard/SET_LOADING";
  payload: {
    [key: string]: boolean;
  };
}

export interface ISetCalendar {
  type: "@@CXDashboard/SET_CALENDAR";
}

export interface ISetFilter {
  type: "@@CXDashboard/SET_FILTER";
  payload: any;
}
export interface ISetGroupBy {
  readonly type: "@@CXDashboard/SET_GROUPBY";
  payload: tGroupBy;
}

export interface ISetDateRange {
  type: "@@CXDashboard/SET_DATERANGE_FILTER";
  payload: {
    from: string;
    to: string;
  };
}

export interface ISetDropdownValues {
  type: "@@CXDashboard/SET_DROPDOWN_OPTIONS";
  payload: {
    [key: string]: any[];
  };
}

export interface IGetFeedbackStructure {
  type: "@@CXDashboard/GET_FEEDBACK_STRUCTURE";
}

export interface IGetPromotionStructure {
  type: "@@CXDashboard/GET_PROMOTION_STRUCTURE";
}
export interface ISetFeedbackStructure {
  type: "@@CXDashboard/SET_FEEDBACK_STRUCTURE";
  payload: IMongoListViewStructure;
}

export interface ISetPromotionStructure {
  type: "@@CXDashboard/SET_PROMOTION_STRUCTURE";
  payload: IMongoListViewStructure;
}

export interface IGetFeedbackData {
  type: "@@CXDashboard/GET_FEEDBACK_DATA";
  payload?: {
    searchText: string;
    searchBy: string;
    pageSize: Number;
    pageNumber: Number;
  };
}

export interface IGetPromotionData {
  type: "@@CXDashboard/GET_PROMOTION_DATA";
  payload?: {
    searchText: string;
    searchBy: string;
  };
}
export interface ISetFeedbackData {
  type: "@@CXDashboard/SET_FEEDBACK_DATA";
  payload: IFeedbackData[];
}

export interface ISetPromotionData {
  type: "@@CXDashboard/SET_PROMOTION_DATA";
  payload: any;
}

export interface IGetCardData {
  type: "@@CXDashboard/GET_CARD_DATA";
  payload: "overall" | "promotion" | "feedback" | "communication";
}
export interface IGetTrackingCardData {
  type: "@@CXDashboard/GET_TRACKINGCARD_DATA";
  payload: "promotion" | "feedback" | "communication";
}

export interface ISetCardData {
  type: "@@CXDashboard/SET_CARD_DATA";
  payload: {
    section: "overall" | "promotion" | "feedback" | "communication";
    data: {
      orderCreated?: number;
      trackingLinkOpen?: number;
      smsSent?: number;
      emailSent?: number;
      ivrSent?: number;
      whatsappSent?: number;
      orderCreatedTrend?: number;
      customerCreatedTrend?: number;
      customer?: number;
      noOfPromotions?: number;
      totalFeedback?: number;
      avgRating?: number;
    };
  };
}
export interface ISetTrackingCardData {
  type: "@@CXDashboard/SET_TRACKINGCARD_DATA";
  payload: {
    section: "promotion" | "feedback" | "communication";
    data: {
      noOfPromotions?: number;
      totalFeedback?: number;
      avgRating?: number;
    };
  };
}
export interface IGetHistogramData {
  type: "@@CXDashboard/GET_CHART_DATA";
  payload: tActionCard;
}
export interface ISetHistogramData {
  type: "@@CXDashboard/SET_CHART_DATA";
  payload: {
    chart: tActionCard;
    data: {
      histogramDateWise: any;
      histogramShipperWise: {
        [key: string]: {
          [key: string]: number;
        };
      };
    };
  };
}

export interface IGetTagCloudData {
  readonly type: "@@CXDashboard/GET_TAGCLOUD_DATA";
}
export interface ISetTagCloudData {
  type: "@@CXDashboard/SET_TAGCLOUD_DATA";
  payload: string[];
}

export interface IGetAlertList {
  readonly type: "@@CXDashboard/GET_ALERTLIST_DATA";
}

export interface ISetFeedbackCount {
  type: "@@CXDashboard/SET_FEEDBACK_COUNT"
  payload: number;
}

export type CXDashboardActions =
  | ISetLoading
  | ISetCalendar
  | ISetFilter
  | ISetDateRange
  | ISetGroupBy
  | IGetCardData
  | IGetHistogramData
  | IGetFeedbackStructure
  | IGetPromotionStructure
  | ISetFeedbackStructure
  | ISetPromotionStructure
  | IGetFeedbackData
  | IGetPromotionData
  | ISetFeedbackData
  | ISetPromotionData
  | ISetHistogramData
  | ISetCardData
  | IGetTagCloudData
  | ISetTagCloudData
  | ISetDropdownValues
  | IGetAlertList
  | IGetTrackingCardData
  | ISetTrackingCardData
  | ISetFeedbackCount;
