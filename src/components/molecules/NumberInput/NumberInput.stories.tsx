import React from 'react'
import NumberInput from '.'
import Box from '../../atoms/Box'
import { path } from '..'

import { action } from '@storybook/addon-actions'
import { boolean, number, text } from '@storybook/addon-knobs'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'

export default {
  title: `${path}/NumberInput`,
  component: NumberInput
}

export const DefaultField = () => (
  <ThemeWrapper>
    <Box p='1em'>
      <NumberInput
        id='someId'
        name='someName'
        className='someClassName'
        label={text('label', 'Number Input')}
        labelColor={text('labelColor', 'text.inputLabel.default')}
        placeholder={text('placeholder', 'Enter number here...')}
        maxLength={number('maxLength', 10)}
        error={boolean('error', false)}
        errorMessage={text('errorMessage', '')}
        required={boolean('required', false)}
        fullWidth={boolean('fullWidth', false)}
        onChange={action('Triggered: onChange')}
        allowDecimal={boolean('allowDecimal', false)}
        roundingoffDigit={number('roundingoffDigit', 3)}
      />
    </Box>
  </ThemeWrapper>
)

export const DefaultFieldWithInitialValue = () => (
  <ThemeWrapper>
    <Box p='1em'>
      <NumberInput
        id='someId'
        name='someName'
        className='someClassName'
        label={text('label', 'Number Input')}
        labelColor={text('labelColor', 'text.inputLabel.default')}
        placeholder={text('placeholder', 'Enter number here...')}
        initialValue={number('initialValue', 25)}
        maxLength={number('maxLength', 10)}
        error={boolean('error', false)}
        errorMessage={text('errorMessage', '')}
        required={boolean('required', false)}
        fullWidth={boolean('fullWidth', false)}
        onChange={action('Triggered: onChange')}
        allowDecimal={boolean('allowDecimal', false)}
      />
    </Box>
  </ThemeWrapper>
)

export const DecimalField = () => (
  <ThemeWrapper>
    <Box p='1em'>
      <NumberInput
        id='someId'
        name='someName'
        className='someClassName'
        label={text('label', 'Number Input')}
        labelColor={text('labelColor', 'text.inputLabel.default')}
        placeholder={text('placeholder', 'Enter number here...')}
        maxLength={number('maxLength', 10)}
        error={boolean('error', false)}
        errorMessage={text('errorMessage', '')}
        required={boolean('required', false)}
        fullWidth={boolean('fullWidth', false)}
        onChange={action('Triggered: onChange')}
        allowDecimal={boolean('allowDecimal', true)}
        roundingoffDigit={number('roundingoffDigit', 3)}
      />
    </Box>
  </ThemeWrapper>
)

export const RequiredField = () => (
  <ThemeWrapper>
    <Box p='1em'>
      <NumberInput
        id='someId'
        name='someName'
        className='someClassName'
        label={text('label', 'Number Input')}
        labelColor={text('labelColor', 'text.inputLabel.default')}
        placeholder={text('placeholder', 'Enter number here...')}
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
      <NumberInput
        id='someId'
        name='someName'
        className='someClassName'
        label={text('label', 'Number Input')}
        labelColor={text('labelColor', 'text.inputLabel.default')}
        placeholder={text('placeholder', 'Enter number here...')}
        maxLength={number('maxLength', 10)}
        error={boolean('error', true)}
        errorMessage={text('errorMessage', 'Some Field Error')}
        required={boolean('required', false)}
        fullWidth={boolean('fullWidth', true)}
        onChange={action('Triggered: onChange')}
      />
    </Box>
  </ThemeWrapper>
)

export const WithOutBorder = () => (
  <ThemeWrapper>
    <Box bgColor='grey.100' p='2em'>
      <NumberInput
        id='someId'
        name='someName'
        className='someClassName'
        maxLength={number('maxLength', 10)}
        error={boolean('error', false)}
        onChange={action('Triggered: onChange')}
        variant='inline-edit'
      />
    </Box>
  </ThemeWrapper>
)
