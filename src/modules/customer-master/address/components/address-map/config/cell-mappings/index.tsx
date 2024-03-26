import React, { memo } from "react";
import { Cell } from "react-table";
import TextOverflowEllipsis from "../../../../../../../utils/components/TextOverflowEllipsis";

/* return true if passing nextProps to render would return the same result as passing prevProps to render, otherwise return false */
const arePropsEqual = (prevProps, newProps) =>
  prevProps.value === newProps.value &&
  prevProps.column?.["cellCallback"] === newProps.column?.["cellCallback"] &&
  JSON.stringify(prevProps.row.original) ===
    JSON.stringify(newProps.row.original);

export const ALL_ADDRESSES_MAP_MAPPINGS = {
  default: memo(
    ({ value }: Cell<any>) => (
      <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    ),
    arePropsEqual
  ),

  address: memo(({ value, row, column }: Cell<any>) => {
    return (
      <TextOverflowEllipsis
        title={value}
        className="all-addresses__update-link"
        onClick={() => column?.["cellCallback"](row.original)}
      >
        {value}
      </TextOverflowEllipsis>
    );
  }, arePropsEqual),

  geocodeStatus: memo(
    ({ value }: Cell<any>) => (
      <i
        className={`icon ${
          value === "NOTGEOCODED"
            ? "icon-geocoding-not-done"
            : "icon-geo-coding-done"
        } status--${value}`}
      />
    ),
    arePropsEqual
  ),
};
