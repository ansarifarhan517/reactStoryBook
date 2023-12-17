import React from 'react'
import { Cell } from 'react-table'
import { Position, Toggle } from 'ui-library'


export default React.memo(({ value, column, row }: Cell) => {
    const [active, setActive] = React.useState<boolean>(value)
    React.useEffect(() => {
        setActive(value)
    }, [value])

    const disabled = row.values?.statusCd === 'Intransit'
    return <Position type='absolute' top='4px' left='1em'>
        <Toggle
            disabled={disabled}
            checked={active}
            onChange={({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
                setActive(checked)
                column?.['cellCallback'](checked, row.original, setActive)
            }
            }
        />
    </Position>
}, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original))
