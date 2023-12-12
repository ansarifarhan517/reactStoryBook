import React from 'react'
import { action } from '@storybook/addon-actions'
import IconButton from '.'
import Box from '../Box'
import { withKnobs, boolean, text, radios } from '@storybook/addon-knobs'
import { path } from '..'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import { tIntent } from '../Button'

export default {
  title: `${path}/IconButton`,
  decorators: [withKnobs],
  component: IconButton
}
const radioOptions = {
  intent: { default: 'default', page: 'page', table: 'table' }
}
export const withBasic = () => (
  <ThemeWrapper>
    <Box display='flex' justifyContent='space-evenly'>
      <IconButton
        onClick={action('clicked an Icon button with text')}
        primary={boolean('primary', false)}
        disabled={boolean('disabled', false)}
        intent={radios('intent', radioOptions.intent, 'default') as tIntent}
        iconVariant='icomoon-add'
        children='Add'
      />
      <IconButton
        onClick={action('clicked an Icon button with text')}
        primary={boolean('primary', false)}
        disabled={boolean('disabled', false)}
        intent={radios('intent', radioOptions.intent, 'default') as tIntent}
        iconVariant='icomoon-delete-empty'
        children='Delete'
      />
      <IconButton
        onClick={action('clicked an Icon button with text')}
        primary={boolean('primary', false)}
        disabled={boolean('disabled', false)}
        iconVariant='calendar'
        intent={radios('intent', radioOptions.intent, 'default') as tIntent}
        children='Calendar'
      />
    </Box>
  </ThemeWrapper>
)
export const withCircular = () => (
  <ThemeWrapper>
    <Box display='flex' justifyContent='space-evenly'>
      <IconButton
        onClick={action('clicked an Icon button')}
        primary={boolean('primary', false)}
        disabled={boolean('disabled', false)}
        iconVariant='add'
        iconSize='xs'
        circle
      />
      <IconButton
        onClick={action('clicked an Icon button')}
        primary={boolean('primary', false)}
        disabled={boolean('disabled', false)}
        iconVariant='calendar'
        iconSize='md'
        circle
      />
    </Box>
  </ThemeWrapper>
)

export const withOnlyIcon = () => (
  <ThemeWrapper>
    <Box display='flex' justifyContent='space-evenly'>
      <IconButton
        onClick={action('clicked an Icon')}
        disabled={boolean('disabled', false)}
        onlyIcon
        iconVariant='add'
        iconSize='xs'
        color={text('Colors', 'primary.main')}
      />
      <IconButton
        onClick={action('clicked an Icon')}
        disabled={boolean('disabled', false)}
        onlyIcon
        iconVariant='calendar'
        iconSize='md'
        color={text('Colors', 'primary.main')}
      />
      <IconButton
        onClick={action('clicked an Icon')}
        disabled={boolean('disabled', false)}
        onlyIcon
        iconVariant='mail'
        iconSize='xl'
        color={text('Colors', 'primary.main')}
      />
    </Box>
  </ThemeWrapper>
)

export const withLink = () => (
  <ThemeWrapper>
    <Box display='flex' justifyContent='space-evenly'>
      <IconButton
        onClick={action('clicked an Icon')}
        disabled={boolean('disabled', false)}
        iconVariant='add'
        color={text('Colors', 'primary.main')}
        variant='link'
        children='Add'
      />
      <IconButton
        onClick={action('clicked an Icon')}
        disabled={boolean('disabled', false)}
        iconVariant='calendar'
        color={text('Colors', 'primary.main')}
        variant='link'
        children='Calendar'
      />
      <IconButton
        onClick={action('clicked an Icon')}
        disabled={boolean('disabled', false)}
        iconVariant='mail'
        color={text('Colors', 'primary.main')}
        variant='link'
        children='Mail'
      />
    </Box>
  </ThemeWrapper>
)
