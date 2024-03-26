import React, { Dispatch, useMemo } from "react";
import { useDispatch } from "react-redux";
import { ButtonGroup } from "ui-library";
import { IUsageAnalyticsActions } from "../Services/UsageAnalytics.actions";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { tTimeGap } from "../Services/UsageAnalytics.models";

const TimeGapButtonsGroup = ({dynamicLabels}: any) => {
  const dispatch = useDispatch<Dispatch<IUsageAnalyticsActions>>();

  // Getting Data from Redux
  const timeGap = useTypedSelector(state => state.usageAnalytics.timeGap);

  const timeGapOptions = useMemo(
    () => [
      {
        id: "MONTH",
        label: dynamicLabels.month || "MONTH",
        selected: timeGap === "MONTH",
      },
      {
        id: "WEEK",
        label: dynamicLabels.week || "WEEK",
        selected: timeGap === "WEEK",
      },
      {
        id: "DAY",
        label: dynamicLabels.day || "DAY",
        selected: timeGap === "DAY",
      },
    ],
    [dynamicLabels]
  );

  const handleChange = (range: string) => {
    dispatch({
      type: "@@usageAnalytics/SET_TIME_GAP",
      payload: range as tTimeGap,
    });
  };

  return (
    <ButtonGroup
      width="90px"
      height="30px"
      data={timeGapOptions}
      onChange={handleChange}
    />
  );
};

export default TimeGapButtonsGroup;
