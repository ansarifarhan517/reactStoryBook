import React, { useState, useEffect, Dispatch } from "react";
import { Typography, IconButton, Box, Modal, ModalHeader, FontIcon, useToast } from "ui-library";
import { useHistory } from "react-router-dom";
import PricingComponent from "../../Components/EachPricingComponent";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import { BillingCycle, BorderBottom } from "./PricingSummary.styles";
import {
  ContentComponent,
  ContentWrapper,
  Description,
} from "../../Services/SubscriptionAndBilling.styles";
import { useDispatch } from "react-redux";
import { SubscriptionBillingSummaryAction } from "../../Services/SubscriptionAndBilling.action";
import styled from "styled-components";
import moment from "moment";
import firebaseRef from "../../../../../utils/firebase";
import { theme } from "../../../../../utils/theme";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import { abbreviateAmount } from "../../Services/Utils/HelperFunctions";
import { sendGA } from "../../../../../utils/ga";


export const ModalContainerToAddPaddingTop = styled.div`
  div[class*="baseStyles__BaseModalBackground-"] {
    padding-top: 145px;
  }
`;

interface IBuyNowButtonProps {
  color?: string;
  background?: string;
  fontSize?: string;
  borderRadius?: string;
  width?: string;
  padding?: string;
  boxShadow?: string;
}

interface IDeleteButtonProps {
  color?: string;
}

export const ButtonWithSVG = styled.button<IBuyNowButtonProps>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  padding: ${(props) => props.padding ? props.padding : "9px 12px"};
  box-shadow: ${(props) => props.boxShadow ? props.boxShadow : "0 2px 2px 0 rgba(0, 0, 0, 0.24), 0 0 2px 0 rgba(0, 0, 0, 0.12)"};
  width: ${(props) => props.width ? props.width : "100px"};
  background: ${(props) => props.background ? props.background : theme.colors.primary.main};
  color: ${(props) => props.color ? props.color : theme.colors.white};
  border-radius: ${(props) => props.borderRadius ? props.borderRadius : "2px"};
  font-size: ${(props) => props.fontSize ? props.fontSize : "13px"};

  img{
    margin-right: 10px;
  }
`;

export const DeleteButtonContainer = styled.div<IDeleteButtonProps>`
  color: ${(props) => (props.color ? props.color : theme.colors.red)};
  cursor: pointer;
  padding: 7px 0 0 7px;
