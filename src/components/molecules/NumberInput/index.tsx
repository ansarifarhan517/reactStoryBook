import React, { useEffect, useState } from 'react'
import InputField, { IInputFieldProps } from '../../atoms/InputField'
import ErrorTooltip from '../ErrorTooltip'
import InputLabel from '../InputLabel'
import Position from '../Position'
import styled, { css } from 'styled-components'

export interface INumberInputProps extends IInputFieldProps {
  className?: string
  name?: string
  label?: string
  labelColor?: string
  error?: boolean
  errorMessage?: string
  value?: string | number | string[] | undefined
  initialValue?: string | number | string[] | undefined
  onChange?: (value: any) => any
  allowDecimal?: boolean
  variant?: 'basic' | 'inline-edit'
  floatRegExp?: string
  roundingoffDigit?: number
}
export const getRoundedDigit = (num: number, roundingOffDigit: number) => {
  return +(
    Math.round(+(num + 'e+' + roundingOffDigit)) +
    'e-' +
    roundingOffDigit
  )
}

export const InlineEditStyled = styled(InputField)<INumberInputProps>`
  ${({ variant, error }) =>
    variant === 'inline-edit' &&
    css`
      min-width: 100px;
      width: 100%;
      border: none;
      border-bottom: ${({ theme }) =>
        error
          ? `1px solid ${theme?.colors?.error?.dark}`
          : `1px solid ${theme?.colors?.primary?.main}`};
      background: ${({ theme }) =>
        error
          ? `${theme?.colors?.error?.transparentLight}`
          : `${theme?.colors?.white}`};
      min-height: 25px;
      padding: 0 5px;
      margin: 0px;

      &::placeholder {
        color: ${({ theme }) => `${theme?.colors?.grey['50']}`};
      }
    `}
`

const NumberInputStyled = styled(InlineEditStyled)<INumberInputProps>``

const NumberInput = React.forwardRef<HTMLInputElement, INumberInputProps>(
  (
    {
      label,
      labelColor,
      required,
      id,
      className,
      error,
      errorMessage,
      initialValue,
      onChange,
      allowDecimal = false,
      variant = 'basic',
      floatRegExp = '[^0-9.]',
      roundingoffDigit = 0,
      ...rest
    }: INumberInputProps,
    ref
  ) => {
    const [value, setValue] = useState<string | number | string[] | undefined>(
      initialValue
    )
    // Set initial value
    useEffect(() => {
      setValue(initialValue || rest.value)
    }, [initialValue, rest.value])

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      const target = event.target as HTMLInputElement
      const value = target.value
      const formmattedString = value?.replace(`/${floatRegExp}/g`, '')
      // if decimal allowed then just format string to prevent alphabate
      let finalString: string | number = formmattedString

      if (!allowDecimal) {
        const newValue = value.replace(/,/g, '').trim()
        // if number than can be parse and extract number out of it,not working if value comes "1.", that is handled in above line
        const parsedValue = parseFloat(newValue)
        // if sring starts with alphabet then it will give NaN, in such case extract number out of string
        if (Number.isNaN(parsedValue)) {
          const parsedString = parseInt(
            newValue?.replace(`/${floatRegExp}/g`, ''),
            10
          )
          // if value is blank string, it will again give Nan
          if (Number.isNaN(parsedString)) {
            finalString = ''
          } else {
            finalString = JSON.stringify(parsedString)
          }
        } else {
          finalString = JSON.stringify(parsedValue)
        }
      }
      if (
        roundingoffDigit !== 0 &&
        allowDecimal &&
        finalString.indexOf('.') !== finalString.length - 1
      ) {
        finalString = getRoundedDigit(Number(finalString), roundingoffDigit)
      }
      setValue(finalString)
      onChange && onChange(finalString)
    }
    return (
      <Position type='relative'>
        <NumberInputStyled
          {...rest}
          type='tel'
          ref={ref}
          id={`${id}-input`}
          className={`${className}-input`}
          error={error}
          value={value}
          variant={variant}
          onChange={onChangeHandler}
        />
        {variant === 'basic' && (
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
        )}
        {variant === 'basic' && error && errorMessage && (
          <Position type='absolute' top='7.5px' right='-6.5px'>
            <ErrorTooltip message={errorMessage} />
          </Position>
        )}
      </Position>
    )
  }
)

export default NumberInput
