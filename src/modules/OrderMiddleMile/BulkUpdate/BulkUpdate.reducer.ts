
import { tMMOBulkUpdateAction } from "./BulkUpdate.actions";
import { IMMOBulkUpdateReduxState, MMOBulkUpdateReduxInitialState } from "./BulkUpdate.models";

export const MMOBulkUpdateReducer = (state: IMMOBulkUpdateReduxState = MMOBulkUpdateReduxInitialState, action: tMMOBulkUpdateAction): IMMOBulkUpdateReduxState => {
    switch(action.type) {
        case '@@MMO/BulkUpdate/SET_STRUCTURE':
            return {
                ...state,
                structure : action.payload
            }

        case '@@MMO/BulkUpdate/SET_API_LOADING':
            return {
                ...state,
                apiLoading: action.payload
            }

        case '@@MMO/BulkUpdate/SET_CLIENT_METRIC_SYSTEM': 
            return {
                ...state,
                clientMetric: action.payload
            }
        
        default:
            return state
    }

}