import { IMongoColumnOnlyStructure, IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import { IBonusesListActions } from "./BonusesList.actions";
import { tPageViewType } from "./BonusesList.model";

export interface IBonusesListState {
  loading: {
    structure: boolean;
    data: boolean;
  };
  data: {
    totalCount: number;
    results: Array<any>;
  };
  structure: IMongoListViewStructure;
  viewMode: tPageViewType;
  isListViewEmpty: boolean;

  // If you have modal list view than only make below state
  modalListViewStructure: IMongoColumnOnlyStructure;
}

export const dummyColumns: any = {
  code: {label: "Code",permission: true},
  name: {label: "Name", permission: true},
  description: {label: "Description",permission: true},
  startDate: {label: "Start Date",permission: true},
  endDate: {label: "End Date", permission: true},
  isActiveFl: {label: "Active / Inactive",permission: true},
  daMappedCount: {label: "Delivery Associates",permission: true},
}

export const dummyResult: any = Array(15).fill(0).map((_, i) => ({xyz: i + 1 }))

const initialState: IBonusesListState = {
  loading: {
    structure: true,
    data: true,
  },
  structure: {
    buttons: {},
    columns: dummyColumns,
  },
  data: {
    totalCount: -1,
    results: dummyResult,
  },
  viewMode: "listview",
  isListViewEmpty: false,

  // If you have modal list view than only make below state
  modalListViewStructure: {
    columns: {}
  }
};

export const BonusesListReducer = (
  state = initialState,
  action: IBonusesListActions
) => {
  switch (action.type) {
    case "@@bonuses/SET_LISTVIEW_LOADING":
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value,
        },
      };


    case "@@bonuses/SET_LISTVIEW_DATA":
      return {
        ...state,
        data: {
          ...state.data,
          results: action.payload.results,
          totalCount: action.payload.totalCount
        },
      };

    case "@@bonuses/SET_LISTVIEW_STRUCTURE":
      return {
        ...state,
        structure: action.payload,
      };

    case "@@bonuses/RESET_TO_INITIALSTATE":
      return initialState;

    // Include this aciton only if you have modal list view in your listView
    case "@@bonuses/SET_MODAL_LISTVIEW_STRUCTURE":
      return {
        ...state,
        modalListViewStructure: action.payload,
      };

    case "@@bonuses/SET_IS_LIST_EMPTY":
      return {
        ...state,
        isListViewEmpty: action.payload
      }

    default:
      return state;
  }
};
