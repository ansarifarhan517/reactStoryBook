import React from 'react';
import { Toggle, Position } from 'ui-library';
import TextOverflowEllipsis from '../../../../../utils/components/TextOverflowEllipsis'
import { Cell } from 'react-table'
import { StyledSquare } from './OrganizationRole.Styled';
import { internalPersonEnum } from '../../UserManagement.utilis';

export const ORGANIZATION_ROLE_CELL_MAPPING = {
  default: React.memo(({ value }: Cell<any>) => {
    return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
  }, (p, n) => p.value === n.value),

  persona: React.memo(({ value }: Cell<any>) => {
    if (!value || value === undefined) {
      return <TextOverflowEllipsis></TextOverflowEllipsis>
    }
    value = internalPersonEnum[value] ? internalPersonEnum[value] : value
    const val = value.replace(
      /\w\S*/g,
      function (txt: string) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      })
    return <TextOverflowEllipsis title={val}>{val}</TextOverflowEllipsis>
  }, (p, n) => p.value === n.value),

  orgRoleLandingPage: React.memo(({ row }: Cell<any>) => {
    let orgRoleLandingPage = row.original.orgRoleLandingPage
    switch (row.original.orgRoleLandingPage) {
      case 'trip':
        orgRoleLandingPage = 'Trip List View';
        break;
      case 'live':
        orgRoleLandingPage = 'Live Dashboard';
        break;
      case 'order':
        orgRoleLandingPage = 'Orders List View';
        break;
      case 'home/mile':
        orgRoleLandingPage = 'Control Tower Dashboard';
        break;
      case 'admindashboard':
        orgRoleLandingPage = 'Dashboard';
        break;
      case 'userManagement':
        orgRoleLandingPage = 'Users List View';
        break;
      default: break;
    }
    return <TextOverflowEllipsis title={orgRoleLandingPage}>{orgRoleLandingPage}</TextOverflowEllipsis>
  }, (p, n) => p.value === n.value),

  attachedUserCount: React.memo(({ value, row, column }: Cell<any>) => {
    return <>
      <StyledSquare
        disabled={value === 0 || !value}
        onClick={() => {
          column?.['cellCallback'](value, row.original)
        }}
      >
        {value || 0}
      </StyledSquare>
    </>
  }, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original)),

  activeFl: React.memo(({ value, column, row }: Cell) => {
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

  attachedAccessProfileCount: React.memo(({ value, row, column }: Cell<any>) => {
    return <>
      <StyledSquare
        disabled={value === 0 || !value}
        onClick={() => {
          column?.['cellCallback'](value, row.original)
        }}
      >
        {value || 0}
      </StyledSquare>
    </>
  }, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original)),

  defaultAccess: React.memo(({ value, column, row }: Cell) => {
    const [fav, setFav] = React.useState<boolean>(value)
    React.useEffect(() => {
      setFav(value)
    }, [value])

    return <Position type='absolute' top='0em' left='1em'>
      <Toggle
        checked={fav}
        onChange={({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
          setFav(checked)
          column?.['cellCallback'](checked, row.original, setFav)
        }
        }
      />
    </Position>
  }, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original)),


}
