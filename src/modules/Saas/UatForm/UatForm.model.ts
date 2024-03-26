import { IMongoFormStructure} from './../../../utils/mongo/interfaces';

export interface IUatFormReducerState {
    structure: IMongoFormStructure
    loading: boolean
    isEditMode: boolean,
    uatData?: IUatData,
    resetData?: IUatFormData
}

/** Actions */
export interface IUatFormFetchStructure {
    readonly type: '@@uatForm/FETCH_STRUCTURE'
}

export interface IUatFormSetStructure {
    readonly type: '@@uatForm/SET_STRUCTURE'
    payload: IMongoFormStructure
}

export interface IUatFormSetLoading {
    readonly type: '@@uatForm/SET_LOADING'
    payload: boolean
}
  
export interface IUatFormSetEditMode { 
    readonly type: '@@uatForm/SET_EDIT_MODE',
    payload: boolean
}
  
export interface IUatFormSetUatData { 
    readonly type: '@@uatForm/SET_UAT_DATA',
    payload: IUatData
}
  
export interface ISetFormResetData {
    readonly type: '@@uatForm/SET_FORM_RESET_DATA'
    payload: IUatFormData
}
  
export interface IResetState { 
    readonly type: '@@uatForm/RESET_INITIAL_STATE'
}

export type IUatFormActions = IUatFormFetchStructure | IUatFormSetStructure | IUatFormSetLoading | IUatFormSetEditMode | IUatFormSetUatData | ISetFormResetData | IResetState

export interface IUatData {
    clientId?: number,
    adminName?: string,
    adminEmailId?: string,
    adminContactNo?: number,
    name?: string,
    accountCount?: number
    id?: string
}

export interface IUatFormData {
    /** Pending - Add Form Formats for each */
  [key: string]: any
}
