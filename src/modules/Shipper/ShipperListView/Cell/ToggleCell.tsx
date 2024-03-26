import React from 'react'
import { Cell } from 'react-table'
import { Position, Toggle } from 'ui-library'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'


export default React.memo(({ value, column, row }: Cell) => {
    const isEditMode = useTypedSelector(state => state.shipper.listView.isEditMode)
    const breadCrumbFilter = useTypedSelector(state => state.shipper.listView.breadcrumbFilter)

    const [active, setActive] = React.useState<boolean>(value)
    React.useEffect(() => {
        setActive(value)
    }, [value])


    // in edit mode, if no value coming, if filter is approved and no key value coming for status then
    let disabled = !row?.values || isEditMode || row?.values?.status !== 'APPROVED'
    if (!row?.values?.status && breadCrumbFilter === 'APPROVED' && !isEditMode) {
        disabled = false
    }

    //right disable logic if noOfUser is 0
    return <Position type='absolute' top='4px' left='1em'>
        <Toggle
            checked={active}
            disabled={disabled}
            onChange={({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
                setActive(checked)
                column?.['cellCallback'](checked, row.original, setActive)
            }
            }
            style={disabled ? { cursor: 'not-allowed' } : {}}
        />
    </Position>
}, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original))
