import { useDispatch } from 'react-redux'
import React, { Dispatch, useEffect } from 'react'
import { TextInput, DropDown } from 'ui-library'
import { Cell } from 'react-table'
import { tTripsListMileActions } from '../TripsListView.actions'
import { useTypedSelector } from '../../../../../utils/redux/rootReducer'
import useDebounce from '../../../../../utils/useDebounce'
import { IAirportList } from '../TripsListView.model'
import NormalDatePicker from './DateTimeField'

const TripEditableCell = {
    origAirportName: ({ row, column, value }: Cell<any>) => {
        const airportList = useTypedSelector(state => state.trips.listView.mile.dropdownMapping.airports)

        const optionList = airportList && airportList.map((airport: IAirportList) => {
            return {
                value: airport.airportId,
                label: airport.airportName,
                id: airport.airportId,
                title: airport.airportName
            }
        });
        const editDetails = useTypedSelector(state => state.trips.listView.mile.editDetails)
        const dispatch = useDispatch<Dispatch<tTripsListMileActions>>()

        return <DropDown
            value={editDetails?.[row.original.tripId]?.[column.id]?.value || value}
            onChange={(val: any) => {
                dispatch({
                    type: '@@tripsListViewMile/SET_EDIT_DETAILS',
                    payload: {
                        rowId: row?.original?.tripId,
                        columnId: column.id,
                        value: val,
                        hasError: false
                    }
                })
            }}
            variant='inline-edit'
            optionList={optionList}
            width='100%'
        />
    },
    destAirportName: ({ row, column, value }: Cell<any>) => {
        const airportList = useTypedSelector(state => state.trips.listView.mile.dropdownMapping.airports)

        const optionList = airportList && airportList.map((airport: IAirportList) => {
            return {
                value: airport.airportId,
                label: airport.airportName,
                id: airport.airportId,
                title: airport.airportName
            }
        });
        const editDetails = useTypedSelector(state => state.trips.listView.mile.editDetails)
        const dispatch = useDispatch<Dispatch<tTripsListMileActions>>()

        return <DropDown
            value={editDetails?.[row.original.tripId]?.[column.id]?.value || value}
            onChange={(val: any) => {
                dispatch({
                    type: '@@tripsListViewMile/SET_EDIT_DETAILS',
                    payload: {
                        rowId: row?.original?.tripId,
                        columnId: column.id,
                        value: val,
                        hasError: false
                    }
                })
            }}
            variant='inline-edit'
            optionList={optionList}
            width='100%'
        />
    },
    deliveryMediumName: ({ row, column, value }: Cell<any>) => {
        const dmList = useTypedSelector(state => state.trips.listView.mile.dropdownMapping.deliveryAssociateName)

        const editDetails = useTypedSelector(state => state.trips.listView.mile.editDetails)
        const dispatch = useDispatch<Dispatch<tTripsListMileActions>>()
        const preselectedValue = dmList?.filter((e: any) => e.label == value);
        return <DropDown
            value={editDetails?.[row.original.tripId]?.[column.id]?.value || preselectedValue?.[0]?.value}
            onChange={(val: any) => {
                dispatch({
                    type: '@@tripsListViewMile/SET_EDIT_DETAILS',
                    payload: {
                        rowId: row?.original?.tripId,
                        columnId: column.id,
                        value: val,
                        hasError: false
                    }
                })
            }}
            variant='inline-edit'
            optionList={dmList}
            width='100%'
            filterMaxResults={50}
            maxMenuHeight={175}
        />
    },
    driverName: ({ row, column, value }: Cell<any>) => {
        const drivers = useTypedSelector(state => state.trips.listView.mile.dropdownMapping.drivers)

        const editDetails = useTypedSelector(state => state.trips.listView.mile.editDetails)
        const dispatch = useDispatch<Dispatch<tTripsListMileActions>>()
        const preselectedValue = drivers?.filter((e: any) => e.label == value);
        return <DropDown
            value={editDetails?.[row.original.tripId]?.[column.id]?.value || preselectedValue?.[0]?.value}
            onChange={(val: any) => {
                dispatch({
                    type: '@@tripsListViewMile/SET_EDIT_DETAILS',
                    payload: {
                        rowId: row?.original?.tripId,
                        columnId: column.id,
                        value: val,
                        hasError: false
                    }
                })
            }}
            variant='inline-edit'
            optionList={drivers}
            width='100%'
            filterMaxResults={50}
            maxMenuHeight={175}
        />
    },
    vehicleNo: ({ row, column, value }: Cell<any>) => {
        const vehicles = useTypedSelector(state => state.trips.listView.mile.dropdownMapping.availableVehicles)

        const editDetails = useTypedSelector(state => state.trips.listView.mile.editDetails)
        const dispatch = useDispatch<Dispatch<tTripsListMileActions>>()
        const preselectedValue = vehicles?.filter((e: any) => e.label == value);
        return <DropDown
            value={editDetails?.[row.original.tripId]?.[column.id]?.value || preselectedValue?.[0]?.value}
            onChange={(val: any) => {
                dispatch({
                    type: '@@tripsListViewMile/SET_EDIT_DETAILS',
                    payload: {
                        rowId: row?.original?.tripId,
                        columnId: column.id,
                        value: val,
                        hasError: false
                    }
                })
            }}
            variant='inline-edit'
            optionList={vehicles}
            width='100%'
            filterMaxResults={50}
            maxMenuHeight={175}
        />
    },
    deliveryMediumBranch: ({ row, column, value }: Cell<any>) => {
        const branches = useTypedSelector(state => state.trips.listView.mile.dropdownMapping.branches)

        const editDetails = useTypedSelector(state => state.trips.listView.mile.editDetails)
        const dispatch = useDispatch<Dispatch<tTripsListMileActions>>()
        const preselectedValue = branches?.filter((e: any) => e.label == value);
        return <DropDown
            value={editDetails?.[row.original.tripId]?.[column.id]?.value || preselectedValue?.[0]?.value}
            onChange={(val: any) => {
                dispatch({
                    type: '@@tripsListViewMile/SET_EDIT_DETAILS',
                    payload: {
                        rowId: row?.original?.tripId,
                        columnId: column.id,
                        value: val,
                        hasError: false
                    }
                })
            }}
            variant='inline-edit'
            optionList={branches}
            width='100%'
            filterMaxResults={50}
            maxMenuHeight={175}
        />
    },
    estimatedStartDate: NormalDatePicker,
    scheduledDepartureTime: NormalDatePicker,
    default: ({ row, column, value }: Cell<any>) => {
        const dispatch = useDispatch<Dispatch<tTripsListMileActions>>()
        const editDetails = useTypedSelector(state => state.trips.listView.mile.editDetails)
        const columnStructure = useTypedSelector(state => state.trips.listView.mile.structure.columns)
        const lastUpdatedCell = useTypedSelector(state => state.trips.listView.mile.lastUpdatedCell)
        const [inputVal, setInputVal] = React.useState(value)
        const debouncedValue = useDebounce(inputVal, 2000)
        useEffect(() => {
            if (value !== debouncedValue) {
                dispatch({
                    type: '@@tripsListViewMile/SET_EDIT_DETAILS',
                    payload: {
                        rowId: row?.original?.tripId,
                        columnId: column.id,
                        value: debouncedValue,
                        hasError: false
                    }
                })
            }
        }, [debouncedValue])

        return <TextInput id={`editableCell-${row.id}-${column.id}`}
            fullWidth
            autoFocus={`${row.original.tripId}-${column.id}` === lastUpdatedCell}
            defaultValue={
                editDetails?.[row.original.tripId]?.[column.id] ?
                    editDetails?.[row.original.tripId]?.[column.id]?.value || ''
                    : value
            }
            error={editDetails?.[row.original.tripId]?.[column.id]?.hasError}
            variant='inline-edit'
            maxLength={Number(columnStructure[column.id]?.validation?.maxlength?.args || 100)}
            onChange={React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                setInputVal(value)
            }, [setInputVal])} />
    }
}

export default TripEditableCell