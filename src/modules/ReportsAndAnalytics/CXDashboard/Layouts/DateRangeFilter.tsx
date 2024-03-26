import React, { CSSProperties, Dispatch, useMemo, useState } from "react";
import moment from "moment-timezone";
import { DateRangePicker, TextInput } from "ui-library";
import { useDispatch } from "react-redux";
import { CXDashboardActions } from "../CXDashboard.actions";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";

const cursorStyle: CSSProperties = {
  cursor: "pointer",
};

const dateRangeStyle: CSSProperties = {
  position: "absolute",
  top: "31px",
  right: 0,
  maxHeight: "30px",
};

const textInputStyle: CSSProperties = {
  ...cursorStyle,
  maxHeight: "30px",
  minHeight: "30px",
  border: "unset",
  width: "180px",
  // boxShadow: '0 2px 11px -5px #000'
};

const textIconStyle: CSSProperties = {
  ...cursorStyle,
  fontSize: "12px",
  maxHeight: "30px",
  minHeight: "30px",
};

const DateRangeFilter = () => {
  const dispatch = useDispatch<Dispatch<CXDashboardActions>>();

  const clientProperties = useTypedSelector((state) => state.clientProperties);
  const DATE_TIME_FORMAT = useMemo(
    () =>
      `${
        clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() ||
        "DD/MM/YYYY "
      } hh:mm A`,
    [clientProperties]
  );

  const dateFormatter = React.useCallback(
    (date: Date) => {
      return moment(date).format(DATE_TIME_FORMAT);
    },
    [clientProperties, DATE_TIME_FORMAT]
  );

  const stringToDate = React.useCallback(
    (dateStr: string): Date => {
      return moment(dateStr, DATE_TIME_FORMAT).toDate();
    },
    [clientProperties, DATE_TIME_FORMAT]
  );

  const from = useTypedSelector(
    (state) => state.cxDashboardReducer?.calendar.from
  );
  const d = new Date();
  const to = useTypedSelector((state) => state.cxDashboardReducer?.calendar.to);
  const value = React.useMemo(
    () => `${dateFormatter(from)} - ${dateFormatter(to)}`,
    [from, to]
  );

  return (
    <div style={{ boxShadow: "0 2px 11px -5px #000", maxHeight: "30px" }}>
      <DateRangePicker
        style={dateRangeStyle}
        variant="daterange"
        open={false}
        startDate={from}
        endDate={to}
        showTime
        fromDateFormatter={dateFormatter}
        toDateFormatter={dateFormatter}
        stringToDate={stringToDate}
        timeFormat={12}
        tillMinDate = {new Date(2022,1,1)}
        tillMaxDate={ new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          )}
        onApply={(range) => {
          if (range) {
            dispatch({
              type: "@@CXDashboard/SET_DATERANGE_FILTER",
              payload: { from: range[0], to: range[1] },
            });
          }
        }}
      >
        {({ setOpen }) => (
          <TextInput
            id={"id-cxDashboarddateRangeInputField"}
            readOnly
            value={value}
            variant="withIcon"
            color={"primary.main"}
            style={textInputStyle}
            iconStyle={textIconStyle}
            iconVariant="calendar"
            onIconClick={() => setOpen((o) => !o)}
            onClick={() => setOpen((o) => !o)}
            height={"30px"}
          />
        )}
      </DateRangePicker>
    </div>
  );
};

export default DateRangeFilter;
