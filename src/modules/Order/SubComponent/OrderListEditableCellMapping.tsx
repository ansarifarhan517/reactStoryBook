import React, { Dispatch, useEffect } from 'react'
import { TextInput, DropDown, SlotPicker, IDateTimeSlots, DatePicker,useToast,MultiSelect,IMultiSelectOptions,tMultiSelectChildren, FontIcon, NumberInput } from 'ui-library'
import { Cell } from 'react-table'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import { useDispatch } from 'react-redux'
import useDebounce from '../../../utils/useDebounce'
import { OrderListViewActions } from '../../../modules/Order/OrderListView/OrderListView.actions'
import moment from 'moment';
import useClientProperties from '../../../modules/common/ClientProperties/useClientProperties'
import axios from "../../../utils/axios";
import apiMappings from '../../../utils/apiMapping'
import { StyledMultiSelect } from '../../../utils/components/CellMapping/StyledCellMapping'
import { userAccessInfo } from "../../../utils/constants";
import { tSuperType } from '../../../utils/common.interface';
import styled from 'styled-components'

const MultiSelectWrapper = styled.div`
  div[class$="-container"] {
    box-shadow: 0 2px 11px -5px #000;
  }
`;

const PreferenceDropdown = [
  {
    id: 'units',
    label: 'Units',
    value: 'unit',
    availableSlotObjectKey: 'availableNumberOfItems',
    totalSlotObjectKey: 'totalNumberOfItems'
  },
  {
    id: 'weight',
    label: 'Weight',
    value: 'weight',
    availableSlotObjectKey: 'availableWeight',
    totalSlotObjectKey: 'totalWeight'
  },
  {
    id: 'volume',
    label: 'Volume',
    value: 'volume',
    availableSlotObjectKey: 'availableVolume',
    totalSlotObjectKey: 'totalVolume'
  },
  {
    id: 'stops',
    label: 'Stops',
    value: 'stop',
    availableSlotObjectKey: 'availableStops',
    totalSlotObjectKey: 'totalStops'
  }
]

const StartNormalDatePicker  = ({ row, column, value }: Cell<any>)  => 
 {
    const dispatch = useDispatch<Dispatch<OrderListViewActions>>()
    const editDetails = useTypedSelector(state => state.order.listView.editDetails)
    const [isPartialSelection, setIsPartialSelection] = React.useState<boolean>(false)
    const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
    const setDate = (date: any) => {
      dispatch({
        type: '@@orderListView/SET_EDIT_DETAILS',
        payload: {
          rowId: row?.original?.shipmentId,
          columnId: column.id,
          value: moment(date).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm`)
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
            id='startTimeWindow'
            name='startTimeWindow'
            labelColor='text.inputLabel.default'
            className='startTimeWindow  '
            defaultValue={
              editDetails?.[row.original.shipmentId]?.[column.id] ?
                editDetails?.[row.original.shipmentId]?.[column.id]?.value || ''
                : moment(value).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm`)
            }
            onChange={() => { }}
            style={{border: 'none', minHeight: '25px'}}
            iconStyle={{ padding: '8px 8px 8px 8px' }}
            disabled = {row.original.orderStatus === "INTRANSIT" || (row.original.orderStatus === "PICKEDUP" && row.original.orderType === 'DELIVER')}
          />
        </div>
      )}
    </DatePicker>
}


const NormalDatePicker  = ({ row, column, value }: Cell<any>)  => 
 {
    const dispatch = useDispatch<Dispatch<OrderListViewActions>>()
    const editDetails = useTypedSelector(state => state.order.listView.editDetails)
    const [isPartialSelection, setIsPartialSelection] = React.useState<boolean>(false)
    const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
    const setDate = (date: any) => {
      dispatch({
        type: '@@orderListView/SET_EDIT_DETAILS',
        payload: {
          rowId: row?.original?.shipmentId,
          columnId: column.id,
          value: moment(date).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm`)
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
              editDetails?.[row.original.shipmentId]?.[column.id] ?
                editDetails?.[row.original.shipmentId]?.[column.id]?.value || ''
                : moment(value).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm`)
            }
            onChange={() => { }}
            style={{border: 'none', minHeight: '25px'}}
            iconStyle={{ padding: '8px 8px 8px 8px' }}
            disabled = {row.original.orderStatus === "INTRANSIT" || (row.original.orderStatus === "PICKEDUP" && row.original.orderType === 'DELIVER')}
          />
        </div>
      )}
    </DatePicker>
}

