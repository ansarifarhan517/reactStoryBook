import { IEditDetails, IMongoFormStructure } from './../../../utils/mongo/interfaces';
import { OrderListViewActions } from './OrderListView.actions';
import { IMongoListViewStructure } from '../../../utils/mongo/interfaces';
import { IOrderListViewDataPayload, ICustomField, IFilterInfo, IDateRange, IExceptionData } from './OrderListView.models';
import { renderCustomFields } from '../../../utils/mongo/ListView';
import { IOperationTypes } from 'ui-library';
import moment from 'moment';
import { IMongoDynamicHTMLTemplate } from '../../../utils/common.interface';
import { IOrderPrintAWBTemplateData, IPrintAWBOrderDetails } from '../PrintAWB/PrintAWB.models'
import { metricsConversion } from '../../../utils/helper';


export interface IOrderListViewState {
  structure: IMongoListViewStructure
  data: IOrderListViewDataPayload
  viewMode: 'listview' | 'mapview'
  editDetails: IEditDetails
  loading: {
    listView: boolean,
    columns: boolean
  },
  filterData: IFilterInfo[] | undefined,
  operationsData: IOperationTypes,
  firstLoad: boolean,
  advFilterLoader: boolean,
  lastUpdatedCell: string,
  orderStatus: any,
  geofence: any,
  serviceType :any,
  paymentMode: any,
  deliveryType: any,
  priority: any,
  branches: any,
  notificationData: any
  clientMetric: any[]
  zonalCapacity: boolean
  crateStructure: any
  crateItemsStructure: any
  temperatureCategory: any[],
  dateRange: IDateRange,
  reason: any,
  filterRemoved: boolean,
  filterListPayload: any,
  printAWB: {
    templates: IMongoDynamicHTMLTemplate<IOrderPrintAWBTemplateData>[],
    isModalOpen: boolean
    orderDetails: IPrintAWBOrderDetails[]
  },
  currentFilter: any,
  dateInAttemptedStatus:any,
  selectedRows:any
  exceptionList: IExceptionData[]
  bulkUpdateStructure: IMongoFormStructure
  apiLoading: boolean
  updateAddressFieldsStructure: IMongoFormStructure
  allOrderAddressUpdateListStructure: any
  setDisableNext : boolean
  optimizePackingStatus: Array<Object>
}
export const dummyResult: any = Array(15).fill(0).map((_, i) => ({ orderListViewId: i + 1 }))

const initialState: IOrderListViewState = {
  structure: {
    columns: {},
    buttons: {}
  },
  data: {
    totalCount: 0,
    results: dummyResult
  },
  viewMode: 'listview',
  editDetails: {},
  loading: {
    listView: false,
    columns: false
  },
  filterData: undefined,
  operationsData: {},
  firstLoad: false,
  advFilterLoader: false,
  lastUpdatedCell: "",
  orderStatus: {},
  geofence: [],
  deliveryType: [],
  serviceType : [],
  paymentMode: [],
  priority: [],
  branches: [],
  notificationData: [],
  clientMetric: [],
  zonalCapacity: false,
  crateStructure: [],
  crateItemsStructure: [],
  temperatureCategory: [],
  dateRange: {
    startDate: moment().startOf("day").subtract(7, "days").toDate(),
    endDate: moment().endOf("day").toDate()
  },
  reason: {},
  filterRemoved: false,
  filterListPayload: undefined,
  printAWB: {
    templates: [],
    isModalOpen: false,
    orderDetails: []
  },
  currentFilter: undefined,
  dateInAttemptedStatus:[],
  selectedRows : {},
  exceptionList: [],
  bulkUpdateStructure: {},
  apiLoading: false,
  updateAddressFieldsStructure: {},
  allOrderAddressUpdateListStructure: [],
  setDisableNext : false,
  optimizePackingStatus: []
}

