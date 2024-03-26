import { put, takeLatest, call, all } from "redux-saga/effects";
import apiMappings from "../../../../utils/apiMapping";
import axios from "../../../../utils/axios";
import { getRecurringAddons, idealSeqFromBadSeq } from "./Utils/HelperFunctions";
import {
  IFetchAddons,
  IFetchBillingCycleForDAEntity,
  IFetchBillingCycleForOrderEntity,
  IPostTrailToPaid,
  IPutSubscriptionData,
  SubscriptionBillingSummaryAction,
} from "./SubscriptionAndBilling.action";

const userAccessInfo = JSON.parse(
  localStorage.getItem("userAccessInfo") || "{}"
);

function* fetchUIConfig() {
  const { data, status } = yield call<any>(
    axios.get,
    apiMappings.Saas.uiConfig + "?documentType=" + "Subscription_Billing"
  );
  if (status === 200) {
    yield put({
      type: "@@billingContainer/SET_FETCH_STRUCTURE",
      payload: { data },
    });
  } else {
    console.log("error in fetching details");
  }
}

function* fetchBillingCycleForOrder(action: IFetchBillingCycleForOrderEntity) {
  const { data, hasError } = yield call<any>(
    axios.get,
    apiMappings.Saas.billingcycle,
    {
      params: action.payload,
    }
  );
  const badSequencedData = data.data;
  let idealSequencedData = {
    Quarterly: undefined,
    "Half Yearly": undefined,
    Yearly: undefined,
  };

  Object.keys(idealSequencedData).forEach((i) => {
    idealSequencedData[i] = badSequencedData[i];
  });

  if (!hasError) {
    yield put({
      type: "@@billingContainer/SET_NEWPLAN_ORDER_DATA",
      payload: { ...idealSequencedData },
    });
  } else {
    console.log("error in fetching details");
  }
}

function* fetchBillingCycleForDA(action: IFetchBillingCycleForDAEntity) {
  const { data, status } = yield call<any>(
    axios.get,
    apiMappings.Saas.billingcycleDA,
    {
      params: action.payload,
    }
  );

  const badSequencedData = data.data;
  let idealSequencedData = {
    Quarterly: undefined,
    "Half Yearly": undefined,
    Yearly: undefined,
  };

  idealSequencedData = idealSeqFromBadSeq(badSequencedData, idealSequencedData);

  if (status === 200) {
    yield put({
      type: "@@billingContainer/SET_NEWPLAN_DA_DATA",
      payload: { ...idealSequencedData },
    });
  } else {
    console.log("error in fetching details");
  }
}

function* fetchCurrentPlan() {
  yield put({ type: "@@billingContainer/SET_SUB_PAGE_LOADING", payload: true });
  const { data } = yield call<any>(
    axios.get,
    apiMappings.Saas.currentPlan + "?clientId=" + userAccessInfo.clientId
  );

  if (!data.hasError) {
    yield put({
      type: "@@billingContainer/SET_CURRENTPLANDATA",
      payload: { ...data.data },
    });
    yield put({
      type: "@@billingContainer/SET_SUB_PAGE_LOADING",
      payload: false,
    });
  } else {
    console.log(data?.message);
  }
}

function* fetchClientUsage(): any {
  const { data } = yield call<any>(
    axios.get,
    apiMappings.Saas.clientUsage + "?clientId=" + userAccessInfo.clientId
  );

  if (!data.hasError) {
    yield put({ type: "@@billingContainer/SET_CLIENT_USAGE", payload: data });
  } else {
    console.log(data?.message);
  }
}

function* fetchAddons(action: IFetchAddons) {
  yield put({ type: "@@billingContainer/SET_ADDONS_LOADING", payload: true });
  const { data } = yield call<any>(axios.get, apiMappings.Saas.addonList, {
    params: action.payload,
  });

  if (!data.hasError) {
    const allAddons = data.data;
    let recurringAddons = getRecurringAddons(allAddons);
    
    const idealSequence = {
      SMS: undefined,
      EMAIL: undefined,
      IVR: undefined,
      SUPPORTCHANGE: undefined
    }

    recurringAddons = idealSeqFromBadSeq(recurringAddons, idealSequence);

    yield put({
      type: "@@billingContainer/SET_FETCHED_ADDONS",
      payload: {
        fetchedAddonsList: allAddons,
        recurringAddons,
      },
    });

    yield put({
      type: "@@billingContainer/SET_ADDONS_LOADING",
      payload: false,
    });
  } else {
    console.log(data?.message ,"Error fetching Addons");
  }
}

