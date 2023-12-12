import React from 'react'
import TableHeadingStyled from '../../styles/TableHeadingStyled'
import {
  IPinnedColumnState,
  IListViewRow,
  IPinnedColumnTotalWidthState,
  IListViewColumn,
  ISelectedRows,
  ITextFieldProps,
  ISelectFieldProps
} from '../../interfaces'
import { ColumnInstance, TableInstance, Column } from 'react-table'
import ColumnOptions from './ColumnOptions'
import ColumnHeadingStyled from '../../styles/ColumnHeadingStyled'
import { IOptionType } from '../../../../atoms/CheckboxGroup'
import { Shimmer } from 'react-shimmer'
import Box from '../../../../atoms/Box'
import ColumnFilterLoading from '../../styles/ColumnFilterLoading'
import ColumnResizerStyled from '../../styles/ColumnResizerStyled'

interface ITableHeaderCellProps {
  pinnedColumns: IPinnedColumnState
  columnInstance: ColumnInstance<IListViewRow>
  isColumnLoading: boolean
  instance: TableInstance
  setPinnedColumns: React.Dispatch<React.SetStateAction<IPinnedColumnState>>
  pinnedColumnsTotalWidth: IPinnedColumnTotalWidthState
  setPinnedColumnsTotalWidth: React.Dispatch<
    React.SetStateAction<IPinnedColumnTotalWidthState>
  >
  setShowHideColumns: React.Dispatch<React.SetStateAction<IOptionType[]>>
  setColumnCheckedCount: React.Dispatch<React.SetStateAction<number>>
  columns: IListViewColumn[]
  selectedRows: ISelectedRows
  data: IListViewRow[]
  loading: boolean
  isEditMode: boolean
  setSelectedRows: React.Dispatch<React.SetStateAction<ISelectedRows>>
  onRowSelect: (selectedRows: ISelectedRows) => void
  rowIdentifier: string
  filters: Record<string, string>
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>
  getTextFieldProps(column: Column): ITextFieldProps
  getSelectFieldProps(column: Column): ISelectFieldProps
  hideColumnSettings: boolean
  hasSelectAllRows?: boolean
}

const TableHeaderCell = ({
  pinnedColumns,
  columnInstance,
  isColumnLoading,
  instance,
  setPinnedColumns,
  pinnedColumnsTotalWidth,
  setPinnedColumnsTotalWidth,
  setShowHideColumns,
  setColumnCheckedCount,
  columns,
  selectedRows,
  data,
  loading,
  isEditMode,
  setSelectedRows,
  onRowSelect,
  rowIdentifier,
  filters,
  setFilters,
  getTextFieldProps,
  getSelectFieldProps,
  hideColumnSettings,
  hasSelectAllRows = true
}: ITableHeaderCellProps) => {
  const columnHeaderProps = columnInstance.getHeaderProps()
  return (
    <TableHeadingStyled
      {...columnHeaderProps}
      title={undefined}
      pinnedColumn={
        pinnedColumns.left[columnInstance.id] ||
        pinnedColumns.right[columnInstance.id]
      }
      direction={
        pinnedColumns.left[columnInstance.id]
          ? 'left'
          : pinnedColumns.right[columnInstance.id]
          ? 'right'
          : undefined
      }
      className={columnInstance?.['isSortable'] && 'cursor'}
      columnId={columnInstance.id}
      id={`column-header-${columnInstance.id}`}
    >
      {!isColumnLoading &&
        columnInstance.id !== 'selection' &&
        columnInstance.id !== 'selectionWithEdit' &&
        !hideColumnSettings && (
          <ColumnOptions
            instance={instance}
            columnInstance={columnInstance as any}
            columns={columns}
            pinnedColumns={pinnedColumns}
            pinnedColumnsTotalWidth={pinnedColumnsTotalWidth}
            setPinnedColumns={setPinnedColumns}
            setColumnCheckedCount={setColumnCheckedCount}
            setShowHideColumns={setShowHideColumns}
            setPinnedColumnsTotalWidth={setPinnedColumnsTotalWidth}
            hideColumnSettings={hideColumnSettings}
          />
        )}
      <ColumnHeadingStyled
        {...(columnInstance?.['isSortable'] === true
          ? columnInstance.getSortByToggleProps()
          : {})}
        column={columnInstance}
        title={
          columnInstance?.['infoTip'] ||
          (typeof columnInstance.Header === 'string'
            ? columnInstance.Header
            : undefined)
        }
      >
        <strong style={{ userSelect: 'none' }}>
          {isColumnLoading &&
          columnInstance.id !== 'selection' &&
          columnInstance.id !== 'selectionWithEdit' ? (
            <Shimmer width={Number(columnInstance.width) - 50} height={20} />
          ) : (
            columnInstance.render('Header', {
              selectedRows,
              data,
              loading,
              isEditMode,
              setSelectedRows,
              onRowSelect,
              rowIdentifier,
              hasSelectAllRows
            })
          )}
        </strong>
      </ColumnHeadingStyled>
      {columnInstance?.['isFilterable'] && (
        <Box mt='12px'>
          {isColumnLoading ? (
            <ColumnFilterLoading />
          ) : (
            columnInstance.render('Filter', {
              textFieldProps: getTextFieldProps(columnInstance),
              selectFieldProps: getSelectFieldProps(columnInstance),
              filters,
              setFilters
            })
          )}
        </Box>
      )}
      {!isColumnLoading &&
        columnInstance.id !== 'selection' &&
        columnInstance.id !== 'selectionWithEdit' && (
          <ColumnResizerStyled
            {...columnInstance.getResizerProps()}
            isResizing={columnInstance.isResizing}
          />
        )}
    </TableHeadingStyled>
  )
}

export default TableHeaderCell
