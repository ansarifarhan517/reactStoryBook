import React, { Dispatch, useEffect, useState } from "react";
import {
  Typography,
  Box,
  IconButton,
  Modal,
  ModalHeader,
  NumInput,
} from "ui-library";
import { useDispatch } from "react-redux";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import { PricingTabs, TabContainer } from "../Components.styles";
import { SubscriptionBillingSummaryAction } from "../../Services/SubscriptionAndBilling.action";
import {
  EachCardContainer,
  AddonTypeLabelContainer,
  FooterContainer,
  NumInputWrapper,
  NoteWrapper,
} from "./Addon.styles";
import {
  ContentComponent,
  ContentWrapper,
  PrimaryUnderlinedHyperlink,
} from "../../Services/SubscriptionAndBilling.styles";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import { ButtonWithSVG } from "../PricingSummary/PricingSummary";
import { abbreviateAmount, isMultipleOf100 } from "../../Services/Utils/HelperFunctions";
import { sendGA } from "../../../../../utils/ga";

//Taking the key for a particular addon We will return an array of its recurring and onetime type without keys.
interface IPlanCardProps {
  id: string;
  recurringtitleText: string;
  recurringPrice: string;
  recurringUnit: string;
  recurringAddonCode: string;
  currencySym: string;
  recurringDescription?: string;
  recurringIntervalUnit: string;
  recurringAddonIdentifier: string;
  recurringAddonTypeLabel: string;
  recurringAddonBillingCycle: string;
  // subAddonObject: any
}

