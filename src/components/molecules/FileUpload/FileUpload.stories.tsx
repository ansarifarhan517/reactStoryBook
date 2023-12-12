import React from 'react'
import FileUpload from './index'
import Box from '../../atoms/Box'
import { path } from '..'

import { action } from '@storybook/addon-actions'
import { boolean, text, object } from '@storybook/addon-knobs'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'

export default {
  title: `${path}/FileUpload`,
  component: FileUpload
}

export const DefaultField = () => (
  <ThemeWrapper>
    <Box p='1em' style={{ width: '350px' }}>
      <FileUpload
        id='someId'
        name='someName'
        className='someClassName'
        files={object('files', [
          { id: 1, filename: 'ProjectPlan.pdf' },
          { id: 2, filename: 'CustomFields.png' },
          { id: 3, filename: 'CustomFields.jpg' },
          { id: 4, filename: 'CustomFields.doc' },
          { id: 5, filename: 'CustomFields.docx' }
        ])}
        onFileClick={action('File Click')}
        onFileRemove={action('File Remove')}
        label={text('label', 'Label')}
        labelColor={text('labelColor', 'text.inputLabel.default')}
        placeholder={text('placeholder', 'Cick to Upload files...')}
        error={boolean('error', false)}
        errorMessage={text('errorMessage', '')}
        required={boolean('required', false)}
        fullWidth={boolean('fullWidth', false)}
        onChange={action('Triggered: onChange')}
      />
    </Box>
  </ThemeWrapper>
)
