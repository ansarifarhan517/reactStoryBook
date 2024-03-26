import {
  IMongoColumnOnlyStructure,
  IMongoFormStructure,
} from "../../../utils/mongo/interfaces";
import { IBonusFormActions } from "./BonusesForm.action";

export interface ISlabRow {
  bonusId?: number;
  rateType: string;
  fromValue: string;
  toValue: string;
  rate: number;
}
export interface IBonusesFormReducerState {
  structure: IMongoFormStructure;
  advancedFilterColumns: IMongoColumnOnlyStructure;
  loading: boolean;
  isUpdateForm: boolean;
  isCopyForm: boolean;
  bonusIdData?: { [key: string]: any };
  slabData?: Array<ISlabRow>;
  resetData?: { [key: string]: any };
  isDirty: boolean;
  lookup: any;
  daFilter: any;
  clientMetric: any
}

export const initialState = {
  structure: {},
  advancedFilterColumns: {
    columns: {},
  },
  loading: false,
  isUpdateForm: false,
  isCopyForm: false,
  isDirty: false,
  resetData: {},
  lookup: {},
  daFilter: {},
  clientMetric: {}
};

export const BonusesFormReducer = (
  state: IBonusesFormReducerState = initialState,
  action: IBonusFormActions
): IBonusesFormReducerState => {
  switch (action.type) {
    case "@@bonuses/SET_FORM_STRUCTURE":
      return {
        ...state,
        structure: action.payload,
      };

    case "@@bonuses/SET_FORM_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    case "@@bonuses/SET_FORM_ISUPDATE_FLAG":
      return {
        ...state,
        isUpdateForm: action.payload,
      };

    case "@@bonuses/SET_FORM_ISCOPY_FLAG":
      return {
        ...state,
        isCopyForm: action.payload,
      };

    case "@@bonuses/SET_BONUSID_DATA":
      return {
        ...state,
        bonusIdData: action.payload,
      };

    case "@@bonuses/RESET_FORM_DATA":
      return {
        ...state,
        resetData: action.payload,
      };
    case "@@bonuses/SET_FORM_DIRTY_FLAG":
      return {
        ...state,
        isDirty: action.payload,
      };

    case "@@bonuses/RESET_TO_INITIAL_STATE":
      return initialState;

    case "@@bonuses/SET_LOOKUP":
      return {
        ...state,
        lookup: {
          ...state.lookup,
          [action.payload.key]: action.payload.value,
        },
      };

    case "@@bonuses/SET_DA_FILTER":
      return {
        ...state,
        daFilter: {...action.payload},
      };

    case "@@bonuses/SET_ADVANCED_FILTER_COLUMNS":
      return {
        ...state,
        advancedFilterColumns: action.payload,
      };

    case "@@bonuses/SET_SLAB_DATA":
      return {
        ...state,
        slabData: action.payload
      };
    
    case "@@bonuses/SET_CLIENT_METRIC_SYSTEM": {
        let obj = {}
        action.payload?.forEach((c:any) => {
          obj = {
            ...obj,
            [c.name]: c
          }
          
        })

        return {
          ...state,
          clientMetric: obj
        }
      }

    default:
      return state;
  }
};
