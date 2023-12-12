import { action } from '@storybook/addon-actions'
import {
  array,
  boolean,
  number,
  object,
  text,
  withKnobs
} from '@storybook/addon-knobs'
import React from 'react'
import IconDropdown from '.'
import { path } from '..'
import { Box } from '../../..'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import Button, { tIntent } from '../../atoms/Button'
import CardComponent from '../../atoms/Card'
import { tPlacement } from '../../../utilities/types'
import {
  IUniversalDropdownChildren,
  tSelectVariant
} from '../DropDown/interface'
import TextInput from '../TextInput'

export default {
  title: `${path}/IconDropdown`,
  decorators: [withKnobs],
  component: IconDropdown
}

const ListViewOption = [
  {
    value: 'available',
    label: 'Mark As Available',
    color: 'blue',
    tooltipText: 'Mark As Available',
    isDisabled: true
  },
  {
    value: 'unavailable',
    label: 'Mark As Unavailable',
    color: 'red',
    tooltipText: 'Mark As Unavailable'
  },
  {
    value: 'active',
    label: 'Mark As Active',
    color: 'purple',
    tooltipText: 'Mark As Active'
  },
  {
    value: 'inactive',
    label: 'Mark As Inactive',
    color: 'green',
    tooltipText: 'Mark As Inactive'
  }
]

const MultiLevelListViewOption = [
  {
    id: 'available',
    value: 'available',
    label: 'Mark As Available',
    color: 'blue',
    tooltipText: 'Mark As Available',
    options: [
      {
        id: 'available',
        value: 'available',
        label: 'Mark As Child Available',
        color: 'blue',
        tooltipText: 'Mark As Child Available'
      },
      {
        id: 'unavailable',
        value: 'unavailable',
        label: 'Mark As Child Unavailable',
        color: 'red',
        tooltipText: 'Mark As Child Unavailable'
      },
      {
        id: 'active',
        value: 'active',
        label: 'Mark As Child Active',
        color: 'purple',
        tooltipText: 'Mark As Child Active'
      },
      {
        id: 'inactive',
        value: 'inactive',
        label: 'Mark As Child Inactive',
        color: 'green',
        tooltipText: 'Mark As Child Inactive',
        options: [
          {
            id: 'available',
            value: 'available',
            label: 'Mark As Grand Child Available',
            color: 'blue',
            tooltipText: 'Mark As Grand Child Available'
          },
          {
            id: 'unavailable',
            value: 'unavailable',
            label: 'Mark As Grand Child Unavailable',
            color: 'red',
            tooltipText: 'Mark As Grand Child Unavailable'
          }
        ]
      }
    ]
  },
  {
    id: 'unavailable',
    value: 'unavailable',
    label: 'Mark As Unavailable',
    color: 'red',
    tooltipText: 'Mark As Unavailable'
  },
  {
    id: 'active',
    value: 'active',
    label: 'Mark As Active',
    color: 'purple',
    tooltipText: 'Mark As Active'
  },
  {
    id: 'inactive',
    value: 'inactive',
    label: 'Mark As Inactive',
    color: 'green',
    tooltipText: 'Mark As Inactive'
  }
]

const paginationOptions = [
  { value: '25', label: '25 per page', title: '25 per page' },
  { value: '50', label: '50 per page', title: '50 per page' },
  { value: '100', label: '100 per page', title: '100 per page' },
  { value: '200', label: '200 per page', title: '200 per page' }
]

const columnOption = [
  { value: 'ascending', label: 'Sort Ascending', iconVariant: 'hide-menu-box' },
  {
    value: 'descending',
    label: 'Sort Descending',
    iconVariant: 'hub-location'
  },
  { value: 'hideColumn', label: 'Hide Column', iconVariant: 'close' },
  { value: 'pinLeft', label: 'Pin Left', iconVariant: 'angle-left' },
  { value: 'pinright', label: 'Pin Right', iconVariant: 'angle-right-thin' }
]

const options = [
  {
    value: 'emailVerificationPending',
    label: 'Email Verification Pending Shipper'
  },
  { value: 'allShippers', label: 'All Shippers' },
  { value: 'approvalPendingShippers', label: 'Approval Pending Shippers' }
]

