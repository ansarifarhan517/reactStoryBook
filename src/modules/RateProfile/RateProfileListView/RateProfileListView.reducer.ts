import { IEditDetails } from '../../../utils/mongo/interfaces';
import { IMongoListViewStructure } from '../../../utils/mongo/interfaces';
import { IRateProfileListViewDataPayload } from './RateProfileListView.models';
import { RateProfileListViewActions } from './RateProfileListView.actions';

export interface IRateProfileListViewState {
  structure: IMongoListViewStructure
  data: IRateProfileListViewDataPayload
  moreResultsExists?: boolean
  viewMode: 'listview' | 'mapview'
  editDetails: IEditDetails
  lastUpdatedCell: string
  loading: {
    listView: boolean
    columns: boolean
  }

}

const initialState: IRateProfileListViewState = {
  structure: {
    columns: {},
    buttons: {}
  },
  data: {
    totalCount: 0,
    results: [{ rateProfileId: 1 }, { rateProfileId: 2 }, { rateProfileId: 3 }, { rateProfileId: 4 }]
  },
  viewMode: 'listview',
  editDetails: {},
  lastUpdatedCell: '',
  loading: {
    listView: false,
    columns: false
  }
  
}

const RateProfileListViewReducer = (state = initialState, action: RateProfileListViewActions): IRateProfileListViewState => {
  switch (action.type) {
    case '@@rateProfileListView/RESET_STATE':
      return initialState

    case '@@rateProfileListView/FETCH_STRUCTURE_SUCCESS':

      return {
        ...state,
        structure: {
          columns: { ...action.payload.columns },
          buttons: { ...action.payload.buttons }
        }
      }

    case '@@rateProfileListView/FETCH_DATA_SUCCESS':
      const results = action.payload.data.results.map((row) => {
        return row
      })
      console.log(results)

      return {
        ...state,
        data: {
          ...action.payload.data,
          results
        },
        moreResultsExists: action.payload.moreResultsExists
      }

    case '@@rateProfileListView/UPDATE_DATA':
      const { customerId: updateCustomerId, ...rest } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map(row => row.customerId === updateCustomerId ? { ...row, ...rest } : row)
        }
      }
    case '@@rateProfileListView/SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload
      }

    case '@@rateProfileListView/SET_EDIT_DETAILS':
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

    case '@@rateProfileListView/REMOVE_EDIT_DETAILS':
      const { rowId: removeRowId, columnId: removeColumnId } = action.payload
      const newState = {
        ...state
      }

      delete newState.editDetails?.[removeRowId]?.[removeColumnId]

      if (!Object.keys(newState.editDetails?.[removeRowId] || {}).length) {
        delete newState.editDetails?.[removeRowId]
      }

      return newState

    case '@@rateProfileListView/CLEAR_EDIT_DETAILS':
      return {
        ...state,
        editDetails: {}
      }

    case '@@rateProfileListView/SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload
        }
      }



    case '@@rateProfileListView/UPDATE_STATUS':
      const { customerId, status, custom } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map((row: any) => row.customerId === customerId ? { ...row, status, ...custom } : row)
        }
      }

   

    default:
      return state
  }
}



export default RateProfileListViewReducer