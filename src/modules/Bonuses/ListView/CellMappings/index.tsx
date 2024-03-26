import React, { useState, memo, useEffect, ChangeEvent } from "react";
import { Position, Toggle } from "ui-library";
import { Cell } from "react-table";
import TextOverflowEllipsis from "../../../../utils/components/TextOverflowEllipsis";
import DateCell from "./DateCell";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { DAMappedNumber } from "../BonusesList.styles";

/* return true if passing nextProps to render would return the same result as passing prevProps to render, otherwise return false */
const arePropsEqual = (prevProps, newProps) =>
  prevProps.value === newProps.value &&
  prevProps.column?.["cellCallback"] === newProps.column?.["cellCallback"] &&
  JSON.stringify(prevProps.row.original) ===
    JSON.stringify(newProps.row.original);

export const BONUSES_LIST_CELL_MAPPING = {
  default: memo(({ value }: Cell<any>) => {
    return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
  }, arePropsEqual),
  isActiveFl: memo(({ value, column, row }: Cell) => {
    const [active, setActive] = useState<boolean>(value);
    useEffect(() => {
      setActive(value);
    }, [value]);

    const structureButtons = useTypedSelector(
      (state) => state.bonuses?.listView?.structure?.buttons
    );

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
          disabled={!value || !structureButtons?.["InlineEdit"]?.permission}
        />
      </Position>
    );
  }, arePropsEqual),
  daMappedCount: memo(({ value, row, column }: Cell<any>) => {
    return (
      <DAMappedNumber disabledValue={!value}>
        <span onClick={() => value > 0 && column?.["cellCallback"](row.original)}>
          {value || "0"}
        </span>
      </DAMappedNumber>
    );
  }, arePropsEqual),
  startDate: memo(({ value }: Cell) => {
    return <DateCell value={value} />;
  }, arePropsEqual),

  endDate: memo(({ value }: Cell) => {
    return <DateCell value={value} />;
  }, arePropsEqual),
};

export const DA_MAPPED_MODAL_LIST_VIEW_CELL_MAPPING = {
  default: React.memo(
    ({ value }: Cell<any>) => {
      return (
        <>
          <TextOverflowEllipsis title={value} style={{ display: "flex" }}>
            {value}
          </TextOverflowEllipsis>
        </>
      );
    },
    (p, n) => p.value === n.value
  ),
};