function* fetchInvoiceList() {
  const { data } = yield call<any>(
    axios.get,
    apiMappings.Saas.invoiceList + "?status=Status.All"
  ); //always getting all the invoice lists
  if (!data.hasError) {
    let allInvoices = data.data;
    yield put({
      type: "@@billingContainer/SET_FETCHED_INVOICELIST",
      payload: allInvoices,
    });
  } else {
    // Have to add a component to turn the loader for the list view off and Have to show no data in case there is no data.
    console.log(data?.message , "Error in fetching Invoice List details");
  }
}

// Put API call for different Subscription scenarios
function* putSubscriptionData(action: IPutSubscriptionData) {
    const { data } = yield call<any>(
      axios.put,
      apiMappings.Saas.putSubscription,
      { ...action.payload.body },
      {
        params: {
          clientId: userAccessInfo.clientId,
          status: action.payload.status,
        },
      }
    );

    // After the put request is sent, then refresh the whole subs page.
    if (!data.hasError) {
      yield* fetchCurrentPlan();
      yield* fetchClientUsage();
      yield* fetchInvoiceList();
    }
    else{
      console.log(data?.message);
    }
}

export function* watchPutUgradeSubscription() {
  yield takeLatest<IPutSubscriptionData>(
    "@@billingContainer/PUT_SUBSCRIPTION_DATA",
    putSubscriptionData
  );
}

function* postTrialToPaid(action: IPostTrailToPaid) {
  console.log(action,"trial to paid action")
  const { data } = yield call<any>(
    axios.post,
    apiMappings.Saas.trialToPaid,
    { ...action.payload.body }
    );
    
  if (data.data.isCreated) {
    yield put({
      type: "@@billingContainer/SET_ZOHO_SUBSCRIPTION_URL",
      payload: {zohoSubscriptionLink:data.data.url},
    });
    yield* fetchCurrentPlan();
    yield* fetchClientUsage();
    yield* fetchInvoiceList();
  }
  else{
    console.log(data?.message);
  }
}

export function* watchTrialToPaid() {
yield takeLatest<IPostTrailToPaid>(
  "@@billingContainer/POST_TRAIL_TO_PAID",
  postTrialToPaid
);
}

export function* watchStructure() {
  yield takeLatest<SubscriptionBillingSummaryAction>(
    "@@billingContainer/FETCH_STRUCTURE",
    fetchUIConfig
  );
}

export function* watchFetchCurrentData() {
  yield takeLatest<SubscriptionBillingSummaryAction>(
    "@@billingContainer/FETCH_CURRENTPLANDATA",
    fetchCurrentPlan
  );
}

export function* watchFetchBillingCycleForOrder() {
  yield takeLatest<IFetchBillingCycleForOrderEntity>(
    "@@billingContainer/FETCH_BILLING_CYCLE_FOR_ORDER",
    fetchBillingCycleForOrder
  );
}

export function* watchFetchBillingCycleForDA() {
  yield takeLatest<IFetchBillingCycleForDAEntity>(
    "@@billingContainer/FETCH_BILLING_CYCLE_FOR_DA",
    fetchBillingCycleForDA
  );
}

export function* watchFetchInvoiceList() {
  yield takeLatest<SubscriptionBillingSummaryAction>(
    "@@billingContainer/FETCH_INVOICELIST",
    fetchInvoiceList
  );
}

export function* watchFetchAddons() {
  yield takeLatest<IFetchAddons>(
    "@@billingContainer/FETCH_ADDONS",
    fetchAddons
  );
}

export function* watchFetchClientUsage() {
  yield takeLatest<SubscriptionBillingSummaryAction>(
    "@@billingContainer/FETCH_CLIENT_USAGE",
    fetchClientUsage
  );
}

export function* watchSubscriptionandBilling() {
  yield all([
    // watchStructure(), Todo: Uncomment this to change the dynamic discount percentage
    watchFetchCurrentData(),
    watchFetchInvoiceList(),
    watchFetchAddons(),
    watchFetchBillingCycleForOrder(),
    watchFetchBillingCycleForDA(),
    watchFetchClientUsage(),
    watchPutUgradeSubscription(),
    watchTrialToPaid(),
  ]);
}
