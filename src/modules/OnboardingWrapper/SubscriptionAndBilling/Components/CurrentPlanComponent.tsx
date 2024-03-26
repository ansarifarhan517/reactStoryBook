import React, { Dispatch } from "react";
import { Typography, IconButton } from "ui-library";
import AccordianAddons from "../Containers/AccordianAddons/AccordianAddons";
import ProgressBarPlanCard from "../Containers/ProgressBarPlanCard";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import { useDispatch } from "react-redux";
import { SubscriptionBillingSummaryAction } from "../Services/SubscriptionAndBilling.action";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import moment from "moment";
import { getPendingPaymentInvoiceList } from "../Services/Utils/HelperFunctions";
import styled from "styled-components";
import { sendGA } from "../../../../utils/ga";

const CurrentPlanStyleWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  flex-direction: column;
`;

const CurrentPlanComponent = () => {
  const dispatch = useDispatch<Dispatch<SubscriptionBillingSummaryAction>>();

  const currentPlanData = useTypedSelector((state) => state.subscriptionBilling.currentplandata);
  const invoiceList = useTypedSelector((state) => state.subscriptionBilling.invoiceList);
  const clientUsage = useTypedSelector((state) => state.subscriptionBilling.clientUsage);

  const signUpType = currentPlanData?.signUpType;
  const zohoDTOs = currentPlanData?.zohoAddonDTOs;

  // Manipulated the invoiceList to get the pending paymentList.
  const pendingPaymentInvoiceList = getPendingPaymentInvoiceList(invoiceList);

  /* Grouping AccordianAddons for the currentPlanComponent based on the identifier passed */
  let accordianAddons = {};
  zohoDTOs?.forEach((element) => {
    if (element?.identifier === "EMAIL") {
      accordianAddons = {
        ...accordianAddons,
        EMAIL: element,
      };
    } else if (element?.identifier === "IVR") {
      accordianAddons = {
        ...accordianAddons,
        IVR: element,
      };
    } else if (element?.identifier === "SMS") {
      accordianAddons = {
        ...accordianAddons,
        SMS: element,
      };
    }
  });

  /* Dynamic Labels: The key that is passed in this customHook, it will be searched for in the session storage. If not found then an API request will be sent to the backend to fetch for the missing keys and later set into the redux. */
  const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.billing}`);
  const currentPlanLabel = dynamicLabels.currentPlanLabel || "Current Plan";
  const EndsOn = dynamicLabels.Endson || "Ends on";
  const modifySubscriptionLabel = dynamicLabels.modifySubscriptionLabel || "Modify Subscription";
  const buySubscriptionLabel = dynamicLabels.buySubscriptionLabel || "Buy Subscription";

  const expiryDescription = (date: any) => {
    return `${EndsOn} ${moment(date).format("MMM Do YYYY")}`;
  };

  // Dispatching action to show the PricingPage.
  const gotoPricingPage = () => {
    sendGA('Trial to paid conversion',`Click on ${currentPlanData?.planType !== "TRIAL" ? "Modify" : "Buy"} Subscription`);
    dispatch({
      type: "@@billingContainer/SET_IS_SUBSCRIPTION_PAGE",
      payload: false,
    });
  };

  return (
    <CurrentPlanStyleWrapper>
      <Typography useStyle={false} fontSize="13px" color="grey.A100" align="left">
        {currentPlanLabel}
      </Typography>
      <ProgressBarPlanCard
        titleFontSize = "17px"
        borderBottom={false}
        titleText={currentPlanData?.planName}
        unitPrice={currentPlanData?.planUnitRate}
        description={expiryDescription(currentPlanData?.clientExpiryDate)}
        subscriptionType={
          currentPlanData?.subscriptionType
        }
        currencySym={currentPlanData?.currencySymbol}
        usedQuantity={clientUsage?.planUsage?.toString()}
        totalQuantity={currentPlanData?.planQuantity}
        type="plan"
      />

      {currentPlanData?.planType !== "TRIAL" &&
        Object.keys(accordianAddons).length ? (
        <AccordianAddons accordianAddons={accordianAddons} />
      ) : null}

      <IconButton
        primary
        onClick={gotoPricingPage}
        id='subscription-actionbar-buy'
        iconVariant={"icomoon-edit-underline"}
        style={{
          width: "27%",
          marginTop: "5px",
          padding: "14px 10px",
          borderRadius: "2px",
          boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.24), 0 0 2px 0 rgba(0, 0, 0, 0.12)"
        }}
        disabled={pendingPaymentInvoiceList?.length || signUpType === "ENTERPRISE" ? true : false} // If there are pending payments the user cannot modify subscription.
      >
        <Typography useStyle={false} fontSize="12px" color="white" align="left">
          {currentPlanData?.planType !== "TRIAL" ? modifySubscriptionLabel : buySubscriptionLabel}
        </Typography>
      </IconButton>
    </CurrentPlanStyleWrapper>
  );
};

export default CurrentPlanComponent;
