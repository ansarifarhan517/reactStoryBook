import React, { Dispatch, useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../../../utils/redux/rootReducer'
import useDebounce from '../../../../../utils/useDebounce'
import { Cell } from 'react-table'
import { TextInput, DatePicker } from 'ui-library'
import { ContractListViewActions } from '../../ContractListView.actions'
import useClientProperties from '../../../../common/ClientProperties/useClientProperties'
import moment from 'moment'


const DatePickerComponent = ({ row, column, value }: Cell<any>) => {
    const dispatch = useDispatch<Dispatch<ContractListViewActions>>()
    const editDetails = useTypedSelector(state => state.contract.listView.editDetails)
    const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
    const [inputVal, setInputVal] = React.useState(value)
    const debouncedValue = useDebounce(inputVal, 500)
    const date = new Date(inputVal)
    const date2 = editDetails?.[row.original.contractId]?.[column.id] ? new Date(editDetails?.[row.original.contractId]?.[column.id].value): value

    useEffect(() => {
        if (value !== debouncedValue ) {
            dispatch({
                type: '@@contractListView/SET_EDIT_DETAILS',
                payload: {
                    rowId: row?.original?.contractId,
                    columnId: column.id,
                    value: debouncedValue,
                    hasError: false
                }
            })
        }
    }, [debouncedValue])

    const handleDateChange = (date:any) => {
      setInputVal(date)
    }
  
    return <DatePicker
      onChange={handleDateChange}
      variant='date'
      style={{
        position: 'absolute',
        top: 'auto',
        right: 'auto',
        zIndex: 1
      }}
      selected={date}
    >
      {({ value, open, setOpen }: any) => (
        <div onClick={() => {
          setOpen(!open)
        }}>
          <TextInput
            id={`editableCell-${row.id}-${column.id}`}
            name={`editableCell-${row.id}-${column.id}`}
            variant='inline-edit'
            error={editDetails?.[row.original.contractId]?.[column.id]?.hasError}
            value={editDetails?.[row.original.contractId]?.[column.id] ?
                      moment(date2).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())
                          : moment(value).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())}
            readOnly
            iconStyle={{ padding: '9px 9px 9px 9px' }}
          />
        </div>
      )}
    </DatePicker>
}



const CONTRACT_LIST_VIEW_EDITABLE_CELL_MAPPING = {

    default: ({ row, column, value }: Cell<any>) => {
        const dispatch = useDispatch<Dispatch<ContractListViewActions>>()
        const editDetails = useTypedSelector(state => state.contract.listView.editDetails)
        const lastUpdatedCell = useTypedSelector(state => state.contract.listView.lastUpdatedCell)
        const columnStructure = useTypedSelector(state => state.contract.listView.structure.columns)
        const [inputVal, setInputVal] = React.useState(value)
        const debouncedValue = useDebounce(inputVal, 300)

        useEffect(() => {
            if (value !== debouncedValue) {
                dispatch({
                    type: '@@contractListView/SET_EDIT_DETAILS',
                    payload: {
                        rowId: row?.original?.contractId,
                        columnId: column.id,
                        value: debouncedValue,
                        hasError: false
                    }
                })
            }
        }, [debouncedValue])

        return <TextInput id={`editableCell-${row.id}-${column.id}`}
            autoFocus={`${row.original.contractId}-${column.id}` === lastUpdatedCell}
            defaultValue={
                editDetails?.[row.original.contractId]?.[column.id] ?
                    editDetails?.[row.original.contractId]?.[column.id]?.value || ''
                    : value
            }
            error={editDetails?.[row.original.contractId]?.[column.id]?.hasError}
            variant='inline-edit'
            maxLength={Number(columnStructure[column.id]?.validation?.maxlength?.args || 100)}
            onChange={React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                
                const value = e.target.value
                setInputVal(value)
            }, [setInputVal])} />
    },
    contractDate: DatePickerComponent,
    contractExpiryDate:DatePickerComponent
    


}

export default CONTRACT_LIST_VIEW_EDITABLE_CELL_MAPPING