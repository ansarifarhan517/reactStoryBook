import { IEditDetails } from '../../../utils/mongo/interfaces';
import { IMongoListViewStructure } from '../../../utils/mongo/interfaces';
import { ICustomerListViewDataPayload, INotifyDropdown, INotifyDynamicTagsStructureOptions } from './CustomerListView.models';
import { CustomerListViewActions } from './CustomerListView.actions';

export interface ICustomerListViewState {
  structure: IMongoListViewStructure
  data: ICustomerListViewDataPayload
  moreResultsExists?: boolean
  viewMode: 'listview' | 'mapview'
  editDetails: IEditDetails
  lastUpdatedCell: string
  loading: {
    listView: boolean
    columns: boolean
  }
  notifyType: INotifyDropdown[]
  notifyTypeDynamicTags: INotifyDynamicTagsStructureOptions[]

}

const initialState: ICustomerListViewState = {
  structure: {
    columns: {},
    buttons: {}
  },
  data: {
    totalCount: 0,
    results: [{ customerId: 1 }, { customerId: 2 }, { customerId: 3 }, { customerId: 4 }]
  },
  viewMode: 'listview',
  editDetails: {},
  lastUpdatedCell: '',
  loading: {
    listView: false,
    columns: false
  },
  notifyType: [],
  notifyTypeDynamicTags: [],
}

const CustomerListViewReducer = (state = initialState, action: CustomerListViewActions): ICustomerListViewState => {
  switch (action.type) {
    case '@@customerListView/RESET_STATE':
      return initialState

    case '@@customerListView/FETCH_STRUCTURE_SUCCESS':

      let manipulatedStructure = action.payload.columns
      if (manipulatedStructure.nodeCount) {
        manipulatedStructure.nodeCount.searchable = true;
        manipulatedStructure.nodeCount.fieldType = 'customfieldnodecount'
      }

      return {
        ...state,
        structure: {
          columns: { ...manipulatedStructure },
          buttons: { ...action.payload.buttons }
        }
      }

    case '@@customerListView/UPDATE_DATA':
      const { customerId: updateCustomerId, ...rest } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map(row => row.customerId === updateCustomerId ? { ...row, ...rest } : row)
        }
      }
    case '@@customerListView/SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload
      }

    case '@@customerListView/SET_EDIT_DETAILS':
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

    case '@@customerListView/REMOVE_EDIT_DETAILS':
      const { rowId: removeRowId, columnId: removeColumnId } = action.payload
      const newState = {
        ...state
      }

      delete newState.editDetails?.[removeRowId]?.[removeColumnId]

      if (!Object.keys(newState.editDetails?.[removeRowId] || {}).length) {
        delete newState.editDetails?.[removeRowId]
      }

      return newState

    case '@@customerListView/CLEAR_EDIT_DETAILS':
      return {
        ...state,
        editDetails: {}
      }

    case '@@customerListView/SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload
        }
      }



    case '@@customerListView/UPDATE_STATUS':
      const { customerId, status, custom } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map((row: any) => row.customerId === customerId ? { ...row, status, ...custom } : row)
        }
      }

    case '@@customerListView/SET_NOTIFY_TYPE':
      const newPayload = action.payload.map((a: any) => {
        return {
          ...a,
          value: a.id,
          label: a.name
        }
      })
      return {
        ...state,
        notifyType: newPayload
      }


    case '@@customerListView/SET_NOTIFY_TYPE_DYNAMIC_TAGS':

      return {
        ...state,
        notifyTypeDynamicTags: action.payload.map((a: any) => {
          return {
            id: a?.key,
            text: a?.labelValue,
            value: a?.key?.substring(1, a?.key?.length - 1),
            url: '#'
          }
        })
      }


    default:
      return state
  }
}



export default CustomerListViewReducer