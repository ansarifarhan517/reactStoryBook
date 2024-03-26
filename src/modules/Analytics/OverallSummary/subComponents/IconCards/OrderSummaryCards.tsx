import React from "react";
import { FlexContainer } from "../../../../OnboardingWrapper/UsageAnalytics/Services/UsageAnalytics.styles";
import {
  ColumnFlexContainer,
  OrderIconCard,
  OrderLeftIconContent,
  OrderRightIconContent,
  OrderRightBelowContent,
} from "../../OverallSummary.styles";
import { IconButton } from "ui-library";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";

const OrderSummaryCards = ({ data, details, overallIcon }: any) => {
  const tripApiSuccess = useTypedSelector(
    (state) => state.overallSummaryListView.tripApiSuccess.apiSuccess
  );
  const dynamicLabels = useDynamicLabels(
    DYNAMIC_LABELS_MAPPING.overallSummary + ",Resources"
  );

  return (
    <OrderIconCard>
      <FlexContainer>
        <OrderLeftIconContent>
          <div className="tripSummaryIcon">
            <i className={overallIcon}></i>
          </div>
        </OrderLeftIconContent>

        <OrderRightIconContent>
          {tripApiSuccess ? (
            <ColumnFlexContainer>
              <span
                style={{
                  fontSize: "16px",
                  color: "#494d56",
                  letterSpacing: "1px",
                }}
              >
                {data}
              </span>
              <span style={{ fontSize: "14px", color: "#5698d3", paddingTop: '1.5px'}}>
                {details}
              </span>
            </ColumnFlexContainer>
          ) : (
            `${dynamicLabels.apiCallFailed}`
          )}
        </OrderRightIconContent>
      </FlexContainer>
    </OrderIconCard>
  );
};

export default OrderSummaryCards;
