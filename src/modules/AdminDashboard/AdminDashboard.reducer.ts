import { IEditDetails, IMongoListViewStructure } from "../../utils/mongo/interfaces"
import { AdminDashboardActions } from "./AdminDashboard.actions"
import moment from 'moment';
import { IDateRange } from "../Order/OrderListView/OrderListView.models";
// import { ITabData } from "./AdminDashboard.models"

export interface IDropDownOptions {
  clientId: number
  clientRefMasterCd: string
  clientRefMasterDesc: string
  clientRefMasterId: number
  clientRefMasterType: string
  id: number
  isDeleteFl: string
  name: string
}

export interface IAdminDashboard {
  selectedTab: string,
  tabData: {},
  clientDetails: {
    structure: IMongoListViewStructure,
    tableData: any,
    loading: boolean,
    accountsStructure: IMongoListViewStructure,
    accountsData: any,
    accountsTotalCount: number,
    podData: any,
    offboardDropdownOptions: IDropDownOptions
    editDetails: IEditDetails,
    lastUpdatedCell: string,
  },
  noUsage: {
    structure: IMongoListViewStructure,
    tableData: any,
    loading: boolean,
    dateRange: IDateRange,
    usageMode: string,
    chartData:any,
    removedLegends: []
  },
  planType: any,
  clientIds: any
  BDM: any,
  AM: any,
  OM: any,
  pendingActivation: {
    structure: IMongoListViewStructure,
    tableData: any,
    loading: boolean,
    editDetails: IEditDetails,
  },
  regionsList: Array<Object>,
  regionsCount: Object,
}

