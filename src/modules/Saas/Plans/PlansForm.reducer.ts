import { IPlansFormReducerState, IPlansFormActions, ISection } from './PlansForm.model';
export const initialState = {
  structure: {},
  accordion: {},
  loading: false,
  isEditMode: false,
  resetData: {
    /** This key corresponds to the key defined in getAPIModuleData() */
    moduleKey: 'plans',
    licenseType: '',

  },
  rowWiseTierData: {},
  selectedRow: { rowId: undefined, section: undefined },
  sectionData: undefined,
  plansDetails: undefined,
  selectedPlanRow: undefined,
  selectedPlan: undefined,
  billingCurrency: undefined,
  plansData: undefined,
  planNameMapping: undefined,
  zohoAddons: undefined,
  addonTierData: undefined,
  currencySign: '$',
  gstStructure: undefined,
  viewChanges: false,
  billlingCycle: '',
  editedPlanData: {
    zohoAddon: [],
    addonTierData: [],
    planTierData: []
  },
  viewChangesData: {
    plan: [],
    oneTime: {},
    recurring: {}
  },
  scheduledChangesDiscardPopup: false,
  isContinue: undefined,
  paymentTermsList: [],
  billingFrequencyMap : {},
  parentSubscriptionId: "",
}

export const PlansReducer = (
  state: IPlansFormReducerState = initialState,
  action: IPlansFormActions): IPlansFormReducerState => {

  switch (action.type) {
    case '@@plansForm/SET_STRUCTURE':
      let paymentTermsList:any = []
      if (action.payload?.subscriptionDetails?.paymentTerms?.dropdownValues) {
        const keys = Object.keys(action.payload?.subscriptionDetails?.paymentTerms?.dropdownValues)
        paymentTermsList = Object.values(action.payload?.subscriptionDetails?.paymentTerms?.dropdownValues)?.map((entry: any, index: any) =>  {return { id: keys[index], name: entry }})
      }
      return {
        ...state,
        structure: action.payload,
        paymentTermsList,
        gstStructure: action.payload?.organizationDetails?.gst_no ? action.payload?.organizationDetails?.gst_no : state.gstStructure
      }

    case '@@plansForm/SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }

    case '@@plansForm/SET_EDIT_MODE':
      return {
        ...state,
        isEditMode: action.payload
      }

    case '@@plansForm/SET_PLANS_DATA':
      return {
        ...state,
        plansData: action.payload
      }

    case '@@plansForm/SET_FORM_RESET_DATA':
      return {
        ...state,
        resetData: action.payload
      }
    case '@@plansForm/SET_SELECTED_ROW':
      return {
        ...state,
        selectedRow: action.payload
      }
    case '@@plansForm/SET_ROWWISE_TIER_DATA':
      return {
        ...state,
        rowWiseTierData: action.payload
      }
    case '@@plansForm/SET_VIEW_CHANGES_POPUP':
      return {
        ...state,
        viewChanges: action.payload
      }
    case '@@plansForm/SET_BILLING_CYCLE':
      return {
        ...state,
        billlingCycle: action.payload
      }
    case '@@plansForm/SET_SECTION_DATA':
      return {
        ...state,
        sectionData: action.payload
      }
    case '@@plansForm/SET_PLAN_DETAILS':
      const planNameMapping = {}
      action?.payload.forEach((element: any) => {
        planNameMapping[element?.value] = element?.label
      });
      return {
        ...state,
        plansDetails: action.payload,
        planNameMapping
      }
    case '@@plansForm/SET_SELECTED_PLAN':
      const selectedValue = action.payload?.find((plan: ISection) => plan.id === 'planName')
      return {
        ...state,
        selectedPlanRow: action.payload,
        selectedPlan: selectedValue ? selectedValue.value : undefined
      }
    case '@@plansForm/SET_BILLING_CURRENCY':
      const currencyMap = {}
      action.payload?.forEach((currency: { name: string, id: number }) => {
        currencyMap[currency.name] = currency
      })
      return {
        ...state,
        billingCurrency: currencyMap
      }

    case '@@plansForm/SET_ZOHO_ADDONS':
      return {
        ...state,
        zohoAddons: action.payload
      }

    case '@@plansForm/SET_ADDON_TIER_DATA':
      return {
        ...state,
        addonTierData: action.payload
      }
    case '@@plansForm/SET_CURRENCY_SIGN':
      return {
        ...state,
        currencySign: action.payload
      }
    case '@@plansForm/SET_EDITED_PLAN_DATA':
      return {
        ...state,
        editedPlanData: action.payload
      }
    case '@@plansForm/SET_SCHEDULED_CHANGES':
      return {
        ...state,
        viewChangesData: action.payload
      }
    case '@@plansForm/SET_SCHEDULED_CHANGES_DISCARD_POPUP':
      return {
        ...state,
        scheduledChangesDiscardPopup: action.payload
      }
    case '@@plansForm/SET_IS_DISCARD':
      return {
        ...state,
        isContinue: action.payload
      }
    case '@@plansForm/SET_BILLING_FREQUENCY':
      return {
        ...state,
        billingFrequencyMap: action.payload
      }  

    case '@@plansForm/SET_PARENT_SUBSCRIPTION_ID': {
      return {
        ...state,
        parentSubscriptionId: action.payload
      }
    }
    case '@@plansForm/RESET_INITIAL_STATE':
      return initialState

    default:
      return state
  }
}