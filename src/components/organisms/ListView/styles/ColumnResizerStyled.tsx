import styled from 'styled-components'
import { IResizerProps } from '../interfaces'

const ColumnResizerStyled = styled.div<IResizerProps>`
  right: 0;
  background: transparent;
  width: 10px;
  height: 100%;
  position: absolute;
  top: 0;
  right: -10px;
  z-index: ${({ theme }) => theme?.zIndex?.basic};
  ${'' /* prevents from scrolling while dragging on touch devices */}
  touch-action: none;
  &:hover {
    border-right: 2px solid
      ${({ theme }) => theme?.colors?.grey['200'] || '#eee'};
  }
  &:focus {
    width: 5px;
  }

  ${({ isResizing, theme }) =>
    isResizing &&
    `
    width: 10px;
    border-right: 2px solid ${theme?.colors?.grey['200'] || '#eee'};
  `}
`

export default ColumnResizerStyled
