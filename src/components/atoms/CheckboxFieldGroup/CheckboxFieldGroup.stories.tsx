import React from 'react'
import { path } from '..'
import CheckboxFieldGroup from '.'
import {
  withKnobs,
  boolean,
  radios,
  number,
  text
} from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import Checkbox, { tCheckboxSize } from '../Checkbox'

import Card from '../Card'

export default {
  title: `${path}/CheckboxFieldGroup`,
  decorators: [withKnobs],
  component: CheckboxFieldGroup
}

const radioOptions = {
  size: { sm: 'sm', md: 'md', lg: 'lg' }
}

export const withDefault = () => (
  <ThemeWrapper>
    <Card>
      <CheckboxFieldGroup
        id='defaultCheckboxFieldGroup'
        orientation={boolean('orientation', false)}
        spacing={number('spacing', 10)}
        variant='default'
        width='400px'
        label='Gender'
        labelColor={text('Group Label Color', 'black')}
      >
        <Checkbox
          id='checkbox1'
          onChange={action('CheckboxField 1 Changed')}
          disabled={boolean('disabled', false, 'CheckboxField 1')}
          checked={boolean('checked', true, 'CheckboxField 1')}
          name={text('name', 'gender', 'CheckboxField 1')}
          value={text('value', 'Male', 'CheckboxField 1')}
          label={text('label', 'Male', 'CheckboxField 1')}
          checkboxSize={
            radios('size', radioOptions.size, 'sm') as tCheckboxSize
          }
          labelColor={text('Label Color', 'black')}
        />
        <Checkbox
          id='checkbox2'
          onChange={action('CheckboxField 2 Changed')}
          disabled={boolean('disabled', false, 'CheckboxField 2')}
          checked={boolean('checked', true, 'CheckboxField 2')}
          name={text('name', 'gender', 'CheckboxField 2')}
          value={text('value', 'Female', 'CheckboxField 2')}
          label={text('label', 'Female', 'CheckboxField 2')}
          checkboxSize={
            radios('size', radioOptions.size, 'sm') as tCheckboxSize
          }
          labelColor={text('Label Color', 'black')}
        />
        <Checkbox
          id='checkbox3'
          onChange={action('CheckboxField 3 Changed')}
          disabled={boolean('disabled', false, 'CheckboxField 3')}
          checked={boolean('checked', true, 'CheckboxField 3')}
          name={text('name', 'gender', 'CheckboxField 3')}
          value={text('value', 'Others', 'CheckboxField 3')}
          label={text('label', 'Others', 'CheckboxField 3')}
          checkboxSize={
            radios('size', radioOptions.size, 'sm') as tCheckboxSize
          }
          labelColor={text('Label Color', 'black')}
        />
      </CheckboxFieldGroup>
    </Card>
  </ThemeWrapper>
)

export const withForm = () => (
  <ThemeWrapper>
    <Card>
      <CheckboxFieldGroup
        id='CheckboxFieldGroup2'
        orientation={boolean('orientation', false)}
        spacing={number('spacing', 10)}
        variant='form'
        label='Gender'
        width={text('width', '50%')}
        labelColor={text('Group Label Color', 'black')}
        error={boolean('error', true)}
        errorMessage={text('errorMessage', 'Some Field Error')}
        required={boolean('required', false)}
      >
        <Checkbox
          id='checkbox1'
          onChange={action('CheckboxField 1 Changed')}
          disabled={boolean('disabled', false, 'CheckboxField 1')}
          checked={boolean('checked', true, 'CheckboxField 1')}
          name={text('name', 'gender', 'CheckboxField 1')}
          value={text('value', 'Male', 'CheckboxField 1')}
          label={text('label', 'Male', 'CheckboxField 1')}
          checkboxSize={
            radios('size', radioOptions.size, 'sm') as tCheckboxSize
          }
          labelColor={text('Label Color', 'black')}
        />
        <Checkbox
          id='checkbox2'
          onChange={action('CheckboxField 2 Changed')}
          disabled={boolean('disabled', false, 'CheckboxField 2')}
          checked={boolean('checked', true, 'CheckboxField 2')}
          name={text('name', 'gender', 'CheckboxField 2')}
          value={text('value', 'Female', 'CheckboxField 2')}
          label={text('label', 'Female', 'CheckboxField 2')}
          checkboxSize={
            radios('size', radioOptions.size, 'sm') as tCheckboxSize
          }
        />
        <Checkbox
          id='checkbox3'
          onChange={action('CheckboxField 3 Changed')}
          disabled={boolean('disabled', false, 'CheckboxField 3')}
          checked={boolean('checked', true, 'CheckboxField 3')}
          name={text('name', 'gender', 'CheckboxField 3')}
          value={text('value', 'Others', 'CheckboxField 3')}
          label={text('label', 'Others', 'CheckboxField 3')}
          checkboxSize={
            radios('size', radioOptions.size, 'sm') as tCheckboxSize
          }
          labelColor={text('Label Color', 'black')}
        />
      </CheckboxFieldGroup>
    </Card>
  </ThemeWrapper>
)
