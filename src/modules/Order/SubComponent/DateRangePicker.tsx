import moment from "moment-timezone";
import React, { Dispatch, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DateRangePicker, Position, TextInput } from "ui-library";
import useClientProperties from "../../../modules/common/ClientProperties/useClientProperties";
import { sendGA } from "../../../utils/ga";
import { OrderListViewActions } from "../OrderListView/OrderListView.actions";

const DateRangePickerComponent = (props: any) => {
  const dispatch = useDispatch<Dispatch<OrderListViewActions>>();
  const {
    startDate,
    endDate,
    setDateRangePickerText,
    fetchOptions,
    filterDateFormatter,
    dateRangePickerText,
    setFetchOptions,
  } = props;
  const dateRangePickerRef = React.createRef<HTMLDivElement>();
  const [right, setRight] = useState<number>(0);
  const [left, setLeft] = useState<number>(0);
  const [top, setTop] = useState<number | undefined>();
  const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
  const format = clientProperties?.DATEFORMAT?.propertyValue
    ? clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()
    : "DD-MM-YYYY";
  // console.log(format,"DATERAGEPICKER FORMAT")
  useEffect(() => {}, [dateRangePickerText, fetchOptions, startDate, endDate]);
  // console.log(startDate,'startDate')
  // console.log(endDate,'endDate')
  const firstDayOflast30Days = parseInt(
    moment(new Date()).subtract(29, "days").format("DD")
  );
  const dateFormatter = useCallback(
    (date: Date) => {
      return moment(date).format(`${format} hh:mm A`);
    },
    [startDate, endDate]
  );

  const userDefinedDateRanges = [
    {
      label: "Today",
      startDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      ),
      endDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      ),
    },
    {
      label: "Yesterday",
      startDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() - 1
      ),
      endDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() - 1
      ),
    },
    {
      label: "This week",
      startDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() - new Date().getDay()
      ),
      endDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      ),
    },
    {
      label: "Last 7 Days",
      startDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() - 6
      ),
      endDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      ),
    },
    {
      label: "This month",
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      ),
    },
    {
      label: "Last 30 Days",
      startDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth() - 1,
        firstDayOflast30Days
      ),
      endDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      ),
    },
    {
      label: "Tomorrow",
      startDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 1
      ),
      endDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 1
      ),
    },
    {
      label: "Next 7 days",
      startDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      ),
      endDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 6
      ),
    },
    {
      label: "Next Week",
      startDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 7 - new Date().getDay()
      ),
      endDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 7 - new Date().getDay() + 6
      ),
    },
    {
      label: "Next 30 Days",
      startDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      ),
      endDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        new Date().getDate() - 1
      ),
    },

    { label: "Custom Date", startDate: new Date(), endDate: new Date() },
  ];

  const convertStringToDate = (input: string) => {
    const isValidDateEntered = moment(input, `${format} hh:mm A`).isValid();
    if (isValidDateEntered) {
      return moment(input, `${format} hh:mm A`).toDate();
    }
    return undefined;
  };
  const dateToString = (d: Date) => {
    return moment(d).format(format);
  };
  return (
    <div>
      <DateRangePicker
        id="orderListDateRangePicker"
        variant="daterange"
        style={{ position: "fixed", right, left, top, zIndex: 99999 }}
        open={false}
        startDate={new Date(startDate)}
        endDate={new Date(endDate)}
        userDefinedDateRanges={userDefinedDateRanges}
        showTime
        validationMessage={"From time cannot be greater than To time"}
        fromDateFormatter={dateFormatter}
        toDateFormatter={dateFormatter}
        stringToDate={convertStringToDate}
        dateToString={dateToString}
        timeFormat={12}
        onApply={(range) => {
          if (range) {
            const stDate = moment(range[0]).format(`${format} hh:mm A`);
            const eDate = moment(range[1]).format(`${format} hh:mm A`);
            setFetchOptions({
              ...fetchOptions,
              startDateFilter: filterDateFormatter(range[0]),
              endDateFilter: filterDateFormatter(range[1]),
            });
            dispatch({
              type: "@@orderListView/SET_DATE_RANGE",
              payload: {
                dateRange: {
                  startDate: new Date(range[0]).getTime(),
                  endDate: new Date(range[1]).getTime(),
                },
              },
            });
            setDateRangePickerText(`${stDate} - ${eDate}`);
          }
        }}
      >
        {({ setOpen }) => {
          return (
            <div ref={dateRangePickerRef}>
              <Position
                type="relative"
                display="inline-block"
                style={{ boxShadow: "0 2px 11px -5px #000", width: "220px", height: "30px"  }}
                onClick={() => {
                  sendGA("Event New", `Orders - Quick Date Range`);
                  setOpen(true);
                  let newRight = 0;
                  let newLeft = 0;
                  const daterangepickerWidth = 708.94;
                  const boundingRect = dateRangePickerRef.current?.getBoundingClientRect();
                  newRight = window.innerWidth - (boundingRect?.right || 0);
                  newLeft =
                    window.innerWidth - (newRight + daterangepickerWidth);
                  if (newRight < 0) {
                    newRight = 0;
                    newLeft = window.innerWidth - daterangepickerWidth;
                  } else if (
                    newRight + daterangepickerWidth >
                    window.innerWidth
                  ) {
                    newLeft = 0;
                  }
                  setLeft(newLeft);
                  setRight(newRight);
                  setTop(boundingRect?.bottom);
                }}
              >
                <TextInput
                  id="orderListDateRange"
                  variant="withIcon"
                  iconVariant="calendar"
                  border={false}
                  color={"primary.main"}
                  style={{
                    width: "194px",
                    minHeight: "30px",
                    height: "30px"
                  }}
                  iconSize="xs"
                  iconStyle={{
                    padding: "7px",
                    minHeight: "30px",
                    height: "30px"
                  }}
                  // onClear={() => {
                  //   setOpen(false)
                  //   setDateRangePickerText('')
                  //   // setFilters(f => {
                  //   //   const newFilter = { ...f }
                  //   //   // delete newFilter[`${fieldType}_CUSTOM_${fieldKey}`]
                  //   //   return newFilter
                  //   // })
                  // }}

                  title={`${props.dynamicLabels.chooseADateRangeToDisplay} ${props.dynamicLabels["orders"]} ${props.dynamicLabels.duringThatTime}`}
                  value={dateRangePickerText}
                  tooltipMesaage={`${props.dynamicLabels.chooseADateRangeToDisplay} ${props.dynamicLabels["orders"]} ${props.dynamicLabels.duringThatTime}`}
                />
              </Position>
            </div>
          );
          // <div onClick={() => setOpen(!open)}>{value[0] + ' - ' + value[1]}</div>
        }}
      </DateRangePicker>
    </div>
  );
};

export default DateRangePickerComponent;
