import React from 'react'
import TableRowStyled from '../../styles/TableRowStyled'
import { Cell } from 'react-table'
import { IPinnedColumnState } from '../../interfaces'

interface ITableRowProps extends React.HTMLAttributes<HTMLDivElement> {
  isSelected: boolean
  isEditMode: boolean
  rowData: any
  cells: Cell[]
  style: any
  pinnedColumns: IPinnedColumnState
  loading?: boolean
  isScrolling?: boolean
  // rowHoverIndices: Record<number, boolean>
  // virtualizationIndex: number
}

const TableRow = React.forwardRef<HTMLDivElement, ITableRowProps>(
  (
    {
      isSelected,
      children,
      style,
      className,
      // rowHoverIndices,
      // virtualizationIndex,
      ...rest
    },
    ref
  ) => {
    return (
      <TableRowStyled
        {...rest}
        className={
          // row.isSelected && !row.original.hasSelectionDisabled ? 'selected' : ''
          `${isSelected ? 'selected' : ''} ${className}`
          // ${
          //   rowHoverIndices?.[virtualizationIndex] ? 'rowHover' : ''
          // }`
        }
        style={style}
        ref={ref}
      >
        {children}
      </TableRowStyled>
    )
  }
)

// export default TableRow
export default React.memo(
  TableRow,
  (prevProps, nextProps) =>
    nextProps.isScrolling === true ||
    (prevProps.isSelected === nextProps.isSelected &&
      prevProps.isEditMode === nextProps.isEditMode &&
      JSON.stringify(prevProps.rowData) === JSON.stringify(nextProps.rowData) &&
      prevProps.cells.length === nextProps.cells.length &&
      prevProps.pinnedColumns === nextProps.pinnedColumns &&
      prevProps.className === nextProps.className &&
      prevProps.loading === nextProps.loading)
  // prevProps.rowHoverIndices === nextProps.rowHoverIndices &&
  // prevProps.virtualizationIndex === nextProps.virtualizationIndex
)
// export default React.memo(TableRow, () => true)