const datePickerOptions = [
  { value: 'January', label: 'January' },
  { value: 'February', label: 'February' },
  { value: 'March', label: 'March' },
  { value: 'April', label: 'April' },
  { value: 'May', label: 'May' },
  { value: 'June', label: 'June' },
  { value: 'July', label: 'July' },
  { value: 'August', label: 'August' },
  { value: 'September', label: 'September' },
  { value: 'October', label: 'October' },
  { value: 'November', label: 'November' },
  { value: 'December', label: 'December' }
]

// wherever we using isSingleClickOption and not saving selected option thier iconKey is neccessary
export const ButtonDropdown = () => (
  <ThemeWrapper>
    <Box p='2em' bgColor='grey.50'>
      <IconDropdown
        variant={text('varaint', 'button-dropdown') as tSelectVariant}
        optionList={object('optionList', ListViewOption)}
        width={text('width', '120px')}
        menuIsOpen={boolean('menuIsOpen', false)}
        iconButtonDetails={array('iconList', [
          'hide-menu-box',
          'More',
          'angle-down'
        ])}
        primary={boolean('primary', false)}
        intent={text('intent', 'page') as tIntent}
        onChange={action('Value Changed')}
        isSingleClickOption={boolean('isSingleClickOption', true)}
        disabled={boolean('disabled', false)}
        tooltipMessage={text('tooltipMessage', 'Mark Attendence as Absent.')}
        tooltipProps={{
          arrowPlacement: text('arrowPlacement', 'start') as tPlacement
        }}
      />
    </Box>
  </ThemeWrapper>
)

// wherever we using isSingleClickOption and not saving selected option thier iconKey is neccessary
export const TextDropdown = () => (
  <ThemeWrapper>
    <Box p='2em' bgColor='grey.50'>
      <IconDropdown
        variant={text('varaint', 'text-dropdown') as tSelectVariant}
        optionList={object('optionList', ListViewOption)}
        width={text('width', '120px')}
        menuIsOpen={boolean('menuIsOpen', false)}
        iconButtonDetails={array('iconList', [
          'hide-menu-box',
          'More',
          'angle-down'
        ])}
        primary={boolean('primary', false)}
        intent={text('intent', 'page') as tIntent}
        onChange={action('Value Changed')}
        isSingleClickOption={boolean('isSingleClickOption', true)}
        disabled={boolean('disabled', false)}
        tooltipMessage={text('tooltipMessage', 'Mark Attendence as Absent.')}
        tooltipProps={{
          arrowPlacement: text('arrowPlacement', 'start') as tPlacement
        }}
      />
    </Box>
  </ThemeWrapper>
)

export const MultiLevelBreadCrumb = () => {
  return (
    <ThemeWrapper>
      <Box p='2em' bgColor='grey.50'>
        <IconDropdown
          variant={text('variant', 'multilevel-breadcrumb') as tSelectVariant}
          optionList={object('optionList', MultiLevelListViewOption)}
          onChange={action('Value selected')}
          value={text('value', 'strawberry')}
          width={text('width', '260px')}
        />
      </Box>
    </ThemeWrapper>
  )
  }

export const MultiLevelButtonDropdown = () => (
  <ThemeWrapper>
    <Box p='2em' bgColor='grey.50'>
      <IconDropdown
        variant={
          text('varaint', 'multilevel-button-dropdown') as tSelectVariant
        }
        optionList={object('optionList', MultiLevelListViewOption)}
        width={text('width', '120px')}
        menuIsOpen
        iconButtonDetails={array('iconList', [
          'hide-menu-box',
          'More',
          'angle-down'
        ])}
        defaultOpen='right'
        primary={boolean('primary', false)}
        intent={text('intent', 'page') as tIntent}
        handleClick={(id: any) => console.log('clicked from storybook', id)}
        isSingleClickOption={boolean('isSingleClickOption', true)}
        disabled={boolean('disabled', false)}
        tooltipMessage={text('tooltipMessage', 'Mark Attendence as Absent.')}
        tooltipProps={{
          arrowPlacement: text('arrowPlacement', 'start') as tPlacement
        }}
      />
    </Box>
  </ThemeWrapper>
)

