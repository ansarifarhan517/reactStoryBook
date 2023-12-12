import React from 'react'
import {
  boolean,
  text,
  object,
  withKnobs,
  number
} from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import { path } from '..'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import InlinePopup from '.'
import IconButton from '../../atoms/IconButton'
import Box from '../../atoms/Box'
import Position from '../Position'

export default {
  title: `${path}/InlinePopup`,
  decorators: [withKnobs],
  component: InlinePopup
}

export const InlinePopupStories = () => {
  return (
    <ThemeWrapper>
      <Position display='block'>
        <Box m='10em'>Sample Card</Box>
        <Box m='10em'>Sample Card</Box>

        <InlinePopup
          isOpen={boolean('isOpen', false)}
          title={text('title', 'Inline Popup Header')}
          onClose={action('close called')}
          width={number('width', 500)}
          height={number('height', 200)}
          style={object('style', {
            position: 'absolute'
          })}
          content={
            <Box p='1em' m='1em'>
              This is something inside the InlinePopup
            </Box>
          }
          id={text('id', 'InlinePopupID')}
          className={text('className', 'InlinePopupclassName')}
          draggable={boolean('draggable', false)}
        >
          <IconButton
            intent='default'
            iconVariant='icomoon-add'
            children='Add'
          />
        </InlinePopup>
      </Position>
    </ThemeWrapper>
  )
}
