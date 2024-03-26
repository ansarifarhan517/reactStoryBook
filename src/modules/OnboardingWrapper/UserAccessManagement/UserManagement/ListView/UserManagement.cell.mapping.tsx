
import React from 'react'
import { Toggle, Position } from 'ui-library'
import TextOverflowEllipsis from '../../../../../utils/components/TextOverflowEllipsis'

import { Cell } from 'react-table'

import { getFormattedDate } from '../../../../Order/OrderListOptionData/utils'
import { useTypedSelector } from '../../../../../utils/redux/rootReducer'

export const USER_LIST_CELLL_MAPPING = {
    
    userName: ({ value }: Cell<any>) => <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>,
    name: ({ value }: Cell<any>) => <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>,
    userGroupName: ({ value }: Cell<any>) => <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>,
    clientBranchName: ({ value }: Cell<any>) => <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>,
    clientName: ({ value }: Cell<any>) => <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>,
    mobileNumber: ({ value }: Cell<any>) => <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>,
    emailAddress: ({ value }: Cell<any>) => <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>,
    lastLoginTime: React.memo(({ value}: Cell<any>) => {
      const tz = useTypedSelector(state=>state.clientProperties?.TIMEZONE?.propertyValue);
      if (!value || value === undefined) {
        return <div></div>
      }
      return <TextOverflowEllipsis title={getFormattedDate(value,tz)}>{getFormattedDate(value,tz)}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    isActiveFl: React.memo(({ value, column, row }: Cell) => {
        const [active, setActive] = React.useState<boolean>(value)
        React.useEffect(() => {
            setActive(value)
        }, [value])

        return <Position type='absolute' top='0em' left='1em'>
            <Toggle
                checked={active}
                onChange={({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
                    setActive(checked)
                    column?.['cellCallback'](checked, row.original, setActive)
                }
                }
            />
        </Position>
    }, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original)),
    createdOnDt: React.memo(({ value}: Cell<any>) => {
      const tz = useTypedSelector(state=>state.clientProperties?.TIMEZONE?.propertyValue);
      if (!value || value === undefined) {
        return <div></div>
      }
      return <TextOverflowEllipsis title={getFormattedDate(value,tz)}>{getFormattedDate(value,tz)}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value)
}