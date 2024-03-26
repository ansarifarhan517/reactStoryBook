import { IDriverFormReducerState, IDriverFormActions } from './DriverForm.model';
export const initialState = {
  structure: {},
  loading: false,
  isEditMode: false,
  // driverData: {},
  resetData: {
    /** This key corresponds to the key defined in getAPIModuleData() */
    moduleKey: 'driver',
    // cur_country: {
    //   id: JSON.parse(localStorage.getItem('userAccessInfo') || '{}').baseCountryId,
    //   name: JSON.parse(localStorage.getItem('userAccessInfo') || '{}').baseCountry
    // },
    // per_country: {
    //   id: JSON.parse(localStorage.getItem('userAccessInfo') || '{}').baseCountryId,
    //   name: JSON.parse(localStorage.getItem('userAccessInfo') || '{}').baseCountry
    // },
    // driverName: 'Ajay',
    // phoneNumber: '9833016343',
    // licenseNumber: '1231231231',
    // cur_city: 'Mumbai',
    // per_city: 'Mumbai',
    // maritalStatus: 'Married',
    // gender: 'Male',
    licenseType: ''
  }
}

export const DriverFormReducer = (
  state: IDriverFormReducerState = initialState,
  action: IDriverFormActions): IDriverFormReducerState => {

  switch (action.type) {
    case '@@driverForm/SET_STRUCTURE':
      return {
        ...state,
        structure: action.payload
      }

    case '@@driverForm/SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }

    case '@@driverForm/SET_EDIT_MODE':
      return {
        ...state,
        isEditMode: action.payload
      }

    case '@@driverForm/SET_DRIVER_DATA':
      return {
        ...state,
        driverData: action.payload
      }

    case '@@driverForm/SET_FORM_RESET_DATA':
      return {
        ...state,
        resetData: action.payload
      }

    case '@@driverForm/RESET_INITIAL_STATE':
      return initialState

    default:
      return state
  }
}