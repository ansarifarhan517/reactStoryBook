import React from 'react'
import Box from '../../atoms/Box'
import { path } from '..'
import FilePreviewer from '.'

// import { action } from '@storybook/addon-actions'
// import { boolean, text, object } from '@storybook/addon-knobs'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import { number, object } from '@storybook/addon-knobs'

export default {
  title: `${path}/FilePreviewer`,
  component: FilePreviewer
}

export const Basic = () => {
  return (
    <ThemeWrapper>
      <Box p='1em'>
        <FilePreviewer
          pageIndex={number('pageIndex', 1)}
          files={object('files', [
            {
              id: 1,
              filename: 'img_lights.jpg',
              url: 'https://www.w3schools.com/w3css/img_lights.jpg'
            },
            {
              id: 2,
              filename: 'img_forest.jpg',
              url: 'https://www.w3schools.com/w3css/img_forest.jpg'
            },
            {
              id: 3,
              filename: 'img_mountains.docx',
              url: 'https://www.w3schools.com/w3css/img_mountains.jpg'
            }
          ])}
        />
      </Box>
    </ThemeWrapper>
  )
}
