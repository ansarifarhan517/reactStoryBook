import React, { useEffect, Dispatch, useState } from "react";
import { Typography, SliderWithNumbers, Box, IconButton } from "ui-library";
import { TabContainer, PricingTabs } from "./Components.styles";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import { useDispatch } from "react-redux";
import { SubscriptionBillingSummaryAction } from "../Services/SubscriptionAndBilling.action";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { abbreviateAmount } from "../Services/Utils/HelperFunctions";
import styled from "styled-components";

const UpdateSubscriptionStyleWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  flex-direction: column;
`;

const UpdateSubscriptionComponent = () => {
  const dispatch = useDispatch<Dispatch<SubscriptionBillingSummaryAction>>();

  // Fetching data from Redux
  const newPlanData = useTypedSelector(
    (state) => state.subscriptionBilling.newPlanData
  );

  const currentPlanData = useTypedSelector(
    (state) => state.subscriptionBilling.currentplandata
  );

  const baseCurrency = JSON.parse(
    localStorage.getItem("userAccessInfo") || "{}"
  ).baseCurrency;

  const currencySym = useTypedSelector(
    (state) => state.subscriptionBilling.currentplandata.currencySymbol
  );

  // Local States
  const [selectedEntity, setselectedEntity] = React.useState("order");
  const [localBillingCycle, setbillingCycle] = useState("Quarterly");
  const [localPlanQuantity, setLocalPlanQuantity] = useState<number>(4800);
  const [localPlanUnitPrice, setlocalPlanUnitPrice] = useState(
    newPlanData[selectedEntity][localBillingCycle].recurring_price
  ); // This is done like this in string to avoid error.

  const changeBillingCycle = (billingCycleKey: string) => {
    setbillingCycle(billingCycleKey);
    setlocalPlanUnitPrice(
      newPlanData[selectedEntity][billingCycleKey].recurring_price
    );
    setLocalPlanQuantity(MinLimitForPlans(selectedEntity, billingCycleKey));

    // Dispatch a call to Fetch the addons API's based on country code, billingCycleKey
    dispatch({
      type: "@@billingContainer/FETCH_ADDONS",
      payload: {
        currencyCode: baseCurrency, // Todo: Ask if we have to make it dynamic
        billingCycle: billingCycleKey,
        addonTypes: "ONETIME,RECURRING",
      },
    });

    // As soon as Billing Cycle is changed, Reset the addons in the cart, by passing the payload as empty object.
    dispatch({ type: "@@billingContainer/DELETE_ADDON_IN_CART", payload: {} });
  };

  const changeEntitytype = (entityKey: string) => {
    setselectedEntity(entityKey);
    setlocalPlanUnitPrice(
      newPlanData[entityKey][localBillingCycle].recurring_price
    );
    setLocalPlanQuantity(MinLimitForPlans(entityKey, localBillingCycle));

    // As soon as Entity type is changed, Reset the addons in the cart, by passing the payload as empty object.
    dispatch({
      type: "@@billingContainer/SET_ADDON_IN_CART",
      payload: {},
    });
  };


  const MaxLimitForPlans = (
    entity: string | undefined,
  ) => {
    if (entity === "da") {
      return 1000;
    } else {
      return 6000000;
    }
  };

  const MinLimitForPlans = (
    entity: string | undefined,
    billingCycle: string | undefined
  ) => {
    if (entity === "da") {
      return 5;
    } else {
      if (billingCycle === "Quarterly") {
        return 7500;
      } else if (billingCycle === "Half Yearly") {
        return 15000;
      } else {
        return 30000;
      }
    }
  };


  useEffect(() => {
    // We want that on the first render everything should be set to the subscription and billing component
    dispatch({
      type: "@@billingContainer/SET_SUBSCRIPTION_IN_CART",
      payload: {
        entityType: selectedEntity,
        billingCycle: localBillingCycle,
        planCode: newPlanData[selectedEntity][localBillingCycle].plan_code,

        planName: newPlanData[selectedEntity][localBillingCycle].name,
        quantity: localPlanQuantity,
        unitPrice: localPlanUnitPrice,
      },
    });
  });

  // Dynamic Labels
  const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.billing}`);
  const selectBelowDetails =
    dynamicLabels.selectBelowDetails ||
    "Select below details as per your requirements";
  const updateBelowDetails =
    dynamicLabels.updateBelowDetails ||
    "Update below details as per your requirements";
  const subscriptionType =
    dynamicLabels.subscriptionType || "Subscription Type";
  const subscriptionCycle =
    dynamicLabels.subscriptionCycle || "Subscription Cycle";
  const buyAdditionalEntity =
    `${dynamicLabels.buyAdditionalEntity} ${selectedEntity === "order"
      ? dynamicLabels.order_s
      : dynamicLabels.deliveryboy_s
    }` ||
    `Buy additional ${selectedEntity === "order"
      ? dynamicLabels.order_s
      : dynamicLabels.deliveryboy_s
    }`;

  const noOfDA = dynamicLabels.noOfDA || "Select or Enter the number of Delivery Associates";
  const noOfOrders = dynamicLabels.noOfOrders || "No. of Orders";

  return (
    <UpdateSubscriptionStyleWrapper>
      <Box m="0 0 20px 0">
        <Typography
          useStyle={false}
          fontSize="15px"
          color="grey.900"
          fontWeight={600}
        >
          {currentPlanData?.planType === "TRIAL"
            ? selectBelowDetails
            : updateBelowDetails}
        </Typography>
      </Box>

      <Typography useStyle={false} fontSize="13px" color="grey.A100">
        {subscriptionType}
      </Typography>

      <Box display="flex" justifyContent="flex-start" m="8px 0 20px 0">
        <TabContainer>
          {Object.keys(newPlanData).map((entityKey: any, index) => {
            return (
              <div key={entityKey + index}>
                <IconButton
                  primary={entityKey === selectedEntity ? true : false}
                  onClick={() => {
                    changeEntitytype(entityKey);
                  }}
                  id={`subscription-actionbar-${entityKey}`}
                  iconVariant={entityKey === "da" ? "truck" : "created"}
                  style={{
                    height: "40px",
                    borderRadius: "1px",
                    marginRight: "10px",
                  }}
                >
                  <Typography
                    useStyle={false}
                    fontSize="13px"
                    lineHeight="25px"
                  >
                    {entityKey === "da"
                      ? dynamicLabels.deliveryboy_s.toUpperCase()
                      : dynamicLabels.order_s.toUpperCase()}
                  </Typography>
                </IconButton>
              </div>
            );
          })}
        </TabContainer>
      </Box>

      <Typography useStyle={false} fontSize="13px" color="grey.A100">
        {subscriptionCycle}
      </Typography>

      <Box display="flex" justifyContent="flex-start" m="8px 0 20px 0">
        <TabContainer>
          {Object.keys(newPlanData[selectedEntity]).map(
            (billingCycleKey: any, index) => {
              const selectedEntityObject =
                newPlanData[selectedEntity][billingCycleKey];
              return (
                <div key={billingCycleKey + index}>
                  <PricingTabs
                    title={billingCycleKey}
                    onClick={() => changeBillingCycle(billingCycleKey)}
                    id={`subscription-actionbar-${billingCycleKey}`}
                    style={{
                      color:
                        billingCycleKey === localBillingCycle
                          ? "#fff"
                          : "#545454",
                      background:
                        billingCycleKey === localBillingCycle
                          ? "#5698d3"
                          : "#fff",
                    }}
                  >
                    <Typography
                      useStyle={false}
                      fontSize="13px"
                      lineHeight="25px"
                    >
                      {billingCycleKey}
                    </Typography>

                    <div
                      style={{
                        color:
                          billingCycleKey === localBillingCycle
                            ? "#fff"
                            : "#5698d3",
                      }}
                    >
                      <Typography
                        useStyle={false}
                        fontSize="17px"
                        fontWeight={550}
                      >
                        {currencySym}
                        {abbreviateAmount(selectedEntityObject.recurring_price)}
                      </Typography>
                    </div>
                    <Typography useStyle={false} fontSize="10px">
                      per
                      {selectedEntity === "da"
                        ? ` ${dynamicLabels.deliveryboy_s}`
                        : ` ${dynamicLabels.order_s}`}
                    </Typography>
                  </PricingTabs>
                </div>
              );
            }
          )}
        </TabContainer>
      </Box>

      <Typography useStyle={false} fontSize="13px" color="grey.A100">
        {currentPlanData?.planType === "TRIAL"
          ? selectedEntity === "order"
            ? noOfOrders
            : noOfDA
          : buyAdditionalEntity}
      </Typography>
      <SliderWithNumbers
        minRange={MinLimitForPlans(selectedEntity, localBillingCycle)}
        maxRange={MaxLimitForPlans(selectedEntity)}
        selectedRange={localPlanQuantity}
        resetOutOfBounds={true}
        resetInterval={400}
        setFinalData={(value: number) =>
          isNaN(value)
            ? setLocalPlanQuantity(
              MinLimitForPlans(selectedEntity, localBillingCycle)
            )
            : setLocalPlanQuantity(value)
        }
      />
    </UpdateSubscriptionStyleWrapper>
  );
};

export default UpdateSubscriptionComponent;
