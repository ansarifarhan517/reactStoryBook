import React from 'react'

import Position from '../Position'
import InputLabel from '../InputLabel'
import InputField, { IInputFieldProps } from '../../atoms/InputField'
import ErrorTooltip from '../ErrorTooltip'

export interface IPasswordInputProps extends IInputFieldProps {
  id?: string
  className?: string
  name?: string
  label?: string
  labelColor?: string
  required?: boolean
  error?: boolean
  errorMessage?: string
}

const PasswordInput = React.forwardRef<HTMLInputElement, IPasswordInputProps>(
  (
    {
      label,
      labelColor,
      required,
      id,
      className,
      error,
      errorMessage,
      ...rest
    }: IPasswordInputProps,
    ref
  ) => (
    <Position type='relative' display='block'>
      <InputField
        {...rest}
        type='password'
        ref={ref}
        id={`${id}-input`}
        className={`${className}-input`}
        error={error}
      />
      <Position
        type='absolute'
        top='10px'
        left='10px'
        style={{ maxWidth: 'calc(100% - 20px)' }}
      >
        <InputLabel
          required={required}
          color={labelColor}
          id={`${id}-label`}
          className={`${className}-label`}
        >
          {label}
        </InputLabel>
      </Position>

      {error && errorMessage && (
        <Position type='absolute' top='7.5px' right='-6.5px'>
          <ErrorTooltip message={errorMessage} />
        </Position>
      )}
    </Position>
  )
)
export default PasswordInput
