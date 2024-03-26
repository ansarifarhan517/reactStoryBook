import React from "react";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import {
  ColumnFlexContainer,
  PerformanceIconCard,
  AverageBadgeSeparator,
} from "../../OverallSummary.styles";

const AveragePerformanceCards = ({ title, data, overallIcon }: any) => {
  const tripApiSuccess = useTypedSelector(
    (state) => state.overallSummaryListView.tripApiSuccess.apiSuccess
  );
  const dynamicLabels = useDynamicLabels(
    DYNAMIC_LABELS_MAPPING.overallSummary + ",Resources"
  );
  return (
    <>
      <PerformanceIconCard>
        <ColumnFlexContainer>
          <div className="makingFontBig">
            <i
              style={{
                textAlign: "center",
                background: "#fff",
                marginBottom: "15px",
              }}
              className={overallIcon}
            ></i>
          </div>
          <AverageBadgeSeparator>{title}</AverageBadgeSeparator>
          {tripApiSuccess ? (
            <span style={{ fontSize: "17px", color: "#444" }}>{data}</span>
          ) : (
            `${dynamicLabels.apiCallFailed}`
          )}
        </ColumnFlexContainer>
      </PerformanceIconCard>
    </>
  );
};

export default AveragePerformanceCards;
