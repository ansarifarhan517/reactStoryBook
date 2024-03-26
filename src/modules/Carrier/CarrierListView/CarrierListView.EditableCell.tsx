import { CarrierListViewActions } from './CarrierListView.actions';
import React, { Dispatch, useEffect, useState } from 'react'
import { TextInput } from 'ui-library'
import { Cell } from 'react-table'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import useDebounce from '../../../utils/useDebounce';
import { ValidateEmail } from '../../common/InlineEdit/InlineEdit';

const CarrierListEditableCellMapping = {
    default: ({ row, column, value }: Cell<any>) => {
      const dispatch = useDispatch<Dispatch<CarrierListViewActions>>()
      const editDetails = useTypedSelector(state => state.carrier.listView.editDetails)
      const lastUpdatedCell = useTypedSelector(state => state.carrier.listView.lastUpdatedCell)
      const columnStructure = useTypedSelector(state => state.carrier.listView.structure.columns)
      const [inputVal, setInputVal] = useState(value)
      const [error, setError] = useState<boolean>(false)
      const debouncedValue = useDebounce(inputVal, 300)

      useEffect(() => {
        if (value !== debouncedValue) {
          !error ?
            dispatch({
                type: '@@carrierListView/SET_EDIT_DETAILS',
                payload: {
                    rowId: row?.original?.clientCoLoaderId,
                    columnId: column.id,
                    value: debouncedValue,
                    hasError: false
                }
            }) : dispatch({
                type: '@@carrierListView/SET_EDIT_DETAILS',
                payload: {
                    rowId: row?.original?.clientCoLoaderId,
                    columnId: column.id,
                    value: debouncedValue,
                    hasError: true
                }
            })
        }
      }, [debouncedValue])

      return <TextInput id={`editableCell-${row.id}-${column.id}`}
        defaultValue={
          editDetails?.[row.original.clientCoLoaderId]?.[column.id] ?
            editDetails?.[row.original.clientCoLoaderId]?.[column.id]?.value || ''
            : value
        }
        error={error || editDetails?.[row.original.customerId]?.[column.id]?.hasError}
        variant='inline-edit'
        autoFocus={`${row.original.clientCoLoaderId}-${column.id}` === lastUpdatedCell}
        maxLength={Number(columnStructure[column.id]?.validation?.maxlength?.args || 100)}
        onChange={React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value
          if (column.id?.toLowerCase().indexOf("emailaddress") !== -1) {
            // this is email address field. so apply validation
            const validate = ValidateEmail(e.target.value)
            setError(!validate)
          }
          setInputVal(value)
        }, [setInputVal])} />
    },
    linkedBranchCount: ({ value}: Cell) => {
      return <div className="cellIdentifier dummy-tooltip-disable-class noOfItems" ><div className="button-col-action" >{value || 0}</div></div>
    }
}

export default CarrierListEditableCellMapping