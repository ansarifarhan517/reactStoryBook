import React, { memo } from "react";
import { Cell } from "react-table";
import TextOverflowEllipsis from "../../../../../utils/components/TextOverflowEllipsis";
import frequencyCell from "./frequencyCell";
import AttachBranchToPayoutProfile from "../../Components/AttachToPayoutProfile";

/* return true if passing nextProps to render would return the same result as passing prevProps to render, otherwise return false */
const arePropsEqual = (prevProps, newProps) => {
  return (
    prevProps.value === newProps.value &&
    prevProps.column?.["cellCallback"] === newProps.column?.["cellCallback"] &&
    JSON.stringify(prevProps.row.original) ===
      JSON.stringify(newProps.row.original)
  );
};

export const PAYOUT_LIST_VIEW_CELL_MAPPING = {
  default: memo(({ value }: Cell<any>) => {
    return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
  }, arePropsEqual),
  linkedBranchIds: memo(({ value, row }: Cell<any>) => {
    return (
      <AttachBranchToPayoutProfile
        linkedBranchIds={value}
        profileId={row?.original?.id}
        key={row?.original?.id}
      />
    );
  }, arePropsEqual),
  frequency: frequencyCell,
};
