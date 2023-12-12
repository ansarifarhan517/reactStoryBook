
export type tBreakpoints = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
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

export type TMarginProps = {
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

export type TPaddingProps = {
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

export type TFlexProps =  {
  flexdirection?: 'column' | 'row' | 'column-reverse' | 'row-reverse'
  justifycontent?:  'flex-start' | 'flex-end' | 'space-between' | 'space-evenly' | 'center' | 'space-around'
  alignitems?: 'center' | 'flex-start' | 'flex-end' | 'stretch'
  flexgrow?: number
  flexshrink?: number
}

export interface IcolorProps {
  color?: string
}
export interface IBgcolorProps {
  bgcolor?: string
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
export interface ISpacingPropsTypes {
  horizontalSpacing?: number | string
  verticalSpacing?: number | string
}
