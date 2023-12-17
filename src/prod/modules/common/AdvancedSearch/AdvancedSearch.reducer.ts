import { AdvancedSearchActions } from './AdvancedSearch.actions';

export interface IOperationType {
    labelKey: string
    labelValue: string
    operation: string
    operationSymbol: string
}

export interface IAdvancedSearchState {
    operations: Record<string, IOperationType[]>
}

const initialState: IAdvancedSearchState = {
    operations: {}
}

const AdvacnedSearchReducer = (state = initialState, action: AdvancedSearchActions): IAdvancedSearchState => {
    switch (action.type) {
        case '@@advancedSearch/FETCH_DATA_SUCCESS':
            return {
                ...state,
                operations: action.payload
            }

        default: return state
    }
}

export default AdvacnedSearchReducer
