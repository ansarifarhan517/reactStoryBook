import { IMongoFormStructure } from "../../../../utils/mongo/interfaces";


export interface IDropdownComponentProps {
    id: string
    name?: string
    label?: string
    value: string
    displayName?: string
  }

export interface IAdditionalContactDetailsStructure {
    [key: string]: IMongoFormStructure | null | any;
}

export interface IAdditionalContactDetailsPayload {
    contactId: number,
    contactName: string,
    mobileNumber: string,
    emailAddress: string,
    isActiveFl: string
}
  
export interface IOrganizationProfileFormReducerState {
    structure: IMongoFormStructure
    loading: boolean
    organizationProfileData?: IOrganizationData,
    resetData?: IOrganizationProfileFormData,
    localeData?:IDropdownComponentProps[],
    additionalContactDetails?: IAdditionalContactDetailsStructure[]
}

export interface IOrganizationProfileFetchStructure {
    readonly type: '@@organizationProfileForm/FETCH_STRUCTURE'
}

export interface IFetchLocale{
    readonly type: '@@organizationProfileForm/FETCH_LOCALE'
}

export interface ISetLocale {
    readonly type: '@@organizationProfileForm/SET_LOCALE'
    payload: IDropdownComponentProps[]
}

export interface IOrganizationProfileSetStructure {
    readonly type: '@@organizationProfileForm/SET_STRUCTURE'
    payload: IMongoFormStructure
}

export interface IOrganizationProfileSetLoading {
    readonly type: '@@organizationProfileForm/SET_LOADING'
    payload: boolean
  }

export interface IResetState {
   readonly type: '@@organizationProfileForm/RESET_INITIAL_STATE',
   payload? : any
}

export interface IOrganizationFormSetProfileData {
    readonly type: '@@organizationProfileForm/SET_PROFILE_DATA',
    payload?: IOrganizationData
}

export interface IOrganizationFormResetData {
    readonly type: '@@organizationProfileForm/SET_FORM_RESET_DATA',
    payload: IOrganizationProfileFormData
}

export type IOrganizationProfileFormActions = IResetState | IOrganizationProfileFetchStructure | IOrganizationProfileSetStructure | IOrganizationProfileSetLoading | IOrganizationFormSetProfileData | IOrganizationFormResetData | IFetchLocale | ISetLocale

export interface IOrganizationData {
    logoImagePath?: String,
    clientId?: number
    name: String,
    adminContactName: String,
    officeNumber?: String,
    mobileNumber?: String,
    emailAddress: String,
    googleCountryCode?: string;
    zohoSubscriptionId?: String,
    helpdeskNumber?: String,
    supportEmailAddress?: String,
    customerSupportPhoneNumber?: String,
    customerSupportEmailID?:String,
    apartment?: String,
    city?: String,
    streetName?: String,
    countryId?: number,
    countryName?: String,
    stateId?: number,
    stateName?: String,
    latitude?: number,
    landmark?: String,
    longitude?: number,
    locality?: String,
    region?: String,
    zipCode?: String,
    whiteListedDomains?: String,
    subscriptionId?: number,
    contactDetailsList?: IAdditionalContactDetailsPayload[]
}
  
export interface IOrganizationProfileFormData {
    /** Pending - Add Form Formats for each */
    [key: string]: any
}
  