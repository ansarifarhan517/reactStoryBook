import React from "react";
import { ComponentType } from "react";
import { Cell } from 'react-table';
import TextOverflowEllipsis from "../../../../../utils/components/TextOverflowEllipsis";
import store from "../../../../../utils/redux/store";
import moment from 'moment';
import ToggleCell from "../../../../../utils/components/CellMapping/ToggleCell";
import { convertUTCTimeToLocalTime } from "../utils";
export interface ICellMapping {
    [key: string]: ComponentType<Cell>
}
export const TimeCell = React.memo(({ value }: Cell<any>) => {
    const { timezoneMode, timezone } = JSON.parse(localStorage.getItem('userAccessInfo') || "{}");
    let date;
    if (value) {
    if (timezoneMode && timezoneMode === "MYTIMEZONE") {
        date = moment.utc(value,"HH:mm:ss").tz(timezone).format("hh:mm A");
    } else {
        date = convertUTCTimeToLocalTime(value, true);
    }
}
    return <TextOverflowEllipsis title={date}>{date}</TextOverflowEllipsis>
}, (p, n) => p.value === n.value)

export const ALL_SERVICETYPE_LISTVIEW_CELL_MAPPING: ICellMapping = {
    default: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    cutOffTime: TimeCell,
    serviceStartTime: TimeCell,
    serviceEndTime: TimeCell,
    deliveryBeforeTime: TimeCell,
    considerHolidays: React.memo(({ value }: Cell<any>) => {
        const dynamicLabels = store.getState().dynamicLabels;
        return <TextOverflowEllipsis title={value=== 'Y' ? dynamicLabels.YES : dynamicLabels.NO}>{value=== 'Y' ? dynamicLabels.YES : dynamicLabels.NO}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    activeFlag: ToggleCell,

    branchId: React.memo(({ row }: Cell<any>) => {
        return <TextOverflowEllipsis title={row.original.branchNames}>{row.original.branchNames}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    deliverSLA: React.memo(({ value, row }: Cell<any>) => {
        const dynamicLabels = store.getState().dynamicLabels;
        return <TextOverflowEllipsis title={value + ' ' + `${row.original.deliverSLAUnit ? (row.original.deliverSLAUnit): dynamicLabels.Mins}`}>{value} {row.original.deliverSLAUnit ? row.original.deliverSLAUnit: dynamicLabels.Mins}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    
    deliveryType: React.memo(({ row }: Cell<any>) => {
        return <TextOverflowEllipsis title={row.original.deliveryTypes}>{row.original.deliveryTypes}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value)
}