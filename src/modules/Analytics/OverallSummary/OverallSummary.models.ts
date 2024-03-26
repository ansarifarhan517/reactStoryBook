import { IClientProperty } from "../../common/ClientProperties/interfaces";

export interface IRowData {
  actual?: any;
  actualDistance?: any;
  cashOnDelivery?: any;
  cashToBeCollected?: any;
  driverName?: any;
  estimatedDistance?: any;
  numOrders?: any;
  planned?: any;
  trackNow?: any;
  tripName?: any;
  tripStatus?: any;
  vehicleNo?: any;
  status?: any;
}

export interface IOverallSummaryListViewDataPayload {
  clientBranchId?: number;
  otherCount?: number;
  totalCount: number;
  results: Array<IRowData>;
  clientProperties?: Record<string, IClientProperty>;
}
