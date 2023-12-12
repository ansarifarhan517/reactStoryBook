import { IPinnedColumnProps } from './../interfaces'
import { css } from 'styled-components'

export const columnPinningMixin = css<IPinnedColumnProps>`
  ${({ pinnedColumn, direction, theme }) =>
    pinnedColumn &&
    `
  background-color: ${theme?.colors?.white};
  position: sticky !important;
  z-index: ${theme?.zIndex?.listView?.pinnedColumn};
  ${direction}: ${pinnedColumn?.offset}px;
  `}
`
