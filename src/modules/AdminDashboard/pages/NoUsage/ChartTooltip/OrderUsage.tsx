import moment from "moment";
import React from "react";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import useClientProperties from "../../../../common/ClientProperties/useClientProperties";
import {
  TooltipRow,
  TooltipColumn1,
  TooltipColumn2,
  TooltipColumn3,
} from "../../../AdminDashboard.styled.component";
import { abbreviateNumber } from "./NumberUtil";
const OrderUsage = (props: any) => {
  const { payload, chartDataKeys, prevDateRange, dateRange, label } = props;
  const dynamicLabels = useTypedSelector((state) => state.dynamicLabels);
  console.log("[OrderUsage.tsx]", props);
  const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
  const format = clientProperties?.DATEFORMAT?.propertyValue
    ? clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()
    : "DD-MM-YYYY";
  const dateFormatting = `${moment(dateRange.startDate).format(
    `${format}`
  )} - ${moment(dateRange.endDate).format(`${format}`)}`;
  const dateFormatting1 = `${moment(prevDateRange?.startDate).format(
    `${format}`
  )} - ${moment(prevDateRange.endDate).format(`${format}`)}`;
  const tooltip = payload
    ?.filter((value: any) => {
      return chartDataKeys.includes(value.dataKey);
    })
    .map((value: any) => {
      return (
        <>
          <TooltipRow>
            <TooltipColumn1 style={{ background: value.fill }}></TooltipColumn1>
            <TooltipColumn2>
              {`${dynamicLabels[value.dataKey]} `}
            </TooltipColumn2>
            <TooltipColumn3>
              {`${typeof value.value !== "undefined" ? abbreviateNumber(value.value) : "NA"} `}
            </TooltipColumn3>

            <TooltipColumn3>
              {`${
                typeof value.payload[value.dataKey + "_line"] !== "undefined"
                  ? abbreviateNumber(value.payload[value.dataKey + "_line"])
                  : "NA"
              } `}
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
        minWidth: "550px",
      }}
    >
      <div
        style={{
          textAlign: "left",
          color: "$fff",
          width: "40%",
          display: "inline-block",
        }}
      >
        {label}
      </div>
      <div
        style={{
          textAlign: "center",
          color: "$fff",
          width: "30%",
          display: "inline-block",
        }}
      >{`(${dateFormatting})`}</div>
      <div
        style={{
          textAlign: "center",
          color: "$fff",
          width: "30%",
          display: "inline-block",
        }}
      >{`(${dateFormatting1}) `}</div>

      <div>{tooltip}</div>
    </div>
  );
};

export default OrderUsage;
