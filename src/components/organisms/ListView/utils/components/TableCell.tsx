import React from 'react'
import TableCellStyled from '../../styles/TableCellStyled'
import { IPinnedColumnState } from '../../interfaces'

interface ITableCellProps extends React.HTMLAttributes<HTMLDivElement> {
  columnId: string
  canResize: boolean
  isResizing: boolean
  resizerProps: any
  children: any
  pinnedColumns: IPinnedColumnState
}

const TableCell = ({
  columnId,
  canResize,
  isResizing,
  resizerProps,
  pinnedColumns,
  children,
  ...rest
}: ITableCellProps) => {
  return (
    <TableCellStyled
      {...rest}
      pinnedColumn={
        pinnedColumns.left[columnId] || pinnedColumns.right[columnId]
      }
      direction={
        pinnedColumns.left[columnId]
          ? 'left'
          : pinnedColumns.right[columnId]
          ? 'right'
          : undefined
      }
      columnId={columnId}
    >
      {children}

      {canResize && (
        <div
          {...resizerProps}
          className={`resizer ${isResizing ? 'isResizing' : ''}`}
        />
      )}
    </TableCellStyled>
  )
}

export default React.memo(TableCell)
