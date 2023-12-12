import React from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { toolbarOptions } from './constants'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { StyledContainer } from './styles'
import Position from '../../molecules/Position'
import { InputLabel } from '../../..'
import { IRTEProps } from './interfaces'

const RichTextEditor = ({
  label = '',
  id = '',
  className = '',
  hideToolbar = false,
  isStripPastedStyles = true,
  ...props
}: IRTEProps) => {
  return (
    <StyledContainer hasLabel={!!label} hideToolbar={hideToolbar}>
      <Editor
        toolbar={toolbarOptions}
        toolbarClassName='logi-rte-toolbar'
        wrapperClassName='logi-rte-wrapper'
        editorClassName={
          props.readOnly ? 'logi-rte-editor disabled' : 'logi-rte-editor'
        }
        {...props}
        stripPastedStyles = {isStripPastedStyles}
      />

      {label && (
        <Position
          type='absolute'
          top='-7px'
          left='10px'
          style={{ maxWidth: 'calc(100% - 20px)' }}
        >
          <InputLabel
            // required={required}
            // color={labelColor}
            id={`${id}-label`}
            className={`${className}-label`}
          >
            {label}
          </InputLabel>
        </Position>
      )}
    </StyledContainer>
  )
}

export default RichTextEditor
