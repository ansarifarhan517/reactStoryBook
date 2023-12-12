import { action } from '@storybook/addon-actions'
import { boolean, object, text } from '@storybook/addon-knobs'
import React from 'react'
import DropDown from '.'
import { path } from '..'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import Box from '../../atoms/Box'
import { tSelectVariant } from './interface'
// import { InputActionMeta } from 'react-select'
// import AsyncSelect from 'react-select/async'
import { OptionsType } from 'react-select'
import AsyncFormSelect from './AsyncFormSelect'

export default {
  title: `${path}/DropDown`,
  component: DropDown
}

const options = [
  {
    value: 'emailVerificationPending',
    label: 'Email Verification Pending Shipper',
    title: 'Email Verification Pending Shipper'
  },
  { value: 'allShippers', label: 'All Shippers', title: 'All Shippers' },
  {
    value: 'approvalPendingShippers',
    label: 'Approval Pending Shippers',
    title: 'Approval Pending Shippers'
  }
]

const ListViewOption = [
  { value: 'Available', label: 'Available', title: 'Available' },
  { value: 'Dispatched', label: 'Dispatched', title: 'Dispatched' },
  { value: 'Inactive', label: 'Inactive', title: 'Inactive' }
]

const FormSelectOption = [
  {
    value: 'Credit',
    label: 'Credit',
    title: 'Credit',
    description:
      'Credit transaction will add to the outstanding amount of (Delivery Associate)'
  },
  {
    value: 'Debit',
    label: 'Debit',
    title: 'Debit',
    description:
      'Credit transaction will deduct from the outstanding amount of (Delivery Associate)'
  }
]
export const DefaultSelect = () => {
  return (
    <ThemeWrapper>
      <Box p='6em' bgColor='grey.50'>
        <DropDown
          variant={text('variant', 'default-select') as tSelectVariant}
          optionList={object('optionList', options)}
          label={text('label', 'Name')}
          required={boolean('required', true)}
          loading={boolean('loading', true)}
          onChange={action('Value selected')}
          error={boolean('error', false)}
          errorMessage={text('errorMessage', 'Mandatory field')}
          placeholder={text('placeholder', 'Select')}
          value={text('value', 'chocolate')}
          width={text('width', '300px')}
          disabled={boolean('disabled', false)}
        />
      </Box>
    </ThemeWrapper>
  )
}

export const FormSelectPlayground = () => {
  return (
    <ThemeWrapper>
      <Box p='6em' bgColor='grey.50'>
        <DropDown
          variant={text('variant', 'form-select') as tSelectVariant}
          optionList={object('optionList', FormSelectOption)}
          label={text('label', 'Name')}
          required={boolean('required', true)}
          loading={boolean('loading', false)}
          onChange={action('Value selected')}
          error={boolean('error', false)}
          errorMessage={text('errorMessage', 'Mandatory field')}
          placeholder={text('placeholder', 'Select')}
          value={text('value', 'emailVerificationPending')}
          width={text('width', '300px')}
          onMenuOpen={action('Menu Open')}
          onMenuClose={action('Menu Close')}
          showDescription={boolean('Show Description', true)}
          tooltipMessage={text('tooltipMessage', 'i am form select tooltip')}
          disabled={boolean('disabled', false)}
        />
      </Box>
    </ThemeWrapper>
  )
}
export const FormSelectDeferred = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [menuIsOpen, setMenuIsOpen] = React.useState<boolean | undefined>(
    undefined
  )
  const [dropdownOptions, setDropdownOptions] = React.useState<
    { label: string; value: string }[]
  >([])

  const [selectedValue, setSelectedValue] = React.useState<string>()

  const handleMenuOpen = () => {
    action('Menu Opened!')()
    // setMenuIsOpen(true)
    if (dropdownOptions.length === 0) {
      setIsLoading(true)
      setTimeout(() => {
        setDropdownOptions(options)
        setIsLoading(false)
        setMenuIsOpen(true)
      }, 2000)
    }
  }

  const handleMenuClose = () => {
    action('Menu Closed!')()
    setMenuIsOpen(undefined)
  }

  const handleChange = (value?: string) => {
    action('Value selected')(value)
    setSelectedValue(value)
    setMenuIsOpen(undefined)
  }
  return (
    <ThemeWrapper>
      <Box py='3em' bgColor='grey.50'>
        <DropDown
          variant={text('variant', 'form-select') as tSelectVariant}
          optionList={dropdownOptions}
          label={text('label', 'Name')}
          required={boolean('required', true)}
          loading={isLoading}
          onChange={handleChange}
          error={boolean('error', false)}
          errorMessage={text('errorMessage', 'Mandatory field')}
          placeholder={text('placeholder', 'Select')}
          value={selectedValue}
          isMenuOpen={menuIsOpen}
          width={text('width', '300px')}
          onMenuOpen={handleMenuOpen}
          onMenuClose={handleMenuClose}
          onInputChange={action('onInputChange')}
          disabled={boolean('disabled', false)}
          limitOptionsList={50}
        />
      </Box>
    </ThemeWrapper>
  )
}

