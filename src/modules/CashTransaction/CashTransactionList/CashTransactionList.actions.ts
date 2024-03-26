import { IMongoListViewStructure } from "../../../utils/mongo/interfaces";
// import { IListViewRequestPayload } from "../../../utils/common.interface";
import { IDACardDataPayload, IDAListDataPayload, IDCListDataPayload, ITransactionListDataPayload, ITransactionProofDataPayload, ITRCardDataPayload, IDeliveryAssociateListPayloadData, IReasonsForLessDepositPayloadData } from "./CashTransactionList.models";

export interface ISetStructureAction {
    readonly type: '@@cashTransactionList/FETCH_STRUCTURE_SUCCESS';
    payload: IMongoListViewStructure;
}
export interface IFetchStructureAction {
    readonly type: '@@cashTransactionList/FETCH_STRUCTURE';
}
export interface ISetDAStructureAction {
    readonly type: '@@cashTransactionList/FETCH_DA_STRUCTURE_SUCCESS';
    payload: IMongoListViewStructure;
}
export interface IFetchDAStructureAction {
    readonly type: '@@cashTransactionList/FETCH_DA_STRUCTURE';
}
export interface ISetDCStructureAction {
    readonly type: '@@cashTransactionList/FETCH_DC_STRUCTURE_SUCCESS';
    payload: IMongoListViewStructure;
}
export interface IFetchDCStructureAction {
    readonly type: '@@cashTransactionList/FETCH_DC_STRUCTURE';
}
export interface IFetchDataAction {
    readonly type: '@@cashTransactionList/FETCH_TR_DATA'
    payload?: {
        startDateFilter: string,
        endDateFilter: string,
        pageNumber: number,
        pageSize: number,
        searchBy?: string,
        searchText?: string,
        sortBy?: string,
        sortOrder?: string
    }
}
export interface IFetchDADataAction {
    readonly type: '@@cashTransactionList/FETCH_DA_DATA'
    payload?: {
        pageNumber: number,
        pageSize: number,
        searchBy?: string,
        searchText?: string,
        sortBy?: string,
        sortOrder?: string
    }
}
export interface IFetchDCDataAction {
    readonly type: '@@cashTransactionList/FETCH_DC_DATA'
    payload?: {
        pageNumber: number,
        pageSize: number,
        searchBy?: string,
        searchText?: string,
        sortBy?: string,
        sortOrder?: string
    }
}
  
export interface IFetchDataSuccessAction {
    readonly type: '@@cashTransactionList/FETCH_DC_DATA_SUCCESS'
    payload: IDCListDataPayload
}

export interface IFetchDADataSuccessAction {
    readonly type: '@@cashTransactionList/FETCH_DA_DATA_SUCCESS'
    payload: IDAListDataPayload
}

export interface IFetchTransactionDataSuccessAction {
    readonly type: '@@cashTransactionList/FETCH_TR_DATA_SUCCESS'
    payload: ITransactionListDataPayload
}

export interface IFetchTransactionProofDataAction {
    readonly type: '@@cashTransactionList/FETCH_TRANSACTIONPROOF_DATA'
    payload: {
        referenceId: string
    }
}

export interface IFetchTransactionProofDataSuccessAction {
    readonly type: '@@cashTransactionList/FETCH_TRANSACTIONPROOF_DATA_SUCCESS'
    payload: ITransactionProofDataPayload
}

// Transaction list cards API
export interface ISetTRCardStructureAction {
    readonly type: '@@cashTransactionList/FETCH_TRCARD_STRUCTURE_SUCCESS';
    payload: IMongoListViewStructure;
}
export interface IFetchTRCardStructureAction {
    readonly type: '@@cashTransactionList/FETCH_TRCARD_STRUCTURE';
}

export interface IFetchTRCardDataAction {
    readonly type: '@@cashTransactionList/FETCH_TRCARD_DATA'
    payload?: {
        startDateFilter: string,
        endDateFilter: string,
        searchBy?: string,
        searchText?: string,
    }
}

