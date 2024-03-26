import { IClientProperty } from './../../common/ClientProperties/interfaces';

export interface IDCRowData {
    outstandingAmount: number,
    contactNumber: string,
    distributionCenter: string,
    emailId: string,
    clientBranchId: number,
    adminContactName: string,
    branch: string,
    customFieldsJSONString?: string
}

export interface IDARowData {
    deliveryMediumMasterId: number,
    driverId: number,
    deliveryAssociate: string,
    outstandingAmount: number,
    employeeId: string,
    contactNumber: string,
    distributionCenter: string,
    pendingAmount: number,
    shipmentLocationId: number,
    branch: string,
    customFieldsJSONString?: string
}

export interface ITransactionRowData {
    transactionId: number,
    deliveryAssociate: string,
    transactionType: string,
    transactionDate: number,
    transactionAmount: number,
    distributionCenter: string,
    transactionMode: string,
    referenceId: string,
    customFieldsJSONString?: string
}

export interface IDCListDataPayload {
    clientBranchId?: number,
    otherCount?: number,
    totalCount: number,
    results: Array<IDCRowData>,
    clientProperties?: Record<string, IClientProperty>
}

export interface IDAListDataPayload {
    clientBranchId?: number,
    otherCount?: number,
    totalCount: number,
    results: Array<IDARowData>,
    clientProperties?: Record<string, IClientProperty>
}

export interface ITransactionListDataPayload {
    clientBranchId?: number,
    otherCount?: number,
    totalCount: number,
    results: Array<ITransactionRowData>,
    clientProperties?: Record<string, IClientProperty>
}

export interface ITransactionProofRowData {
    mediaId: number,
    finalUrl: string,
    fileName: string
}

export interface ITRCardDataPayload {
    depositedAmount: number,
    orderValue: number
}

export interface IDACardDataPayload {
    outstandingAmountDAsOrDcsCount: number,
    outstandingAmount: number,
    isActiveFl?: boolean
}

export interface ITransactionProofDataPayload {
    CASHDEPOSIT: Array<ITransactionProofRowData>
}

export interface ICustomField {
    type: string,
    field: string,
    value: any
}

export interface IDeliveryAssociateListPayloadData {    
    isActiveFl: boolean;
    deliveryMediumMasterId: number;
    driverId: number;
    deliveryAssociateName: string;
    outstandingAmount: number;
    employeeId: string;
    contactNumber: string;
    distributionCenter: string;
    pendingAmount: number;
    shipmentLocationId: number;
    branch: string;
}

export interface IReasonsForLessDepositPayloadData {
    clientRefMasterId: number;
    clientRefMasterType: string;
    clientRefMasterCd: string;
    clientRefMasterDesc: string;
    sequence: number;
}