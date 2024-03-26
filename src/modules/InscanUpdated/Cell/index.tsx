import React from 'react';
import { Cell } from 'react-table';
import TextOverflowEllipsis from '../../../utils/components/TextOverflowEllipsis';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import { InCompleteScanningIcon } from '../Components/InscanStyledComponent';
export const ORDER_INSCAN_CELL_MAPPING = {
    default: React.memo(
        ({ value }: Cell<any>) => {
            return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
        },
        (p, n) => p.value === n.value
    ),
    scannedCrates: React.memo(
        ({ column, row }: Cell<any>) => {
            return (
                row.original.crates ? <span style={{ color: "#5698d3", cursor: 'pointer', textAlign: 'left' }} onClick={() => column?.['cellCallback'](row.original)}>
                    {row.original.crates ? (row.original.scannedCrateCodes && row.original.scannedCrateCodes.size < row.original.crates.length ? row.original.scannedCrateCodes.size + "/" + row.original.crates.length : row.original.crates.length + "/" + row.original.crates.length) : 0}
                </span>
                    : null
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
}
