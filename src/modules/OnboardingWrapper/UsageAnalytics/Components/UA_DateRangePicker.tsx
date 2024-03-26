import moment from "moment-timezone";
import React, { CSSProperties, Dispatch, useState } from "react";
import { useDispatch } from "react-redux";
import { DateRangePicker, TextInput } from "ui-library";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import useClientProperties from "../../../common/ClientProperties/useClientProperties";
import { IUsageAnalyticsActions } from "../Services/UsageAnalytics.actions";
import { UA_DateRangePickerContainer } from "../Services/UsageAnalytics.styles";

const cursorStyle: CSSProperties = {
  cursor: "pointer",
};

const inputStyle: CSSProperties = {
  ...cursorStyle,
  height: "30px",
  minHeight: "30px",
  border: "unset",
  width: "200px",
};

const iconStyle: CSSProperties = {
  ...cursorStyle,
  fontSize: "12px",
  minHeight: "30px",
  height: "30px",
};

const UA_DateRangePicker = () => {
  const clientProperties = useClientProperties(["DATEFORMAT"]);
  const userDateFormat = clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() ? clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() : "YYYY-MM-DD";

  // Getting Data from Redux
  const minDate = useTypedSelector(state => state.usageAnalytics.dateRange.fromDate);
  const maxDate = useTypedSelector(state => state.usageAnalytics.dateRange.toDate);


  const dispatch = useDispatch<Dispatch<IUsageAnalyticsActions>>();

  const dateFormatter = (date: Date) => {
    return moment(date).format(`${userDateFormat}`);
  };

  const formattedDateRange = (start: Date, end: Date) => {
    return `${dateFormatter(start)} - ${dateFormatter(end)}`;
  };

  const convertStringToDate = (input: string) => {
    const isValidDateEntered = moment(input, userDateFormat).isValid();
    if (isValidDateEntered) {
      return moment(input, userDateFormat).toDate();
    }
    return undefined;
  };

  // Local State
  const [dateRangePickerText, setDateRangePickerText] = useState<String>(formattedDateRange(minDate, maxDate));


  const onDateRangeChange = (range) => {
      if (range) {
        dispatch({ type: "@@usageAnalytics/SET_DATE_RANGE", payload: { fromDate: range[0], toDate: range[1] } })
        setDateRangePickerText(formattedDateRange(range[0], range[1]));
      }
  }

  return (
    <UA_DateRangePickerContainer>
      <DateRangePicker
        style={{ position: "absolute", right: 0, top: "40px", zIndex: 99999, height: "30px" }}
        variant="daterange"
        open={false}
        startDate={new Date(minDate)}
        endDate={new Date(maxDate)}
        showTime={false}
        fromDateFormatter={dateFormatter}
        toDateFormatter={dateFormatter}
        timeFormat={24}
        stringToDate={convertStringToDate}
        onApply={(range) => onDateRangeChange(range)}
      >
        {({ setOpen }) => (
          <TextInput
            readOnly
            id={"id-cxDashboarddateRangeInputField"}
            variant="withIcon"
            border={false}
            color={"primary.main"}
            style={inputStyle}
            iconStyle={iconStyle}
            iconVariant="calendar"
            onIconClick={() => setOpen((o) => !o)}
            onClick={() => setOpen((o) => !o)}
            value={dateRangePickerText}
          />
        )}
      </DateRangePicker>
    </UA_DateRangePickerContainer>
  );
};

export default UA_DateRangePicker;