export const PaginationDropdown = () => (
  <ThemeWrapper>
    <CardComponent style={{ height: '300px' }}>
      <IconDropdown
        variant={text('variant', 'pagination-size') as tSelectVariant}
        optionList={object('optionList', paginationOptions)}
        onChange={action('Value selected')}
        value={text('value', '50')}
        width={text('width', '120px')}
      />
    </CardComponent>
  </ThemeWrapper>
)

export const columnOptionComponent = () => {
  return (
    <ThemeWrapper>
      <Box p='2em' bgColor='grey.50'>
        <div style={{ width: '200px', margin: 'auto' }}>
          <IconDropdown
            variant={text('variant', 'column-filter') as tSelectVariant}
            optionList={object('optionList', columnOption)}
            onChange={action('Value selected')}
            width={text('width', '10px')}
            isSingleClickOption={boolean('isSingleClickOption', true)}
          />
        </div>
      </Box>
    </ThemeWrapper>
  )
}

export const BreadCrumbComponent = () => {
  return (
    <ThemeWrapper>
      <Box p='2em' bgColor='grey.50'>
        <IconDropdown
          variant={text('variant', 'bread-crumb') as tSelectVariant}
          optionList={object('optionList', options)}
          onChange={action('Value selected')}
          value={text('value', 'strawberry')}
          width={text('width', '260px')}
        />
      </Box>
    </ThemeWrapper>
  )
}

export const DatePickerDropDown = () => (
  <ThemeWrapper>
    <CardComponent style={{ height: '200px' }}>
      <IconDropdown
        variant={text('variant', 'date-picker') as tSelectVariant}
        optionList={object('optionList', datePickerOptions)}
        onChange={action('Value selected')}
        value={text('value', '50')}
        width={text('width', '80px')}
        showDownArrow={boolean('Show Down Arrow', true)}
        isMultiRegionStyled={boolean('Is Multi Region Styled', false)}
      />
    </CardComponent>
  </ThemeWrapper>
)
const arrayMap = [
  { variant: 'column-filter', name: 'column-filter0' },
  { variant: 'column-filter', name: 'column-filter1' },
  { variant: 'column-filter', name: 'column-filter2' }
]

export const columnOptionList = () => {
  return (
    <ThemeWrapper>
      <Box p='2em' bgColor='grey.50'>
        <div style={{ width: '200px', margin: 'auto' }}>
          {arrayMap.map((obj: any, index: number) => {
            return (
              <IconDropdown
                variant={text('variant', obj?.variant) as tSelectVariant}
                optionList={object('optionList', columnOption)}
                onChange={action('Value selected')}
                width={text('width', '10px')}
                isSingleClickOption={boolean('isSingleClickOption', true)}
                key={index}
              />
            )
          })}
        </div>
      </Box>
    </ThemeWrapper>
  )
}

