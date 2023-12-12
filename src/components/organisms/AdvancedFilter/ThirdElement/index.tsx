import React, { useState, useEffect } from 'react'
import TextInput from '../../../molecules/TextInput'
import MultiSelect from '../../../molecules/MultiSelect'
import { tMultiSelectChildren } from '../../../molecules/MultiSelect/interfaces'
import InputField from '../../../atoms/InputField'
import AdvFilterDropdown from '../components/AdvFiterDropdown'
import { DatePicker, DateRangePicker } from '../../../molecules/DatePicker'
import { IThirdElementProps } from '../interfaces'
// import operationTypes from './Data/operationType'
import columnsSelector from '../Data/columnsStructure'
import { branchList, DeliveryType, statusList, weeklyOff } from './data'

const CreateHashMaps = (arr: any) => {
  let HashMapArray = {}
  arr.forEach(
    (m: any) =>
      (HashMapArray = {
        ...HashMapArray,
        [m.value]: m
      })
  )
  return HashMapArray
}

const getSelectValuesArray = (hsetArray: any, value: string) => {
  const arrayOfValues: any[] = []
  const valueArr = value.split(',')
  valueArr.forEach((v: string) => {
    arrayOfValues.push(hsetArray[v])
  })
  return arrayOfValues
}

const ThirdElement = ({
  value,
  setValue,
  operationType,
  fieldType,
  columnName
}: IThirdElementProps) => {
  const [options, setOptions] = useState<any[]>([])
  const [valueArray, setValueArray] = useState<any>([])

  const DropdownOptions = (columnName: any, columnsSelector: any) => {
    const cName = typeof columnName === 'object' ? columnName.value : columnName

    if (columnsSelector[cName]?.dropdownValues) {
      return columnsSelector[cName].dropdownValues
    } else if (cName === 'branchName') {
      return branchList
    } else if (cName === 'deliveryMediumMasterTypeCd') {
      return DeliveryType
    } else if (cName === 'statusCd') {
      return statusList
    } else if (cName === 'isAttandanceFl') {
      return [
        {
          label: 'Absent',
          value: 'Absent'
        },
        {
          label: 'Present',
          value: 'Present'
        }
      ]
    } else if (cName === 'isActiveFl') {
      return [
        {
          label: 'Active',
          value: 'Active'
        },
        {
          label: 'InActive',
          value: 'InActive'
        }
      ]
    } else if (cName === 'weeklyOff') {
      return weeklyOff
    } else if (cName === 'loggedInStatus') {
      return [
        {
          label: 'Logged In',
          value: 'Logged In'
        },
        {
          label: 'Logged Out',
          value: 'Logged Out'
        },
        {
          label: 'Never Logged In',
          value: 'Never Logged In'
        }
      ]
    } else {
      return []
    }
  }

  useEffect(() => {
    setOptions(DropdownOptions(columnName, columnsSelector))
  }, [columnsSelector, columnName])

  useEffect(() => {
    if (typeof value === 'string') {
      if (fieldType === 'select' || fieldType === 'dropdown') {
        // do the conversion
        const HSetArray = CreateHashMaps(options)
        const values = getSelectValuesArray(HSetArray, value)
        setValueArray([...values])
      }
    } else {
      setValueArray(value)
    }
  }, [options, fieldType, operationType, value])

  const oType =
    typeof operationType === 'string'
      ? operationType
      : operationType?.labelKey
      ? operationType.labelKey
      : operationType

  if (fieldType === 'text' && oType !== null) {
    return (
      <TextInput
        value={value}
        onChange={(e: any) => setValue(e.target.value)}
      />
    )
  } else if (fieldType === 'number' && oType !== null) {
    return (
      <TextInput
        value={value}
        type='number'
        onChange={(e: any) => setValue(e.target.value)}
      />
    )
  } else if (
    (fieldType === 'dropdown' && oType === 'filterOpIn') ||
    (fieldType === 'select' && oType === 'filterOpIn') ||
    (fieldType === 'multiselect' && oType === 'filterOpIn')
  ) {
    const handleChange = (
      event: any,
      value: any,
      isSelected: any,
      newSelectedOption: any
    ) => {
      console.log(event, value, isSelected)
      setValue(newSelectedOption)
    }

    return (
      <MultiSelect
        id='MultiSelect'
        width='100%'
        options={Object.values(options)}
        selected={valueArray}
        onChange={handleChange}
        style={{
          position: 'absolute',
          top: 'auto',
          left: 'auto',
          backgroundColor: 'white'
        }}
        menuOpen={false}
      >
        {({ optionSelected, isMenuOpen, openMenu }: tMultiSelectChildren) => {
          return (
            <InputField
              onClick={() => {
                openMenu(!isMenuOpen)
              }}
              value={
                optionSelected && optionSelected?.length > 0
                  ? optionSelected?.length + ' Selected'
                  : 'Select'
              }
            />
          )
        }}
      </MultiSelect>
    )
  } else if (
    (fieldType === 'select' && oType !== null) ||
    (fieldType === 'dropdown' && oType !== null)
  ) {
    return (
      <AdvFilterDropdown
        variant='default-select'
        options={Object.values(options)}
        onChange={(e: any) => {
          setValue(e.value, e.label)
        }}
        placeholder='Select'
        value={valueArray[0]}
      />
    )
  } else if (fieldType === 'multiselect') {
    const handleChange = (
      event: any,
      value: any,
      isSelected: any,
      newSelectedOption: any
    ) => {
      console.log(event, value, isSelected)
      setValue(newSelectedOption)
    }

    return (
      <MultiSelect
        id='MultiSelect'
        width='100%'
        options={Object.values(options)}
        selected={valueArray}
        onChange={handleChange}
        style={{
          position: 'absolute',
          top: 'auto',
          left: 'auto',
          backgroundColor: 'white'
        }}
        menuOpen={false}
      >
        {({ optionSelected, isMenuOpen, openMenu }: tMultiSelectChildren) => {
          return (
            <InputField
              onClick={() => {
                openMenu(!isMenuOpen)
              }}
              value={
                optionSelected && optionSelected?.length > 0
                  ? optionSelected?.length + ' Selected'
                  : 'Select'
              }
            />
          )
        }}
      </MultiSelect>
    )
  } else if (fieldType === 'time' && oType !== null) {
    return (
      <DatePicker
        onChange={(e: any) => setValue(e)}
        label='Time'
        variant='time'
        timeInterval={15}
        timeFormat={12}
        style={{
          position: 'absolute',
          top: 'auto',
          right: 'auto'
        }}
      >
        {({ value, open, setOpen }: any) => (
          <div onClick={() => setOpen(!open)}>
            <TextInput
              id='someId'
              name={`${columnName}-text`}
              className='someClassname'
              placeholder='Please Click Here'
              variant='withIcon'
              iconVariant='calendar'
              iconSize='md'
              value={value?.toString()}
              read-only
              iconStyle={{ padding: '9px 9px 9px 9px' }}
            />
          </div>
        )}
      </DatePicker>
    )
  } else if (fieldType === 'date' || fieldType === 'calendar') {
    let startDate, endDate
    if (!value) {
      startDate = new Date()
      endDate = new Date()
    } else if (typeof value === 'string') {
      const [sDate, eDate] = value.split(',')
      startDate = new Date(0)
      endDate = new Date(0)
      startDate.setUTCSeconds(parseInt(sDate))
      endDate.setUTCSeconds(parseInt(eDate))
    } else {
      startDate = value[0]
      endDate = value[1]
    }

    return (
      <DateRangePicker
        onApply={(e: any) => setValue(e)}
        label='Date'
        variant='daterange'
        timeFormat={24}
        showTime={false}
        startDate={startDate}
        endDate={endDate}
        fromDateFormatter={getFormattedDate}
        toDateFormatter={getFormattedDate}
        style={{
          position: 'fixed',
          left: '0px',
          top: '20%',
          zIndex: 999
        }}
      >
        {({ value, open, setOpen }: any) => (
          <div onClick={() => setOpen(!open)}>
            <TextInput
              id='someId'
              name={`${columnName}-text`}
              className='someClassname'
              variant='basic'
              border={false}
              labelColor='text.inputLabel.default'
              placeholder='Please Click Here'
              fullWidth
              value={value?.toString()}
            />
          </div>
        )}
      </DateRangePicker>
    )
  } else {
    return null
  }
}

const getFormattedDate = (date: Date) => {
  const todayTime = date
  const month = todayTime.getMonth() + 1
  const day = todayTime.getDate()
  const year = todayTime.getFullYear()
  const hours = todayTime.getHours()
  const minutes = todayTime.getMinutes()
  return month + '/' + day + '/' + year + ' ' + hours + ':' + minutes
}

export default ThirdElement
