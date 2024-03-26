import { IShipperAlertProfileFormReducerState, IShipperAlertProfileFormActions } from './ShipperAlertProfile.model';
export const initialState = {
  structure: {},
  loading: false,
  isEditMode: false
}

export const ShipperAlertProfileReducer = (
  state: IShipperAlertProfileFormReducerState = initialState,
  action: IShipperAlertProfileFormActions): IShipperAlertProfileFormReducerState => {

  switch (action.type) {
    case '@@shipperAlertProfileForm/SET_STRUCTURE':
      return {
        ...state,
        structure: action.payload
      }

    case '@@shipperAlertProfileForm/SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }

    // case '@@shipperAlertProfileForm/SET_EDIT_MODE':
    //   return {
    //     ...state,
    //     isEditMode: action.payload
    //   }

    case '@@shipperAlertProfileForm/SET_SHIPPER_DATA':
      return {
        ...state,
        alertProfileData: action.payload.data
      }

    case '@@shipperAlertProfileForm/SET_FORM_RESET_DATA':
      return {
        ...state,
        resetData: action.payload
      }

   

    case '@@shipperAlertProfileForm/RESET_INITIAL_STATE':
      return initialState

      
    default:
      return state
  }
}