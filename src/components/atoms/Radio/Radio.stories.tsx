import React from 'react'
import { path } from '..'
import Radio, { tRadioSize } from '.'
import { action } from '@storybook/addon-actions'
import { withKnobs, radios, boolean, text } from '@storybook/addon-knobs'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'

export default {
  title: `${path}/Radio`,
  decorators: [withKnobs],
  component: Radio
}

const radioOptions = {
  size: { sm: 'sm', md: 'md', lg: 'lg' }
}

export const withPlayground = () => (
  <ThemeWrapper>
    <Radio
      id='radio1'
      onChange={action('Radio Male Changed')}
      disabled={boolean('disabled', false)}
      checked={boolean('checked', true)}
      name={text('name', 'gender')}
      value={text('value', 'Female')}
      label={text('label', 'Female')}
      radioSize={radios('size', radioOptions.size, 'sm') as tRadioSize}
      labelColor={text('Label Color', 'black')}
    />
  </ThemeWrapper>
)
