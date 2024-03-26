import moment from "moment";
import React from "react";
import { Cell } from "react-table";
import TextOverflowEllipsis from "../../../../../utils/components/TextOverflowEllipsis";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import { getDropDownOptions } from "../../PayoutProfileForm/PayoutProfileForm.utils";

const arePropsEqual = (prevProps, newProps) =>
  prevProps.value === newProps.value &&
  prevProps.column?.["cellCallback"] === newProps.column?.["cellCallback"] &&
  JSON.stringify(prevProps.row.original) ===
    JSON.stringify(newProps.row.original);

export default React.memo(({ value, row }: Cell<any>) => {
  const rowData = row.original;
  const periodValue = rowData?.period;

  const timeValue = moment(moment(rowData?.time, "HH:mm:ss").toDate()).format("HH:mm")
  const weekdayLookup = useTypedSelector(
    (state) => state.deliveryAssociatePayout.form.lookup?.day
  );

  const getDayLabel = (weekdayLookup, dayKey) => {
    return weekdayLookup?.find(dayObj => dayObj?.name === dayKey)?.clientRefMasterCd
  }

  const label = (value: String) => {
    switch (value) {
      case "Monthly":
        return `${value} on ${rowData?.date}`;
      case "Weekly":
        return `${value} on ${getDayLabel(weekdayLookup, rowData?.day)}`;
      case "Daily":
        return `${value} at ${timeValue} hrs`; //
      case "Custom":
        return `Every ${rowData?.every} ${
          getDropDownOptions.period?.[periodValue]
        } ${periodValue === "Daily" ? "at" : "on"} ${
          periodValue === "Daily"
            ? timeValue + " hrs"
            : periodValue === "Weekly"
            ? getDayLabel(weekdayLookup, rowData?.day)
            : rowData?.date
        }`;
      default:
        return;
    }
  };
  return (
    <TextOverflowEllipsis title={value}>{label(value)}</TextOverflowEllipsis>
  );
}, arePropsEqual);
