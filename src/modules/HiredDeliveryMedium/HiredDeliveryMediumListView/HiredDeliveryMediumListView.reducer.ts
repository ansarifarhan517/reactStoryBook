import { IEditDetails } from '../../../utils/mongo/interfaces';
import { HiredDeliveryMediumListViewActions } from './HiredDeliveryMediumListView.actions';
import { tBreadcrumbState, IBranchName, IClientMetricSystem, ICustomField } from './HiredDeliveryMediumListView.models';

export interface IHiredDeliveryMediumListViewState {
  viewMode: 'listview' | 'mapview';
  editDetails: IEditDetails;
  loading: {
    listView: boolean;
    columns: boolean;
  };
  inTransitMessage: string
  emptyData: boolean,
  breadcrumbState: tBreadcrumbState
  branchName: IBranchName[] | undefined
  googleApiKey: string
  clientMetric: IClientMetricSystem[]
  HDMPayload: object
  DatePayload: object
}


export const initialState: IHiredDeliveryMediumListViewState = {
  emptyData: false,
  viewMode: 'listview',
  editDetails: {},
  loading: {
    listView: false,
    columns: false,
  },
  inTransitMessage: '',
  breadcrumbState: 'All',
  branchName: undefined,
  googleApiKey: '',
  clientMetric: [],
  HDMPayload:{},
  DatePayload : {}

};


const HiredDeliveryMediumListViewReducer = (state = initialState, action: HiredDeliveryMediumListViewActions): IHiredDeliveryMediumListViewState => {
  
  switch (action.type) {
    case '@@hiredDeliveryMediumListView/SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload,
      };

    case '@@hiredDeliveryMediumListView/SET_EDIT_DETAILS': {
      const { rowId, columnId, value, hasError } = action.payload;
      return {
        ...state,
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
    
   

    case '@@hiredDeliveryMediumListView/REMOVE_EDIT_DETAILS': {
      const { rowId: removeRowId, columnId: removeColumnId } = action.payload;
      const newState = {
        ...state,
      };

      delete newState.editDetails?.[removeRowId]?.[removeColumnId];
      if (!Object.keys(newState.editDetails?.[removeRowId] || {}).length) {
        delete newState.editDetails?.[removeRowId];
      }

      return newState;
    }

    case '@@hiredDeliveryMediumListView/CLEAR_EDIT_DETAILS':
      return {
        ...state,
        editDetails: {},
      };

    case '@@hiredDeliveryMediumListView/SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload,
        },
      };

    case '@@hiredDeliveryMediumListView/SET_COLUMNS_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload,
        },
      };


    case '@@hiredDeliveryMediumListView/SET_INITIAL_STATE': {
      return {
        ...initialState
      }
    }

    case '@@hiredDeliveryMediumListView/SET_BRANCH_NAME': {
      let data = action.payload
      data.forEach(b => {
        b['value'] = b['name']
        b['label'] = b['name']
        b['branchId'] && delete b['branchId']
        b['name'] && delete b['name']
      })
      return {
        ...state,
        branchName: data
      }
    }


    case '@@hiredDeliveryMediumListView/SEND_DA_DATA' : {
      return {
        ...state,
        HDMPayload: action.payload
      }
    }

    case '@@hiredDeliveryMediumListView/SET_DATES' : {
      return {
        ...state,
        DatePayload: action.payload
      }
    }

   
    default:
      return state;
  }
};

export default HiredDeliveryMediumListViewReducer;
