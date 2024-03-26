import { useDispatch } from 'react-redux'
import React, { Dispatch } from 'react'
import { TextInput, DatePicker } from 'ui-library'
import { Cell } from 'react-table'
import { tFleetTypeListViewAcions } from '../FleetTypeListView.actions'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import useDebounce from '../../../utils/useDebounce'
import moment from 'moment'
import useClientProperties from '../../common/ClientProperties/useClientProperties'

export type tDatePickerChildren = {
    value?: Date
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
  }



const TimeField = ({ row, column, value }: Cell<any>) => {
    const dispatch = useDispatch<Dispatch<tFleetTypeListViewAcions>>()
    const editDetails = useTypedSelector(state => state.fleet.listView.editDetails)
    const [inputVal, setInputVal] = React.useState(value)
    const lastUpdatedCell = useTypedSelector(state => state.fleet.listView.lastUpdatedCell)
    const debouncedValue = useDebounce(inputVal, 500)
    const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
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

    return <DatePicker
            onChange={(date: any) => {
                setInputVal(date)
            }}
            label=''
            variant='time'
            timeInterval={30}
            timeFormat={24}
            style={{
                position: 'absolute',
                top: 'auto',
                right: 'auto',
                zIndex:1,
                width:'100%'
            }}
        >
            {({ open, setOpen }: tDatePickerChildren) => (
                <div onClick={() => setOpen(!open)}>
                    <TextInput id={`editableCell-${row.id}-${column.id}`}
                        autoFocus={`${row.original.id}-${column.id}` === lastUpdatedCell}
                        error={editDetails?.[row.original.id]?.[column.id]?.hasError}
                        defaultValue={
                            editDetails?.[row.original.id]?.[column.id] ?
                            moment(editDetails?.[row.original.id]?.[column.id]?.value).format('HH:mm') || ''
                                : (value ? moment.utc(moment.utc(value,`HH:mm`),`HH:mm`).tz(clientProperties?.TIMEZONE
                                    ?.propertyValue).format("HH:mm") : '')
                        }
                        placeholder=''
                        label=''
                        labelColor='black'
                        variant='inline-edit'
                        onClick={() => {
                            setOpen(!open)
                        }}
                        readOnly
                        fullWidth
                        onChange={() => { }}
                    />

                </div>
            )}
        </DatePicker>
}
export default TimeField