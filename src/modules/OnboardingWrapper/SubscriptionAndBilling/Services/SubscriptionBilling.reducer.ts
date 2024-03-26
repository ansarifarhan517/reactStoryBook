import { SubscriptionBillingSummaryAction } from "./SubscriptionAndBilling.action";
import {
  IFetchedInvoiceListPayload,
  ICurrentDataPayload,
  ISubscriptionInCartState,
  INewPlanDataPayload,
  IFetchedAddonsPayload,
  ILimitsInCart,
  IClientUsagePayload,
} from "./Subscriptionandbilling.models";

export interface ISubscriptionBillingSummaryState {
  addonsLoading: boolean;
  subscriptionPageLoading: boolean;
  structure: any;
  currentplandata: ICurrentDataPayload; //ICurrentDataPaylaod can be added as an interface here
  newPlanData: INewPlanDataPayload;

  isSubscriptionPage: boolean;

  // Cart state for buying
  cart: {
    subscriptionInCart: ISubscriptionInCartState;
    addonsInCart: Object; // Showing condion is if Object.keys(Addons).length > 0
    limits: ILimitsInCart;
  };

  invoiceList: Array<IFetchedInvoiceListPayload>; // All invoice list state object array
  addons: IFetchedAddonsPayload;
  clientUsage: IClientUsagePayload;
}

export const initialState: ISubscriptionBillingSummaryState = {
  addonsLoading: true,
  subscriptionPageLoading: true,
  structure: {},

  currentplandata: {
    isActiveFl: false,
    planType: "",
    zohoSubscriptionId: "",
    zohoCustomerId: "",
    currencyCode: "",
    paymentTerms: 0,
    zohoAddonDTOs: [],
    subscriptionType: "", // Doubt: can come and not come based on whether its a trial or paid account
    subscriptionActivationDate: 0,
    nextBillingDate: 0,
    billingFequency: "",
    planName: "",
    region: "",
    planQuantity: 0,
    planUnitRate: 0,
    planPrice: 0,
    trialToPaidRequest: false,
    clientExpiryDate: 0,
    currencySymbol: "",
    signUpType: "",
  },

  newPlanData: {
    order: {},
    da: {},
  },

  isSubscriptionPage: true,

  cart: {
    subscriptionInCart: {
      entityType: "",
      billingCycle: "",

      planCode: "",
      planName: "",
      quantity: 0,
      unitPrice: 0,
    },
    addonsInCart: {},
    limits: {
      emailLimit: "0",
      smsLimit: "0",
      ivrLimit: "0",

      onetimeAddonOrderLimit: "0",
      onetimeAddonEmailLimit: "0",
      onetimeAddonSmsLimit: "0",
      onetimeAddonIvrLimit: "0",
    },
  },

  invoiceList: [],
  addons: {
    fetchedAddonsList: {},
    recurringAddons: {},
  },
  clientUsage: {
    emailUsage: 0,
    smsUsage: 0,
    ivrUsage: 0,
    planUsage: 0,
    emailLimit: 0,
    smsLimit: 0,
    ivrLimit: 0,
    orderLimit: 0,
    resourceLimit: 0,
  },
};

const SubscriptionBillingSummaryReducer = (
  state = initialState,
  action: SubscriptionBillingSummaryAction
): ISubscriptionBillingSummaryState => {
  switch (action.type) {
    case "@@billingContainer/SET_IS_SUBSCRIPTION_PAGE":
      return {
        ...state,
        isSubscriptionPage: action.payload,
      };

    case "@@billingContainer/SET_FETCH_STRUCTURE":
      return {
        ...state,
        structure: {
          ...action.payload,
        },
      };

    // Sets Current Plan data into the State
    case "@@billingContainer/SET_CURRENTPLANDATA":
      return {
        ...state,
        currentplandata: {
          ...action.payload,
        },
      };

    // Sets All Invoices into the State
    case "@@billingContainer/SET_FETCHED_INVOICELIST":
      return {
        ...state,
        invoiceList: [...action.payload],
      };

    // Sets All Addons that are fetched into the State
    case "@@billingContainer/SET_FETCHED_ADDONS":
      return {
        ...state,
        addons: { ...action.payload },
      };

    // Sets the Order value for the New Plan data
    case "@@billingContainer/SET_NEWPLAN_ORDER_DATA":
      return {
        ...state,
        newPlanData: {
          ...state.newPlanData,
          order: {
            ...action.payload,
          },
        },
      };

    // Sets the DA value for the New Plan data
    case "@@billingContainer/SET_NEWPLAN_DA_DATA":
      return {
        ...state,
        newPlanData: {
          ...state.newPlanData,
          da: {
            ...action.payload,
          },
        },
      };

    // Sets the selected addons into cart
    // NOTE: In order to reset addons in cart just pass the payload as an empty object.
    case "@@billingContainer/SET_ADDON_IN_CART":
      return {
        ...state,
        cart: {
          ...state.cart,
          addonsInCart: {
            ...state.cart.addonsInCart,
            ...action.payload,
          },
        },
      };

    case "@@billingContainer/DELETE_ADDON_IN_CART":
      return {
        ...state,
        cart: {
          ...state.cart,
          addonsInCart: {...action.payload}
        },
      };


    // Sets the selected subscription Plan into cart
    case "@@billingContainer/SET_SUBSCRIPTION_IN_CART":
      return {
        ...state,
        cart: {
          ...state.cart,
          subscriptionInCart: { ...action.payload },
        },
      };

    case "@@billingContainer/SET_LIMITS_IN_CART":
      return {
        ...state,
        cart: {
          ...state.cart,
          limits: { ...state.cart.limits, ...action.payload },
        },
      };

    case "@@billingContainer/SET_CLIENT_USAGE":
      return {
        ...state,
        clientUsage: { ...action.payload },
      };

    case "@@billingContainer/SET_ADDONS_LOADING":
      return {
        ...state,
        addonsLoading: action.payload,
      };

    case "@@billingContainer/SET_SUB_PAGE_LOADING":
      return {
        ...state,
        subscriptionPageLoading: action.payload,
      };

    case "@@billingContainer/SET_TRIAL_TO_PAID_INVOICE_URL":
      return {
        ...state,
        ...action.payload,
      }

    case "@@billingContainer/SET_ZOHO_SUBSCRIPTION_URL":
      return {
        ...state,
        ...action.payload,
      }

    case "@@billingContainer/RESET_ZOHO_SUBSCRIPTION_URL":
      if(state.hasOwnProperty("zohoSubscriptionLink")){
        let modifiedState = {...state}
        delete modifiedState["zohoSubscriptionLink"]
        return {...modifiedState}
      }
      return {
        ...state
      }

    default:
      return state;
  }
};

export default SubscriptionBillingSummaryReducer;
