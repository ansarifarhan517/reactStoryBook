import React from 'react'
import { withKnobs, boolean } from '@storybook/addon-knobs'

import InputLabel from '.'
import { path } from '..'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'

export default {
  title: `${path}/InputLabel`,
  decorators: [withKnobs],
  component: InputLabel
}

export const FieldLabel = () => (
  <ThemeWrapper>
    <InputLabel required={boolean('required', false)}>Order ID</InputLabel>
  </ThemeWrapper>
)
export const LoginFieldLabel = () => (
  <ThemeWrapper>
    <InputLabel
      required={boolean('required', false)}
      color='text.inputLabel.grey'
    >
      Username/Email Address
    </InputLabel>
  </ThemeWrapper>
)
