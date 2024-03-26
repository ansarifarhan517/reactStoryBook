import moment from "moment";
import { IEditDetails, IMongoListViewStructure } from "../../utils/mongo/interfaces";
import { breachPortalListViewActions } from "./breachportalListview.action";





export interface IbreachPortalListViewState {
  from: Date
  to: Date,
  
  structure: IMongoListViewStructure
 
  results: any
  viewMode: 'LIST' 
  editDetails: IEditDetails,
  clientData: any
  loading: {
    listView: boolean,
    columns: boolean
  },
  ticketStatus: any,
  peers: any,
  selectedStatus: any
  totalRows: number,
  setDisableNext : boolean
}


export const dummyResult: any = Array(15).fill(0).map((_, i) => ({ issueId: i + 1 }))

const currentDate = new Date()
const initialState: IbreachPortalListViewState = {
  from: moment(currentDate).subtract(7, 'days').startOf("day").toDate(),
  to: moment(currentDate).endOf('day').toDate(),
 
  structure: {
    columns: {},
    buttons: {}
  },
  results: dummyResult,
  clientData: null,
  viewMode: 'LIST',
  editDetails: {},
  loading: {
    listView: true,
    columns: true
  },
  ticketStatus: {},
  peers: [],
  selectedStatus: "ALL",
  totalRows: 0,
  setDisableNext : false
}

const breachPortalListViewReducer = (state = initialState, action: breachPortalListViewActions): IbreachPortalListViewState => {
  switch (action.type) {
      case "@@breachPortalListView/FETCH_STRUCTURE_SUCCESS":
        return {...state,structure: action.payload,
          loading: {
            listView: true,
            columns: false
          },
      };
      case "@@breachPortalListView/FETCH_DATA_SUCCESS":
        return {...state,  results: action.payload.results, totalRows: action.payload.totalCount,
          loading: {
            columns: false,
            listView: false
          },
        }
      case "@@breachPortalListView/SET_CLIENT_DATA":
        return {...state,clientData:action.payload}

      case "@@breachPortalListView/SET_LOADING":
        return {...state,loading:action.payload?.value}
      case '@@breachPortalListView/SET_DATERANGE_FILTER':
        return { ...state, from: action.payload.from, to: action.payload.to }

        case '@@breachPortalListView/SET_DISABLE_NEXT' :
          return {
            ...state,
            setDisableNext : action.payload
          }
          
      default: 
        return state
  }
}

export default breachPortalListViewReducer
