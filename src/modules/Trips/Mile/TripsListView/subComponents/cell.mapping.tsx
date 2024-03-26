import React from "react";
import { Cell } from "react-table";
import AnchorTextCell from "../../../../../utils/components/CellMapping/AnchorTextCell";
import FormattedDateCell from "../../../../../utils/components/CellMapping/FormattedDateCell";
import FormattedDateWithOwnTimeZoneCell from "../../../../../utils/components/CellMapping/FormattedDateWithOwnTimeZoneCell";
import useClientProperties from "../../../../common/ClientProperties/useClientProperties";
import TextOverflowEllipsis from "../../../../../utils/components/TextOverflowEllipsis";
import { metricsConversion } from "../../../../../utils/helper";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import store from "../../../../../utils/redux/store";
import { StyledNumber } from "../TripListView.styles";
import { distanceUnitFormatter } from "../../../../Analytics/OverallSummary/subComponents/utils/utilities";

export const TRIP_LIST_VIEW_CELL_MAPPING = {
  tripName: AnchorTextCell,
  milkRun: AnchorTextCell,
  tripStatus: React.memo(
    ({ value }: Cell<any>) => {
      const dynamicLabels = useTypedSelector((state) => state.dynamicLabels);
      return (
        <TextOverflowEllipsis title={dynamicLabels[value]}>
          {dynamicLabels[value]}
        </TextOverflowEllipsis>
      );
    },
    (p, n) => p.value === n.value
  ),
  lastTrackingDate: FormattedDateCell,
  estimatedEndDate: FormattedDateWithOwnTimeZoneCell,
  estimatedStartDate: FormattedDateWithOwnTimeZoneCell,
  tripEndDt: FormattedDateWithOwnTimeZoneCell,
  tripStartDt: FormattedDateWithOwnTimeZoneCell,
  unitsCapacity: React.memo(
    ({ value }: Cell<any>) => {
      return (
        <TextOverflowEllipsis title={value?.toFixed(2) || 0}>
          {value?.toFixed(2) || 0}
        </TextOverflowEllipsis>
      );
    },
    (p, n) => p.value === n.value
  ),
  volumeCapacity: React.memo(
    ({ value }: Cell<any>) => {
      return (
        <TextOverflowEllipsis title={value?.toFixed(2) || 0}>
          {value?.toFixed(2) || 0}
        </TextOverflowEllipsis>
      );
    },
    (p, n) => p.value === n.value
  ),
  weightCapacity: React.memo(
    ({ value }: Cell<any>) => {
      return (
        <TextOverflowEllipsis title={value?.toFixed(2) || 0}>
          {value?.toFixed(2) || 0}
        </TextOverflowEllipsis>
      );
    },
    (p, n) => p.value === n.value
  ),
  utilizedCapacityInUnits: React.memo(
    ({ value }: Cell<any>) => {
      return (
        <TextOverflowEllipsis title={value?.toFixed(2) || 0}>
          {value?.toFixed(2) || 0}
        </TextOverflowEllipsis>
      );
    },
    (p, n) => p.value === n.value
  ),
  utilizedCapacityInVolume: React.memo(
    ({ value }: Cell<any>) => {
      return (
        <TextOverflowEllipsis title={value?.toFixed(3).slice(0,-1) || 0}>
          {value?.toFixed(3).slice(0,-1) || 0}
        </TextOverflowEllipsis>
      );
    },
    (p, n) => p.value === n.value
  ),
  utilizedCapacityInWeight: React.memo(
    ({ value }: Cell<any>) => {
      return (
        <TextOverflowEllipsis title={value?.toFixed(3).slice(0,-1) || 0}>
          {value?.toFixed(3).slice(0,-1) || 0}
        </TextOverflowEllipsis>
      );
    },
    (p, n) => p.value === n.value
  ),
  trackerCount: React.memo(({ value, row, column }: Cell<any>) => {
    return (
      <StyledNumber disabledValue={!value} onClick={() => { if(value > 0) { column?.["cellCallback"](row.original) }}}>
          {value || "0"}
      </StyledNumber>
    );
  }, (p, n) => p.value === n.value),
  actualDistance: React.memo(
    ({ value }: Cell<any>) => {
      const clientProperties = useClientProperties(["DISTANCE"]);
      let preferredUnit = clientProperties?.DISTANCE?.propertyValue;
      return (
        <TextOverflowEllipsis title={distanceUnitFormatter(value, preferredUnit)?.toFixed(2) || 0}>
          {distanceUnitFormatter(value, preferredUnit)?.toFixed(2) || 0}
        </TextOverflowEllipsis>
      );
    },
    (p, n) => p.value === n.value
  ),
  estimatedDistance: React.memo(
    ({ value }: Cell<any>) => {
      const clientProperties = useClientProperties(["DISTANCE"]);
      let preferredUnit = clientProperties?.DISTANCE?.propertyValue;
      return (
        <TextOverflowEllipsis title={distanceUnitFormatter(value, preferredUnit)?.toFixed(2) || 0}>
          {distanceUnitFormatter(value, preferredUnit)?.toFixed(2) || 0}
        </TextOverflowEllipsis>
      );
    },
    (p, n) => p.value === n.value
  ),
  default: React.memo(
    ({ value }: Cell<any>) => {
      //add type wise return here so all the mappings are proper
      return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
    },
    (p, n) => p.value === n.value
  ),
};

export const TRIP_TRACKER_LIST_VIEW_CELL_MAPPING = {
  lastTrackedDt: FormattedDateWithOwnTimeZoneCell,
  speed: React.memo(({ row }: Cell<any>) => {
    const metrics = store.getState().globals.metrics;
    const clientObj = metrics && metrics['speed'];
    const speed = row.original?.speed ? parseFloat(metricsConversion(row.original?.speed, 'GET', clientObj?.conversionFactor).toString()).toFixed(2).toString() : "";
    return <TextOverflowEllipsis title={speed}>{speed}</TextOverflowEllipsis>
  }, (p, n) => p.value === n.value),
  reeferActive: React.memo(({ row, }: Cell<any>) => {
    return <TextOverflowEllipsis title={row.original.reeferActive ? 'True' : 'False'}>{row.original.reeferActive ? 'True' : 'False'}</TextOverflowEllipsis>
  }, (p, n) => p.value === n.value),
  doorStatus: React.memo(({ row }: Cell<any>) => {
    return <TextOverflowEllipsis title={row.original.doorStatus ? 'True' : 'False'}>{row.original.doorStatus ? 'True' : 'False'}</TextOverflowEllipsis>
  }, (p, n) => p.value === n.value),
  default: React.memo(
    ({ value }: Cell<any>) => {
      return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
    },
    (p, n) => p.value === n.value
  ),
}