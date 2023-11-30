import React from 'react'
import { styled } from 'styled-components'

export type TButtonProps = {
  variant?: 'link' | 'button';
  underline?: boolean;
  disabled?: boolean;
  btn?: string;
  intent?: 'default' | 'table' | 'page';
  children?: React.ReactNode;
  fullWidth?: boolean;
};


const ButtonStyled = styled.button<TButtonProps>`
    width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
    display: inline-flex
    align-items: center;
    background-color: ${({ btn, theme }) => {
    if (btn?.includes('outline')) {
      return 'white'
    }
    return (theme?.colors?.[btn ?? 'primary']?.main) ??
      theme?.colors?.[btn ?? 'primary']?.contrastText
  }};
    color: ${({ btn, theme }) =>
    (btn && theme?.colors?.[btn]?.contrastText) ??
    theme?.colors?.[btn ?? 'primary']?.main};
    box-shadow: ${({ theme }) => theme?.shadows?.default};
    border: 1px solid;
    border-color: ${({ btn, theme }) => theme?.colors?.[btn ?? 'primary']?.main ??
    theme?.colors?.[btn ?? 'primary']?.contrastText}; 
    line-height: ${({ intent }) =>
    intent === 'table' ?? intent === 'page' ? 30 : 40}px;
    padding: 0px 10px;
    min-width: 6.875rem;
    max-height: ${({ intent }) =>
    intent === 'table' ?? intent === 'page' ? 30 : 40}px;
    text-transform: ${({ intent }) => intent === 'page' && 'uppercase'};
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    font-size: ${({ intent }) => (intent === 'table' ? 12 : 14)}px;
    &:hover {
        box-shadow: ${({ disabled, theme }) => !disabled && theme?.shadows?.hover};
        background-color: ${({ btn, disabled, theme }) => btn && !disabled && theme?.colors?.[btn]?.dark};
       // eslint-disable-next-line
        color: ${({ btn, theme }) => {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    if (btn?.includes('outline') || btn?.includes('light')
    ) {
      return theme?.colors?.[btn]?.contrastTextLight
    }
  }
}
    }
    &:focus {
        outline: none;
    }
     * + * {
        margin-left: ${({ intent }) => (intent === 'table' ? 5 : 7)}px; 
    }
    ${({ disabled }) => disabled && 'opacity: 0.5;'}
    border-radius: ${({ theme }) => theme.button.borderRadius}px;
    font-weight: 500;

`
const LinkStyled = styled.button<TButtonProps>`
  background-color: transparent;
  border: none;
`
const Button = ({
  variant = 'button',
  intent = 'default',
  children = '',
  ...rest
}: TButtonProps) => variant === 'link' ? (
  <LinkStyled intent={intent} {...rest}>
    {children}
  </LinkStyled>
) : (
  <ButtonStyled intent={intent} {...rest}>
    {children}
  </ButtonStyled>
)
export default Button