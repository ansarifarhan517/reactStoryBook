import { IEditDetails } from './../../../utils/mongo/interfaces';
import { IMongoListViewStructure } from '../../../utils/mongo/interfaces';
import { TicketingToolListViewActions } from './TicketingToolListView.actions';



export interface ITicketingToolListViewState {
  structure: IMongoListViewStructure
  data: any
  viewMode: 'SUPPORT' | 'FEATURE'
  editDetails: IEditDetails,
  clientData: any
  loading: {
    listView: boolean,
    columns: boolean
  },
  ticketStatus: any,
  peers: any,
  selectedStatus: any
  
}
export const dummyResult: any = Array(15).fill(0).map((_, i) => ({ ticketId: i + 1 }))

const initialState: ITicketingToolListViewState = {
  structure: {
    columns: {},
    buttons: {}
  },
  data: {
    totalCount: 0,
    results: dummyResult
  },
  clientData: null,
  viewMode: 'SUPPORT',
  editDetails: {},
  loading: {
    listView: true,
    columns: true
  },
  ticketStatus: {},
  peers:[],
  selectedStatus: "ALL"
  
}

const TicketingToolListViewReducer = (state = initialState, action: TicketingToolListViewActions): ITicketingToolListViewState => {
  switch (action.type) {
      case "@@ticketingToolListView/FETCH_STRUCTURE_SUCCESS":
        return {...state,structure: action.payload};
      case "@@ticketingToolListView/FETCH_DATA_SUCCESS":
        return {...state,data:action.payload}
      case "@@ticketingToolListView/SET_CLIENT_DATA":
        return {...state,clientData:action.payload}
        case "@@ticketingToolListView/TICKET_STATUS":
          return {...state,ticketStatus:action.payload}
          case "@@ticketingToolListView/SET_VIEW_MODE":
          return {...state,viewMode:action.payload}
          case "@@ticketingToolListView/SET_PEERS":
            return {...state,peers:action.payload}
            case "@@ticketingToolListView/SET_LOADING":
              return {...state,loading:action.payload}
              case "@@ticketingToolListView/SET_SELECTED_STATUS":
                return {...state,selectedStatus:action.payload}
          
      default: 
        return state
  }
}

export default TicketingToolListViewReducer