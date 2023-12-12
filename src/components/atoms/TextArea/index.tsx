import React from 'react'
import styled from 'styled-components'
import { colorMixin } from '../../../utilities/mixins'
import Position from '../../molecules/Position'
import InputLabel from '../../molecules/InputLabel'

export type tTextInputVariant = 'basic' | 'editable'
export interface ITextInputProps
  extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  id?: string
  className?: string
  label?: string
  labelColor?: string
  color?: string
  border?: boolean
}

const TextAreaDefaultStyled = styled.textarea`
  ${colorMixin}
  border: 1px solid${({ theme }) => theme?.colors?.grey?.['A800']};
  font-size: 13px;
  resize: none;
  letter-spacing: 0.3px;
  padding: 10px 10px;
  margin: 18px 0;
  text-overflow: ellipsis;
  overflow: hidden;
  min-height: 40px;
  border-radius: 0;
  outline: none;
  transition: 0.15s ease-in-out;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  &:focus {
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
      0 0 8px rgba(102, 175, 233, 0.6);
  }
  width: 100%;
  overflow-y: scroll;
  #textArea[placeholder]:empty:before {
    content: attr(placeholder);
    color: ${({ theme }) => theme?.colors?.grey?.['150']};
  }
`
const TextArea = React.forwardRef<HTMLInputElement, ITextInputProps>(
  ({ label, labelColor, id, className, border = true, ...rest }, ref) => {
    return (
      <Position type='relative' display='block'>
        <TextAreaDefaultStyled
          ref={ref as any}
          role='default-textarea'
          id='textArea'
          className={`${className}-input`}
          placeholder=''
          {...rest}
        />
        <Position
          type='absolute'
          top='10px'
          left='10px'
          style={{ maxWidth: 'calc(100% - 20px)' }}
        >
          <InputLabel
            color={labelColor}
            id={`${id}-label`}
            className={`${className}-label`}
          >
            {label}
          </InputLabel>
        </Position>
      </Position>
    )
  }
)

export default TextArea