const initialState: IAdminDashboard = {
  selectedTab: "activeClient",
  tabData: {},
  clientDetails: {
    structure: {
      columns: {},
      buttons: {}
    },
    tableData: [],
    loading: true,
    accountsStructure: {
      columns: {},
      buttons: {}
    },
    accountsData: [],
    accountsTotalCount: 0,
    podData: {},
    editDetails: {},
    lastUpdatedCell: "",
    offboardDropdownOptions: {
      clientId: 0,
      clientRefMasterCd: "",
      clientRefMasterDesc: "",
      clientRefMasterId: 0,
      clientRefMasterType: "",
      id: 0,
      isDeleteFl: "",
      name: ""
    }
  },
  noUsage: {
    structure: {
      columns: {},
      buttons: {},

    },
    chartData:[],
    tableData: [],
    loading: true,
    dateRange: {
      startDate: moment().startOf("day").subtract(7, "days").toDate(),
      endDate: moment().endOf("day").toDate()
    },
    usageMode: "ORDERUSAGE",
    removedLegends: []
  },
  planType: [],
  clientIds: [],
  BDM: [],
  AM: [],
  OM: [],
  pendingActivation: {
    structure: {
      columns: {},
      buttons: {}
    },
    tableData: [],
    loading: true,
    editDetails: {}
  },
  regionsList: [],
  regionsCount: {},
}
const AdminDashboardReducer = (state = initialState, action: AdminDashboardActions): any => {

  switch (action.type) {
    case '@@adminDashboard/FETCH_TABDATA_SUCCESS':
      return {
        ...state,
        clientDetails: { ...state.clientDetails },
        noUsage: { ...state.noUsage },
        tabData: action.payload.data
      }
    case '@@adminDashboard/FETCH_REGIONS_LIST_SUCCESS':
      return {
        ...state,
        regionsList: [...action.payload]
      }
    case '@@adminDashboard/FETCH_REGIONS_COUNT_SUCCESS':
      return {
        ...state,
        regionsCount: {...state.regionsCount, ...action.payload.data}
      }
    case '@@adminDashboard/CLIENT_DETAILS/FETCH_STRUCTURE_SUCCESS':

      return {
        ...state,
        clientDetails: { structure: { columns: action.payload?.columns, buttons: action.payload?.buttons } }
      }
    case '@@adminDashboard/CLIENT_DETAILS/FETCH_DATA_SUCCESS':

      return {
        ...state,
        clientDetails: { ...state.clientDetails, tableData: action.payload.results[0].tableData, totalCount: action.payload.totalCount }
      }
    case '@@adminDashboard/SELECT_TAB':
      return {
        ...state,
        selectedTab: action.payload
      }
    case '@@adminDashboard/CLIENT_DETAILS/IS_LOADING':
      return {
        ...state,
        clientDetails: { ...state.clientDetails, loading: action.payload }
      }
    case '@@adminDashboard/CLIENT_DETAILS/ACCOUNTS/FETCH_STRUCTURE_SUCCESS':
      return {
        ...state,
        clientDetails: { ...state.clientDetails, accountsStructure: action.payload }
      }
    case '@@adminDashboard/CLIENT_DETAILS/ACCOUNTS/FETCH_DATA_SUCCESS':

      return {
        ...state,
        clientDetails: { ...state.clientDetails, accountsData: action.payload.results, accountsTotalCount: action.payload.totalCount }
      }
    case '@@adminDashboard/CLIENT_ACTIVITY/FETCH_STRUCTURE_SUCCESS':

      return {
        ...state,
        noUsage: { ...state.noUsage, structure: { columns: action.payload?.columns, buttons: action.payload?.buttons } }
      }
    case '@@adminDashboard/CLIENT_ACTIVITY/FETCH_DATA_SUCCESS':

      return {
        ...state,
        noUsage: { ...state.noUsage, tableData: action.payload.results[0].tableData, totalCount: action.payload.totalCount }
      }

    case '@@adminDashboard/PLAN_TYPE':
      return {
        ...state,
        planType: action.payload 
      }
    case '@@adminDashboard/CLIENT_DETAILS/SET_CLIENT_IDS':
      return {
        ...state,
        clientIds: action.payload
      }


    case '@@adminDashboard/CLIENT_DETAILS/FETCH_POD_DATA_SUCCESS':
      return {
        ...state,
        clientDetails: { ...state.clientDetails, podData: action.payload.data }
      }
    case '@@adminDashboard/PLAN_TYPE':
      return {
        ...state,
        planType: action.payload
      }
    case '@@adminDashboard/SET_BDM':
      return {
        ...state,
        BDM: action.payload
      }
    case '@@adminDashboard/SET_OM':
      return {
        ...state,
        OM: action.payload
      }
    case '@@adminDashboard/SET_AM':
      return {
        ...state,
        AM: action.payload
      }
    case '@@adminDashboard/PENDING_ACTIVATION/FETCH_STRUCTURE_SUCCESS':

      return {
        ...state,
        pendingActivation: { structure: { columns: action.payload?.columns, buttons: action.payload?.buttons } }
      }
    case '@@adminDashboard/PENDING_ACTIVATION/FETCH_DATA_SUCCESS':

      return {
        ...state,
        pendingActivation: { ...state.pendingActivation, tableData: action.payload.results, totalCount: action.payload.totalCount }
      }

    case '@@adminDashboard/CLIENT_DETAILS/SET_EDIT_DETAILS':
      const { rowId, columnId, value, hasError } = action.payload
      return {
        ...state,
        clientDetails: {
          ...state.clientDetails,
          lastUpdatedCell: `${rowId}-${columnId}`,
          editDetails: {
            ...state.clientDetails.editDetails,
            [rowId]: {
              ...state.clientDetails.editDetails?.[rowId],
              [columnId]: {
                value,
                hasError
              }
            }
          }

        }

      }

    case '@@adminDashboard/CLIENT_DETAILS/REMOVE_EDIT_DETAILS':
      const { rowId: removeRowId, columnId: removeColumnId } = action.payload
      const newState = {
        ...state
      }

      delete newState.clientDetails.editDetails?.[removeRowId]?.[removeColumnId]
      if (!Object.keys(newState.clientDetails.editDetails?.[removeRowId] || {}).length) {
        delete newState.clientDetails.editDetails?.[removeRowId]
      }

      return newState

    case '@@adminDashboard/CLIENT_DETAILS/CLEAR_EDIT_DETAILS':
      return {
        ...state,
        clientDetails: {
          ...state.clientDetails,
          editDetails: {}
        }
      }
    case '@@adminDashboard/SET_DATE_RANGE':
      return {
        ...state,
        noUsage: { ...state.noUsage, dateRange: action.payload.dateRange }

      }
      case '@@adminDashboard/SET_USAGE_MODE':
        return {
          ...state,
          noUsage: { ...state.noUsage, usageMode: action.payload }
  
        }  
      case '@@adminDashboard/CLIENT_DETAILS/OFFBOARD/FETCH_OPTIONS_SUCCESS':
        return {
          ...state,
          clientDetails: { ...state.clientDetails, offboardDropdownOptions: action.payload }
        }

      case '@@adminDashboard/PENDING_ACTIVATION/SET_EDIT_DETAILS':
        const { saasRowId, saasColumnId, saasValue, saasHasError } = action.payload
        return {
          ...state,
          pendingActivation: {
            ...state.pendingActivation,
            lastUpdatedCell: `${saasRowId}-${saasColumnId}`,
            editDetails: {
              ...state.pendingActivation.editDetails,
              [saasRowId]: {
                ...state.pendingActivation.editDetails?.[saasRowId],
                [saasColumnId]: {
                  saasValue,
                  saasHasError
                }
              }
            }
          }
        }
      case '@@adminDashboard/PENDING_ACTIVATION/REMOVE_EDIT_DETAILS':
        const { rowId: saasremoveRowId, columnId: saasremoveColumnId } = action.payload
        const saasnewState = {
          ...state
        }

        delete saasnewState.pendingActivation.editDetails?.[saasremoveRowId]?.[saasremoveColumnId]
        if (!Object.keys(saasnewState.pendingActivation.editDetails?.[saasremoveRowId] || {}).length) {
          delete saasnewState.pendingActivation.editDetails?.[saasremoveRowId]
        }

        return saasnewState

      case '@@adminDashboard/PENDING_ACTIVATION/CLEAR_EDIT_DETAILS':
        return {
          ...state,
          pendingActivation: {
          ...state.pendingActivation,
          editDetails: {}
        }
      }
      case '@@adminDashboard/PENDING_ACTIVATION/IS_LOADING':
      return {
        ...state,
        pendingActivation: { ...state.pendingActivation, loading: action.payload }
      }
      case '@@adminDashboard/CLIENT_ACTICITY/SET_CHART_DATA':
        return {
          ...state,
          noUsage: { ...state.noUsage, chartData: action.payload }
        }
        case '@@adminDashboard/CLIENT_ACTICITY/SET_REMOVE_LEGENDS':
          return {
            ...state,
            noUsage: { ...state.noUsage, removedLegends: action.payload }
          }
    default:
      return state
  }

}

export default AdminDashboardReducer