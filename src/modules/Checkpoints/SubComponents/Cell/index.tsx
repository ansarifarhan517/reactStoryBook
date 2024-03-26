import React from "react";
import TextOverflowEllipsis from "../../../../utils/components/TextOverflowEllipsis";
import { Cell } from "react-table";
import { Toggle, Position } from "ui-library";
import { RoutesNumber } from "../../CheckpointsListView/CheckpointsListViewStyledComponent";
import useClientProperties from "../../../common/ClientProperties/useClientProperties";

const arePropsEqual = (prevProps, newProps) =>
  prevProps.value === newProps.value &&
  prevProps.column?.["cellCallback"] === newProps.column?.["cellCallback"] &&
  JSON.stringify(prevProps.row.original) ===
    JSON.stringify(newProps.row.original);

const distanceUnitFormatter = (shape, value, unit) => {
  if (shape === "CIRCLE") {
    return unit === "KM" ? value : value * 0.621371;
  } else if (shape === "POLYGON") {
    return unit === "KM" ? value : value * 0.386102;
  }
}
    
export const CHECK_POINTS_CELL_MAPPING = {
  default: React.memo(
    ({ value }: Cell<any>) => {
      return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
    },
    (p, n) => p.value === n.value
  ),

  isActiveFl: React.memo(
    ({ value, column, row }: Cell) => {
      const [active, setActive] = React.useState<boolean>(value);
      React.useEffect(() => {
        setActive(value);
      }, [value]);

      return (
        <Position type="absolute" top="0.4em" left="1em">
          <Toggle
            checked={active}
            onChange={({
              target: { checked },
            }: React.ChangeEvent<HTMLInputElement>) => {
              setActive(checked);
              column?.["cellCallback"](checked, row.original, setActive);
            }}
          />
        </Position>
      );
    },
    (p, n) =>
      p.value === n.value &&
      p.column?.["cellCallback"] === n.column?.["cellCallback"] &&
      JSON.stringify(p.row.original) === JSON.stringify(n.row.original)
  ),
  isFavourite: React.memo(
    ({ value }: Cell) => {
      return (
        <Position type="absolute" top="0em" left="1em">
          <Toggle checked={value} disabled />
        </Position>
      );
    },
    (p, n) =>
      p.value === n.value &&
      p.column?.["cellCallback"] === n.column?.["cellCallback"] &&
      JSON.stringify(p.row.original) === JSON.stringify(n.row.original)
  ),
  checkpointRadiusOrArea :React.memo(
    ({row }: Cell<any>) => {
      const clientProperties = useClientProperties(["DISTANCE"]);
      let preferredUnit = clientProperties?.DISTANCE?.propertyValue;
      return <TextOverflowEllipsis title={distanceUnitFormatter(row.original.shapeType, row.original.radiusInKms ? row.original.radiusInKms : 0, preferredUnit)?.toFixed(2)}>{distanceUnitFormatter(row.original.shapeType, row.original.radiusInKms ? row.original.radiusInKms : 0, preferredUnit)?.toFixed(2)}</TextOverflowEllipsis>;
    },
    (p, n) =>
    p.value === n.value &&
    p.column?.["cellCallback"] === n.column?.["cellCallback"] &&
    JSON.stringify(p.row.original) === JSON.stringify(n.row.original)
  ),
  routeCount: React.memo(({ value, row, column }: Cell<any>) => {
    return (
      <RoutesNumber disabledValue={!value}>
        <span onClick={() => value > 0 && column?.["cellCallback"](row.original)}>
          {value || "0"}
        </span>
      </RoutesNumber>
    );
  }, arePropsEqual),
};
