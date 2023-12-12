import React from 'react'
import FontIcon, { tFontIconSize } from '.'

import { withKnobs, text, radios, number } from '@storybook/addon-knobs'
import { path } from '..'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'

export default {
  title: `${path}/FontIcon`,
  decorators: [withKnobs],
  component: FontIcon
}

const radioOptions = {
  size: { xs: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' }
}

export const withPlayground = () => (
  <ThemeWrapper>
    <FontIcon
      variant={text('Font Icon Name', 'add')}
      color={text('Colors', 'primary.main')}
      size={radios('size', radioOptions.size, 'xl') as tFontIconSize}
    />
  </ThemeWrapper>
)
export const withCustomSize = () => (
  <ThemeWrapper>
    <FontIcon
      variant={text('Font Icon Name', 'add')}
      color={text('Colors', 'primary.main')}
      size={number('Size', 11)}
    />
  </ThemeWrapper>
)
