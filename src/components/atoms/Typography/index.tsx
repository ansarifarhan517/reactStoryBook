import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {
  IColorProps,
  colorPropTypes,
  IBgColorProps,
  bgColorPropTypes
} from '../../../utilities/types'
import { colorMixin, bgColorMixin } from '../../../utilities/mixins'

type whiteSpacePropertyType =
  | 'normal'
  | 'pre'
  | 'nowrap'
  | 'pre-wrap'
  | 'pre-line'
  | 'break-spaces'
export interface ITypographyProps
  extends IColorProps,
    IBgColorProps,
    React.HTMLAttributes<HTMLDivElement> {
  variant?: 'inputLabel' | 'errorMessage' | 'tooltip' | 'tooltipWithWordWrap'
  align?: 'left' | 'right' | 'center'
  children: any
  fontFamily?: string
  fontSize?: string
  lineHeight?: string
  fontWeight?: number
  bold?: boolean
  italic?: boolean
  underline?: boolean
  primary?: boolean
  useStyle?: boolean
}

const TypographyStyled = styled.div<ITypographyProps>`
  font-size: ${({ fontSize, theme }) =>
    fontSize || `${theme?.typography?.fontSize}px`};
  text-decoration: ${({ underline }) => underline && 'underline'};
  text-align: ${({ align }) => align};
  font-weight: ${({ bold }) => bold && 'bold'};
  font-weight: ${({ fontWeight }) => fontWeight};
  font-style: ${({ italic }) => italic && 'oblique'};
  line-height: ${({ lineHeight }) => lineHeight};
  color: ${({ primary, theme }) => primary && theme?.colors?.primary?.main};
  ${colorMixin};
  ${bgColorMixin};
`
const TypographyVariantsPropsMapping = {
  inputLabel: {},
  errorMessage: {
    fontSize: '11px',
    color: 'error.main'
  },
  tooltip: {
    fontSize: '11px'
  },
  tooltipWithWordWrap: {
    fontSize: '11px'
  }
}
const Typography = ({
  children,
  variant,
  useStyle = true,
  ...props
}: ITypographyProps) => {
  const newProps = variant
    ? {
        ...props,
        ...TypographyVariantsPropsMapping[variant]
      }
    : { ...props }
    const whiteSpaceValue: whiteSpacePropertyType =
    variant === 'tooltipWithWordWrap' ? 'normal' : 'nowrap' 

  return (
    <TypographyStyled
      {...newProps}
      style={
        useStyle
          ? {
              whiteSpace: whiteSpaceValue,
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }
          : {}
      }
    >
      {children}
    </TypographyStyled>
  )
}

export const typographyPropTypes = {
  variant: PropTypes.oneOf([
    'inputLabel',
    'errorMessage',
    'tooltip',
    'tooltipWithWordWrap'
  ]),
  fontFamily: PropTypes.string,
  fontSize: PropTypes.string,
  lineHeight: PropTypes.string,
  fontWeight: PropTypes.number,
  bold: PropTypes.bool,
  italic: PropTypes.bool,
  underline: PropTypes.bool,
  primary: PropTypes.bool,
  align: PropTypes.oneOf(['right', 'left', 'center']),
  children: PropTypes.any,
  ...colorPropTypes,
  ...bgColorPropTypes
}

// Typography.propTypes = typographyPropTypes

export default Typography
