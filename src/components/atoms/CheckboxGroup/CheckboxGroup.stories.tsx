import React from 'react'
import { path } from '..'
import CheckboxGroup, { IOptionType } from '.'
import { action } from '@storybook/addon-actions'
import {
  withKnobs,
  object,
  boolean,
  radios,
  number
} from '@storybook/addon-knobs'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import { tCheckboxSize } from '../Checkbox'

export default {
  title: `${path}/CheckboxGroup`,
  decorators: [withKnobs],
  component: CheckboxGroup
}
const checkOptions = [
  { id: '01', value: 'Male', checked: true, disabled: true },
  { id: '286', value: 'Other', disabled: true },
  { id: '02', value: 'Female', checked: true, disabled: false },
  { id: '7b8' }
]
const checkboxOptions = {
  size: { sm: 'sm', md: 'md', lg: 'lg' }
}
export const withBasic = () => (
  <ThemeWrapper>
    <CheckboxGroup
      onChange={action('Checkbox Changed')}
      orientation={boolean('orientation', false)}
      spacing={number('spacing', 10)}
      checkboxSize={
        radios('checkboxSize', checkboxOptions.size, 'sm') as tCheckboxSize
      }
      checkOptions={object('checkOptions', checkOptions) as IOptionType[]}
    />
  </ThemeWrapper>
)
