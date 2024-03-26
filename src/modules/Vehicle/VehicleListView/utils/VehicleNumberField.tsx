import React, { Dispatch, useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import { VehicleListViewActions } from '../VehicleListView.actions'
import { Cell } from 'react-table'
import { NumInput } from 'ui-library'
import useDebounce from '../../../../utils/useDebounce'
// import { AccessTokenValue } from 'msal/lib-commonjs/cache/AccessTokenValue'

const VehicleNumberField = ({ row, column, value }: Cell<any>) => {

    const dispatch = useDispatch<Dispatch<VehicleListViewActions>>()
    const editDetails = useTypedSelector(state => state.vehicle.listView.editDetails)
    const columnStructure = useTypedSelector(state => state.vehicle.listView.structure.columns)
    const [inputVal,setInputVal] = React.useState(value)
    const debouncedValue = useDebounce(inputVal, 500)
    

    useEffect(() => {
      if (value === debouncedValue) {
      } else {
        dispatch({
          type: '@@vehicleListView/SET_EDIT_DETAILS',
          payload: {
            rowId: row?.original?.vehicleId,
            columnId: column.id,
            value: debouncedValue,
            hasError: false
          }
        })
      }
    }, [debouncedValue])
    return <NumInput id={`editableCell-${row.id}-${column.id}`}
    name={`editableCell-${row.id}-${column.id}`}
    type='number'
    defaultValue={editDetails?.[row.original.vehicleId]?.[column.id] ?
      editDetails?.[row.original.vehicleId]?.[column.id]?.value || ''
      : value}
    step='0.01'
    variant='inline-edit'
    error={editDetails?.[row.original.vehicleId]?.[column.id]?.hasError}

    maxLength={Number(columnStructure[column.id]?.validation?.maxlength?.args || 100)}
    onKeyUp={(e )=> {
      const ele = e.target as HTMLInputElement
      const val = ele?.value
       if(column.id === 'capacityInUnits' || column.id === 'minCapacityUtilizationInUnits') {
        if(val.indexOf(".") !== -1) {
          const onlyNumber = val.substring(0,val.indexOf("."))
          // const onlyNumber = val.indexOf(".") === -1 ? val : val.substring(0,val.indexOf("."))
          //   setInputVal(onlyNumber)
          setInputVal(onlyNumber)
        }
        
        
      }else {
          // All these fields should restrict to two places of decimal ÷
          const afterDecimal = val.substring(val.indexOf(".") + 1, val.length).length >= 2
          if(afterDecimal) {
            setInputVal(parseFloat(val).toFixed(2))
          }
          // const valu = afterDecimal ? parseFloat(val).toFixed(2) : val 
         
          // setInputVal(valu)
          
      }
      return true
    }}
    onChange={React.useCallback((e:any) => {
      setInputVal(e.target.value)
      // if(column.id === 'capacityInUnits' || column.id === 'minCapacityUtilizationInUnits') {
      //   const value = e.target.value as string
      //   // All these fields should restrict to two places of decimal ÷
      //   const onlyNumber = value.indexOf(".") === -1 ? value : value.substring(0,value.indexOf("."))
      //   setInputVal(onlyNumber)
      // }else {
      //     const value = e.target.value as string
      //     // All these fields should restrict to two places of decimal ÷
      //     const afterDecimal = value.substring(value.indexOf(".") + 1, value.length).length >= 2
      //     const valu = afterDecimal ? parseFloat(value).toFixed(2) : value 
         
      //     setInputVal(valu)
      // }
     
      
    }, [setInputVal])}
  />
  }

  export default VehicleNumberField 

  // <NumberInput
  //       id='someId'
  //       name='someName'
  //       className='someClassName'
      
  //       initialValue={number('initialValue', 25)}
  //       maxLength={number('maxLength', 10)}
  //       error={boolean('error', false)}
  //       errorMessage={text('errorMessage', '')}
  //       required={boolean('required', false)}
  //       fullWidth={boolean('fullWidth', false)}
  //       onChange={action('Triggered: onChange')}
  //       allowDecimal={boolean('allowDecimal', false)}
  //     />