const Addon = ({
  id,
  recurringtitleText,
  recurringDescription,
  recurringPrice,
  recurringUnit,
  currencySym,
  recurringAddonCode,
  recurringIntervalUnit,
  recurringAddonIdentifier,
  recurringAddonTypeLabel,
  recurringAddonBillingCycle
}: IPlanCardProps) => {

  const dispatch = useDispatch<Dispatch<SubscriptionBillingSummaryAction>>();

  const addonsObject = useTypedSelector(
    (state) => state.subscriptionBilling.addons.fetchedAddonsList
  );

  const entityType = useTypedSelector(
    (state) => state.subscriptionBilling.cart.subscriptionInCart.entityType
  );

  const billingCycle = useTypedSelector(
    (state) => state.subscriptionBilling.cart.subscriptionInCart.billingCycle
  );

  const currentPlanData = useTypedSelector((state) => state.subscriptionBilling.currentplandata);

  // Dynamic labels
  let dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.billing);
  const addontypeLabel = dynamicLabels.addontypeLabel || "Add-on Type";
  const tryNewAddons = dynamicLabels.tryNewAddons || "Try New Add-ons";
  const add = dynamicLabels.buy || "Add";
  const addToCart = dynamicLabels.addToCart || "Add to Cart";
  const cancel = dynamicLabels.cancel || "Cancel";
  const pleaseEnterQuantity = dynamicLabels.pleaseEnterQuantity || "Please add quantity";
  const noteTrialToPaid = dynamicLabels.noteTrialToPaid || "Note:";
  const mutiplesOfHundredMessage = dynamicLabels.mutiplesOfHundredMessage || "Value should always be in multiples of 100";
  const recurringAddonsDisclaimer = dynamicLabels.recurringAddonsDisclaimer || "Recurring Add-ons are added to the plan in the current and subsequent billing cycles. To enjoy Recurring Add-on services, you need to pay for them at the start of every billing cycle as part of plan renewal.";
  const oneTimeDisclaimer = "One-time add-ons will be applicable only to the current Subscription Cycle."

  // Local States
  const [addonPrice, setAddonPrice] = useState(recurringPrice);
  const [isOpen, setIsOpen] = useState(false); // Modal open and close
  const [quantity, setQuantity] = useState(0); // Quantity of each addon
  const [addonType, setAddonType] = useState("recurring"); // Period type for addons, recurring or onetime, By default period should be recurring
  const [addonTypeLabel, setAddonTypeLabel] = useState(recurringAddonTypeLabel);
  const [addonLabel, setAddonLabel] = useState(recurringtitleText);
  const [addonCode, setAddonCode] = useState(recurringAddonCode);
  const [intervalUnit, setIntervalUnit] = useState(recurringIntervalUnit);

  //Show an error if quantity === 0
  const [quantityNotEnteredError, setQuantityNotEnteredError] = useState(false);
  const [multipleOfHundredError, setMultipleOfHundredError] = useState(false);



  // Arrgghh: Everytime this component is called set all the things again.
  useEffect(() => {
    setAddonPrice(recurringPrice);
    setAddonType("recurring");
    setAddonLabel(recurringtitleText);
    setAddonCode(recurringAddonCode);
  }, [
    billingCycle,
    entityType,
    recurringtitleText,
    recurringAddonCode,
    recurringPrice,
  ]);

  const changeAddonSubtype = (subtype: any) => {
    setAddonCode(subtype.addonCode);
    setAddonType(subtype.type);
    setAddonPrice(subtype.price);
    setAddonLabel(subtype.name);
    setIntervalUnit(subtype.intervalUnit);
    setAddonTypeLabel(subtype.addonType);
  };

  const handleAddClick = () => {
    setIsOpen(true);
  };

  const handleNumInputChange = (e) => {
    setQuantity(parseInt(e.target.value));
    setQuantityNotEnteredError(false);
    setMultipleOfHundredError(false);
  };

  const handleNumInputBlur = () => {
    setQuantityNotEnteredError(false);
    setMultipleOfHundredError(false);
    if (quantity === 0 || isNaN(quantity)) {
      setQuantityNotEnteredError(true);
    } else if (
      quantity !== 0 &&
      !isNaN(quantity) &&
      !isMultipleOf100(quantity)
    ) {
      setMultipleOfHundredError(true);
    }
  };
  const handleBuyClick = () => {
    // If quantity is selected then only set the current selected number to redux and close the popup else show error
    setQuantityNotEnteredError(false);
    setMultipleOfHundredError(false);
    if (quantity === 0 || isNaN(quantity)) {
      setQuantityNotEnteredError(true);
    }
    else if (quantity!==0 && !isNaN(quantity) && !isMultipleOf100(quantity)){
      setMultipleOfHundredError(true);
    }
     else {
      if(currentPlanData.planType==="TRIAL"){
        dispatch({
          type: "@@billingContainer/SET_ADDON_IN_CART",
          payload: {
            [addonCode]: {
              addonCode: addonCode,
              name: addonLabel,
              type: addonType,
              price: addonPrice,
              quantity: quantity,
              intervalUnit: intervalUnit,
              addonType: addonTypeLabel,
              addonBillingCycle: recurringAddonBillingCycle,
            },
          },
        });
      } else {
        dispatch({
          type: "@@billingContainer/SET_ADDON_IN_CART",
          payload: {
            [addonCode]: {
              addonCode: addonCode,
              name: addonLabel,
              type: addonType,
              price: addonPrice,
              quantity: quantity,
              intervalUnit: intervalUnit,
            },
          },
        });
      }

      sendGA(currentPlanData?.planType === 'TRIAL' ? 'Trial to paid conversion' : 'Modify Subscription' ,`Click on Buy Add-On`);
      
      // We have to set the limits here only.
      switch (recurringAddonIdentifier) {
        case "IVR":
          if (addonType === "one_time") {
            dispatch({
              type: "@@billingContainer/SET_LIMITS_IN_CART",
              payload: {
                onetimeAddonIvrLimit: quantity.toString(),
              },
            });
            break;
          } else {
            dispatch({
              type: "@@billingContainer/SET_LIMITS_IN_CART",
              payload: {
                ivrLimit: quantity.toString(),
              },
            });
            break;
          }
        case "SMS":
          if (addonType === "one_time") {
            dispatch({
              type: "@@billingContainer/SET_LIMITS_IN_CART",
              payload: {
                onetimeAddonSmsLimit: quantity.toString(),
              },
            });
            break;
          } else {
            dispatch({
              type: "@@billingContainer/SET_LIMITS_IN_CART",
              payload: {
                smsLimit: quantity.toString(),
              },
            });
            break;
          }
        case "EMAIL":
          if (addonType === "one_time") {
            dispatch({
              type: "@@billingContainer/SET_LIMITS_IN_CART",
              payload: {
                onetimeAddonEmailLimit: quantity.toString(),
              },
            });
            break;
          } else {
            dispatch({
              type: "@@billingContainer/SET_LIMITS_IN_CART",
              payload: {
                emailLimit: quantity.toString(),
              },
            });
            break;
          }
      }
      setQuantityNotEnteredError(false);
      setMultipleOfHundredError(false);
      setQuantity(0);
      setIsOpen(false);
    }
  };
  console.log(quantity,"quantity")
  return (
    <>
      <EachCardContainer>
        <ContentWrapper>
          <ContentComponent width="85%">
            <Typography useStyle={false} fontWeight={530} color="grey.900" fontSize="15px">
              {recurringtitleText}
            </Typography>
            <Typography useStyle={false} fontSize="10px" color="grey.900">
              {recurringDescription}
            </Typography>
          </ContentComponent>
          <ContentComponent shiftRight={true}>
            <Typography useStyle={false} fontSize="17px" fontWeight={530} color="grey.900">
              {currencySym}
              {abbreviateAmount(parseFloat(recurringPrice))}
            </Typography>
            <Typography  useStyle={false} fontSize="10px" color="grey.900">
              {"per " + recurringUnit}
            </Typography>
          </ContentComponent>
        </ContentWrapper>
        <FooterContainer>
          <PrimaryUnderlinedHyperlink
            fontSize="12px"
            padding="5px 0 0 0"
            onClick={handleAddClick}
            id={`subscription-action-addon_${id}`}
          >
            {add}
          </PrimaryUnderlinedHyperlink>
        </FooterContainer>
      </EachCardContainer>

      <Modal
        open={isOpen}
        isContentPadding={false}
        onToggle={() => {}}
        size="md"
        children={{
          header: (
            <ModalHeader
              headerTitle={tryNewAddons} // Doubt: Don't have to make this dynamic right
              handleClose={() => setIsOpen(false)}
              imageVariant="icomoon-close"
              headerStyle={{ fontSize: "15px" }}
              width="100%"
            />
          ),
          content: (
            <Box horizontalSpacing="5px" p="15px 15px 0 15px">
              <span>
                <Typography useStyle={false} fontSize="15px" color="grey.900" fontWeight={550}>
                  {recurringtitleText}
                </Typography>
                <AddonTypeLabelContainer>
                  <Typography useStyle={false} fontSize="13px" color="black" fontWeight={550}>
                    {addontypeLabel}
                  </Typography>
                </AddonTypeLabelContainer>
                <Box
                  display="flex"
                  justifyContent="flex-start"
                  m="6px 0 12px 0"
                >
                  <TabContainer>
                    {Object.keys(addonsObject[id]).map(
                      (element: any, index) => {
                        const addonSubtypeObject = addonsObject[id][element];
                        return (
                          <div key={element + index}>
                            <PricingTabs
                              title={
                                addonSubtypeObject.type === "one_time"
                                  ? "One-Time"
                                  : "Recurring"
                              }
                              onClick={() =>
                                changeAddonSubtype(addonSubtypeObject)
                              }
                              style={
                                addonSubtypeObject.type === addonType
                                  ? { background: "#5698d3", color: "#fff" }
                                  : {}
                              }
                            >
                              <Typography
                                useStyle={false}
                                fontSize="13px"
                                lineHeight="25px"
                              >
                                {addonSubtypeObject.type === "one_time"
                                  ? "One-Time"
                                  : "Recurring"}
                              </Typography>
                              <div
                                style={{
                                  color:
                                    addonSubtypeObject.type === addonType
                                      ? "#fff"
                                      : "#5698d3",
                                }}
                              >
                                <Typography
                                  useStyle={false}
                                  fontSize="17px"
                                  color={"primary"}
                                  fontWeight={550}
                                >
                                  {currencySym}
                                  {abbreviateAmount(addonSubtypeObject.price)}
                                </Typography>
                              </div>
                              <Typography useStyle={false} fontSize="10px">
                                {recurringAddonBillingCycle !== "Yearly" &&
                                addonSubtypeObject.type !== "one_time"
                                  ? "per " + recurringUnit + "/month"
                                  : "per " + recurringUnit}
                              </Typography>
                            </PricingTabs>
                          </div>
                        );
                      }
                    )}
                  </TabContainer>
                </Box>
                <Typography useStyle={false} color="grey.900" fontSize="10px" lineHeight="12px">
                  {oneTimeDisclaimer}
                </Typography>
                <Typography useStyle={false} color="grey.900" fontSize="10px" lineHeight="12px">
                  {recurringAddonsDisclaimer}
                </Typography>
                <NumInputWrapper>
                  <NumInput
                    fullWidth
                    id="units"
                    name="units"
                    className="quantity"
                    label="No. of Units"
                    placeholder="Enter No. of units"
                    onChange={handleNumInputChange}
                    onBlur={handleNumInputBlur}
                    required={true}
                    error={quantityNotEnteredError || multipleOfHundredError}
                    errorMessage={quantityNotEnteredError ? pleaseEnterQuantity: mutiplesOfHundredMessage}
                  />
                </NumInputWrapper>
                <NoteWrapper>
                  <Box>
                  <Typography useStyle={false} color="grey.900" fontSize="13px" lineHeight="12px" fontWeight={700}>
                     {noteTrialToPaid}
                  </Typography>
                  </Box>
                  <Box pl="3px">
                  <Typography useStyle={false} color="grey.900" fontSize="13px" lineHeight="12px">
                      {mutiplesOfHundredMessage}
                  </Typography>
                  </Box>
                </NoteWrapper>
              </span>
            </Box>
          ),
          footer: (
            <Box
              horizontalSpacing="10px"
              display="flex"
              justifyContent="flex-end"
              p="0 15px 15px 0"
            >
              <ButtonWithSVG
                borderRadius="1px"
                padding="12px"
                width="24%"
                boxShadow="0 10px 15px -8px rgba(0, 0, 0, 0.24), 0 0 11px 1px rgba(0, 0, 0, 0.12)"
                onClick={handleBuyClick}
                id='subscription_addon-actionBar-buy'
              >
                <img src="images/TrialToPaid_svg/ic-buy.svg" />
                <Typography useStyle={false} fontSize="13px" color="white" align="left">
                  {addToCart}
                </Typography>
              </ButtonWithSVG>
              <IconButton
                iconVariant="icomoon-close"
                iconSize={11}
                onClick={() => setIsOpen(false)}
                id='subscription_addon-actionBar-cancel'
                style={{
                  borderRadius: "1px",
                  boxShadow:
                    "0 10px 15px -8px rgba(0, 0, 0, 0.24), 0 0 11px 1px rgba(0, 0, 0, 0.12)",
                }}
              >
                {cancel}
              </IconButton>
            </Box>
          ),
        }}
      />
    </>
  );
};

export default Addon;

