import { IFetchedInvoiceListPayload } from "./Subscriptionandbilling.models";

// ----> API Actions: Actions to fetch, put data from API's
export interface IFetchInvoiceList {
  readonly type: "@@billingContainer/FETCH_INVOICELIST";
}

export interface IFetchAddons {
  readonly type: "@@billingContainer/FETCH_ADDONS";
  payload: {
    currencyCode: string; // USD
    billingCycle: string; // Yearly, Quarterly
    addonTypes: string;
  };
}

export interface IFetchOfferStructure {
  readonly type: "@@billingContainer/FETCH_STRUCTURE";
}

export interface IFetchBillingCycleForOrderEntity {
  readonly type: "@@billingContainer/FETCH_BILLING_CYCLE_FOR_ORDER";
  payload: any;
}

export interface IFetchBillingCycleForDAEntity {
  readonly type: "@@billingContainer/FETCH_BILLING_CYCLE_FOR_DA";
  payload: any;
}

export interface IFetchCurrentplanData {
  readonly type: "@@billingContainer/FETCH_CURRENTPLANDATA";
}

export interface IFetchClientUsage {
  readonly type: "@@billingContainer/FETCH_CLIENT_USAGE";
}

export interface IPutSubscriptionData {
  readonly type: "@@billingContainer/PUT_SUBSCRIPTION_DATA";
  payload: { status: string; body: Object };
}

export interface IPostTrailToPaid {
  readonly type: "@@billingContainer/POST_TRAIL_TO_PAID";
  payload: { body: Object };
}

// -----> Set Actions : Actions to set the fetched data in the store
export interface ISetFetchedInvoiceList {
  readonly type: "@@billingContainer/SET_FETCHED_INVOICELIST";
  payload: [IFetchedInvoiceListPayload];
}

export interface ISetFetchedAddons {
  readonly type: "@@billingContainer/SET_FETCHED_ADDONS";
  payload: {
    fetchedAddonsList: {};
    recurringAddons: {};
  };
}

export interface ISetAddonInCart {
  readonly type: "@@billingContainer/SET_ADDON_IN_CART";
  payload: any;
}


export interface IDeleteAddonInCart {
  readonly type: "@@billingContainer/DELETE_ADDON_IN_CART";
  payload: any;
}

export interface ISetSubscriptionInCart {
  readonly type: "@@billingContainer/SET_SUBSCRIPTION_IN_CART";
  payload: any;
}

export interface ISetCurrentplanData {
  readonly type: "@@billingContainer/SET_CURRENTPLANDATA";
  payload: any;
}

export interface ISetIOfferStructure {
  readonly type: "@@billingContainer/SET_FETCH_STRUCTURE";
  payload: any;
}

export interface ISetIsSubscriptionPage {
  readonly type: "@@billingContainer/SET_IS_SUBSCRIPTION_PAGE";
  payload: boolean;
}

export interface ISetNewPlanDA {
  readonly type: "@@billingContainer/SET_NEWPLAN_DA_DATA";
  payload: any;
}

export interface ISetNewPlanOrder {
  readonly type: "@@billingContainer/SET_NEWPLAN_ORDER_DATA";
  payload: any;
}

export interface ISetClientUsage {
  readonly type: "@@billingContainer/SET_CLIENT_USAGE";
  payload: any;
}

export interface ISetLimitsInCart{
  readonly type: "@@billingContainer/SET_LIMITS_IN_CART"
  payload: any;
}

export interface ISetAddonsLoading {
  readonly type: "@@billingContainer/SET_ADDONS_LOADING";
  payload: boolean;
}

export interface ISetClientUsageLoading {
  readonly type: "@@billingContainer/SET_SUB_PAGE_LOADING";
  payload: boolean;
}

export interface ISetTrialToPaidInvoiceLink {
  readonly type: "@@billingContainer/SET_TRIAL_TO_PAID_INVOICE_URL";
  payload: any;
}

export interface ISetZohoSubscriptionLink {
  readonly type: "@@billingContainer/SET_ZOHO_SUBSCRIPTION_URL";
  payload: any;
}

export interface IResetZohoSubscriptionLink {
  readonly type: "@@billingContainer/RESET_ZOHO_SUBSCRIPTION_URL";
}


export type SubscriptionBillingSummaryAction =
  | IFetchAddons
  | IFetchOfferStructure
  | IFetchInvoiceList
  | IFetchBillingCycleForOrderEntity
  | IFetchBillingCycleForDAEntity
  | IFetchClientUsage
  | IPutSubscriptionData
  | IPostTrailToPaid
  | ISetIsSubscriptionPage
  | ISetAddonInCart
  | IDeleteAddonInCart
  | ISetLimitsInCart
  | ISetSubscriptionInCart
  | ISetIOfferStructure
  | IFetchCurrentplanData
  | ISetCurrentplanData
  | ISetFetchedInvoiceList
  | ISetFetchedAddons
  | ISetNewPlanDA
  | ISetNewPlanOrder
  | ISetClientUsage
  | ISetClientUsageLoading
  | ISetAddonsLoading
  | ISetTrialToPaidInvoiceLink
  | ISetZohoSubscriptionLink
  | IResetZohoSubscriptionLink;

