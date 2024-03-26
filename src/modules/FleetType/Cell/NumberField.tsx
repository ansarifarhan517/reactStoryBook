import { useDispatch } from 'react-redux'
import React, { Dispatch } from 'react'
import { NumberInput } from 'ui-library'
import { Cell } from 'react-table'
import { tFleetTypeListViewAcions } from '../FleetTypeListView.actions'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import useDebounce from '../../../utils/useDebounce'



const NumberField = ({ row, column, value }: Cell<any>) => {
    const dispatch = useDispatch<Dispatch<tFleetTypeListViewAcions>>()
    const editDetails = useTypedSelector(state => state.fleet.listView.editDetails)
    const [inputVal, setInputVal] = React.useState(value)
    const lastUpdatedCell = useTypedSelector(state => state.fleet.listView.lastUpdatedCell)
    const debouncedValue = useDebounce(inputVal, 500)
    React.useEffect(() => {
        if (value !== debouncedValue) {
            dispatch({
                type: '@@fleetTypeListView/SET_EDIT_DETAILS',
                payload: {
                    rowId: row?.original?.id,
                    columnId: column.id,
                    value: debouncedValue,
                    hasError: false
                }
            })
        }
    }, [debouncedValue])

    return <NumberInput id={`editableCell-${row.id}-${column.id}`}
        autoFocus={`${row.original.id}-${column.id}` === lastUpdatedCell}
        fullWidth
        defaultValue={
            editDetails?.[row.original.id]?.[column.id] ?
                editDetails?.[row.original.id]?.[column.id]?.value || ''
                : inputVal
        }
        allowDecimal={column.id !== 'capacityInUnits'}
        type='number'
        error={editDetails?.[row.original.id]?.[column.id]?.hasError}
        variant='inline-edit'
        onChange={React.useCallback((_value: any) => {
            setInputVal(_value)
        }, [setInputVal])} />
}
export default NumberField