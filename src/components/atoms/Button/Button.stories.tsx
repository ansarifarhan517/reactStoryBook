import React from 'react'
import { action } from '@storybook/addon-actions'
import Button, { tVariant, tIntent } from '.'
import Box from '../Box'

import { withKnobs, text, boolean, radios } from '@storybook/addon-knobs'
import { path } from '..'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'

export default {
  title: `${path}/Buttons`,
  decorators: [withKnobs],
  component: Button
}

const radioOptions = {
  variant: { button: 'button', link: 'link' },
  intent: { default: 'default', page: 'page', table: 'table' }
}

export const Playground = () => (
  <ThemeWrapper>
    <Button
      onClick={action('clicked')}
      primary={boolean('primary', false)}
      variant={radios('variant', radioOptions.variant, 'button') as tVariant}
      intent={radios('intent', radioOptions.intent, 'default') as tIntent}
      disabled={boolean('disabled', false)}
    >
      {text('children', 'Default')}
    </Button>
  </ThemeWrapper>
)

export const LoginButton = () => (
  <ThemeWrapper>
    <Box p='1em' bgColor='grey.50'>
      <Button
        onClick={action('clicked')}
        color={text('color', 'white')}
        bgColor={text('bgColor', 'black')}
        fullWidth={boolean('fullWidth', false)}
      >
        Login
      </Button>
    </Box>
  </ThemeWrapper>
)
