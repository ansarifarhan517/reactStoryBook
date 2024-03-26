import { tOrderRequestListViewAcions } from './OrderRequestListView.actions';
import { IOrderRequestViewDataPayload, ICustomField, IDropdown, tOrderRequestStatus, IPriorityList } from './OrderRequestListView.models';
import { IFetchDataOptions, ISelectedRows } from 'ui-library'
import { IEditDetails, IMongoListViewStructure } from '../../../utils/mongo/interfaces';
import { renderCustomFields } from '../../../utils/mongo/ListView';
import { IFilterData, IFilters } from '../../common/AdvancedSearch/interface';
import moment from 'moment';
import { IStatusLookupResponse, IBranchLookupResponse } from '../../../utils/common.interface';


export interface IOrderRequestListViewState {
  structure: IMongoListViewStructure
  data: IOrderRequestViewDataPayload
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
  breadcrumbFilter: tOrderRequestStatus;
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
export const dummyOrderRequestColumnData: any = Array(6).fill(0).map((_, i) => ({ label: (i + 1).toString() }))

export const dummyOrderRequestResultData: any = Array(15).fill(0).map((_, i) => ({ bookingId: i + 1 }))

const initialState: IOrderRequestListViewState = {
  structure: {
    columns: dummyOrderRequestColumnData,
    buttons: {}
  },
  data: {
    totalCount: 0,
    results: dummyOrderRequestResultData
  },
  viewMode: 'listview',
  editDetails: {},
  loading: {
    listView: false
  },
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

const OrderRequestReducer = (state = initialState, action: tOrderRequestListViewAcions): IOrderRequestListViewState => {
  switch (action.type) {
    case '@@orderRequestListView/RESET_INITIAL_STATE':
      return {
        ...state,
        structure: {
          columns: dummyOrderRequestColumnData,
          buttons: {}
        },
        data: {
          totalCount: 0,
          results: dummyOrderRequestResultData
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
        dateRangeOpn: false

      }
    case '@@orderRequestListView/FETCH_STRUCTURE_SUCCESS':
      const clientId = JSON.parse(localStorage.getItem('userAccessInfo') || '')?.['subClients']?.[0]?.['clientId'];
      const userIdentifier = JSON.parse(localStorage.getItem('userAccessInfo') || '')?.userId;
      const columns = action?.payload?.columns;
      const showTimeKeys = ['bookingDate', 'deliverEndTimeWindow', 'deliverStartTimeWindow', 'pickupEndTimeWindow', 'pickupStartTimeWindow', 'shipDate']
      const keys = Object.keys(columns);
      const newObj: any = {};
      keys.forEach((key: string) => {
        if (showTimeKeys.includes(key)) {
          newObj[key] = columns[key]
          newObj[key].showTime = true
          newObj[key].dateFormat = 'YYYY-MM-DD HH:mm:ss'
        } else {
          newObj[key] = columns[key];
        }
      });

      const newBtn = {}
      const btnSequence = ['approve', 'accept', 'reject', 'InlineEdit']

      btnSequence.forEach((btn: string) => {
        if (action?.payload?.buttons?.[btn]) {
          newBtn[btn] = action?.payload?.buttons?.[btn]
        }
      })
      const newPayload = { ...action.payload, columns: newObj, buttons: newBtn };
      return {
        ...state,
        clientId,
        userId: userIdentifier,
        structure: newPayload
      }

    case '@@orderRequestListView/FETCH_DATA_SUCCESS':
      const results = action.payload.results.map((row: any) => {
        const rowObj = row
        rowObj.editIconButtonProps = {
          style: {
            opacity: '0'
          },
          onClick: undefined,
          title: ''
        }
        if (row.customFieldsJSONString) {
          const customFields: ICustomField[] = JSON.parse(row.customFieldsJSONString)
          customFields.forEach((customField) => {
            const { field } = customField
            rowObj[field] = renderCustomFields(customField, state.structure.columns?.[field], action.payload.clientProperties || {})
          })
        }

        return rowObj
      })

      return {
        ...state,
        data: {
          ...action.payload,
          results
        }
      }
    case '@@orderRequestListView/FETCH_PRIORITY_LIST':
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

    case '@@orderRequestListView/UPDATE_DATA':
      const { bookingId, ...rest } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map(row => row.bookingId === bookingId ? { ...row, ...rest } : row)
        }
      }
    case '@@orderRequestListView/SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload
      }

    case '@@orderRequestListView/SET_EDIT_DETAILS':
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

    case '@@orderRequestListView/REMOVE_EDIT_DETAILS':
      const { rowId: removeRowId, columnId: removeColumnId } = action.payload
      const newState = {
        ...state
      }

      delete newState.editDetails?.[removeRowId]?.[removeColumnId]
      if (!Object.keys(newState.editDetails?.[removeRowId] || {}).length) {
        delete newState.editDetails?.[removeRowId]
      }

      return newState

    case '@@orderRequestListView/CLEAR_EDIT_DETAILS':
      return {
        ...state,
        editDetails: {}
      }

    case '@@orderRequestListView/SET_LOADING':
      return {
        ...state,
        loading: {
          listView: action.payload.listView
        }
      }

    case '@@orderRequestListView/UPDATE_STATUS':
      const { id: fleetId, status, custom } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map((row) => row.bookingId === fleetId ? { ...row, status, ...custom } : row)
        }
      }
    case '@@orderRequestListView/SET_FETCH_OPTIONS':
      return {
        ...state,
        fetchOptions: action.payload
      }
    case '@@orderRequestListView/SET_SELECTED_ROWS':
      return {
        ...state,
        selectedRows: action.payload
      }
    case '@@orderRequestListView/SET_IS_EDITABLE':
      return {
        ...state,
        isEditMode: action.payload
      }

    case '@@orderRequestListView/SET_UPLOAD_MODAL':
      return {
        ...state,
        uploadModal: action.payload
      }

    case '@@orderRequestListView/SET_IS_SAVE_CLICKED':
      return {
        ...state,
        isSaveClicked: action.payload
      }
    case '@@orderRequestListView/SET_EMPTY_DATA': {
      return {
        ...state,
        emptyData: action.payload
      }
    }
    case '@@orderRequestListView/SET_BREADCRUMB_STATE':
      return {
        ...state,
        breadcrumbFilter: action.payload
      }

    case '@@orderRequestListView/SET_APPLIED_ADV_FILTER_DATA':
      return {
        ...state,
        appliedAdvancedFilterData: action.payload
      }
    case '@@orderRequestListView/SET_ADV_FILTER_DATA':
      return {
        ...state,
        advancedFilterData: action.payload
      }
    case '@@orderRequestListView/UPDATE_FIRST_LOAD':
      return {
        ...state,
        firstLoad: action.payload
      }
    case '@@orderRequestListView/SET_ADV_FILTER_LOADING':
      return {
        ...state,
        advFilterLoader: action.payload
      }
    case '@@orderRequestListView/SET_CURRENT_FILTERS':
      return {
        ...state,
        currentFilter: action.payload
      }
    case '@@orderRequestListView/SET_FILTERLIST_PAYLOAD':
      return {
        ...state,
        filterListPayload: action.payload
      }
    case '@@orderRequestListView/SET_OPEN_ADV_FILTER':
      return {
        ...state,
        openAdvFilter: action.payload
      }
    case '@@orderRequestListView/SET_OPEN_DATERANGE':
      return {
        ...state,
        dateRangeOpn: action.payload
      }
    case '@@orderRequestListView/SET_SELECTED_DATE':
      return {
        ...state,
        maxDate: action.payload.maxDate,
        minDate: action.payload.minDate
      }
    case '@@orderRequestListView/GET_SERVICE_TYPE':
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
    case '@@orderRequestListView/UPDATE_BRANCH_LIST':
      return {
        ...state,
        branchList: action.payload?.branchList?.map((branch: IBranchLookupResponse) => ({
          branchId: branch.branchId || 0,
          label: branch?.name,
          value: branch?.name,
          id: branch?.branchId,
          canonicalId: branch?.canonicalId,
          gmtoffset: branch?.gmtoffset,
          branchDescription: branch.branchDescription,
          title: branch?.name
        })),
      };
    case '@@orderRequestListView/GET_DELIVERY_STATUS':
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
    case '@@orderRequestListView/SET_APPROVE_MODAL':
      return {
        ...state,
        approveModal: action.payload
      }
    case '@@orderRequestListView/SET_REJECT_MODAL':
      return {
        ...state,
        rejectionModal: action.payload
      }
    case '@@orderRequestListView/FETCH_REJECT_REASON_LIST':
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
    case '@@orderRequestListView/FETCH_ORDER_STATUS_LIST':
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
    case '@@orderRequestListView/FETCH_PAYMENT_TYPE_LIST':
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
    case '@@orderRequestListView/GET_DELIVERY_TYPE':
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

export default OrderRequestReducer