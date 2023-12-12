import React from 'react'
import { withKnobs, text } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import { path } from '..'
import Box from '../../atoms/Box'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import ModalHeader from '.'

export default {
  title: `${path}/ModalHeader`,
  decorators: [withKnobs],
  component: ModalHeader
}

export const ModalHeaderComponent = () => (
  <ThemeWrapper>
    <Box
      display='flex'
      p='3em'
      my='3em'
      justifyContent='center'
      bgColor='grey.50'
    >
      <ModalHeader
        headerTitle={text('headerTitle','Confirmation')}
        handleClose={action('value changed')}
        width='538px'
        headerStyle={{fontSize: '15px'}}
      />
    </Box>
  </ThemeWrapper>
)
