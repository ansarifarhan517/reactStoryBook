import React from 'react'
import { IBgcolorProps, IBorderProps, IcolorProps, TFlexProps, TMarginProps, TPaddingProps, tDisplay } from '../../../utilities/types'
import { styled } from 'styled-components'
import { bgColorMixin, borderMixin, colorMixin, flexMixin, marginMixin, paddingMixin, spacingMixin } from '../../../utilities/mixins'


interface IBoxProps extends TMarginProps, TPaddingProps,
    TFlexProps, IcolorProps, IBorderProps,
    IBgcolorProps, React.HTMLAttributes<HTMLDivElement> {
    horizontalSpacing?: number | string
    verticalSpacing?: number | string
    fullWidth?: boolean
    fullHeight?: boolean
    display?: tDisplay
    children?: any
}


const BoxStyled = styled.div<IBoxProps>`
    display: ${({ display = 'block' }) => display};
    ${({ fullWidth }) => fullWidth && 'width: 100%;'};
    ${({ fullHeight }) => fullHeight && 'height: 100%;'};
    ${colorMixin};
    ${bgColorMixin};
    ${flexMixin};
    ${paddingMixin};
    ${marginMixin};
    ${borderMixin};
    ${spacingMixin};

`

const Box:React.FC<IBoxProps> = ({
  display = 'block',
  flexdirection = 'row',
  justifycontent = 'flex-start',
  alignitems = 'center',
  children,
  ...rest
}) => (
  <BoxStyled
    display={display}
    flexdirection={flexdirection}
    justifycontent={justifycontent}
    alignitems={alignitems}
    {...rest}
  >
    {children}
  </BoxStyled>
)

export default Box