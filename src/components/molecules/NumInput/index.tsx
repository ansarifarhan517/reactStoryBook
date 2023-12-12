import React from 'react'
import styled, { css } from 'styled-components'
import { colorMixin } from '../../../utilities/mixins'
import FontIcon from '../../atoms/FontIcon'
import InputField, { IInputFieldProps } from '../../atoms/InputField'
import ErrorTooltip from '../ErrorTooltip'
import InputLabel from '../InputLabel'
import Position from '../Position'
import Tooltip from '../Tooltip'

export type tTextInputVariant = 'basic' | 'withoutBorder' | 'textArea'
export interface ITextInputProps extends IInputFieldProps {
  id?: string
  className?: string
  label?: string
  labelColor?: string
  required?: boolean
  error?: boolean
  errorMessage?: string
  color?: string
  variant?: 'basic' | 'inline-edit' | 'withIcon'
  iconVariant?: string
  iconSize?: number | 'sm' | 'xs' | 'md' | 'lg' | 'xl'
  iconStyle?: React.CSSProperties
  onIconClick?: ((
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void) &
    ((event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void)
  border?: boolean
  contentEditable?: boolean
  value?: any
  tooltipMesaage?: string
}

export const InlineEditStyled = styled(InputField)<ITextInputProps>`
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

export const FontIconStyled = styled.div<ITextInputProps>`
  background-color: ${({ theme }) => theme?.colors?.primary.main};
  color: ${({ theme }) => theme?.colors?.primary.contrastText};
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 40px;
  box-sizing: border-box;
  ${({ border }) =>
    border &&
    css`
      border: 1px solid ${({ theme }) => theme?.colors?.primary.main};
    `}
`
const TextFieldStyled = styled(InlineEditStyled)<ITextInputProps>`
  border: ${({ border }) => !border && 'none'};
  ${({ variant, label }) =>
    variant === 'withIcon' &&
    css`
      margin: ${label === '' || label === undefined ? '0px' : '18px 0px'};
    `};
  ${colorMixin}
`

const NumInput = React.forwardRef<HTMLInputElement, ITextInputProps>(
  (
    {
      label,
      labelColor,
      required,
      id,
      className,
      error,
      errorMessage,
      border = true,
      variant = 'basic',
      iconVariant,
      iconSize = 'sm',
      iconStyle,
      contentEditable,
      onIconClick,
      tooltipMesaage,
      fullWidth,
      ...rest
    },
    ref
  ) => {
    return (
      <Position
        type='relative'
        fullWidth={fullWidth}
        display={variant === 'withIcon' ? 'flex' : 'block'}
        alignItems='stretch'
      >
        <TextFieldStyled
          type='number'
          {...rest}
          ref={ref}
          id={`${id}-input`}
          className={`${className}-input`}
          error={error}
          variant={variant}
          border={border}
          label={label}
          fullWidth={fullWidth}
        />

        {variant !== 'inline-edit' && (
          <Position
            type='absolute'
            top='10px'
            left='10px'
            style={{ maxWidth: 'calc(100% - 20px)' }}
          >
            <Tooltip message={tooltipMesaage} hover hide={!tooltipMesaage}>
              <InputLabel
                required={required}
                color={labelColor}
                id={`${id}-label`}
                className={`${className}-label`}
              >
                {label}
              </InputLabel>
            </Tooltip>
          </Position>
        )}
        {variant !== 'inline-edit' && error && errorMessage && (
          <Position
            type='absolute'
            top={label === '' || label === undefined ? '-7.5px' : '9.5px'}
            right='-6.5px'
          >
            <ErrorTooltip message={errorMessage} />
          </Position>
        )}
        {variant === 'withIcon' && (
          <FontIconStyled
            style={{
              ...iconStyle,
              ...(label ? { margin: '18px 0px' } : { margin: '0px' })
            }}
            border={border}
            onClick={onIconClick}
          >
            <FontIcon
              variant={iconVariant || 'calender'}
              color='white'
              size={iconSize}
            />
          </FontIconStyled>
        )}
      </Position>
    )
  }
)

export default NumInput
