import { IChangeModelTypeFormActions, IChangeModelTypeFormReducerState } from "./ChangeModelType.Model"


export const initialState: IChangeModelTypeFormReducerState = {
    structure: {},
    loading: false,
    clientId:0
}


export const ChangeModelTypeFormReducer = (
    state: IChangeModelTypeFormReducerState = initialState,
    action: IChangeModelTypeFormActions): IChangeModelTypeFormReducerState => {
    switch (action.type) {
        case '@@changeModelTypeForm/SET_STRUCTURE':
            return {
                ...state,
                structure: action.payload
            }

        case '@@changeModelTypeForm/SET_LOADING':
            return {
                ...state,
                loading: action.payload
            }

            case '@@changeModelTypeForm/SET_CLIENTID':
            return {
                ...state,
                clientId: action.payload
            }

        default:
            return state
    }
}

export default ChangeModelTypeFormReducer
