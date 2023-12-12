import React from 'react'
import { withKnobs, object, text } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import ButtonGroup from '.'

import Box from '../../atoms/Box'

import { path } from '..'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'

export default {
  title: `${path}/ButtonGroup`,
  decorators: [withKnobs],
  component: ButtonGroup
}

const options = [
  { id: 'year', label: 'Year', selected: true },
  { id: 'month', label: 'Month' }
]

export const ButtonGroupComponent = () => (
  <ThemeWrapper>
    <Box p='1em' bgColor='grey.50'>
      <ButtonGroup
        data={object('options', options)}
        onChange={action('onChange')}
      />
    </Box>
  </ThemeWrapper>
)

const optionsWithTooltip = [
  { id: 'year', label: 'Year', selected: true, tooltipText: 'year' },
  { id: 'month', label: 'Month', tooltipText: 'month' }
]

export const ButtonGroupWithTooltipComponent = () => (
  <ThemeWrapper>
    <Box p='1em' bgColor='white'>
      <ButtonGroup
        data={object('options', optionsWithTooltip)}
        onChange={action('onChange')}
        height={text('height', '40px')}
      />
    </Box>
  </ThemeWrapper>
)
