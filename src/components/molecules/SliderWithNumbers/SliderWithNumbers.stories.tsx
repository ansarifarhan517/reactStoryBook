import React from 'react'
import { path } from '..'
import SliderWithNumbers from '.'

import { withKnobs, number, boolean } from '@storybook/addon-knobs'

import ThemeWrapper from '../../../utilities/components/ThemeWrapper'

export default {
  title: `${path}/SliderWithNumbers`,
  decorators: [withKnobs],
  component: SliderWithNumbers
}

export const withPlayground = () => (
  <ThemeWrapper>
     <SliderWithNumbers  
      minRange={number('minRange', 5)} 
      maxRange={number('maxRange', 2500)}
      selectedRange={number('selectedRange', 1400)}
      resetOutOfBounds={boolean('resetOutOfBounds', true)}
      resetInterval={number('resetInterval', 2000)}
      />
  </ThemeWrapper>
)

