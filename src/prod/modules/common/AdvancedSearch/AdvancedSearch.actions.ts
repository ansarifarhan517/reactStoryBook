import { IOperationType } from "./AdvancedSearch.reducer";

export interface IOperationsSuccessAction {
    type: '@@advancedSearch/FETCH_DATA_SUCCESS'
    payload: Record<string, IOperationType[]>
}

export interface IOperationsFailureAction {
    type: '@@advancedSearch/FETCH_DATA_FAILURE'
}

export interface IOperationsFetchAction {
    type: '@@advancedSearch/FETCH_DATA'
}

export type AdvancedSearchActions =
    | IOperationsFetchAction
    | IOperationsSuccessAction
    | IOperationsFailureAction
