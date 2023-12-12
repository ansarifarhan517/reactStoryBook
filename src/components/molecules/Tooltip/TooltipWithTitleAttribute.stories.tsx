import React from 'react'

import { withKnobs } from '@storybook/addon-knobs'

import { path } from '..'

import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import Button from '../../atoms/Button'
import Box from '../../atoms/Box'
import InputField from '../../atoms/InputField'

export default {
  title: `${path}/Tooltip`,
  decorators: [withKnobs],
  parameters: {
    props: {
      propTablesExclude: [Box, Button, ThemeWrapper]
    }
  }
}

export const withTitleAttribute = () => (
  <ThemeWrapper>
    <Box>
      <h4 title='This is a H4 Tag'>ToolTip Demo</h4>
      <InputField
        title='Enter your Username'
        type='text'
        placeholder='Please enter your name'
        fullWidth={false}
      />
      <Button
        title='Click me'
        primary={false}
        variant='button'
        intent='default'
        disabled={false}
      >
        Login Button
      </Button>
    </Box>
  </ThemeWrapper>
)
