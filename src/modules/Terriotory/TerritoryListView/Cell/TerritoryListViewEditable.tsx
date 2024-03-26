import { useDispatch } from 'react-redux';
import React, {useEffect, Dispatch } from 'react';
import { TextInput, DropDown, FontIcon, MultiSelect, tMultiSelectChildren, Position, Toggle, IMultiSelectOptions } from 'ui-library';
import { Cell } from 'react-table';
import { useTypedSelector } from '../../../../utils/redux/rootReducer';
import useDebounce from '../../../../utils/useDebounce';
import { tTerritoryListActions } from './../TerritoryList.actions';
import { SelectArrowWrapper, StyledMultiSelect } from './../StyledTerritoryList';
import { IDeliveryMediumData, IDropdown } from "../TerritoryList.models"


const TerritoryEditableCell = {
    default: ({ row, column, value }: Cell<any>) => {
        const dispatch = useDispatch<Dispatch<tTerritoryListActions>>()
        const editDetails = useTypedSelector(state => state.territory.listView.editDetails)
        const columnStructure = useTypedSelector(state => state.territory.listView.structure.columns)
        const lastUpdatedCell = useTypedSelector(state => state.territory.listView.lastUpdatedCell)
        const [inputVal, setInputVal] = React.useState(value)
        const debouncedValue = useDebounce(inputVal, 500)
        useEffect(() => {
            if (value === debouncedValue) {
            } else {
                dispatch({
                    type: '@@territoryList/SET_EDIT_DETAILS',
                    payload: {
                        rowId: row?.original?.geofenceId,
                        columnId: column.id,
                        value: debouncedValue,
                        hasError: false
                    }
                })
            }
        }, [debouncedValue])

        return <TextInput id={`editableCell-${row.id}-${column.id}`}
            fullWidth
            autoFocus={`${row.original.geofenceId}-${column.id}` === lastUpdatedCell}
            defaultValue={
                editDetails?.[row.original.geofenceId]?.[column.id] ?
                    editDetails?.[row.original.geofenceId]?.[column.id]?.value || ''
                    : value
            }
            error={editDetails?.[row.original.geofenceId]?.[column.id]?.hasError}
            variant='inline-edit'
            maxLength={Number(columnStructure[column.id]?.validation?.maxlength?.args || 100)}
            onChange={React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                setInputVal(value)
            }, [setInputVal])} />
    },
    geofenceCategory: ({ row, column, value }: Cell<any>) => {
        const editDetailsValue = useTypedSelector(state => state.territory.listView.editDetails?.[row.original.geofenceId]?.[column.id]?.value)
        const categoryList = useTypedSelector(state => state.territory.listView.categoryList)
        const lastUpdatedCell = useTypedSelector(state => state.territory.listView.lastUpdatedCell)

        const dispatch = useDispatch<Dispatch<tTerritoryListActions>>()
        const optionList = React.useMemo(() => {
            return categoryList?.map((category: IDropdown) => {
                return {
                    value: category.value,
                    label: category.label,
                    id: category.id,
                    title: category.label,
                    name: category.name
                }
            })
        }, [categoryList])
        return <DropDown
            value={editDetailsValue || value}
            autoFocus={`${row.original.geofenceId}-${column.id}` === lastUpdatedCell}
            onChange={(val: string) => {
                dispatch({
                    type: '@@territoryList/SET_EDIT_DETAILS',
                    payload: {
                        rowId: row?.original?.geofenceId,
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
    deliveryMediumMasterId: ({ row, column, value }: Cell<any>) => {
        const deliveryData = value && value.length ? value.map((obj: IDeliveryMediumData) => obj.deliveryMediumName) : []
        value = deliveryData ? deliveryData.join(',') : ''
        const deliveryTypes = useTypedSelector(state => state.territory.listView.daList)
        const editDetailsValue = useTypedSelector(state => state.territory.listView.editDetails?.[row.original.geofenceId]?.[column.id]?.value)
        const lastUpdatedCell = useTypedSelector(state => state.territory.listView.lastUpdatedCell)
        const [selectedOption, setSelectedOption] = React.useState<IMultiSelectOptions[] | undefined>()
        const displayOptions = React.useRef<string | undefined>()

        const dispatch = useDispatch<Dispatch<tTerritoryListActions>>()
        const options = React.useMemo(() => {
            return deliveryTypes.map((type: IDropdown) => {
                return {
                    value: type.value,
                    label: type.label,
                    id: type.id,
                    title: type.title
                }
            })
        }, [deliveryTypes])

        const optionsMap: Record<string, any> = React.useMemo(() => {
            const map = {}
            deliveryTypes.forEach((type: any) => {
                map[type.label] = {
                    value: type.value,
                    label: type.label,
                    id: type.id,
                    title: type.title
                }
            })
            return map
        }, [deliveryTypes])

        useEffect(() => {
            if (row?.values?.deliveryMediumMasterId?.length ) {
                row?.values?.deliveryMediumMasterId.forEach((obj: IDeliveryMediumData) => {
                    if (!optionsMap[obj?.deliveryMediumName]) {
                       
                        options.push({
                            label: obj?.deliveryMediumName,
                            value: obj?.deliveryMediumName,
                            id: obj?.deliveryMediumMasterId,
                            title: obj?.deliveryMediumName
                        });
                        optionsMap[obj?.deliveryMediumName] = {
                            label: obj?.deliveryMediumName,
                            value: obj?.deliveryMediumName,
                            id: obj?.deliveryMediumMasterId,
                            title: obj?.deliveryMediumName
                        }
                    }
                })
            }
            const selectionString = editDetailsValue !== undefined ? editDetailsValue : value
            const selection: any = []
            selectionString?.split(',')?.forEach((da: string) => {
                selection.push(optionsMap[da])
            })
            setSelectedOption(selection)
            displayOptions.current = selection?.map((o: { label: string; }) => o?.label).join(',')
        }, [value, editDetailsValue])


        return <MultiSelect
            options={options}
            onMenuClose={() => {
                dispatch({
                    type: '@@territoryList/SET_EDIT_DETAILS',
                    payload: {
                        rowId: row?.original?.geofenceId,
                        columnId: column.id,
                        value: displayOptions.current,
                        hasError: false
                    }
                })
            }}
            onChange={(_event, _value, _isSelected, selectedOptionParam) => {
                displayOptions.current = selectedOptionParam?.map((o) => o.label).join(',')
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
            resultLimit={50}
        >
            {({ isMenuOpen, openMenu }: tMultiSelectChildren) => {
                return (
                    <StyledMultiSelect 
                    // isMenuOpen={isMenuOpen}
                     >
                        <TextInput id={`editableCell-${row.id}-${column.id}`}
                            autoFocus={`${row.original.geofenceId}-${column.id}` === lastUpdatedCell}
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
                        <SelectArrowWrapper className="select-arrow-wrapper" 
                            onClick={() => {
                                openMenu(!isMenuOpen)

                            }}>
                            <FontIcon variant='breadcrumb-down-thin' color='primary.main' size={12} />
                        </SelectArrowWrapper>
                    </StyledMultiSelect>

                )
            }
            }

        </MultiSelect>
    },
    isActiveFl: ({ value }: Cell<any>) => {
        return <Position type='absolute' top='4px' left='1em'>
            <Toggle
                disabled
                checked={value}

            />
        </Position>
    }

}

export default TerritoryEditableCell