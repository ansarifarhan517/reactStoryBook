import React from "react";
import CurrentPlanSkeleton from "../Components/SkeletonLoaders/CurrentPlanSkeleton";
import ExpandableListSkeleton from "../Components/SkeletonLoaders/ExpandableListSkeleton";
import SupportTicketSkeleton from "../Components/SkeletonLoaders/SupportTicketSkeleton";
import {
  CurrentPlanPageWrapper,
  LeftPanel,
  RightPanel,
} from "../Services/SubscriptionAndBilling.styles";

const SubscriptionPageSkeleton = () => {
  return (
    <CurrentPlanPageWrapper>
      <LeftPanel>
        <CurrentPlanSkeleton />
        <ExpandableListSkeleton />
      </LeftPanel>

      <RightPanel>
        <ExpandableListSkeleton />
        <SupportTicketSkeleton />
      </RightPanel>
    </CurrentPlanPageWrapper>
  );
};

export default SubscriptionPageSkeleton;