const StartTimeSlotPicker = ({ row, column, value }: Cell<any>) => {
    const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
    const clientMetrics = useTypedSelector(state => state.order.listView.clientMetric)
    const [slotPickerData, setSlotPickerData] = React.useState<undefined | IDateTimeSlots[]>()
    const dispatch = useDispatch<Dispatch<OrderListViewActions>>()
    const editDetails = useTypedSelector(state => state.order.listView.editDetails)
    // const zonalCapacity = useTypedSelector(state => state.order.listView.zonalCapacity)
    const toast = useToast();
    const [inputValST, setInputValST] = React.useState(value)
    const [inputValET, setInputValET] = React.useState<number | undefined>()
    const debouncedValueET = useDebounce(inputValET, 300)
    const debouncedValueST = useDebounce(inputValST, 300)

    const setDate = (date1: any, date2: any) => {
      setInputValST(date1);
      setInputValET(date2);
    }

    const handleChange = ({ startTimeWindow, endTimeWindow }: any) => {
      setDate(startTimeWindow, endTimeWindow)
    }

    const getAvailableSlots = async () => {
      try {
        const availableTimeSlots = await axios.put(apiMappings.order.listView.availableTimeSlots, { lstShipmentId: [row?.original?.shipmentId] });
        setSlotPickerData(Object.keys(availableTimeSlots?.data?.data).length !== 0 ? availableTimeSlots?.data?.data?.availableTimeWindow : undefined)
        ConvertDataToClientProperties(availableTimeSlots?.data?.data?.availableTimeWindow, clientProperties, clientMetrics, PreferenceDropdown)

      } catch (e) {
        console.log(e)
        if(e?.response?.data?.hasError){
          toast.add(e.response.data.message,'error',true);
        }
      }
    }

    useEffect(() => {
      if (value === debouncedValueST) {

      } else {
        // endTimeWindow
        dispatch({
          type: '@@orderListView/SET_EDIT_DETAILS',
          payload: {
            rowId: row?.original?.shipmentId,
            columnId: 'endTimeWindow',
            value: debouncedValueET,
            hasError: false
          }
        })
        // startTimeWindow
        dispatch({
          type: '@@orderListView/SET_EDIT_DETAILS',
          payload: {
            rowId: row?.original?.shipmentId,
            columnId: column.id,
            value: debouncedValueST,
            hasError: false
          }
        })
      }
    }, [debouncedValueET, debouncedValueST])

    return <SlotPicker
      title='Available Time Windows:'
      preferenceDropdownLabel='Prefrence By '
      isOpen={false}
      date={inputValST ? new Date(inputValST) : new Date()}
      timeWindowPrefrenceDropdown={PreferenceDropdown}
      status={SlotPickerStatus}
      DateTimeSlots={slotPickerData ? slotPickerData : undefined}
      style={{
        position: 'absolute',
        top: 'auto',
        right: '0px',
        zIndex: 1
      }}
      onChange={handleChange}
    >
      {({ value, open, setOpen }: any) => (
        <div
          onClick={() => {
            setOpen(!open)
          }}
        >
          <TextInput
            id='someId'
            name='someName'
            className='someClassname'
            value={editDetails?.[row.original.shipmentId]?.[column.id] ?
              moment(editDetails?.[row.original.shipmentId]?.[column.id]?.value).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm`) || ' '
              : moment(inputValST).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm`)}
            variant='inline-edit'
            style={{border: 'none', minHeight: '25px'}}
            onClick={getAvailableSlots}
            disabled = {row.original.orderStatus === "INTRANSIT" || (row.original.orderStatus === "PICKEDUP" && row.original.orderType === 'DELIVER')}
          />
        </div>
      )}
    </SlotPicker>
}

