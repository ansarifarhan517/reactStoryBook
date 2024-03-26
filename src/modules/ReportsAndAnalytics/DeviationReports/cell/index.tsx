import React from "react"
import { ComponentType } from "react";
import { Cell } from 'react-table'
import TextOverflowEllipsis from "../../../../utils/components/TextOverflowEllipsis";
import { metricsConversion } from "../../../../utils/helper";
import { getFormattedDate } from "../../../../utils/LogiHelper";
import store from "../../../../utils/redux/store";
import moment from "moment";
import useClientProperties from "../../../common/ClientProperties/useClientProperties";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";

export interface ICellMapping {
    [key: string]: ComponentType<Cell>
}

export const DEVIATION_SUMMARY_REPORT_CELL_MAPPING: ICellMapping = {
    default: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    trackerId: React.memo(({ row }: Cell<any>) => {
        return <TextOverflowEllipsis title={row.original.trackerId}>{row.original.trackerId}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    dataSource: React.memo(({ value }: Cell<any>) => {
      const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
      return <TextOverflowEllipsis title={dynamicLabels[value]}>{dynamicLabels[value]}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    daContactNo: React.memo(({ row }: Cell<any>) => {
        return <TextOverflowEllipsis title={row.original.dmContact}>{row.original.dmContact}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    driverContactNo: React.memo(({ row }: Cell<any>) => {
        return <TextOverflowEllipsis title={row.original.driverContact}>{row.original.driverContact}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    maxSpeed: React.memo(({ row }: Cell<any>) => {
        const metrics = store.getState().globals.metrics;
        const clientObj = metrics && metrics['speed'];
        const maxSpeed = metricsConversion(row.original.toleranceSettings.maxSpeed, 'GET', clientObj?.conversionFactor);
        return <TextOverflowEllipsis title={parseFloat(maxSpeed.toFixed(2)).toString()}>{parseFloat(maxSpeed.toFixed(2))}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    minSpeed: React.memo(({ row }: Cell<any>) => {
        const metrics = store.getState().globals.metrics;
        const clientObj = metrics && metrics['speed'];
        const minSpeed = metricsConversion(row.original.toleranceSettings.minSpeed, 'GET', clientObj?.conversionFactor);
        return <TextOverflowEllipsis title={parseFloat(minSpeed.toFixed(2)).toString()}>{parseFloat(minSpeed.toFixed(2))}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    maxTemperature: React.memo(({ row }: Cell<any>) => {
        return <TextOverflowEllipsis title={row.original.toleranceSettings.maxTemprature}>{row.original.toleranceSettings.maxTemprature}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    minTemperature: React.memo(({ row }: Cell<any>) => {
        return <TextOverflowEllipsis title={row.original.toleranceSettings.minTemprature}>{row.original.toleranceSettings.minTemprature}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    drivingTimeRestrictionDeviationCount: React.memo(({ row }: Cell<any>) => {
        return <TextOverflowEllipsis title={row.original.drivingHourDeviation}>{row.original.drivingHourDeviation}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    gpsGridTolerance: React.memo(({ row }: Cell<any>) => {
        return <TextOverflowEllipsis title={row.original.toleranceSettings.gpsTolerance}>{row.original.toleranceSettings.gpsTolerance}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    gpsGridOffDeviationCount: React.memo(({ row }: Cell<any>) => {
        return <TextOverflowEllipsis title={row.original.gpsGridDeviation}>{row.original.gpsGridDeviation}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    speedingDeviationIncidentCount: React.memo(({ row }: Cell<any>) => {
        return <TextOverflowEllipsis title={row.original.speedDeviation}>{row.original.speedDeviation}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    temperatureDeviationCount: React.memo(({ row }: Cell<any>) => {
        return <TextOverflowEllipsis title={row.original.tempratureDeviation}>{row.original.tempratureDeviation}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    tripStartDate: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={getFormattedDate(value)}>{getFormattedDate(value)}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    tripEndDate: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={getFormattedDate(value)}>{getFormattedDate(value)}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
}

export const GPS_GRID_OFF_CELL_MAPPING: ICellMapping = {
    default: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    tripStartDt: React.memo(({ value }) => (
        value ? (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        ) : <> </>
      ), (p, n) => p.value === n.value),
    tripEndDt: React.memo(({ value }) => (
        value ? (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        ) : <> </>
      ), (p, n) => p.value === n.value),
    deviationStartDate: React.memo(({ value }) => (
        value ? (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        ) : <> </>
      ), (p, n) => p.value === n.value),
    deviationEndDate: React.memo(({ value }) => (
        value ? (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        ) : <> </>
      ), (p, n) => p.value === n.value),
      dataSource: React.memo(({ value }: Cell<any>) => {
        const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
        return <TextOverflowEllipsis title={dynamicLabels[value]}>{dynamicLabels[value]}</TextOverflowEllipsis>
      }, (p, n) => p.value === n.value),
}


export const OVER_SPEED_DEVIATION_CELL_MAPPING: ICellMapping = {
    default: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    tripStartDt: React.memo(({ value }) => (
        value ? (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        ) : <> </>
      ), (p, n) => p.value === n.value),
    tripEndDt: React.memo(({ value }) => (
        value ? (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        ) : <> </>
      ), (p, n) => p.value === n.value),
    deviationStartDate: React.memo(({ value }) => (
        value ? (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        ) : <> </>
      ), (p, n) => p.value === n.value),
    deviationEndDate:React.memo(({ value }) => (
        value ? (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        ) : <> </>
      ), (p, n) => p.value === n.value),
    deviatedValue: React.memo(({ row }: Cell<any>) => {
        const metrics = store.getState().globals.metrics;
        const clientObj = metrics && metrics['speed'];
        const maxSpeed = metricsConversion(row.original.deviatedValue, 'GET', clientObj?.conversionFactor);
        return <TextOverflowEllipsis title={parseFloat(maxSpeed.toFixed(2)).toString()}>{parseFloat(maxSpeed.toFixed(2))}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    toleranceRangeStart: React.memo(({ value }: Cell<any>) => {
        const metrics = store.getState().globals.metrics;
        const clientObj = metrics && metrics['speed'];
        const minSpeed = metricsConversion(value, 'GET', clientObj?.conversionFactor);
        return <TextOverflowEllipsis title={parseFloat(minSpeed.toFixed(2)).toString()}>{parseFloat(minSpeed.toFixed(2))}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    toleranceRangeEnd: React.memo(({ value }: Cell<any>) => {
        const metrics = store.getState().globals.metrics;
        const clientObj = metrics && metrics['speed'];
        const maxSpeed = metricsConversion(value, 'GET', clientObj?.conversionFactor);
        return <TextOverflowEllipsis title={parseFloat(maxSpeed.toFixed(2)).toString()}>{parseFloat(maxSpeed.toFixed(2))}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    dataSource: React.memo(({ value }: Cell<any>) => {
      const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
      return <TextOverflowEllipsis title={dynamicLabels[value]}>{dynamicLabels[value]}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
}

export const TEMPERATURE_DEVIATION_CELL_MAPPING: ICellMapping = {
    default: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    tripStartDt: React.memo(({ value }) => (
        value ? (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        ) : <> </>
      ), (p, n) => p.value === n.value),
    tripEndDt: React.memo(({ value }) => (
        value ? (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        ) : <> </>
      ), (p, n) => p.value === n.value),
    dataSource: React.memo(({ value }: Cell<any>) => {
        const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
        return <TextOverflowEllipsis title={dynamicLabels[value]}>{dynamicLabels[value]}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
}

export const RESTRICTED_DRIVING_TIME_DEVAIATION_CELL_MAPPING: ICellMapping = {
     default: React.memo(({value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
     },(p,n) =>p.value === n.value),
     tripStartDt: React.memo(({ value }) => (
        value ? (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        ) : <> </>
      ), (p, n) => p.value === n.value),
    tripEndDt:React.memo(({ value }) => (
        value ? (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        ) : <> </>
      ), (p, n) => p.value === n.value),
    deviationStartDate: React.memo(({ value }) => (
        value ? (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        ) : <> </>
      ), (p, n) => p.value === n.value),
    deviationEndDate: React.memo(({ value }) => (
        value ? (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        ) : <> </>
      ), (p, n) => p.value === n.value),
    toleranceRangeStart: React.memo(({ value}: Cell<any>) => {
        const clientProperties = useClientProperties(["TIMEZONE"]);
        const val = value ? moment.utc(moment.utc(value, `HH:mm`), `HH:mm`).tz(clientProperties?.TIMEZONE
            ?.propertyValue).format("HH:mm") : '';
        return <TextOverflowEllipsis title={val}>{val}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    toleranceRangeEnd: React.memo(({ value}: Cell<any>) => {
        const clientProperties = useClientProperties(["TIMEZONE"]);
        const val = value ? moment.utc(moment.utc(value, `HH:mm`), `HH:mm`).tz(clientProperties?.TIMEZONE
            ?.propertyValue).format("HH:mm") : '';
        return <TextOverflowEllipsis title={val}>{val}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    deviatedValue:React.memo(({ value }: Cell<any>) => {
        if (!value) {
            return <></>
        }
        const metrics = store.getState().globals.metrics;
        const clientObj = metrics && metrics['distance'];
        const distance = metricsConversion(value, 'GET', clientObj?.conversionFactor);
        return <TextOverflowEllipsis title={parseFloat(distance.toFixed(2)).toString()}>{parseFloat(distance.toFixed(2))}</TextOverflowEllipsis>
       
    }, (p, n) => p.value === n.value),
    dataSource: React.memo(({ value }: Cell<any>) => {
      const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
      return <TextOverflowEllipsis title={dynamicLabels[value]}>{dynamicLabels[value]}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
}

export const FLEET_MOVEMENT_STUCK_REPORT: ICellMapping = {
     default: React.memo(({value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
     },(p,n) =>p.value === n.value),
     tripStartDt: React.memo(({ value }) => (
        value ? (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        ) : <> </>
      ), (p, n) => p.value === n.value),
    tripEndDt:React.memo(({ value }) => (
        value ? (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        ) : <> </>
      ), (p, n) => p.value === n.value),
    deviationStartDate:React.memo(({ value }) => (
        value ? (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        ) : <> </>
      ), (p, n) => p.value === n.value),
    stuckDistanceTolerance: React.memo(({ row }: Cell<any>) => {
      const stuckDistance = row.original.stuckDistanceTolerance * 1000 // convert km to meters
      return <TextOverflowEllipsis title={parseFloat(stuckDistance.toFixed(2)).toString()}>{parseFloat(stuckDistance.toFixed(2))}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    dataSource: React.memo(({ value }: Cell<any>) => {
      const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
      return <TextOverflowEllipsis title={dynamicLabels[value]}>{dynamicLabels[value]}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
}
