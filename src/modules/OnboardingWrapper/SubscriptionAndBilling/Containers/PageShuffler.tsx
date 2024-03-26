import React, { useEffect, Dispatch, useState } from "react";
import { useDispatch } from "react-redux";
import { withReactOptimized } from "../../../../utils/components/withReact";
import firebaseRef from "../../../../utils/firebase";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import PaymentStatusPopup from "../Components/PaymentStatusPopup";
import PricingPage from "../Pages/PricingPage";
import { SubscriptionBillingSummaryAction } from "../Services/SubscriptionAndBilling.action";
import SubscriptionPage from "../Pages/SubscriptionPage";
import { abbreviateAmount } from "../Services/Utils/HelperFunctions";

const PageShuffler = () => {
  const dispatch = useDispatch<Dispatch<SubscriptionBillingSummaryAction>>();

  const userAccessInfo = JSON.parse( localStorage.getItem("userAccessInfo") || "{}");
  const baseCurrency = JSON.parse(localStorage.getItem('userAccessInfo') || '{}').baseCurrency;
  const expiryInLocalStorage = userAccessInfo['clientExpiryDt'];

  // Getting redux data
  const isSubscriptionPage = useTypedSelector(
    (state) => state.subscriptionBilling.isSubscriptionPage
  );


  // Local States
  const [isClientExpired, setIsClientExpired] = useState(false);
  const [paymentSuccess, setpaymentSuccess] = useState(false);
  const [isPaymentStatusPopupOpen, setIsPaymentStatusPopupOpen] = useState(false);
  const [amountPayed, setAmountPayed] = useState<number>();
  const [datePayed, setDatePayed] = useState();
  const [currencySymbol, setCurrencySymbol] = useState();
  const [invoice, setInvoice] = useState(null);
  const [currencyCode, setCurrencyCode] = useState(null);




  
  useEffect(() => {
    dispatch({ type: "@@billingContainer/FETCH_CURRENTPLANDATA" });
    dispatch({ type: "@@billingContainer/FETCH_CLIENT_USAGE" });
    dispatch({ type: "@@billingContainer/FETCH_STRUCTURE" });
    dispatch({ type: "@@billingContainer/FETCH_INVOICELIST" });
    dispatch({ type: "@@billingContainer/RESET_ZOHO_SUBSCRIPTION_URL" });
    dispatch({
      type: "@@billingContainer/FETCH_ADDONS",
      payload: {
        currencyCode: baseCurrency,
        billingCycle: "Quarterly",
        addonTypes: "ONETIME,RECURRING",
      },
    }); // Initially it will be called for Quarterly or for the current plan type?? And USD and ONETIME and RECURRING
    dispatch({
      type: "@@billingContainer/FETCH_BILLING_CYCLE_FOR_ORDER",
      payload: { currencyCode: baseCurrency, subscriptionType: "TRANSACTIONBASED" },
    });
    dispatch({
      type: "@@billingContainer/FETCH_BILLING_CYCLE_FOR_DA",
      payload: { currencyCode: baseCurrency, subscriptionType: "RESOURCEBASED" },
    });
  }, []);




  //Firebase Socket Connection Starts Here
  useEffect(() => {
    const getSocketConnection = () => {
      console.log("Connected to Firebase!!, postpayment wala");
      const clientid = JSON.parse(
        localStorage.getItem("userAccessInfo") || ""
      )?.["subClients"]?.[0]?.["clientId"];

      //Firebase reference Importing
      const Paycontainer = firebaseRef
        .database()
        .ref(`sockets/zohoPayment/${clientid}/`);

      //We need to check refernece path where we are going to Listen to the data.
      Paycontainer.on("value", function (snapshot) {
        console.log("On update: ,postpayment wala", snapshot.val());
        if (snapshot.val()) {
          var paymentStats = snapshot.val().value;
          var { payload } = JSON.parse(paymentStats);
          console.log(payload, "websocket response, postpayment wala");

          if (payload.status === "success") {
            setpaymentSuccess(true);
            setIsPaymentStatusPopupOpen(true);
            setAmountPayed(payload?.amount);
            setDatePayed(payload.date);
            setCurrencySymbol(payload.currency_symbol);
            setCurrencyCode(payload?.currency_code);
            setInvoice(payload?.invoices);
            setIsClientExpired(expiryInLocalStorage<payload?.clientExpiryDt)
            Paycontainer.set("");
          } else {
            setpaymentSuccess(false);
            setIsPaymentStatusPopupOpen(true);
            Paycontainer.set("");
          }
        }
      });
    };
    getSocketConnection();
  }, []);

  return (
    <>
      {isSubscriptionPage ? <SubscriptionPage /> : <PricingPage />}
      <PaymentStatusPopup
        amount={
          paymentSuccess && amountPayed
            ? `${currencySymbol} ${abbreviateAmount(amountPayed)}`
            : undefined
        }
        date={paymentSuccess ? datePayed : undefined}
        paymentStatus={paymentSuccess}
        isOpen={isPaymentStatusPopupOpen}
        setIsOpen={setIsPaymentStatusPopupOpen}
        invoice = {invoice ? invoice : undefined}
        currencyCode = {currencyCode ? currencyCode : undefined}
        isClientExpired={isClientExpired}
      />
    </>
  );
};

export default withReactOptimized(PageShuffler, false);
