import { IListViewRequestPayload } from "../../../utils/common.interface";
import { IClientProperty } from "../../common/ClientProperties/interfaces";

export interface IRowData {
    clientBranchName: string
    deliveryMediumMasterName: string
    endTimeWindow: number
    eta: number
    exception: string
    geofenceName: string
    hubScanStatus: string
    noOfAttempts: number
    orderNo: string
    orderState: string
    orderStatus: string
    orderType: string
    outwardMfId: string
    reason: string
    scanDt: number
    scannedByBranch: string
    scannedByUser: string
    shipmentId: number
    startTimeWindow: number
    tripName: string
}

export interface IInscanListDataPayload {
    clientBranchId?: number,
    otherCount?: number,
    totalCount: number,
    results: Array<IRowData>,
    clientProperties?: Record<string, IClientProperty>
}

export interface IInscanListDataCountPayload {
    clientBranchId?: number,
    otherCount?: number,
    totalCount: number,
    clientProperties?: Record<string, IClientProperty>,
    moreResultsExists?: boolean
}

export interface IInscanLIstViewPaylod {
    params: IInscanLIstViewParamsPaylod,
}
export interface IInscanLIstViewParamsPaylod extends IListViewRequestPayload {
    startDateFilter: string,
    endDateFilter: string,
    hubScanStatus: string
}

export interface IInscanStructureRequestPayload {
    selectedOption: string
}

export type tBreadcrumbState = 'allOrders' | 'closedOrders' | 'handedoverOrders' | 'inscannedOrders' | 'notscannedOrders' | 'outscannedOrders'