export const FormSelectAsync = () => {
  // const [menuIsOpen, setMenuIsOpen] = React.useState<boolean>()
  const [options] = React.useState<OptionsType<any>>([])
  const handleLoadOptions = React.useCallback(
    (inputValue: string, callback: (options: OptionsType<any>) => void) => {
      console.log(inputValue)
      if (inputValue.length >= 3) {
        const newOptions = [
          {
            label: inputValue + ' - Option 1',
            value: inputValue + '1',
            description: inputValue + ' - Option 1'
          },
          {
            label: inputValue + ' - Option 2',
            value: inputValue + '2',
            description: inputValue + ' - Option 2'
          }
        ]
        // setOptions(newOptions)
        callback(newOptions)
      } else {
        callback(options)
      }
    },
    []
  )

  return (
    <ThemeWrapper>
      <Box py='3em' bgColor='grey.50'>
        <div style={{ width: '350px' }}>
          <AsyncFormSelect
            loadOptions={handleLoadOptions}
            cacheOptions
            label={text('label', 'Postal Code')}
            required={boolean('required', false)}
            error={boolean('error', false)}
            errorMessage={text('errorMessage', 'Postal Code is required')}
            disabled={boolean('disabled', false)}
            showDescription={boolean('showDescription', false)}
          />
        </div>
      </Box>
    </ThemeWrapper>
  )
}

export const ListView = () => {
  return (
    <ThemeWrapper>
      <Box p='6em' bgColor='grey.50'>
        <DropDown
          variant={text('variant', 'list-view') as tSelectVariant}
          optionList={object('optionList', ListViewOption)}
          onChange={action('Value selected')}
          width={text('width', '120px')}
          disabled={boolean('disabled', false)}
          limitOptionsList={50}
        />
      </Box>
    </ThemeWrapper>
  )
}
export const EditedListView = () => {
  return (
    <ThemeWrapper>
      <Box p='6em' bgColor='grey.50'>
        <DropDown
          variant={text('variant', 'inline-edit') as tSelectVariant}
          optionList={object('optionList', ListViewOption)}
          onChange={action('Value selected')}
          width={text('width', '100%')}
          disabled={boolean('disabled', false)}
          limitOptionsList={50}
        />
      </Box>
    </ThemeWrapper>
  )
}
export const DashedDropdown = () => {
  return (
    <ThemeWrapper>
      <Box p='6em' bgColor='grey.50'>
        <DropDown
          variant={text('variant', 'dashed-dropdown') as tSelectVariant}
          optionList={object('optionList', ListViewOption)}
          onChange={action('Value selected')}
          width={text('width', '100%')}
          disabled={boolean('disabled', false)}
          value={text('value', '') as tSelectVariant}
        />
      </Box>
    </ThemeWrapper>
  )
}
