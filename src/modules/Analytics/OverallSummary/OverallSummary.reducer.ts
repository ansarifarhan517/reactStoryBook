import { IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import { OverallSummaryListViewActions } from "./OverallSummary.actions";
import { IOverallSummaryListViewDataPayload } from "./OverallSummary.models";

export interface IOverallSummaryListViewState {
  structure: IMongoListViewStructure;
  data: IOverallSummaryListViewDataPayload;
  loading: {
    listView: boolean;
    columns: boolean;
  };
  emptyData: boolean;
  DatePayload: any;
  tripData: any;
  orderData: any;
  delData: any;
  filterOptions: any;
  tripApiSuccess: any;
  orderApiSuccess: any;
  daApiSuccess: any;
  daGraphData: any;
}

export const dummyColumns: any = {
  clientBranchName: { label: "Client Branch Name", permission: true },
};
export const dummyResult: any = Array(15)
  .fill(0)
  .map((_, i) => ({ clientCoLoaderId: i + 1 }));

export const initialState: IOverallSummaryListViewState = {
  structure: {
    columns: dummyColumns,
    buttons: {},
  },
  data: {
    totalCount: 0,
    results: dummyResult,
  },
  loading: {
    listView: false,
    columns: false,
  },
  emptyData: false,
  DatePayload: {},
  tripData: {},
  orderData: {},
  delData: {},
  filterOptions: {
    columns: dummyColumns,
  },
  tripApiSuccess: {},
  orderApiSuccess: {},
  daApiSuccess: {},
  daGraphData: [],
};

const OverallSummaryListViewReducer = (
  state = initialState,
  action: OverallSummaryListViewActions
): IOverallSummaryListViewState => {
  switch (action.type) {
    case "@@OverallSummaryListAction/FETCH_STRUCTURE_SUCCESS": {
      return {
        ...state,
        structure: {
          columns: action.payload.columns,
          buttons: action.payload.buttons,
        },
      };
      break;
    }

    case "@@OverallSummaryListAction/FETCH_ADVANCED_FILTER_STRUCTURE_SUCCESS": {
      return {
        ...state,
        filterOptions: {
          columns: action.payload.columns,
        },
      };
      break;
    }

    case "@@OverallSummaryListAction/FETCH_DATA_SUCCESS": {
      const results = action.payload.results.map((m) => {
        let obj = {};
        return m.status === "Intransit"
          ? {
              ...m,
              ...obj,
              hasSelectionDisabled: true,
              editIconButtonProps: {
                className: "hideEditIcon",
              },
            }
          : {
              ...m,
              ...obj,
            };
      });

      return {
        ...state,
        data: {
          ...action.payload,
          results: results,
        },
      };
    }

    case "@@OverallSummaryListAction/SET_LOADING":
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload,
        },
      };

    case "@@OverallSummaryListAction/SET_COLUMNS_LOADING":
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload,
        },
      };

    case "@@OverallSummaryListAction/SET_DATES": {
      return {
        ...state,
        DatePayload: action.payload,
      };
    }

    case "@@OverallSummaryListAction/FETCH_TRIP_DATA_SUCCESS": {
      return {
        ...state,
        tripData: action.payload.data,
      };
    }

    case "@@OverallSummaryListAction/TRIP_API_SUCCESS": {
      return {
        ...state,
        tripApiSuccess: action.payload,
      };
    }

    case "@@OverallSummaryListAction/DA_API_SUCCESS": {
      return {
        ...state,
        daApiSuccess: action.payload,
      };
    }

    case "@@OverallSummaryListAction/DA_GRAPH_SUCCESS": {
      return {
        ...state,
        daGraphData: action.payload,
      };
    }

    case "@@OverallSummaryListAction/ORDER_API_SUCCESS": {
      return {
        ...state,
        orderApiSuccess: action.payload,
      };
    }

    case "@@OverallSummaryListAction/FETCH_ORDER_DATA_SUCCESS": {
      return {
        ...state,
        orderData: action.payload.data,
      };
    }

    case "@@OverallSummaryListAction/FETCH_DA_DATA_SUCCESS": {
      return {
        ...state,
        delData: action.payload.data,
      };
    }

    default:
      return state;
  }
};

export default OverallSummaryListViewReducer;
