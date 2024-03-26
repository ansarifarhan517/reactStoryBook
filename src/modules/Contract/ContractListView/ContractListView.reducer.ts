import { ContractListViewActions } from './ContractListView.actions';
import { IContractViewDataPayload,
  //  ICustomField,
    IDropdown, tContractStatus, IPriorityList } from './ContractListView.models';
import { IFetchDataOptions, ISelectedRows } from 'ui-library'
import { IEditDetails, IMongoListViewStructure } from '../../../utils/mongo/interfaces';
// import { renderCustomFields } from '../../../utils/mongo/ListView';
import { IFilterData, IFilters } from '../../common/AdvancedSearch/interface';
import moment from 'moment';
import { IStatusLookupResponse, IBranchLookupResponse } from '../../../utils/common.interface';


export interface IContractListViewState {
  structure: IMongoListViewStructure
  data: IContractViewDataPayload
  viewMode: 'listview'
  editDetails: IEditDetails
  loading: {
    listView: boolean
  },
  fetchOptions: IFetchDataOptions
  selectedRows?: ISelectedRows | {}
  isEditMode: boolean
  lastUpdatedCell: string,
  uploadModal: boolean
  userId: string | undefined
  clientId: string
  isSaveClicked: boolean
  emptyData: boolean
  breadcrumbFilter: tContractStatus;
  appliedAdvancedFilterData: IFilters[]
  advancedFilterData: IFilterData[]
  filterListPayload: any
  currentFilter: IFilterData | undefined
  advancedFilterDropdown: any
  advancedFilterOperations: any
  openAdvFilter: boolean
  firstLoad: boolean
  advFilterLoader: boolean
  priorityList: IDropdown[]
  minDate: any
  maxDate: any
  serviceType: IStatusLookupResponse[]
  branchList: IBranchLookupResponse[];
  statusList: IDropdown[];
  dateRangeOpn: boolean
  approveModal: boolean
  rejectionModal: boolean
  rejectReasonList: IStatusLookupResponse[] | any[],
  orderStatusList: IStatusLookupResponse[] | any[],
  paymentType: IStatusLookupResponse[] | any[],
  deliveryTypes: IDropdown[];

}
export const dummyContractColumnData: any = [{label: 'contractNumber'}, {label: 'VendorName'},{label: 'contractDate'},{label: 'contractExpiryDate'},{label: 'contractNumber'}]

export const dummyContractResultData: any = Array(15).fill(0).map((_, i) => ({ contractId: i + 1 }))

