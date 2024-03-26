import { IShipperFormReducerState, IShipperFormActions } from './ShipperForm.model';
export const initialState = {
  structure: {},
  loading: false,
  isEditMode: false, 
  rejectionModal:false,
  isApproved: false,
  resetData: {
    moduleKey: 'shipper',
  }
}

export const ShipperFormReducer = (
  state: IShipperFormReducerState = initialState,
  action: IShipperFormActions): IShipperFormReducerState => {

  switch (action.type) {
    case '@@shipperForm/SET_STRUCTURE':
      return {
        ...state,
        structure: action.payload
      }

    case '@@shipperForm/SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }

    case '@@shipperForm/SET_EDIT_MODE':
      return {
        ...state,
        isEditMode: action.payload
      }

    case '@@shipperForm/SET_SHIPPER_DATA':
      return {
        ...state,
        shipperData: action.payload
      }

    case '@@shipperForm/SET_FORM_RESET_DATA':
      return {
        ...state,
        resetData: action.payload
      }

    case '@@shipperForm/SET_REJECT_MODAL':
      return {
        ...state,
        rejectionModal: action.payload
      }
    case '@@shipperForm/SET_FORM_RESET_DATA':
      return {
        ...state,
        resetData: action.payload
    }

    case '@@shipperForm/APPROVE_SHIPPER':
      return {
        ...state,
        isApproved: action.payload
    }

    case '@@shipperForm/RESET_INITIAL_STATE':
      return initialState

      
    default:
      return state
  }
}