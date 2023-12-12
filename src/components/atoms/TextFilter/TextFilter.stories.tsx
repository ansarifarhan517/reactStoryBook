import React from 'react'
import { path } from '..'
import TextFilter from '.'
import { withKnobs, text } from '@storybook/addon-knobs'

import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import { action } from '@storybook/addon-actions'
import Box from '../Box'

export default {
  title: `${path}/TextFilter`,
  decorators: [withKnobs],
  component: TextFilter
}

export const TextFilterComponent = () => (
  <ThemeWrapper>
    <Box mx='auto' p='1em' bgColor='grey.50'>
      <TextFilter
        onEnter={action('search value entered')}
        width={text('width', '300px')}
      />
    </Box>
  </ThemeWrapper>
)
