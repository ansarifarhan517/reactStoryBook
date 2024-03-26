import React, { Dispatch, useEffect } from 'react'
import { Cell } from 'react-table'
import { useDispatch } from 'react-redux'
import { TextInput } from 'ui-library'

import { useTypedSelector } from '../../../utils/redux/rootReducer'
import useDebounce from '../../../utils/useDebounce'
import { tFleetTypeListViewAcions } from '../FleetTypeListView.actions'



const DecimalNumberField = ({ row, column, value }: Cell<any>) => {
    
    const dispatch = useDispatch<Dispatch<tFleetTypeListViewAcions>>()
    const editDetails = useTypedSelector(state => state.fleet.listView.editDetails)
    const columnStructure = useTypedSelector(state => state.fleet.listView.structure.columns)
    const lastUpdatedCell = useTypedSelector(state => state.fleet.listView.lastUpdatedCell)
    const error = useTypedSelector(state => state.fleet.listView.editDetails?.[row.original.id]?.[column.id]?.hasError)

    const [inputVal, setInputVal] = React.useState(value)
    const debouncedValue = useDebounce(inputVal, 500)
    useEffect(() => {
        if (value === debouncedValue) {

        } else {
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

    return <TextInput id={`editableCell-${row.id}-${column.id}`}
        fullWidth
        autoFocus={`${row.original.id}-${column.id}` === lastUpdatedCell}
        defaultValue={
            editDetails?.[row.original.id]?.[column.id] ?
                editDetails?.[row.original.id]?.[column.id]?.value || ''
                : value
        }
        error={error}
        type='number'
        variant='inline-edit'
        maxLength={Number(columnStructure[column.id]?.validation?.maxlength?.args || 100)}
        onChange={React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value
            setInputVal(value)
        }, [setInputVal])} />
    }

    export default DecimalNumberField

