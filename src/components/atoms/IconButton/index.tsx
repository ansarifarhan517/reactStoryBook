import React from 'react'
import Button, { IButtonProps } from '../Button'
import FontIcon, { tFontIconSize } from '../FontIcon'
import styled, { css } from 'styled-components'
export interface IIconButtonProps extends IButtonProps {
  circle?: boolean
  iconVariant: string
  onlyIcon?: boolean
  minWidth?: string
  /** number | xs | sm | md | lg | xl */
  iconSize?: tFontIconSize
  hoverFeedback?: boolean
}

export const IconButtonStyled = styled(Button)<IIconButtonProps>`
  ${({ circle, disabled }) =>
    circle &&
    css`
      box-shadow: none;
      &:hover {
        box-shadow: none;
      }
      border-radius: 50%;
      padding: 10px;
      border: ${({ theme }) =>
        disabled
          ? `1px solid ${theme?.colors?.text?.disabled}`
          : `1px solid ${theme?.colors?.primary?.main}`};
    `}
  span {
    font-size: ${({ theme }) => `${theme?.typography?.fontSize}px`};
  }
  i {
    display: flex;
  }
  ${({ disabled, circle }) =>
    !disabled &&
    circle &&
    css`
      &:hover {
        background-color: ${({ theme }) =>
          !disabled && `${theme?.colors?.primary?.main}`};
        color: ${({ theme }) => !disabled && `${theme?.colors?.white}`};
      }
    `}
  display:flex;
  span {
    font-size: ${({ intent }) =>
      intent === 'table' ? 10 : intent === 'page' ? 13 : 15}px;
  }
  i {
    font-size: ${({ intent }) =>
      intent === 'table' ? 10 : intent === 'page' ? 13 : 19}px;
    height: ${({ intent }) =>
      intent === 'table' ? 10 : intent === 'page' ? 13 : 19}px;
    line-height: ${({ intent }) =>
      intent === 'table' ? 10 : intent === 'page' ? 13 : 19}px;

    display: flex;
  }
  transition: 0.2s ease-in;
`
export const OnlyIconButtonStyled = styled(Button)<IIconButtonProps>`
  box-shadow: none;
  &:hover {
    box-shadow: none;
  }

  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;

  border: ${({ disabled }) => (disabled ? 'none !important' : 'unset')};
  border-radius: ${({ circle }) => (circle ? '50%' : '0%')};
  padding: 0px 10px;
  background-color: transparent;

  ${({ disabled, theme, hoverFeedback }) =>
    disabled
      ? css`
          & * {
            color: ${theme?.colors?.text?.disabled};
          }
        `
      : hoverFeedback
      ? `
    &:hover {
      background-color: ${theme?.colors?.grey?.['550']}};
      border-radius: 50%;
    }
    `
      : ''}
`

const IconButtonText = styled.span`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const IconButton = ({
  iconVariant,
  iconSize,
  onlyIcon,
  children,
  hoverFeedback = true,
  ...rest
}: IIconButtonProps) =>
  onlyIcon ? (
    <OnlyIconButtonStyled
      {...rest}
      iconVariant={iconVariant}
      hoverFeedback={hoverFeedback}
    >
      <FontIcon variant={iconVariant} size={iconSize} />
    </OnlyIconButtonStyled>
  ) : (
    <IconButtonStyled {...rest} iconVariant={iconVariant}>
      <FontIcon variant={iconVariant} size={iconSize} />
      {children && <IconButtonText>{children}</IconButtonText>}
    </IconButtonStyled>
  )
export default IconButton
