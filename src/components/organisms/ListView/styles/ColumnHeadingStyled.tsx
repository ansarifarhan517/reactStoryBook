import styled from 'styled-components'
import { ColumnInstance } from 'react-table'

interface IColumnHeadingStyledProps {
  column: ColumnInstance
}
const ColumnHeadingStyled = styled.div<IColumnHeadingStyledProps>`
  position: relative;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${({ column }) =>
    typeof column.Header === 'string' &&
    `
    overflow: hidden;
    padding-right: ${column.isSorted ? '40px' : '16px'};
  `}
`

export default ColumnHeadingStyled
