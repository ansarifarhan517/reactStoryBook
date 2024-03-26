import React, { Dispatch, useState} from "react";
import {
  ProgressBar,
  Typography,
  Box,
  SliderWithNumbers,
  IconButton,
  Modal,
  ModalHeader,
  useToast,
} from "ui-library";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import {
  ContentComponent,
  ContentWrapper,
} from "../Services/SubscriptionAndBilling.styles";
import {
  abbreviateAmount,
  getUsagePercentage
} from "../Services/Utils/HelperFunctions";
import { SubscriptionBillingSummaryAction } from "../Services/SubscriptionAndBilling.action";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { IZohoAddons } from "../Services/Subscriptionandbilling.models";
import { TypographyContainer } from "../Pages/Thankyou";
import { ButtonWithSVG } from "./PricingSummary/PricingSummary";
import { sendGA } from "../../../../utils/ga";

interface IPlanCardTopWrapperProps {
  borderBottom: boolean;
}

interface IDirectionRowWrapperAddons {
  justifyContent?: string;
}

export const PlanCardTopWrapper = styled.div<IPlanCardTopWrapperProps>`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  margin: 10px 0;
  border-bottom: ${(props) =>
    props.borderBottom ? "solid 0.5px #c9c9c9" : ""};

  :last-child {
    border-bottom: none;
  }
`;

export const DirectionRowWrapperAddons = styled.div<IDirectionRowWrapperAddons>`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: ${(props) =>
    props.justifyContent === "" ? "flex-end" : "space-between"};
  align-items: center;
  padding: 10px 0;
`;

export const ProgressBarWrapper = styled.div`
  font-size: 10px;
  width: 85%;
`;

export const ModalWrapper = styled.div`
  #modalwrapperid {
    padding-top: 60px;
  }
`;

interface IProgressBarPlanCardProps {
  borderBottom?: boolean;
  titleBold?: boolean;
  titleFontSize?: string;

  titleText: string;
  unitPrice: number;
  subscriptionType?: string;
  totalQuantity?: number;
  currencySym: string;
  usedQuantity?: string; // May not come for addons other than SMS, Email, IVR
  description?: string;
  type?: string;
  addonObject?: IZohoAddons;
}

