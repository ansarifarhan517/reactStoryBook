import React, { Dispatch, useState } from "react";
import {
  Typography,
  IconButton,
  Modal,
  Box,
  FontIcon,
} from "ui-library";
import styled from "styled-components";
import {
  handleInvoiceDownloadClick,
  // handlePayClick,
} from "../Services/Utils/HelperFunctions";
import { useDispatch } from "react-redux";
import { SubscriptionBillingSummaryAction } from "../Services/SubscriptionAndBilling.action";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import LogoutPopup from "../../../../utils/components/LogoutPopup";

const IconContainer = styled.div`
  width: 30px;
  position: absolute;
  padding: 15px 15px 0 0;
  right: 0%;
`;

const BodyContainer = styled.div`
  text-align: center;
  line-height: normal;
  margin: 0px 15px;
  padding: 0px;

  img {
    margin-bottom: 20px;
  }
`;

const List = styled.ul`
  margin: 20px 0;
  list-style: none;
  font-size: 16px;

  li {
    padding: 3px 0;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px 0;
  font-size: 12px;
`;

interface IPaymentStatus {
  paymentStatus: boolean;
  isOpen: boolean;
  isClientExpired: boolean;
  setIsOpen: Function;
  amount?: string;
  date?: number;
  invoice?: any;
  currencyCode?: string;
}

const PaymentStatusPopup = (props: IPaymentStatus) => {

  const [showLogoutPopUp, setShowLogoutPopUp] = useState(false); // If client is expired then this is set true.

  const dispatch = useDispatch<Dispatch<SubscriptionBillingSummaryAction>>();
  const {
    paymentStatus,
    isOpen,
    setIsOpen,
    date,
    amount,
    invoice,
    currencyCode,
    isClientExpired,
  } = props;

  const handleDownloadClick = () => {
    handleInvoiceDownloadClick(
      invoice[0]?.invoice_id,
      invoice[0]?.invoice_number,
      currencyCode ? currencyCode : ""
    );
  };

  // const closeModal = () => {
  //   setIsOpen(false);
  //   if (isClientExpired) {
  //     setShowLogoutPopUp(true);
  //   } else {
  //     // As soon as popup is closed and client is not expired -> fetch the CurrentPlan, ClientUsage, InvoiceList to render the changes in plan
  //     dispatch({ type: "@@billingContainer/FETCH_INVOICELIST" });
  //     dispatch({ type: "@@billingContainer/FETCH_CURRENTPLANDATA" });
  //     dispatch({ type: "@@billingContainer/FETCH_CLIENT_USAGE" });
  //   }
  // };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace(window.location.origin + '/#/live');
    
    // Reload the page to logout as token is null now.
    window.location.reload();
  };

  // Dynamic Labels
  const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.billing}`);

  const ok = dynamicLabels.ok || "OK";
  const downloadInvoice = dynamicLabels?.downloadInvoice || "Download Invoice";
  const congratsSubSuccess = dynamicLabels?.congratsSubSuccess || "Your subscription payment has been successfully processed.";
  const failPaymentHeader = dynamicLabels?.failPaymentHeader || "Your payment could not be processed.";
  const contactAdminForFurtherSteps = dynamicLabels?.contactAdminForFurtherSteps || "Please contact admin for further steps.";
  const logoutAndLogin = dynamicLabels?.logoutAndLogin || "In order for the changes to take effect, please log out and log back in.";

  return (
    <>
      {paymentStatus ? (
        // If payment is succesful
        <Modal
          open={isOpen}
          onToggle={() => {}}
          size="sm"
          isContentPadding={false}
          children={{
            header: (
              // <IconContainer onClick={closeModal}>
              //   <FontIcon variant="icomoon-close" />
              // </IconContainer>
              <></>
            ),
            content: (
              <BodyContainer>
                <img
                  style={{ marginTop: "20px" }}
                  src="images/il-success.svg"
                  alt="Payment successful"
                />

                <Typography
                useStyle={false}
                  align="center"
                  fontSize="22px"
                  color="black"
                  fontWeight={600}
                >
                  {congratsSubSuccess}
                </Typography>

                <Typography useStyle={false} align="center" color="black" fontSize="16px">
                <div style={{marginTop:"6px"}}>
                  {logoutAndLogin}
                </div>
                </Typography>

                <Typography useStyle={false} align="center" color="black">
                  <List>
                    <li>Payment Date - {date}</li>
                    <li>Amount - {amount}</li>
                  </List>
                </Typography>

                <div
                  style={{
                    cursor: "pointer",
                    fontSize: "16px",
                    color: "#5698d3",
                    fontWeight: 500,
                  }}
                  onClick={handleDownloadClick}
                >
                  {downloadInvoice}
                </div>
              </BodyContainer>
            ),
            footer: (
              <ButtonContainer>
                <IconButton
                  primary
                  iconVariant={""}
                  iconSize={1}
                  style={{
                    borderRadius: "2px",
                    boxShadow: "0 2px 11px -5px #000",
                    padding: "0px 25px",
                  }}
                  onClick={handleLogout}
                >
                  <Typography useStyle={false} fontSize="12px">Logout</Typography>
                </IconButton>
              </ButtonContainer>
            ),
          }}
        />
      ) : (
        // If payment fails
        <Modal
          open={isOpen}
          onToggle={() => {}}
          isContentPadding={false}
          size="sm"
          children={{
            header: (
              <IconContainer onClick={() => setIsOpen(false)}>
                <FontIcon variant="icomoon-close" />
              </IconContainer>
            ),
            content: (
              <BodyContainer>
                <img
                  style={{ marginTop: "20px" }}
                  src="images/il-failure.svg"
                  alt="Payment failed"
                />

                <Typography
                useStyle={false}
                  align="center"
                  fontSize="22px"
                  color="black"
                  fontWeight={600}
                >
                  {failPaymentHeader}
                </Typography>

                <Box pt="15px">
                  <Typography useStyle={false} align="center" color="black" fontSize="14px">
                    {contactAdminForFurtherSteps}
                  </Typography>
                </Box>
              </BodyContainer>
            ),
            footer: (
              <ButtonContainer>
                <IconButton
                  iconVariant={"icomoon-close"}
                  style={{
                    borderRadius: "2px",
                    boxShadow: "0 2px 11px -5px #000",
                    padding: "0px 25px",
                    marginLeft: "5px",
                    fontSize: "10px",
                  }}
                  intent="default"
                  onClick={() => setIsOpen(false)}
                  primary
                >
                  {ok}
                </IconButton>
              </ButtonContainer>
            ),
          }}
        />
      )}
      {showLogoutPopUp ? (
        // If client has expired and ok on Success Modal is clicked showLogoutPopUp becomes true, and below Logoutpopup will be rendered.
        <LogoutPopup title="Logging Out">
          To map your new subscription you are being logged out, Login again to
          continue.
        </LogoutPopup>
      ) : null}
    </>
  );
};

export default PaymentStatusPopup;
