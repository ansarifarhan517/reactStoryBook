import moment from "moment";
import React from "react";
import TextOverflowEllipsis from "../../../../utils/components/TextOverflowEllipsis";
import useClientProperties from "../../../common/ClientProperties/useClientProperties";

const getFormattedDate = (dateVal: number, dateFormat: string) => {
  return moment.utc(dateVal).format(`${dateFormat}`);
}

const DateCell = ({ value }: any) => {
  let clientProperties = useClientProperties(["DATEFORMAT"]);
  value = getFormattedDate(
    value,
    clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()
  );

  if (!value) {
    return <div></div>;
  }

  return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
};

export default DateCell;
