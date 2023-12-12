import { css } from 'styled-components'
import { IBgcolorProps, IBorderProps, ISpacingPropsTypes, IcolorProps, TFlexProps, TMarginProps, TPaddingProps } from './types'

export const marginMixin = css<TMarginProps>`
  margin: ${({ m }) => m};
  margin-top: ${({ mt, my }) => mt ?? my};
  margin-bottom: ${({ mb, my }) => mb ?? my};
  margin-left: ${({ ml, mx }) => ml ?? mx};
  margin-right: ${({ mr, mx }) => mr ?? mx};
`
export const paddingMixin = css<TPaddingProps>`
  padding: ${({ p }) => p};
  padding-top: ${({ pt, py }) => pt ?? py};
  padding-bottom: ${({ pb, py }) => pb ?? py};
  padding-left: ${({ pl, px }) => pl ?? px};
  padding-right: ${({ pr, px }) => pr ?? px};
`
export const flexMixin = css<TFlexProps>`
  flex-direction: ${({ flexdirection }) => flexdirection};
  justify-content: ${({ justifycontent }) => justifycontent};
  align-items: ${({ alignitems }) => alignitems};
  flex-grow: ${({ flexgrow }) => flexgrow};
  flex-shrink: ${({ flexshrink }) => flexshrink};
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

export const colorFinder = (color: string = '', theme: any) =>  color
  ?.split('.')
  ?.reduce(
    (state: any, property: string) => state?.[property], theme?.colors,
  )

export const colorMixin = css<IcolorProps>`
  color: ${({ color, theme }) => colorFinder(color, theme)};
`

export const bgColorMixin = css<IBgcolorProps>`
  background-color: ${({ bgcolor, theme }) => colorFinder(bgcolor, theme)};
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