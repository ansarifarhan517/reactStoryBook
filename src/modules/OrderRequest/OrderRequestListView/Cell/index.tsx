import DefaultCell from '../../../../utils/components/CellMapping/DefaultCell';
import { useDispatch } from 'react-redux'
import React, { Dispatch, useEffect } from 'react'
import { useTypedSelector } from '../../../../utils/redux/rootReducer';
import { Cell } from 'react-table'
import { tOrderRequestListViewAcions } from '../OrderRequestListView.actions';
import { TextInput } from 'ui-library'
import useDebounce from '../../../../utils/useDebounce';
import TextOverflowEllipsis from '../../../../utils/components/TextOverflowEllipsis';
import BoxTypeTextCell from '../../../../utils/components/CellMapping/BoxTypeTextCell';
import FormattedDateWithLocal from '../../../../utils/components/CellMapping/FormattedDateWithLocal'
import { getFormattedDate } from '../../../Order/OrderListOptionData/utils';


export const ORDERREQUEST_LIST_VIEW_CELL_MAPPING = {
    default: DefaultCell,
    weeklyOffList: React.memo(({ value }: Cell<any>) => {
        const weeklyOffData = value ? value.join(',') : ''
        return <TextOverflowEllipsis title={value}>{weeklyOffData}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    skillSet: BoxTypeTextCell,
    pickupBy: FormattedDateWithLocal,
    deliverBy: FormattedDateWithLocal,
    orderStatus: React.memo(({ value }: Cell<any>) => {
        const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
        const dynamicValue = dynamicLabels?.[value] ? dynamicLabels?.[value] : value
        return <TextOverflowEllipsis title={dynamicValue}>{dynamicValue}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    bookingStatus: React.memo(({ value }: Cell<any>) => {
        const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
        const dynamicValue = dynamicLabels?.[value] ? dynamicLabels?.[value] : value
        return <TextOverflowEllipsis title={dynamicValue}>{dynamicValue}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    shipDate: React.memo(({ value,row }: Cell<any>) => {
        if (!value) {
          return <div></div>
        }
        return <TextOverflowEllipsis title={getFormattedDate(value,row.original['shipDateTZ'])}>{getFormattedDate(value,row.original['shipDateTZ'])}</TextOverflowEllipsis>
      }, (p, n) => p.value === n.value),

      bookingDate: React.memo(({ value,row }: Cell<any>) => {
        if (!value) {
          return <div></div>
        }
        return <TextOverflowEllipsis title={getFormattedDate(value,row.original['bookingDateTZ'])}>{getFormattedDate(value,row.original['shipDateTZ'])}</TextOverflowEllipsis>
      }, (p, n) => p.value === n.value),

      pickupStartTimeWindow: React.memo(({ value,row }: Cell<any>) => {
        if (!value) {
          return <div></div>
        }
        return <TextOverflowEllipsis title={getFormattedDate(value,row.original['pickupStartTimeWindowTZ'])}>{getFormattedDate(value,row.original['shipDateTZ'])}</TextOverflowEllipsis>
      }, (p, n) => p.value === n.value),

      pickupEndTimeWindow: React.memo(({ value,row }: Cell<any>) => {
        if (!value) {
          return <div></div>
        }
        return <TextOverflowEllipsis title={getFormattedDate(value,row.original['pickupEndTimeWindowTZ'])}>{getFormattedDate(value,row.original['shipDateTZ'])}</TextOverflowEllipsis>
      }, (p, n) => p.value === n.value),

      deliverStartTimeWindow: React.memo(({ value,row }: Cell<any>) => {
        if (!value) {
          return <div></div>
        }
        return <TextOverflowEllipsis title={getFormattedDate(value,row.original['deliverStartTimeWindowTZ'])}>{getFormattedDate(value,row.original['shipDateTZ'])}</TextOverflowEllipsis>
      }, (p, n) => p.value === n.value),

      deliverEndTimeWindow: React.memo(({ value,row }: Cell<any>) => {
        if (!value) {
          return <div></div>
        }
        return <TextOverflowEllipsis title={getFormattedDate(value,row.original['deliverEndTimeWindowTZ'])}>{getFormattedDate(value,row.original['shipDateTZ'])}</TextOverflowEllipsis>
      }, (p, n) => p.value === n.value),

}

export const ORDERREQUEST_EDITABLE_CELL_MAPPING = {
    default: ({ row, column, value }: Cell<any>) => {
        const dispatch = useDispatch<Dispatch<tOrderRequestListViewAcions>>()
        const editDetails = useTypedSelector(state => state.orderRequest.listView.editDetails)
        const columnStructure = useTypedSelector(state => state.orderRequest.listView.structure.columns)
        const lastUpdatedCell = useTypedSelector(state => state.orderRequest.listView.lastUpdatedCell)

        const [inputVal, setInputVal] = React.useState(value)
        const debouncedValue = useDebounce(inputVal, 500)
        useEffect(() => {
            if (value === debouncedValue) {

            } else {
                dispatch({
                    type: '@@orderRequestListView/SET_EDIT_DETAILS',
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

}
