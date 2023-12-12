import React from 'react'
import Box from '../../atoms/Box'
import { path } from '..'

import { action } from '@storybook/addon-actions'
import { boolean, text, object } from '@storybook/addon-knobs'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import ButtonList from '.'

export default {
  title: `${path}/ButtonList`,
  component: ButtonList
}

export const ButtonListComponent = () => (
  <ThemeWrapper>
    <Box p='1em'>
      <ButtonList
        listOfButtons={object('listOfButtons', [
          {
            variant: 'button',
            children: text('children', 'Cancel'),
            intent: 'page',
            primary: boolean('primary', true),
            onClick: action('value changed')
          },
          {
            variant: 'button',
            children: 'Ok',
            intent: 'page',
            onClick: action('value changed')
          }
        ])}
      />
    </Box>
  </ThemeWrapper>
)
