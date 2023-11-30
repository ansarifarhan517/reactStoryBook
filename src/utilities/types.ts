
export type tBreakpoints = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

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
  flexDirection?: 'column' | 'row' | 'column-reverse' | 'row-reverse'
  justifyContent?:  'flex-start' | 'flex-end' | 'space-between' | 'space-evenly' | 'center' | 'space-around'
  alignItems?: 'center' | 'flex-start' | 'flex-end' | 'stretch'
  flexGrow?: number
  flexShrink?: number
}