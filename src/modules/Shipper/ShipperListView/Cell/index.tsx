import React, { Dispatch, useEffect } from 'react'
import { TextInput,DropDown } from 'ui-library'
import { Cell } from 'react-table'
import DefaultCell from '../../../../utils/components/CellMapping/DefaultCell'
import SquareCell from './SquareCell'
import StatusMappedCell from './StatusMappedCell'
import ToggleCell from './ToggleCell'
import { useDispatch } from 'react-redux'
import { tShipperListViewAcions } from '../ShipperListView.actions'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import useDebounce from '../../../../utils/useDebounce'
import NumberField from './NumberField'
import TextOverflowEllipsis from '../../../../utils/components/TextOverflowEllipsis'



export const SHIPPER_LIST_VIEW_CELL_MAPPING = {
  default: DefaultCell,
  noOfUsers: SquareCell,
  isActiveFl: ToggleCell,
  status: StatusMappedCell,
  whatsappOptin : React.memo(({ value, column, row }: Cell) => {
    const whatsappValue = value === undefined ? '' : value === 'Y' ? 'Yes' : 'No';

    return <TextOverflowEllipsis id={`${column.id}-${row.id}`} title={whatsappValue}>{whatsappValue}</TextOverflowEllipsis>
  }, (p, n) => p.value === n.value ),

}


export const SHIPPER_EDITABLE_CELL_MAPPING = {
  default: ({ row, column, value }: Cell<any>) => {
    const dispatch = useDispatch<Dispatch<tShipperListViewAcions>>()
    const editDetails = useTypedSelector(state => state.shipper.listView.editDetails)
    const columnStructure = useTypedSelector(state => state.shipper.listView.structure.columns)
    const lastUpdatedCell = useTypedSelector(state => state.shipper.listView.lastUpdatedCell)
    const error = useTypedSelector(state => state.shipper.listView.editDetails?.[row.original.shipperDetailsId]?.[column.id]?.hasError)

    const [inputVal, setInputVal] = React.useState(value)
    const debouncedValue = useDebounce(inputVal, 500)
    useEffect(() => {
      if (value === debouncedValue) {

      } else {
        dispatch({
          type: '@@shipperListView/SET_EDIT_DETAILS',
          payload: {
            rowId: row?.original?.shipperDetailsId,
            columnId: column.id,
            value: debouncedValue,
            hasError: false
          }
        })
      }
    }, [debouncedValue])

    return <TextInput id={`editableCell-${row.id}-${column.id}`}
      fullWidth
      autoFocus={`${row.original.shipperDetailsId}-${column.id}` === lastUpdatedCell}
      defaultValue={
        editDetails?.[row.original.shipperDetailsId]?.[column.id] ?
          editDetails?.[row.original.shipperDetailsId]?.[column.id]?.value || ''
          : value
      }
      error={error}
      variant='inline-edit'
      maxLength={Number(columnStructure[column.id]?.validation?.maxlength?.args || 100)}
      onChange={React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setInputVal(value)
      }, [setInputVal])} />
  },
  noOfUsers: SquareCell,
  isActiveFl: ToggleCell,
  phoneNumber: NumberField,
  customerSupportNumber: NumberField,
  priority: ({ row, column, value }: Cell<any>) => {
    const editDetailsValue = useTypedSelector(state => state.shipper.listView.editDetails?.[row.original.shipperDetailsId]?.[column.id]?.value)
    const priorityList = useTypedSelector(state => state.shipper.listView.priorityList)
    const lastUpdatedCell = useTypedSelector(state => state.shipper.listView.lastUpdatedCell)

    const dispatch = useDispatch<Dispatch<tShipperListViewAcions>>()
    const optionList = React.useMemo(() => {
        return priorityList?.map((priority: any) => {
            return {
              // value is label as while save needs to be save as high ,low jot priority1..-it needed while searching
                value: priority.value,
                label: priority.label,
                id: priority.id,
                title: priority.label
            }
        })
    }, [priorityList])

    return <DropDown
        value={editDetailsValue || value}
        autoFocus={`${row.original.shipperDetailsId}-${column.id}` === lastUpdatedCell}
        onChange={(val: any) => {
            dispatch({
                type: '@@shipperListView/SET_EDIT_DETAILS',
                payload: {
                    rowId: row?.original?.shipperDetailsId,
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