import React, { useState, memo, ChangeEvent } from "react";
import { Position, Toggle } from "ui-library";
import { Cell } from "react-table";
import TextOverflowEllipsis from "../../../../../../../utils/components/TextOverflowEllipsis";
import store from "../../../../../../../utils/redux/store";

/* return true if passing nextProps to render would return the same result as passing prevProps to render, otherwise return false */
const arePropsEqual = (prevProps, newProps) =>
  prevProps.value === newProps.value &&
  prevProps.column?.["cellCallback"] === newProps.column?.["cellCallback"] &&
  JSON.stringify(prevProps.row.original) ===
    JSON.stringify(newProps.row.original);

export const ALL_ADDRESSES_LIST_MAPPINGS = {
  default: memo(
    ({ value }: Cell<any>) => (
      <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    ),
    arePropsEqual
  ),

  isActiveFl: memo(({ value, column, row }: Cell) => {
    const [active, setActive] = useState(value);
    return (
      <Position type="absolute" top="4px" left="1em">
        <Toggle
          checked={active}
          onChange={({
            target: { checked },
          }: ChangeEvent<HTMLInputElement>) => {
            setActive(checked);
            column?.["cellCallback"](checked, row.original, setActive);
          }}
        />
      </Position>
    );
  }, arePropsEqual),

  isPrimaryAddress: memo(({ value }: Cell<any>) => {
    const dynamicLabels = store.getState()?.dynamicLabels;

    const yesLabel = dynamicLabels["Yes"] || "Yes";
    const noLabel = dynamicLabels["No"] || "No";

    const label = value === "Y" ? yesLabel : noLabel;

    return <TextOverflowEllipsis title={label}>{label}</TextOverflowEllipsis>;
  }, arePropsEqual),

  addressContactCount: memo(
    ({ value, row, column }: Cell<any>) => (
      <button disabled={!value} className="all-addresses__number-value">
        <span
          onClick={() => value > 0 && column?.["cellCallback"](row.original)}
        >
          {value || "0"}
        </span>
      </button>
    ),
    arePropsEqual
  ),

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
