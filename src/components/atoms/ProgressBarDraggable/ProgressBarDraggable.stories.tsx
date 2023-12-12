import React from 'react'

import { path } from '..'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'

import ProgressBarDraggableComponent, { ovalRadiusType, thicknessType } from '.'
import Position from '../../molecules/Position'
import { number, text } from '@storybook/addon-knobs'

export default {
  title: `${path}/ProgressBarDraggable`,
  component: ProgressBarDraggableComponent
}

export const ProgressBarDraggable = () => (
  <ThemeWrapper>
    <Position my='3em' p='3em' type='relative' border={1}>
      <ProgressBarDraggableComponent
        incompleteColor = {text('incompleteColor', '#e9edf0')}
        completedColor = {text('completedColor', '#5698d3')}
        completedPercent = {number('completedPercent', 45, { min: 1, max: 100 })}
        thickness = {number('thickness', 6, { min: 2, max: 10 }) as thicknessType}
        ovalRadius = {number('ovalRadius', 8, { min: 2, max: 15 }) as ovalRadiusType}
        notifySliderChange={()=>{}}
      />
    </Position>
  </ThemeWrapper>
)
