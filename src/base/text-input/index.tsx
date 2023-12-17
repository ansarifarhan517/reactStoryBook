import React, { useCallback } from 'react'
import { bemClass } from '@utils'

import './style.scss'

const blk = 'text-input'

type ITextInputProps = {
  type: string
  label: string
  value?: string
  disabled?: boolean
  invalid?: boolean
  className?: string
  controlClassName?: string
  maxLength?: number
  isTextArea?: boolean
  isRequired?: boolean
  validationMessage?: string
  name?: string
  changeHandler?: (arg0: onChangeHandlerParameter) => void
}

type onChangeHandlerParameter = Record<string, string>
const TextInput: React.FC<ITextInputProps> = ({
  type,
  value,
  label,
  disabled,
  changeHandler,
  controlClassName,
  className,
  validationMessage,
  invalid,
  maxLength,
  isRequired,
  isTextArea,
  name,
}) => {
  const thisChangeHandler: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = useCallback(
    (e: React.ChangeEvent) => {
      const inputElement = e.target as HTMLInputElement | HTMLTextAreaElement // Explicitly cast e.target
      changeHandler?.({ [name ?? '']: inputElement.value })
    },
    [name, changeHandler],
  )
  return (

    <div className={bemClass([blk, {}, className])}>
      <div className={bemClass([blk, 'message-container', {}])}>
        <label>
          {label} {/* Removed computed property name */}
          {isRequired && <span className={bemClass([blk, 'star'])}>*</span>}
        </label>
        <span className={bemClass([blk, 'validation-message'])}>{validationMessage}</span>
      </div>

      {
        isTextArea && (
          <textarea
            className={bemClass([blk, 'control', { 'text-area': !!isTextArea, invalid: !!invalid }, controlClassName])}
            defaultValue={value}
            disabled={disabled}
            onChange={thisChangeHandler}
          />
        )
      }
      {!isTextArea && (
        <input
          type={type}
          disabled={disabled}
          onChange={thisChangeHandler}
          className={bemClass([blk, 'control', { 'text-area': !!isTextArea, invalid: !!invalid }, controlClassName])}
          maxLength={maxLength}
        />
      )}
    </div>
  )
}

export default TextInput
