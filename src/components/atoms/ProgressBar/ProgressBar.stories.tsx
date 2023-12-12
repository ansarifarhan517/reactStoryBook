import React from 'react'

import { path } from '..'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'

import ProgressBarComponent, { thicknessType } from '.'
import Position from '../../molecules/Position'
import { number, text } from '@storybook/addon-knobs'

export default {
  title: `${path}/ProgressBar`,
  component: ProgressBarComponent
}

export const ProgressBar = () => (
  <ThemeWrapper>
    <Position my='3em' p='3em' type='relative' border={1}>
      <ProgressBarComponent
        incompleteColor = {text('incompleteColor', '#e9edf0')}
        completedColor = {text('completedColor', '#5698d3')}
        labelText = {text('labelText', '1600/2500 both squares')}
        completedPercent = {number('completedPercent', 45, { min: 1, max: 100 })}
        thickness = {number('thickness', 6, { min: 2, max: 10 }) as thicknessType}
      />
    </Position>
  </ThemeWrapper>
)
