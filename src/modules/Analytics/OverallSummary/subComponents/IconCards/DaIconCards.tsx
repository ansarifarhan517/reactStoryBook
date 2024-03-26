import React from "react";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import {
  ColumnFlexContainer,
  DAHeader,
  DAIconCard,
  DALabel,
  RowFlexContainer,
} from "../../OverallSummary.styles";

const DaIconCards = ({ title, data, overallIcon, preferredUnit }: any) => {
  const daApiSuccess = useTypedSelector(
    (state) => state.overallSummaryListView.daApiSuccess.apiSuccess
  );
  const dynamicLabels = useDynamicLabels(
    DYNAMIC_LABELS_MAPPING.overallSummary + ",Resources"
  );

  return (
    <DAIconCard>
      <RowFlexContainer>
        <span className="tripSummaryroundIcon">
          <i className={overallIcon}></i>
        </span>
        <ColumnFlexContainer>
          <DAHeader>
            {daApiSuccess ? (
              <span>{data} {preferredUnit}</span>
            ) : (
              `${dynamicLabels.apiCallFailed}`
            )}
          </DAHeader>
          <DALabel>
            <span>{title}</span>
          </DALabel>
        </ColumnFlexContainer>
      </RowFlexContainer>
    </DAIconCard>
  );
};

export default DaIconCards;
