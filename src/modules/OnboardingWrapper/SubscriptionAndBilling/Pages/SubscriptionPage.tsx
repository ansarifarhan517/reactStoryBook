import React from "react";
import { withReactOptimized } from "../../../../utils/components/withReact";
import {
  LeftPanel,
  RightPanel,
  CurrentPlanPageWrapper,
  BreadCrumbContainer,
  UAT_Account_AccessDenied,
} from "../Services/SubscriptionAndBilling.styles";
import { Box, Typography, BreadCrumb } from "ui-library";
import CurrentPlanComponent from "../Components/CurrentPlanComponent";

import GrabOffer from "../Components/GrabOffer";
import Supportticket from "../Components/Supportticket";
import BasicExpandableTable from "../Components/ExpandableInvoiceList/BasicExpandableTable";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import {
  billingHistoryHeader,
  pendingPaymentsHeader,
} from "../Components/ExpandableInvoiceList/ExpandableListHeaders";
import {
  getBillingHistoryInvoiceList,
  getPendingPaymentInvoiceList,
} from "../Services/Utils/HelperFunctions";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import SubscriptionPageSkeleton from "./SubscriptionPageSkeleton";


const SubscriptionPage = () => {

  const userAccessInfo = JSON.parse(
    localStorage.getItem("userAccessInfo") || ""
  );

  const grabOfferPermission = useTypedSelector(
    (state) => state.subscriptionBilling?.structure?.data?.data?.GrabNow
  );

  const invoiceList = useTypedSelector(
    (state) => state.subscriptionBilling?.invoiceList
  );

  const subscriptionPageLoading = useTypedSelector(
    (state) => state.subscriptionBilling?.subscriptionPageLoading
  );

  const currentPlanData = useTypedSelector(
    (state) => state.subscriptionBilling?.currentplandata
  );

  const billingHistoryList = getBillingHistoryInvoiceList(invoiceList, 10);
  const pendingPayList = getPendingPaymentInvoiceList(invoiceList);

  const breadCrumbOptions = React.useMemo(
    () => [{ id: "SubscriptionPage", label: "Subscription & Billing" }],
    []
  );

  // Dynamic Labels
  const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.billing}`);
  const billingHistory = dynamicLabels.billingHistory || "Billing history";
  const pendingPayments = dynamicLabels.pendingPayments || "Pending Payments";
  const pendingPaymentsDesc = dynamicLabels.pendingPaymentsDesc || "Pay now to use the product hassle free";

  return (
    <>
      <BreadCrumbContainer>
        <BreadCrumb options={breadCrumbOptions} width="100px" />
      </BreadCrumbContainer>
      {subscriptionPageLoading ? (
        <SubscriptionPageSkeleton />
      ) : !currentPlanData?.zohoSubscriptionId?.length ? (
        <UAT_Account_AccessDenied src="images/403.svg" />
      ) : (
        <CurrentPlanPageWrapper>
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
              <CurrentPlanComponent/>
            </Box>

            {userAccessInfo?.planType !== "TRIAL" &&
            billingHistoryList?.length ? (
              <Box
                bgColor="white"
                mt={"1em"}
                p={"1em"}
                style={{
                  fontSize: "13px",
                  boxShadow:
                    "0 10px 15px -8px rgba(0, 0, 0, 0.24), 0 0 11px 1px rgba(0, 0, 0, 0.12)",
                  padding: "20px",
                  borderRadius: "3px",
                }}
              >
                <Typography useStyle={false} fontSize="15px" color="grey.900">
                  {billingHistory}
                </Typography>
                <BasicExpandableTable
                  data={billingHistoryList}
                  heading={billingHistoryHeader}
                  initialRows={3} // --> Change this for the default rows visible.
                />
              </Box>
            ) : null}
          </LeftPanel>

          <RightPanel>
            {userAccessInfo?.planType !== "TRIAL" && pendingPayList?.length ? (
              <Box
                bgColor="white"
                mt={"1em"}
                p={"1em"}
                style={{
                  boxShadow:
                    "0 10px 15px -8px rgba(0, 0, 0, 0.24), 0 0 11px 1px rgba(0, 0, 0, 0.12)",
                  padding: "20px",
                  fontSize: "13px",
                  borderRadius: "3px",
                  minHeight: "265px", // This is done to make CurrentPlan look equal to the PendingPay container.
                }}
              >
                <Typography useStyle={false} fontSize="15px" color="grey.900" lineHeight="17px">
                  {pendingPayments}
                </Typography>
                <Typography useStyle={false} fontSize="10px" color="grey.900">
                  {pendingPaymentsDesc}
                </Typography>
                <BasicExpandableTable
                  data={pendingPayList}
                  heading={pendingPaymentsHeader}
                  // initialRows={3}
                />
              </Box>
            ) : null}
            {grabOfferPermission ? <GrabOffer /> : null}
            <Supportticket />
          </RightPanel>
        </CurrentPlanPageWrapper>
      )}
    </>
  );
};

export default withReactOptimized(SubscriptionPage, false);
