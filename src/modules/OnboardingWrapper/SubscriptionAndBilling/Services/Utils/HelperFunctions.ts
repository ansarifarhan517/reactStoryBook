import { IFetchedInvoiceListPayload } from "../Subscriptionandbilling.models";
// import { hybridRouteTo } from "./../../../utils/hybridRouting";
import FileSaver from "file-saver";
// import { supportTicketRedirectFunction } from "./SubscriptionAndBillingMasterEntry";
import axios from "../../../../../utils/axios";
import apiMappings from "../../../../../utils/apiMapping";

// Used in SubscriptionBilling.effects.ts
export function getRecurringAddons(addonsObject: any) {
  let reccuringAddonObj = {};
  Object.keys(addonsObject).map((mixedAddons) => {
    Object.values(addonsObject[mixedAddons]).forEach((element: any) => {
      if (element.type === "recurring") {
        reccuringAddonObj[mixedAddons] = element;
      }
    });
  });
  return reccuringAddonObj;
}

// Used in Progress Bar Plan Card
export const getUsagePercentage = (
  usedQuantity: string,
  totalQuantity: number
) => {
  let total = totalQuantity;
  if (!total) {
    total = 1;
  }
  let used =
    typeof usedQuantity === "string" ? parseInt(usedQuantity) : usedQuantity;
  return (used / total) * 100;
};

// Used in subscriptionAndBillingProd
export const getBillingHistoryInvoiceList = (invoiceList: any[], listSize: number) => {
  let billingHistoryList: Array<IFetchedInvoiceListPayload> = [];
  if (invoiceList.length != 0) {
    billingHistoryList = invoiceList.reduce(
      (acc, curr) => {
        // Showing only listSize entries
        if (acc.length < listSize && (curr.status === "paid" || curr.status === "void" || curr.status === "partially_paid")) {
          acc.push(curr);
        }
        return acc;
      }, []
    );
  }
  return billingHistoryList;
};

// Used in subscriptionAndBillingProd and current Plan component.
export const getPendingPaymentInvoiceList = (invoiceList: any[]) => {
  let pendingPayList: Array<IFetchedInvoiceListPayload> = [];
  if (invoiceList.length != 0) {
    pendingPayList = invoiceList.filter(
      (element) =>
        element.status === "sent" || element.status === "partially_paid" || element.status === "overdue"
    );
  }
  return pendingPayList;
};

// Used in AddonAccordian
export const getUsedQuantity = (
  addonSubtypeKey: string,
  clientUsageObject: Object
): number => {
  let temp = 0;
  Object.keys(clientUsageObject).map((key) => {
    if (key.includes(addonSubtypeKey.toLowerCase()) && key.includes("Usage")) {
      temp = clientUsageObject[key];
    }
  });
  return temp;
};

export const getTotalQuantity = (
  addonSubtypeKey: string,
  clientUsageObject: Object
): number => {
  let temp = 0;
  Object.keys(clientUsageObject).map((key) => {
    if (key.includes(addonSubtypeKey.toLowerCase()) && key.includes("Limit")) {
      temp = clientUsageObject[key];
    }
  });
  return temp;
};

// Used in payStatusPopup and expandableListHeaders
export const handleInvoiceDownloadClick = async (
  invoiceId: string,
  invoiceHash: string,
  currencyCode: string
) => {
  const params = {
    invoiceId: invoiceId,
    currencyCode: currencyCode,
  };
  try {
    const { data } = await axios.get(apiMappings.Saas.invoiceDownload, {
      params,
      responseType: "arraybuffer",
    });

    if (!data.hasError) {
      FileSaver.saveAs(
        new Blob([data], { type: "application/pdf" }),
        `${invoiceHash}.pdf`
      );
    }
  } catch (err) {
    // Handle Error Here
    console.error("Found error", err);
  }
};



// To be used in expandableListHeaders and payNow button in payContainer
interface IPaymentParams {
  invoiceId: string;
  countryCode: string;
}

export const handlePayClick = async (params: IPaymentParams) => {
  try {
    const { data } = await axios.get(apiMappings.Saas.paymentLink, {
      params,
    });

    if (!data.hasError) {
      const downlaodLink = data.data;
      window.open(downlaodLink, "_blank");
    }
  } catch (err) {
    // Handle Error Here
    console.error("Found error", err);
  }
};

export function abbreviateAmount(amount: number) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}


export function idealSeqFromBadSeq (badSeq: any, idealSeq: any){
  Object.keys(idealSeq).forEach((i) => {
    idealSeq[i] = badSeq[i];
  });

  return idealSeq;
}

export function isMultipleOf100(number:number) {
  return number % 100 === 0;
};