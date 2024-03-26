import { IEditDetails } from './../../../utils/mongo/interfaces';
import { CarrierListViewActions } from './CarrierListView.actions';
import { IMongoListViewStructure, ICustomFieldsEntity } from '../../../utils/mongo/interfaces';
import { ICarrierListViewDataPayload } from './CarrierListView.models';
import { renderCustomFields } from './../../../utils/mongo/ListView';


export interface ICarrierListViewState {
  structure: IMongoListViewStructure
  branchStructure: IMongoListViewStructure
  data: ICarrierListViewDataPayload,
  branchData: ICarrierListViewDataPayload,
  viewMode: 'listview' | 'mapview'
  editDetails: IEditDetails
  lastUpdatedCell: string
  loading: {
    listView: boolean
  }
}

export const dummyColumns: any = {
  coLoaderName: { label: "Carrier Name", permission: true },
  shortName: { label: "Carrier Code", permission: true },
  address: { label: "Address", permission: true },
  adminContactName: { label: "Admin Name", permission: true },
  mobileNumber: { label: "Contact Person Phone", permission: true },
  emailAddress: { label: "Email Id", permission: true },
  linkedBranchCount: { label: "Hub", permission: true },
  gstNumber: { label: "GST Number", permission: true },
  billingContactName: { label: "Billing Contact Name", permission: true },
  companyRegistrationNumber: { label: "Company Registration Number", permission: true },
  isActiveFl: { label: "Active / Inactive", permission: true }
}
export const dummyResult: any = Array(15).fill(0).map((_, i) => ({ clientCoLoaderId: i + 1 }))

const initialState: ICarrierListViewState = {
  structure: {
    columns: dummyColumns,
    buttons: {}
  },
  branchStructure: {
    columns: {},
    buttons: {}
  },
  data: {
    totalCount: 0,
    results: dummyResult
  },
  branchData: {
    totalCount: 0,
    results: []
  },
  viewMode: 'listview',
  editDetails: {},
  lastUpdatedCell: '',
  loading: {
    listView: false
  }
}

const CarrierListViewReducer = (state = initialState, action: CarrierListViewActions): ICarrierListViewState => {
  switch (action.type) {
    case '@@carrierListView/FETCH_STRUCTURE_SUCCESS':
      const obj = {...action.payload}
      if(obj?.columns?.emailAddress?.fieldType) {
        obj.columns.emailAddress.fieldType = 'text'
      }
      if(obj?.columns?.mobileNumber?.fieldType) {
        obj.columns.mobileNumber.fieldType = 'number'
      }

      return {
        ...state,
        structure: obj
      }

    case '@@carrierListView/FETCH_DATA_SUCCESS':
      let results = action.payload.results.map((row) => {
        const rowObj = row
        return rowObj
      })

      return {
        ...state,
        data: {
          ...action.payload,
          results
        }
      }

    case '@@carrierListView/UPDATE_DATA':
      const { clientCoLoaderId: updatecarrierId, ...rest } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map(row => row.clientCoLoaderId === updatecarrierId ? { ...row, ...rest } : row)
        }
      }
    case '@@carrierListView/SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload
      }

    case '@@carrierListView/SET_EDIT_DETAILS':
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

    case '@@carrierListView/REMOVE_EDIT_DETAILS':
      const { rowId: removeRowId, columnId: removeColumnId } = action.payload
      const newState = {
        ...state
      }

      delete newState.editDetails?.[removeRowId]?.[removeColumnId]
      if (!Object.keys(newState.editDetails?.[removeRowId] || {}).length) {
        delete newState.editDetails?.[removeRowId]
      }

      return newState

    case '@@carrierListView/CLEAR_EDIT_DETAILS':
      return {
        ...state,
        editDetails: {}
      }

    case '@@carrierListView/SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload
        }
      }

    case '@@carrierListView/UPDATE_STATUS':
      const { clientCoLoaderId, status, custom } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map((row) => row.clientCoLoaderId === clientCoLoaderId ? { ...row, status, ...custom } : row)
        }
      }
    case '@@carrierListView/FETCH_BRANCH_STRUCTURE_SUCCESS':
      return {
        ...state,
        branchStructure: action.payload
      }
    case '@@carrierListView/FETCH_BRANCH_DATA_SUCCESS':
      const data = action.payload.results.map((row) => {
        const rowObj = row
        if (row.customFieldsJSONString) {
          const customFieldsEntity: ICustomFieldsEntity[] = JSON.parse(row.customFieldsJSONString)
          customFieldsEntity.forEach((customField) => {
            const { field } = customField
            rowObj[field] = renderCustomFields(customField, state.structure.columns?.[field], action.payload.clientProperties || {})
          })
        }

        return rowObj
      })
      return {
        ...state,
        branchData: {
          ...action.payload,
          results: data
        }
      }
    default:
      return state
  }
}

export default CarrierListViewReducer