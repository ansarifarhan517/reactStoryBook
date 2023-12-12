import React from 'react'

import {
  radios,
  withKnobs,
  boolean,
  text,
  number
} from '@storybook/addon-knobs'

import { path } from '..'
import Tooltip, { tDirection } from '.'
import Button from '../../atoms/Button'
import Box from '../../atoms/Box'

import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import { tPlacement } from '../../../utilities/types'

export default {
  title: `${path}/Tooltip`,
  decorators: [withKnobs],
  component: Tooltip,
  parameters: {
    props: {
      propTablesExclude: [Box, Button, ThemeWrapper]
    }
  }
}

const radioOptions = {
  tooltipDirection: {
    top: 'top',
    bottom: 'bottom',
    right: 'right',
    left: 'left'
  },
  arrowPlacement: { start: 'start', center: 'center', end: 'end' },
  messagePlacement: { start: 'start', center: 'center', end: 'end' }
}

export const TooltipPlayground = () => (
  <ThemeWrapper>
    <Box p='3em' bgColor='grey.50' display='flex' justifyContent='center'>
      <Tooltip
        message={text(
          'message',
          'Customize your view by adding/removing columns. For the best view, a display of 8 columns is recommended.'
        )}
        tooltipDirection={
          radios(
            'tooltipDirection',
            radioOptions.tooltipDirection,
            'top'
          ) as tDirection
        }
        arrowPlacement={
          radios(
            'arrowPlacement',
            radioOptions.arrowPlacement,
            'center'
          ) as tPlacement
        }
        messagePlacement={
          radios(
            'messagePlacement',
            radioOptions.messagePlacement,
            'center'
          ) as tPlacement
        }
        hover={boolean('hover', false)}
        isWordWrap={boolean('Word Wrap', false)}
        maxWidth={number('maxWidth', 400)}
        color={{
          border: text('color.border', 'primary.dark'),
          arrow: text('color.arrow', 'primary.main'),
          background: text('color.background', 'primary.main'),
          text: text('color.text', 'primary.contrastText')
        }}
      >
        <Button>Hover Me!</Button>
      </Tooltip>
    </Box>
  </ThemeWrapper>
)
