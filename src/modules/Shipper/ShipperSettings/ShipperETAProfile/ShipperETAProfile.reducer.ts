import { IShipperETAProfileFormReducerState, IShipperETAProfileFormActions } from './ShipperETAProfile.model';
export const initialState = {
  structure: [],
  loading: false,
  isEditMode: false
}

export const ShipperETAProfileReducer = (
  state: IShipperETAProfileFormReducerState = initialState,
  action: IShipperETAProfileFormActions): IShipperETAProfileFormReducerState => {

  switch (action.type) {
    case '@@shipperETAProfileForm/SET_STRUCTURE':
      return {
        ...state,
        structure: action.payload
      }

    case '@@shipperETAProfileForm/SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }

    case '@@shipperETAProfileForm/SET_EDIT_MODE':
      return {
        ...state,
        isEditMode: action.payload
      }

    case '@@shipperETAProfileForm/SET_SHIPPER_DATA':
      return {
        ...state,
        etaProfileData: action.payload.data
      }

    case '@@shipperETAProfileForm/SET_FORM_RESET_DATA':
      return {
        ...state,
        resetData: action.payload
      }

   

    case '@@shipperETAProfileForm/RESET_INITIAL_STATE':
      return initialState

      
    default:
      return state
  }
}