export const DropdownUniversal = () => {
  // reference to style
  // const theme = useContext(ThemeContext)
  // const borderBottom = `1px solid ${theme?.colors?.grey['A800']}`
  // const customStyle = {
  //   control: (provided: any) => ({
  //     ...provided,
  //     borderStyle: 'none',
  //     borderBottom,
  //     borderRadius: '0px',
  //     boxShadow: 'none',
  //     borderColor: theme?.colors?.grey?.A800,
  //     '&:focus': {
  //       borderStyle: 'none',
  //       borderBottom,
  //       boxShadow: 'none',
  //       borderColor: theme?.colors?.grey?.A800
  //     },
  //     '&:hover': {
  //       borderStyle: 'none',
  //       borderBottom,
  //       boxShadow: 'none',
  //       borderColor: theme?.colors?.grey?.A800
  //     }
  //   }),
  //   option: (provided: any, state: any) => ({
  //     ...provided,
  //     backgroundColor: state?.isSelected
  //       ? theme?.colors?.primary?.main
  //       : theme?.colors?.white,
  //     '&:hover': {
  //       backgroundColor: state?.isSelected
  //         ? theme?.colors?.primary?.main
  //         : theme?.colors?.grey['50']
  //     }
  //   }),

  //   menu: (provided: any, state: any) => ({
  //     ...provided,
  //     backgroundColor: state?.isSelected
  //       ? theme.colors.primary.main
  //       : theme?.colors?.white,
  //     borderRadius: '2px',
  //     '&:hover': {
  //       backgroundColor: state?.isSelected
  //         ? theme?.colors?.primary?.main
  //         : theme?.colors?.white
  //     },
  //     marginTop: '5px',
  //     marginLeft: '16px',
  //     width: '90%'
  //   }),
  //   menuList: (provided: any) => ({
  //     ...provided,
  //     marginTop: '0px'
  //   }),
  //   valueContainer: (provided: any) => ({
  //     ...provided,
  //     padding: '0px'
  //   })
  // }
  return (
    <ThemeWrapper>
      <Box p='2em' bgColor='grey.50'>
        <IconDropdown
          variant={text('varaint', 'default-dropdown') as tSelectVariant}
          optionList={object('optionList', ListViewOption)}
          width={text('width', '120px')}
          menuIsOpen={boolean('menuIsOpen', false)}
          primary={boolean('primary', false)}
          intent={text('intent', 'page') as tIntent}
          onChange={action('Value Changed')}
          isSingleClickOption={boolean('isSingleClickOption', true)}
          disabled={boolean('disabled', false)}
          value='available'
          optionComponent={({ selectedOption }: any) => {
            return (
              <div>
                <div>{selectedOption?.color}</div>
                <div>{selectedOption?.label}</div>
              </div>
            )
          }}
          // customStyle={customStyle}
        >
          {({
            selectedOption,
            menuIsOpen,
            setMenuIsOpen
          }: IUniversalDropdownChildren) => {
            return (
              <Button
                onClick={() => {
                  setMenuIsOpen(!menuIsOpen)
                  action('Universal open/closed')(menuIsOpen)
                }}
                color={text('color', 'white')}
                bgColor={text('bgColor', 'black')}
                fullWidth={boolean('fullWidth', false)}
              >
                {selectedOption?.label}
              </Button>
            )
          }}
        </IconDropdown>
      </Box>
    </ThemeWrapper>
  )
}

export const TextFieldDropdown = () => {
  return (
    <ThemeWrapper>
      <Box p='2em' bgColor='grey.50'>
        <IconDropdown
          variant={text('varaint', 'default-dropdown') as tSelectVariant}
          optionList={object('optionList', ListViewOption)}
          width={text('width', '120px')}
          menuIsOpen={boolean('menuIsOpen', false)}
          primary={boolean('primary', false)}
          intent={text('intent', 'page') as tIntent}
          onChange={action('Value Changed')}
          isSingleClickOption={boolean('isSingleClickOption', true)}
          disabled={boolean('disabled', false)}
          value='available'
          optionComponent={({ selectedOption }: any) => {
            return (
              <div>
                <div>{selectedOption?.color}</div>
                <div>{selectedOption?.label}</div>
              </div>
            )
          }}
          // customStyle={customStyle}
        >
          {({
            selectedOption,
            menuIsOpen,
            setMenuIsOpen
          }: IUniversalDropdownChildren) => {
            return (
              <TextInput
                id='someId'
                name='someName'
                className='someClassName'
                label={text('label', 'Username')}
                labelColor={text('labelColor', 'text.inputLabel.default')}
                placeholder={text('placeholder', 'Enter text here...')}
                maxLength={number('maxLength', 10)}
                error={boolean('error', false)}
                errorMessage={text('errorMessage', '')}
                required={boolean('required', false)}
                fullWidth={boolean('fullWidth', false)}
                onChange={action('Triggered: onChange')}
                onClick={() => {
                  setMenuIsOpen(!menuIsOpen)
                  action('universal open/closed')(menuIsOpen)
                }}
                value={selectedOption?.value}
              />
            )
          }}
        </IconDropdown>
      </Box>
    </ThemeWrapper>
  )
}
