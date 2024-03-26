import moment from "moment";
import { IUsageAnalyticsActions } from "./UsageAnalytics.actions";
import {
  IClientOptions,
  IDataRangePicker,
  IPageState,
  ISubscriptionOptions,
  tPageKey,
  tTimeGap,
} from "./UsageAnalytics.models";
import { pageValueFromKey } from "./Utils/Mappings";

export interface IUsageAnalyticsState {
  loading: boolean;
  clientOptions: Array<IClientOptions>;
  subscriptionOptions: Array<ISubscriptionOptions>;
  pageKey: tPageKey;

  dateRange: IDataRangePicker;
  timeGap: tTimeGap;

  subscriptionPage: IPageState;
  clientPage: IPageState;
}

export const initialState: IUsageAnalyticsState = {
  loading: false,
  clientOptions: [],
  subscriptionOptions: [],
  pageKey: "SUBSCRIPTION",

  subscriptionPage: {
    thresholdData: {},
    graphData: [],
  },
  clientPage: {
    thresholdData: {},
    graphData: [],
  },
  dateRange: {
    fromDate: moment(Date()).subtract(7, "days").startOf("day"),
    toDate: moment(new Date()).endOf("day"),
  },
  timeGap: "DAY",
};

export const UsageAnalyticsReducer = (
  state = initialState,
  action: IUsageAnalyticsActions
): IUsageAnalyticsState => {
  switch (action.type) {
    case "@@usageAnalytics/SET_LOADING":
      return { ...state, loading: action.payload };

    case "@@usageAnalytics/SET_SUBSCRIPTION_OPTIONS":
      return { ...state, ...action.payload };

    case "@@usageAnalytics/SET_CLIENT_OPTIONS":
      return { ...state, ...action.payload };

    case "@@usageAnalytics/SET_PAGE_TYPE":
      return { ...state, pageKey: action.payload };

    case "@@usageAnalytics/SET_TIME_GAP":
      return {
        ...state,
        timeGap: action.payload,
      };

    case "@@usageAnalytics/SET_GRAPH_DATA":
      return {
        ...state,
        [pageValueFromKey[state.pageKey]]: {
          ...state[pageValueFromKey[state.pageKey]],
          graphData: action.payload,
        },
      };

    case "@@usageAnalytics/SET_THRESHOLD_DATA":
      return {
        ...state,
        [pageValueFromKey[state.pageKey]]: {
          ...state[pageValueFromKey[state.pageKey]],
          thresholdData: {
            ...state[pageValueFromKey[state.pageKey]].thresholdData,
            [action.payload.key] : action.payload.value
          },
        },
      }

    case "@@usageAnalytics/SET_SELECTED_OPTION":
      return {
        ...state,
        [pageValueFromKey[state.pageKey]]: {
          ...state[pageValueFromKey[state.pageKey]],
          selectedValue: action.payload,
        },
      };

    case "@@usageAnalytics/SET_DATE_RANGE":
      return {
        ...state,
        dateRange: {
          fromDate: action.payload.fromDate,
          toDate: action.payload.toDate,
        },
      };

    case "@@usageAnalytics/SET_SUBSCRIPTION_ID":
      return {
        ...state,
        subscriptionPage: {
          ...state.subscriptionPage, 
          subscriptionId: action.payload
        }
      }

    default:
      return state;
  }
};
