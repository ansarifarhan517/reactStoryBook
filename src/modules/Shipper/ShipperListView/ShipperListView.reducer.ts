import { IEditDetails } from '../../../utils/mongo/interfaces';
import { tShipperListViewAcions } from './ShipperListView.actions';
import { IMongoListViewStructure } from '../../../utils/mongo/interfaces';
import { IShipperListViewDataPayload, ICustomField, IStatusList, tShipperStatus, IPriorityList, IDropdown, IRequestConversionList, IServiceAreaProfileNameList } from './ShipperListView.models';
import { renderCustomFields } from '../../../utils/mongo/ListView';
import { IFetchDataOptions, ISelectedRows } from 'ui-library'
import { INoOfUserRequest, IShipperRequest } from './SubComponent/SubComponent.models';

export interface IShipperListViewState {
  structure: IMongoListViewStructure
  data: IShipperListViewDataPayload
  viewMode: 'listview' | 'mapview'
  editDetails: IEditDetails
  loading: {
    listView: boolean
  },
  statusList: IStatusList[] | any[],
  statusMapping: any,
  rejectReasonList: IStatusList[] | any[]
  deactivationReasonList: IStatusList[] | any[]
  breadcrumbFilter: tShipperStatus
  fetchOptions: IFetchDataOptions
  selectedRows?: ISelectedRows | {}
  isEditMode: boolean
  shipperActivationRequest: IShipperRequest | undefined
  noOfUsersModal: INoOfUserRequest,
  approvalModal: boolean,
  rejectionModal: boolean,
  lastUpdatedCell: string,
  uploadModal: boolean
  userId: string | undefined
  clientId: string
  priorityList: IDropdown[]
  requestConversionList: IDropdown[]
  serviceProfileNameList: IDropdown[]
  editConfirmationModal: boolean
  isSaveClicked: boolean
  emptyData: boolean
}
export const dummyData: any = Array(6).fill(0).map((_, i) => ({ label: (i + 1).toString() }))

export const dummyResult: any = Array(15).fill(0).map((_, i) => ({ shipperDetailsId: i + 1 }))

const initialState: IShipperListViewState = {
  structure: {
    columns: dummyData,
    buttons: {}
  },
  data: {
    totalCount: 0,
    results: dummyResult
  },
  viewMode: 'listview',
  editDetails: {},
  loading: {
    listView: false
  },
  statusList: [],
  statusMapping: {},
  rejectReasonList: [],
  deactivationReasonList: [],
  breadcrumbFilter: 'ALL',
  fetchOptions: {},
  selectedRows: {},
  isEditMode: false,
  shipperActivationRequest: undefined,
  noOfUsersModal: { activeRequest: false, customClientId: undefined },
  approvalModal: false,
  rejectionModal: false,
  lastUpdatedCell: '',
  uploadModal: false,
  userId: '',
  clientId: '',
  priorityList: [],
  requestConversionList: [],
  serviceProfileNameList: [],
  editConfirmationModal: false,
  isSaveClicked: false,
  emptyData: false,
}

