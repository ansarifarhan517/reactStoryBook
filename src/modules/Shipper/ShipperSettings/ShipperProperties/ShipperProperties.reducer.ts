import { IShipperPropertiesFormReducerState, IShipperPropertiesFormActions } from './ShipperProperties.model';
export const initialState = {
  structure: {},
  loading: false,
  serviceType:[],
  priorityData:[]
}

export const ShipperPropertiesFormReducer = (
  state: IShipperPropertiesFormReducerState = initialState,
  action: IShipperPropertiesFormActions): IShipperPropertiesFormReducerState => {

  switch (action.type) {
    case '@@shipperPropertiesForm/SET_STRUCTURE':
      return {
        ...state,
        structure: action.payload
      }

    case '@@shipperPropertiesForm/SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }

    case '@@shipperPropertiesForm/SET_SHIPPER_DATA':
      return {
        ...state,
        shipperData: action.payload
      }

    case '@@shipperPropertiesForm/SET_SERVICETYPE':
      return {
        ...state,
        serviceType: action.payload
    }
    case '@@shipperPropertiesForm/SET_PRIORITY_DATA':
      return {
        ...state,
        priorityData: action.payload
      }

    case '@@shipperPropertiesForm/SET_FORM_RESET_DATA':
      return {
        ...state,
        resetData: action.payload
      }

    case '@@shipperPropertiesForm/RESET_INITIAL_STATE':
      return initialState

      
    default:
      return state
  }
}