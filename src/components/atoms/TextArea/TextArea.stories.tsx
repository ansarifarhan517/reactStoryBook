import { action } from '@storybook/addon-actions'
import { text } from '@storybook/addon-knobs'
import React from 'react'
import { path } from '..'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import Box from '../../atoms/Box'
import TextArea from '.'

export default {
  title: `${path}/TextArea`,
  component: TextArea
}

export const DefaultField = () => (
  <ThemeWrapper>
    <Box p='1em'>
      <TextArea
        id='someId'
        name='someName'
        className='someClassName'
        label={text('label', 'Messages')}
        labelColor={text('labelColor', 'text.inputLabel.default')}
        placeholder={text('placeholder', 'Enter text here...')}
        onChange={action('Triggered: onChange')}
      />
    </Box>
  </ThemeWrapper>
)