const ShipperAssociateReducer = (state = initialState, action: tShipperListViewAcions): IShipperListViewState => {
  switch (action.type) {
    case '@@shipperListView/RESET_INITIAL_STATE':
      return {
        ...state,
        structure: {
          columns: dummyData,
          buttons: {}
        },
        data: {
          totalCount: 0,
          results: dummyResult
        },
        editDetails: {},
        isEditMode: false,
        approvalModal: false,
        rejectionModal: false,
        editConfirmationModal: false,
        isSaveClicked: false,
        emptyData: false,
        uploadModal: false,
        noOfUsersModal: { activeRequest: false, customClientId: undefined }
      }
    case '@@shipperListView/FETCH_STRUCTURE_SUCCESS':
      const clientId = JSON.parse(localStorage.getItem('userAccessInfo') || '')?.['subClients']?.[0]?.['clientId'];
      const userIdentifier = JSON.parse(localStorage.getItem('userAccessInfo') || '')?.userId;
      const columns = action?.payload?.columns;
      const keys = Object.keys(columns);
      const newObj: any = {};
      keys.forEach((key: string) => {
        if (key === 'noOfUsers') {
          newObj.noOfUsers = columns.noOfUsers
          // newObj.noOfUsers.fieldType = 'number'
          // newObj.noOfUsers.searchable = true
        } else if (key === 'priority') {
          newObj.priority = columns.priority
          newObj.priority.fieldType = 'dropdown'
        }
        else {
          newObj[key] = columns[key];
        }
      });
      const newPayload = { ...action.payload, columns: newObj };
      return {
        ...state,
        clientId,
        userId: userIdentifier,
        structure: newPayload
      }

    case '@@shipperListView/FETCH_DATA_SUCCESS':
      const results = action.payload.results.map((row: any) => {
        const rowObj = row
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

    case '@@shipperListView/UPDATE_DATA':
      const { shipperDetailsId: updateShipperIds, ...rest } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map(row => row.shipperDetailsId === updateShipperIds ? { ...row, ...rest } : row)
        }
      }
    case '@@shipperListView/SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload
      }

    case '@@shipperListView/SET_EDIT_DETAILS':
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

    case '@@shipperListView/REMOVE_EDIT_DETAILS':
      const { rowId: removeRowId, columnId: removeColumnId } = action.payload
      const newState = {
        ...state
      }

      delete newState.editDetails?.[removeRowId]?.[removeColumnId]
      if (!Object.keys(newState.editDetails?.[removeRowId] || {}).length) {
        delete newState.editDetails?.[removeRowId]
      }

      return newState

    case '@@shipperListView/CLEAR_EDIT_DETAILS':
      return {
        ...state,
        editDetails: {}
      }

    case '@@shipperListView/SET_LOADING':
      return {
        ...state,
        loading: {
          listView: action.payload.listView
        }
      }

    case '@@shipperListView/UPDATE_STATUS':
      const { shipperDetailsId, status, custom } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map((row) => row.shipperDetailsId === shipperDetailsId ? { ...row, status, ...custom } : row)
        }
      }
    case '@@shipperListView/FETCH_STATUS_LIST':
      const statusList = action.payload.data
      const mappingObj = {}
      statusList.forEach((status: IStatusList) => {
        mappingObj[status?.clientRefMasterCd] = status.name
      })

      return {
        ...state,
        statusList,
        statusMapping: mappingObj
      }
    case '@@shipperListView/FETCH_DEACTIVATION_REASON_LIST':
      const deactivationReason = action.payload.map((reason: IStatusList) => {
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
        deactivationReasonList: deactivationReason
      }
    case '@@shipperListView/FETCH_REJECT_REASON_LIST':
      const rejectList = action.payload.map((reason: IStatusList) => {
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
    case '@@shipperListView/SET_FETCH_OPTIONS':
      return {
        ...state,
        fetchOptions: action.payload
      }
    case '@@shipperListView/SET_SELECTED_ROWS':
      return {
        ...state,
        selectedRows: action.payload
      }
    case '@@shipperListView/SET_IS_EDITABLE':
      return {
        ...state,
        isEditMode: action.payload
      }
    case '@@shipperListView/SET_SHIPPER_ACTIVATION':
      return {
        ...state,
        shipperActivationRequest: action.payload
      }
    case '@@shipperListView/SET_NO_OF_USERS_MODAL':
      return {
        ...state,
        noOfUsersModal: action.payload
      }
    case '@@shipperListView/SET_APPROVAL_MODAL':
      return {
        ...state,
        approvalModal: action.payload
      }
    case '@@shipperListView/SET_REJECT_MODAL':
      return {
        ...state,
        rejectionModal: action.payload
      }
    case '@@shipperListView/SET_BREADCRUMB_FILTER':
      return {
        ...state,
        breadcrumbFilter: action.payload
      }
    case '@@shipperListView/SET_UPLOAD_MODAL':
      return {
        ...state,
        uploadModal: action.payload
      }
    case '@@shipperListView/FETCH_PRIORITY_LIST':
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
    case '@@shipperListView/FETCH_REQUEST_CONVERSION_LIST':
      const requestConversionList = action.payload
      const newReqConList = requestConversionList.map((requestConversion: IRequestConversionList) => {
        return {
          id: requestConversion?.clientRefMasterId,
          label: requestConversion?.clientRefMasterDesc,
          value: requestConversion?.clientRefMasterCd,
          type: requestConversion?.clientRefMasterType,
        }
      })
      return {
        ...state,
        requestConversionList: newReqConList
      }
      case '@@shipperListView/FETCH_SERVICE_AREA_NAME_LIST':
      const servAreaProfNameList = action.payload
      const newSAProfNameList = servAreaProfNameList.map((saProfNameEach: IServiceAreaProfileNameList) => {
        return {
          id: saProfNameEach?.serviceAreaProfileId,
          label: saProfNameEach?.serviceAreaProfileName,
          value: saProfNameEach?.serviceAreaProfileName,
          type: saProfNameEach?.serviceAreaProfileName,
        }
      })
      return {
        ...state,
        serviceProfileNameList: newSAProfNameList
      }
    case '@@shipperListView/SET_EDIT_CONFIRMATION_MODAL':
      return {
        ...state,
        editConfirmationModal: action.payload
      }
    case '@@shipperListView/SET_IS_SAVE_CLICKED':
      return {
        ...state,
        isSaveClicked: action.payload
      }
    case '@@shipperListView/SET_EMPTY_DATA': {
      return {
        ...state,
        emptyData: action.payload
      }
    }
    default:
      return state
  }
}

export default ShipperAssociateReducer