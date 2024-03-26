import React from "react";
import { ComponentType } from "react";
import { Cell } from 'react-table';
import TextOverflowEllipsis from "../../../../../utils/components/TextOverflowEllipsis";
import ToggleCell from "../../../../../utils/components/CellMapping/ToggleCell";
import store from "../../../../../utils/redux/store";

export interface ICellMapping {
    [key: string]: ComponentType<Cell>
}

export const TRACKER_CONFIG_LISTVIEW_CELL_MAPPING: ICellMapping = {
    default: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    isActiveFl: ToggleCell,
    supplierRefId: React.memo(({ row }: Cell<any>) => {
        return <TextOverflowEllipsis title={row.original.supplierRefCd}>{row.original.supplierRefCd}</TextOverflowEllipsis>;
    }, (p, n) => p.value === n.value),
    trackerTypeRefId: React.memo(({ row }: Cell<any>) => {
        return <TextOverflowEllipsis title={row.original.trackerTypeRefCd}>{row.original.trackerTypeRefCd}</TextOverflowEllipsis>;
    }, (p, n) => p.value === n.value),
    ownership: React.memo(({ value }: Cell<any>) => {
        const ownershipList = store.getState().tracker.trackerConfiguration.ownershipList;
        const selectedOwnership = ownershipList.find((e) => e.clientRefMasterId == value)?.label;
        return <TextOverflowEllipsis title={selectedOwnership}>{selectedOwnership}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

}