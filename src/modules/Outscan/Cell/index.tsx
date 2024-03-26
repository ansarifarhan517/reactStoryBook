import React from 'react';
import { Cell } from 'react-table';
import TextOverflowEllipsis from '../../../utils/components/TextOverflowEllipsis';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import {FontIcon} from "ui-library";
import { InCompleteScanningIcon, LinkOutIconContainer } from '../Components/OutscanStyledComponent';
import { userAccessInfo } from '../../../utils/constants';
export const ORDER_OUTSCAN_CELL_MAPPING = {
    default: React.memo(
        ({ value }: Cell<any>) => {
            return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
        },
        (p, n) => p.value === n.value
    ),
    orderNo: React.memo(
        ({  value, row }: Cell<any>) => {
            const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
            if(row.original.scannedCrateCodes && row.original.scannedCrateCodes.size < row.original.crates.length) {
                return <TextOverflowEllipsis title={value}>{value} <InCompleteScanningIcon title={dynamicLabels.scanningIncomplete || "Scanning Incomplete"}>i</InCompleteScanningIcon></TextOverflowEllipsis>;
            } else {
                return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
            }
        },
        (p, n) =>
            p.value === n.value &&
            p.column?.['cellCallback'] === n.column?.['cellCallback'] &&
            JSON.stringify(p.row.original) === JSON.stringify(n.row.original)
    ),
    orderNoMM: React.memo(
        ({  value, row }: Cell<any>) => {
            const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
            if(row.original.scannedCrateCodes && row.original.scannedCrateCodes.size < row.original.crates.length) {
                return <TextOverflowEllipsis title={value}>{value} <InCompleteScanningIcon title={dynamicLabels.scanningIncomplete || "Scanning Incomplete"}>i</InCompleteScanningIcon></TextOverflowEllipsis>;
            } else {
                return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
            }
        },
        (p, n) =>
            p.value === n.value &&
            p.column?.['cellCallback'] === n.column?.['cellCallback'] &&
            JSON.stringify(p.row.original) === JSON.stringify(n.row.original)
    ),
    scannedCrates: React.memo(
        ({ column, row }: Cell<any>) => {
            return (
                row.original.crates ? 
                <span style={{ color: "#5698d3", cursor: 'pointer', textAlign: 'left' }} onClick={() => column?.['cellCallback'](row.original)}>
                    {row.original.crates ? (row.original.scannedCrateCodes && row.original.scannedCrateCodes.size < row.original.crates.length ? row.original.scannedCrateCodes.size + "/" + row.original.crates.length : row.original.crates.length + "/" + row.original.crates.length) : 0}
                </span> : null
            );
        },
        (p, n) =>
            p.value === n.value &&
            p.column?.['cellCallback'] === n.column?.['cellCallback'] &&
            JSON.stringify(p.row.original) === JSON.stringify(n.row.original)
    ),
    packageStatusCd: React.memo(
        ({ value }: Cell<any>) => {
            const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
            return <TextOverflowEllipsis title={dynamicLabels[value]}>{dynamicLabels[value]}</TextOverflowEllipsis>;
        },
        (p, n) => p.value === n.value),
hubScanStatus: React.memo(({ value }: Cell<any>) => {
    const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
    return (
        <TextOverflowEllipsis title={dynamicLabels[value] || value}>
            {dynamicLabels[value] || value}
        </TextOverflowEllipsis>
    )
}, (p, n) => p.value === n.value),
}

export const EXCEPTION_LISTVIEW_CELL_MAPPING = {
    default: React.memo(
        ({ value }: Cell<any>) => {
            return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
        },
        (p, n) => p.value === n.value
    ),
    exceptionType: React.memo(
        ({ value, row }: Cell<any>) => {
            const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
            if(row.original.exceptionType === "Restrictive") {
                return <TextOverflowEllipsis title={dynamicLabels.actionRequired}>{dynamicLabels.actionRequired}</TextOverflowEllipsis>;
            } else {
                return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
            }
        },
        (p, n) => p.value === n.value
    ),
    exceptionCode: React.memo(
        ({ value }: Cell<any>) => {
                const hasAccess = userAccessInfo?.userMenuAccessDTOs?.find((userAccessMenu: Record<string, any>) => userAccessMenu.url === "order")?.accessHirarchyDTO?.filter((access:Record<string, any>) => access.url === 'exceptions').length;
                return <TextOverflowEllipsis title={value}>{value }{hasAccess ? <LinkOutIconContainer><a href={`${window.location.origin}${window.location.pathname}#/exceptions`} target="_blank"><FontIcon size={10} color="#E65A60" variant="linkout"  style={{fontSize:10, color: '#E65A60'}} /></a></LinkOutIconContainer>: null}</TextOverflowEllipsis>;
            
        },
        (p, n) => p.value === n.value
    )
}

export const MANIFEST_OF_MANIFEST_LISTVIEW_CELL_MAPPING = {
    default: React.memo(
        ({ value }: Cell<any>) => {
            return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
        },
        (p, n) => p.value === n.value
    ),
    hubScanStatus: React.memo(({ value }: Cell<any>) => {
        const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
        return (
            <TextOverflowEllipsis title={dynamicLabels[value] || value}>
                {dynamicLabels[value] || value}
            </TextOverflowEllipsis>
        )
    }, (p, n) => p.value === n.value),
}