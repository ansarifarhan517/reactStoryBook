import React from 'react'
import { Toggle, Position } from 'ui-library'
import { Cell } from 'react-table'
import TextOverflowEllipsis from '../../../../../utils/components/TextOverflowEllipsis'



export const ORGALISATION_WEBHOOK_LIST_CELL_MAPPING = {
    default: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    isActiveFl: React.memo(({ value, column, row }: Cell) => {

        const [active, setActive] = React.useState<boolean>(value)

        React.useEffect(() => {
            setActive(value)
        }, [value])

        return <Position type='absolute' top='0.3em' left='1em'>
            <Toggle
                disabled={row.values.status === "Intransit"}
                checked={active}
                onChange={({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
                    setActive(checked)
                    column?.['cellCallback'](checked, row.original, setActive)
                }
                }
            />
        </Position>
    }, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original)),


};

export const BRANCH_WEBHOOK_LIST_CELL_MAPPING = {
    default: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    isActiveFl: React.memo(({ value, column, row }: Cell) => {

        const [active, setActive] = React.useState<boolean>(value)

        React.useEffect(() => {
            setActive(value)
        }, [value])

        return <Position type='absolute' top='0.3em' left='1em'>
            <Toggle
                disabled={row.values.status === "Intransit"}
                checked={active}
                onChange={({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
                    setActive(checked)
                    column?.['cellCallback'](checked, row.original, setActive)
                }
                }
            />
        </Position>
    }, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original))
};