// This is used for Buy now option i.e for upgrade call.
const ProgressBarPlanCard = ({
  borderBottom = true, // can or cannot come
  titleBold = true,
  titleFontSize = "15px",

  type,
  titleText,
  description,
  unitPrice,
  subscriptionType,
  totalQuantity = 0,
  usedQuantity = "",
  currencySym,
  addonObject,
}: IProgressBarPlanCardProps) => {


  const dispatch = useDispatch<Dispatch<SubscriptionBillingSummaryAction>>();

  const currentPlanData = useTypedSelector(
    (state) => state.subscriptionBilling.currentplandata
  );

  const clientUsage = useTypedSelector(
    (state) => state.subscriptionBilling.clientUsage
  );

  const toast = useToast();

  const progressMin = 1;
  const progressMax = type === "plan" ? subscriptionType === "TRANSACTIONBASED" ? 6000000 : 1000 : 99999;

  const [finalQuantity, setFinalQuantity] = useState(progressMin);
  const [isOpen, setIsOpen] = useState(false);



  // Dynamic Labels
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.billing);

  let subscriptionTypeLabel: string | undefined;
  if (subscriptionType === "RESOURCEBASED") {
    subscriptionTypeLabel = dynamicLabels.deliveryboy_s;
  } else if (subscriptionType === "TRANSACTIONBASED") {
    subscriptionTypeLabel = dynamicLabels.order_s;
  } else {
    subscriptionTypeLabel = subscriptionType;
  }



  const buyMoreHeaderLabel = `${dynamicLabels.buyMore || "Buy More"} ${subscriptionTypeLabel === "unit" ? "Add-ons" : subscriptionTypeLabel}`
  const buy = dynamicLabels.buy || "Buy";
  const cancel = dynamicLabels.cancel || "Cancel";
  const currentBillingCycleDisclaimer = dynamicLabels.currentBillingCycleDisclaimer || " bought will be valid for current billing cycle only.";
  const selectOrEnterAdditionalText = `${dynamicLabels.selectOrEnterAdditionalText} ${subscriptionTypeLabel === "unit" ? "Add-ons" : subscriptionTypeLabel}` || `Select or enter the number of additional ${subscriptionTypeLabel === "unit" ? "Add-ons" : subscriptionTypeLabel}`;

  const buyThisQuantityFn = (clickType: string | undefined) => {
    // Take final data from the addon and dispatch the action Working here.

    sendGA('Update Current Plan',` ${type === 'plan' ? subscriptionType === "RESOURCEBASED" ? "Buy More - DA" : "Buy More - Orders" : `Buy More - Add-Ons-${type}`}`);
    
    if (subscriptionType === "TRANSACTIONBASED" || "RESOURCEBASED") {
      if (finalQuantity + currentPlanData.planQuantity > progressMax) {
        toast.add(`Total ${subscriptionTypeLabel} count cannot be more than ${progressMax}`, "warning", false);
        setIsOpen(false);
        return;
      }
    }

    dispatch({ type: "@@billingContainer/SET_SUB_PAGE_LOADING", payload: true });

    let zohoAddons = currentPlanData?.zohoAddonDTOs;
    zohoAddons?.forEach((elem) => {
      if (
        clickType !== "plan" &&
        addonObject &&
        elem.name === addonObject.name
      ) {
        elem.quantity = elem.quantity + finalQuantity;
      }
    });

    switch (clickType) {
      case "plan":
        dispatch({
          type: "@@billingContainer/PUT_SUBSCRIPTION_DATA",
          payload: {
            status: "UPGRADE",
            body: {
              billingFequency: currentPlanData.billingFequency,
              endOfTerm: false,
              planType: currentPlanData.planType,
              planQuantity: currentPlanData.planQuantity + finalQuantity, // Jo bheja vahi set ho jayega
              planUnitRate: currentPlanData.planUnitRate,
              zohoAddonDTOs: zohoAddons,
              emailLimit: clientUsage.emailLimit.toString(),
              smsLimit: clientUsage.smsLimit.toString(),
              ivrLimit: clientUsage.ivrLimit.toString(),
              onetimeAddonEmailLimit: "0",
              onetimeAddonSmsLimit: "0",
              onetimeAddonIvrLimit: "0",
              onetimeAddonOrderLimit: "0",
            },
          },
        });
        break;

      case "SMS":
        dispatch({
          type: "@@billingContainer/PUT_SUBSCRIPTION_DATA",
          payload: {
            status: "UPGRADE",
            body: {
              billingFequency: currentPlanData.billingFequency,
              endOfTerm: false,
              planType: currentPlanData.planType,
              planQuantity: currentPlanData.planQuantity,
              planUnitRate: currentPlanData.planUnitRate,
              zohoAddonDTOs: zohoAddons,
              emailLimit: clientUsage.emailLimit.toString(), // Jo bhejo vahi set hora hai inme
              smsLimit:
                addonObject?.type === "recurring"
                  ? (clientUsage.smsLimit + finalQuantity).toString()
                  : clientUsage.smsLimit.toString(),
              onetimeAddonSmsLimit:
                addonObject?.type === "one_time"
                  ? finalQuantity.toString()
                  : "0",
              ivrLimit: clientUsage.ivrLimit.toString(),
              onetimeAddonEmailLimit: "0",
              onetimeAddonIvrLimit: "0",
              onetimeAddonOrderLimit: "0",
            },
          },
        });
        break;

      case "EMAIL":
        dispatch({
          type: "@@billingContainer/PUT_SUBSCRIPTION_DATA",
          payload: {
            status: "UPGRADE",
            body: {
              billingFequency: currentPlanData.billingFequency,
              endOfTerm: false,
              planType: currentPlanData.planType,
              planQuantity: currentPlanData.planQuantity,
              planUnitRate: currentPlanData.planUnitRate,
              zohoAddonDTOs: zohoAddons,
              emailLimit:
                addonObject?.type === "recurring"
                  ? (clientUsage.emailLimit + finalQuantity).toString()
                  : clientUsage.emailLimit.toString(),
              onetimeAddonEmailLimit:
                addonObject?.type === "one_time"
                  ? finalQuantity.toString()
                  : "0",
              smsLimit: clientUsage.smsLimit.toString(),
              ivrLimit: clientUsage.ivrLimit.toString(),
              onetimeAddonSmsLimit: "0",
              onetimeAddonIvrLimit: "0",
              onetimeAddonOrderLimit: "0",
            },
          },
        });
        break;

      case "IVR":
        dispatch({
          type: "@@billingContainer/PUT_SUBSCRIPTION_DATA",
          payload: {
            status: "UPGRADE",
            body: {
              billingFequency: currentPlanData.billingFequency,
              endOfTerm: false,
              planType: currentPlanData.planType,
              planQuantity: currentPlanData.planQuantity,
              planUnitRate: currentPlanData.planUnitRate,
              zohoAddonDTOs: zohoAddons,
              emailLimit: clientUsage.emailLimit.toString(),
              smsLimit: clientUsage.smsLimit.toString(),
              ivrLimit:
                addonObject?.type === "recurring"
                  ? (clientUsage.ivrLimit + finalQuantity).toString()
                  : clientUsage.ivrLimit.toString(),
              onetimeAddonIvrLimit:
                addonObject?.type === "one_time"
                  ? finalQuantity.toString()
                  : "0",
              onetimeAddonEmailLimit: "0",
              onetimeAddonSmsLimit: "0",
              onetimeAddonOrderLimit: "0",
            },
          },
        });
        break;

      case "OTHER":
        dispatch({
          type: "@@billingContainer/PUT_SUBSCRIPTION_DATA",
          payload: {
            status: "UPGRADE",
            body: {
              billingFequency: currentPlanData.billingFequency,
              endOfTerm: false,
              planType: currentPlanData.planType,
              planQuantity: currentPlanData.planQuantity,
              planUnitRate: currentPlanData.planUnitRate,
              zohoAddonDTOs: zohoAddons,
              emailLimit: clientUsage.emailLimit.toString(),
              smsLimit: clientUsage.smsLimit.toString(),
              ivrLimit: clientUsage.ivrLimit.toString(),
              onetimeAddonEmailLimit: "0",
              onetimeAddonSmsLimit: "0",
              onetimeAddonIvrLimit: "0",
              onetimeAddonOrderLimit: "0",
            },
          },
        });
        break;
    }

    // close the popup
    setIsOpen(false);
  };

  return (
    <>
      <PlanCardTopWrapper borderBottom={borderBottom}>
        <ContentWrapper padding="5px 0 0 0">
          <ContentComponent width="100%">
            <Typography
              useStyle={false}
              lineHeight="1.45"
              color="grey.900"
              style={{ letterSpacing: "0.15px" }}
              fontSize={titleFontSize}
              bold={titleBold}
            >
              {titleText}
            </Typography>
            <Typography useStyle={false} color="grey.900" fontSize="10px" lineHeight="1.25" style={{ letterSpacing: "0.25px" }}>
              {description}
            </Typography>
          </ContentComponent>
          <ContentComponent shiftRight={true} width="25%">
            <Typography
              useStyle={false}
              fontSize={titleFontSize}
              fontWeight={540}
              color="grey.900"
              lineHeight="1.45"
              style={{ letterSpacing: "0.15px" }}
            >
              {currencySym}
              {abbreviateAmount(unitPrice)}
            </Typography>
            <Typography useStyle={false} fontSize="10px" color="grey.900" lineHeight="1.25" style={{ letterSpacing: "0.25px" }}>
              {"per " + subscriptionTypeLabel}
            </Typography>
          </ContentComponent>
        </ContentWrapper>

        <DirectionRowWrapperAddons justifyContent={usedQuantity}>
          {/* This should only be visible if usedQuantity is passed. */}
          {usedQuantity ? (
            <ProgressBarWrapper>
              <ProgressBar
                labelText={`${usedQuantity}/${totalQuantity} ${subscriptionTypeLabel} consumed`}
                completedPercent={Math.round(
                  getUsagePercentage(usedQuantity, totalQuantity)
                )}
                labelFontSize="10px"
                labelFontColor="grey.900"
                labelFontWeight={600}
              />
            </ProgressBarWrapper>
          ) : null}
          
          {/* if client isn't expired and has subscription and SMB then only show buy now button */}
          {/* {!isClientExpired && currentPlanData?.planType !== "TRIAL" && currentPlanData?.signUpType !== "ENTERPRISE" ? (
            <PrimaryUnderlinedHyperlink
              font-size="12px"
              onClick={() => setIsOpen(true)}
            >
              Buy More
            </PrimaryUnderlinedHyperlink>
          ) : null} commented against 72496 */} 
        </DirectionRowWrapperAddons>
      </PlanCardTopWrapper>
          

      <ModalWrapper>
        <Modal
          open={isOpen}
          isContentPadding={false}
          onToggle={() => { }}
          size="md"
          children={{
            header: (
              <ModalHeader
                headerTitle={buyMoreHeaderLabel} // Doubt: Don't have to make this dynamic right
                handleClose={() => setIsOpen(false)}
                imageVariant="icomoon-close"
                headerStyle={{ fontSize: "15px" }}
                width="100%"
              />
            ),
            content: (
              <div style={{ fontSize: "14px", padding: "15px 15px 0 15px" }}>
                <Box horizontalSpacing="5px">
                  <span>
                    <Typography useStyle={false} font-size="15px" color="black" bold={true}>
                      {selectOrEnterAdditionalText}
                    </Typography>
                    <SliderWithNumbers
                      minRange={progressMin}
                      maxRange={progressMax}
                      selectedRange={finalQuantity}
                      resetOutOfBounds={true}
                      resetInterval={400}
                      setFinalData={(value: number) =>
                        isNaN(value)
                          ? setFinalQuantity(progressMin)
                          : setFinalQuantity(value)
                      }
                    />
                    <TypographyContainer margin="10px 0">
                      <span style={{ fontWeight: 53, color: "#4C4C4C" }}>
                        Note:
                      </span>
                      {` ${subscriptionTypeLabel === "unit" ? "Add-ons" : subscriptionTypeLabel
                        } ${currentBillingCycleDisclaimer}`}
                    </TypographyContainer>
                  </span>
                </Box>
              </div>
            ),
            footer: (
              <Box
                horizontalSpacing="10px"
                display="flex"
                justifyContent="flex-end"
                p="15px"
              >
                <ButtonWithSVG
                  borderRadius="1px"
                  padding="12px"
                  width="18%"
                  boxShadow="0 10px 15px -8px rgba(0, 0, 0, 0.24), 0 0 11px 1px rgba(0, 0, 0, 0.12)"
                  onClick={() => buyThisQuantityFn(type)}
                >
                  <img src="images/TrialToPaid_svg/ic-buy.svg" />
                  <Typography fontSize="13px" color="white" align="left">
                    {buy}
                  </Typography>
                </ButtonWithSVG>
                <IconButton
                  iconVariant="icomoon-close"
                  iconSize={11}
                  style={{
                    borderRadius: "2px",
                    fontSize: "13px",
                  }}
                  onClick={() => setIsOpen(false)}
                >
                  {cancel}
                </IconButton>
              </Box>
            ),
          }}
        />
      </ModalWrapper>
    </>
  );
};

export default ProgressBarPlanCard;
