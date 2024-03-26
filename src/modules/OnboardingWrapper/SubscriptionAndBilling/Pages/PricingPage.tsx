import React, { Dispatch } from "react";
import { withReactOptimized } from "../../../../utils/components/withReact";
import UpdateSubscriptionComponent from "../Containers/UpdateSubscriptionComponent";
import DefaultAddons from "../Components/DefaultAddons";
import { Box } from "ui-library";
import PricingSummary from "../Containers/PricingSummary/PricingSummary";
import styled from "styled-components";
import {
  LeftPanel,
  RightPanel,
} from "../Services/SubscriptionAndBilling.styles";
import { BreadCrumb } from "ui-library";
import { BreadCrumbContainer } from "../Services/SubscriptionAndBilling.styles";
import RecurringAddonsSkeleton from "../Components/SkeletonLoaders/RecurringAddonsSkeleton";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { useDispatch } from "react-redux";
import { SubscriptionBillingSummaryAction } from "../Services/SubscriptionAndBilling.action";

export const DisplayWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: row;
`;

const PricingPage = () => {
  const dispatch = useDispatch<Dispatch<SubscriptionBillingSummaryAction>>();
  const currentPlanData = useTypedSelector((state)=> state.subscriptionBilling.currentplandata);
  const addonsLoading = useTypedSelector((state) => state.subscriptionBilling.addonsLoading);
  const breadCrumbOptions = React.useMemo(
    () => [
      {
        id: "SubscriptionPage",
        label: "Subscription & Billing",
        disabled: false,
      },
      {
        id: "PricingPage",
        label:
          currentPlanData?.planType === "TRIAL"
            ? "Buy Subscription"
            : "Modify Subscription",
      },
    ],
    []
  );

  const handleBreadCrumbClick = (optionId: string) => {
    if (optionId === "SubscriptionPage") {
      dispatch({
        type: "@@billingContainer/SET_IS_SUBSCRIPTION_PAGE",
        payload: true,
      });
    }
  };

  return (
    <>
      <BreadCrumbContainer>
        <BreadCrumb
          options={breadCrumbOptions}
          width="100px"
          onClick={(value: string) => handleBreadCrumbClick(value)}
        />
      </BreadCrumbContainer>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <LeftPanel>
          <Box
            bgColor="white"
            mt={"1em"}
            p={"1em"}
            style={{
              boxShadow:
                "0 10px 15px -8px rgba(0, 0, 0, 0.24), 0 0 11px 1px rgba(0, 0, 0, 0.12)",
              padding: "20px",
              borderRadius: "3px",
            }}
          >
            <UpdateSubscriptionComponent />
          </Box>

          {addonsLoading ? <RecurringAddonsSkeleton /> : <DefaultAddons />}
        </LeftPanel>

        <RightPanel>
          <Box
            bgColor="white"
            mt={"1em"}
            p={"1em"}
            style={{
              boxShadow:
                "0 10px 15px -8px rgba(0, 0, 0, 0.24), 0 0 11px 1px rgba(0, 0, 0, 0.12)",
              padding: "20px",
              borderRadius: "3px",
            }}
          >
            <PricingSummary />
          </Box>
        </RightPanel>
      </div>
    </>
  );
};

export default withReactOptimized(PricingPage, false);