`;

const PricingSummary = () => {
  const dispatch = useDispatch<Dispatch<SubscriptionBillingSummaryAction>>();
  const history = useHistory();
  const toast = useToast();

  // Fetching data from store
  const Cart = useTypedSelector((state) => state.subscriptionBilling.cart);
  const AddonsInCart = Cart.addonsInCart;
  const SubscriptionInCart = Cart.subscriptionInCart;

  const currencySymbol = useTypedSelector(
    (state) => state.subscriptionBilling.currentplandata.currencySymbol
  );
  const isImpersonate = localStorage.getItem('isImpersonate') && localStorage.getItem('isImpersonate') == "true"  ? true : false;

  const currentPlanData = useTypedSelector(
    (state) => state.subscriptionBilling.currentplandata
  );

  const cart = useTypedSelector((state) => state.subscriptionBilling.cart);

  // Working to set Billing Period
  const clientExpiryDate = useTypedSelector(
    (state) => state.subscriptionBilling.currentplandata.clientExpiryDate
  );

  //Local States
  const [isConfirmationModalOpen, setisConfirmationModalOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0); // Todo: Set it to the initial value
  const [months, setMonths] = useState(3);

  //Getting from Local storage.
  const userAccessInfo = JSON.parse(
    localStorage.getItem("userAccessInfo") || ""
  );

  const isClientExpire = userAccessInfo.isClientExpire;
  // Todo: change this format to format from user preference
  /*
    let clientProperties = store.getState().clientProperties;
    moment(value).format(
      clientProperties?.DATEFORMAT.propertyValue.toUpperCase()
    );
  */

  // Labels
  const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.billing}`);
  const summaryLabel = dynamicLabels.summaryLabel || "Summary";
  const billingPeriodLabel = dynamicLabels.billingPeriodLabel || 'Billing Period'
  const addonDetails = dynamicLabels.addonDetails || "Add On Details";
  const modificationConfirmation = dynamicLabels.modificationConfirmation || "Confirm";
  const inclusiveOfTaxes = dynamicLabels.inclusiveOfTaxes || "Inclusive of taxes"
  const modificationDescriptionPaidUser = dynamicLabels.modificationDescriptionPaidUser || "Modifications will be applicable from next billing cycle. Do you want to continue?";
  const modificationDescriptionTrialUser = dynamicLabels.modificationDescriptionTrialUser || "Do you want to continue upgrading your subscription?";
  const yes = dynamicLabels.Yes || "Yes";
  const no = dynamicLabels.No || "No";

  const planType = JSON.parse(localStorage.getItem("userAccessInfo") || "")?.["planType"];
  const startDate = isClientExpire ? moment().format("MMM Do YYYY") : planType === "TRIAL" ? moment().format("MMM Do YYYY") : moment(clientExpiryDate).format("MMM Do YYYY");
  const calculatedBillingPeriod = `${startDate} to ${moment(startDate, "MMM Do YYYY").add(months, "months").subtract(1, "days").format("MMM Do YYYY")}`;

  function getPrice() {
    const planPrice =
      SubscriptionInCart.unitPrice * SubscriptionInCart.quantity;
    let addonsPrice = 0;
    Object.keys(AddonsInCart).map((cartAddonKey) => {
      if (AddonsInCart[cartAddonKey].type.toLowerCase() === "recurring") {
        if (
          AddonsInCart[cartAddonKey].addonCode
            .toLowerCase()
            .includes("quarterly") ||
          AddonsInCart[cartAddonKey].addonCode
            .toLowerCase()
            .includes("quartely")
        ) {
          addonsPrice +=
            AddonsInCart[cartAddonKey].price *
            AddonsInCart[cartAddonKey].quantity *
            3;
        }
        if (
          AddonsInCart[cartAddonKey].addonCode
            .toLowerCase()
            .includes("halfyearly")
        ) {
          addonsPrice +=
            AddonsInCart[cartAddonKey].price *
            AddonsInCart[cartAddonKey].quantity *
            6;
        }
        if (
          AddonsInCart[cartAddonKey].addonCode.toLowerCase().includes("annual")
        ) {
            addonsPrice +=
              AddonsInCart[cartAddonKey].price *
              AddonsInCart[cartAddonKey].quantity;
          }
      } else {
        addonsPrice +=
          AddonsInCart[cartAddonKey].price *
          AddonsInCart[cartAddonKey].quantity;
      }
    });
    return planPrice + addonsPrice;
  }

  const getSocketConnection = () => {
    console.log("Connected to Firebase!!");
    const clientid = JSON.parse(localStorage.getItem("userAccessInfo") || "")?.[
      "subClients"
    ]?.[0]?.["clientId"];

    //Firebase reference Importing
    const PaymentLink = firebaseRef
      .database()
      .ref(`sockets/zohoInvoiceUrl/${clientid}/`);

    //We need to check refernece path where we are going to Listen to the data.
    PaymentLink.on("value", function (snapshot) {
      console.log("On update:", snapshot.val());
      if (snapshot.val()) {
        var reportURL = snapshot.val().value;
        var response = JSON.parse(reportURL);
        console.log(response, "websocket response");

        if (response?.payload?.invoice_url) {
          dispatch({
            type: "@@billingContainer/SET_TRIAL_TO_PAID_INVOICE_URL",
            payload: { trialToPaidPaymentLink: response?.payload?.invoice_url },
          });
          PaymentLink.set("");
        }
      }
    });
  };

  useEffect(() => {
    setTotalPrice(getPrice);
    if (SubscriptionInCart.billingCycle === "Quarterly") {
      setMonths(3);
    } else if (SubscriptionInCart.billingCycle === "Half Yearly") {
      // Todo: verify this.
      setMonths(6);
    } else {
      setMonths(12);
    }
  }, [Cart]);

  const handleBuyConfirmation = () => {
    if (totalPrice < 750) {
      setisConfirmationModalOpen(false);
      toast.add("The purchase value cannot be less than $750. Please contact admin.", "warning", false);
      return;
    }

    sendGA('Trial to paid conversion', 'Buy Now Confirmation');

    if (currentPlanData?.planType === "TRIAL"){
      dispatch({
        type: "@@billingContainer/POST_TRAIL_TO_PAID",
        payload: {
          body:
            cart.subscriptionInCart.entityType === "order"
              ? {
                  subscriptionType: "TRANSACTIONBASED",
                  planType: cart.subscriptionInCart.planCode,
                  orderLimit: cart.subscriptionInCart.quantity,
                  orderBaseCost: cart.subscriptionInCart.unitPrice,
                  currencyCode: currentPlanData?.currencyCode,
                  trialToPaidRequest: true,
                  zohoAddonDTOs: Object.values(cart.addonsInCart).map(
                    (addon) => {
                      let result = {};
                      result.addonCode = addon.addonCode;
                      result.price = addon.price;
                      result.quantity = addon.quantity;
                      result.billingCycle = addon.addonBillingCycle;
                      result.addonType = addon.addonType;
                      return result;
                    }
                  ),
                  zohoSubscriptionId:currentPlanData?.zohoSubscriptionId,
                  customerId:currentPlanData?.zohoCustomerId,
                }
              : {
                subscriptionType: "RESOURCEBASED",
                planType: cart.subscriptionInCart.planCode,
                resourceCount: cart.subscriptionInCart.quantity,
                price: cart.subscriptionInCart.unitPrice,
                currencyCode: currentPlanData?.currencyCode,
                trialToPaidRequest: true,
                zohoAddonDTOs: Object.values(cart.addonsInCart).map(
                  (addon) => {
                    let result = {};
                    result.addonCode = addon.addonCode;
                    result.price = addon.price;
                    result.quantity = addon.quantity;
                    result.billingCycle = addon.addonBillingCycle;
                    result.addonType = addon.addonType;
                    return result;
                  }
                ),
                zohoSubscriptionId:currentPlanData?.zohoSubscriptionId,
                customerId:currentPlanData?.zohoCustomerId,
              },
        },
      });
    } 
    else {
      dispatch({
        type: "@@billingContainer/PUT_SUBSCRIPTION_DATA",
        payload: {
          status: "UPGRADE",
          body: {
            billingFequency: cart.subscriptionInCart.billingCycle,
            endOfTerm: true,
            planType: cart.subscriptionInCart.planCode,
            planQuantity: cart.subscriptionInCart.quantity,
            planUnitRate: cart.subscriptionInCart.unitPrice,
            zohoAddonDTOs: Object.values(cart.addonsInCart),
            emailLimit: cart.limits.emailLimit,
            smsLimit: cart.limits.smsLimit,
            ivrLimit: cart.limits.ivrLimit,
            onetimeAddonOrderLimit: cart.limits.onetimeAddonOrderLimit,
            onetimeAddonEmailLimit: cart.limits.onetimeAddonEmailLimit,
            onetimeAddonSmsLimit: cart.limits.onetimeAddonSmsLimit,
            onetimeAddonIvrLimit: cart.limits.onetimeAddonIvrLimit,
          },
        },
      });
    }
    getSocketConnection();

    setisConfirmationModalOpen(false);
    currentPlanData?.planType === "TRIAL"
      ? history.push({ pathname: "/payNow" })
      : history.push({ pathname: "/confirmSubscription" });
  };

  const removeObjectProperty = (object: any, field: string) => {
    delete object[field];
    return object;
  };

  const handleDeleteItem = (key: string) => {
    // To delete from this key from the state, we are sending the payload as addonsInCart without this field and it will be deleted.
    const filteredAddonsInCart = removeObjectProperty(AddonsInCart, key);

    dispatch({
      type: "@@billingContainer/DELETE_ADDON_IN_CART",
      payload: filteredAddonsInCart,
    });
  };

  const openConfirmationModal = () => {
    sendGA('Trial to paid conversion', 'Click on Buy Now');
    setisConfirmationModalOpen(true);
  };

  return (
    <>
      <BorderBottom padding="0 0 10px 0">
        <Typography useStyle={false} fontSize="15px" color="grey.900" fontWeight={530}>
          {summaryLabel}
        </Typography>
        <BillingCycle>
          <Typography useStyle={false} fontSize="13px" color="grey.A100">
            {billingPeriodLabel}
          </Typography>
          <Typography useStyle={false} fontSize="13px" color="grey.900" fontWeight={530}>
            {calculatedBillingPeriod}
          </Typography>
        </BillingCycle>

        <ContentWrapper padding="20px 0">
          <ContentComponent>
            <Typography useStyle={false} fontSize="13px" color="grey.900">
              {SubscriptionInCart?.planName}
            </Typography>

            <Description fontSize="10px">
              {currencySymbol}
              {SubscriptionInCart?.unitPrice}x{SubscriptionInCart?.quantity}
            </Description>
          </ContentComponent>
          <ContentComponent shiftRight={true}>
            <Typography useStyle={false} fontSize="13px" color="grey.900" fontWeight={530}>
              {currencySymbol}
              {abbreviateAmount(SubscriptionInCart.unitPrice * SubscriptionInCart.quantity)}
            </Typography>
          </ContentComponent>
        </ContentWrapper>
      </BorderBottom>

      {Object.keys(AddonsInCart).length ? (
        <BorderBottom>
          <Typography useStyle={false} fontSize="13px" color="grey.900" fontWeight={530}>
            {addonDetails}
          </Typography>
          {Object.keys(AddonsInCart).map((cartAddonKey) => {
            return (
              <div key={cartAddonKey} style={{ display: "flex", flexDirection: "row" }}>
                <PricingComponent
                  label={AddonsInCart[cartAddonKey].name}
                  quantity={AddonsInCart[cartAddonKey].quantity}
                  price={AddonsInCart[cartAddonKey].price}
                  currencySymbol={currencySymbol}
                  addonCode={AddonsInCart[cartAddonKey].addonCode}
                  addonType={AddonsInCart[cartAddonKey].type}
                />
                <DeleteButtonContainer
                  onClick={() => handleDeleteItem(cartAddonKey)}
                >
                  <FontIcon variant="icomoon-delete-empty" size="sm"  id="subscription_addon-actionbar-delete"/>
                </DeleteButtonContainer>
              </div>
            );
          })}
        </BorderBottom>
      ) : null}

      <ContentWrapper padding="20px 0">
        <ContentComponent>
          <Typography useStyle={false} fontSize="13px" color="black" bold>
            Total
          </Typography>
          <Description>{inclusiveOfTaxes}</Description>
        </ContentComponent>
        <ContentComponent shiftRight={true}>
          <Typography useStyle={false} fontSize="14px" color="black" bold>
            {currencySymbol}
            {abbreviateAmount(totalPrice)}
          </Typography>
        </ContentComponent>
      </ContentWrapper>

    { !isImpersonate ? <ButtonWithSVG width="27%" onClick={openConfirmationModal} id='subscription_confirmation-actionbar-open'>
        <img src="images/TrialToPaid_svg/ic-buy.svg" />
        <Typography useStyle={false} fontSize="13px" color="white" align="left">
          Buy now
        </Typography>  
       </ButtonWithSVG>  : <></>}

      {/* Confirmation Modal */}
      <ModalContainerToAddPaddingTop>
        <Modal
          open={isConfirmationModalOpen}
          onToggle={() => { }}
          size="md"
          children={{
            header: (
              <ModalHeader
                headerTitle={modificationConfirmation}
                handleClose={() => setisConfirmationModalOpen(false)}
              />
            ),
            content: (
              <Typography useStyle={false} fontSize="13px" color="grey.A100">
                {currentPlanData?.planType === "TRIAL"
                  ? modificationDescriptionTrialUser
                  : modificationDescriptionPaidUser}
              </Typography>
            ),
            footer: (
              <Box
                horizontalSpacing="10px"
                display="flex"
                justifyContent="flex-end"
                p="15px"
              >
                <IconButton
                  primary
                  intent="page"
                  iconVariant="check-tick"
                  onClick={handleBuyConfirmation} // Handle Pay now
                  iconSize='lg'
                  style={{padding: "0 15px"}}
                  id='subscription_buy_confirmation-actionbar-yes'
                >
                  {yes}
                </IconButton>
                <IconButton
                  intent="page"
                  iconVariant="icomoon-close"
                  onClick={() => setisConfirmationModalOpen(false)}
                  iconSize='lg'
                  id='subscription_buy_confirmation-actionbar-no'
                >
                  {no}
                </IconButton>
              </Box>
            ),
          }}
        />
      </ModalContainerToAddPaddingTop>
    </>
  );
};

export default PricingSummary;
