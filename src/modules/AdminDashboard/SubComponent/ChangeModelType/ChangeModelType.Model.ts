import { IMongoFormStructure} from '../../../../utils/mongo/interfaces';

export interface IChangeModelTypeFormReducerState {
    structure: IMongoFormStructure
    loading: boolean
    clientId:string
  }


  /* Actions */


  export interface IChangeModelTypeFormFetchStructure {
    readonly type: '@@changeModelTypeForm/FETCH_STRUCTURE'
  }
  
  export interface IChangeModelTypeFormSetStructure {
    readonly type: '@@changeModelTypeForm/SET_STRUCTURE'
    payload: IMongoFormStructure
  }

  export interface IChangeModelTypeFormSetLoading {
    readonly type: '@@changeModelTypeForm/SET_LOADING'
    payload: boolean
  }

  export interface IChangeModelTypeFormSetClientId {
    readonly type: '@@changeModelTypeForm/SET_CLIENTID'
    payload: string
  }



  export type IChangeModelTypeFormActions = 
  | IChangeModelTypeFormFetchStructure
  | IChangeModelTypeFormSetStructure
  | IChangeModelTypeFormSetLoading
  | IChangeModelTypeFormSetClientId