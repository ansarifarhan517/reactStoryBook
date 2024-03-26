import React, { Dispatch, useEffect } from 'react'
import { TextInput, DropDown , Button, Toggle, Position} from 'ui-library'
import { Cell } from 'react-table'
import TextOverflowEllipsis from '../../../../utils/components/TextOverflowEllipsis'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import { useDispatch } from 'react-redux'
import { VehicleListViewActions } from '../VehicleListView.actions'
// import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping';
// import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels';
import useDebounce from '../../../../utils/useDebounce'
import VehicleNumberField from '../utils/VehicleNumberField'
import AnchorTextCell from '../../../../utils/components/CellMapping/AnchorTextCell'
import NumberCountCell from '../../../../utils/components/CellMapping/NumberCountCell'

export const VEHICLE_EDITABLE_CELL_MAPPING = {
    
      default: ({ row, column, value }: Cell<any>) => {
        const dispatch = useDispatch<Dispatch<VehicleListViewActions>>()
        const editDetails = useTypedSelector(state => state.vehicle.listView.editDetails)
        const columnStructure = useTypedSelector(state => state.vehicle.listView.structure.columns)
        const [inputVal, setInputVal] = React.useState(value)
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

        return <TextInput id={`editableCell-${row.id}-${column.id}`}
          defaultValue={
            editDetails?.[row.original.vehicleId]?.[column.id] ?
              editDetails?.[row.original.vehicleId]?.[column.id]?.value || ''
              : value
          }
          error={editDetails?.[row.original.vehicleId]?.[column.id]?.hasError}
          variant='inline-edit'
          maxLength={Number(columnStructure[column.id]?.validation?.maxlength?.args || 100)}
          onChange={React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value as string
            // console.log(value)
       
            // All these fields should restrict to two places of decimal ÷
            // if (column.id === 'capacityInWeight' || column.id === 'capacityInVolume' || column.id === 'minCapacityUtilizationInUnits' || column.id === 'minCapacityUtilizationInWeight' || column.id === 'minCapacityUtilizationInVolume') {
            //   const afterDecimal = value.substring(value.indexOf(".") + 1, value.length).length >= 2
            //   const valu = afterDecimal ? parseInt(value).toFixed(2) : value 
            //   // console.log(valu)
            //   setInputVal(valu)
            // } else {
              // console.log(value)
              setInputVal(value)
            // }
          }, [setInputVal])}
        />
      },
      branchName: ({ row, column, value }: Cell<any>) => {
          const branchList = useTypedSelector(state => state.vehicle.listView.branchName)
          const editDetails = useTypedSelector(state => state.vehicle.listView.editDetails)
          const dispatch = useDispatch<Dispatch<VehicleListViewActions>>()
          const optionList = branchList?.map((branch: any) => {
              return {
                  value: branch.id,
                  label: branch.value,
                  id: branch.id,
                  title: branch.label
              }
          })
    
          return <DropDown
          value={editDetails?.[row.original.vehicleId]?.[column.id]?.value || value}
          onChange={(val: any) => {
            dispatch({
              type: '@@vehicleListView/SET_EDIT_DETAILS',
              payload: {
                rowId: row?.original?.vehicleId,
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
        
        vehicleType: ({ row, column, value }: Cell<any>) => {
          const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
          const optionList = React.useMemo(() => ([
            { id: '2 Wheeler', value: '2 Wheeler', label: dynamicLabels.twoWheeler },
            { id: '4 Wheeler', value: '4 Wheeler', label: dynamicLabels.fourWheeler }
          ].map((vehicleType: any) => {
            return {
              value: vehicleType.value,
              label: vehicleType.label,
              id: vehicleType.id,
              title: vehicleType.label
            }
          })), [dynamicLabels])
          const editDetails = useTypedSelector(state => state.vehicle.listView.editDetails)
          const dispatch = useDispatch<Dispatch<VehicleListViewActions>>()
      
          return <DropDown
            value={editDetails?.[row.original.vehicleId]?.[column.id]?.value || value}
            onChange={(val: any) => {
              dispatch({
                type: '@@vehicleListView/SET_EDIT_DETAILS',
                payload: {
                  rowId: row?.original?.vehicleId,
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
        capacityInUnits: VehicleNumberField,
        capacityInWeight: VehicleNumberField,
        capacityInVolume: VehicleNumberField,
        minCapacityUtilizationInUnits: VehicleNumberField,
        minCapacityUtilizationInWeight: VehicleNumberField,
        minCapacityUtilizationInVolume: VehicleNumberField,
         customDropdown: ({ row, column, value }: Cell<any>) => {
          const editDetailsValue = useTypedSelector(state => state.vehicle.listView.editDetails?.[row.original.id]?.[column.id]?.value)
          const dropdown = useTypedSelector(state => state.vehicle.listView.structure.columns[column.id].dropdownValues);
          // const lastUpdatedCell = useTypedSelector(state => state.order.listView.lastUpdatedCell)

          
      
          const dispatch = useDispatch<Dispatch<VehicleListViewActions>>()
          const optionList = React.useMemo(() => {
      
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
                type: '@@vehicleListView/SET_EDIT_DETAILS',
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


export const VEHICLE_CELL_MAPPING = {
    default: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
      }, (p, n) => p.value === n.value),
  
      vehicleNumber: React.memo(({ value, column, row }: Cell<any>) => {
        const viewMode = useTypedSelector(state => state.vehicle.listView.viewMode)
  
        if (!value) {
          return <div></div>
        }
  
        return (
          <TextOverflowEllipsis title={value}>
            {viewMode === 'listview' ?
              value :
              <Button variant='link' primary onClick={() => column?.['cellCallback'](row.original)}>
                {value}
              </Button>
            }
          </TextOverflowEllipsis>)
      }, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original)),
  
      isActiveFl: React.memo(({ value, column, row }: Cell) => {        

        const [active, setActive] = React.useState<boolean>(value)

        React.useEffect(() => {
          setActive(value)
        }, [value])
  
        return <Position type='absolute' top='0em' left='1em'>
          <Toggle
            disabled={row.values.status === "Intransit"}
            checked={active}
            onChange={({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
              setActive(checked)
              column?.['cellCallback'](checked, row.original, setActive)
            }
            }
          />
        </Position>
      }, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original)),
      insuranceValidity: React.memo(({ value }: Cell) => {
          var d = new Date(value); 
          // d.setUTCSeconds(value);
        return <div>{value && d?.toLocaleDateString()}</div>
            
      }, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original)),
      tripNumber:AnchorTextCell,
      compartmentCount: NumberCountCell,
      trackerCount: NumberCountCell
};

