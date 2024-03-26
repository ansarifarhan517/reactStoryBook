import { IMongoField, IMongoFormStructure } from '../../../utils/mongo/interfaces';

export interface IPlansFormReducerState {
  structure: IMongoFormStructure
  accordion: IAccordion
  loading: boolean
  isEditMode: boolean,
  plansData?: IPlansForm,
  resetData?: IPlansFormData
  selectedRow?: { rowId?: string, section?: string }
  rowWiseTierData: IRowWiseTierData,
  sectionData: ISectionData | undefined
  plansDetails?: undefined | any
  selectedPlanRow?: any
  selectedPlan?: string
  billingCurrency?: { [key: string]: { name: string, id: number } }
  planNameMapping?: { [key: string]: string }
  zohoAddons?: IAddOn[]
  addonTierData?: IAddonTierData
  currencySign: string,
  gstStructure?: IMongoField
  viewChanges: boolean
  billlingCycle: string
  editedPlanData: IEditedPlanData
  viewChangesData?: {
    plan?: ITable[]
    oneTime?: { [key: string]: ITable[] }
    recurring?: { [key: string]: ITable[] }
  }
  scheduledChangesDiscardPopup: boolean
  isContinue?: boolean
  paymentTermsList: Array<any>,
  billingFrequencyMap: {}
  parentSubscriptionId: string
}
export interface ITable {
  label: string
  key: string
  value?: string | number
}
export interface IAccordionTable {
  'id': string,
  'label': string,
  'labelKey': string,
  'addLabel'?: string
  table: {
    columns: {
      'id': string,
      'label': string,
      'fieldType': string,
    }[]
  }
}

export interface IRowWiseTierData {
  [key: string]: IAddonTierData | {}
}

interface IAddonTierData {
  [key: string]: ITierData
}
export interface ITierData {
  id: string
  startingNoOfTransaction?: number
  endingNoOfTransaction?: number
  //rate?: number
  value?: any
  price?: number
}
export interface IAccordion {
  [key: string]: {
    [key: string]: IAccordionTable
  }
}
export interface IEditedPlanData {
  zohoAddon: IAddonTierData[]
  addonTierData: ITierData[]
  planTierData: ITierData[]
}
export interface ISectionData {
  [key: string]: { [key: string]: ISection[] }
}
export interface ISection {
  intervalUnit?: string | number | undefined;
  id: string
  value?: any
  label: string
  fieldType: string
  readOnly?: boolean
  isDelete?: boolean
  options?: { label: string, value: string, [key: string]: string | number }[]
}

/** Actions */
export interface IPlansFormFetchStructure {
  readonly type: '@@plansForm/FETCH_STRUCTURE'
}
export interface IPlansFormFetchHubSpotDetails {
  readonly type: '@@plansForm/FETCH_HUBSPOT_DETAILS'
}

export interface IPlansFormSetStructure {
  readonly type: '@@plansForm/SET_STRUCTURE'
  payload: IMongoFormStructure
}

export interface IFetchParentSubscriptionId {
  readonly type: "@@plansForm/FETCH_PARENT_SUBSCRIPTION_ID"
  payload: number
}

export interface ISetParentSubscriptionId {
  readonly type: "@@plansForm/SET_PARENT_SUBSCRIPTION_ID"
  payload: string
}

export interface IPlansFormSetLoading {
  readonly type: '@@plansForm/SET_LOADING'
  payload: boolean
}

export interface IPlansFormSetEditMode {
  readonly type: '@@plansForm/SET_EDIT_MODE',
  payload: boolean
}

export interface IPlansFormSetDriverData {
  readonly type: '@@plansForm/SET_PLANS_DATA',
  payload: IPlansForm
}

export interface ISetFormResetData {
  readonly type: '@@plansForm/SET_FORM_RESET_DATA'
  payload: IPlansFormData
}

export interface IResetState {
  readonly type: '@@plansForm/RESET_INITIAL_STATE'
}

export interface ISetSelectedRowId {
  readonly type: '@@plansForm/SET_SELECTED_ROW'
  payload: { rowId: string | undefined, section: string | undefined }
}

export interface ISetRowWiseTierData {
  readonly type: '@@plansForm/SET_ROWWISE_TIER_DATA'
  payload: { [key: string]: { [key: string]: ITierData } | {} }
}

export interface ISetSectionData {
  readonly type: '@@plansForm/SET_SECTION_DATA'
  payload: ISectionData | undefined
}

export interface ISetPlansDetails {
  readonly type: '@@plansForm/SET_PLAN_DETAILS'
  payload: any | undefined
}
export interface ISetselectedPlanRow {
  readonly type: '@@plansForm/SET_SELECTED_PLAN'
  payload: any | undefined
}

export interface ISetBillingCurrency {
  readonly type: '@@plansForm/SET_BILLING_CURRENCY'
  payload: { name: string, id: number }[] | undefined
}

export interface ISetZohoAddons {
  readonly type: '@@plansForm/SET_ZOHO_ADDONS'
  payload: IAddOn[] | undefined
}
export interface ISetAddonTierData {
  readonly type: '@@plansForm/SET_ADDON_TIER_DATA'
  payload: IAddonTierData | undefined
}

