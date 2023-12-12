import React, { useEffect, useState, useCallback, useRef } from 'react'
import { FixedSizeList, ListOnScrollProps } from 'react-window'
import {
  useTable,
  useFlexLayout,
  useResizeColumns,
  useSortBy,
  usePagination,
  useFilters,
  useColumnOrder,
  SortingRule
} from 'react-table'
import Box from '../../atoms/Box'
// import FontIcon from '../../atoms/FontIcon'
import PaginationWrapper from './utils/components/PaginationWrapper'
// import Loader from '../../atoms/Loader'
import Position from '../../molecules/Position'
import { useCustomFilters } from './utils/useCustomFilters'
import {
  IListViewProps,
  IFilterProps,
  ISortOptions,
  IPinnedColumnState,
  ISelectedRows,
  IListViewRow,
  IEditableCellProps,
  IPinnedColumnTotalWidthState
} from './interfaces'
import IconButton from '../../atoms/IconButton'
import ListViewStyled from './styles/ListViewStyled'
import TableStyled from './styles/TableStyled'
import TableHeadingStyled from './styles/TableHeadingStyled'
import TableBodyStyled from './styles/TableBodyStyled'
import TextFilter from '../../atoms/TextFilter'
import TextInput from '../../molecules/TextInput'
import ColumnResizerStyled from './styles/ColumnResizerStyled'
import ShowHideColumnPopup from '../../molecules/ShowHideColumnPopup'
import Checkbox from '../../atoms/Checkbox'
import TableHeadingContainer from './styles/TableHeadingContainer'
import ColumnOptions from './utils/components/ColumnOptions'
import TableRow from './utils/components/TableRow'
import TableCell from './utils/components/TableCell'
import NoDataFoundComponent from './styles/NoDataFound'

import { monthNamesShort } from '../../../utilities/helpers'
import { IOptionType } from '../../atoms/CheckboxGroup'
import Typography from '../../atoms/Typography'
import ColumnHeadingStyled from './styles/ColumnHeadingStyled'
import { Shimmer } from 'react-shimmer'
import ColumnFilterLoading from './styles/ColumnFilterLoading'
import { useToast } from '../../molecules/Toast'
import Tooltip from '../../molecules/Tooltip'

