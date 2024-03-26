import React, { ComponentType } from 'react'
import { Cell } from 'react-table'
import { Button, Toggle, Position, Tooltip} from 'ui-library'
import TextOverflowEllipsis from '../../../../../utils/components/TextOverflowEllipsis'
import { useTypedSelector } from '../../../../../utils/redux/rootReducer'

export interface ICellMapping {
    [key: string]: ComponentType<Cell>
}

const ACCESS_PROFILE_CELL_MAPPING = {
    accessprofileDesc: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    accessprofileName: React.memo(({ value }: Cell<any>) => {
      return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
  }, (p, n) => p.value === n.value),

    activeFl: React.memo(({ value, column, row }: Cell) => {
        const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
        const [active, setActive] = React.useState<boolean>(value)
        React.useEffect(() => {
          setActive(value)
        }, [value])
    
        return <Position type='absolute' top='3px' left='1em' >
          <Tooltip hover={true} message={active ? dynamicLabels?.markAsInactive : dynamicLabels?.markAsActive}>
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

      attachedUserGroups : React.memo(({ value, column, row }: Cell<any>) => {
        return (
          <Button variant='button' disabled={value === 0} primary onClick={() => column?.['cellCallback'](row.original)} style={{ height: '20px', width: '20px', borderRadius: "2px" }}>
            {value}
          </Button>
        )
      }, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original)),
}

export default ACCESS_PROFILE_CELL_MAPPING