const EndTimeSlotPicker =  ({ row, column, value }: Cell<any>) => {
  const [slotPickerData, setSlotPickerData] = React.useState<undefined | IDateTimeSlots[]>()
  const dispatch = useDispatch<Dispatch<OrderListViewActions>>()
  const editDetails = useTypedSelector(state => state.order.listView.editDetails)

  const [inputValST, setInputValST] = React.useState<string | undefined>()
  const [inputValET, setInputValET] = React.useState(value)
  const debouncedValueST = useDebounce(inputValST, 300)
  const debouncedValueET = useDebounce(inputValET, 300)
  const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
  const toast = useToast();
  const setDate = (date1: any, date2: any) => {
    setInputValST(date1);
    setInputValET(date2);

  }

  const handleChange = ({ startTimeWindow, endTimeWindow }: any) => {
    setDate(startTimeWindow, endTimeWindow)
  }

  const getAvailableSlots = async () => {
    try {
      const availableTimeSlots = await axios.put(apiMappings.order.listView.availableTimeSlots, { lstShipmentId: [row?.original?.shipmentId] });
      setSlotPickerData(Object.keys(availableTimeSlots?.data?.data).length !== 0 ? availableTimeSlots?.data?.data?.availableTimeWindow : undefined)

    } catch (e) {
      console.log(e)
      if(e?.response?.data?.hasError){
        toast.add(e.response.data.message,'error',true);
      }
    }
  }


  useEffect(() => {

    if (value === debouncedValueET) {

    } else {
      dispatch({
        type: '@@orderListView/SET_EDIT_DETAILS',
        payload: {
          rowId: row?.original?.shipmentId,
          columnId: 'startTimeWindow',
          value: moment(debouncedValueST).format(`YYYY-MM-DDThh:mm:ss.000`) + 'Z',
          hasError: false
        }
      })
      dispatch({
        type: '@@orderListView/SET_EDIT_DETAILS',
        payload: {
          rowId: row?.original?.shipmentId,
          columnId: column.id,
          value: moment(debouncedValueET).format(`YYYY-MM-DDThh:mm:ss.000`) + 'Z',
          hasError: false
        }
      })

        // pickupEndTimeWindow
        dispatch({
          type: '@@orderListView/SET_EDIT_DETAILS',
          payload: {
            rowId: row?.original?.shipmentId,
            columnId:'pickupEndTimeWindow',
            value: moment(debouncedValueET).valueOf(),
            hasError: false
          }
        })
         // pickupStartTimeWindow
         dispatch({
          type: '@@orderListView/SET_EDIT_DETAILS',
          payload: {
            rowId: row?.original?.shipmentId,
            columnId:'pickupStartTimeWindow',
            value: moment(debouncedValueST).valueOf(),
            hasError: false
          }
        })
        // deliverStartTimeWindow
        dispatch({
          type: '@@orderListView/SET_EDIT_DETAILS',
          payload: {
            rowId: row?.original?.shipmentId,
            columnId:'deliverEndTimeWindow',
            value: moment(debouncedValueET).valueOf(),
            hasError: false
          }
        })
         // deliverEndTimeWindow
         dispatch({
          type: '@@orderListView/SET_EDIT_DETAILS',
          payload: {
            rowId: row?.original?.shipmentId,
            columnId:'deliverStartTimeWindow',
            value: moment(debouncedValueST).valueOf(),
            hasError: false
          }
        })
    }
  }, [debouncedValueST, debouncedValueET])

  return <SlotPicker
    title='Available Time Windows:'
    preferenceDropdownLabel='Prefrence By '
    isOpen={false}
    date={inputValET ? new Date(inputValET) : new Date()}
    timeWindowPrefrenceDropdown={PreferenceDropdown}
    status={SlotPickerStatus}
    DateTimeSlots={slotPickerData ? slotPickerData : undefined}
    style={{
      position: 'absolute',
      top: 'auto',
      right: '0px',
      zIndex: 1
    }}
    onChange={handleChange}
  >
    {({ value, open, setOpen }: any) => (
      <div
        onClick={() => {
          setOpen(!open)
        }}
      >
        <TextInput
          id='someId'
          name='someName'
          className='someClassname'
          value={editDetails?.[row.original.shipmentId]?.[column.id] ?
            moment(editDetails?.[row.original.shipmentId]?.[column.id]?.value).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm`) || ' '
            : moment(inputValET).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm`)}
          variant='inline-edit'
          style={{border: 'none', minHeight: '25px'}}
          onClick={getAvailableSlots}
          disabled = {row.original.orderStatus === "INTRANSIT" || (row.original.orderStatus === "PICKEDUP" && row.original.orderType === 'DELIVER')}
        />
      </div>
    )}
  </SlotPicker>
}


