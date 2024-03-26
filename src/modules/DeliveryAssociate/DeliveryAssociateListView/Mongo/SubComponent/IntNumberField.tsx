import { useDispatch } from 'react-redux'
import React, { Dispatch } from 'react'
import { NumberInput } from 'ui-library'
import { Cell } from 'react-table'
import { useTypedSelector } from '../../../../../utils/redux/rootReducer'
import useDebounce from '../../../../../utils/useDebounce'
import { tDAListViewActions } from '../../DeliveryAssociate.actions'



const IntNumberField =({ row, column, value }: Cell<any>) => {
    const dispatch = useDispatch<Dispatch<tDAListViewActions>>()
    const editDetails = useTypedSelector(state => state.deliveryMedium.listView.editDetails)
    const [inputVal, setInputVal] = React.useState(value)
    const lastUpdatedCell = useTypedSelector(state => state.deliveryMedium.listView.lastUpdatedCell)
    const debouncedValue = useDebounce(inputVal, 500)
    React.useEffect(() => {
        if (value === debouncedValue) {
            // dispatch({
            //     type: '@@daListView/REMOVE_EDIT_DETAILS',
            //     payload: {
            //         rowId: row?.original?.deliveryMediumMasterId,
            //         columnId: column.id
            //     }
            // })
        } else {
            dispatch({
                type: '@@daListView/SET_EDIT_DETAILS',
                payload: {
                    rowId: row?.original?.deliveryMediumMasterId,
                    columnId: column.id,
                    value: debouncedValue,
                    hasError: false
                }
            })
        }
    }, [debouncedValue])

    return <NumberInput id={`editableCell-${row.id}-${column.id}`}
        autoFocus={`${row.original.deliveryMediumMasterId}-${column.id}` === lastUpdatedCell}
        fullWidth
        defaultValue={
            editDetails?.[row.original.deliveryMediumMasterId]?.[column.id] ?
                editDetails?.[row.original.deliveryMediumMasterId]?.[column.id]?.value || ''
                : inputVal
        }
        type='number'
        error={editDetails?.[row.original.deliveryMediumMasterId]?.[column.id]?.hasError}
        variant='inline-edit'
        onChange={React.useCallback((_value: any) => {
            setInputVal(_value)
        }, [setInputVal])} />
}
export default IntNumberField