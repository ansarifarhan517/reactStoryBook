import React from 'react'
import {
  // Button,
  Position, Toggle
} from 'ui-library'
import { Cell } from 'react-table'
import TextOverflowEllipsis from '../../../../../utils/components/TextOverflowEllipsis'
import { Tooltip } from 'ui-library'
import { useTypedSelector } from '../../../../../utils/redux/rootReducer'
// import FormattedDateWithLocal from '../../../../../utils/components/CellMapping/FormattedDateWithLocal'
import useClientProperties from '../../../../common/ClientProperties/useClientProperties'
import moment from 'moment';
import { Button } from 'ui-library'


const CONTRACT_LIST_VIEW_CELL_MAPPING = {

  default: React.memo(({ value }: Cell<any>) => {
    return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
  }, (p, n) => p.value === n.value),

  isActiveFl: React.memo(({ value, column, row }: Cell) => {
    const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
    const [active, setActive] = React.useState<boolean>(value)
    React.useEffect(() => {
      setActive(value)
    }, [value])

    return <Position type='absolute' top='3px' left='1em' >
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

  contractDate: React.memo(({ value }: Cell<any>) => {
    const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
    if (!value) {
      return <div></div>
    }
    return <TextOverflowEllipsis title={moment(value).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())}>
      {moment(value).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())}
    </TextOverflowEllipsis>
  }, (p, n) => p.value === n.value),

  contractExpiryDate: React.memo(({ value }: Cell<any>) => {
    const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
    if (!value) {
      return <div></div>
    }
    return <TextOverflowEllipsis title={moment(value).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())}>
      {moment(value).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())}
    </TextOverflowEllipsis>
  }, (p, n) => p.value === n.value),

  branchCount: React.memo(({ value, column, row }: Cell<any>) => {
    return (
      <Button variant='button' primary onClick={() => column?.['cellCallback'](row.original)} style={{ height: '20px', width: '20px', borderRadius: "2px" }}>
        {value}
      </Button>
    )
  }, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original)),





}

export default CONTRACT_LIST_VIEW_CELL_MAPPING