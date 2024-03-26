import DefaultCell from '../../../utils/components/CellMapping/DefaultCell';
import { useDispatch } from 'react-redux'
import React, { Dispatch, useEffect } from 'react'
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import { Cell } from 'react-table'
import { tFleetTypeListViewAcions } from '../FleetTypeListView.actions';
import { TextInput, FontIcon, MultiSelect, tMultiSelectChildren, IMultiSelectOptions } from 'ui-library'
import { StyledMultiSelect } from './StyledCellMapping'
import useDebounce from '../../../utils/useDebounce';
import ToggleCell from './ToggleCell';
import NumberField from './NumberField';
import TextOverflowEllipsis from '../../../utils/components/TextOverflowEllipsis';
import BoxTypeTextCell from '../../../utils/components/CellMapping/BoxTypeTextCell';
import DecimalNumberField from './DecimalNumberField';
import TimeField from './TimeField';
import moment from 'moment';
import useClientProperties from '../../common/ClientProperties/useClientProperties';
import useMetricsConversion from '../../common/ClientProperties/useMetricsConversion';
import { distanceUnitFormatter } from '../../Analytics/OverallSummary/subComponents/utils/utilities';
import NumberCountCell from '../../../utils/components/CellMapping/NumberCountCell'




export const FLEETTYPE_LIST_VIEW_CELL_MAPPING = {
    
    default: DefaultCell,
    isActiveFl: ToggleCell,
    weeklyOffList: React.memo(({ value }: Cell<any>) => {
        const weeklyOffData = value ? value.join(',') : ''
        return <TextOverflowEllipsis title={value}>{weeklyOffData}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    skillSet: BoxTypeTextCell,
    breakStartTimeWindow: React.memo(({ value }: Cell<any>) => {
        // const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
        let date = ''
        if (value) {
            date= moment(value,`HH:mm`).format("HH:mm")
        }
        return <TextOverflowEllipsis title={date}>{date}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    breakEndTimeWindow: React.memo(({ value }: Cell<any>) => {
        // const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
        let date = ''
        if (value) {
           date= moment(value,`HH:mm`).format("HH:mm")
        }
        return <TextOverflowEllipsis title={date}>{date}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    compartmentCount: NumberCountCell
}

export const FLEETTYPE_EDITABLE_CELL_MAPPING = {
    default: ({ row, column, value }: Cell<any>) => {
        const dispatch = useDispatch<Dispatch<tFleetTypeListViewAcions>>()
        const editDetails = useTypedSelector(state => state.fleet.listView.editDetails)
        const columnStructure = useTypedSelector(state => state.fleet.listView.structure.columns)
        const lastUpdatedCell = useTypedSelector(state => state.fleet.listView.lastUpdatedCell)
        // const error = useTypedSelector(state => state.fleet.listView.editDetails?.[row.original.id]?.[column.id]?.hasError)

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
            error={editDetails?.[row.original.id]?.[column.id]?.hasError}
            variant='inline-edit'
            maxLength={Number(columnStructure[column.id]?.validation?.maxlength?.args || 100)}
            onChange={React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                setInputVal(value)
            }, [setInputVal])} />
    },
    weeklyOffList: ({ row, column, value }: Cell<any>) => {
        const weeklyOff = useTypedSelector(state => state.fleet.listView.weeklyOff)
        const editDetailsValue = useTypedSelector(state => state.fleet.listView.editDetails?.[row.original.id]?.[column.id]?.value)
        const lastUpdatedCell = useTypedSelector(state => state.fleet.listView.lastUpdatedCell)

        const dispatch = useDispatch<Dispatch<tFleetTypeListViewAcions>>()
        const optionList = React.useMemo(() => {
            return weeklyOff as any
        }, [weeklyOff])
        const optionsMap: Record<string, any> = React.useMemo(() => {
            const map = {}
            weeklyOff.forEach((type: any) => {
                map[type.label] = {
                    value: type.value,
                    label: type.label,
                    id: type.id
                }
            })
            return map
        }, [weeklyOff])

        const listofWeeklyOff = React.useMemo(() => {
            const selectionString = editDetailsValue || value
            let selection: any = []
            if (typeof selectionString === 'string') {
                selectionString?.split(',')?.forEach((day: string) => {
                    selection.push(optionsMap[day])
                })
            } else {
                selectionString?.forEach((day: string) => {
                    selection.push(optionsMap[day])
                })
            }

            return selection
        }, [value, editDetailsValue])

        const [selectedOption, setSelectedOption] = React.useState<IMultiSelectOptions[] | undefined>()
        const displayOptions = React.useRef<string | undefined>()


        return <MultiSelect
            options={optionList}
            onMenuClose={() => {
                dispatch({
                    type: '@@fleetTypeListView/SET_EDIT_DETAILS',
                    payload: {
                        rowId: row?.original?.id,
                        columnId: column.id,
                        value: displayOptions.current,
                        hasError: false
                    }
                })
            }}
            onChange={(_event, _value, _isSelected, selectedOptionParam: any) => {
                setSelectedOption(selectedOptionParam)
                displayOptions.current = selectedOptionParam?.map((o: any) => o.label).join(',')
            }
            }
            style={{
                position: 'absolute',
                top: 'auto',
                left: 'auto',
                marginTop: '0px',
                width: '87%'

            }}
            width='100%'
            maximumSelected={10}
            menuOpen={false}
            selected={selectedOption || listofWeeklyOff}
            allowSelectAll={false}
            searchableKeys={['label']}
            isLoading={false}

        >
            {({ optionSelected, isMenuOpen, openMenu }: tMultiSelectChildren) => {
                console.log(optionSelected)
                return (
                    <StyledMultiSelect>
                        <TextInput id={`editableCell-${row.id}-${column.id}`}
                            autoFocus={`${row.original.deliveryMediumMasterId}-${column.id}` === lastUpdatedCell}
                            value={displayOptions.current || editDetailsValue || value}
                            className='multiselct'
                            label={'Weekly Off'}
                            labelColor='black'
                            placeholder=''
                            variant='inline-edit'
                            onClick={() => {
                                openMenu(!isMenuOpen)
                            }}
                            readOnly
                            fullWidth
                            // width='100%'
                            onChange={() => { }}
                        />
                        <span style={{ position: 'absolute', left: '85%', top: '8px', cursor: 'pointer' }}
                            onClick={() => {
                                openMenu(!isMenuOpen)
                            }}>
                            <FontIcon variant='breadcrumb-down-thin' color='primary.main' size={12} />
                        </span>
                    </StyledMultiSelect>

                )
            }
            }

        </MultiSelect>
    },
    skillSet: ({ row, column, value }: Cell<any>) => {
        const deliveryTypes = useTypedSelector(state => state.fleet.listView.deliveryTypes)
        const editDetailsValue = useTypedSelector(state => state.fleet.listView.editDetails?.[row.original.id]?.[column.id]?.value)
        const lastUpdatedCell = useTypedSelector(state => state.fleet.listView.lastUpdatedCell)

        const dispatch = useDispatch<Dispatch<tFleetTypeListViewAcions>>()
        const optionList = React.useMemo(() => {
            return deliveryTypes.map((type: any) => {
                return {
                    value: type.value,
                    label: type.label,
                    id: type.id
                }
            })
        }, [deliveryTypes])

        const optionsMap: Record<string, any> = React.useMemo(() => {
            const map = {}
            deliveryTypes.forEach((type: any) => {
                map[type.label] = {
                    value: type.value,
                    label: type.label,
                    id: type.id
                }
            })
            return map
        }, [deliveryTypes])

        // const selectedSkills = React.useMemo(() => {
        //     const selectionString = editDetailsValue || value
        //     let selection: any = []
        //     if (typeof selectionString === 'string') {
        //         selectionString?.split(',')?.forEach((skill: string) => {
        //             selection.push(optionsMap[skill])
        //         })
        //     } else {
        //         selectionString?.forEach((skill: string) => {
        //             selection.push(optionsMap[skill])
        //         })
        //     }
        //     return selection
        // }, [value, editDetailsValue])

        const [selectedOption, setSelectedOption] = React.useState<IMultiSelectOptions[] | undefined>()
        const displayOptions = React.useRef<string | undefined>()

        useEffect(() => {
            const selectionString = editDetailsValue !== undefined ? editDetailsValue : value
            const selection: any = []
            if (typeof selectionString === 'string') {
                selectionString?.split(',')?.forEach((skill: string) => {
                selection.push(optionsMap[skill])
            })
            } else {
                selectionString?.forEach((skill: string) => {
                selection.push(optionsMap[skill])        
            })
            }

            setSelectedOption(selection)
            displayOptions.current = selection?.map((o: { label: string; }) => o?.label).join(',')
           
        }, [value, editDetailsValue])

        return <MultiSelect
            options={optionList}
            onMenuClose={() => {
                dispatch({
                    type: '@@fleetTypeListView/SET_EDIT_DETAILS',
                    payload: {
                        rowId: row?.original?.id,
                        columnId: column.id,
                        value: displayOptions.current,
                        hasError: false
                    }
                })
            }}
            onChange={(_event, _value, _isSelected, selectedOptionParam) => {
                displayOptions.current = selectedOptionParam?.map((o: any) => o.label).join(',')
                setSelectedOption(selectedOptionParam)
            }}
            style={{
                position: 'absolute',
                top: 'auto',
                left: 'auto',
                marginTop: '0px',
                width: '87%'

            }}
            width='100%'
            maximumSelected={10}
            menuOpen={false}
            selected={selectedOption}
            allowSelectAll={false}
            searchableKeys={['label']}
            isLoading={false}
        >
            {({ isMenuOpen, openMenu }: tMultiSelectChildren) => {
                return (
                    <StyledMultiSelect isMenuOpen={isMenuOpen} >
                        <TextInput id={`editableCell-${row.id}-${column.id}`}
                            autoFocus={`${row.original.deliveryMediumMasterId}-${column.id}` === lastUpdatedCell}
                            value={displayOptions.current}
                            className='multiselct'
                            label={'Skill Set'}
                            labelColor='black'
                            placeholder=''
                            variant='inline-edit'
                            onClick={() => {
                                openMenu(!isMenuOpen)

                            }}
                            title={displayOptions.current}
                            fullWidth
                            style={{ cursor: 'pointer' }}
                            readOnly
                            // width='100%'
                            onChange={() => { }}
                            autoComplete='off'
                        />
                        <span style={{ position: 'absolute', left: '85%', top: '6px', cursor: 'pointer' }}
                            onClick={() => {
                                openMenu(!isMenuOpen)

                            }}>
                            <FontIcon variant='breadcrumb-down-thin' color='primary.main' size={12} />
                        </span>
                    </StyledMultiSelect>

                )
            }
            }

        </MultiSelect>
    },
    capacityInUnits: NumberField,
    capacityInVolume: DecimalNumberField,
    capacityInWeight: DecimalNumberField,
    minCapacityUtilizationInUnits: DecimalNumberField,
    minCapacityUtilizationInVolume: DecimalNumberField,
    minCapacityUtilizationInWeight: DecimalNumberField,
    fixedCost: DecimalNumberField,
    variableCost: DecimalNumberField,
    transportTimeCost: DecimalNumberField,
    loadingTimeInMins: DecimalNumberField,
    waitingTimeCost: DecimalNumberField,
    breakStartTimeWindow: TimeField,
    breakEndTimeWindow: TimeField,
    isActiveFl: ToggleCell
}
