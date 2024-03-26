import { IItemFormReducerState, IItemFormActions } from './ItemConfiguration.action';
export const initialState = {
  structure: {},
  loading: false,
  isEditMode: false,
  isDirty: false,
  systemMetric: [],
  resetData: {
    itemCode: '',
    itemName: '',
  }
}

export const ItemFormReducer = (
  state: IItemFormReducerState = initialState,
  action: IItemFormActions): IItemFormReducerState => {

  switch (action.type) {
    case '@@itemForm/SET_STRUCTURE':
      return {
        ...state,
        structure: action.payload
      }

    case '@@itemForm/SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }

    case '@@itemForm/SET_EDIT_MODE':
      return {
        ...state,
        isEditMode: action.payload
      }

    case '@@itemForm/SET_USER_DATA':
      return {
        ...state,
        userData: action.payload
      }

    case '@@itemForm/SET_FORM_RESET_DATA':
      return {
        ...state,
        resetData: action.payload
      }

    case '@@itemForm/SET_FORM_DIRTY_FLAG':
      return {
        ...state,
        isDirty: action.payload
      }

    case '@@itemForm/FETCH_SYSTEM_METRIC':
      return {
        ...state,
        systemMetric: action.payload
      }

    case '@@itemForm/RESET_INITIAL_STATE':
      return initialState

    default:
      return state
  }
}