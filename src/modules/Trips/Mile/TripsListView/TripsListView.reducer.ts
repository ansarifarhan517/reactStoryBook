import { ITripsListMileState, tTripsListMileBreadcrumbFilter } from './TripsListView.model';
import { tTripsListMileActions } from './TripsListView.actions';
import moment from 'moment-timezone'
import { getGoogleAPIKey } from '../../../../utils/components/Map/MapHelper';




export const dummyData: any = Array(20).fill(0).map((_, i) => ({ label: (i + 1).toString() }))
export const dummyResult: any = Array(15).fill(0).map((_, i) => ({ tripId: i + 1 }))
const currentDate = new Date()
const initialState: ITripsListMileState = {
  viewMode: 'listview',
  breadcrumbFilter: 'allTrips',
  from: moment(currentDate).subtract(7, 'days').startOf("day").toDate(),
  to: moment(currentDate).endOf('day').toDate(),
  listParams: {
    from: '',
    to: ''
  },
  loading: {
    tableGrid: false,
    columnList: false,
    map: false
  },
  googleAPIKey: getGoogleAPIKey(),
  apiResponse: {
    data: {
      data: {
        clientBranchId: 0,
        otherCount: 0,
        results: [
          {
            milkRun: 'DEFAULT',
            trips: dummyResult
          }
        ],
        totalCount: 0

      },
      message: 'Success',
      moreResultsExists: false,
      status: 200
    }
  },
  data: dummyResult,
  structure: {
    buttons: {
    },
    columns: dummyData
  },
  totalRows: 0,
  filters: {
    pageNumber: 1,
    pageSize: 50,
    endDateFilter: moment(currentDate).utc().format("YYYY-MM-DD HH:mm:ss"),
    endDateFilterNonUTC: moment(currentDate).format("YYYY-MM-DD HH:mm:ss"),
    startDateFilter: moment(currentDate).subtract(7, 'days').utc().format("YYYY-MM-DD HH:mm:ss"),
    startDateFilterNonUTC: moment(currentDate).subtract(7, 'days').format("YYYY-MM-DD HH:mm:ss"),
    status: 'ALL'
  },
  selectedRows: {},
  editDetails: {},
  lastUpdatedCell: '',
  dropdownMapping: {
    tripStatus: [{
      id: 'STARTED',
      label: 'Started',
      value: 'STARTED'
    }, {
      id: 'ENDED',
      label: 'Ended',
      value: 'ENDED'
    }, {
      id: 'NOTSTARTED',
      label: 'Not Started',
      value: 'NOTSTARTED'
    }],
    deliveryAssociateName: []
  },
  // advanced filter
  fetchOptions: {},
  printDrs:{
    templates:[],
    isModalOpen: false
  }

}

