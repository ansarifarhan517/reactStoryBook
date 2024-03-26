
import { IListViewRequestPayload } from "../../../utils/common.interface";
import { IClientProperty } from "../../common/ClientProperties/interfaces";


export interface IManifestListViewPaylod {
    params: IManifestListViewParamsPaylod
}
export interface IManifestListViewParamsPaylod extends IListViewRequestPayload{   
    startDateFilter: string,
    endDateFilter: string
}

export interface IManifestShipmentData {
    awbNo: string
    branchName: string
    destinationAddress: string
    hubScanStatus: string
    orderNo: string
    orderState: string
    originAddress: string
    outwardMFId: string
    packageStatusCd: string
    shipmentId: number
    shipmentOrderTypeCd: string
}
export interface IRowData {
    editIconButtonProps?: any
    branchAddress: string
    branchName: string
    cancelledOrderAllowedFl: boolean
    manifestCreationDate: string
    manifestId: string
    manifestNo: number
    manifestStatus: string
    manifestType: string
    manifestUpdatedDate: string
    mobileCreatedOnDt: number
    mobileLastUpdatedDt: number
    totalOrders: number
    hasSelectionDisabled?: boolean
    totalWeight: number
    totalVolume: number
    shipmentsLst?: IManifestShipmentData[]
    shipmentIds: number[]
    shipmentOrderTypeMap:IShipmentOrderTypeDataPayload[]
    tripStatus:string
}
export interface IShipmentOrderTypeDataPayload {
    orderId: number,
    type: string,
}


export interface IManifestListDataPayload {
    clientBranchId?: number,
    otherCount?: number,
    totalCount: number,
    results: Array<IRowData>,
    clientProperties?: Record<string, IClientProperty>
}
