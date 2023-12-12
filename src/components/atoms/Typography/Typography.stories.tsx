import React from 'react'
import { path } from '..'
import Typography from '.'
import {
  withKnobs,
  radios,
  text,
  boolean,
  number
} from '@storybook/addon-knobs'

import ThemeWrapper from '../../../utilities/components/ThemeWrapper'

export default {
  title: `${path}/Typography`,
  decorators: [withKnobs],
  component: Typography
}

export const Playground = () => (
  <ThemeWrapper>
    <Typography
      fontSize={text('fontSize', '1em')}
      fontFamily={text('fontFamily', 'Gotham-Rounded,Sans-Serif')}
      primary={boolean('primary', false)}
      bold={boolean('bold', false)}
      italic={boolean('italic', false)}
      underline={boolean('underline', false)}
      align={radios(
        'align',
        { left: 'left', center: 'center', right: 'right' },
        'left'
      )}
      fontWeight={number('fontWeight', 400)}
      lineHeight={text('lineHeight', '')}
      color={text('color', 'black')}
    >
      This is an amazing Text component.
    </Typography>
  </ThemeWrapper>
)