const combinedSortOptions = (sortBy: SortingRule<object>[]): ISortOptions => {
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
const defaultCallback = () => {}
const ListView = ({
  id = '',
  columns = [],
  data = [],
  loading = false,
  isColumnLoading = false,
  totalRows = 0,
  isEditMode = false,
  permanentColumns,
  children: {
    ActionBar = <React.Fragment />,
    NoDataFound = (
      <NoDataFoundComponent>No Data Available</NoDataFoundComponent>
    ),
    IconBar = <React.Fragment />
  } = {
    ActionBar: <React.Fragment />,
    NoDataFound: <NoDataFoundComponent>No Data Available</NoDataFoundComponent>,
    IconBar: <React.Fragment />
  },
  rowIdentifier = 'id',
  hasRowSelectionWithEdit = false,
  hasRowSelection = false,
  onRowSelect = defaultCallback,
  onRowEditClick = defaultCallback,
  onSortChange = defaultCallback,
  onFetchData = defaultCallback,
  onSaveColumnPreferences = defaultCallback,
  paginationPageSize = 50,
  onShowMoreColumns = defaultCallback,
  onApply = defaultCallback,
  onPageChange = defaultCallback,
  sorts = [],
  filters: filtersObject = {},
  onFilterChange = defaultCallback,
  ...rest
}: IListViewProps) => {
  const [pageCount, setPageCount] = useState<number>(Math.ceil(totalRows / 25))
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({})
  const [tableMounted, setTableMounted] = useState<boolean>(false)
  const tableRef = useRef<HTMLDivElement | null>(null)
  const toast = useToast()

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
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
    }),
    []
  )

  // Use the state and functions returned from useTable to build your UI
  const instance = useTable<IListViewRow>(
    {
      columns,
      data,
      defaultColumn,
      manualSortBy: true,
      manualPagination: true,
      manualFilters: true,
      pageCount: pageCount,
      initialState: {
        pageSize: paginationPageSize,
        pageIndex: 0,
        hiddenColumns: columns
          .filter((c) => c.isVisible === false)
          .map((c) => c.accessor),
        sortBy: sorts
      }
    },
    useFilters,
    useSortBy,
    usePagination,
    useFlexLayout,
    useResizeColumns,
    // useRowSelect,
    useColumnOrder,
    (hooks) => {
      /** No Checkbox & Edit button */
      // if (!hasRowSelection && !hasRowSelectionWithEdit) {
      //   return
      // }

      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: 'selection',
          width: 40,
          maxWidth: 40,
          isVisible: hasRowSelection,
          /** Header Select all Checkbox */
          Header: ({
            selectedRows: selectedRowProps,
            data,
            loading,
            isEditMode
          }: {
            selectedRows: ISelectedRows
            data: IListViewRow[]
            loading: boolean
            isEditMode: boolean
          }) => {
            const [checked, setChecked] = useState<boolean>(false)
            const [byPassUseEffect, setByPassUseEffect] = useState<boolean>(
              false
            )
            useEffect(() => {
              if (byPassUseEffect) {
                setByPassUseEffect(false)
                return
              }

              setChecked(
                !!data.length &&
                  !data.some(
                    (row) =>
                      !row.ignoreSelectAll &&
                      !row.hasSelectionDisabled &&
                      !selectedRowProps[row[rowIdentifier]]
                  )
              )
            }, [selectedRowProps, data])

            const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
              const newSelection = { ...selectedRowProps }
              const checkedValue = e.target.checked

              data.forEach((row) => {
                if (
                  checkedValue &&
                  !row.ignoreSelectAll &&
                  !row.hasSelectionDisabled
                ) {
                  newSelection[row[rowIdentifier]] = row
                } else {
                  delete newSelection[row[rowIdentifier]]
                }
              })
              setByPassUseEffect(true)
              setChecked(checkedValue)
              setSelectedRows(newSelection)
              onRowSelect(newSelection)
            }
            return (
              <Position
                display='flex'
                justifyContent='flex-end'
                type='absolute'
                top='0'
                right='0'
              >
                <Checkbox
                  id={`${id}-selectAll`}
                  checkboxSize='md'
                  checked={checked}
                  onChange={handleChange}
                  disabled={loading || isEditMode}
                  // disabled={loading}
                  // {...getToggleAllRowsSelectedProps()}
                  title={undefined}
                />
              </Position>
            )
          },
          /** Row-level checkbox */
          Cell: ({
            row,
            selectedRows: selectedRowsProps,
            hasRowSelectionWithEdit,
            loading,
            isEditMode
            // hasRowSelection
          }) => {
            const [checked, setChecked] = useState<boolean>(
              !!selectedRowsProps[row.original[rowIdentifier]]
            )

            useEffect(() => {
              setChecked(!!selectedRowsProps[row.original[rowIdentifier]])
            }, [selectedRowsProps])

            return (
              <Position
                display='flex'
                justifyContent='flex-end'
                type='absolute'
                right='5px'
                top={`calc(50% - ${
                  hasRowSelectionWithEdit && !loading ? '12px' : '9px'
                })`}
              >
                {hasRowSelectionWithEdit && !loading && (
                  <IconButton
                    iconVariant='icomoon-edit-empty'
                    iconSize='sm'
                    onlyIcon
                    hoverFeedback={false}
                    className='editIcon'
                    color='primary.main'
                    style={{ paddingRight: '5px', paddingBottom: '2px' }}
                    title='Update'
                    onClick={() => onRowEditClick(row.original)}
                    {...(row.original.editIconButtonProps || {})}
                  />
                )}
                <div title={row.original.checkboxTooltipText || undefined}>
                  <Checkbox
                    id={`${row.original[rowIdentifier]}-selectAll`}
                    checkboxSize='md'
                    disabled={
                      row.original.hasSelectionDisabled || loading || isEditMode
                    }
                    // {...row.getToggleRowSelectedProps()}
                    checked={checked}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const isChecked = e.target.checked
                      setChecked(isChecked)
                      setTimeout(
                        () => {
                          setSelectedRows((s) => {
                            const newSelection = {
                              ...s,
                              [row.original[rowIdentifier]]: row.original
                            }
                            if (!isChecked) {
                              delete newSelection[row.original[rowIdentifier]]
                            }

                            setTimeout(() => {
                              onRowSelect(newSelection)
                            }, 100)
                            return newSelection
                          })
                        },
                        data.length >= 100 ? 20 : 0
                      )
                    }}
                    {...(row.original.hasSelectionDisabled
                      ? { checked: false }
                      : {})}
                  />
                </div>
              </Position>
            )
          }
        },
        {
          id: 'selectionWithEdit',
          width: 50,
          maxWidth: 50,
          isVisible: hasRowSelectionWithEdit,
          /** Header Select all Checkbox */
          Header: ({
            selectedRows: selectedRowProps,
            data,
            loading,
            isEditMode
          }: {
            selectedRows: ISelectedRows
            data: IListViewRow[]
            loading: boolean
            isEditMode: boolean
          }) => {
            const [checked, setChecked] = useState<boolean>(false)
            const [byPassUseEffect, setByPassUseEffect] = useState<boolean>(
              false
            )
            useEffect(() => {
              if (byPassUseEffect) {
                setByPassUseEffect(false)
                return
              }

              setChecked(
                !!data.length &&
                  !data.some(
                    (row) =>
                      !row.ignoreSelectAll &&
                      !row.hasSelectionDisabled &&
                      !selectedRowProps[row[rowIdentifier]]
                  )
              )
            }, [selectedRowProps, data])

            const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
              const newSelection = { ...selectedRowProps }
              const checkedValue = e.target.checked

              data.forEach((row) => {
                if (
                  checkedValue &&
                  !row.ignoreSelectAll &&
                  !row.hasSelectionDisabled
                ) {
                  newSelection[row[rowIdentifier]] = row
                } else {
                  delete newSelection[row[rowIdentifier]]
                }
              })
              setByPassUseEffect(true)
              setChecked(checkedValue)
              setSelectedRows(newSelection)
              onRowSelect(newSelection)
            }
            return (
              <Position
                display='flex'
                justifyContent='flex-end'
                type='absolute'
                top='0'
                right='0'
              >
                <Checkbox
                  id={`${id}-selectAll`}
                  checkboxSize='md'
                  checked={checked}
                  onChange={handleChange}
                  disabled={loading || isEditMode}
                  // {...getToggleAllRowsSelectedProps()}
                  title={undefined}
                />
              </Position>
            )
          },
          /** Row-level checkbox */
          Cell: ({
            row,
            selectedRows: selectedRowsProps,
            hasRowSelectionWithEdit,
            loading,
            isEditMode
            // hasRowSelection
          }) => {
            const [checked, setChecked] = useState<boolean>(
              !!selectedRowsProps[row.original[rowIdentifier]]
            )

            useEffect(() => {
              setChecked(!!selectedRowsProps[row.original[rowIdentifier]])
            }, [selectedRowsProps])

            return (
              <Position
                display='flex'
                justifyContent='flex-end'
                type='absolute'
                right='5px'
                top={`calc(50% - ${
                  hasRowSelectionWithEdit && !loading ? '12px' : '9px'
                })`}
              >
                {hasRowSelectionWithEdit && !loading && (
                  <IconButton
                    iconVariant='icomoon-edit-empty'
                    iconSize='sm'
                    onlyIcon
                    hoverFeedback={false}
                    className='editIcon'
                    color='primary.main'
                    style={{ paddingRight: '5px', paddingBottom: '2px' }}
                    title='Update'
                    onClick={() => onRowEditClick(row.original)}
                    {...(row.original.editIconButtonProps || {})}
                  />
                )}
                <div title={row.original.checkboxTooltipText || undefined}>
                  <Checkbox
                    id={`${row.original[rowIdentifier]}-selectAll`}
                    checkboxSize='md'
                    disabled={
                      row.original.hasSelectionDisabled || loading || isEditMode
                    }
                    // {...row.getToggleRowSelectedProps()}
                    checked={checked}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const isChecked = e.target.checked
                      setChecked(isChecked)
                      setTimeout(
                        () => {
                          setSelectedRows((s) => {
                            const newSelection = {
                              ...s,
                              [row.original[rowIdentifier]]: row.original
                            }
                            if (!isChecked) {
                              delete newSelection[row.original[rowIdentifier]]
                            }

                            setTimeout(() => {
                              onRowSelect(newSelection)
                            }, 100)
                            return newSelection
                          })
                        },
                        data.length >= 100 ? 20 : 0
                      )
                    }}
                    {...(row.original.hasSelectionDisabled
                      ? { checked: false }
                      : {})}
                  />
                </div>
              </Position>
            )
          }
        },
        ...columns
      ])
    }
  )

  const {
    rows,
    allColumns,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    toggleHideColumn,
    visibleColumns,
    gotoPage,
    state: { sortBy, pageSize, pageIndex }
  } = instance

  const [showHideColumns, setShowHideColumns] = useState<IOptionType[]>(
    allColumns
      .filter(
        (column) =>
          column.id !== 'selection' && column.id !== 'selectionWithEdit'
      )
      .map((column) => ({
        id: column.id,
        value: (column.Header as string) || '',
        checked: column.isVisible
      }))
  )

  const [appliedShowHideColumns, setAppliedShowHideColumns] = useState<
    IOptionType[]
  >([...showHideColumns])

  const [columnCheckedCount, setColumnCheckedCount] = useState<number>(
    visibleColumns.length +
      (hasRowSelection || hasRowSelectionWithEdit ? -1 : 0)
  )

  useEffect(() => {
    let visibleColumnsCount = 0
    const newColumns = columns.map((column) => {
      if (column.isVisible !== false) {
        visibleColumnsCount++
      }

      return {
        id: column.accessor,
        value: (column.Header as string) || '',
        checked: column.isVisible !== false
      }
    })
    setShowHideColumns(newColumns)
    setAppliedShowHideColumns([...newColumns])
    setColumnCheckedCount(visibleColumnsCount)
  }, [columns])

  const {
    getTextFieldProps,
    getSelectFieldProps,
    combinedFilterOptions,
    filters,
    setFilters
  } = useCustomFilters(filtersObject)

  const [pinnedColumns, setPinnedColumns] = useState<IPinnedColumnState>({
    left: {
      [hasRowSelectionWithEdit ? 'selectionWithEdit' : 'selection']: {
        offset: 0,
        width: hasRowSelectionWithEdit ? 50 : hasRowSelection ? 40 : 0
      }
    },
    right: {}
  })
  const [pinnedColumnsTotalWidth, setPinnedColumnsTotalWidth] = useState<
    IPinnedColumnTotalWidthState
  >({
    left: hasRowSelectionWithEdit ? 50 : hasRowSelection ? 40 : 0,
    right: 0
  })

  useEffect(() => {
    if (hasRowSelection) {
      toggleHideColumn('selection', false)
      toggleHideColumn('selectionWithEdit', true)
      setPinnedColumns((pC) => {
        const newPinned = {
          ...pC,
          left: { ...pC.left, selection: { offset: 0, width: 40 } }
        }

        let totalWidth = 0
        Object.keys(newPinned.left).forEach((id) => {
          totalWidth += newPinned.left[id].width
          if (id !== 'selection' && id !== 'selectionWithEdit') {
            newPinned.left[id].offset += 40
          }
        })

        setPinnedColumnsTotalWidth((t) => ({ ...t, left: totalWidth }))
        return newPinned
      })
    } else {
      setPinnedColumns((pC) => {
        const newPinned = { ...pC }
        delete newPinned.left.selection

        let totalWidth = 0
        Object.keys(newPinned.left).forEach((id) => {
          totalWidth += newPinned.left[id].width
          if (id !== 'selection' && id !== 'selectionWithEdit') {
            newPinned.left[id].offset -= 40
          }
        })

        setPinnedColumnsTotalWidth((t) => ({
          ...t,
          // left: t.left >= 40 ? t.left - 40 : t.left
          left: totalWidth
        }))

        return newPinned
      })
      toggleHideColumn('selection', true)
      toggleHideColumn('selectionWithEdit', !hasRowSelectionWithEdit)
    }
  }, [hasRowSelection])

  useEffect(() => {
    if (hasRowSelectionWithEdit) {
      setPinnedColumns((pC) => {
        const newPinned = {
          ...pC,
          left: { ...pC.left, selectionWithEdit: { offset: 0, width: 50 } }
        }

        let totalWidth = 0
        Object.keys(newPinned.left).forEach((id) => {
          totalWidth += newPinned.left[id].width
          if (id !== 'selection' && id !== 'selectionWithEdit') {
            newPinned.left[id].offset += 50
          }
        })

        // setPinnedColumnsTotalWidth((t) => ({ ...t, left: t.left + 50 }))
        setPinnedColumnsTotalWidth((t) => ({ ...t, left: totalWidth }))
        return newPinned
      })
      toggleHideColumn('selectionWithEdit', false)
      toggleHideColumn('selection', true)
    } else {
      setPinnedColumns((pC) => {
        const newPinned = { ...pC }
        delete newPinned.left.selectionWithEdit

        let totalWidth = 0
        Object.keys(newPinned.left).forEach((id) => {
          totalWidth += newPinned.left[id].width
          if (id !== 'selection' && id !== 'selectionWithEdit') {
            newPinned.left[id].offset -= 50
          }
        })

        setPinnedColumnsTotalWidth((t) => ({
          ...t,
          // left: t.left >= 50 ? t.left - 50 : t.left
          left: totalWidth
        }))
        return newPinned
      })
      toggleHideColumn('selectionWithEdit', true)
      toggleHideColumn('selection', !hasRowSelection)
    }
  }, [hasRowSelectionWithEdit])

  /** Re-Calculate pageCount whenever totalRows or pageSize chanages */
  useEffect(() => {
    setPageCount(Math.ceil(totalRows / pageSize))
  }, [totalRows, pageSize])

  /** Callback when sort changes */
  useEffect(() => {
    onSortChange(combinedSortOptions(sortBy), sortBy)
  }, [sortBy])

  useEffect(() => {
    gotoPage(0)
    if (pageIndex === 0) {
      const combFilters = combinedFilterOptions()
      onFetchData({
        pageSize,
        pageNumber: pageIndex + 1,
        sortOptions: combinedSortOptions(sortBy),
        filterOptions: combFilters,
        apis: {
          setSelection: setSelectedRows,
          resetSelection: () => setSelectedRows({})
        }
      })

      onFilterChange(combFilters, filters)
    }
  }, [filters])

  /** Callback when Re-fetching server side data is required */
  useEffect(() => {
    // setLastUpdated(new Date())
    onFetchData({
      pageSize,
      pageNumber: pageIndex + 1,
      sortOptions: combinedSortOptions(sortBy),
      filterOptions: combinedFilterOptions(),
      apis: {
        setSelection: setSelectedRows,
        resetSelection: () => setSelectedRows({})
      }
    })
  }, [sortBy, onFetchData, pageSize, pageIndex])

  /** Refresh Data from Server callback */
  const handleRefresh = useCallback(() => {
    setLastUpdated(new Date())
    onFetchData({
      pageSize,
      pageNumber: pageIndex + 1,
      sortOptions: combinedSortOptions(sortBy),
      filterOptions: combinedFilterOptions(),
      apis: {
        setSelection: setSelectedRows,
        resetSelection: () => setSelectedRows({})
      }
    })
  }, [onFetchData, combinedFilterOptions, pageSize, pageIndex, sortBy])

  /** on the very first load of the table we wish to set it mounted
  once it is mounted only then the ref will be available to calculate dynamic height for react-window */
  useEffect(() => {
    setTableMounted(true)
  }, [])

  const pinnedGridLeft = React.useRef<FixedSizeList>(null)
  const pinnedGridRight = React.useRef<FixedSizeList>(null)
  const gridMiddle = React.useRef<FixedSizeList>(null)

  const onScroll = React.useCallback(
    (e: ListOnScrollProps, type: 'left' | 'middle' | 'right' = 'middle') => {
      const { scrollOffset, scrollUpdateWasRequested } = e
      if (!scrollUpdateWasRequested) {
        switch (type) {
          case 'left':
            gridMiddle?.current?.scrollTo(scrollOffset)
            pinnedGridRight?.current?.scrollTo(scrollOffset)
            break

          case 'middle':
            pinnedGridLeft?.current?.scrollTo(scrollOffset)
            pinnedGridRight?.current?.scrollTo(scrollOffset)
            break

          case 'right':
            gridMiddle?.current?.scrollTo(scrollOffset)
            pinnedGridLeft?.current?.scrollTo(scrollOffset)
            break
        }
      }
    },
    [pinnedGridLeft, pinnedGridRight]
  )

  // const [rowHoverIndices, setRowHoverIndices] = useState<
  //   Record<number, boolean>
  // >({})

  const RenderPinned = React.useCallback(
    (direction: 'right' | 'left') => ({ index, style }: any) => {
      const row = rows[index]
      prepareRow(row)
      return (
        <TableRow
          isSelected={
            selectedRows[row.original[rowIdentifier]] &&
            !row.original.hasSelectionDisabled
          }
          rowData={row.original}
          isEditMode={isEditMode}
          cells={row.cells}
          pinnedColumns={pinnedColumns}
          {...row.getRowProps()}
          style={{ ...row.getRowProps().style, ...style, zIndex: 4 }}
          key={'Table Row' + row.original[rowIdentifier]}
          // className={`${rowHoverIndices[index] ? 'rowHover' : ''}`}
          loading={loading}
          // rowHoverIndices={rowHoverIndices}
          // virtualizationIndex={index}
          // onMouseEnter={() => {
          //   setRowHoverIndices({ [index]: true })
          // }}
          // onMouseLeave={() => setRowHoverIndices({})}
        >
          {row.cells.map(
            (cell) =>
              pinnedColumns?.[direction]?.[cell.column.id] && (
                <TableCell
                  {...cell.getCellProps()}
                  key={
                    'Table Cell' +
                    cell.row.original[rowIdentifier] +
                    cell.column.id
                  }
                  pinnedColumns={pinnedColumns}
                  columnId={cell.column.id}
                  canResize={cell.column.canResize}
                  isResizing={cell.column.isResizing}
                  resizerProps={cell.column.getResizerProps()}
                >
                  {isEditMode &&
                  cell.column.isEditable &&
                  !!selectedRows[cell.row.original[rowIdentifier]]
                    ? cell.render('EditableCell', {
                        ...cell,
                        error: !!cell?.row?.original?.errorFields?.[
                          cell.column.id
                        ]
                      })
                    : cell.render('Cell', {
                        ...cell,
                        selectedRows,
                        hasRowSelection,
                        hasRowSelectionWithEdit,
                        loading,
                        isEditMode
                      })}
                </TableCell>
              )
          )}
        </TableRow>
      )
    },
    [
      prepareRow,
      rows,
      selectedRows,
      isEditMode,
      instance.state,
      // rowHoverIndices,
      pinnedColumns,
      pinnedColumnsTotalWidth,
      loading,
      hasRowSelection,
      hasRowSelectionWithEdit
      // pinnedColumns
    ]
  )

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index]
      prepareRow(row)
      return (
        <TableRow
          isSelected={
            selectedRows[row.original[rowIdentifier]] &&
            !row.original.hasSelectionDisabled
          }
          rowData={row.original}
          isEditMode={isEditMode}
          cells={row.cells}
          pinnedColumns={pinnedColumns}
          {...row.getRowProps()}
          style={{ ...row.getRowProps().style, ...style }}
          key={'Table Row' + row.original[rowIdentifier]}
          // onMouseEnter={() => {
          //   setRowHoverIndices({ [index]: true })
          // }}
          // onMouseLeave={() => setRowHoverIndices({})}
          loading={loading}
          // onMouseLeave={() => setRowHoverIndices({})}
          // rowHoverIndices={rowHoverIndices}
          // virtualizationIndex={index}
        >
          {row.cells.map(
            (cell) =>
              !pinnedColumns.left[cell.column.id] &&
              !pinnedColumns.right[cell.column.id] &&
              cell.column.id !== 'selection' &&
              cell.column.id !== 'selectionWithEdit' && (
                <TableCell
                  {...cell.getCellProps()}
                  key={
                    'Table Cell' +
                    cell.row.original[rowIdentifier] +
                    cell.column.id
                  }
                  pinnedColumns={pinnedColumns}
                  columnId={cell.column.id}
                  canResize={cell.column.canResize}
                  isResizing={cell.column.isResizing}
                  resizerProps={cell.column.getResizerProps()}
                >
                  {isEditMode &&
                  cell.column.isEditable &&
                  !!selectedRows[cell.row.original[rowIdentifier]] ? (
                    cell.render('EditableCell', {
                      ...cell,
                      error: !!cell?.row?.original?.errorFields?.[
                        cell.column.id
                      ]
                    })
                  ) : loading ? (
                    <Shimmer width={Number(cell.column.width)} height={20} />
                  ) : (
                    cell.render('Cell', {
                      ...cell,
                      selectedRows,
                      loading,
                      isEditMode
                    })
                  )}
                  <ColumnResizerStyled
                    {...cell.column.getResizerProps()}
                    isResizing={cell.column.isResizing}
                  />
                </TableCell>
              )
          )}
        </TableRow>
      )
    },
    [
      prepareRow,
      rows,
      selectedRows,
      isEditMode,
      instance.state,
      loading,
      // rowHoverIndices,
      pinnedColumns,
      pinnedColumnsTotalWidth,
      hasRowSelection,
      hasRowSelectionWithEdit
    ]
  )

  const handleSelectAllColumns = React.useCallback(
    (isSelectAll?: boolean) => {
      if (isSelectAll) {
        setShowHideColumns((cList) =>
          cList.map((c) => ({ ...c, checked: true, disabled: false }))
        )
        setColumnCheckedCount(showHideColumns.length)
      } else {
        if (permanentColumns) {
          setShowHideColumns((cList) =>
            cList.map((c) => ({
              ...c,
              checked: permanentColumns?.[c.id],
              disabled: permanentColumns?.[c.id]
            }))
          )
          setColumnCheckedCount(Object.keys(permanentColumns).length)
        } else {
          setShowHideColumns((cList) =>
            cList.map((c, i) => ({ ...c, checked: i < 3, disabled: i < 3 }))
          )
          setColumnCheckedCount(3)
        }
      }
    },
    [showHideColumns]
  )

  const handleColumnShowHide = React.useCallback(
    (id, checked) => {
      setShowHideColumns((cList) =>
        cList.map((c) => {
          const isDisabled =
            !checked &&
            columnCheckedCount ===
              (permanentColumns ? Object.keys(permanentColumns).length : 3) + 1
          return c.id === id
            ? { ...c, checked, disabled: isDisabled && checked }
            : { ...c, disabled: isDisabled && c.checked }
        })
      )
      setColumnCheckedCount((count) => count + (checked ? 1 : -1))
    },
    [
      showHideColumns,
      columnCheckedCount,
      permanentColumns,
      setShowHideColumns,
      setColumnCheckedCount
    ]
  )
  // Render the UI for your table
  return (
    <ListViewStyled {...rest} ref={tableRef} loading={loading}>
      {/* TOOLBAR - Action Bar, Pagination Bar, etc. */}
      <Box
        bgColor='transparent'
        pb='1em'
        justifyContent='space-between'
        color='grey.A1000'
        className='toolbar'
      >
        <Box display='flex' justifyContent='space-between'>
          <Box display='flex'>
            {hasRowSelection || hasRowSelectionWithEdit ? ActionBar : ''}
          </Box>
          <Box flexShrink={1} display='flex'>
            {(() => {
              const selectedRowsCount = Object.keys(selectedRows).length
              return (
                !!selectedRowsCount && (
                  <Typography fontSize='13px'>
                    {selectedRowsCount} Selected
                  </Typography>
                )
              )
            })()}
            <PaginationWrapper
              instance={instance}
              totalRows={totalRows}
              onPageChange={onPageChange}
              isTotalCountLoading={false}
              moreResultsExists={false}
            />
            {IconBar}
            <Tooltip
              hover
              messagePlacement='end'
              arrowPlacement='center'
              tooltipDirection='bottom'
              message={`Updated on ${lastUpdated?.getDate()}, ${
                monthNamesShort[lastUpdated?.getMonth()]
              } ${lastUpdated?.getFullYear()} ${String(
                lastUpdated?.getHours()
              ).padStart(2, '0')}:${String(lastUpdated?.getMinutes()).padStart(
                2,
                '0'
              )}:${String(lastUpdated?.getSeconds()).padStart(2, '0')}`}
            >
              <IconButton
                onClick={handleRefresh}
                // title={`Updated on ${lastUpdated?.getDate()}, ${
                //   monthNamesShort[lastUpdated?.getMonth()]
                // } ${lastUpdated?.getFullYear()} ${String(
                //   lastUpdated?.getHours()
                // ).padStart(2, '0')}:${String(lastUpdated?.getMinutes()).padStart(
                //   2,
                //   '0'
                // )}:${String(lastUpdated?.getSeconds()).padStart(2, '0')}`}
                iconVariant='reload'
                iconSize={11}
                onlyIcon
                circle
                color='grey.A1000'
              />
            </Tooltip>
            <ShowHideColumnPopup
              checkBoxGroupArray={showHideColumns}
              selectedCount={columnCheckedCount}
              onCheckBoxChange={handleColumnShowHide}
              onSelectAll={handleSelectAllColumns}
              onOpen={onShowMoreColumns}
              onApply={(closeModal, withSave) => {
                if (columnCheckedCount > 50) {
                  toast.add(
                    'Cannot select more than 50 columns.',
                    'warning',
                    false
                  )
                  return
                }

                closeModal()
                setAppliedShowHideColumns(showHideColumns)
                const columnPreferences = {}
                const selectedColumns = {}
                showHideColumns.forEach((column) => {
                  toggleHideColumn(column.id, !column.checked)
                  if (column.checked) {
                    selectedColumns[column.id] = true
                  }
                })

                allColumns.forEach((column) => {
                  if (selectedColumns[column.id]) {
                    columnPreferences[column.id] = column
                  }
                })
                // visibleColumns.forEach((column) => {
                //   columnPreferences[column.id] = column
                // })
                setTimeout(() => {
                  setPinnedColumns((pC) => {
                    const _pC: IPinnedColumnState = {
                      left: {},
                      right: {}
                    }

                    let leftTotal = 0
                    let rightTotal = 0
                    let prevWidth = 0
                    Object.keys(pC.left).forEach((columnId) => {
                      const width =
                        document
                          .getElementById(`column-header-${columnId}`)
                          ?.getBoundingClientRect().width || 0
                      _pC.left[columnId] = {
                        offset: prevWidth,
                        width
                      }
                      leftTotal += width
                      prevWidth = width
                    })

                    prevWidth = 0
                    Object.keys(pC.right).forEach((columnId) => {
                      const width =
                        document
                          .getElementById(`column-header-${columnId}`)
                          ?.getBoundingClientRect().width || 0
                      _pC.right[columnId] = {
                        offset: prevWidth,
                        width
                      }
                      rightTotal += width
                      prevWidth = width
                    })

                    setPinnedColumnsTotalWidth({
                      left: leftTotal,
                      right: rightTotal
                    })
                    return _pC
                  })
                }, 1000)

                if (withSave) {
                  onSaveColumnPreferences(columnPreferences)
                } else {
                  onApply(selectedColumns)
                }
              }}
              onClickCancel={() => {
                if (appliedShowHideColumns) {
                  setShowHideColumns(appliedShowHideColumns)
                }
              }}
            />
          </Box>
        </Box>
      </Box>

      <div style={{ overflow: 'auto', display: 'flex', flexGrow: 1 }}>
        <TableStyled {...getTableProps()}>
          <TableHeadingContainer>
            {headerGroups.map((headerGroup: any, i: number) => (
              <div {...headerGroup.getHeaderGroupProps()} key={i}>
                {headerGroup.headers.map((column: any) => {
                  // console.log(headerGroup)
                  const columnHeaderProps = column.getHeaderProps()

                  if (
                    (column.id === 'selection' && !hasRowSelection) ||
                    (column.id === 'selectionWithEdit' &&
                      !hasRowSelectionWithEdit)
                  ) {
                    columnHeaderProps.style = {
                      ...columnHeaderProps.style,
                      display: 'none'
                    }
                  }

                  return (
                    ((column.id === 'selection' && hasRowSelection) ||
                      (column.id === 'selectionWithEdit' &&
                        hasRowSelectionWithEdit) ||
                      column.id !== 'selection' ||
                      column.id !== 'selectionWithEdit') && (
                      <TableHeadingStyled
                        key={column.id}
                        {...columnHeaderProps}
                        // title={column.Header}
                        title={undefined}
                        pinnedColumn={
                          pinnedColumns.left[column.id] ||
                          pinnedColumns.right[column.id]
                        }
                        direction={
                          pinnedColumns.left[column.id]
                            ? 'left'
                            : pinnedColumns.right[column.id]
                            ? 'right'
                            : undefined
                        }
                        className={column.isSortable && 'cursor'}
                        columnId={column.id}
                        id={`column-header-${column.id}`}
                      >
                        {column.id !== 'selection' &&
                          column.id !== 'selectionWithEdit' &&
                          !isColumnLoading && (
                            <ColumnOptions
                              instance={instance}
                              columnInstance={column}
                              columns={columns}
                              pinnedColumns={pinnedColumns}
                              pinnedColumnsTotalWidth={pinnedColumnsTotalWidth}
                              setPinnedColumns={setPinnedColumns}
                              setColumnCheckedCount={setColumnCheckedCount}
                              setShowHideColumns={setShowHideColumns}
                              setPinnedColumnsTotalWidth={
                                setPinnedColumnsTotalWidth
                              }
                              hideColumnSettings={false}
                            />
                          )}
                        <ColumnHeadingStyled
                          {...(column.isSortable === true
                            ? column.getSortByToggleProps()
                            : {})}
                          column={column}
                          title={
                            column?.infoTip ||
                            (typeof column.Header === 'string'
                              ? column.Header
                              : undefined)
                          }
                        >
                          <strong style={{ userSelect: 'none' }}>
                            {isColumnLoading &&
                            column.id !== 'selection' &&
                            column.id !== 'selectionWithEdit' ? (
                              <Shimmer
                                width={Number(column.width) - 50}
                                height={20}
                              />
                            ) : (
                              column.render('Header', {
                                selectedRows,
                                data,
                                loading,
                                isEditMode
                              })
                            )}
                          </strong>
                        </ColumnHeadingStyled>
                        {column.isFilterable && (
                          <Box mt='.75em'>
                            {isColumnLoading ? (
                              <ColumnFilterLoading />
                            ) : (
                              column.render('Filter', {
                                textFieldProps: getTextFieldProps(column),
                                selectFieldProps: getSelectFieldProps(column),
                                filters,
                                setFilters
                              })
                            )}
                          </Box>
                        )}
                        {!isColumnLoading &&
                          column.id !== 'selection' &&
                          column.id !== 'selectionWithEdit' && (
                            <ColumnResizerStyled
                              {...column.getResizerProps()}
                              isResizing={column.isResizing}
                            />
                          )}
                      </TableHeadingStyled>
                    )
                  )
                })}
              </div>
            ))}
          </TableHeadingContainer>
          {/* {loading && <Loader fadeBackground center speed={4} />} */}
          <TableBodyStyled {...getTableBodyProps()} style={{ display: 'flex' }}>
            {rows.length === 0 && NoDataFound}
            {tableMounted && (
              <React.Fragment>
                <FixedSizeList
                  height={
                    tableRef?.current?.offsetHeight
                      ? tableRef?.current?.offsetHeight - 130
                      : 400
                  }
                  itemCount={rows.length}
                  itemSize={30}
                  width={`${pinnedColumnsTotalWidth.left}px`}
                  style={{
                    overflow: loading ? 'hidden' : 'hidden auto',
                    position: 'sticky',
                    left: 0,
                    zIndex: 2,
                    backgroundColor: 'white',
                    minWidth: `${pinnedColumnsTotalWidth.left}px`
                  }}
                  className='hideScroll'
                  overscanCount={pageSize > 50 ? 5 : 10}
                  onScroll={(e) => onScroll(e, 'left')}
                  ref={pinnedGridLeft}
                >
                  {RenderPinned('left')}
                </FixedSizeList>
                <FixedSizeList
                  height={
                    tableRef?.current?.offsetHeight
                      ? tableRef?.current?.offsetHeight - 130
                      : 400
                  }
                  overscanCount={pageSize > 50 ? 5 : 10}
                  itemCount={rows.length}
                  itemSize={30}
                  width='100%'
                  className={
                    pinnedColumnsTotalWidth.right > 0 ? 'hideScroll' : ''
                  }
                  style={{
                    overflow: loading ? 'hidden' : 'hidden auto',
                    zIndex: 1
                  }}
                  onScroll={(e) => onScroll(e, 'middle')}
                  ref={gridMiddle}
                >
                  {RenderRow}
                </FixedSizeList>
                <FixedSizeList
                  height={
                    tableRef?.current?.offsetHeight
                      ? tableRef?.current?.offsetHeight - 130
                      : 400
                  }
                  itemCount={rows.length}
                  itemSize={30}
                  width={`${pinnedColumnsTotalWidth.right}px`}
                  className={
                    pinnedColumnsTotalWidth.right > 0 ? '' : 'hideScroll'
                  }
                  style={{
                    overflow: loading ? 'hidden' : 'hidden auto',
                    position: 'sticky',
                    right: 0,
                    zIndex: 2,
                    backgroundColor: 'white',
                    minWidth: `${pinnedColumnsTotalWidth.right}px`
                  }}
                  onScroll={(e) => onScroll(e, 'right')}
                  ref={pinnedGridRight}
                >
                  {RenderPinned('right')}
                </FixedSizeList>
              </React.Fragment>
            )}
          </TableBodyStyled>
        </TableStyled>
      </div>
    </ListViewStyled>
  )
}

export default ListView
export { ListView }
