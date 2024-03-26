import React, { Dispatch, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../../../utils/redux/rootReducer'
import useDebounce from '../../../../../utils/useDebounce'
import { Cell } from 'react-table'
import { TextInput } from 'ui-library'
import { RateProfileListViewActions } from '../../RateProfileListView.actions'

const RATE_PROFILE_LIST_VIEW_EDITABLE_CELL_MAPPING = {

    default: ({ row, column, value }: Cell<any>) => {
        const dispatch = useDispatch<Dispatch<RateProfileListViewActions>>()
        const editDetails = useTypedSelector(state => state.rateProfile.listView.editDetails)
        const lastUpdatedCell = useTypedSelector(state => state.rateProfile.listView.lastUpdatedCell)
        const columnStructure = useTypedSelector(state => state.rateProfile.listView.structure.columns)
        const [inputVal, setInputVal] = React.useState(value)
        const debouncedValue = useDebounce(inputVal, 300)

        useEffect(() => {
            if (value !== debouncedValue) {
                dispatch({
                    type: '@@rateProfileListView/SET_EDIT_DETAILS',
                    payload: {
                        rowId: row?.original?.customerId,
                        columnId: column.id,
                        value: debouncedValue,
                        hasError: false
                    }
                })
            }
        }, [debouncedValue])

        return <TextInput id={`editableCell-${row.id}-${column.id}`}
            autoFocus={`${row.original.customerId}-${column.id}` === lastUpdatedCell}
            defaultValue={
                editDetails?.[row.original.customerId]?.[column.id] ?
                    editDetails?.[row.original.customerId]?.[column.id]?.value || ''
                    : value
            }
            error={editDetails?.[row.original.customerId]?.[column.id]?.hasError}
            variant='inline-edit'
            maxLength={Number(columnStructure[column.id]?.validation?.maxlength?.args || 100)}
            onChange={React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                setInputVal(value)
            }, [setInputVal])} />
    },
}

export default RATE_PROFILE_LIST_VIEW_EDITABLE_CELL_MAPPING