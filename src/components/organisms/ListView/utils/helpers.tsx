import {
  IFilterProps,
  IEditableCellProps,
  IListViewColumn,
  ISortOptions
} from '../interfaces'
import { SortingRule } from 'react-table'
import React from 'react'

import TextInput from '../../../molecules/TextInput'
import TextFilter from '../../../atoms/TextFilter'

export const generateColumns = (count: number): IListViewColumn[] => {
  const columns: IListViewColumn[] = []
  for (let i = 1; i <= count; i++) {
    columns.push({ Header: `Column ${i}`, accessor: `column${i}` })
  }

  return columns
}

export const generateRows = ({ rowCount, columnCount, pageNumber }: any) => {
  const rows: any = []
  for (let j = 1; j <= rowCount; j++) {
    const c: any = {}
    for (let i = 1; i <= columnCount; i++) {
      c['column' + i] = `P${pageNumber}-R${j}-C${i}`
    }
    c.id = `uniqId-P${pageNumber}-R${j}`
    c.isFavourite = j % 3 === 0
    rows.push(c)
  }

  return rows
}

export const defaultColumn = {
  Filter: ({ textFieldProps }: IFilterProps) => (
    <TextFilter {...textFieldProps} />
  ),
  EditableCell: ({ value, error }: IEditableCellProps) => (
    <TextInput
      variant='inline-edit'
      defaultValue={value}
      error={error}
      fullWidth
    />
  )
}

export const combinedSortOptions = (
  sortBy: SortingRule<object>[]
): ISortOptions => {
  if (!sortBy.length) {
    return {}
  }

  const sortObject = {
    sortBy: '',
    sortOrder: ''
  }

  sortBy.forEach((sortingRule) => {
    sortObject.sortBy += sortingRule.id + '#@#'
    sortObject.sortOrder += (sortingRule.desc ? 'DESC' : 'ASC') + '#@#'
  })

  sortObject.sortBy = sortObject.sortBy.substring(
    0,
    sortObject.sortBy.length - 3
  )
  sortObject.sortOrder = sortObject.sortOrder.substring(
    0,
    sortObject.sortOrder.length - 3
  )

  return sortObject
}

export const handleCellMouseEnter = (rowIndex: number) => {
  const cells = document.getElementsByClassName(`cell--hover${rowIndex}`)
  if (cells.length) {
    for (let i = 0; i < cells.length; i++) {
      cells.item(i)?.classList.add('rowHover')
    }
  }
}

export const handleCellMouseLeave = (rowIndex: number) => {
  const cells = document.getElementsByClassName(`cell--hover${rowIndex}`)
  if (cells.length) {
    for (let i = 0; i < cells.length; i++) {
      // cells.item(i)?.classList.remove('tablegrid__cellhovered')
      cells.item(i)?.classList.remove('rowHover')
    }
  }
}

export const getRenderedCursor = (children: JSX.Element[]) =>
  children?.reduce(
    (
      [minRow, maxRow, minColumn, maxColumn],
      { props: { columnIndex, rowIndex } }
    ) => {
      if (rowIndex < minRow) {
        minRow = rowIndex
      }
      if (rowIndex > maxRow) {
        maxRow = rowIndex
      }
      if (columnIndex < minColumn) {
        minColumn = columnIndex
      }
      if (columnIndex > maxColumn) {
        maxColumn = columnIndex
      }

      return [minRow, maxRow, minColumn, maxColumn]
    },
    [
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY
    ]
  )

export const calculateColumnsWidth = (
  columns: IListViewColumn[],
  containerWidth: number
) => {
  let visibleColumnsCount = 0
  let totalColumnsWidth = 0
  columns.forEach((c) => {
    if (c.isVisible !== false) {
      visibleColumnsCount++
      totalColumnsWidth += c.width || 150
    }
  })

  if (containerWidth > totalColumnsWidth) {
    const perColumnExtraWidth =
      (containerWidth - totalColumnsWidth) / visibleColumnsCount
    return columns.map((c, i) => ({
      ...c,
      width:
        (c.width || 150) +
        perColumnExtraWidth -
        (i === columns.length - 1 ? 15 : 0)
    }))
  } else {
    return columns.map((c) => {
      if (!c.width) {
        delete c.width
      }
      return c
    })
  }
}
