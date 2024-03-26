import { CashTransactionListActions } from './CashTransactionList.actions';
import { IMongoListViewStructure } from '../../../utils/mongo/interfaces';
import { IDCListDataPayload, ITransactionListDataPayload, IDAListDataPayload, ITransactionProofDataPayload, ITRCardDataPayload, IDACardDataPayload, IDeliveryAssociateListPayloadData, IReasonsForLessDepositPayloadData } from './CashTransactionList.models';
// import { renderCustomFields } from '../../../utils/mongo/ListView';

export interface ICashTransactionListState {
    structure: IMongoListViewStructure,
    cardStructure: IMongoListViewStructure,
    data: ITransactionListDataPayload | IDAListDataPayload | IDCListDataPayload,
    cardTRData: ITRCardDataPayload,
    cardDADCData: IDACardDataPayload,
    transactionProof: ITransactionProofDataPayload
    viewMode: {
        id: 'deliveryAssociate' | 'distributionCenter' | 'transaction',
        flag: boolean
    }
    loading: {
      listView: boolean
    },
    deliveryAssociateList: Array<IDeliveryAssociateListPayloadData>
    lessDepositReasons: Array<IReasonsForLessDepositPayloadData>
}

const initialState: ICashTransactionListState = {
    structure: {
      columns: {},
      buttons: {}
    },
    cardStructure: {
        columns: {},
        buttons: {}
    },
    data: {
        totalCount: 0,
        results: []
    },
    cardTRData: {
        depositedAmount: 0,
        orderValue: 0,
    },
    cardDADCData: {
        outstandingAmountDAsOrDcsCount: 0,
        outstandingAmount: 0
    },
    transactionProof: {
        CASHDEPOSIT: [],
    },
    viewMode: {
        id: 'deliveryAssociate',
        flag: true
    },
    loading: {
      listView: false
    },
    deliveryAssociateList: [],
    lessDepositReasons: []
}

const CashTransactionListReducer = (state = initialState, action: CashTransactionListActions): ICashTransactionListState => {
    switch (action.type) {
        case '@@cashTransactionList/FETCH_STRUCTURE_SUCCESS':
            return {
                ...state,
                structure: action.payload
            }
        
        case '@@cashTransactionList/FETCH_DA_STRUCTURE_SUCCESS':
            return {
                ...state,
                structure: action.payload
            }

        case '@@cashTransactionList/FETCH_DC_STRUCTURE_SUCCESS':
            return {
                ...state,
                structure: action.payload
            }
        
        case '@@cashTransactionList/FETCH_TR_DATA_SUCCESS':
        
            return {
                ...state,
                data: {
                ...action.payload
                }
            }

        case '@@cashTransactionList/FETCH_DA_DATA_SUCCESS':
        
            return {
                ...state,
                data: {
                ...action.payload
                }
            }


        case '@@cashTransactionList/FETCH_DC_DATA_SUCCESS':
        
            return {
                ...state,
                data: {
                ...action.payload
                }
            }

        case '@@cashTransactionList/FETCH_TRANSACTIONPROOF_DATA_SUCCESS':
            return {
                ...state,
                transactionProof: {
                    ...action.payload
                }
            }

        case '@@cashTransactionList/FETCH_TRCARD_STRUCTURE_SUCCESS':
            return {
                ...state,
                cardStructure: action.payload
            }

        case '@@cashTransactionList/FETCH_TRCARD_DATA_SUCCESS':
            return {
                ...state,
                cardTRData: {
                    ...action.payload
                }
            }

        case '@@cashTransactionList/FETCH_DACARD_STRUCTURE_SUCCESS':
            return {
                ...state,
                cardStructure: action.payload
            }

        case '@@cashTransactionList/FETCH_DACARD_DATA_SUCCESS':
            return {
                ...state,
                cardDADCData: {
                    ...action.payload
                }
            }

        case '@@cashTransactionList/FETCH_DCCARD_STRUCTURE_SUCCESS':
            return {
                ...state,
                cardStructure: action.payload
            }

        case '@@cashTransactionList/FETCH_DCCARD_DATA_SUCCESS':
            return {
                ...state,
                cardDADCData: {
                    ...action.payload
                }
            }

        case '@@cashTransactionList/SET_LOADING':
            return {
                ...state,
                loading: {
                ...state.loading,
                ...action.payload
                }
            }

        case '@@cashTransactionList/SET_VIEW_MODE':
            return {
                ...state,
                viewMode: action.payload
            }

        case '@@cashTransactionList/FETCH_DELIVERY_ASSOCIATE_LIST_SUCCESS':
            return {
                ...state, deliveryAssociateList: action.payload
            }
        case '@@cashTransactionList/FETCH_LESS_DEPOSIT_REASONS_SUCCESS':
            return {
                ...state, lessDepositReasons: action.payload
            }
        default:
            return state
    }
}

export default CashTransactionListReducer