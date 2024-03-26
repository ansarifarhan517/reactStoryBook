// API calls

import { tPageKey, tTimeGap } from "./UsageAnalytics.models";

export interface IFetchThresholdData {
  readonly type: "@@usageAnalytics/FETCH_THRESHOLD_DATA";
  payload: {
    key: string;
    identifier: any;
    type: string;
  };
}

export interface IPutThresholdUpdatedData {
  readonly type: "@@usageAnalytics/PUT_THRESHOLD_UPDATED_DATA";
  payload: {
    usageDetail: any,
    usageThreshold: any
  };
}


// Setting Redux

export interface ISetSubscriptionOptions {
  readonly type: "@@usageAnalytics/SET_SUBSCRIPTION_OPTIONS";
  payload: any;
}

export interface ISetSubscriptionId {
  readonly type: "@@usageAnalytics/SET_SUBSCRIPTION_ID";
  payload: any;
}

export interface ISetClientOptions {
  readonly type: "@@usageAnalytics/SET_CLIENT_OPTIONS";
  payload: any;
}

export interface ISetUA_TimeGap {
  readonly type: "@@usageAnalytics/SET_TIME_GAP";
  payload: tTimeGap;
}

export interface ISetUA_DateRange {
  readonly type: "@@usageAnalytics/SET_DATE_RANGE";
  payload: {
    fromDate: Date;
    toDate: Date;
  };
}

export interface ISetGraphData {
  readonly type: "@@usageAnalytics/SET_GRAPH_DATA";
  payload: any;
}

export interface IUsageAnalyticsSetLoading {
  readonly type: "@@usageAnalytics/SET_LOADING";
  payload: any;
}

export interface ISetPageType {
  readonly type: "@@usageAnalytics/SET_PAGE_TYPE";
  payload: tPageKey;
}

export interface ISetSelectedOption {
  readonly type: "@@usageAnalytics/SET_SELECTED_OPTION";
  payload: any;
}

export interface ISetThresholdData {
  readonly type: "@@usageAnalytics/SET_THRESHOLD_DATA";
  payload: {
    key: string,
    value: any
  };
}

export type IUsageAnalyticsActions =
  | IUsageAnalyticsSetLoading
  | ISetPageType
  | IPutThresholdUpdatedData
  | ISetUA_TimeGap
  | ISetUA_DateRange
  | ISetSubscriptionOptions
  | ISetClientOptions
  | ISetSelectedOption
  | ISetGraphData
  | IFetchThresholdData
  | ISetSubscriptionId
  | ISetThresholdData;
