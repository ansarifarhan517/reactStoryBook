import React from 'react'
import { path } from '..'
import RadioGroup from '.'
import {
  withKnobs,
  boolean,
  radios,
  number,
  text
} from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import Radio, { tRadioSize } from '../Radio'

import Card from '../Card'

export default {
  title: `${path}/RadioGroup`,
  decorators: [withKnobs],
  component: RadioGroup
}

const radioOptions = {
  size: { sm: 'sm', md: 'md', lg: 'lg' }
}

export const withDefault = () => (
  <ThemeWrapper>
    <Card>
      <RadioGroup
        id='defaultRadioGroup'
        orientation={boolean('orientation', false)}
        spacing={number('spacing', 10)}
        variant='default'
        width='400px'
        label='Gender'
        labelColor={text('Group Label Color', 'black')}
      >
        <Radio
          id='radio1'
          onChange={action('Radio 1 Changed')}
          disabled={boolean('disabled', false, 'Radio 1')}
          checked={boolean('checked', true, 'Radio 1')}
          name={text('name', 'gender', 'Radio 1')}
          value={text('value', 'Male', 'Radio 1')}
          label={text('label', 'Male', 'Radio 1')}
          radioSize={radios('size', radioOptions.size, 'sm') as tRadioSize}
          labelColor={text('Label Color', 'black')}
        />
        <Radio
          id='radio2'
          onChange={action('Radio 2 Changed')}
          disabled={boolean('disabled', false, 'Radio 2')}
          checked={boolean('checked', true, 'Radio 2')}
          name={text('name', 'gender', 'Radio 2')}
          value={text('value', 'Female', 'Radio 2')}
          label={text('label', 'Female', 'Radio 2')}
          radioSize={radios('size', radioOptions.size, 'sm') as tRadioSize}
          labelColor={text('Label Color', 'black')}
        />
        <Radio
          id='radio3'
          onChange={action('Radio 3 Changed')}
          disabled={boolean('disabled', false, 'Radio 3')}
          checked={boolean('checked', true, 'Radio 3')}
          name={text('name', 'gender', 'Radio 3')}
          value={text('value', 'Others', 'Radio 3')}
          label={text('label', 'Others', 'Radio 3')}
          radioSize={radios('size', radioOptions.size, 'sm') as tRadioSize}
          labelColor={text('Label Color', 'black')}
        />
      </RadioGroup>
    </Card>
  </ThemeWrapper>
)

export const withForm = () => (
  <ThemeWrapper>
    <Card>
      <RadioGroup
        id='RadioGroup2'
        orientation={boolean('orientation', false)}
        spacing={number('spacing', 10)}
        variant='form'
        label='Gender'
        width={text('width', '50%')}
        labelColor={text('Group Label Color', 'black')}
        error={boolean('error', false)}
        errorMessage={text('errorMessage', 'Some Field Error')}
        required={boolean('required', false)}
      >
        <Radio
          id='radio1'
          onChange={action('Radio 1 Changed')}
          disabled={boolean('disabled', false, 'Radio 1')}
          checked={boolean('checked', true, 'Radio 1')}
          name={text('name', 'gender', 'Radio 1')}
          value={text('value', 'Male', 'Radio 1')}
          label={text('label', 'Male', 'Radio 1')}
          radioSize={radios('size', radioOptions.size, 'sm') as tRadioSize}
          labelColor={text('Label Color', 'black')}
        />
        <Radio
          id='radio2'
          onChange={action('Radio 2 Changed')}
          disabled={boolean('disabled', false, 'Radio 2')}
          checked={boolean('checked', true, 'Radio 2')}
          name={text('name', 'gender', 'Radio 2')}
          value={text('value', 'Female', 'Radio 2')}
          label={text('label', 'Female', 'Radio 2')}
          radioSize={radios('size', radioOptions.size, 'sm') as tRadioSize}
          labelColor={text('Label Color', 'black')}
        />
        <Radio
          id='radio3'
          onChange={action('Radio 3 Changed')}
          disabled={boolean('disabled', false, 'Radio 3')}
          checked={boolean('checked', true, 'Radio 3')}
          name={text('name', 'gender', 'Radio 3')}
          value={text('value', 'Others', 'Radio 3')}
          label={text('label', 'Others', 'Radio 3')}
          radioSize={radios('size', radioOptions.size, 'sm') as tRadioSize}
          labelColor={text('Label Color', 'black')}
        />
      </RadioGroup>
    </Card>
  </ThemeWrapper>
)
