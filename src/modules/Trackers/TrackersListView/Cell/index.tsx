import React from "react";
import { ComponentType } from "react";
import { Cell } from 'react-table';
import TextOverflowEllipsis from "../../../../utils/components/TextOverflowEllipsis";
import ToggleCell from "../../../../utils/components/CellMapping/ToggleCell";
import store from "../../../../utils/redux/store";
import AnchorTextCell from "../../../../utils/components/CellMapping/AnchorTextCell";
import NetWorkStatusCell from "../../../../utils/components/CellMapping/NetWorkStatusCell";
import { IconButton} from 'ui-library'
import { useTypedSelector } from "../../../../utils/redux/rootReducer";

export interface ICellMapping {
    [key: string]: ComponentType<Cell>
}

export const TRACKER_LISTVIEW_CELL_MAPPING: ICellMapping = {
    default: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    isActiveFl: ToggleCell,
    clientBranchId: React.memo(({ row, value }: Cell<any>) => {
        return <TextOverflowEllipsis title={row.original.clientBranchName}>{row.original.clientBranchName}</TextOverflowEllipsis>;
    }, (p, n) => p.value === n.value),
    lastTrackedDt: AnchorTextCell,
    gpsStatus: NetWorkStatusCell,
    status: React.memo(({ value }: Cell<any>) => {
        const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
        return <TextOverflowEllipsis title={value=== 'Inactive' ? dynamicLabels.Not_Available || 'Not Available' : value}>{value=== 'Inactive' ? 'Not Available' : value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    reeferActive: React.memo(({ value, column, row, }: Cell<any>) => {
        return <TextOverflowEllipsis title={row.original.reeferActive ? 'True' : 'False'}>{row.original.reeferActive ? 'True' : 'False'}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    doorStatus: React.memo(({ value, column, row }: Cell<any>) => {
        return <TextOverflowEllipsis title={row.original.doorStatus ? 'True' : 'False'}>{row.original.doorStatus ? 'True' : 'False'}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
}