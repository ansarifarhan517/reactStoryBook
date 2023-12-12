import React from 'react'
import { path } from '..'
import CardComponent from '.'
import { withKnobs } from '@storybook/addon-knobs'

import ThemeWrapper from '../../../utilities/components/ThemeWrapper'

export default {
  title: `${path}/Card`,
  decorators: [withKnobs],
  component: CardComponent
}

export const Card = () => (
  <ThemeWrapper>
    <CardComponent>This is a Card Component</CardComponent>
  </ThemeWrapper>
)