export interface ISetCurrencySign {
  readonly type: '@@plansForm/SET_CURRENCY_SIGN'
  payload: string
}
export interface ISetViewChangesPopup {
  readonly type: '@@plansForm/SET_VIEW_CHANGES_POPUP'
  payload: boolean
}
export interface ISetBillingCycle {
  readonly type: '@@plansForm/SET_BILLING_CYCLE'
  payload: string
}

export interface ISetEditedPlanData {
  readonly type: '@@plansForm/SET_EDITED_PLAN_DATA'
  payload: IEditedPlanData
}
export interface ISetScheduledChanges {
  readonly type: '@@plansForm/SET_SCHEDULED_CHANGES'
  payload: {
    plan?: ITable[]
    oneTime?: { [key: string]: ITable[] }
    recurring?: { [key: string]: ITable[] }
  }
}

export interface ISetScheduledChangesDiscardPopup {
  readonly type: '@@plansForm/SET_SCHEDULED_CHANGES_DISCARD_POPUP'
  payload: boolean
}

export interface ISetIsContinue {
  readonly type: '@@plansForm/SET_IS_DISCARD'
  payload: boolean | undefined
}

export interface ISetPlansBillingFrequency {
  readonly type: '@@plansForm/SET_BILLING_FREQUENCY'
  payload : any
}

export type IPlansFormActions =
  | IPlansFormFetchStructure
  | IPlansFormSetStructure
  | IPlansFormSetLoading
  | IPlansFormSetEditMode
  | IPlansFormSetDriverData
  | ISetFormResetData
  | IResetState
  | ISetSelectedRowId
  | ISetRowWiseTierData
  | IPlansFormFetchHubSpotDetails
  | ISetSectionData
  | ISetPlansDetails
  | ISetselectedPlanRow
  | ISetBillingCurrency
  | ISetZohoAddons
  | ISetAddonTierData
  | ISetCurrencySign
  | ISetViewChangesPopup
  | ISetBillingCycle
  | ISetEditedPlanData
  | ISetScheduledChanges
  | ISetScheduledChangesDiscardPopup
  | ISetIsContinue
  | ISetPlansBillingFrequency
  | IFetchParentSubscriptionId
  | ISetParentSubscriptionId

export interface IClientProperty {
  clientPropertieMasterId: number
  clientPropertyId: number
  defaults: string
  description: string
  isActiveFl: boolean
  modelType: string
  placeHolder: string
  propertyKey: string
  propertyType: string
  propertyValue: string
  showProperty: string
}
export interface IDropdown {
  id: number,
  displayName: string,
  name: string,
  email: string,
  persona: string,
  userName: string
}
export interface IAddOn {
  addonCode: string
  description: string
  endQuantity?: number
  intervalUnit: string
  name: string
  price: number
  pricingScheme: string
  type: string
  unitName: string
  label?: string
  value?: string
  title?: string
  billingStartDate?: string
  billingEndDate?: string
  pricingOption?: string
  rate?: number
  numberOfTransaction?: string
}
export interface IZohoAddon {
  price: number
  pricingOption?: string
  rate?: number
  numberOfTransaction?: string | number
  addonCode: string
  billingStartDate?: string
  billingEndDate?: string
  quantity?: number | string
  currencyCode?: string
  billingFrequency?: string
  name?: string
  type?: string
}
export interface IScheduleChanges {
  zohoAddonDTOs?: IZohoAddon[]
  planQuantity: number
  planUnitRate: number
  planType: string
  subscriptionType?: string
  currencyCode?: string
  billingFrequency?: string
  nextBillingDate?: number
  planName: string
}
export interface IPlansForm {
  scheduledChanges: IScheduleChanges;
  addonTierData: string;
  planTierData?: string;
  hubspotDealId?: number | string
  organization?: string
  entityName?: string
  taxIdentification?: string
  billingAddressDTO?: {
    apartment?: string
    city?: string
    state?: string
    country?: string
    pincode?: string
    locality?: string
    countryId: number
    street?: string
    stateId: number
  }

  businessDevelopmentManager?: IDropdown
  adminContactName?: string
  accountManager?: IDropdown
  operationManager?: IDropdown
  billingContactName?: string
  adminName?: string
  adminContactNo?: string
  adminEmailId?: string
  currencyCode: string
  paymentTerms?: number
  lockInPeriod?: number
  sendActivationLink?: string
  subscriptionType?: string
  planName?: string
  planType: string
  planQuantity: number
  planUnitRate: number
  planPrice?: number
  planPricingOption?: string
  zohoAddonDTOs?: IZohoAddon[]
  clientId?: number | string
  emailAddress?: string
  id?: number
  isActiveFl?: boolean
  modelType?: string
  superClientId?: number
  superClientName?: string
  zohoSubscriptionId?: string | number
  customFieldsEntity?: any
  product: string,
  uatAdminName? : string,
  uatAdminEmail? : string,
  uatAdminMobileNumber?: string,
  legalDocs?: string
}

export interface IBillingFrequency {
  name: string,
  id: number
}
export interface IPlansFormData {
  /** Pending - Add Form Formats for each */
  [key: string]: any
}

export type tShowHide = "show" | "hide";