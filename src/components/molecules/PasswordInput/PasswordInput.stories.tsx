import React from 'react'
import PasswordInput from '.'
import Box from '../../atoms/Box'
import { path } from '..'

import { action } from '@storybook/addon-actions'
import { boolean, number, text } from '@storybook/addon-knobs'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'

export default {
  title: `${path}/PasswordInput`,
  component: PasswordInput
}

export const DefaultField = () => (
  <ThemeWrapper>
    <Box p='1em'>
      <PasswordInput
        id='defaultPassword'
        name='someName'
        className='someClassName'
        label={text('label', 'Password')}
        labelColor={text('labelColor', 'text.inputLabel.default')}
        placeholder={text('placeholder', 'Enter your Password')}
        maxLength={number('maxLength', 10)}
        error={boolean('error', false)}
        errorMessage={text('errorMessage', '')}
        required={boolean('required', false)}
        fullWidth={boolean('fullWidth', false)}
        onChange={action('Triggered: onChange')}
      />
    </Box>
  </ThemeWrapper>
)

export const RequiredField = () => (
  <ThemeWrapper>
    <Box p='1em'>
      <PasswordInput
        id='requiredPassword'
        name='someName'
        className='someClassName'
        label={text('label', 'Password')}
        labelColor={text('labelColor', 'text.inputLabel.default')}
        placeholder={text('placeholder', 'Enter your Password')}
        maxLength={number('maxLength', 10)}
        error={boolean('error', false)}
        errorMessage={text('errorMessage', '')}
        required={boolean('required', true)}
        fullWidth={boolean('fullWidth', false)}
        onChange={action('Triggered: onChange')}
      />
    </Box>
  </ThemeWrapper>
)
export const ErrorField = () => (
  <ThemeWrapper>
    <Box p='1em'>
      <PasswordInput
        id='errorPassword'
        name='someName'
        className='someClassName'
        label={text('label', 'Password')}
        labelColor={text('labelColor', 'text.inputLabel.default')}
        placeholder={text('placeholder', 'Enter your Password')}
        maxLength={number('maxLength', 10)}
        error={boolean('error', true)}
        errorMessage={text('errorMessage', 'Some Field Error')}
        required={boolean('required', false)}
        fullWidth={boolean('fullWidth', false)}
        onChange={action('Triggered: onChange')}
      />
    </Box>
  </ThemeWrapper>
)
