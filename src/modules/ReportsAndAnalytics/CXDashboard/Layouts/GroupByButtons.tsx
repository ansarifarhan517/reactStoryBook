import React, { Dispatch, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { ButtonGroup } from "ui-library";
import { CXDashboardActions } from "../CXDashboard.actions";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import { tGroupBy } from "../CXDashboard.model";

const GroupByButtons = () => {
  const dispatch = useDispatch<Dispatch<CXDashboardActions>>();
  const selectedGroupBy =
    useTypedSelector((state) => state.cxDashboardReducer.groupBy) || "DAY";
  const [groupBy, setGroupBy] = useState<tGroupBy>(selectedGroupBy);
  const dynamicLabels = useDynamicLabels(
    `${DYNAMIC_LABELS_MAPPING.cxDashboard}`
  );
  const buttonGroupOptions = useMemo(
    () => [
      {
        id: "YEAR",
        label: dynamicLabels.YEAR || "YEAR",
        selected: groupBy === "YEAR",
      },
      {
        id: "MONTH",
        label: dynamicLabels.MONTH || "MONTH",
        selected: groupBy === "MONTH",
      },
      {
        id: "WEEK",
        label: dynamicLabels.WEEK || "WEEK",
        selected: groupBy === "WEEK",
      },
      {
        id: "DAY",
        label: dynamicLabels.DAY || "DAY",
        selected: groupBy === "DAY",
      },
    ],
    [dynamicLabels]
  );
  const handleChange = (id) => {
    setGroupBy(id as tGroupBy);
    dispatch({ type: "@@CXDashboard/SET_GROUPBY", payload: id });
  };

  return (
    <div style={{ width: "370px" }}>
      <ButtonGroup
        width={"90px"}
        height={"30px"}
        data={buttonGroupOptions}
        onChange={handleChange}
      ></ButtonGroup>
    </div>
  );
};

export default GroupByButtons;
