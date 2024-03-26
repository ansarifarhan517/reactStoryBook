import { IOrganizationProfileFormReducerState, IOrganizationProfileFormActions } from './OrganizationProfile.model';

export const initialState = {
    structure: {},
    loading: false,
    resetData: {},
    additionalContactDetails:[]
}

export const OrganizationProfileFormReducer = (
    state: IOrganizationProfileFormReducerState = initialState,
    action: IOrganizationProfileFormActions): IOrganizationProfileFormReducerState => {
    switch (action.type) {
        case "@@organizationProfileForm/SET_STRUCTURE" :
            return {
                ...state,
                structure: action.payload
              }
        case "@@organizationProfileForm/SET_LOADING" : 
            return {
                ...state,
                loading: action.payload
              }
        case "@@organizationProfileForm/SET_PROFILE_DATA":
            return {
              ...state,
              organizationProfileData: action.payload
            }
        case "@@organizationProfileForm/SET_FORM_RESET_DATA":
            return {
              ...state,
              resetData: action.payload
            }
        case '@@organizationProfileForm/SET_LOCALE':
            return {
                ...state,
                localeData: action.payload
            }
        case '@@organizationProfileForm/RESET_INITIAL_STATE':
            return initialState
        default:
            return state
    }
  }