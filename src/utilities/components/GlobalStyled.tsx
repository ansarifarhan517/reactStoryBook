import React, { ComponentType } from 'react'

import styled from 'styled-components'
import { tooltipMixin } from '../mixins'

const GlobalStyled = styled.div`
  ${({ theme }) => `
    font-family: ${theme?.typography?.fontFamily};
    font-size: ${theme?.typography?.fontSize}px;

    .cursor{
      cursor: pointer;
    }
  `}/* ${tooltipMixin}; */
`

export const withGlobalStyled = <P extends object = {}>(
  Component: ComponentType<P>
) => (props: P) => {
  return (
    <GlobalStyled>
      <Component {...props} />
    </GlobalStyled>
  )
}
export default GlobalStyled
