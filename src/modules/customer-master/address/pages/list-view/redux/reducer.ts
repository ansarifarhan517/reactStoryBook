import { IMongoField } from "../../../../../../utils/mongo/interfaces";
import { tAddressType, tDropdown, tInlineEdits } from "../model";
import { dummyColumns } from "../utils";
import { IAllAddressListActions } from "./action";


export interface IAllAdddressListState {
  addressType: Array<tAddressType> | null;
  weekDays: Array<tDropdown> | null;
  inlineEdits: tInlineEdits;
  lastUpdatedCell: string;
  columnStructure: {
    [key: string]: IMongoField
  };
}


export const dummyResult: any = Array(15).fill(0).map((_, i) => ({xyz: i + 1 }))

const initialState: IAllAdddressListState = {
  addressType: null,
  weekDays: null,
  inlineEdits: {},
  lastUpdatedCell: '',
  columnStructure: dummyColumns
};

export const AllAddressListReducer = (
  state = initialState,
  action: IAllAddressListActions
) => {
  switch (action.type) {

    case "@@ALL_ADDRESSES/SET_ADDRESS_TYPE":
      return {
        ...state,
        addressType: action.payload,
      };

    case "@@ALL_ADDRESSES/SET_WEEK_DAYS":
      return {
        ...state,
        weekDays: action.payload,
      };

    case '@@ALL_ADDRESSES/SET_INLINE_EDITS':
      const { rowId, columnId, value, hasError } = action.payload;
      return {
        ...state,
        lastUpdatedCell: `${rowId}-${columnId}`,
        inlineEdits: {
          ...state.inlineEdits,
          [rowId]: {
            ...state.inlineEdits?.[rowId],
            [columnId]: {
              value,
              hasError,
            },
          },
        },
      };

    case '@@ALL_ADDRESSES/REMOVE_INLINE_EDITS':
      const { rowId: removeRowId, columnId: removeColumnId } = action.payload;
      const newState = {
        ...state,
      };

      delete newState.inlineEdits?.[removeRowId]?.[removeColumnId];
      if (!Object.keys(newState.inlineEdits?.[removeRowId] || {}).length) {
        delete newState.inlineEdits?.[removeRowId];
      }

      return newState;

    case '@@ALL_ADDRESSES/CLEAR_INLINE_EDITS':
      return {
        ...state,
        editDetails: {},
      };

    case "@@ALL_ADDRESSES/SET_LISTVIEW_COLUMN_STRUCTURE":
      return {
        ...state,
        columnStructure: action.payload,
      };
      
    default:
      return state;
  }
};
