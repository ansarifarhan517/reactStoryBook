import React from 'react'
import ExpandableListView from './index'
import styled from 'styled-components'
import { path } from '..'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import { withKnobs, number, object } from '@storybook/addon-knobs'
// Add knobs to make this table interactive

export default {
  title: `${path}/ExpandableListView`,
  decorators: [withKnobs],
  component: ExpandableListView
}

const PayButton = styled.button`
  background: #5698d3;
  color: white;
  padding: 3px;
  border: 0;
`

const mockData = [
  {
    id: 1,
    first_name: 'Roi',
    date_of_birth: '1995-07-26',
  },
  {
    id: 2,
    first_name: 'Barnebas',
    date_of_birth: '1999-01-12',
  },
  {
    id: 3,
    first_name: 'Alphard',
    date_of_birth: '1972-10-03',
  },
  {
    id: 4,
    first_name: 'Dulcine',
    date_of_birth: '1976-02-04',
  },
  {
    id: 5,
    first_name: 'Odo',
    date_of_birth: '2004-01-10',
  },
]

const headerRow = [
  { 
    width: 20,
    Header: 'Id',
    accessor: 'id'
  },
  { 
    width: 75,
    Header: 'First Name',
    accessor: 'first_name',
  },
  { 
    width: 90,
    Header: 'Date of Birth',
    accessor: 'date_of_birth'
  },
  { 
    width: 30,
    Header: '',
    accessor: 'pay',
    Cell: () => <PayButton onClick={() => alert('Clicked pay')}>Pay</PayButton>
  }
]


export const DefaultExpandableTable = () => {
  return (
    <ThemeWrapper>
      <ExpandableListView
        initialRows={number('initialRows', 3)}
        tableData={object("tableData", mockData)}
        headers={object("headers", headerRow)}
      />
    </ThemeWrapper>
  )
}
