import { IMongoListViewStructure } from "../../utils/mongo/interfaces";
import { IFilterData } from "../common/AdvancedSearch/interface";
import { AlertsHistoryActions } from "./AlertsHistory.actions";
import { IAlertsHistoryDataPayload } from "./AlertsHistory.models";

export const dummyColumns: any = {
  name: { label: "Alert Name", permission: true },
  alertDate: { label: "Alert Date", permission: true },
  createdOnDt: { label: "Date", permission: true },
  notes: { label: "Notes", permission: true },
  isResolved: { label: "Alert Status", permission: true },
  orderNo: { label: "Shipment Number", permission: true },
  orderStatus: { label: "Shipment Status", permission: true },
  origin: { label: "Origin Location", permission: true },
  destination: { label: "Destination Location", permission: true },
  vehicleNumber: { label: "Vehicle Number", permission: true },
  vehicleType: { label: "Type", permission: true }
}
export const dummyResult: any = Array(15).fill(0).map((_, i) => ({ clientCoLoaderId: i + 1 }))

export interface IAlertHistoryState {
  structure: IMongoListViewStructure
  data: IAlertsHistoryDataPayload
  filterData: IFilterData[]
  statusMap: Record<string, string>
  name: Array<any>
  orderStatus: Array<any>
  vehicleType: Array<any>
  tripStatus: Array<any>
  vehicleTypeOfBody: Array<any>
  vehicleOwnership: Array<any>
  loading: boolean,
  listLoading: {
    rows: boolean,
    columns: boolean
  }
}

const initialState: IAlertHistoryState = {
  structure: {
    columns: dummyColumns,
    buttons: {}
  },
  data: {
    results: dummyResult,
    totalCount: 0
  },
  filterData: [],
  statusMap: {},
  name: [],
  orderStatus: [],
  vehicleType: [],
  tripStatus: [],
  vehicleTypeOfBody: [],
  vehicleOwnership: [],
  loading: true,
  listLoading: {
    rows: true,
    columns: true
  }
}

const AlertsHistoryReducer = (
  state = initialState,
  action: AlertsHistoryActions
): IAlertHistoryState => {
  switch (action.type) {
    case "@@alertsHistory/SET_LOADING":
      return {
        ...state,
        loading: action.payload
      };

    case "@@alertsHistory/FETCH_STRUCTURE_SUCCESS":
      return {
        ...state,
        structure: action.payload,
        listLoading: {
          ...state.listLoading,
          columns: false
        }
      };

    case "@@alertsHistory/FETCH_DATA_SUCCESS":
      return {
        ...state,
        data: action.payload,
        loading: false,
        listLoading: {
          columns: false,
          rows: false
        }
      };

    case '@@alertsHistory/UPDATE_DATA':
      const { alertId: updateAlertId, ...rest } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map(row => row.alertId === updateAlertId ? { ...row, ...rest } : row)
        }
      }

    case '@@alertsHistory/UPDATE_NOTES':
      const { alertId, notes } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map(row => row.alertId === alertId ? { ...row, notes: notes } : row)
        }
      }

    case '@@alertsHistory/GET_FILTERS_SUCCESS':
      return {
        ...state,
        filterData: action.payload
      }

    case '@@alertsHistory/SET_DATA':
      return {
        ...state,
        [action?.payload?.key]: action?.payload?.value
      }

    default:
      return state;
  }
};

export default AlertsHistoryReducer;