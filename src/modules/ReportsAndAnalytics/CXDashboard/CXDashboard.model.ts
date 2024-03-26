import { IMongoListViewStructure } from "../../../utils/mongo/interfaces";

export interface IDataCard {
  label: string;
  value: number;
  percentage?: string;
}
export interface IChartLegendData {
  name: string;
  value?: number | undefined;
  color: string;
  active: boolean;
  key?: string;
}

export interface IChartData {
  name: string;
  [key: string]: string | number;
}

interface ILineChartTooltipData {
  label: string;
  selectedColor: string;
  legendData: IChartLegendData[];
  details: any;
}
interface ILineChart {
  data: IChartData;
  legendData: IChartLegendData;
  tooltipData: ILineChartTooltipData;
}

export type tMode = "OVERALL" | "BYSHIPPER";
export type tDataType = "percentage" | "numbers";
export type tGroupBy = "YEAR" | "MONTH" | "WEEK" | "DAY";
export interface IChartCardProps {
  id: tActionCard;
  mode: string;
  dataType: string;
  data:
    | {
        overallPerc: IChartData[];
        overallCount: IChartData[];
        byShipperPerc: IChartData[];
        byShipperCount: IChartData[];
      }
    | {};
  legendData: IChartLegendData[];
  lineData: { [key: string]: number | undefined }[];
  onChartChange: () => void;
  tinyChartTitleList: any[];
  xAxisLabel: string;
  yAxisLabel: string;
  tooltipData: Array<string>;
}

export interface IChartDataProps {
  mode: string;
  dataType: string;
  data: {
    histogramDateWise: IChartData[];
    histogramShipperWise: IChartData[];
  };
  legendData: IChartLegendData[];
  lineData: { [key: string]: number | undefined }[];
  onChartChange: () => void;
  tinyChartTitleList: any[];
  xAxisLabel: string;
  yAxisLabel: string;
  tooltipData: Array<string>;
}

export interface IFeedbackData {
  orderId: number;
  orderNo: string;
  subClientId: number;
  subClientName: string;
  branchId: number;
  branchName: string;
  dmId: number;
  dmName: string;
  tripId: number;
  tripName: string;
  feedback: number;
  rating: number;
  modelType: string;
  promotions: {
    link: string;
    image: string;
  }[];
}

export interface IPromotionData {}
[];

interface ITrackingLinkSection {
  trackingLinkTrend?: {
    mode: "OVERALL" | "BYSHIPPER";
    data: {
      histogramDateWise: IChartData[];
      histogramShipperWise: IChartData[];
    };
  };
  promotions: {
    histogram: {
      mode: "OVERALL" | "BYSHIPPER";
      data: {
        histogramDateWise: IChartData[];
        histogramShipperWise: IChartData[];
      };
    };
    listview: {
      data: IPromotionData;
      structure: IMongoListViewStructure;
    };
  };
  feedback: {
    histogram: {
      mode: "OVERALL" | "BYSHIPPER";
      data: {
        histogramDateWise: IChartData[];
        histogramShipperWise: IChartData[];
      };
    };
    listview: {
      data: IFeedbackData[];
      structure: IMongoListViewStructure;
    };
    tagCloud: {
      data: string[];
    };
  };
}

export interface ICXDashboardState {
  loading: {
    [key: string]: boolean;
  };
  breadcrumb: string;
  calendar: {
    from: Date;
    to: Date;
  };
  groupBy: tGroupBy;
  listCount: number;
  selectedDataCard: tActionCard;
  selectedDetailCard?: tActionDetailCard;
  cardData: {
    orderCreated?: number;
    trackingLinkOpen?: number;
    smsSent?: number;
    emailSent?: number;
    ivrSent?: number;
    whatsappSent?: number;
    orderCreatedTrend?: number;
    customerCreatedTrend?: number;
    customer?: number;
  };
  trackingCardDetails: {
    noOfPromotions?: number;
    avgRating?: number;
    totalFeedback?: number;
  };
  dropdownOptions: {
    shipper?: any;
    branch?: any;
    alertList?: any;
    feedbackCategory?: any;
  };
  filterOptions: any;
  trackingLink: ITrackingLinkSection;
  smsSent?: IChartDataProps;
  emailSent?: IChartDataProps;
  ivrSent?: IChartDataProps;
  whatsappSent?: IChartCardProps;
}
export type tActionCard =
  | "emailhistogram"
  | "smshistogram"
  | "ivrhistogram"
  | "whatsapphistogram"
  | "trackinglinkhistogram"
  | "totalFeedback"
  | "feedbackhistogram"
  | "promotionhistogram";

export type tActionDetailCard =
  | "totalFeedback"
  | "feedbackhistogram"
  | "promotionhistogram";

export type tChartType = IChartDataProps;
