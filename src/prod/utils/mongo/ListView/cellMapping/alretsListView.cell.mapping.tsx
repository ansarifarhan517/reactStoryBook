
import React, { ComponentType } from 'react'
import { Cell } from 'react-table'
import { Button, Toggle, Position, IconButton } from 'ui-library'
import TextOverflowEllipsis from '../../../components/TextOverflowEllipsis'
import moment from 'moment';
import useClientProperties from '../../../../modules/common/ClientProperties/useClientProperties';
import store from '../../../redux/store';

export interface ICellMapping {
    [key: string]: ComponentType<Cell>
}

const AlertsListViewCellMapping: ICellMapping = {
    default: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    alertDate: React.memo(({ value }: Cell<any>) => {
        const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT']);
        const dateValue = moment.tz(
            value,
            clientProperties?.TIMEZONE
                ?.propertyValue
        ).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm A`);
        return <div title={dateValue}>{dateValue}</div>
    }),
    createdOnDt: React.memo(({ value }: Cell<any>) => {
        const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT']);
        const dateValue = moment.tz(
            value,
            clientProperties?.TIMEZONE
                ?.propertyValue
        ).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm A`);
        return <div title={dateValue}>{dateValue}</div>
    }),
    isResolved: React.memo(({ value, column, row }: Cell) => {
        const [active, setActive] = React.useState<boolean>(value)
        React.useEffect(() => {
            setActive(value)
        }, [value])

        return <Position type='absolute' top='4px' left='1em'>
            <Toggle
                checked={active}
                onChange={({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
                    setActive(checked)
                    column?.['cellCallback'](checked, row.original, setActive)
                }
                }
            />
        </Position>
    }, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original)),
    orderNo: React.memo(({ value, column, row }: Cell<any>) => {
        if (!value) {
            return <div></div>
        }

        return (
            <TextOverflowEllipsis title={value}>
                <Button variant='link' primary onClick={() => column?.['cellCallback'](row.original)} style={{ color: "#5698d3" }}>
                    {value}
                </Button>
            </TextOverflowEllipsis>)
    }, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original)),
    orderStatus: React.memo(({ value }: Cell<any>) => {
        if (!value) {
            return <></>
        }
        const statusMap = store?.getState().alertsHistory.statusMap;
        return <TextOverflowEllipsis title={statusMap?.[value]}>{statusMap?.[value]}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    notes: ({ column, row }: Cell<any>) => {
        return (
            <div style={{ display: "flex", width: "100%", justifyContent: "flex-start" }}>
                <IconButton
                    style={{ boxShadow: "none", background: "transparent", color: row.values.notes ? "#5698d3" : "#b4b4b4" }}
                    onClick={() => column?.['cellCallback'](row.original)}
                    primary={false}
                    disabled={false}
                    iconSize="sm"
                    iconVariant='chat'
                />
            </div>
        )
    }
}

export default AlertsListViewCellMapping
