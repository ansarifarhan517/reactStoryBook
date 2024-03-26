import React from "react";
import { ComponentType } from "react";
import { Cell } from 'react-table';
import TextOverflowEllipsis from "../../../../../utils/components/TextOverflowEllipsis";

export interface ICellMapping {
    [key: string]: ComponentType<Cell>
}

export const ALL_COMPARTMENT_LISTVIEW_CELL_MAPPING: ICellMapping = {
    default: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value)
}