const initialState: IContractListViewState = {
  loading: {
    listView: true
  },
  structure: {
    columns: dummyContractColumnData,
    buttons: {}
  },
  data: {
    totalCount: 0,
    results: dummyContractResultData
  },
  viewMode: 'listview',
  editDetails: {},
 
  fetchOptions: {},
  selectedRows: {},
  isEditMode: false,
  lastUpdatedCell: '',
  uploadModal: false,
  userId: '',
  clientId: '',
  isSaveClicked: false,
  emptyData: false,
  breadcrumbFilter: 'ALL',
  appliedAdvancedFilterData: [],
  advancedFilterData: [],
  filterListPayload: undefined,
  currentFilter: undefined,
  advancedFilterDropdown: undefined,
  advancedFilterOperations: undefined,
  openAdvFilter: false,
  firstLoad: false,
  advFilterLoader: false,
  priorityList: [],
  serviceType: [],
  branchList: [],
  statusList: [],
  minDate: moment(Date()).subtract(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
  maxDate: moment(new Date()).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  dateRangeOpn: false,
  approveModal: false,
  rejectionModal: false,
  rejectReasonList: [],
  orderStatusList: [],
  paymentType: [],
  deliveryTypes: []
}

const ContractReducer = (state = initialState, action: ContractListViewActions): IContractListViewState => {
  switch (action.type) {
    case '@@contractListView/RESET_STATE':
      return {
        ...state,
        structure: {
          columns: dummyContractColumnData,
          buttons: {}
        },
        data: {
          totalCount: 0,
          results: dummyContractResultData
        },
        editDetails: {},
        isEditMode: false,
        isSaveClicked: false,
        emptyData: false,
        uploadModal: false,
        filterListPayload: undefined,
        currentFilter: undefined,
        openAdvFilter: false,
        firstLoad: false,
        advFilterLoader: false,
        approveModal: false,
        rejectionModal: false,
        dateRangeOpn: false,
        loading: {
          listView: true
        },

      }
    case '@@contractListView/FETCH_STRUCTURE_SUCCESS':
      const clientId = JSON.parse(localStorage.getItem('userAccessInfo') || '')?.['subClients']?.[0]?.['clientId'];
      const userIdentifier = JSON.parse(localStorage.getItem('userAccessInfo') || '')?.userId;
      const columns = action?.payload?.columns;
      const showTimeKeys = ['contractDate', 'contractExpiryDate']

      const keys = Object.keys(columns);
      const newObj: any = {};
      keys.forEach((key: string) => {
        if (showTimeKeys.includes(key)) {
          newObj[key] = columns[key]
          newObj[key].showTime = false
          newObj[key].dateFormat = 'YYYY-MM-DD'
        } else {
          newObj[key] = columns[key];
        }
      });
      columns['contractDate'].fieldType = 'date'
      columns['contractExpiryDate'].fieldType = 'date'


  
      const newPayload = { 
          ...action.payload,
         columns: columns, 
         buttons: action?.payload?.buttons };

      return {
        ...state,
        clientId,
        userId: userIdentifier,
        structure: newPayload
      }

    case '@@contractListView/FETCH_DATA_SUCCESS':
      // const results = action.payload.results.map((row: any) => {
      //   const rowObj = row
      //   rowObj.editIconButtonProps = {
      //     title: ''
      //   }
      //   if (row.customFieldsJSONString) {
      //     const customFields: ICustomField[] = JSON.parse(row.customFieldsJSONString)
      //     customFields.forEach((customField) => {
      //       const { field } = customField
      //       rowObj[field] = renderCustomFields(customField, state.structure.columns?.[field], action.payload.clientProperties || {})
      //     })
      //   }

      //   return rowObj
      // })

      return {
        ...state,
        data: {
          ...action.payload,
        }
      }
    case '@@contractListView/FETCH_PRIORITY_LIST':
      const priorityList = action.payload
      const newList = priorityList.map((priority: IPriorityList) => {
        return {
          id: priority?.clientRefMasterId,
          label: priority?.clientRefMasterDesc,
          value: priority?.clientRefMasterCd,
        }
      })
      return {
        ...state,
        priorityList: newList
      }

    case '@@contractListView/UPDATE_DATA':
      const { id, ...rest } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map((row: any) => row.contractId === id ? { ...row, ...rest } : row)
        }
      }
    case '@@contractListView/SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload
      }

    case '@@contractListView/SET_EDIT_DETAILS':
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

    case '@@contractListView/REMOVE_EDIT_DETAILS':
      const { rowId: removeRowId, columnId: removeColumnId } = action.payload
      const newState = {
        ...state
      }

      delete newState.editDetails?.[removeRowId]?.[removeColumnId]
      if (!Object.keys(newState.editDetails?.[removeRowId] || {}).length) {
        delete newState.editDetails?.[removeRowId]
      }

      return newState

    case '@@contractListView/CLEAR_EDIT_DETAILS':
      return {
        ...state,
        editDetails: {}
      }

    case '@@contractListView/SET_LOADING':
      return {
        ...state,
        loading: {
          ...action.payload
        }
      }

    case '@@contractListView/UPDATE_STATUS':
      const { id: fleetId, status, custom } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map((row) => row.contractId === fleetId ? { ...row, status, ...custom } : row)
        }
      }
    case '@@contractListView/SET_FETCH_OPTIONS':
      return {
        ...state,
        fetchOptions: action.payload
      }
    case '@@contractListView/SET_SELECTED_ROWS':
      return {
        ...state,
        selectedRows: action.payload
      }
    case '@@contractListView/SET_IS_EDITABLE':
      return {
        ...state,
        isEditMode: action.payload
      }

    case '@@contractListView/SET_UPLOAD_MODAL':
      return {
        ...state,
        uploadModal: action.payload
      }

    case '@@contractListView/SET_IS_SAVE_CLICKED':
      return {
        ...state,
        isSaveClicked: action.payload
      }
    case '@@contractListView/SET_EMPTY_DATA': {
      return {
        ...state,
        emptyData: action.payload
      }
    }
    case '@@contractListView/SET_BREADCRUMB_STATE':
      return {
        ...state,
        breadcrumbFilter: action.payload
      }

    case '@@contractListView/SET_APPLIED_ADV_FILTER_DATA':
      return {
        ...state,
        appliedAdvancedFilterData: action.payload
      }
    case '@@contractListView/SET_ADV_FILTER_DATA':
      return {
        ...state,
        advancedFilterData: action.payload
      }
    case '@@contractListView/UPDATE_FIRST_LOAD':
      return {
        ...state,
        firstLoad: action.payload
      }
    case '@@contractListView/SET_ADV_FILTER_LOADING':
      return {
        ...state,
        advFilterLoader: action.payload
      }
    case '@@contractListView/SET_CURRENT_FILTERS':
      return {
        ...state,
        currentFilter: action.payload
      }
    case '@@contractListView/SET_FILTERLIST_PAYLOAD':
      return {
        ...state,
        filterListPayload: action.payload
      }
    case '@@contractListView/SET_OPEN_ADV_FILTER':
      return {
        ...state,
        openAdvFilter: action.payload
      }
    case '@@contractListView/SET_OPEN_DATERANGE':
      return {
        ...state,
        dateRangeOpn: action.payload
      }
    case '@@contractListView/SET_SELECTED_DATE':
      return {
        ...state,
        maxDate: action.payload.maxDate,
        minDate: action.payload.minDate
      }
    case '@@contractListView/GET_SERVICE_TYPE':
      const types = action.payload.map((status: IStatusLookupResponse) => {
        return {
          clientId: status.clientId,
          clientRefMasterCd: status.clientRefMasterCd,
          clientRefMasterDesc: status.clientRefMasterDesc,
          clientRefMasterId: status.clientRefMasterId,
          clientRefMasterType: status.clientRefMasterType,
          id: status.id,
          isDeleteFl: status.isDeleteFl,
          name: status.name,
          label: status.name,
          value: status.clientRefMasterCd,
        }
      })
      return {
        ...state,
        serviceType: types,
      };
  
    case '@@contractListView/GET_DELIVERY_STATUS':
      const statusList = action.payload?.map((data: any) => ({
        label: data?.clientRefMasterDesc,
        value: data?.reasonCd,
        id: data?.reasonCd,
        title: data?.clientRefMasterDesc
      }));
      return {
        ...state,
        statusList,
      };
    case '@@contractListView/SET_APPROVE_MODAL':
      return {
        ...state,
        approveModal: action.payload
      }
    case '@@contractListView/SET_REJECT_MODAL':
      return {
        ...state,
        rejectionModal: action.payload
      }
    case '@@contractListView/FETCH_REJECT_REASON_LIST':
      const rejectList = action.payload.map((reason: IStatusLookupResponse) => {
        return {
          clientId: reason.clientId,
          clientRefMasterCd: reason.clientRefMasterCd,
          clientRefMasterDesc: reason.clientRefMasterDesc,
          clientRefMasterId: reason.clientRefMasterId,
          clientRefMasterType: reason.clientRefMasterType,
          id: reason.id,
          isDeleteFl: reason.isDeleteFl,
          name: reason.name,
          label: reason.name,
          value: reason.clientRefMasterId,
        }
      })
      return {
        ...state,
        rejectReasonList: rejectList
      }
    case '@@contractListView/FETCH_ORDER_STATUS_LIST':
      const orderStatusList = action.payload.map((status: IStatusLookupResponse) => {
        return {
          clientId: status.clientId,
          clientRefMasterCd: status.clientRefMasterCd,
          clientRefMasterDesc: status.clientRefMasterDesc,
          clientRefMasterId: status.clientRefMasterId,
          clientRefMasterType: status.clientRefMasterType,
          id: status.id,
          isDeleteFl: status.isDeleteFl,
          name: status.name,
          label: status.name,
          value: status.name,
        }
      })
      return {
        ...state,
        orderStatusList
      }
    case '@@contractListView/FETCH_PAYMENT_TYPE_LIST':
      const paymentType = action.payload.map((status: IStatusLookupResponse) => {
        return {
          clientId: status.clientId,
          clientRefMasterCd: status.clientRefMasterCd,
          clientRefMasterDesc: status.clientRefMasterDesc,
          clientRefMasterId: status.clientRefMasterId,
          clientRefMasterType: status.clientRefMasterType,
          id: status.id,
          isDeleteFl: status.isDeleteFl,
          name: status.name,
          label: status.name,
          value: status.clientRefMasterCd,
        }
      })
      return {
        ...state,
        paymentType
      }
    case '@@contractListView/GET_DELIVERY_TYPE':
      const type = action.payload?.map((type: any) => ({
        label: type?.name,
        value: type?.name,
        id: type?.id,
        title: type?.name
      }));
      return {
        ...state,
        deliveryTypes: type,
      };
    default:
      return state
  }
}

export default ContractReducer