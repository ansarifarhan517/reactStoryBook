import React, { Dispatch } from "react";
import { BreadCrumb } from "ui-library";
import { BreadCrumbContainer } from "../Services/SubscriptionAndBilling.styles";
import { Typography, Box } from "ui-library";
import styled from "styled-components";
import { SubscriptionBillingSummaryAction } from "../Services/SubscriptionAndBilling.action";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";

interface ITypographyContainer {
  margin?: string;
  flexDirection?: string;
}
export const TypographyContainer = styled.div<ITypographyContainer>`
  font-size: 13px;
  margin: ${(props) => (props.margin ? props.margin : "0")};
  flex-direction: ${(props) =>
    props.flexDirection ? props.flexDirection : ""};
`;

const Thankyou = () => {
  const currentPlanData = useTypedSelector((state) => state.subscriptionBilling.currentplandata)
  const dispatch = useDispatch<Dispatch<SubscriptionBillingSummaryAction>>();
  const history = useHistory();

  const breadCrumbOptions = React.useMemo(
    () => [
      { id: "SubscriptionPage", label: "Subscription & Billing", disabled: false },
      {
        id: "PricingPage",
        label:
        currentPlanData?.planType === "TRIAL"
            ? "Buy Subscription"
            : "Modify Subscription",
      },
      { id: "ChangesSavedForNextCycle", label: "Confirm Subscription" },
    ],
    []
  );

  const handleBreadCrumbClick = (optionId: string) => {
    if (optionId === "SubscriptionPage") {
      dispatch({
        type: "@@billingContainer/SET_IS_SUBSCRIPTION_PAGE",
        payload: true,
      });
      dispatch({type: "@@billingContainer/DELETE_ADDON_IN_CART", payload: {}});
      history.push({ pathname: "/" });
    }
  };


  // Dynamic Labels
  const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.billing}`);
  const youAreDone = dynamicLabels.youAreDone || "You are Done!";
  const thankYouPageDesc = dynamicLabels.thankYouPageDesc || "Your subscription modifications are saved successfully. These modifications will be applicable from the next billing cycle onwards.";

  return (
    <>
      <BreadCrumbContainer>
        <BreadCrumb
          options={breadCrumbOptions}
          width="100px"
          onClick={(value: string) => handleBreadCrumbClick(value)}
        />
      </BreadCrumbContainer>
      <Box
        bgColor="white"
        p="20px"
        mt="20px"
        style={{
          borderRadius: "3px",
          boxShadow: "0 2px 20px -9px rgba(0, 0, 0, 0.5)",
          lineHeight: 1,
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
        }}
      >
        <img
          src="images/onboarding/EmailSent.svg"
          alt="Changes saved"
          height="100%"
          width="190px"
          style={{ paddingRight: "20px" }}
        />
        <TypographyContainer flexDirection="column">
        <TypographyContainer margin="7px 0 0 0">
          <Typography useStyle={false}  fontSize="22px" color="black" fontWeight={600}>
            {youAreDone}
          </Typography>
          </TypographyContainer>
          <TypographyContainer margin="7px 0 0 0">
            <Typography useStyle={false} fontSize="14px" lineHeight="1.25" color="black">
              {thankYouPageDesc}
            </Typography>
          </TypographyContainer>
        </TypographyContainer>
      </Box>
    </>
  );
};

export default Thankyou;
