import { IEditDetails } from './../../../utils/mongo/interfaces';
import { DriverListViewActions } from './DriverListView.actions';
import { IMongoListViewStructure } from '../../../utils/mongo/interfaces';
import { IDriverListViewDataPayload, ICustomField } from './DriverListView.models';
import { renderCustomFields } from '../../../utils/mongo/ListView';

export interface IDriverListViewState {
  structure: IMongoListViewStructure
  data: IDriverListViewDataPayload
  viewMode: 'listview' | 'mapview'
  editDetails: IEditDetails
  lastUpdatedCell: string
  loading: {
    listView: boolean
  }
  inputVal:boolean
}

const initialState: IDriverListViewState = {
  structure: {
    columns: {},
    buttons: {}
  },
  data: {
    totalCount: 0,
    results: [{ driverId: 1 }, { driverId: 2 }, { driverId: 3 }, { driverId: 4 }]
  },
  viewMode: 'listview',
  editDetails: {},
  lastUpdatedCell: '',
  loading: {
    listView: false
  },
  inputVal: false
}

const DriverListViewReducer = (state = initialState, action: DriverListViewActions): IDriverListViewState => {
  switch (action.type) {
    case '@@driverListView/RESET_STATE':
      return initialState

    case '@@driverListView/FETCH_STRUCTURE_SUCCESS':
      return {
        ...state,
        structure: action.payload
      }

    case '@@driverListView/FETCH_DATA_SUCCESS':
      const results = action.payload.results.map((row) => {
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

    case '@@driverListView/UPDATE_DATA':
      const { driverId: updateDriverId, ...rest } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map(row => row.driverId === updateDriverId ? { ...row, ...rest } : row)
        }
      }
    case '@@driverListView/SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload
      }

    case '@@driverListView/SET_EDIT_DETAILS':
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

    case '@@driverListView/REMOVE_EDIT_DETAILS':
      const { rowId: removeRowId, columnId: removeColumnId } = action.payload
      const newState = {
        ...state
      }

      delete newState.editDetails?.[removeRowId]?.[removeColumnId]
      if (!Object.keys(newState.editDetails?.[removeRowId] || {}).length) {
        delete newState.editDetails?.[removeRowId]
      }

      return newState

    case '@@driverListView/CLEAR_EDIT_DETAILS':
      return {
        ...state,
        editDetails: {}
      }

    case '@@driverListView/SET_LOADING':
      return {
        ...state,
        loading: {
          listView:action.payload.listView
        },
        inputVal: action.payload.inputVal
      }

    case '@@driverListView/UPDATE_STATUS':
      const { driverId, status, custom } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map((row) => row.driverId === driverId ? { ...row, status, ...custom } : row)
        }
      }
    default:
      return state
  }
}

export default DriverListViewReducer