import { useDispatch } from 'react-redux'
import React, { Dispatch, useEffect } from 'react'
import { TextInput, DropDown, FontIcon, MultiSelect, tMultiSelectChildren, Checkbox, Position, Toggle, IMultiSelectOptions } from 'ui-library'
import { Cell } from 'react-table'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import useDebounce from '../../../../utils/useDebounce'
import { tDAListViewActions } from '../DeliveryAssociate.actions'
import { StyledMultiSelect } from './SubComponent/StyledCellMapping'
import IntNumberField from './SubComponent/IntNumberField'


const DAEditableCell = {
    default: ({ row, column, value }: Cell<any>) => {
        const dispatch = useDispatch<Dispatch<tDAListViewActions>>()
        const editDetails = useTypedSelector(state => state.deliveryMedium.listView.editDetails)
        const columnStructure = useTypedSelector(state => state.deliveryMedium.listView.structure.columns)
        const lastUpdatedCell = useTypedSelector(state => state.deliveryMedium.listView.lastUpdatedCell)
        const [inputVal, setInputVal] = React.useState(value)
        const debouncedValue = useDebounce(inputVal, 500)
        useEffect(() => {
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

        return <TextInput id={`editableCell-${row.id}-${column.id}`}
            fullWidth
            autoFocus={`${row.original.deliveryMediumMasterId}-${column.id}` === lastUpdatedCell}
            defaultValue={
                editDetails?.[row.original.deliveryMediumMasterId]?.[column.id] ?
                    editDetails?.[row.original.deliveryMediumMasterId]?.[column.id]?.value || ''
                    : value
            }
            error={editDetails?.[row.original.deliveryMediumMasterId]?.[column.id]?.hasError}
            variant='inline-edit'
            maxLength={Number(columnStructure[column.id]?.validation?.maxlength?.args || 100)}
            onChange={React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                setInputVal(value)
            }, [setInputVal])} />
    },
    branchName: ({ row, column, value }: Cell<any>) => {
        const editDetailsValue = useTypedSelector(state => state.deliveryMedium.listView.editDetails?.[row.original.deliveryMediumMasterId]?.[column.id]?.value)
        const branchList = useTypedSelector(state => state.deliveryMedium.listView.branchList)
        const lastUpdatedCell = useTypedSelector(state => state.deliveryMedium.listView.lastUpdatedCell)

        const dispatch = useDispatch<Dispatch<tDAListViewActions>>()
        const optionList = React.useMemo(() => {
            return branchList?.map((branch: any) => {
                return {
                    value: branch.value,
                    label: branch.label,
                    id: branch.id,
                    title: branch.label
                }
            })
        }, [branchList])

        return <DropDown
            value={editDetailsValue || value}
            autoFocus={`${row.original.deliveryMediumMasterId}-${column.id}` === lastUpdatedCell}
            onChange={(val: any) => {
                dispatch({
                    type: '@@daListView/SET_EDIT_DETAILS',
                    payload: {
                        rowId: row?.original?.deliveryMediumMasterId,
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
    deliveryMediumMasterTypeCd: ({ row, column, value }: Cell<any>) => {
        const deliveryTypes = useTypedSelector(state => state.deliveryMedium.listView.deliveryTypes)
        const editDetailsValue = useTypedSelector(state => state.deliveryMedium.listView.editDetails?.[row.original.deliveryMediumMasterId]?.[column.id]?.value)
        const lastUpdatedCell = useTypedSelector(state => state.deliveryMedium.listView.lastUpdatedCell)
        const [selectedOption, setSelectedOption] = React.useState<IMultiSelectOptions[] | undefined>()
        const displayOptions = React.useRef<string | undefined>()
        const dispatch = useDispatch<Dispatch<tDAListViewActions>>()
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

     
            useEffect(() => {
            const selectionString = editDetailsValue !== undefined ? editDetailsValue : value
            const selection: any = []
            selectionString?.split(',')?.forEach((skill: string) => {
                selection.push(optionsMap[skill])
            })

            setSelectedOption(selection)
            displayOptions.current = selection?.map((o: { label: string; }) => o?.label).join(',')
           
        }, [value, editDetailsValue])

       

        return <MultiSelect
            options={optionList}
            onMenuClose={() => {
                dispatch({
                    type: '@@daListView/SET_EDIT_DETAILS',
                    payload: {
                        rowId: row?.original?.deliveryMediumMasterId,
                        columnId: column.id,
                        value: displayOptions.current ? displayOptions.current : "",
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
            // maximumSelected={10}
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
                            value={displayOptions.current }
                            className='multiselct'
                            label={'Skill Set'}
                            labelColor='black'
                            placeholder=''
                            variant='inline-edit'
                            onClick={() => {
                                openMenu(!isMenuOpen)

                            }}
                            title={displayOptions.current }
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
    weeklyOff: ({ row, column, value }: Cell<any>) => {
        const weeklyOff = useTypedSelector(state => state.deliveryMedium.listView.weeklyOff)
        const editDetailsValue = useTypedSelector(state => state.deliveryMedium.listView.editDetails?.[row.original.deliveryMediumMasterId]?.[column.id]?.value)
        const lastUpdatedCell = useTypedSelector(state => state.deliveryMedium.listView.lastUpdatedCell)

        const dispatch = useDispatch<Dispatch<tDAListViewActions>>()
        const optionList = React.useMemo(() => {
            return weeklyOff as any
        }, [weeklyOff])

        const listofWeeklyOff = React.useMemo(() => {
            const selectionString = editDetailsValue || value
            const selection: any = []
            selectionString?.split(',')?.forEach((skill: string) => {
                selection.push(optionList[skill])
            })

            return selection
        }, [value, editDetailsValue])

        const [selectedOption, setSelectedOption] = React.useState<IMultiSelectOptions[] | undefined>()
        const displayOptions = React.useRef<string | undefined>()


        return <MultiSelect
            options={optionList}
            onMenuClose={() => {
                dispatch({
                    type: '@@daListView/SET_EDIT_DETAILS',
                    payload: {
                        rowId: row?.original?.deliveryMediumMasterId,
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
    capacityInUnits: IntNumberField,
    isAttandanceFl: ({ value }: Cell<any>) => {

        return <Checkbox
            checked={value}
            disabled
            checkboxSize='md'
            disabledVariant='greyed'
            id='attendance'
        />

    },
    isActiveFl: ({ value }: Cell<any>) => {
        return <Position type='absolute' top='4px' left='1em'>
            <Toggle
                disabled
                checked={value}

            />
        </Position>
    },
    linkedVehicleNumber:({ row, column, value }: Cell<any>) => {
        const editDetailsValue = useTypedSelector(state => state.deliveryMedium.listView.editDetails?.[row.original.deliveryMediumMasterId]?.[column.id]?.value)
        const vehicleList = useTypedSelector(state => state.deliveryMedium.listView.vehicleList)
        const lastUpdatedCell = useTypedSelector(state => state.deliveryMedium.listView.lastUpdatedCell)
        const dispatch = useDispatch<Dispatch<tDAListViewActions>>()
        const optionList = React.useMemo(() => {
            return vehicleList?.map((vehicle: any) => {
                return {
                    value: vehicle.vehicleNumber,
                    label: vehicle.name,
                    id: vehicle.id,
                    title: vehicle.name
                }
            })
        }, [vehicleList])
        const editDetailsValueCopy = optionList.filter(obj=>obj.id === editDetailsValue)[0]?.value;

        return <DropDown
            value={editDetailsValueCopy || value}
            autoFocus={`${row.original.deliveryMediumMasterId}-${column.id}` === lastUpdatedCell}
            onChange={(val: any) => {
                dispatch({
                    type: '@@daListView/SET_EDIT_DETAILS',
                    payload: {
                        rowId: row?.original?.deliveryMediumMasterId,
                        columnId: column.id,
                        value: optionList.filter(obj=>obj.value === val)[0].id,
                        hasError: false
                    }
                })
            }}
            variant='inline-edit'
            optionList={optionList}
            width='100%'
        />

    },
    
    customDropdown: ({ row, column, value }: Cell<any>) => {
        const editDetailsValue = useTypedSelector(state => state.deliveryMedium.listView.editDetails?.[row.original.id]?.[column.id]?.value)
        const dropdown = useTypedSelector(state => state.deliveryMedium.listView.structure.columns[column.id].dropdownValues);
        // const lastUpdatedCell = useTypedSelector(state => state.order.listView.lastUpdatedCell)

        
    
        const dispatch = useDispatch<Dispatch<tDAListViewActions>>()
        const optionList = React.useMemo(() => {
        //   // return dropdown?.map((dropdown: any) => {
        //   //   debugger;
        //   //   return {
        //   //     value: dropdown,
        //   //     label: dropdown,
        //   //   }
        //   // })
    
          return Object.values(dropdown).map(function(key){
            return {
              value: key,
              label: key,
            }
            })
        }, [dropdown])
    
        return <DropDown
          value={editDetailsValue || value}
          onChange={(val: any) => {
            console.log("data", row.original, column.id, val);
            dispatch({
              type: '@@daListView/SET_EDIT_DETAILS',
              payload: {
                rowId: row?.original?.id,
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
    }
}

export default DAEditableCell