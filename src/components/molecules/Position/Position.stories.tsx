import React from 'react'

import { path } from '..'
import Position from '.'

import Typography from '../../atoms/Typography'
import { withKnobs, text } from '@storybook/addon-knobs'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'

export default {
  title: `${path}/Position`,
  decorators: [withKnobs],
  component: Position
}

export const Playground = () => (
  <ThemeWrapper>
    <Position
      type='relative'
      bgColor='grey.50'
      mx='auto'
      p='1em'
      style={{ width: 'auto', height: '200px' }}
      top={text('Outer Box - top: ', '')}
      bottom={text('Outer Box - bottom: ', '')}
      left={text('Outer Box - left: ', '')}
      right={text('Outer Box - right: ', '')}
    >
      <Typography>This is Relative Box</Typography>
      <Position
        type='absolute'
        bgColor='grey.200'
        p='1.5em'
        top={text('Inner Box - top: ', '')}
        bottom={text('Inner Box - bottom: ', '1em')}
        left={text('Inner Box - left: ', '')}
        right={text('Inner Box - right: ', '')}
      >
        <Typography>This is Absolute Box</Typography>
      </Position>
    </Position>
  </ThemeWrapper>
)
