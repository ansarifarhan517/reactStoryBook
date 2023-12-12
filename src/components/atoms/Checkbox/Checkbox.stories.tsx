import React from 'react'
import { path } from '..'
import Checkbox, { tCheckboxSize } from '.'
import { action } from '@storybook/addon-actions'
import { withKnobs, radios, boolean, text } from '@storybook/addon-knobs'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'

export default {
  title: `${path}/Checkbox`,
  decorators: [withKnobs],
  component: Checkbox
}

const radioOptions = {
  size: { sm: 'sm', md: 'md', lg: 'lg' }
}

export const withPlayground = () => (
  <ThemeWrapper>
    <Checkbox
      id='myCheckbox'
      onChange={action('Checkbox Changed')}
      disabled={boolean('disabled', false)}
      checked={boolean('checked', false)}
      label={text('label', '')}
      checkboxSize={radios('size', radioOptions.size, 'sm') as tCheckboxSize}
      color={text('color', 'red')}
    />
  </ThemeWrapper>
)
