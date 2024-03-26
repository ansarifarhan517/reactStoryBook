import { useDispatch } from 'react-redux'
import React, { Dispatch } from 'react'
import { TextInput, DatePicker } from 'ui-library'
import { Cell } from 'react-table'
import { tTripsListMileActions } from '../TripsListView.actions'
import { useTypedSelector } from '../../../../../utils/redux/rootReducer'
import moment from 'moment'
import useClientProperties from '../../../../common/ClientProperties/useClientProperties'
import { convertDateTimeZone } from '../../../../../utils/helper'

export type tDatePickerChildren = {
    value?: Date
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}


const NormalDatePicker = ({ row, column, value }: Cell<any>) => {
    const dispatch = useDispatch<Dispatch<tTripsListMileActions>>()
    const editDetails = useTypedSelector(state => state.trips.listView.mile.editDetails)
    const [isPartialSelection, setIsPartialSelection] = React.useState<boolean>(false)
    const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
    const TIMEZONE = row?.original?.[column.id + 'TZ'] || (JSON.parse(localStorage.getItem('userAccessInfo') || '' )?.['timezone']) || (`${clientProperties?.TIMEZONE?.propertyValue}`)
    const DATEFORMAT = `${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm`;
    const setDate = (date: any) => {
        dispatch({
            type: '@@tripsListViewMile/SET_EDIT_DETAILS',
            payload: {
                rowId: row?.original?.tripId,
                columnId: column.id,
                value: convertDateTimeZone(date, TIMEZONE,DATEFORMAT)
            }
        })
    }

    return <DatePicker
        onChange={(e: any) => {
            if (isPartialSelection) {
                setDate(e);
                setIsPartialSelection(false)
            }
            setIsPartialSelection(true)
        }}
        variant='datetime'
        timeFormat={24}
        style={{ zIndex: 9 }}
    >
        {({ open, setOpen }) => (
            <div onClick={() => setOpen(!open)}>
                <TextInput
                    id='endTimeWindow'
                    name='endTimeWindow'
                    labelColor='text.inputLabel.default'
                    className='endTimeWindow  '
                    defaultValue={
                        editDetails?.[row.original.tripId]?.[column.id] ?
                            editDetails?.[row.original.tripId]?.[column.id]?.value || ''
                            : convertDateTimeZone(value, TIMEZONE,`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm`) || moment(value).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} hh:mm`)
                    }
                    onChange={() => { }}
                    iconStyle={{ padding: '8px 8px 8px 8px' }}
                />
            </div>
        )}
    </DatePicker>
}



export default NormalDatePicker