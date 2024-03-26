import React from 'react'
import {  Position, Toggle } from 'ui-library'
import { Cell } from 'react-table'
import TextOverflowEllipsis from '../../../../../utils/components/TextOverflowEllipsis'
import { Tooltip } from 'ui-library'
import { useTypedSelector } from '../../../../../utils/redux/rootReducer'
import useClientProperties from '../../../../common/ClientProperties/useClientProperties'
import moment from 'moment-timezone'

const RATE_PROFILE_LIST_VIEW_CELL_MAPPING = {

  default: React.memo(({ value }: Cell<any>) => {
    return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
  }, (p, n) => p.value === n.value),

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
  createdOnDt: React.memo(({ value }: Cell) => {
    const clientProperties = useClientProperties(['DATEFORMAT','TIMEZONE'])
    const d2 = moment.utc(value).tz(clientProperties?.TIMEZONE?.propertyValue)
    const format1 = clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()+' hh:mm A'

  return <TextOverflowEllipsis title={d2.format(format1)}>{d2.format(format1)}</TextOverflowEllipsis>
      
}, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original)),

profileType: React.memo(
  ({ value }: Cell<any>) => {
    const dynamicLabels = useTypedSelector((state) => state.dynamicLabels);
    return (
      <TextOverflowEllipsis title={dynamicLabels[value] || value}>
        {dynamicLabels[value] || value}
      </TextOverflowEllipsis>
    );
  },
  (p, n) => p.value === n.value
)
}

export default RATE_PROFILE_LIST_VIEW_CELL_MAPPING