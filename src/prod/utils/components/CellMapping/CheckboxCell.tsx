import React from 'react'
import { Cell } from 'react-table'
import { Checkbox } from 'ui-library'


export default React.memo(({ value, row, column }: Cell<any>) => {
    const [present, setPresent] = React.useState<boolean>(value)
    React.useEffect(() => {
        setPresent(value)
    }, [value])
    // for intransit and inactive disable it
   const disabled = row?.original?.statusCd === "Intransit" || !row.original.isActiveFl
    return <Checkbox
        checked={present}
        disabled={disabled}
        checkboxSize='md'
        disabledVariant='greyed'
        id='attendance'
        onChange={() => {
            setPresent(p => {
                column?.['cellCallback'](!p, row.original, setPresent)
                return !p
            })
        }} />

}, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original))
