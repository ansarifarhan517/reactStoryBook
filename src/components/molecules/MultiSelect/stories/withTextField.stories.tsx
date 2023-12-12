import React from 'react'
import MultiSelect from '../index'
import Box from '../../../atoms/Box'
import { path } from '../..'
import ThemeWrapper from '../../../../utilities/components/ThemeWrapper'

import {
  boolean,
  text,
  object,
  withKnobs,
  number,
  array
} from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import TextInput from '../../TextInput'
import { tMultiSelectChildren } from '../interfaces'

export default {
  title: `${path}/MultiSelect`,
  component: MultiSelect,
  decorators: [withKnobs],
  parameters: {
    props: {
      propTablesExclude: [Box, ThemeWrapper, TextInput]
    }
  }
}

const options = [
  { value: 'ocean', label: 'Ocean', phoneNumber: '1234', age: '10' },
  { value: 'blue', label: 'Blue', phoneNumber: '455556', age: '12' },
  { value: 'purple', label: 'Purple', phoneNumber: '67778', age: '13' },
  { value: 'red', label: 'Red', phoneNumber: '89990', age: '14' },
  { value: 'orange', label: 'Orange', phoneNumber: '001323', age: '15' },
  { value: 'yellow', label: 'Yellow', phoneNumber: '99243452', age: '16' },
  { value: 'green', label: 'Green', phoneNumber: '120009', age: '18' },
  { value: 'forest', label: 'Forest', phoneNumber: '0000000', age: '20' },
  { value: 'slate', label: 'Slate', phoneNumber: '11111111', age: '30' },
  { value: 'silver', label: 'Silver', phoneNumber: '22222222', age: '40' },
  { value: 'green1', label: 'Green1', phoneNumber: '120009', age: '18' },
  { value: 'forest1', label: 'Forest1', phoneNumber: '0000000', age: '20' },
  { value: 'slate1', label: 'Slate1', phoneNumber: '11111111', age: '30' },
  { value: 'silver1', label: 'Silver1', phoneNumber: '22222222', age: '40' }
]
const selectedOptions = [
  { value: 'ocean', label: 'Ocean', phoneNumber: '1234', age: '10' },
  { value: 'blue', label: 'Blue', phoneNumber: '455556', age: '12' },
  { value: 'purple', label: 'Purple', phoneNumber: '67778', age: '13' },
  { value: 'red', label: 'Red', phoneNumber: '89990', age: '14' },
  { value: 'forest', label: 'Forest', phoneNumber: '0000000', age: '20' }
  // { value: 'slate', label: 'Slate', phoneNumber: '11111111', age: '30' }
]

export const withTextField = () => (
  <ThemeWrapper>
    <Box p='1em'>
      <MultiSelect
        id={text('id', 'Colors')}
        width={text('width', '300px')}
        options={object('Multi Select Options', options)}
        onChange={action('Multi Select changed')}
        style={object('styles', {
          position: 'absolute',
          top: 'auto',
          left: 'auto',
          marginTop: '-18px'
        })}
        isLoading={boolean('isLoading', false)}
        isNoOption={boolean('isNoOption', false)}
        menuOpen={boolean('menuOpen', false)}
        selected={object('selected', selectedOptions)}
        allowSelectAll={boolean('allowSelectAll', false)}
        maximumSelected={number('maximum Selected', 5)}
        defaultSelected={object('default Selected', selectedOptions)}
        searchableKeys={array('Searchable Keys', ['label', 'phoneNumber'])}
        resultLimit={number('resultLimit', 10)}
        onInputChange={action('on Input changed')}
      >
        {({ optionSelected, isMenuOpen, openMenu }: tMultiSelectChildren) => (
          <TextInput
            id='id'
            label='Color'
            labelColor='black'
            placeholder='Select ... '
            error={boolean('Text Input error', false)}
            errorMessage={text('error Message', 'Its an error Message')}
            disabled={boolean('disabled', false)}
            onClick={() => {
              openMenu(!isMenuOpen)
              action('MultiSelect open/closed')(isMenuOpen)
            }}
            value={
              optionSelected && optionSelected?.length > 0
                ? optionSelected?.length + ' Selected'
                : ''
            }
            read-only
          />
        )}
      </MultiSelect>
    </Box>
  </ThemeWrapper>
)