const SlotPickerStatus = {
  available: {
    id: 'available',
    value: 'AVAILABLE',
    label: 'Suggested'
  },
  notAvailable: {
    id: 'notAvailable',
    value: 'FULL',
    label: 'not Suggested'
  }
}

const ConvertDataToClientProperties = (availableTimeSlots: any, clientProperties: any, clientMetrics: any, PreferenceDropdown: any) => {
  console.log(availableTimeSlots, PreferenceDropdown)
  console.log(clientProperties, clientMetrics)

  let AS = availableTimeSlots?.map((slots: any) => {
    console.log(slots)
    let temp = {
      date: moment(slots.date).tz(clientProperties?.DATEFORMAT)
    }
    PreferenceDropdown.forEach((pd: any) => {
      console.log(slots.slots[pd.availableSlotObjectKey])
    })
    return temp
  })
  return AS

}

const ORDER_LIST_EDITABLE_CELL_MAPPING = {

  startTimeWindow: (obj:Cell<any>) => {
    const zonalCapacity = useTypedSelector(state => state.order.listView.zonalCapacity)
  
    if(zonalCapacity) {
      return <StartTimeSlotPicker {...obj}/>
    } else {
      
      return <StartNormalDatePicker {...obj}/>
    }
  },
  endTimeWindow: (obj:Cell<any> ) => {
    const zonalCapacity = useTypedSelector(state => state.order.listView.zonalCapacity)
    if(zonalCapacity) {
      return <EndTimeSlotPicker {...obj}/>
    } else {
      return <NormalDatePicker {...obj}/>
    }
  },

  default: ({ row, column, value }: Cell<any>) => {
    if (column?.id === 'orderValue' && row?.original?.packageValue) {
      value = row?.original?.packageValue
    }
    const dispatch = useDispatch<Dispatch<OrderListViewActions>>()
    const editDetails = useTypedSelector(state => state.order.listView.editDetails)
    const lastUpdatedCell = useTypedSelector(state => state.order.listView.lastUpdatedCell)
    const columnStructure = useTypedSelector(state => state.order.listView.structure.columns)
    const [inputVal, setInputVal] = React.useState(value)
    const debouncedValue = useDebounce(inputVal, 300)

    useEffect(() => {
      if (value === debouncedValue) {
        // dispatch({
        //   type: '@@driverListView/REMOVE_EDIT_DETAILS',
        //   payload: {
        //     rowId: row?.original?.driverId,
        //     columnId: column.id
        //   }
        // })
      } else {
        dispatch({
          type: '@@orderListView/SET_EDIT_DETAILS',
          payload: {
            rowId: row?.original?.shipmentId,
            columnId: column.id,
            value: debouncedValue,
            hasError: false
          }
        })
      }
    }, [debouncedValue])

    if (columnStructure[column.id]?.fieldType === 'number') {

      return <NumberInput id={`editableCell-${row.id}-${column.id}`}
      autoFocus={`${row.original.shipmentId}-${column.id}` === lastUpdatedCell}

      defaultValue={
        editDetails?.[row.original.shipmentId]?.[column.id] ?
          editDetails?.[row.original.shipmentId]?.[column.id]?.value || ''
          : value
      }
      error={editDetails?.[row.original.shipmentId]?.[column.id]?.hasError}
      variant='inline-edit'
      maxLength={Number(columnStructure[column.id]?.validation?.maxlength?.args)}
      onChange={React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e
        setInputVal(value)
      }, [setInputVal])} 
      disabled = {(row.original.orderStatus === "INTRANSIT"  || (row.original.orderStatus === "PICKEDUP" && row.original.orderType === 'DELIVER')) && column.id !== "capacityInWeight" && column.id !== "capacityInVolume" && !column.id.includes('cf_')} />

    } else {
      return <TextInput id={`editableCell-${row.id}-${column.id}`}
        autoFocus={`${row.original.shipmentId}-${column.id}` === lastUpdatedCell}
  
        defaultValue={
          editDetails?.[row.original.shipmentId]?.[column.id] ?
            editDetails?.[row.original.shipmentId]?.[column.id]?.value || ''
            : value
        }
        error={editDetails?.[row.original.shipmentId]?.[column.id]?.hasError}
        variant='inline-edit'
        maxLength={Number(columnStructure[column.id]?.validation?.maxlength?.args)}
        onChange={React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value
          setInputVal(value)
        }, [setInputVal])} 
        disabled = {(row.original.orderStatus === "INTRANSIT"  || (row.original.orderStatus === "PICKEDUP" && row.original.orderType === 'DELIVER')) && column.id !== "capacityInWeight" && column.id !== "capacityInVolume" && !column.id.includes('cf_')} />
    } 

  },

  pickupEndTimeWindow: ({ row, column, value }: Cell<any>) => {
    const dispatch = useDispatch<Dispatch<OrderListViewActions>>()
    const editDetails = useTypedSelector(state => state.order.listView.editDetails)
    const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
    const [isPartialSelection, setIsPartialSelection] = React.useState<boolean>(false)
    const setDate = (date: any) => {
      dispatch({
        type: '@@orderListView/SET_EDIT_DETAILS',
        payload: {
          rowId: row?.original?.shipmentId,
          columnId: column.id,
          value: moment(date).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm`)
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
      style={{ zIndex: 1 }}
    >
      {({ open, setOpen }) => (
        <div onClick={() => setOpen(!open)}>
          <TextInput
            id='endTimeWindow'
            name='endTimeWindow'
            labelColor='text.inputLabel.default'
            className='endTimeWindow  '
            variant='withIcon'
            iconVariant='calendar'
            iconSize='md'
            // required
            //   error={transactionDateError}
            // errorMessage='Mandatory field'
            defaultValue={
              editDetails?.[row.original.shipmentId]?.[column.id] ?
                editDetails?.[row.original.shipmentId]?.[column.id]?.value || ''
                : moment(value).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm`)
            }
            // value={startDate}
            onChange={() => { }}
            iconStyle={{ padding: '8px 8px 8px 8px' }}
            disabled = {row.original.orderStatus === "INTRANSIT"}
          />
        </div>
      )}
    </DatePicker>
  },

  deliverStartTimeWindow: (obj:Cell<any>) => {
    return <NormalDatePicker {...obj}/>
  },

  deliverEndTimeWindow: (obj:Cell<any>) => {
    return <NormalDatePicker {...obj}/>
  },

  pickupStartTimeWindow: (obj:Cell<any>) => {
    return <NormalDatePicker {...obj}/>
  },
  orderDate: (obj:Cell<any>) => {
    return <NormalDatePicker {...obj}/>
  },


  branchName: ({ row, column, value }: Cell<any>) => {
    const editDetailsValue = useTypedSelector(state => state.order.listView.editDetails?.[row.original.shipmentId]?.[column.id]?.value)
    const branchList = useTypedSelector(state => state.order.listView.branches)
    // const lastUpdatedCell = useTypedSelector(state => state.order.listView.lastUpdatedCell)

    const dispatch = useDispatch<Dispatch<OrderListViewActions>>()
    const optionList = React.useMemo(() => {
      return branchList?.map((branch: any) => {
        return {
          value: `${branch.id}~@~${branch.name}`,
          label: branch.name,
          id: branch.id,
          title: branch.name
        }
      })
    }, [branchList])
    const selectedValue = optionList.filter((op) => op.label === value);

    return <DropDown
      value={editDetailsValue || (selectedValue?.length ? selectedValue[0]?.value : value)}
      onChange={(val: any) => {
        dispatch({
          type: '@@orderListView/SET_EDIT_DETAILS',
          payload: {
            rowId: row?.original?.shipmentId,
            columnId: column.id,
            value: val,
            hasError: false
          }
        })
      }}
      variant='inline-edit'
      optionList={optionList}
      width='100%'
      disabled = {row.original.orderStatus === "INTRANSIT" || (row.original.orderStatus === "PICKEDUP" && row.original.orderType === 'DELIVER')}
    />
  },

  deliveryType: ({ row, column, value }: Cell<any>) => {
    const superType: tSuperType = userAccessInfo.superType;
    const editDetailsValue = useTypedSelector(state => state.order.listView.editDetails?.[row.original.shipmentId]?.[column.id]?.value)
    const deliveryType = useTypedSelector(state => state.order.listView.deliveryType)
    const lastUpdatedCell = useTypedSelector(state => state.order.listView.lastUpdatedCell)
    const [selectedOption, setSelectedOption] = React.useState<IMultiSelectOptions[] | undefined>()
    const displayOptions = React.useRef<string | undefined>()
    const dispatch = useDispatch<Dispatch<OrderListViewActions>>()
    const optionList = React.useMemo(() => {
        return deliveryType.map((type: any) => {
            return {
              value: type.name,
              label: type.name,
              id: type.id,
              title: type.name
            }
        })
    }, [deliveryType])

    const optionsMap: Record<string, any> = React.useMemo(() => {
        const map = {}
        deliveryType.forEach((type: any) => {
            map[type.name] = {
              value: type.name,
              label: type.name,
              id: type.id,
              title: type.name
            }
        })
        return map
    }, [deliveryType])

 
    useEffect(() => {
        const selectionString = editDetailsValue !== undefined ? editDetailsValue : value
        const selection: any = []
        selectionString?.split(',')?.forEach((skill: string) => {
            selection.push(optionsMap[skill])
        })

        setSelectedOption(selection)
        displayOptions.current = selection?.map((o: { label: string; }) => o?.label).join(',')
       
    }, [value, editDetailsValue])

    return <MultiSelectWrapper>
        <MultiSelect
        options={optionList}
        onMenuClose={() => {
            dispatch({
                type: '@@orderListView/SET_EDIT_DETAILS',
                payload: {
                    rowId: row?.original?.shipmentId,
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
                        autoFocus={`${row.original.shipmentId}-${column.id}` === lastUpdatedCell}
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
                        disabled = {row.original.orderStatus === "INTRANSIT" || (row.original.orderStatus === "PICKEDUP" && row.original.orderType === 'DELIVER')}
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
    </MultiSelectWrapper>
  },

  priority: ({ row, column, value }: Cell<any>) => {
    const editDetailsValue = useTypedSelector(state => state.order.listView.editDetails?.[row.original.shipmentId]?.[column.id]?.value)
    const priority = useTypedSelector(state => state.order.listView.priority)
    // const lastUpdatedCell = useTypedSelector(state => state.order.listView.lastUpdatedCell)

    const dispatch = useDispatch<Dispatch<OrderListViewActions>>()
    const optionList = React.useMemo(() => {
      return priority?.map((priority: any) => {
        return {
          value: priority.clientRefMasterCd,
          label: priority.clientRefMasterDesc,
          id: priority.clientRefMasterId,
          title: priority.clientRefMasterDesc
        }
      })
    }, [priority])

    const selectedValue = optionList.filter((op) => op.label === value);

    return <DropDown
      value={editDetailsValue || (selectedValue?.length ? selectedValue[0]?.value : value)}
      onChange={(val: any) => {
        dispatch({
          type: '@@orderListView/SET_EDIT_DETAILS',
          payload: {
            rowId: row?.original?.shipmentId,
            columnId: column.id,
            value: val,
            hasError: false
          }
        })
      }}
      variant='inline-edit'
      optionList={optionList}
      width='100%'
      disabled = {row.original.orderStatus === "INTRANSIT" || (row.original.orderStatus === "PICKEDUP" && row.original.orderType === 'DELIVER')}
    />
  },
  serviceType: ({ row, column, value }: Cell<any>) => {
    const editDetailsValue = useTypedSelector(state => state.order.listView.editDetails?.[row.original.shipmentId]?.[column.id]?.value)
    const serviceType = useTypedSelector(state => state.order.listView.serviceType)

    const dispatch = useDispatch<Dispatch<OrderListViewActions>>()
    const optionList = React.useMemo(() => {
      return serviceType?.map((service: any) => {
        return {
          value: service.clientRefMasterCd,
          label: service.clientRefMasterDesc,
          id: service.clientRefMasterId,
          title: service.clientRefMasterDesc
        }
      })
    }, [serviceType])

    return <DropDown
      value={editDetailsValue || value}
      onChange={(val: any) => {
        dispatch({
          type: '@@orderListView/SET_EDIT_DETAILS',
          payload: {
            rowId: row?.original?.shipmentId,
            columnId: column.id,
            value: val,
            hasError: false
          }
        })
      }}
      variant='inline-edit'
      optionList={optionList}
      width='100%'
      disabled = {row.original.orderStatus === "INTRANSIT" || (row.original.orderStatus === "PICKEDUP" && row.original.orderType === 'DELIVER')}
    />
  },
  timeWindowConfirmedBy: ({ row, column, value }: Cell<any>) => {
    const editDetailsValue = useTypedSelector(state => state.order.listView.editDetails?.[row.original.shipmentId]?.[column.id]?.value)
    const timeWindowConfirmedBy = [{ 'id': 'NOTCONFIRMED', 'label': 'Not Confirmed', 'value': 'NOTCONFIRMED' }, { 'id': 'DISPATCHER', 'label': 'Dispatcher', 'value': 'DISPATCHER' }, { 'id': 'CUSTOMER', 'label': 'Customer', 'value': 'CUSTOMER' }];

    const dispatch = useDispatch<Dispatch<OrderListViewActions>>()

    return <DropDown
      value={editDetailsValue || value}
      onChange={(val: any) => {
        dispatch({
          type: '@@orderListView/SET_EDIT_DETAILS',
          payload: {
            rowId: row?.original?.shipmentId,
            columnId: column.id,
            value: val,
            hasError: false
          }
        })
      }}
      variant='inline-edit'
      optionList={timeWindowConfirmedBy}
      width='100%'
      disabled = {row.original.orderStatus === "INTRANSIT" || (row.original.orderStatus === "PICKEDUP" && row.original.orderType === 'DELIVER')}
    />
  },
  paymentType: ({ row, column, value }: Cell<any>) => {
    const editDetailsValue = useTypedSelector(state => state.order.listView.editDetails?.[row.original.shipmentId]?.[column.id]?.value)
    const paymentType = useTypedSelector(state => state.order.listView.paymentMode)

    const dispatch = useDispatch<Dispatch<OrderListViewActions>>()
    const optionList = React.useMemo(() => {
      return paymentType?.map((payment: any) => {
        return {
          value: payment.clientRefMasterCd,
          label: payment.clientRefMasterDesc,
          id: payment.clientRefMasterId,
          title: payment.clientRefMasterDesc
        }
      })
    }, [paymentType])

    return <DropDown
      value={editDetailsValue || value}
      onChange={(val: any) => {
        dispatch({
          type: '@@orderListView/SET_EDIT_DETAILS',
          payload: {
            rowId: row?.original?.shipmentId,
            columnId: column.id,
            value: val,
            hasError: false
          }
        })
      }}
      variant='inline-edit'
      optionList={optionList}
      width='100%'
      disabled = {row.original.orderStatus === "INTRANSIT" || (row.original.orderStatus === "PICKEDUP" && row.original.orderType === 'DELIVER')}
    />
  },

  pickupNotes: ({ row, column, value }: Cell<any>) => {
    const dispatch = useDispatch<Dispatch<OrderListViewActions>>()
    const editDetails = useTypedSelector(state => state.order.listView.editDetails)
    const lastUpdatedCell = useTypedSelector(state => state.order.listView.lastUpdatedCell)
    const columnStructure = useTypedSelector(state => state.order.listView.structure.columns)
    const [inputVal, setInputVal] = React.useState(value)
    const debouncedValue = useDebounce(inputVal, 300)

    useEffect(() => {
      if (value === debouncedValue) {
        // dispatch({
        //   type: '@@driverListView/REMOVE_EDIT_DETAILS',
        //   payload: {
        //     rowId: row?.original?.driverId,
        //     columnId: column.id
        //   }
        // })
      } else {
        dispatch({
          type: '@@orderListView/SET_EDIT_DETAILS',
          payload: {
            rowId: row?.original?.shipmentId,
            columnId: column.id,
            value: debouncedValue,
            hasError: false
          }
        })
      }
    }, [debouncedValue])

    return <TextInput id={`editableCell-${row.id}-${column.id}`}
      autoFocus={`${row.original.shipmentId}-${column.id}` === lastUpdatedCell}

      defaultValue={
        editDetails?.[row.original.shipmentId]?.[column.id] ?
          editDetails?.[row.original.shipmentId]?.[column.id]?.value || ''
          : value
      }
      error={editDetails?.[row.original.shipmentId]?.[column.id]?.hasError}
      variant='inline-edit'
      maxLength={Number(columnStructure[column.id]?.validation?.maxlength?.args)}
      onChange={React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setInputVal(value)
      }, [setInputVal])} 
      disabled = {(row.original.orderStatus === "INTRANSIT" || row.original.orderType === 'DELIVER') || (row.original.orderStatus === "PICKEDUP" && row.original.orderType === 'DELIVER')} />
  },

  deliverNotes: ({ row, column, value }: Cell<any>) => {
    const dispatch = useDispatch<Dispatch<OrderListViewActions>>()
    const editDetails = useTypedSelector(state => state.order.listView.editDetails)
    const lastUpdatedCell = useTypedSelector(state => state.order.listView.lastUpdatedCell)
    const columnStructure = useTypedSelector(state => state.order.listView.structure.columns)
    const [inputVal, setInputVal] = React.useState(value)
    const debouncedValue = useDebounce(inputVal, 300)

    useEffect(() => {
      if (value === debouncedValue) {
        // dispatch({
        //   type: '@@driverListView/REMOVE_EDIT_DETAILS',
        //   payload: {
        //     rowId: row?.original?.driverId,
        //     columnId: column.id
        //   }
        // })
      } else {
        dispatch({
          type: '@@orderListView/SET_EDIT_DETAILS',
          payload: {
            rowId: row?.original?.shipmentId,
            columnId: column.id,
            value: debouncedValue,
            hasError: false
          }
        })
      }
    }, [debouncedValue])

    return <TextInput id={`editableCell-${row.id}-${column.id}`}
      autoFocus={`${row.original.shipmentId}-${column.id}` === lastUpdatedCell}

      defaultValue={
        editDetails?.[row.original.shipmentId]?.[column.id] ?
          editDetails?.[row.original.shipmentId]?.[column.id]?.value || ''
          : value
      }
      error={editDetails?.[row.original.shipmentId]?.[column.id]?.hasError}
      variant='inline-edit'
      maxLength={Number(columnStructure[column.id]?.validation?.maxlength?.args)}
      onChange={React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setInputVal(value)
      }, [setInputVal])} 
      disabled = {(row.original.orderStatus === "INTRANSIT" || row.original.orderType === 'PICKUP') || (row.original.orderStatus === "PICKEDUP" && row.original.orderType === 'DELIVER')} />
  },
  customDropdown: ({ row, column, value }: Cell<any>) => {
    const editDetailsValue = useTypedSelector(state => state.order.listView.editDetails?.[row.original.shipmentId]?.[column.id]?.value)
    const dropdown = useTypedSelector(state => state.order.listView.structure.columns[column.id].dropdownValues);
    // const lastUpdatedCell = useTypedSelector(state => state.order.listView.lastUpdatedCell)

    const dispatch = useDispatch<Dispatch<OrderListViewActions>>()
    const optionList = React.useMemo(() => {
      // return dropdown?.map((dropdown: any) => {
      //   debugger;
      //   return {
      //     value: dropdown,
      //     label: dropdown,
      //   }
      // })

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
        dispatch({
          type: '@@orderListView/SET_EDIT_DETAILS',
          payload: {
            rowId: row?.original?.shipmentId,
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



export default ORDER_LIST_EDITABLE_CELL_MAPPING