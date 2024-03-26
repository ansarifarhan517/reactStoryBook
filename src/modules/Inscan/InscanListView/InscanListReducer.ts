import { IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import { InscanListActions } from "./InscanList.acions";
import { IInscanListDataPayload, tBreadcrumbState } from "./InscanList.models";

export interface IInscanListState {
  structure: IMongoListViewStructure,
  data: IInscanListDataPayload,
  loading: {
    listView: boolean;
    columns: boolean;
  },
  breadcrumbState: tBreadcrumbState,
  totalRows: number,
  moreResultsExists?: boolean
  setDisableNext?: boolean
}

export const dummyColumns: any = {
  clientBranchName: { label: "Client Branch Name", permission: true },
  courierName: { label: "Courier Name", permission: true },
  deliveryMediumMasterName: { label: "Delivery Associate", permission: true },
  exception: { label: "Exception", permission: true },
  hubScanStatus: { label: "Scan Status", permission: true },
  inwardMfId: { label: "Inscan Manifest ID", permission: true },
  orderNo: { label: "Shipment Number", permission: true },
  orderStatus: { label: "Shipment Status", permission: true },
  outwardMfId: { label: "Outscan Manifest ID", permission: true },
  scanDt: { label: "Scanned On", permission: true },
  tripName: { label: "Trip No.", permission: true }
}
export const dummyResult: any = Array(15).fill(0).map((_, i) => ({ shipmentId: i + 1 }))

const initialState: IInscanListState = {
  structure: {
    columns: dummyColumns,
    buttons: {}
  },
  data: {
    totalCount: 0,
    results: dummyResult
  },
  breadcrumbState: 'allOrders',
  totalRows: 0,
  loading: {
    listView: false,
    columns: false
  },
  setDisableNext: false
}

const InscanListReducer = (state = initialState, action: InscanListActions): IInscanListState => {
  switch (action.type) {
    case '@@inscanList/FETCH_STRUCTURE_SUCCESS':
      return {
        ...state,
        structure: action.payload
      }

    case '@@inscanList/FETCH_DATA_SUCCESS':
      return {
        ...state,
        data: {
          ...action.payload
        }
      }

    case '@@inscanList/FETCH_DATA_COUNT_SUCCESS':
     const totalCount = action.payload.totalCount === 1000 ? 10000 : action.payload.totalCount
      return {
        ...state,
        totalRows: totalCount,
        moreResultsExists: action.payload.moreResultsExists
      }

    case '@@inscanList/SET_BREADCRUMB_STATE': {
      return {
        ...state,
        breadcrumbState: action.payload
      }
    }

    case '@@inscanList/SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload
        }
      }

    case '@@inscanList/SET_COLUMNS_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload,
        },
      };

    case '@@inscanList/SET_DISABLE_NEXT' :
      return {
        ...state,
        setDisableNext : action.payload
      } 
      
    default:
      return state
  }
}


export default InscanListReducer