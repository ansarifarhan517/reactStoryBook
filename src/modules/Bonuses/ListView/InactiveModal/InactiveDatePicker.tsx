import moment from "moment";
import React from "react";
import { TextInput, DatePicker } from "ui-library";

const InactiveDatePicker = ({date, setDate, DATEFORMAT, bonusStartDate, dynamicLabels}: any) => {
  return (
    <DatePicker
      onChange={(e: any)=> setDate(e)}
      variant="date"
      timeFormat={24}
      style={{ zIndex: 9 }}
      tillMinDate={bonusStartDate}
    >
      {({ open, setOpen }) => (
        <div onClick={() => setOpen(!open)}>
          <TextInput
            id="inactiveDate"
            name="inactiveDate"
            variant="withIcon"
            iconVariant="calendar"
            label={dynamicLabels.inactiveDate || "Inactive Date"}
            placeholder={dynamicLabels.inactiveDate || "Inactive Date"}
            value={date ? moment(date).startOf("day").format(DATEFORMAT) : ''}
            onChange={()=>{}}
            iconStyle={{ padding: "8px 8px 8px 8px" }}
          />
        </div>
      )}
    </DatePicker>
  );
};

export default InactiveDatePicker;
