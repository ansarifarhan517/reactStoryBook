import React from 'react'

// import PropTypes from 'prop-types'
import styled from 'styled-components'
import Box, { IBoxProps } from '../../atoms/Box'

export interface PositionProps extends IBoxProps {
  type?: 'relative' | 'absolute' | 'fixed' | 'sticky' | 'unset'
  top?: string
  bottom?: string
  left?: string
  right?: string
  zIndex?: string
}

const PositionStyled = styled(Box)<PositionProps>`
  ${({ type, top, bottom, left, right, zIndex }) => `
    position: ${type};
    top: ${top};
    bottom: ${bottom};
    left: ${left};
    right: ${right};
    z-index:${zIndex};
  `}
`

const Position = ({ type = 'relative', ...rest }: PositionProps) => (
  <PositionStyled type={type} {...rest} />
)

export default Position
