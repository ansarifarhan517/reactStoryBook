import { action } from '@storybook/addon-actions'
import { object, text, withKnobs } from '@storybook/addon-knobs'
import React from 'react'
import Breadcrumb from '.'
import { path } from '..'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import Box from '../../atoms/Box'
import { IBreadcrumbOptionsProps } from './interfaces'

export default {
  title: `${path}/Breadcrumb`,
  decorators: [withKnobs],
  component: Breadcrumb
}

const basicOptions = [
  {
    id: '001',
    label: 'Home'
  },
  {
    id: '002',
    label: 'Forms'
  },
  {
    id: '003',
    label: 'Customer'
  },
  {
    id: 'addCustomer',
    label: 'Add Customer',
    disabled: false,
    toolTipMessage: 'Add Customer Tooltip '
  }
]
const optionList = [
  {
    value: 'emailVerificationPending',
    label: 'Email Verification Pending Shipper',
    id: 'emailVerificationPending',
    isFavourite: true
  },
  { value: 'allShippers', label: 'All Shippers', id: 'allShippers' },
  {
    value: 'approvalPendingShippers',
    label: 'Approval Pending Shippers',
    id: 'approvalPendingShippers'
  },
  { value: 'addCustomer', label: 'Add Customer', id: 'addCustomer' }
]

const multiLevelOptionList = [
  {
    value: 'allOrders',
    label: 'All Orders',
    id: 'allOrders'
  },
  { 
    value: 'notDispatched', 
    label: 'Not Dispatched', 
    id: 'notDispatched', 
    options: [
      { 
        value: 'unAssigned', 
        label: 'UnAssigned', 
        id: 'unAssigned',
        parentLabel: 'Not Dispatched'
      },
      { 
        value: 'assigned', 
        label: 'Assigned', 
        id: 'assigned'
      }
    ] 
  },
  {
    value: 'inscanned',
    label: 'Inscanned',
    id: 'inscanned',
    options: [
      { 
        value: 'atOriginBranch', 
        label: 'At Origin Branch', 
        id: 'atOriginBranch'
      },
      { 
        value: 'atDestinationBranch', 
        label: 'At Destination Branch', 
        id: 'atDestinationBranch'
      },
      { 
        value: 'atInterimBranch', 
        label: 'At Interim Branch', 
        id: 'atInterimBranch'
      }
    ]
  },
  { value: 'deliverd', label: 'Deliverd', id: 'deliverd' },
  { value: 'pickdup', label: 'Picked Up', id: 'pickedup' },
  { value: 'outScanned', label: 'OutScanned', id: 'outScanned' },
  { value: 'addCustomer', label: 'Add Customer', id: 'addCustomer' }
]

export const withBasic = () => (
  <ThemeWrapper>
    <Box p='1em' bgColor='grey.50'>
      <Breadcrumb
        options={(basicOptions as unknown) as IBreadcrumbOptionsProps[]}
        onClick={(id) => {
          action('On Click: ')(id)
        }}
        optionList={object('optionList', optionList)}
        width={text('width', '260px')}
        onSetAsFavourite={(selectedOption) => {
          action('onSetAsFavourite :')(selectedOption)
        }}
      />
    </Box>
  </ThemeWrapper>
)
export const LinkVariant = () => (
  <ThemeWrapper>
    <Box p='1em' bgColor='grey.50'>
      <Breadcrumb
        options={(basicOptions as unknown) as IBreadcrumbOptionsProps[]}
        onClick={(id) => {
          action('On Click: ')(id)
        }}
      />
    </Box>
  </ThemeWrapper>
)
export const withMultiLevel = () => (
  <ThemeWrapper>
    <Box p='1em' bgColor='grey.50'>
      <Breadcrumb
        options={(basicOptions as unknown) as IBreadcrumbOptionsProps[]}
        onClick={(id) => {
          action('On Click: ')(id)
        }}
        optionList={object('optionList', multiLevelOptionList)}
        variant='multilevel'
      />
    </Box>
  </ThemeWrapper>
)
