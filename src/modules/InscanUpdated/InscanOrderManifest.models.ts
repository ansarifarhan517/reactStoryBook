
export interface IShipmentRecord {
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

export interface IChildManifest {
    isActiveFl: boolean
    manifestId: number
    manifestName: string
    manifestType: string
    hubScanStatus: string
    orderCount: number
    generateCustomId: boolean
    useExistingId: boolean
    parentManifestId: number
    totalCrates: number
}
export interface IScannedOrder {
    bagNum: number
    branchAddress: string
    branchName: string
    cancelledOrderAllowedFl: false
    destBranchCd: string
    detailedOrderStatus: string
    manifestCreationDate: string
    manifestId: string
    manifestNo: number
    manifestStatus: string
    manifestType: string
    manifestUpdatedDate: string
    mobileCreatedOnDt: number
    mobileLastUpdatedDt: number
    movementType: string
    orderNoMM: string
    orderStatusMM: string
    orderType: string
    originBranchCd: string
    shipmentIds?: number[]
    shipmentsLst?: IShipmentRecord[]
    totalCrates: number
    totalOrders: number
    totalVolume: number
    totalWeight: number
    // manifestCategory: string
    // childManifests?: IChildManifest[]
}

export interface IScannedOrderListviewDataPayload {
    clientBranchId?: number
    otherCount?: number
    results?: IScannedOrder[]
    totalCount?: number
}


export interface IManifestOfManifests{
    [key: string]: any
}

export interface IManifestOfManifestsListviewDataPayload {
    clientBranchId?: number
    otherCount?: number
    results: IManifestOfManifests[]
    totalCount?: number
}


export interface IOrderRecord {
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
    [key: string]: any
}
export interface IManifestRecord {
    isActiveFl: boolean
    manifestId: string
    manifestName: string
    manifestType: string
    hubScanStatus: string
    orderCount: number
    generateCustomId: boolean
    useExistingId: boolean
    parentManifestId: number
    totalCrates: number
    [key: string]: any
}
export interface IManifestData {
    branchName: string
    cancelledOrderAllowedFl: boolean
    manifestId: string
    manifestNo: number
    manifestStatus: string
    manifestType: string
    shipmentList?: IOrderRecord[]
    childManifests?: IManifestRecord[]
    totalCrates: number
    totalOrders: number
    [key: string]: any
}
type tFontIconSize =  number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export interface IIconButtonProps {
    circle?: boolean;
    iconVariant: string;
    onlyIcon?: boolean;
    minWidth?: string;
    /** number | xs | sm | md | lg | xl */
    iconSize?: tFontIconSize;
    hoverFeedback?: boolean;
    [key: string]: any
}
export interface IExceptionRecord {
    createdByUserName: string
    createdOnDt: number
    exceptionCode: string
    exceptionGroupId: string
    exceptionMessage: string
    exceptionName: string
    exceptionStage: string[]
    exceptionStatus: string
    exceptionType: string
    moduleId: number
    moduleName: string
    moduleStatus: string
    orderNo: string
    raisedExceptionId: number
    editIconButtonProps?: IIconButtonProps
    manifestId?: number
    [key: string]: any
}

export interface IExceptionData {
    clientBranchId?: number
    otherCount?: number
    results?: IExceptionRecord[]
    totalCount?: number
}