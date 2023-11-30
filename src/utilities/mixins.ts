import { css } from 'styled-components'
import { TFlexProps, TMarginProps, TPaddingProps } from './types'

export const marginMixins = css<TMarginProps>`
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
  flex-direction: ${({ flexDirection }) => flexDirection};
  justify-content: ${({ justifyContent }) => justifyContent};
  align-items: ${({ alignItems }) => alignItems};
  flex-grow: ${({ flexGrow }) => flexGrow};
  flex-shrink: ${({ flexShrink }) => flexShrink};
`
