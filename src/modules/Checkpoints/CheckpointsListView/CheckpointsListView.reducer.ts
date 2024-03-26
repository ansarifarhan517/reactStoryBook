import {
  IMongoColumnOnlyStructure,
  IMongoListViewStructure,
} from "../../../utils/mongo/interfaces";
import { IFilterData, IFilters } from "../../common/AdvancedSearch/interface";
import { CheckpointsListViewActions } from "./CheckpointsListView.actions";
import {
  ICheckpointCodes,
  ICheckpointsListDataPayload,
  ICheckpointsMappedRoutesListData,
  IMappedCheckpointCodes,
} from "./CheckpointsListView.models";
import { IFetchDataOptions } from 'ui-library'

export interface ICheckpointsListViewState {
  structure: IMongoListViewStructure;
  loading: {
    listView: boolean;
    columns: boolean;
  };
  data: ICheckpointsListDataPayload;
  isLoading: boolean;
  totalRows: number;
  isCheckpointEditable: boolean;
  viewMode: "listview" | "mapview";
  uploadModal: boolean;
  modalListViewStructure: IMongoColumnOnlyStructure;
  categoryList: any[];
  isModalOpen: boolean;
  checkpointsMappedToRoutesModal: boolean;
  checkpointsMappedRoutesListStructure: IMongoColumnOnlyStructure;
  checkpointsMappedRoutesListData: ICheckpointsMappedRoutesListData;
  checkpointCodes: Array<ICheckpointCodes>
  linkedCheckpointData: Array<Array<IMappedCheckpointCodes>>
  appliedAdvancedFilterData: IFilters[]
  advancedFilterData: IFilterData[]
  filterListPayload: any
  currentFilter: IFilterData | undefined
  advancedFilterDropdown: any
  advancedFilterOperations: any
  openAdvFilter: boolean
  firstLoad: boolean
  advFilterLoader: boolean
  fetchOptions: IFetchDataOptions
  rowIds: Array<number>
}

export const listColumns: any = {
  category: { label: "Category", permission: true },
  name: { label: "Name", permission: true },
  latitude: { label: "Latitude", permission: true },
  longitude: { label: "Longitude", permission: true },
  radius: { label: "Radius", permission: true },
  status: { label: "Status", permission: true },
  enabledForDA: { label: "Enabled for DA", permission: true },
  tracker: { label: "Tracker", Tracker: true },
  routes: { label: "Routes", Routes: true },
};

export const listResult: any = Array(15)
  .fill(0)
  .map((_, i) => ({ checkpointId: i + 1 }));

const initialState: ICheckpointsListViewState = {
  structure: {
    columns: listColumns,
    buttons: {},
  },
  loading: {
    listView: false,
    columns: false,
  },
  data: {
    totalCount: 0,
    results: listResult,
  },
  isLoading: false,
  totalRows: 0,
  isCheckpointEditable: false,
  viewMode: "listview",
  uploadModal: false,
  modalListViewStructure: {
    columns: {},
  },
  categoryList: [],
  isModalOpen: false,
  checkpointsMappedToRoutesModal: false,
  appliedAdvancedFilterData: [],
  advancedFilterData: [],
  filterListPayload: undefined,
  currentFilter: undefined,
  advancedFilterDropdown: undefined,
  advancedFilterOperations: undefined,
  openAdvFilter: false,
  firstLoad: false,
  advFilterLoader: false,
  fetchOptions:undefined,
  checkpointsMappedRoutesListStructure: { columns: {} },
  checkpointsMappedRoutesListData: {
    totalCount: 0,
    results: listResult,
  },
  checkpointCodes: [{
    isActiveFl: true,
    checkpointId: 0,
    checkpointCode: ""
  }],
  linkedCheckpointData: [[{
    checkpointId: 0,
    checkpointCode: "",
    routeCheckpointMappingId: 0
  }]],
  rowIds: [],
};

const CheckpointsListViewReducer = (
  state = initialState,
  action: CheckpointsListViewActions
): ICheckpointsListViewState => {
  switch (action.type) {
    case "@@checkpointsListView/FETCH_STRUCTURE_SUCCESS":
      return {
        ...state,
        structure: action.payload,
      };

    case "@@checkpointsListView/SET_COLUMNS_LOADING":
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload,
        },
      };

    case "@@checkpointsListView/FETCH_DATA_SUCCESS":
      return {
        ...state,
        data: {
          ...action.payload,
        },
      };

    case "@@checkpointsListView/SET_DATA_LOADING":
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload,
        },
      };

    case "@@checkpointsListView/SET_FORM_EDITABLE":
      return {
        ...state,
        isCheckpointEditable: action.payload,
      };

    case "@@checkpointsListView/SET_VIEW_MODE":
      return {
        ...state,
        viewMode: action.payload,
      };
    case "@@checkpointsListView/SET_UPLOAD_MODAL":
      return {
        ...state,
        uploadModal: action.payload,
      };

    case "@@checkpointsListView/UPDATE_DATA":
      const { checkpointId: updateCheckpointId, ...rest } = action.payload;
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map((row) =>
            row.checkpointId === updateCheckpointId ? { ...row, ...rest } : row
          ),
        },
      };
    case '@@checkpointsListView/SET_FETCH_OPTIONS':
        return {
          ...state,
          fetchOptions: action.payload
        }
    case "@@checkpointsListView/SET_MODAL_LISTVIEW_STRUCTURE":
      return {
        ...state,
        modalListViewStructure: action.payload,
      };
    case "@@checkpointsListView/SET_CATEGORY_LIST":
      return {
        ...state,
        categoryList: action.payload,
      };

    case "@@checkpointsListView/SET_MODAL_OPEN":
      return {
        ...state,
        isModalOpen: action.payload,
      };

    case "@@checkpointsListView/SET_CHECKPOINTS_MAPPED_TO_ROUTES_MODAL":
      return {
        ...state,
        checkpointsMappedToRoutesModal: action.payload,
      };

    case "@@checkpointsListView/SET_CHECKPOINTS_MAPPED_ROUTES_LIST_STRUCTURE":
      return {
        ...state,
        checkpointsMappedRoutesListStructure: action.payload,
      };

    case "@@checkpointsListView/FETCH_CHECKPOINTS_MAPPED_ROUTES_LIST_DATA_SUCCESS":
      return {
        ...state,
        checkpointsMappedRoutesListData: {
          ...action.payload,
        },
      };

    case "@@checkpointsListView/SET_CHECKPOINT_CODES": 
      return {
        ...state,
        checkpointCodes: [
          ...action.payload
        ]
      }

    case "@@checkpointsListView/SET_CHECKPOINT_PROPS":
      return {
        ...state,
        linkedCheckpointData: [
          ...action.payload
        ]
      }

    case "@@checkpointsListView/SET_ROW_IDS":
      return {
        ...state,
        rowIds: action.payload
      }

    default:
      return state;
  }
};

export default CheckpointsListViewReducer;
