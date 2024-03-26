import { IEditDetails } from '../../../utils/mongo/interfaces';
import { IMongoListViewStructure } from '../../../utils/mongo/interfaces';
import { IListViewDataPayload,IEditTypeRequest } from './PlanningListView.model';
import { TripPlanningScheduler } from './PlanningListView.actions';
export interface IPlanningListViewState {
  structure: IMongoListViewStructure
  data: IListViewDataPayload
  moreResultsExists?: boolean
  editDetails: IEditDetails
  lastUpdatedCell: string
  loading: boolean
  editActiveInactiveDetails:IEditTypeRequest
  showConfimationModal:boolean
  showDeleteModal:boolean
}

const initialState: IPlanningListViewState = {
  structure: {
    columns: {},
    buttons: {}
  },
  data: {
    totalCount: 4,
    results:
     [
         { schedulerDetailsId: 1 }, { schedulerDetailsId: 2 }, { schedulerDetailsId: 3 }, { schedulerDetailsId: 4 }
     ]
  },
  editDetails: {},
  lastUpdatedCell: '',
  loading: false,
  editActiveInactiveDetails:{},
  showConfimationModal:false,
  showDeleteModal:false
}

const TripPlanningListViewReducer = (state = initialState, action: TripPlanningScheduler): IPlanningListViewState => {
  switch (action.type) {
   
    case '@@planningListView/FETCH_STRUCTURE_SUCCESS':
   
      return {
        ...state,
        structure: {
          columns: { ...action.payload.columns },
          buttons: { ...action.payload.buttons }
        }
      }

    case '@@planningListView/FETCH_DATA_SUCCESS':
      const results = action.payload.data.results.map((row) => {
        return {...row, status: row.isActiveFl}
      })
      console.log("results",results)

      return {
        ...state,
        data: {
          ...action.payload.data,
          results
        },
        moreResultsExists: action.payload.moreResultsExists
      }

    case '@@planningListView/UPDATE_DATA':
     console.log("action.payload", action.payload)
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map(row =>  row)
        }
      }
    
    case '@@planningListView/SET_UPDATE_ACTIVE_INACTIVE_DETAILS':
      return {
        ...state,
        editActiveInactiveDetails:{
          ...action.payload
        }
      }
    case '@@planningListView/SHOW_ACTIVE_CONFIRMATION_MODAL':
      return {
        ...state,
        showConfimationModal:action.payload
      }  
    // case '@@planningListView/SET_VIEW_MODE':
    //   return {
    //     ...state,
    //     viewMode: action.payload
    //   }

    // case '@@planningListView/SET_EDIT_DETAILS':
    //   const { rowId, columnId, value, hasError } = action.payload
    //   return {
    //     ...state,
    //     lastUpdatedCell: `${rowId}-${columnId}`,
    //     editDetails: {
    //       ...state.editDetails,
    //       [rowId]: {
    //         ...state.editDetails?.[rowId],
    //         [columnId]: {
    //           value,
    //           hasError
    //         }
    //       }
    //     }
    //   }

    // case '@@planningListView/REMOVE_EDIT_DETAILS':
    //   const { rowId: removeRowId, columnId: removeColumnId } = action.payload
    //   const newState = {
    //     ...state
    //   }

    //   delete newState.editDetails?.[removeRowId]?.[removeColumnId]

    //   if (!Object.keys(newState.editDetails?.[removeRowId] || {}).length) {
    //     delete newState.editDetails?.[removeRowId]
    //   }

    //   return newState

    // case '@@planningListView/CLEAR_EDIT_DETAILS':
    //   return {
    //     ...state,
    //     editDetails: {}
    //   }

    case '@@planningListView/SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }



    // case '@@planningListView/UPDATE_STATUS':
    //   const { customerId, status, custom } = action.payload
    //   return {
    //     ...state,
    //     data: {
    //       ...state.data,
    //       results: state.data.results.map((row: any) => row.customerId === customerId ? { ...row, status, ...custom } : row)
    //     }
    //   }

   

    default:
      return state
  }
}



export default TripPlanningListViewReducer