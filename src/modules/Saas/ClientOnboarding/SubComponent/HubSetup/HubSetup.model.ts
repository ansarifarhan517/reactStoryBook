import { IMongoFormStructure } from "../../../../../utils/mongo/interfaces";


export interface IDropdownComponentProps {
    id: string
    name?: string
    label?: string
    value: string
  }
  
export interface IHubSetupFormReducerState {
    structure: IMongoFormStructure
    loading: boolean
    hubSetupData?: IHubSetupData,
    resetData?: IHubSetupFormData,
    localeData?:IDropdownComponentProps[],
}

export interface IHubSetupFetchStructure {
    readonly type: '@@hubSetupForm/FETCH_STRUCTURE'
}

export interface IFetchLocale{
    readonly type: '@@hubSetupForm/FETCH_LOCALE'
}

export interface ISetLocale {
    readonly type: '@@hubSetupForm/SET_LOCALE'
    payload: IDropdownComponentProps[]
}

export interface IHubSetupSetStructure {
    readonly type: '@@hubSetupForm/SET_STRUCTURE'
    payload: IMongoFormStructure
}

export interface IHubSetupSetLoading {
    readonly type: '@@hubSetupForm/SET_LOADING'
    payload: boolean
  }

export interface IResetState {
   readonly type: '@@hubSetupForm/RESET_INITIAL_STATE',
   payload? : any
}

export interface IOrganizationFormSetProfileData {
    readonly type: '@@hubSetupForm/SET_PROFILE_DATA',
    payload: IHubSetupData
}

export interface IOrganizationFormResetData {
    readonly type: '@@hubSetupForm/SET_FORM_RESET_DATA',
    payload: IHubSetupFormData
}

export type IHubSetupFormActions = IResetState | IHubSetupFetchStructure | IHubSetupSetStructure | IHubSetupSetLoading | IOrganizationFormSetProfileData | IOrganizationFormResetData | IFetchLocale | ISetLocale

export interface IHubSetupData {
    name: String,
    adminContactName: String,
    mobileNumber?: String,
    emailAddress: String,
    isHubFl?:String,
    isOwnBranchFl?:String,
    isSuperFl?:String,
    apartment?: String,
    city?: String,
    streetName?: String,
    country?: String,
    state?: String,
    lat?: number,
    lng?: number,
    countryName? :string,
    stateName?: string,
    locality?: String,
    radiusInKms?: Number,
    zipCode?: String,
    timezone?:String,
    timezoneId?:Number
}
  
export interface IHubSetupFormData {
    /** Pending - Add Form Formats for each */
    [key: string]: any
}
  