export interface IFetchTRCardDataSuccessAction {
    readonly type: '@@cashTransactionList/FETCH_TRCARD_DATA_SUCCESS'
    payload: ITRCardDataPayload
}

// Delivery Associate list cards API
export interface ISetDACardStructureAction {
    readonly type: '@@cashTransactionList/FETCH_DACARD_STRUCTURE_SUCCESS';
    payload: IMongoListViewStructure;
}
export interface IFetchDACardStructureAction {
    readonly type: '@@cashTransactionList/FETCH_DACARD_STRUCTURE';
}

export interface IFetchDACardDataAction {
    readonly type: '@@cashTransactionList/FETCH_DACARD_DATA'
}

export interface IFetchDACardDataSuccessAction {
    readonly type: '@@cashTransactionList/FETCH_DACARD_DATA_SUCCESS'
    payload: IDACardDataPayload
}

// Distribution Center Associate list cards API
export interface ISetDCCardStructureAction {
    readonly type: '@@cashTransactionList/FETCH_DCCARD_STRUCTURE_SUCCESS';
    payload: IMongoListViewStructure;
}
export interface IFetchDCCardStructureAction {
    readonly type: '@@cashTransactionList/FETCH_DCCARD_STRUCTURE';
}

export interface IFetchDCCardDataAction {
    readonly type: '@@cashTransactionList/FETCH_DCCARD_DATA'
}

export interface IFetchDCCardDataSuccessAction {
    readonly type: '@@cashTransactionList/FETCH_DCCARD_DATA_SUCCESS'
    payload: IDACardDataPayload
}

export interface ISetLoading {
    readonly type: '@@cashTransactionList/SET_LOADING',
    payload: {
      listView: boolean
    }
}

export interface ISetViewMode {
    readonly type: '@@cashTransactionList/SET_VIEW_MODE'
    payload: {
        id: 'deliveryAssociate' | 'distributionCenter' | 'transaction',
        flag: boolean
    }
}

export interface IFetchDeliveryAssociateListAction {
    readonly type: '@@cashTransactionList/FETCH_DELIVERY_ASSOCIATE_LIST',
    payload: {
        searchValue: string
    }
}

export interface IFetchDeliveryAssociateListSuccessAction {
    readonly type: '@@cashTransactionList/FETCH_DELIVERY_ASSOCIATE_LIST_SUCCESS',
    payload: Array<IDeliveryAssociateListPayloadData>
}

export interface IFetchReasonsForLessDepositAction {
    readonly type: '@@cashTransactionList/FETCH_LESS_DEPOSIT_REASONS'
}
export interface IFetchReasonsForLessDepositSuccessAction {
    readonly type: '@@cashTransactionList/FETCH_LESS_DEPOSIT_REASONS_SUCCESS',
    payload: Array<IReasonsForLessDepositPayloadData>;
}

export type CashTransactionListActions =
  | ISetStructureAction
  | IFetchStructureAction
  | ISetDAStructureAction
  | IFetchDAStructureAction
  | ISetDCStructureAction
  | IFetchDCStructureAction
  | IFetchDataAction
  | IFetchDADataAction
  | IFetchDCDataAction
  | IFetchDataSuccessAction
  | IFetchDADataSuccessAction
  | IFetchTransactionDataSuccessAction
  | IFetchTransactionProofDataAction
  | IFetchTransactionProofDataSuccessAction
  | ISetTRCardStructureAction
  | IFetchTRCardStructureAction
  | IFetchTRCardDataAction
  | IFetchTRCardDataSuccessAction
  | ISetDACardStructureAction
  | IFetchDACardStructureAction
  | IFetchDACardDataAction
  | IFetchDACardDataSuccessAction
  | ISetDCCardStructureAction
  | IFetchDCCardStructureAction
  | IFetchDCCardDataAction
  | IFetchDCCardDataSuccessAction
  | ISetLoading
  | ISetViewMode
  | IFetchDeliveryAssociateListAction
  | IFetchDeliveryAssociateListSuccessAction
  | IFetchReasonsForLessDepositAction
  | IFetchReasonsForLessDepositSuccessAction