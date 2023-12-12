import {
  IMarginProps,
  PaddingProps,
  IFlexProps,
  IColorProps,
  IBgColorProps,
  IBorderProps,
  ISpacingPropsTypes
} from './types'
import { css } from 'styled-components'

export const marginMixin = css<IMarginProps>`
  margin: ${({ m }) => m};
  margin-top: ${({ mt, my }) => mt || my};
  margin-bottom: ${({ mb, my }) => mb || my};
  margin-left: ${({ ml, mx }) => ml || mx};
  margin-right: ${({ mr, mx }) => mr || mx};
`
export const paddingMixin = css<PaddingProps>`
  padding: ${({ p }) => p};
  padding-top: ${({ pt, py }) => pt || py};
  padding-bottom: ${({ pb, py }) => pb || py};
  padding-left: ${({ pl, px }) => pl || px};
  padding-right: ${({ pr, px }) => pr || px};
`

export const flexMixin = css<IFlexProps>`
  flex-direction: ${({ flexDirection }) => flexDirection};
  justify-content: ${({ justifyContent }) => justifyContent};
  align-items: ${({ alignItems }) => alignItems};
  flex-grow: ${({ flexGrow }) => flexGrow};
  flex-shrink: ${({ flexShrink }) => flexShrink};
`

export const colorFinder = (color: string = '', theme: any) =>
  color
    ?.split('.')
    ?.reduce(
      (state: Object, property: string) => state?.[property],
      theme?.colors
    )

export const colorMixin = css<IColorProps>`
  color: ${({ color, theme }) => colorFinder(color, theme)};
`

export const bgColorMixin = css<IBgColorProps>`
  background-color: ${({ bgColor, theme }) => colorFinder(bgColor, theme)};
`

export const borderMixin = css<IBorderProps>`
  border: ${({ border }) => `${border || 0}px solid black`};
  border-top: ${({ borderTop }) =>
    borderTop !== undefined && `${borderTop}px solid black`};
  border-bottom: ${({ borderBottom }) =>
    borderBottom !== undefined && `${borderBottom}px solid black`};
  border-left: ${({ borderLeft }) =>
    borderLeft !== undefined && `${borderLeft}px solid black`};
  border-right: ${({ borderRight }) =>
    borderRight !== undefined && `${borderRight}px solid black`};
  border-color: ${({ borderColor, theme }) => colorFinder(borderColor, theme)};
  border-radius: ${({ borderRadius }) =>
    typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius};
`
export const tooltipMixin = css`
  [title] {
    display: inherit;
    margin: 0 0 0 0;
  }
  [title] + span.createdTooltip {
    display: none;
    background-color: ${({ theme }) => `${theme?.colors?.primary?.main}`};
    font-size: 12px;
    padding: 10px;
    border-radius: 2px;
    border: 1px solid
      ${({ theme }) => `${theme?.colors?.grey?.searchInputBorder}`};
    color: ${({ theme }) => `${theme?.colors?.primary?.contrastText}`};
    box-shadow: ${({ theme }) => `${theme?.shadows?.toolTip}`};
    z-index: ${({ theme }) => theme?.zIndex?.tooltip};
  }
  [title]:hover + span.createdTooltip {
    display: block;
    position: absolute;
  }
  [title]:focus + span.createdTooltip {
    display: none;
  }
`
export const spacingMixin = css<ISpacingPropsTypes>`
  ${({ horizontalSpacing }) => {
    if (!horizontalSpacing) {
      return
    }

    const spacing =
      horizontalSpacing +
      '' +
      (typeof horizontalSpacing !== 'string' ? 'px' : '')
    return `
    & > *{
      margin-right: ${spacing};
      &:last-child {
        margin-right: 0;
      }
    }
  `
  }}
  ${({ verticalSpacing }) => {
    if (!verticalSpacing) {
      return
    }

    const spacing =
      verticalSpacing + '' + (typeof verticalSpacing !== 'string' ? 'px' : '')
    return `
    & > *{
      margin-bottom: ${spacing};
      &:last-child {
        margin-bottom: 0;
      }
    }
  `
  }}
`
