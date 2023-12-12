import React from 'react'
import styled from 'styled-components'

export type tFontIconSize = number | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export interface IIconProps extends React.HTMLAttributes<HTMLElement> {
  variant: string
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  hoverColor?: string
}

const StyledIcon = styled.i.attrs<IIconProps>(({ variant }) => ({
  className: `icon ui-library-icons icon-${variant}`
}))<IIconProps>`
  color: ${({ color, theme }) =>
    color
      ?.split('.')
      ?.reduce((state, property) => state?.[property], theme?.colors)};
  font-size: ${({ theme, size }) =>
    typeof size === 'number' ? size : theme?.fontIcons?.[size || 'md']}px;
  line-height: ${({ theme, size }) =>
    typeof size === 'number' ? size : theme?.fontIcons?.[size || 'md']}px;
  height: ${({ theme, size }) =>
    typeof size === 'number' ? size : theme?.fontIcons?.[size || 'md']}px;
  &:hover {
    color: ${({ hoverColor, theme }) =>
      hoverColor
        ?.split('.')
        ?.reduce((state, property) => state?.[property], theme?.colors)};
  }
  vertical-align: middle;
`

const FontIcon = ({ color, size = 'md', variant, hoverColor }: IIconProps) => {
  return (
    <StyledIcon
      color={color}
      size={size}
      variant={variant}
      hoverColor={hoverColor}
    />
  )
}

export default FontIcon
