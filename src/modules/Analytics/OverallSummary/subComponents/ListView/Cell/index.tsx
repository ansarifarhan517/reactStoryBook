import React from "react";
import { Cell } from "react-table";
import TextOverflowEllipsis from "../../../../../../utils/components/TextOverflowEllipsis";
import { IconButton } from "ui-library";
import { getFormattedDate } from "../../../../../Order/OrderListOptionData/utils";
import useClientProperties from "../../../../../common/ClientProperties/useClientProperties";
import { distanceUnitFormatter } from "../../utils/utilities";

export const OVERALL_SUMMARY_CELL_MAPPING = {
  //Formatting the values shown on Listview

  trackNow: React.memo(
    ({ row }: Cell<any>) => {
      let hrefdata = `#/trip/locationHistory?tripId=${row.original.tripId}&startDt=${row.original.tripStartDt}&endDt=${row.original.tripEndDt}&tripStatus=${row.original.tripStatus}`;
      return (
        <div style={{ textAlign: "center", width: "inherit" }}>
          <a
            rel="noopener noreferrer"
            href={hrefdata}
            style={{ color: "#5698d3" }}
          >
            <IconButton
              iconVariant="origin"
              iconSize={16}
              onlyIcon
              style={{ color: "#5698d3", margin: "0 auto" }}
            />
          </a>
        </div>
      );
    },
    (p, n) =>
      p.value === n.value &&
      p.column?.["cellCallback"] === n.column?.["cellCallback"] &&
      JSON.stringify(p.row.original) === JSON.stringify(n.row.original)
  ),

  estimatedDistance: React.memo(
    ({ value }: Cell<any>) => {
      const clientProperties = useClientProperties(["DISTANCE"]);
      let preferredUnit = clientProperties?.DISTANCE?.propertyValue;
      return <TextOverflowEllipsis title={distanceUnitFormatter(value, preferredUnit)?.toFixed(2)}>{distanceUnitFormatter(value, preferredUnit)?.toFixed(2)}</TextOverflowEllipsis>;
    },
    (p, n) => p.value === n.value
  ),

  tripEndDt: React.memo(
    ({ value, row }: Cell<any>) => {
      if (!value) {
        return <div></div>;
      }
      return (
        <TextOverflowEllipsis
          title={getFormattedDate(value, row.original["endTimeWindowTZ"])}
        >
          {getFormattedDate(value, row.original["endTimeWindowTZ"])}
        </TextOverflowEllipsis>
      );
    },
    (p, n) => p.value === n.value
  ),

  tripStartDt: React.memo(
    ({ value, row }: Cell<any>) => {
      if (!value) {
        return <div></div>;
      }
      return (
        <TextOverflowEllipsis
          title={getFormattedDate(value, row.original["endTimeWindowTZ"])}
        >
          {getFormattedDate(value, row.original["endTimeWindowTZ"])}
        </TextOverflowEllipsis>
      );
    },
    (p, n) => p.value === n.value
  ),

  estimatedStartDate: React.memo(
    ({ value, row }: Cell<any>) => {
      if (!value) {
        return <div></div>;
      }
      return (
        <TextOverflowEllipsis
          title={getFormattedDate(value, row.original["endTimeWindowTZ"])}
        >
          {getFormattedDate(value, row.original["endTimeWindowTZ"])}
        </TextOverflowEllipsis>
      );
    },
    (p, n) => p.value === n.value
  ),

  estimatedEndDate: React.memo(
    ({ value, row }: Cell<any>) => {
      if (!value) {
        return <div></div>;
      }
      return (
        <TextOverflowEllipsis
          title={getFormattedDate(value, row.original["endTimeWindowTZ"])}
        >
          {getFormattedDate(value, row.original["endTimeWindowTZ"])}
        </TextOverflowEllipsis>
      );
    },
    (p, n) => p.value === n.value
  ),

  actualDistanceDouble: React.memo(
    ({ value }: Cell<any>) => {
      const clientProperties = useClientProperties(["DISTANCE"]);
      let preferredUnit = clientProperties?.DISTANCE?.propertyValue;
      return <TextOverflowEllipsis title={distanceUnitFormatter(value, preferredUnit)?.toFixed(2)}>{distanceUnitFormatter(value, preferredUnit)?.toFixed(2)}</TextOverflowEllipsis>;
    },
    (p, n) => p.value === n.value
  ),

  cashToBeCollected: React.memo(
    ({ value }: Cell<any>) => {
      return <TextOverflowEllipsis title={value}>{value?.toFixed(2)}</TextOverflowEllipsis>;
    },
    (p, n) => p.value === n.value
  ),

  default: React.memo(
    ({ value }: Cell<any>) => {
      return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
    },
    (p, n) => p.value === n.value
  ),

};
