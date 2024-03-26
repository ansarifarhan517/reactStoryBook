import React from 'react'
import { Button, Position, Toggle } from 'ui-library'
import { Cell } from 'react-table'
import TextOverflowEllipsis from '../../../../../utils/components/TextOverflowEllipsis'
import { Tooltip } from 'ui-library'
import { useTypedSelector } from '../../../../../utils/redux/rootReducer'

const CUSTOMER_LIST_VIEW_CELL_MAPPING = {

  default: React.memo(({ value }: Cell<any>) => {
    return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
  }, (p, n) => p.value === n.value),
  
  whatsappOptin : React.memo(({ value,column,row }: Cell) => {
    const whatsappValue = value === undefined ? '' : value === 'Y' ? 'Yes' : 'No';

    return <TextOverflowEllipsis id={`${column.id}-${row.id}`} title={whatsappValue}>{whatsappValue}</TextOverflowEllipsis>
  }, (p, n) => p.value === n.value ),

  isActiveFl: React.memo(({ value, column, row }: Cell) => {
    const dynamicLabels = useTypedSelector(state => state.dynamicLabels)

    const [active, setActive] = React.useState<boolean>(value)
    React.useEffect(() => {
      setActive(value)
    }, [value])

    return <Position type='absolute' top='0em' left='1em'>
      <Tooltip hover={true} message={active ? dynamicLabels?.markStatusAsInactive : dynamicLabels?.markStatusAsActive}>
      <Toggle
        checked={active}
        onChange={({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
          setActive(checked)
          column?.['cellCallback'](checked, row.original, setActive)
        }
        }
      />
       </Tooltip>
    </Position>
  }, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original)),

  nodeCount: React.memo(({ value, column, row }: Cell<any>) => {
    return (
      <Button variant='button' primary onClick={() => column?.['cellCallback'](row.original)} style={{height:'20px', width:'20px', borderRadius: "2px"}}>
        {value}
      </Button>
    )
  }, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original)),



}

export default CUSTOMER_LIST_VIEW_CELL_MAPPING