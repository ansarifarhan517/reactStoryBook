export interface ICurrentDataPayload {
  isActiveFl: boolean;
  email?: string;
  planType: string;
  zohoSubscriptionId: string;
  currencyCode: string;
  paymentTerms: number;
  zohoAddonDTOs?: Array<IZohoAddons>;
  subscriptionType?: string; // Doubt: can come and not come based on whether its a trial or paid account
  subscriptionActivationDate: number;
  nextBillingDate: number;
  billingFequency: string;
  planName: string;
  region: string;
  planQuantity: number;
  planUnitRate: number;
  planPrice: number;
  trialToPaidRequest: false;
  clientExpiryDate: number;
  currencySymbol: string;
  signUpType: string;
  zohoCustomerId: string;
}

export interface IZohoAddons {
  addonCode: string;
  name?: string;
  type: string;
  intervalUnit: string;
  description?: string;
  price: number;
  quantity: number;
  identifier?: string;
}

export interface IFetchedAddonsPayload {
  fetchedAddonsList: Object; // All addons state object
  recurringAddons: Object; // Manipulated recurring addons state object
}

export interface IFetchedInvoiceListPayload {
  balance?: number; // Balance which has to be payed
  total?: number; // Total payment that had to be payed
  created_time?: string; // Date on which this transaction happened : "2022-02-24T02:41:03-0800";
  currency_code?: string; // Can be USD or INR
  currency_symbol?: string; // Symbol depending on the currency
  customer_id?: string; // Customer ID
  customer_name?: string; // Customer Name
  due_date?: string; // Due Date : "2022-03-17";
  invoice_date?: string; // Invoice Date
  invoice_id?: string; // Invoice ID
  number?: string; // This is the Invoice ID we have to show like label: "INV-017017"
  status?: string; //"partially_paid";
  transaction_type?: string; //"upgrade";

  email?: string; //This can be null too: "";
  payment_expected_date?: string; // Expected date for payment, can give null here: "";
}


export interface INewPlanDataPayload {
  da: Object;
  order: Object;
}

export interface ISubscriptionInCartState {
  entityType: string;
  billingCycle: string;
  
  planCode: string;
  planName: string;
  quantity: number;
  unitPrice: number;
  //Todo: Billing period will also be required!
}

export interface ILimitsInCart {
  emailLimit: string;
  smsLimit: string;
  ivrLimit: string;
  
  onetimeAddonOrderLimit: string;
  onetimeAddonEmailLimit: string;
  onetimeAddonSmsLimit: string;
  onetimeAddonIvrLimit: string;
}

export interface IClientUsagePayload {
  emailUsage: number;
  smsUsage: number;
  ivrUsage: number;
  planUsage: number;
  emailLimit: number;
  smsLimit: number;
  ivrLimit: number;
  orderLimit: number;
  resourceLimit: number;
}

// Styled Component Props.
export interface ISubscriptionBillingMasterContainerProps{
  clientExpired: boolean;
}

export interface ITextAlignmentProps {
  shiftRight?: boolean;
  width?: string;
}

export interface IContentWrapperProps {
  padding?: string;
}

export interface IPrimaryUnderlineHyperlinkProps {
  fontSize?: string;
  color?: string;
  padding?: string;
}

export interface IStatusDisplayBoxProps {
  payStatus: string;
}