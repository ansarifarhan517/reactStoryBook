import React from 'react'
import { path } from '..'
import InputField from '.'
import Box from '../Box'
import { action } from '@storybook/addon-actions'
import { boolean } from '@storybook/addon-knobs'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'

export default {
  title: `${path}/InputField`,
  component: InputField
}

export const TextInputField = () => (
  <ThemeWrapper>
    <Box mx='auto' p='1em' bgColor='grey.50'>
      <InputField
        onChange={action('Value Changed')}
        type='text'
        placeholder='Please enter some text'
        fullWidth={boolean('fullWidth', false)}
      />
    </Box>
  </ThemeWrapper>
)
