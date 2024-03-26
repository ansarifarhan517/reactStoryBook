export interface IFlexContainer {
  fontSize?: string;
  padding?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  color?: string;
  margin?: string;
  gap?: string;
  height?: string;
}

export interface IUsageCardProps {
  cardData: any;
  cardKey: string;
  dynamicLabels: any;
}

export interface IUpdateThresholdDataPayload {
  usageDetail: {
    key: string;
    identifier: string;
    type: string;
  };
  usageThreshold: {
    thresholdLimit: number;
    usageEmailIds: string;
    usageContactNumbers: string;
    usageExhaustedNotified: boolean;
    extGatewayUsageExhaustedNotified: boolean;
    usageThresholdNotified: boolean;
    extGatewayUsageThresholdNotified: boolean;
    isThresholdLimitPercentage: boolean;
  };
}

export interface ISubscriptionOptions {
  subscriptionId: string;
  clientName: string;
  clientIds: Array<number>;
  subscriptionName: string;
}

export interface IClientOptions {
  isActiveFl: boolean;
  clientId: number;
  name: string;
  region: string;
  subscriptionName: string;
}

export interface IDataRangePicker {
  fromDate: any;
  toDate: any;
}

export interface IPageState {
  graphData: Array<any>;
  selectedValue?: any;
  thresholdData: any,
  subscriptionId?: any;
}

export type tTimeGap = "MONTH" | "WEEK" | "DAY";
export type tPageKey = "SUBSCRIPTION" | "CLIENT";
export type tPageValue = "subscriptionPage" | "clientPage";
