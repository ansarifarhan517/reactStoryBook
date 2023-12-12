import React from 'react'
import { boolean, text, withKnobs } from '@storybook/addon-knobs'

import { path } from '..'

import Box from '../../atoms/Box'

import ErrorTooltipComponent from '.'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'

export default {
  title: `${path}/ErrorTooltip`,
  decorators: [withKnobs],
  component: ErrorTooltipComponent
}

export const ErrorTooltip = () => (
  <ThemeWrapper>
    <Box
      display='flex'
      p='3em'
      my='3em'
      justifyContent='center'
      bgColor='grey.50'
    >
      <ErrorTooltipComponent
        message={text('message', 'This field is required.')}
        isWordWrap={boolean('wordWrap', true)}
      />
    </Box>
  </ThemeWrapper>
)