const OrderListViewReducer = (state = initialState, action: OrderListViewActions): IOrderListViewState => {
  switch (action.type) {
    case '@@orderListView/FETCH_STRUCTURE_SUCCESS':
      const newBtn = {}
      const btnSequence = ['assignNow', 'manualAssign', 'bulkUpdate', 'updateOrder', 'markAs', 'Notify', 'More', 'InlineEdit']

      btnSequence.forEach((btn: string) => {

        if (action?.payload?.buttons?.[btn]) {
          newBtn[btn] = action?.payload?.buttons?.[btn]
          console.log(newBtn);
        }
      })
      return {
        ...state,
        structure: { columns: action.payload?.columns, buttons: newBtn }
      }

    case '@@orderListView/FETCH_DATA_SUCCESS':
      const results = action.payload.results.map((row) => {
        const rowObj = row
        if (row.customFields) {
          const customFields: ICustomField[] = JSON.parse(row.customFields)
          customFields.forEach((customField) => {
            const { field } = customField
            rowObj[field] = renderCustomFields(customField, state.structure.columns?.[field], action.payload.clientProperties || {})
          })
        }
        if (row.capacityInVolume) {
          const clientObj = state?.clientMetric.filter((o) => o.name === 'volume');         
          const val = metricsConversion(row.capacityInVolume, 'GET', clientObj[0]?.conversionFactor)
          rowObj['capacityInVolume'] = Number(val.toFixed(2))
        }
        if (row.capacityInWeight) {
          const clientObj = state?.clientMetric.filter((o) => o.name === 'weight');
          const val = metricsConversion(row.capacityInWeight, 'GET', clientObj[0]?.conversionFactor)
          rowObj['capacityInWeight'] = Number(val.toFixed(2))
        }

        return rowObj
      })
      return {
        ...state,
        data: {
          ...state.data,
          results
        }
      }

    case '@@orderListView/FETCH_COUNT_SUCCESS':
      const totalCount = action.payload.moreResultsExists ? 10000 : action.payload.totalCount; // LN-6903: If moreResultsExists is "TRUE" we are saving totalCount as 10000
      const moreResultsExists = action.payload.moreResultsExists

      return {
        ...state,
        data: {
          ...state.data,
          totalCount,
          moreResultsExists
        }
      }

    case '@@orderListView/UPDATE_DATA':
      const { orderId: updateOrderId, ...rest } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map(row => row.orderId === updateOrderId ? { ...row, ...rest } : row)
        }
      }
    case '@@orderListView/SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload
      }

    case '@@orderListView/SET_EDIT_DETAILS':
      const { rowId, columnId, value, hasError } = action.payload
      return {
        ...state,
        lastUpdatedCell: `${rowId}-${columnId}`,
        editDetails: {
          ...state.editDetails,
          [rowId]: {
            ...state.editDetails?.[rowId],
            [columnId]: {
              value,
              hasError
            }
          }
        }
      }

    case '@@orderListView/REMOVE_EDIT_DETAILS':
      const { rowId: removeRowId, columnId: removeColumnId } = action.payload
      const newState = {
        ...state
      }

      delete newState.editDetails?.[removeRowId]?.[removeColumnId]
      if (!Object.keys(newState.editDetails?.[removeRowId] || {}).length) {
        delete newState.editDetails?.[removeRowId]
      }

      return newState

    case '@@orderListView/CLEAR_EDIT_DETAILS':
      return {
        ...state,
        editDetails: {}
      }

    case '@@orderListView/SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload
        }
      }

    case '@@orderListView/UPDATE_STATUS':
      const { orderId, status, custom } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map((row) => row.orderId === orderId ? { ...row, status, ...custom } : row)
        }
      }
    case '@@orderListView/GET_FILTER_DATA':
      return {
        ...state,
        filterData: action.payload?.filterData,
      };
    case '@@orderListView/GET_OPERATIONS_DATA':
      return {
        ...state,
        operationsData: action.payload?.operationsData,
      };
    case '@@orderListView/UPDATE_FIRST_LOAD':
      return {
        ...state,
        firstLoad: action.payload
      }
    case '@@orderListView/SET_ADV_FILTER_LOADING':
      return {
        ...state,
        advFilterLoader: action.payload
      }
    case '@@orderListView/SET_ORDER_STATUS':
      return {
        ...state,
        orderStatus: action.payload.orderStatus

      }
    case '@@orderListView/SET_GEOFENCE':
      return {
        ...state,
        geofence: action.payload

      }

     case '@@orderListView/SET_SERVICE_TYPE':
        return {
          ...state,
          serviceType: action.payload.serviceType
  
        }

      case '@@orderListView/SET_PAYMENT_MODE':
        return {
          ...state,
          paymentMode: action.payload.paymentMode
  
        }
  
    case '@@orderListView/SET_DELIVERY_TYPE':
      return {
        ...state,
        deliveryType: action.payload.deliveryType

      }
    case '@@orderListView/SET_PRIORITY':
      return {
        ...state,
        priority: action.payload.priority.data

      }

    case '@@orderListView/SET_BRANCHES':
      return {
        ...state,
        branches: action.payload.branches

      }
    case '@@orderListView/SET_NOTIFICATION_DATA':
      return {
        ...state,
        notificationData: action.payload.notification_Data
      }

    case '@@orderListView/SET_CRATE_STRUCTURE':
      return {
        ...state,
        crateStructure: action.payload?.cratecolumns?.columns
      }

    case '@@orderListView/SET_CLIENT_METRIC':
      return {
        ...state,
        clientMetric: action?.payload,
      };

    case '@@orderListView/SET_ZONAL_CAPACITY':
      return {
        ...state,
        zonalCapacity: action?.payload,
      };
    case '@@orderListView/SET_CRATE_ITEMS_STRUCTURE':
      return {
        ...state,
        crateItemsStructure: action.payload?.crateItemcolumns?.columns
      }

    case '@@orderListView/SET_TEMPERATURE_CATEGORY':
      const payload = action?.payload?.tempCategroy?.map((t: any) => {
        return {
          id: t.id,
          value: t.clientRefMasterCd,
          label: t.clientRefMasterDesc,
          ...t
        }
      })

      return {
        ...state,
        temperatureCategory: payload
      }

    case '@@orderListView/SET_DATE_RANGE':

      return {
        ...state,
        dateRange: action.payload.dateRange

      }

    case '@@orderListView/SET_REASON':
      return {
        ...state,
        reason: action.payload.reason

      }
    case '@@orderListView/IS_FILTER_REMOVED':
      return {
        ...state,
        filterRemoved: action.payload.status
      }
      case '@@orderListView/SET_FILTER_LIST_PAYLOAD':
        return{
          ...state,
          filterListPayload: action.payload
        }      

        case  '@@orderListView/RESET_DATA':
          
          return{
            ...state,
            dateRange: action.payload.dateRange,
            viewMode: "listview",
            data:{
              ...state.data,
              results: action.payload.results,
              
            },
            notificationData:[],
            structure:{
              columns: {},
              buttons: {}
            }
          }
          case '@@orderListView/SET_CURRENT_FILTERS':
            return {
              ...state,
              currentFilter: action.payload
            }

    case '@@orderListView/RESET_DATA':
      return {
        ...state,
        dateRange: action.payload.dateRange,
        data: {
          ...state.data,
          results: action.payload.results
        }
      }
    case '@@orderListView/SET_CURRENT_FILTERS':
      return {
        ...state,
        currentFilter: action.payload
      }

    case '@@orderListView/FETCH_AWB_HTML_TEMPLATES_SUCCESS':
      return {
        ...state,
        printAWB: {
          ...state.printAWB,
          templates: action.payload
        }
      }

    case '@@orderListView/SET_AWB_MODAL_OPEN':
      return {
        ...state,
        printAWB: {
          ...state.printAWB,
          isModalOpen: action.payload
        }
      }

    case '@@orderListView/FETCH_AWB_ORDER_DETAILS_SUCCESS':
      return {
        ...state,
        printAWB: {
          ...state.printAWB,
          orderDetails: action.payload
        }
      }

    case '@@orderListView/DATE_IN_ATTEMPTED_STATUS':
    return {
      ...state,
      dateInAttemptedStatus: action.newPayload
      
    }
    case '@@orderListView/SELECTEDROWS':
      return {
        ...state,
        selectedRows: action.payload

      }
    case '@@orderListView/SET_EXCEPTION_LIST':
      return {
        ...state,
        exceptionList: action.payload.data
      }

    case '@@orderListView/SET_BULK_UPDATE_STRUCTURE':
      return {
          ...state,
          bulkUpdateStructure : action.payload
      }

    case '@@orderListView/SET_API_LOADING':
      return {
          ...state,
          apiLoading: action.payload
      }
    case '@@orderListView/SET_UPDATE_ADDRESS_STRUCTURE':
      return {
          ...state,
          updateAddressFieldsStructure : action.payload
      }
    case '@@orderListView/SET_ALL_ORDER_ADDRESS_UPDATE_LIST':
      return {
          ...state,
          allOrderAddressUpdateListStructure : action.payload
      }

    case '@@orderListView/SET_DISABLE_NEXT' :
      return {
        ...state,
        setDisableNext : action.payload
      } 

    case '@@orderListView/FETCH_OPTIMIZE_PACKING_STATUS': 
      return {
        ...state,
        optimizePackingStatus: action.payload
      }

 
    default:
      return state
  }
}

export default OrderListViewReducer