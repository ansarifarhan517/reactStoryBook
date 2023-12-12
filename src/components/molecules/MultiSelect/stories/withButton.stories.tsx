import React from 'react'
import MultiSelect from '../index'
import { path } from '../..'
import ThemeWrapper from '../../../../utilities/components/ThemeWrapper'

import {
  text,
  object,
  withKnobs,
  boolean,
  number,
  array
} from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import Button from '../../../atoms/Button'
import Position from '../../Position'
import FontIcon from '../../../atoms/FontIcon'
import { tMultiSelectChildren } from '../interfaces'

export default {
  title: `${path}/MultiSelect`,
  component: MultiSelect,
  decorators: [withKnobs],
  parameters: {
    props: {
      propTablesExclude: [Button, ThemeWrapper, Position, FontIcon]
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
  { value: 'silver', label: 'Silver', phoneNumber: '22222222', age: '40' }
]
const selectedOptions = [
  { value: 'ocean', label: 'Ocean', phoneNumber: '1234', age: '10' },
  { value: 'blue', label: 'Blue', phoneNumber: '455556', age: '12' },
  { value: 'purple', label: 'Purple', phoneNumber: '67778', age: '13' },
  { value: 'red', label: 'Red', phoneNumber: '89990', age: '14' },
  { value: 'forest', label: 'Forest', phoneNumber: '0000000', age: '20' },
  { value: 'slate', label: 'Slate', phoneNumber: '11111111', age: '30' }
]

export const withButton = () => (
  <ThemeWrapper>
    <Position type='relative'>
      <MultiSelect
        id={text('id', 'Colors')}
        width={text('width', '300px')}
        options={object('Multi Select Options', options)}
        onChange={action('Multi Select changed')}
        style={object('styles', {
          position: 'absolute',
          top: '0px',
          left: '145px'
        })}
        isLoading={boolean('isLoading', false)}
        isNoOption={boolean('isNoOption', false)}
        menuOpen={boolean('menuOpen', false)}
        selected={object('Selected', selectedOptions)}
        allowSelectAll={boolean('allowSelectAll', false)}
        maximumSelected={number('maximum Selected', 4)}
        searchableKeys={array('Searchable Keys', [
          'value',
          'label',
          'phoneNumber',
          'age'
        ])}
      >
        {({ optionSelected, isMenuOpen, openMenu }: tMultiSelectChildren) => (
          <>
            {openMenu}
            <Button
              id='id'
              variant='button'
              onClick={() => {
                console.log(optionSelected)
                openMenu(!isMenuOpen)
                action('MultiSelect opened/closed')(isMenuOpen)
              }}
            >
              <React.Fragment>
                <span>Open MultiSelect</span>
                <FontIcon variant='angle-right' size='sm' />
              </React.Fragment>
            </Button>
          </>
        )}
      </MultiSelect>
    </Position>
  </ThemeWrapper>
)
