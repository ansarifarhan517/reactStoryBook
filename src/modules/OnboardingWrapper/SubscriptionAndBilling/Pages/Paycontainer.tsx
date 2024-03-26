import React, { useState } from "react";
import styled from "styled-components";
import { Box, Typography, Grid } from "ui-library";
import { BreadCrumb } from "ui-library";
import LogoutPopup from "../../../../utils/components/LogoutPopup";
import { sendGA } from "../../../../utils/ga";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { theme } from "../../../../utils/theme";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import { ButtonWithSVG } from "../Containers/PricingSummary/PricingSummary";
// import { handleInvoiceDownloadClick } from "./HelperFunctions"; Todo: Uncomment this!
import { BreadCrumbContainer } from "../Services/SubscriptionAndBilling.styles";
import "./WaveLoading.css";

export const ImageContainer = styled.div`
  width: 92px;
  height: 84px;
`;

export const Classcontainer = styled.div`
  padding: 13px 0;
`;

export const Flexcontainer = styled.div`
  flex-direction: row;
`;

export const FlexcontainerForButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 27%;
  padding-bottom: 12px;
  padding-top: 20px;
`;

export const PayContainerButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 250px;
  margin-top: 13px;
`;

const Paycontainer = () => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const trialToPaidPaymentLink = useTypedSelector(
    (state) => state.subscriptionBilling["trialToPaidPaymentLink"]
  );

  const zohoSubscriptionLink = useTypedSelector(
    (state) => state.subscriptionBilling["zohoSubscriptionLink"]
  );


  const currentPlanData = useTypedSelector((state) => state.subscriptionBilling.currentplandata);

  const breadCrumbOptions = React.useMemo(
    () => [
      {
        id: "SubscriptionPage",
        label: "Subscription & Billing",
      },
      {
        id: "PricingPage",
        label:
          currentPlanData?.planType === "TRIAL"
            ? "Buy Subscription"
            : "Modify Subscription",
      },
      { id: "PayContainer", label: "Confirm Subscription" },
    ],
    []
  );

  const payNow = () => {
    sendGA('Modify Subscription','Click on Pay Now');
    if(currentPlanData?.planType === "TRIAL"){
      window.open(zohoSubscriptionLink,"_self");
    }

    else{
      window.open(trialToPaidPaymentLink, "_blank");
      // Making user Logout
      setShowLogoutPopup(true);
    }
  };

  const [payLaterButtonDisabled, setPayLaterButtonDisabled] = useState(false);

  const payLater = () => {
    sendGA('Modify Subscription','Click on Pay Later');
    setPayLaterButtonDisabled(true);
    // Making user Logout
    setShowLogoutPopup(true);
  };

  // Dynamic Labels
  const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.billing}`);
  const youAreAlmostThere = dynamicLabels.youAreAlmostThere || "You are almost there!";
  // const paymentLinkSentToEmail = dynamicLabels.paymentLinkSentToEmail || "Payment link sent to the registered email address.";
  const payContainerDesc = dynamicLabels.payContainerDesc || "Click Pay Now to complete the payment right now.";
  const payNowLabel = dynamicLabels.payNow || "Pay Now";
  const payLaterLabel = dynamicLabels.payLater || "Pay Later";

  return (
    <>
      <BreadCrumbContainer>
        <BreadCrumb options={breadCrumbOptions} width="100px" />
      </BreadCrumbContainer>
      <Box
        display="flex"
        bgColor="white"
        mt={"20px"}
        p={"20px"}
        style={{
          boxShadow: "0 2px 20px -10px #000",
          width: "100%",
          justifyContent: "flex-start",
          borderRadius: "3px",
        }}
      >
        <Grid
          container
          xs={12}
          sm={6}
          md={6}
          style={{ width: "190px", marginRight: "50px" }}
        >
          <img
            src="images/onboarding/Payment.svg"
            alt="Payment"
            height="100%"
            width="190px"
          />
        </Grid>
        <Flexcontainer>
          <Typography
            useStyle={false}
            fontSize="22px"
            color="black"
            fontWeight={600}
            lineHeight="50px"
          >
            {youAreAlmostThere}
          </Typography>
          <Typography useStyle={false} fontSize="14px" color="black" lineHeight="1.25">
            {payContainerDesc}
          </Typography>
          
          <PayContainerButtonContainer>
            <ButtonWithSVG
              padding="5px 0"
              width="125px"
              disabled={(currentPlanData?.planType === "TRIAL" && !zohoSubscriptionLink) || (currentPlanData?.planType !== "TRIAL" && !trialToPaidPaymentLink) ? true : false}
              onClick={payNow}
            >
              <img
                src="images/TrialToPaid_svg/ic-pay-now.svg"
                alt="Pay Now SVG"
              />
              <Typography useStyle={false} fontSize="13px" color="white" align="left">
                {payNowLabel}
              </Typography>
              {(currentPlanData?.planType === "TRIAL" && !zohoSubscriptionLink) || (currentPlanData?.planType !== "TRIAL" && !trialToPaidPaymentLink) ? (
                <div className="wave-loading" style={{ margin: "7px 0 0 1px" }}>
                  {[1, 2, 3].map((e) => {
                    return <div className="wave-dot" key={e} />;
                  })}
                </div>
              ) : null}
            </ButtonWithSVG>
           {currentPlanData?.planType !== "TRIAL" && <ButtonWithSVG
              padding="5px 0"
              width="105px"
              color={theme.colors.primary.main}
              background="white"
              onClick={payLater}
              disabled={payLaterButtonDisabled}
            >
              <img
                src="images/TrialToPaid_svg/ic-pay-later.svg"
                alt="Pay Later SVG"
              />
              <Typography useStyle={false} fontSize="13px" color="primary.main" align="left">
                {payLaterLabel}
              </Typography>
            </ButtonWithSVG>
            }
          </PayContainerButtonContainer>
        </Flexcontainer>
      </Box>
      {showLogoutPopup ? (
        <LogoutPopup title="Logging Out">
          To map your new subscription you are being logged out, Login again to
          continue.
        </LogoutPopup>
      ) : null}
    </>
  );
};

export default Paycontainer;
