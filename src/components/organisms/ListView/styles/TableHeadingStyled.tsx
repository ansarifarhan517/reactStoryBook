import styled from 'styled-components'
import { IPinnedColumnProps } from '../interfaces'
import { columnPinningMixin } from '../utils/mixins'

const TableHeadingStyled = styled.div<IPinnedColumnProps>`
  position: relative;
  padding: 5px 5px 5px 15px;
  border: none;
  vertical-align: top;
  border-right: 1px solid transparent;
  font-weight: normal;
  height: auto;
  text-align: left;
  background-color: white;
  ${columnPinningMixin};
  ${({ columnId }) =>
    (columnId === 'selection' && 'max-width: 40px;') ||
    (columnId === 'selectionWithEdit' && 'max-width: 50px;')}
`

export default TableHeadingStyled
