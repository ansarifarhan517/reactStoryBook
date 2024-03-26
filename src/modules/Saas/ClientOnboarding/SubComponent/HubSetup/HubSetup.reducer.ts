import { IHubSetupFormReducerState, IHubSetupFormActions } from './HubSetup.model';

export const initialState = {
    structure: {},
    loading: false,
    resetData: {},
    additionalContactDetails:[]
}

export const HubSetupFormReducer = (
    state: IHubSetupFormReducerState = initialState,
    action: IHubSetupFormActions): IHubSetupFormReducerState => {
    switch (action.type) {
        case "@@hubSetupForm/SET_STRUCTURE" :
            return {
                ...state,
                structure: action.payload
              }
        case "@@hubSetupForm/SET_LOADING" : 
            return {
                ...state,
                loading: action.payload
              }
        case "@@hubSetupForm/SET_PROFILE_DATA":
            return {
              ...state,
              hubSetupData: action.payload
            }
        case "@@hubSetupForm/SET_FORM_RESET_DATA":
            return {
              ...state,
              resetData: action.payload
            }
        case '@@hubSetupForm/SET_LOCALE':
            return {
                ...state,
                localeData: action.payload
            }
        case '@@hubSetupForm/RESET_INITIAL_STATE':
            return initialState
        default:
            return state
    }
  }