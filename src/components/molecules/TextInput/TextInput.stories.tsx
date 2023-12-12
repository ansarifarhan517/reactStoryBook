import { action } from '@storybook/addon-actions'
import { boolean, number, object, text } from '@storybook/addon-knobs'
import React from 'react'
import TextInput from '.'
import { path } from '..'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import Box from '../../atoms/Box'
import Position from '../../molecules/Position'

export default {
  title: `${path}/TextInput`,
  component: TextInput
}

export const DefaultField = () => (
  <ThemeWrapper>
    <Box p='1em'>
      <TextInput
        id='someId'
        name='someName'
        className='someClassName'
        label={text('label', 'Username')}
        labelColor={text('labelColor', 'text.inputLabel.default')}
        placeholder={text('placeholder', 'Enter text here...')}
        maxLength={number('maxLength', 10)}
        error={boolean('error', false)}
        errorMessage={text('errorMessage', '')}
        required={boolean('required', false)}
        fullWidth={boolean('fullWidth', false)}
        onChange={action('Triggered: onChange')}
        tooltipMesaage={text('tooltipMesaage', 'i am default label tooltip')}
      />
    </Box>
  </ThemeWrapper>
)

export const RequiredField = () => (
  <ThemeWrapper>
    <Box p='1em'>
      <TextInput
        id='someId'
        name='someName'
        className='someClassName'
        label={text('label', 'Username')}
        labelColor={text('labelColor', 'text.inputLabel.default')}
        placeholder={text('placeholder', 'Enter text here...')}
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
      <TextInput
        id='someId'
        name='someName'
        className='someClassName'
        label={text('label', 'Username')}
        labelColor={text('labelColor', 'text.inputLabel.default')}
        placeholder={text('placeholder', 'Enter text here...')}
        maxLength={number('maxLength', 10)}
        error={boolean('error', true)}
        errorMessage={text('errorMessage', 'Some Field Error')}
        required={boolean('required', false)}
        fullWidth={boolean('fullWidth', false)}
        onChange={action('Triggered: onChange')}
        tooltipIsWordWrap={boolean('isWordWrap', false)}
        tooltipMesaage={text('tooltipMesaage', 'i am default label tooltip')}
      />
    </Box>
  </ThemeWrapper>
)

export const WithOutBorder = () => (
  <ThemeWrapper>
    <Box bgColor='grey.100' p='2em'>
      <TextInput
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

export const withIcon = () => (
  <ThemeWrapper>
    <Box p='2em'>
      <Position
        type='relative'
        display='block'
        style={object('WrapperStyle', {
          // boxShadow: '2px 3px 10px 0px lightgrey',
          width: '50%'
        })}
      >
        <TextInput
          id='someId'
          name='someName'
          className='someClassName'
          placeholder={text('placeholder', 'Enter text here...')}
          maxLength={number('maxLength', 10)}
          error={boolean('error', false)}
          errorMessage={text('errorMessage', 'Some Field Error')}
          required={boolean('required', false)}
          fullWidth={boolean('fullWidth', true)}
          onChange={action('Triggered: onChange')}
          // border={boolean('border', false)}
          color={text('color', 'primary.main')}
          variant='withIcon'
          iconVariant='calendar'
          iconSize={15}
          displayTootltipOnIcon={boolean('displayTootltipOnIcon', false)}
          tooltipMesaage={text('tooltipMesaage', 'i am default label tooltip')}
          // iconStyle={{ padding: '7px 7px 7px 7px' }}
          // style={object('style', {
          //   fontSize: '14px',
          //   minHeight: '30px'
          // })}
        />
      </Position>
    </Box>
  </ThemeWrapper>
)

export const TextArea = () => (
  <ThemeWrapper>
    <Box p='1em'>
      <TextInput
        id='someId'
        name='someName'
        className='someClassName'
        label={text('label', 'Username')}
        labelColor={text('labelColor', 'grey.250')}
        placeholder={text('placeholder', 'Enter text here...')}
        maxLength={number('maxLength', 10)}
        error={boolean('error', false)}
        errorMessage={text('errorMessage', '')}
        required={boolean('required', false)}
        fullWidth={boolean('fullWidth', false)}
        onChange={(e) => console.log(e)}
        variant='textArea'
        value={text('value', 'Insert text here')}
        contentEditable={boolean('contentEditable', true)}
      />
    </Box>
  </ThemeWrapper>
)
