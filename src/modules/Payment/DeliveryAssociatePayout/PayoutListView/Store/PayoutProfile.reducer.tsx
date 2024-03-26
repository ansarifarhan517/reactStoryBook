import { tPayoutProfilesActions } from "./PayoutProfile.actions";
import {
  IPayoutProfilesReduxState,
  payoutProfileInitialState,
} from "./PayoutProfile.models";

const PayoutProfilesReducer = (
  state: IPayoutProfilesReduxState = payoutProfileInitialState,
  action: tPayoutProfilesActions
): IPayoutProfilesReduxState => {
  switch (action.type) {
    case "@@PAYOUTS/SET_LOADING":
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload,
        },
      };
    case "@@PAYOUTS/SET_COLUMNS_LOADING":
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload,
        },
      };

    case "@@PAYOUTS/SET_BRANCH_ATTACHED":
      const branchAttachedMap = {};
      const branchAttached = action.payload.map((branchObj) => {
        branchAttachedMap[branchObj.id] = branchObj;
        return { label: branchObj.name || "", value: branchObj.id };
      });
      return { ...state, branchAttached, branchAttachedMap };

    case "@@PAYOUTS/SET_LISTVIEW_DATA":
      return {
        ...state,
        data: {
          ...state.data,
          results: action.payload.results,
          totalCount: action.payload.totalCount,
        },
      };

    case "@@PAYOUTS/SET_BRANCHPROIFLE_MAPPING":
      return {
        ...state,
        branchProfileMapping: action.payload
      }

    case "@@PAYOUTS/SET_LISTVIEW_STRUCTURE":
      return {
        ...state,
        structure: action.payload,
      };

    case "@@PAYOUTS/RESET_TO_INITIALSTATE":
      return payoutProfileInitialState;

    case "@@PAYOUTS/SET_IS_LIST_EMPTY":
      return {
        ...state,
        isListViewEmpty: action.payload,
      };
    case "@@PAYOUTS/SET_LIST_PARAMS":
      return {
        ...state,
        listParams: {...action.payload}
      }

    default:
      return state;
  }
};

export default PayoutProfilesReducer;
