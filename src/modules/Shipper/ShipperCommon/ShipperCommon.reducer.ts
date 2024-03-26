import { IShipperOnboardingReducerState, IShipperCommonFormActions } from './ShipperCommon.model';
export const initialState = {
    onBoardingData: []
}

export const ShipperOnboardingReducer = (
    state: IShipperOnboardingReducerState = initialState,
    action: IShipperCommonFormActions): IShipperOnboardingReducerState => {

    switch (action.type) {
        case '@@shipperOnboarding/FETCH_STRUCTURE':
            return {
                ...state
            }
        case '@@shipperOnboarding/SET_STRUCTURE':
            return {
                ...state,
                onBoardingData: action.payload
            }
        case '@@shipperOnboarding/RESET_STRUCTURE':
            return initialState
        default:
            return state
    }
}