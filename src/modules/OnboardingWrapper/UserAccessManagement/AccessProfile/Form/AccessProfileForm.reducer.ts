import { IAccessProfileFormActions } from './AccessProfileForm.actions'
import { IAccessProfileFormReducerState } from './AccessProfileForm.models'

export const initialState = {
    structure: {},
    loading: false,
    isEditMode: false,
    flatObject: {},
    DISPATCHER_READONLYACC: {},
    DISPATCHER_ALLACCESSACC: {},
    CARRIER_READONLYACC: {},
    CARRIER_ALLACCESSACC: {},
    SHIPPER_READONLYACC: {},
    SHIPPER_ALLACCESSACC: {},
    accessRefIds: []
}


export const AccessProfileFormReducer = (
    state: IAccessProfileFormReducerState = initialState,
    action: IAccessProfileFormActions): IAccessProfileFormReducerState => {

    switch (action.type) {
        case '@@accessProfileForm/SET_STRUCTURE':
            return {
                ...state,
                structure: action.payload
            }
        case '@@accessProfileForm/SET_LOADING':
            return {
                ...state,
                loading: action.payload
            }
        case '@@accessProfileForm/SET_FLATOBJECT':
            return {
                ...state,
                flatObject: action.payload
            }
        case '@@accessProfileForm/SET_DISPATCHER_READONLYACC':
            return {
                ...state,
                DISPATCHER_READONLYACC: action.payload
            }
        case '@@accessProfileForm/SET_DISPATCHER_ALLACCESSACC':
            return {
                ...state,
                DISPATCHER_ALLACCESSACC: action.payload
            }
        case '@@accessProfileForm/SET_CARRIER_READONLYACC':
            return {
                ...state,
                CARRIER_READONLYACC: action.payload
            }
        case '@@accessProfileForm/CARRIER_ALLACCESSACC':
            return {
                ...state,
                CARRIER_ALLACCESSACC: action.payload
            }
        case '@@accessProfileForm/SHIPPER_READONLYACC':
            return {
                ...state,
                SHIPPER_READONLYACC: action.payload
            }
        case '@@accessProfileForm/SHIPPER_ALLACCESSACC':
            return {
                ...state,
                SHIPPER_ALLACCESSACC: action.payload
            }
        case '@@accessProfileForm/SET_ACCESSREFIDS':
            return {
                ...state,
                accessRefIds: Array.from(action.payload)
            }
        default:
            return state
    }

}
