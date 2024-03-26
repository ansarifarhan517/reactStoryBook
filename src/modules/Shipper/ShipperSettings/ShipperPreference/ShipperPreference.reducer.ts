import { IShipperPreferenceFormReducerState, IShipperPreferenceFormActions } from './ShipperPreference.model';
export const initialState = {
  structure: {},
  loading: false,
  isEditMode: false,
  sameAsParentSystemProps:true
}

export const ShipperPreferenceFormReducer = (
  state: IShipperPreferenceFormReducerState = initialState,
  action: IShipperPreferenceFormActions): IShipperPreferenceFormReducerState => {

  switch (action.type) {
    case '@@shipperPreferenceForm/SET_STRUCTURE':
      return {
        ...state,
        structure: action.payload
      }

    case '@@shipperPreferenceForm/SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }

    case '@@shipperPreferenceForm/SET_EDIT_MODE':
      return {
        ...state,
        isEditMode: action.payload
      }
      
    case '@@shipperPreferenceForm/SET_SAME_AS_SYSTEMPREF':
        return {
          ...state,
          sameAsParentSystemProps: action.payload
        }  

    case '@@shipperPreferenceForm/SET_SHIPPER_DATA':
      return {
        ...state,
        preferenceData: action.payload
      }

    case '@@shipperPreferenceForm/SET_FORM_RESET_DATA':
      return {
        ...state,
        resetData: action.payload
      }
    case '@@shipperPreferenceForm/SET_COUNTRIES':
      return {
        ...state,
        countries: action.payload
      }

    case '@@shipperPreferenceForm/SET_DATEFORMAT':
        return {
          ...state,
        dateformat: action.payload
      }

      case '@@shipperPreferenceForm/SET_BASELANGUAGE':
        return {
          ...state,
        baselang: action.payload
      }

    case '@@shipperPreferenceForm/RESET_INITIAL_STATE':
      return initialState

      
    default:
      return state
  }
}