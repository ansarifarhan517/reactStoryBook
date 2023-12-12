import styled from 'styled-components'
import { IPinnedColumnProps } from '../interfaces'
import { columnPinningMixin } from '../utils/mixins'

const TableCellStyled = styled.div<IPinnedColumnProps>`
  position: relative;
  padding: 5px 5px 5px 15px;
  border: none;
  vertical-align: top;
  border-right: 1px solid transparent;
  display: flex;
  align-items: center;
  // background-color: ${({ theme }) => theme?.colors?.white};
  ${columnPinningMixin};
  ${({ columnId }) =>
    (columnId === 'selection' && 'max-width: 40px;') ||
    (columnId === 'selectionWithEdit' && 'max-width: 50px;')}
`

export default TableCellStyled
