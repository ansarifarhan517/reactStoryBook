import React, { CSSProperties, Dispatch, useMemo, useState, useEffect } from "react";
import moment from "moment-timezone";
import { DateRangePicker, TextInput } from "ui-library";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import { useDispatch } from "react-redux";
import { tTripsListMileActions } from "../TripsListView.actions";

const cursorStyle: CSSProperties = {
  cursor: "pointer",
};

const dateRangeStyle: CSSProperties = {
  position: "absolute",
  top: 0,
  right: 0,
};

const textInputStyle: CSSProperties = {
  ...cursorStyle,
  minHeight: "30px",
  border: "unset",
  width: "180px",
  // boxShadow: '0 2px 11px -5px #000'
};

const textIconStyle: CSSProperties = {
  ...cursorStyle,
  fontSize: "12px",
};

const DateRangeFilter = () => {
  const [value, setValue] = useState('');
  const dispatch = useDispatch<Dispatch<tTripsListMileActions>>();

  const clientProperties = useTypedSelector((state) => state.clientProperties);
  const dynamicLabels = useTypedSelector((state) => state.dynamicLabels);
  const breadCrumbFilter = useTypedSelector(
    (state) => state.trips.listView.mile.breadcrumbFilter
  );
  const DATE_TIME_FORMAT = useMemo(
    () =>
      `${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} hh:mm A`,
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

  const filterDateFormatter = React.useCallback((date?: Date) => {
    const timezone = clientProperties?.TIMEZONE?.propertyValue
      ? clientProperties?.TIMEZONE?.propertyValue?.toUpperCase()
      : "";
    return moment.tz(date, timezone).utc().format("YYYY-MM-DD HH:mm:ss");
  }, []);

  const from = useTypedSelector((state) => state.trips.listView.mile.from);
  const to = useTypedSelector((state) => state.trips.listView.mile.to);

  const listParamStartDate = useTypedSelector((state) => state.trips.listView.mile.listParams.from);
  const listParamEndDate = useTypedSelector((state) => state.trips.listView.mile.listParams.to);  

  useEffect(() => {
    setValue(`${dateFormatter(from)} - ${dateFormatter(to)}`);
  }, [from, to, listParamStartDate, listParamEndDate]);

  return (
    <div style={{ boxShadow: "0 2px 11px -5px #000" }}>
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
        onApply={(range) => {
          if (range) {
            const from = filterDateFormatter(range[0]);
            const to = filterDateFormatter(range[1]);

            dispatch({
              type: "@@tripsListViewMile/SET_DATERANGE_FILTER",
              payload: { from: range[0], to: range[1] },
            });
            dispatch({
              type: "@@tripsListViewMile/UPDATE_LIST_PARAMS",
              payload: { from, to },
            });
          }
        }}
      >
        {({ setOpen }) => (
          <TextInput
            id={"id-tripdateRangeInputField"}
            readOnly
            value={value}
            title={`${dynamicLabels.chooseADateRangeToDisplay} ${dynamicLabels[breadCrumbFilter]} ${dynamicLabels.duringThatTime}`}
            variant="withIcon"
            color={"primary.main"}
            style={textInputStyle}
            iconStyle={textIconStyle}
            iconVariant="calendar"
            onIconClick={() => setOpen((o) => !o)}
            onClick={() => setOpen((o) => !o)}
            tooltipMesaage={`${dynamicLabels.chooseADateRangeToDisplay} ${dynamicLabels[breadCrumbFilter]} ${dynamicLabels.duringThatTime}`}
          />
        )}
      </DateRangePicker>
    </div>
  );
};

export default DateRangeFilter;
