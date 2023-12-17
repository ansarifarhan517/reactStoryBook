import React from "react";
import { Cell } from "react-table";
import TextOverflowEllipsis from "../TextOverflowEllipsis";
import { convertDateTimeZone } from "../../helper";
//import { theme } from '../../theme'
import useClientProperties from "../../../modules/common/ClientProperties/useClientProperties";

export default React.memo(
  ({ value, column, row }: Cell<any>) => {
    const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
    const dateFormat = clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + " hh:mm A z";
    const myTimeZoneMode = localStorage.getItem('userAccessInfo') ? (JSON.parse(localStorage.getItem('userAccessInfo') || '' )?.['timezoneMode'] == 'MYTIMEZONE' ? true : false): false;
    const timeZone = row.original[column.id + "TZ"]
      ? row.original[column.id + "TZ"]
      : (JSON.parse(localStorage.getItem('userAccessInfo') || '' )?.['timezone'] || clientProperties?.TIMEZONE?.propertyValue?.toUpperCase());
      const myTimeZone =JSON.parse(localStorage.getItem('userAccessInfo') || '' )?.['timezone'] 
    if (!value) {
      return <div></div>;
    }
    return (
      <TextOverflowEllipsis
        title={!myTimeZoneMode ? convertDateTimeZone(value, timeZone, dateFormat) : convertDateTimeZone(value, myTimeZone, dateFormat)}
      >
        {!myTimeZoneMode ? convertDateTimeZone(value, timeZone, dateFormat) : convertDateTimeZone(value, myTimeZone, dateFormat)}
      </TextOverflowEllipsis>
    );
  },
  (p, n) => p.value === n.value
);
