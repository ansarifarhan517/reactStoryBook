import React, { Dispatch } from 'react'
import { useDispatch } from 'react-redux'
import { NumberInput } from 'ui-library'
import { Cell } from 'react-table'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import useDebounce from '../../../../utils/useDebounce'
import { tShipperListViewAcions } from '../ShipperListView.actions'


const NumberField =({ row, column, value }: Cell<any>) => {
    const dispatch = useDispatch<Dispatch<tShipperListViewAcions>>()
    const editDetails = useTypedSelector(state => state.shipper.listView.editDetails)
    const [inputVal, setInputVal] = React.useState(value)
    const lastUpdatedCell = useTypedSelector(state => state.shipper.listView.lastUpdatedCell)
    const debouncedValue = useDebounce(inputVal, 500)
    React.useEffect(() => {
        if (value === debouncedValue) {
        } else {
            dispatch({
                type: '@@shipperListView/SET_EDIT_DETAILS',
                payload: {
                  rowId: row?.original?.shipperDetailsId,
                  columnId: column.id,
                  value: debouncedValue,
                  hasError: false
                }
              })
        }
    }, [debouncedValue])

    return <NumberInput id={`editableCell-${row.id}-${column.id}`}
        autoFocus={`${row.original.shipperDetailsId}-${column.id}` === lastUpdatedCell}
        fullWidth
        maxLength={column.id === 'phoneNumber' ?  10 : 15}
        defaultValue={
            editDetails?.[row.original.shipperDetailsId]?.[column.id] ?
                editDetails?.[row.original.shipperDetailsId]?.[column.id]?.value || ''
                : inputVal
        }
        type='number'
        error={editDetails?.[row.original.shipperDetailsId]?.[column.id]?.hasError}
        variant='inline-edit'
        onChange={React.useCallback((_value: any) => {
            setInputVal(_value)
        }, [setInputVal])} />
}
export default NumberField