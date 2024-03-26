import React from "react";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import {
  TooltipRow,
  TooltipColumn1,
  TooltipColumn2,
  TooltipColumn3,
} from "../../../AdminDashboard.styled.component";
import { abbreviateNumber } from "./NumberUtil";
const UserUsage = (props: any) => {
  const { payload, chartDataKeys } = props;
  const dynamicLabels = useTypedSelector((state) => state.dynamicLabels);

  const tooltip = payload
    ?.filter((value: any) => {
      return chartDataKeys.includes(value.dataKey);
    })
    .map((value: any) => {
      return (
        <>
          <TooltipRow>
            <TooltipColumn1 style={{ background: value.fill }}></TooltipColumn1>
            <TooltipColumn2 style={{ width: "60%" }}>
              {`${dynamicLabels[value.dataKey]} `}
            </TooltipColumn2>
            <TooltipColumn3 style={{ width: "20%" }}>
              {`${abbreviateNumber(value.value)} `}
            </TooltipColumn3>
          </TooltipRow>
        </>
      );
    });

  return (
    <div
      style={{
        background: "rgba(0,0,0,0.8)",
        padding: "10px",
        color: "#fff",
        minWidth: "250px",
      }}
    >
      <div style={{ textAlign: "right", marginRight: "10px" }}>
        Count of Users
      </div>
      <div>{tooltip}</div>
    </div>
  );
};

export default UserUsage;
