import React from 'react'
import Toggle from '.'
import Box from '../../atoms/Box'
import { path } from '..'
import { text, boolean } from '@storybook/addon-knobs'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import { action } from '@storybook/addon-actions'

export default {
  title: `${path}/Toggle`,
  component: Toggle
}

export const withBasic = () => (
  <ThemeWrapper>
    <Box p='1em'>
      <Toggle
        id='137'
        label={text('Label', 'Switch 1')}
        labelColor={text('Label Color', 'black')}
        checked={boolean('checked', false)}
        onChange={action('Value changed')}
        disabled={boolean('disabled', false)}
      />
    </Box>
  </ThemeWrapper>
)
