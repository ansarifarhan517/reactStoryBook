import PropTypes from 'prop-types'

export type tPlacement = 'start' | 'center' | 'end'
export type tBreakpoints = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type tSizes = 'sm' | 'md' | 'lg'
export type tExtraSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type tDisplay =
  | 'block'
  | 'inline-block'
  | 'none'
  | 'flex'
  | 'inline-flex'

export type tFlexDirection = 'column' | 'row' | 'column-reverse' | 'row-reverse'
export type tJustifyContent =
  | 'flex-start'
  | 'flex-end'
  | 'space-between'
  | 'space-evenly'
  | 'center'
  | 'space-around'
export type tAlignItems = 'center' | 'flex-start' | 'flex-end' | 'stretch'
export interface IMarginProps {
  /** Margin */
  m?: string
  /** Margin Top */
  mt?: string
  /** Margin Bottom */
  mb?: string
  /** Margin Left */
  ml?: string
  /** Margin Right */
  mr?: string
  /** Margin Horizontally */
  mx?: string
  /** Margin Vertically */
  my?: string
}

export const marginPropTypes = {
  m: PropTypes.string,
  mt: PropTypes.string,
  mb: PropTypes.string,
  ml: PropTypes.string,
  mr: PropTypes.string,
  mx: PropTypes.string,
  my: PropTypes.string
}

export interface PaddingProps {
  /** Padding */
  p?: string
  /** Padding Top */
  pt?: string
  /** Padding Bottom */
  pb?: string
  /** Padding Left */
  pl?: string
  /** Padding Right */
  pr?: string
  /** Padding Horizontally */
  px?: string
  /** Padding Vertically */
  py?: string
}
export const paddingPropTypes = {
  p: PropTypes.string,
  pt: PropTypes.string,
  pb: PropTypes.string,
  pl: PropTypes.string,
  pr: PropTypes.string,
  px: PropTypes.string,
  py: PropTypes.string
}

export interface IBorderProps {
  border?: number
  borderTop?: number
  borderBottom?: number
  borderRight?: number
  borderLeft?: number
  borderRadius?: string | number
  borderColor?: string
}

export const borderPropTypes = {
  border: PropTypes.number,
  borderTop: PropTypes.number,
  borderBottom: PropTypes.number,
  borderRight: PropTypes.number,
  borderLeft: PropTypes.number,
  borderRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  borderColor: PropTypes.string
}

export interface IFlexProps {
  flexDirection?: 'column' | 'row' | 'column-reverse' | 'row-reverse'
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-evenly'
    | 'center'
    | 'space-around'
  alignItems?: 'center' | 'flex-start' | 'flex-end' | 'stretch'
  flexGrow?: number
  flexShrink?: number
}

export const flexPropTypes = {
  flexDirection: PropTypes.oneOf<tFlexDirection>([
    'column',
    'row',
    'column-reverse',
    'row-reverse'
  ]),
  justifyContent: PropTypes.oneOf<tJustifyContent>([
    'flex-start',
    'flex-end',
    'space-between',
    'space-evenly',
    'center',
    'space-around'
  ]),
  alignItems: PropTypes.oneOf<tAlignItems>([
    'center',
    'flex-start',
    'flex-end',
    'stretch'
  ]),
  flexGrow: PropTypes.number,
  flexShrink: PropTypes.number
}

export interface IColorProps {
  color?: string
}

export const colorPropTypes = {
  color: PropTypes.string
}

export interface IBgColorProps {
  bgColor?: string
}

export const bgColorPropTypes = {
  bgColor: PropTypes.string
}

export interface ISpacingPropsTypes {
  horizontalSpacing?: number | string
  verticalSpacing?: number | string
}
