import React from 'react'
import styled from 'styled-components'
import {
  marginMixin,
  paddingMixin,
  flexMixin,
  colorMixin,
  bgColorMixin,
  borderMixin,
  spacingMixin
} from '../../../utilities/mixins'

import {
  PaddingProps,
  IMarginProps,
  IFlexProps,
  IBgColorProps,
  IColorProps,
  IBorderProps,
  tDisplay,
  marginPropTypes,
  paddingPropTypes,
  flexPropTypes,
  colorPropTypes,
  bgColorPropTypes,
  borderPropTypes
} from '../../../utilities/types'
import PropTypes from 'prop-types'

export interface IBoxProps
  extends PaddingProps,
    IMarginProps,
    IFlexProps,
    IColorProps,
    IBgColorProps,
    IBorderProps,
    React.HTMLAttributes<HTMLDivElement> {
  horizontalSpacing?: number | string
  verticalSpacing?: number | string
  fullWidth?: boolean
  fullHeight?: boolean
  display?: tDisplay
  children?: any
}

export const BoxStyled = styled.div<IBoxProps>`
  display: ${({ display = 'block' }) => display};
  box-sizing: inherit;
  ${({ fullWidth }) => fullWidth && 'width: 100%;'}
  ${({ fullHeight }) => fullHeight && 'height: 100%;'}
  ${colorMixin};
  ${bgColorMixin};
  ${marginMixin};
  ${paddingMixin};
  ${flexMixin};
  ${borderMixin};
  ${spacingMixin};
`
const Box = ({
  display = 'block',
  flexDirection = 'row',
  justifyContent = 'flex-start',
  alignItems = 'center',
  children,
  ...rest
}: IBoxProps): JSX.Element => {
  return (
    <BoxStyled
      display={display}
      flexDirection={flexDirection}
      justifyContent={justifyContent}
      alignItems={alignItems}
      {...rest}
    >
      {children}
    </BoxStyled>
  )
}

export const boxPropTypes = {
  display: PropTypes.oneOf<tDisplay>([
    'block',
    'inline-block',
    'none',
    'flex',
    'inline-flex'
  ]),
  ...flexPropTypes,
  ...colorPropTypes,
  ...bgColorPropTypes,
  ...marginPropTypes,
  ...paddingPropTypes,
  ...borderPropTypes
}

export default Box