const TripsListMileReducer = (state: ITripsListMileState = initialState, action: tTripsListMileActions) => {
  switch (action.type) {
    case '@@tripsListViewMile/SET_VIEW_MODE':
      return { ...state, viewMode: action.payload }

    case '@@tripsListViewMile/SET_BREADCRUMB_FILTER':
      return { ...state, breadcrumbFilter: action.payload }

    case '@@tripsListViewMile/SET_DATERANGE_FILTER':
      return { ...state, from: action.payload.from, to: action.payload.to }

    case '@@tripsListViewMile/UPDATE_LIST_PARAMS':
      return { ...state, listParams: { ...state.listParams, ...action.payload } }

    case '@@tripsListViewMile/SET_GOOGLE_API':
      return { ...state, googleApiKey: action.payload }

    case '@@tripsListViewMile/SET_DATA_FROM_API':
      return { ...state, apiResponse: { ...state.apiResponse, data: { ...state.apiResponse.data, ...action.payload } } }

    case '@@tripsListViewMile/SET_DATA':
      return { ...state, data: [...action.payload] }

    case '@@tripsListViewMile/SET_STRUCTURE':
      const columns = action?.payload?.columns;
      
      const keys = Object.keys(columns);
      const newObj: any = {};
      
      keys.forEach((key: string) => {
        if (key === 'UtilizedCapacity') {
          const utilizedCapacity = columns['UtilizedCapacity']?.childNodes as any;
          newObj.utilizedCapacityInUnits = utilizedCapacity['utilizedCapacityInUnits'];
          newObj.utilizedCapacityInUnits.label = `${columns['UtilizedCapacity'].label} ${utilizedCapacity['utilizedCapacityInUnits'].label}`;
          newObj.utilizedCapacityInUnits.fieldType = 'number'

          newObj.utilizedCapacityInVolume = utilizedCapacity['utilizedCapacityInVolume'];
          newObj.utilizedCapacityInVolume.label = `${columns['UtilizedCapacity'].label} ${utilizedCapacity['utilizedCapacityInVolume'].label}`;
          newObj.utilizedCapacityInVolume.fieldType = 'number'

          newObj.utilizedCapacityInWeight = utilizedCapacity['utilizedCapacityInWeight'];
          newObj.utilizedCapacityInWeight.label = `${columns['UtilizedCapacity'].label} ${utilizedCapacity['utilizedCapacityInWeight'].label}`;
          newObj.utilizedCapacityInWeight.fieldType = 'number'
        } else if (key === 'capacity') {
          const capacityChild = columns['capacity']?.childNodes as any;
          newObj.weightCapacity = capacityChild["weightCapacity"];
          newObj.weightCapacity.label = `${columns['capacity'].label} ${capacityChild["weightCapacity"].label}`;
          newObj.weightCapacity.fieldType = 'number'

          newObj.unitsCapacity = capacityChild['unitsCapacity'];
          newObj.unitsCapacity.label = `${columns['capacity'].label} ${capacityChild['unitsCapacity'].label}`;
          newObj.unitsCapacity.fieldType = 'number'

          newObj.volumeCapacity = capacityChild["volumeCapacity"];
          newObj.volumeCapacity.label = `${columns['capacity'].label} ${capacityChild["volumeCapacity"].label}`;
          newObj.volumeCapacity.fieldType = 'number'
        } 
        else if (key === 'plan') {
          const planChild = columns['plan']?.childNodes as any; 
          if(state.breadcrumbFilter == "started")
          {
            newObj.estimatedTime = planChild["estimatedTime"];
            newObj.estimatedDistance = planChild["estimatedDistance"]; 
          }
          else if(state.breadcrumbFilter == "ended")
          {
            newObj.actualTime = planChild["actualTime"];
            newObj.actualDistance = planChild["actualDistance"];
          }
          
        }
        else {
          newObj[key] = columns[key];
        }
      });
      
      const newBtn = {}
      const btnSequence = ['startTrip', 'stopTrip', 'showdrs', 'printMultiDrs', 'update', 'delete', 'reviseETA']

      btnSequence.forEach((btn: string) => {
        if (action?.payload?.buttons?.[btn]) {
          newBtn[btn] = action?.payload?.buttons?.[btn]
        }
      })
      const newPayload = { ...action.payload, columns: newObj, buttons: newBtn };
      return { ...state, structure: newPayload }

    case '@@tripsListViewMile/SET_DATA_COUNT':
      return { ...state, totalRows: action.payload }

    case '@@tripsListViewMile/SET_DATA_FILTER':
      return { ...state, filters: action.payload }

    case '@@tripsListViewMile/SET_LOADING':
      return { ...state, loading: { ...state.loading, ...action.payload } }


    case '@@tripsListViewMile/SET_SELECTED_TRIP_ROWS':
      return { ...state, selectedRows: { ...action.payload } }

    case '@@tripsListViewMile/SET_EDIT_DETAILS': {
      const { rowId, columnId, value, hasError } = action.payload;
      return {
        ...state,
        lastUpdatedCell: `${rowId}-${columnId}`,
        editDetails: {
          ...state.editDetails,
          [rowId]: {
            ...state.editDetails?.[rowId],
            [columnId]: {
              value,
              hasError,
            },
          },
        },
      };
    }

    case '@@tripsListViewMile/CLEAR_EDIT_DETAILS':
      return { ...state, editDetails: {} }

    case '@@tripsListViewMile/REMOVE_EDIT_DETAILS':
      const { rowId: removeRowId, columnId: removeColumnId } = action.payload;
      const newState = {
        ...state,
      };
      delete newState.editDetails?.[removeRowId]?.[removeColumnId];
      if (!Object.keys(newState.editDetails?.[removeRowId] || {}).length) {
        delete newState.editDetails?.[removeRowId];
      }
      return newState;

    case '@@tripsListViewMile/SET_FLEETDETAILS_DROPDOWN': {
      return { ...state, dropdownMapping: { ...state.dropdownMapping, ...action.payload } }
    }

    case '@@tripsListViewMile/SET_AVAILABLE_FLEETDETAILS_DROPDOWN': {
      return { ...state, dropdownMapping: { ...state.dropdownMapping, ...action.payload } }
    }
    //adavanced filter

    case '@@tripsListViewMile/SET_FETCH_OPTIONS':
      return {
        ...state,
        fetchOptions: action.payload
      }

    // PRINT DRS
      case '@@tripsListViewMile/SET_DRS_MODAL_OPEN': 
        return{
          ...state,
          printDrs: {
            ...state.printDrs,
            isModalOpen: action.payload
          }
        }
      
        case '@@tripsListViewMile/FETCH_DRS_HTML_TEMPLATES_SUCCESS': 
          return {
            ...state,
            printDrs: {
              ...state.printDrs,
              templates: action.payload
            }
          }
      

    default:
      return state
  }
}

export default TripsListMileReducer