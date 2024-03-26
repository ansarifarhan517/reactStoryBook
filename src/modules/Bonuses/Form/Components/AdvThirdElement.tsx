import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import {
  TextInput,
  MultiSelect,
  InputField,
  AdvFilterDropdown,
  DatePicker,
  DateRangePicker,
  tMultiSelectChildren,
} from "ui-library";
import DROPDOWN_FILTER_OPTIONS_MAPPING from "../../../../utils/mongo/ListView/dropdownFilterOptions.mapping";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import useClientProperties from "../../../common/ClientProperties/useClientProperties";

interface tOptionValue {
  label: string;
  value: string;
  [key: string]: string;
}

const CreateHashMaps = (arr: any[]) => {
  let HashMapArray = {};
  arr &&
    arr.length &&
    arr?.forEach(
      (m: any) =>
        (HashMapArray = {
          ...HashMapArray,
          [m.value]: m,
        })
    );
  return HashMapArray;
};

const getSelectValuesArray = (hsetArray: any, value: string) => {
  const arrayOfValues: any[] = [];
  const valueArr = value.split(",");
  valueArr?.forEach((v: string) => {
    if (v && hsetArray[v]) {
      arrayOfValues.push(hsetArray[v]);
    }
  });
  return arrayOfValues;
};

const ThirdElement = ({
  value,
  setValue,
  operationType,
  fieldType,
  columnName,
}: any) => {
  const [options, setOptions] = useState<any[]>([]);
  const [valueArray, setValueArray] = useState<any>([]);
  const columnsSelector = useTypedSelector(
    (state) => state.bonuses.form.advancedFilterColumns
  );
  const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
  //hardcoded as backend asking for this format
  const format = "YYYY-MM-DD";

  const fetchDropdownOptions = async (columnName: any) => {
    const getter = DROPDOWN_FILTER_OPTIONS_MAPPING?.bonusesAdvancedFilter?.[columnName];

    if (columnsSelector[columnName]?.dropdownValues) {
      const dropdownValues = Object.keys(
        columnsSelector[columnName].dropdownValues
      )?.map((key) => ({ value: key, label: key }));
      setOptions(dropdownValues);
    } else if (!getter || typeof getter !== "function") {
      setOptions([]);
    } else {
      const options = await getter();
      options && options.length > 0 ? setOptions(options) : setOptions([]);
    }
  };

  useEffect(() => {
    Object.keys(columnsSelector)?.length && fetchDropdownOptions(columnName);
  }, [columnsSelector, columnName]);

  useEffect(() => {
    if (typeof value === "string") {
      if (fieldType === "select" || fieldType === "dropdown") {
        // do the conversion
        const HSetArray = CreateHashMaps(options);
        const values = getSelectValuesArray(HSetArray, value);
        if (values) {
          setValueArray([...values]);
        } else {
          setValueArray([]);
        }
      }
    } else {
      setValueArray(value);
    }
  }, [options, fieldType, operationType, value]);

  const getFormattedDate = useCallback(
    (date: Date) => {
      return moment(date).format(format);
    },
    [clientProperties]
  );

  const convertStringToDate = (input: string) => {
    const isValidDateEntered = moment(input, `${format}`).isValid();
    if (isValidDateEntered) {
      return moment(input, `${format}`).toDate();
    }
    return undefined;
  };
  
  const dateToString = (d: Date) => {
    return moment(d).format(format);
  };

  const oType =
    typeof operationType === "string"
      ? operationType
      : operationType?.labelKey
      ? operationType.labelKey
      : operationType;

  if (
    (fieldType === "text" && oType !== null) ||
    (fieldType === "link" && oType !== null) ||
    (fieldType === "label" && oType !== null)
  ) {
    return (
      <TextInput
        value={value}
        onChange={(e: any) => setValue(e.target.value)}
      />
    );
  } else if (
    (fieldType === "number" && oType !== null) ||
    (fieldType === "button" && oType !== null) ||
    (fieldType === "trackbtn" && oType !== null)
  ) {
    return (
      <TextInput
        value={value}
        type="number"
        onChange={(e: any) => setValue(e.target.value)}
      />
    );
  } else if (
    (fieldType === "dropdown" && oType === "filterOpIn") ||
    (fieldType === "select" && oType === "filterOpIn") ||
    (fieldType === "multiselect" && oType !== "filterOpEquals") ||
    (fieldType === "multiSelect" && oType !== "filterOpEquals")
  ) {
    const handleChange = (
      _event: any,
      _value: any,
      _isSelected: any,
      newSelectedOption: any
    ) => {
      setValue(newSelectedOption);
    };

    return (
      <MultiSelect
        id="MultiSelect"
        width="100%"
        options={Object.values(options)}
        selected={valueArray}
        onChange={handleChange}
        style={{
          position: "absolute",
          top: "auto",
          left: "auto",
          backgroundColor: "white",
        }}
        menuOpen={false}
        placeholder="Search"
      >
        {({ optionSelected, isMenuOpen, openMenu }: tMultiSelectChildren) => {
          return (
            <InputField
              onClick={() => {
                openMenu(!isMenuOpen);
              }}
              value={
                optionSelected && optionSelected?.length > 0
                  ? optionSelected?.length + " Selected"
                  : "Select"
              }
            />
          );
        }}
      </MultiSelect>
    );
  } else if (
    (fieldType === "select" && oType !== null) ||
    (fieldType === "dropdown" && oType !== null) ||
    (fieldType === "multiselect" && oType === "filterOpEquals") ||
    (fieldType === "multiSelect" && oType === "filterOpEquals")
  ) {
    return (
      <AdvFilterDropdown
        variant="default-select"
        options={Object.values(options)}
        onChange={(e: tOptionValue) => {
          setValue(e);
        }}
        placeholder="Select"
        value={valueArray[0]}
      />
    );
  } else if (fieldType === "time" && oType !== null) {
    return (
      <DatePicker
        onChange={(date: any) => {
          const utcDate = moment(date, "HH:mm:ss").utc().format("HH:mm:ss");
          setValue(utcDate);
        }}
        label=""
        variant="time"
        timeInterval={30}
        timeFormat={24}
        style={{
          position: "absolute",
          top: "auto",
          right: "auto",
          zIndex: 1,
          width: "100%",
        }}
      >
        {({ value, open, setOpen }: any) => (
          <div onClick={() => setOpen(!open)}>
            <TextInput
              id="someId"
              name={`${columnName}-text`}
              className="someClassname"
              placeholder=""
              onClick={() => {
                setOpen(!open);
              }}
              value={
                value
                  ? moment
                      .utc(moment.utc(value, `HH:mm:ss`), `HH:mm:ss`)
                      .tz(clientProperties?.TIMEZONE?.propertyValue)
                      .format("HH:mm:ss")
                  : ""
              }
              read-only
              fullWidth
              onChange={() => {}}
            />
          </div>
        )}
      </DatePicker>
    );
  } else if (fieldType === "date" || fieldType === "calendar") {
    let startDate: Date, endDate: Date;

    if (!value) {
      startDate = new Date();
      endDate = new Date();
    } else if (typeof value === "string") {
      const [sDate, eDate] = value.split(",");
      startDate = moment(sDate, format).toDate();
      endDate = moment(eDate, format).toDate();
    } else {
      startDate = value[0];
      endDate = value[1];
    }

    return (
      <DateRangePicker
        onChange={() => {}}
        onApply={(date: any) => {
          const from = moment(date[0], format)
            .startOf("day")
            .utc()
            .format(`${format} HH:mm:ss`);
          const to = moment(date[1], format)
            .endOf("day")
            .utc()
            .format(`${format} HH:mm:ss`);
          setValue(from + "," + to);
        }}
        label="Date"
        variant="daterange"
        timeFormat={12}
        showTime={false}
        startDate={startDate}
        endDate={endDate}
        fromDateFormatter={getFormattedDate}
        toDateFormatter={getFormattedDate}
        stringToDate={convertStringToDate}
        dateToString={dateToString}
        style={{
          position: "fixed",
          left: "0px",
          top: "20%",
          zIndex: 999,
        }}
      >
        {({ value, open, setOpen }: any) => {
          return (
            <div onClick={() => setOpen(!open)}>
              <TextInput
                id="someId"
                name={`${columnName}-text`}
                className="someClassname"
                variant="basic"
                border={false}
                labelColor="text.inputLabel.default"
                placeholder=""
                fullWidth
                value={
                  startDate
                    ? `${moment(startDate).format(`${format}`)} - ${moment(
                        endDate
                      ).format(`${format}`)}`
                    : value
                }
              />
            </div>
          );
        }}
      </DateRangePicker>
    );
  } else if (fieldType === "customfieldnodecount") {
    return (
      <TextInput
        value={value}
        type="number"
        onChange={(e: any) => setValue(e.target.value)}
        style={{ height: "35px" }}
      />
    );
  } else {
    return null;
  }
};

export default ThirdElement;
