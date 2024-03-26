import {
    IMongoFormStructure,
  } from "../../../../../utils/mongo/interfaces";
  import { IPayoutFormActions } from "./PayoutProfileForm.actions";
  
  export interface IPayoutFormReducerState {
    structure: IMongoFormStructure;
    loading: boolean;
    isUpdateForm: boolean;
    payoutIdData?: { [key: string]: any };
    isDirty: boolean;
    lookup: any;
  }
  
  export const initialState = {
    structure: {},
    loading: false,
    isUpdateForm: false,
    isDirty: false,
    lookup: {},
  };
  
  export const PayoutFormReducer = (
    state: IPayoutFormReducerState = initialState,
    action: IPayoutFormActions
  ): IPayoutFormReducerState => {
    switch (action.type) {
      case "@@PAYOUTS/SET_FORM_STRUCTURE":
        return {
          ...state,
          structure: action.payload,
        };
  
      case "@@PAYOUTS/SET_FORM_LOADING":
        return {
          ...state,
          loading: action.payload,
        };
  
      case "@@PAYOUTS/SET_FORM_ISUPDATE_FLAG":
        return {
          ...state,
          isUpdateForm: action.payload,
        };
  
      case "@@PAYOUTS/SET_PAYOUT_ID_DATA":
        return {
          ...state,
          payoutIdData: action.payload,
        };
  
      case "@@PAYOUTS/SET_FORM_DIRTY_FLAG":
        return {
          ...state,
          isDirty: action.payload,
        };
  
      case "@@PAYOUTS/RESET_TO_INITIAL_STATE":
        return initialState;
  
      case "@@PAYOUTS/SET_LOOKUP":
        return {
          ...state,
          lookup: {
            ...state.lookup,
            [action.payload.key]: action.payload.value,
          },
        };
      
      default:
        return state;
    }
  };
  