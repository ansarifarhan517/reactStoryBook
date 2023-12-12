import React, { useMemo, useState } from 'react'
import { useTable, usePagination } from 'react-table'
import { IExpandableTableProps } from './ExpandableListView.interfaces'
import { ShowMoreContainer, StyledTable } from './ExpandableListView.styles'

const ExpandableListView = ({
  initialRows,
  tableData,
  headers
}: IExpandableTableProps) => {
  const columns = useMemo(() => headers, [headers])
  const data = useMemo(() => tableData, [tableData])

  const [more, setMore] = useState(true)

  const handleClick = () => {
    more ? setPageSize(data.length) : setPageSize(initialRows)
    more ? setMore(false) : setMore(true)
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setPageSize
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: initialRows }
    },
    usePagination
  )

  return (
    <StyledTable>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup: any, i: number) => (
            <tr {...headerGroup.getHeaderGroupProps} key={i}>
              {headerGroup.headers.map((column: any, i: number) => (
                <th
                  {...column.getHeaderProps({
                    style: {
                      minWidth: column.minWidth,
                      width: column.width,
                      maxWidth: column.maxWidth
                    }
                  })}
                  key={i}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row: any, i: number) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()} key={i}>
                {row.cells.map((cell: any, i: number) => {
                  return (
                    <td {...cell.getCellProps} key={i}>
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      {initialRows < data.length && (
        <ShowMoreContainer onClick={handleClick}>
          View {more ? 'All' : 'Less'}
        </ShowMoreContainer>
      )}
    </StyledTable>
  )
}

export default ExpandableListView
