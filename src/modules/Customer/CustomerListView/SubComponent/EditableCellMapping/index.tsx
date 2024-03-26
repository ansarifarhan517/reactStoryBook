import React, { Dispatch, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../../../utils/redux/rootReducer'
import useDebounce from '../../../../../utils/useDebounce'
import { Cell } from 'react-table'
import { TextInput } from 'ui-library'
import { CustomerListViewActions } from '../../CustomerListView.actions'
import { ValidateEmail, ValidateNumber } from '../../../../common/InlineEdit/InlineEdit'

const CUSTOMER_LIST_VIEW_EDITABLE_CELL_MAPPING = {

    default: ({ row, column, value }: Cell<any>) => {
        const dispatch = useDispatch<Dispatch<CustomerListViewActions>>()
        const editDetails = useTypedSelector(state => state.customer.listView.editDetails)
        const lastUpdatedCell = useTypedSelector(state => state.customer.listView.lastUpdatedCell)
        const columnStructure = useTypedSelector(state => state.customer.listView.structure.columns)
        const [inputVal, setInputVal] = React.useState(value)
        const debouncedValue = useDebounce(inputVal, 300)

        useEffect(() => {
            if (value !== debouncedValue) {
                dispatch({
                    type: '@@customerListView/SET_EDIT_DETAILS',
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
    emailAddress: ({ row, column, value }: Cell<any>) => {
        const dispatch = useDispatch<Dispatch<CustomerListViewActions>>()
        const editDetails = useTypedSelector(state => state.customer.listView.editDetails)
        const lastUpdatedCell = useTypedSelector(state => state.customer.listView.lastUpdatedCell)
        const columnStructure = useTypedSelector(state => state.customer.listView.structure.columns)
        const [inputVal, setInputVal] = React.useState(value)
        const [error, setError] = useState<boolean>(false)
        const debouncedValue = useDebounce(inputVal, 300)

        useEffect(() => {
            if (value !== debouncedValue) {
                !error ?
                    dispatch({
                        type: '@@customerListView/SET_EDIT_DETAILS',
                        payload: {
                            rowId: row?.original?.customerId,
                            columnId: column.id,
                            value: debouncedValue,
                            hasError: false
                        }
                    }) : dispatch({
                        type: '@@customerListView/SET_EDIT_DETAILS',
                        payload: {
                            rowId: row?.original?.customerId,
                            columnId: column.id,
                            value: debouncedValue,
                            hasError: true
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
            error={error || editDetails?.[row.original.customerId]?.[column.id]?.hasError}

            variant='inline-edit'
            maxLength={Number(columnStructure[column.id]?.validation?.maxlength?.args || 100)}
            onChange={React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                const validate = ValidateEmail(e.target.value)

                if (validate) {
                    setInputVal(value)
                } else {
                    setInputVal(value)
                    setError(true)
                }

            }, [setInputVal])} />
    },
    mobileNumber: ({ row, column, value }: Cell<any>) => {
        const dispatch = useDispatch<Dispatch<CustomerListViewActions>>()
        const editDetails = useTypedSelector(state => state.customer.listView.editDetails)
        const lastUpdatedCell = useTypedSelector(state => state.customer.listView.lastUpdatedCell)
        const columnStructure = useTypedSelector(state => state.customer.listView.structure.columns)
        const [inputVal, setInputVal] = React.useState(value)
        const [error, setError] = useState<boolean>(false)
        const debouncedValue = useDebounce(inputVal, 300)

        useEffect(() => {
            if (value !== debouncedValue) {
                !error ?
                    dispatch({
                        type: '@@customerListView/SET_EDIT_DETAILS',
                        payload: {
                            rowId: row?.original?.customerId,
                            columnId: column.id,
                            value: debouncedValue,
                            hasError: false
                        }
                    }) : dispatch({
                        type: '@@customerListView/SET_EDIT_DETAILS',
                        payload: {
                            rowId: row?.original?.customerId,
                            columnId: column.id,
                            value: debouncedValue,
                            hasError: true
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
            error={error || editDetails?.[row.original.customerId]?.[column.id]?.hasError}
            variant='inline-edit'
            maxLength={Number(columnStructure[column.id]?.validation?.maxlength?.args || 100)}
            onChange={React.useCallback((e: any) => {
                const value = e.target.value
                const validate = ValidateNumber(value)

                if (validate) {
                    setInputVal(value)
                    
                } else {
                    setInputVal(value)
                    setError(true)
                }

            }, [setInputVal])} />
    }


}

export default CUSTOMER_LIST_VIEW_EDITABLE_CELL_MAPPING