import { IClientsLookUpData, IMongoImportSettingsStructure } from "./ImportSettings.models";

export interface IsetLoading {
  readonly type: "@@importSettings/SET_LOADING";
  payload: boolean;
}

export interface IFetchStructureAction {
  readonly type: "@@importSettings/FETCH_STRUCTURE";
}

export interface IfetchStructureSuccessAction {
  readonly type: "@@importSettings/FETCH_STRUCTURE_SUCCESS";
  payload: IMongoImportSettingsStructure;
}

// Making 4 actions, 1 to fetch Import From Data, Another to fetch Import to Data and then 2 actions to set the data in Redux
export interface IFetchImportFromDataAction {
  readonly type: "@@importSettings/FETCH_IMPORT_FROM_DATA";
}

export interface IFetchImportToDataAction {
  readonly type: "@@importSettings/FETCH_IMPORT_TO_DATA";
}

export interface IFetchImportFromDataSuccessAction {
  readonly type: "@@importSettings/FETCH_IMPORT_FROM_DATA_SUCCESS";
  payload: Array<IClientsLookUpData>;
}

export interface IFetchImportToDataSuccessAction {
  readonly type: "@@importSettings/FETCH_IMPORT_TO_DATA_SUCCESS";
  payload: Array<IClientsLookUpData>;
}


// export interface IFetchClientLookUpDataAction {
//   readonly type: "@@importSettings/FETCH_CLIENT_LOOKUP_DATA";
// }

// export interface IFetchClientLookUpDataSuccessAction {
//   readonly type: "@@importSettings/FETCH_CLIENT_LOOKUP_DATA_SUCCESS";
//   payload: Array<IClientsLookUpData>;
// }

export interface ISetClient {
  readonly type: "@@importSettings/SET_CLIENT";
  payload: {
    key: string
    value: string;
    // modelType: string,
  }
}

export type ImportSettingsActions = 
| IsetLoading
| IFetchStructureAction
| IfetchStructureSuccessAction
// | IFetchClientLookUpDataAction
// | IFetchClientLookUpDataSuccessAction
| IFetchImportFromDataAction
| IFetchImportToDataAction
| IFetchImportFromDataSuccessAction
| IFetchImportToDataSuccessAction
| ISetClient