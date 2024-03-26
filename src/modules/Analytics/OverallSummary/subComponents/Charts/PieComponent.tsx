import React from "react";
import {
  HeaderStyling,
  LabelDataStyling,
  OverallPieCard,
  PieContainer,
  ProgressBarLabel,
  ProgressBarWrapper,
  RowFlexContainer,
} from "../../OverallSummary.styles";
import { PieChartComponent, ProgressBar, Tooltip } from "ui-library";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";

const PieComponent = ({
  data,
  headerLabel,
  labelData,
  completedPercent,
  progressBarLabel,
}: any) => {
  const tripApiSuccess = useTypedSelector(
    (state) => state.overallSummaryListView.tripApiSuccess.apiSuccess
  );
  const dynamicLabels = useDynamicLabels(
    DYNAMIC_LABELS_MAPPING.overallSummary + ",Resources"
  );

  return (
    <OverallPieCard>
      <HeaderStyling>
        {headerLabel}
        <LabelDataStyling>{labelData}</LabelDataStyling>
      </HeaderStyling>
      {tripApiSuccess ? (
        <RowFlexContainer>
          <Tooltip
            message={`${completedPercent}% ${progressBarLabel}`}
            hover
            tooltipDirection="top"
          >
            <ProgressBarLabel>
              {completedPercent}% {progressBarLabel}
            </ProgressBarLabel>
          </Tooltip>
          <ProgressBarWrapper>
            <ProgressBar
              completedPercent={completedPercent}
              labelFontSize="10px"
              labelFontColor="grey.900"
              labelFontWeight={600}
            />
          </ProgressBarWrapper>
        </RowFlexContainer>
      ) : (
        `${dynamicLabels.apiCallFailed}`
      )}
      <PieContainer>
        <PieChartComponent details={data} height={127} />
      </PieContainer>
    </OverallPieCard>
  );
};

export default PieComponent;
