/**
 * https://codesandbox.io/s/react-window-sticky-grid-liwsd?file=/src/index.js:2997-3014
 */
 import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  forwardRef,
  createContext
} from 'react'
import {
  // FixedSizeList,
  // ListOnScrollProps,
  // ListChildComponentProps,
  GridChildComponentProps,
  VariableSizeGrid,
  // GridOnScrollProps,
  areEqual
} from 'react-window'
import {
  useTable,
  useFlexLayout,
  useResizeColumns,
  useSortBy,
  usePagination,
  useFilters,
  useColumnOrder,
  ColumnInstance,
  Row
} from 'react-table'
import Box from '../../atoms/Box'
// import FontIcon from '../../atoms/FontIcon'
import PaginationWrapper from './utils/components/PaginationWrapper'
import {
  defaultColumn,
  combinedSortOptions,
  handleCellMouseEnter,
  handleCellMouseLeave,
  getRenderedCursor,
  calculateColumnsWidth
} from './utils/helpers'
// import Loader from '../../atoms/Loader'
import { useCustomFilters } from './utils/useCustomFilters'
import {
  IListViewProps,
  IPinnedColumnState,
  ISelectedRows,
  IListViewRow,
  IPinnedColumnTotalWidthState,
  IFilterOptions,
  IListViewColumn,
  IFetchDataOptions
} from './interfaces'
import IconButton from '../../atoms/IconButton'
import ListViewStyled from './styles/ListViewStyled'
import TableStyled from './styles/TableStyled'
import TableBodyStyled from './styles/TableBodyStyled'
import ColumnResizerStyled from './styles/ColumnResizerStyled'
import ShowHideColumnPopup from '../../molecules/ShowHideColumnPopup'
import NoDataFoundComponent from './styles/NoDataFound'

import { monthNamesShort } from '../../../utilities/helpers'
import { IOptionType } from '../../atoms/CheckboxGroup'
import Typography from '../../atoms/Typography'

import { Shimmer } from 'react-shimmer'

import { useToast } from '../../molecules/Toast'
import Tooltip from '../../molecules/Tooltip'
import HeaderSelectAll from './utils/components/HeaderSelectAll'
import RowSelectCell from './utils/components/RowSelectCell'
import { TableCellStyledNew } from './styles/TableGridStyles'
import Position from '../../molecules/Position'

import TableHeaderCell from './utils/components/TableHeaderCell'
import ColumnOptions from './utils/components/ColumnOptions'
import ColumnHeadingStyled from './styles/ColumnHeadingStyled'
import TableHeadingContainer from './styles/TableHeadingContainer'
import TableHeadingStyled from './styles/TableHeadingStyled'
import ColumnFilterLoading from './styles/ColumnFilterLoading'
import ScrollOverlay from './styles/ScrollOverlay'
import FontIcon from '../../atoms/FontIcon'
import FavouriteStarStyle from './styles/FavouriteStarStyle'

const defaultCallback = () => {}
const StickyGridContext = createContext<any>({})

StickyGridContext.displayName = 'StickyGridContext'

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
  hasSelectAllRows = true,
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
  hideRefresh = false,
  hideColumnSettings = false,
  hidePaginationBar = false,
  onResize = defaultCallback,
  disableScrollOverlay = false,
  hideToolbar = false,
  heightBuffer = 42,
  rowSelectionResetter = 0,
  isTotalCountLoading = false,
  moreResultsExists = false,
  hasRadioSelection,
  labels,
  showFavouriteStar = false,
  disableNext = false,
  ...rest
}: IListViewProps) => {
  const [pageCount, setPageCount] = useState<number>(Math.ceil(totalRows / 25))
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({})
  const [fetchDataRequestObj, setFetchDataRequestObj] = useState<IFetchDataOptions>({})
  const [tableMounted, setTableMounted] = useState<boolean>(false)
  const [resetRowSelection, setResetRowSelection] = useState<number>(rowSelectionResetter)
  const tableRef = useRef<HTMLDivElement | null>(null)
  const toast = useToast()

  const [height, setHeight] = useState<number>(400)
  const [gridWidth, setGridWidth] = useState<number>(400)

  const [rowHtPixel] = useState<number>(30)
  const [tableHtPixel, setTableHtPixel] = useState<number>(rowHtPixel*25)

  React.useLayoutEffect(() => {
    setHeight(
      (tableRef.current?.getBoundingClientRect().height || 0) - heightBuffer
    )
    setGridWidth(tableRef.current?.getBoundingClientRect().width || 0)

    window.addEventListener('resize', () => {
      setHeight(
        (tableRef.current?.getBoundingClientRect().height || 0) - heightBuffer
      )
      setGridWidth(tableRef.current?.getBoundingClientRect().width || 0)
      onResize()
    })
  }, [])

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
      // hasRadioSelection,
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

      const rowSelectColumns: any[] = []
      if (hasRowSelection) {
        rowSelectColumns.push({
          id: 'selection',
          width: 40,
          maxWidth: 40,
          isVisible: hasRowSelection,
          /** Header Select all Checkbox */
          Header: HeaderSelectAll,

          /** Row-level checkbox */
          Cell: RowSelectCell
        })
      }
      if (hasRowSelectionWithEdit) {
        rowSelectColumns.push({
          id: 'selectionWithEdit',
          width: 50,
          maxWidth: 50,
          isVisible: hasRowSelectionWithEdit,
          /** Header Select all Checkbox */
          Header: HeaderSelectAll,
          /** Row-level checkbox */
          Cell: RowSelectCell
        })
      }
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        ...rowSelectColumns,
        ...columns
      ])
    }
  )

  const {
    rows,
    allColumns,
    headerGroups,
    // getTableProps,
    getTableBodyProps,
    prepareRow,
    toggleHideColumn,
    visibleColumns,
    gotoPage,
    totalColumnsWidth,
    // setHiddenColumns,
    state: { sortBy, pageSize, pageIndex }
  } = instance

  const [showHideColumns, setShowHideColumns] = useState<IOptionType[]>(() => {
    let visibleCount = 0
    const filteredColumns = allColumns.filter((column) => {
      if (column.isVisible) {
        visibleCount++
      }
      return column.id !== 'selection' && column.id !== 'selectionWithEdit'
    })

    return filteredColumns.map((column) => ({
      id: column.id,
      value: (column.Header as string) || '',
      checked: column.isVisible !== false,
      disabled: visibleCount <= 3 && column.isVisible !== false
    }))
  })

  const [appliedShowHideColumns, setAppliedShowHideColumns] = useState<
    IOptionType[]
  >([...showHideColumns])

  const [columnCheckedCount, setColumnCheckedCount] = useState<number>(
    visibleColumns.length +
      (hasRowSelection || hasRowSelectionWithEdit ? -1 : 0)
  )

  // filtaralable columns count
  const filterableColumnsCount = React.useMemo(() => {
    return columns.filter((column: IListViewColumn) => column?.isFilterable)
      .length
  }, [columns])

  useEffect(() => {
    let visibleColumnsCount = 0
    const newColumns = columns
      .map((column) => {
        if (column.isVisible !== false) {
          visibleColumnsCount++
        }

        return {
          id: column.accessor,
          value: (column.Header as string) || '',
          checked: column.isVisible !== false
        }
      })
      .map((column) => {
        if (visibleColumnsCount <= 3 && column.checked) {
          return { ...column, disabled: true }
        } else {
          return column
        }
      })
    setShowHideColumns(newColumns)
    setAppliedShowHideColumns([...newColumns])
    setColumnCheckedCount(visibleColumnsCount)
    gridMiddle.current?.resetAfterColumnIndex(0, true)
  }, [columns])

  useEffect(() => {
    if (Object.keys(fetchDataRequestObj).length > 0) {   // not empty condition
      onFetchData(fetchDataRequestObj)
    }
  }, [fetchDataRequestObj])
  
  useEffect(() => {
    setSelectedRows({})
  }, [resetRowSelection])

  useEffect(() => {
    setResetRowSelection(rowSelectionResetter)
  }, [rowSelectionResetter])
  
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

    gridMiddle.current?.resetAfterColumnIndex(0, true)
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
    gridMiddle.current?.resetAfterColumnIndex(0, true)
  }, [hasRowSelectionWithEdit])

  /** Re-Calculate pageCount whenever totalRows or pageSize chanages */
  useEffect(() => {
    setPageCount(Math.ceil(totalRows / pageSize))
  }, [totalRows, pageSize])  
  
  React.useLayoutEffect(() => {
    if (gridMiddle && gridMiddle.current && pageSize) {
      var theElemForRollScParent = gridMiddle.current["_outerRef"]
      var theElemForRollSc =  theElemForRollScParent?.childNodes[0] as HTMLDivElement
      var visibleRows = data.length < pageSize ? data.length : pageSize
      theElemForRollSc.style.height = `${rowHtPixel * visibleRows}px`
      setTableHtPixel(rowHtPixel * visibleRows)
    }  
  }, [pageSize, data.length])

  /** Callback when sort changes */
  useEffect(() => {
    onSortChange(combinedSortOptions(sortBy), sortBy)
  }, [sortBy])

  /** To Prevent calling extra onFetchData on inital load */
  const [prevFilters, setPrevFilters] = useState<IFilterOptions>()
  useEffect(() => {
    if (pageIndex === 0) {
      const combFilters = combinedFilterOptions()
      if (
        combFilters.searchBy !== prevFilters?.searchBy ||
        combFilters.searchText !== prevFilters?.searchText
      ) {
        setFetchDataRequestObj({
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

        setPrevFilters(combFilters)
      }
    } else {
      gotoPage(0)
    }
    setSelectedRows({})
  }, [filters])

  /** Callback when Re-fetching server side data is required */
  useEffect(() => {
    // setLastUpdated(new Date())
    setFetchDataRequestObj({
      pageSize,
      pageNumber: pageIndex + 1,
      sortOptions: combinedSortOptions(sortBy),
      filterOptions: combinedFilterOptions(),
      apis: {
        setSelection: setSelectedRows,
        resetSelection: () => setSelectedRows({})
      }
    })
  }, [sortBy, pageSize, pageIndex])

  useEffect(() => {
    if (pageIndex === 0) {
      setFetchDataRequestObj({
        pageSize,
        pageNumber: 1,
        sortOptions: combinedSortOptions(sortBy),
        filterOptions: combinedFilterOptions(),
        apis: {
          setSelection: setSelectedRows,
          resetSelection: () => setSelectedRows({})
        }
      })
    } else {
      gotoPage(0)
    }
    setSelectedRows({})
  }, [onFetchData])

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

  const gridMiddle = React.useRef<VariableSizeGrid>(null)

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

  /** To adjust the Width of columns when columns are less than available space
   * UseEffect on change of Columns
   * UseEffect on change of appliedShowHideColumns (Visibility Toggle)
   */

  useEffect(() => {
    // const pinnedLeftCount = Object.keys(pinnedColumns.left).length
    // const pinnedRightCount = Object.keys(pinnedColumns.right).length

    // for (let i = 0; i < pinnedLeftCount; i++) {
    //   gridMiddle.current?.resetAfterColumnIndex(i, true)
    // }
    // for (let i = 0; i < pinnedRightCount; i++) {
    //   gridMiddle.current?.resetAfterColumnIndex(
    //     visibleColumns.length - i - 1,
    //     true
    //   )
    // }
    gridMiddle.current?.resetAfterColumnIndex(0, true)
  }, [pinnedColumns])

  const RenderCellItemData = React.useMemo(
    () => ({
      rows,
      pinnedColumns,
      isEditMode,
      loading,
      selectedRows,
      rowIdentifier
    }),
    [rows, pinnedColumns, isEditMode, loading, selectedRows, rowIdentifier]
  )

  const RenderCell = React.memo(
    ({ columnIndex, rowIndex, style, data }: GridChildComponentProps) => {
      const {
        rows,
        pinnedColumns,
        isEditMode,
        loading,
        selectedRows,
        rowIdentifier
      } = data
      const row = rows[rowIndex]
      prepareRow(row)
      const cell = row.cells[columnIndex]

      let classNames = `cell--hover${rowIndex}`
      classNames += ` ${
        selectedRows[cell.row.original[rowIdentifier]] ? 'selected' : ''
      }`
      classNames += ` ${rowIndex === rows.length - 1 ? 'last-row' : ''}`

      if (
        pinnedColumns.left[cell.column.id] ||
        pinnedColumns.right[cell.column.id] ||
        cell.column.id === 'selection' ||
        cell.column.id === 'selectionWithEdit'
      ) {
        return null
      }

      return (
        cell &&
        cell.column && (
          <TableCellStyledNew
            {...cell.getCellProps()}
            style={style}
            onMouseEnter={() => handleCellMouseEnter(rowIndex)}
            onMouseLeave={() => handleCellMouseLeave(rowIndex)}
            className={classNames}
          >
            {isEditMode &&
            cell.column.isEditable &&
            !!selectedRows[cell.row.original[rowIdentifier]] ? (
              cell.render('EditableCell', {
                ...cell,
                error: !!cell?.row?.original?.errorFields?.[cell.column.id]
              })
            ) : loading ? (
              <Shimmer width={Number(cell.column.width)} height={20} />
            ) : (
              cell.render('Cell', {
                ...cell,
                selectedRows,
                loading,
                isEditMode,
                hasRadioSelection
              })
            )}

            <ColumnResizerStyled
              {...cell.column.getResizerProps()}
              isResizing={cell.column.isResizing}
            />
          </TableCellStyledNew>
        )
      )
    },
    areEqual
  )

  const headerBuilder = (
    minColumn: number,
    maxColumn: number,
    visibleColumns: ColumnInstance<IListViewRow>[],
    pinnedColumns: IPinnedColumnState
  ) => {
    const columns = []

    for (let i = minColumn; i <= maxColumn; i++) {
      if (
        !pinnedColumns.left[visibleColumns[i]?.id] &&
        !pinnedColumns.right[visibleColumns[i]?.id]
      ) {
        columns.push({
          position: 'absolute',
          top: 0,
          height: 'auto',
          width: visibleColumns[i].width,
          left: visibleColumns[i].totalLeft,
          columnInstance: visibleColumns[i],
          accessor: visibleColumns[i].id
        })
      }
    }

    return columns
  }
  const headerBuilderPinnedLeft = (
    visibleColumns: ColumnInstance<IListViewRow>[],
    pinnedColumns: IPinnedColumnState
  ) => {
    const columns = []

    const pinnedLeftCount = Object.keys(pinnedColumns.left).length
    for (let i = 0; i < pinnedLeftCount + 3; i++) {
      if (pinnedColumns.left[visibleColumns[i]?.id]) {
        columns.push({
          position: 'absolute',
          top: 0,
          height: 'auto',
          width: visibleColumns[i].width,
          // left: visibleColumns[i].totalLeft,
          left: pinnedColumns.left[visibleColumns[i].id].offset,
          columnInstance: visibleColumns[i],
          accessor: visibleColumns[i].id
        })
      }
    }

    return columns
  }

  const headerBuilderPinnedRight = (
    visibleColumns: ColumnInstance<IListViewRow>[],
    pinnedColumns: IPinnedColumnState
  ) => {
    const columns = []

    const pinnedRightCount = Object.keys(pinnedColumns.right).length

    for (
      let i = visibleColumns.length - 1;
      i >= visibleColumns.length - pinnedRightCount;
      i--
    ) {
      if (pinnedColumns.right[visibleColumns[i]?.id]) {
        columns.push({
          position: 'absolute',
          top: 0,
          height: 'auto',
          width: visibleColumns[i].width,
          // left: visibleColumns[i].totalLeft,
          right: pinnedColumns.right[visibleColumns[i].id].offset,
          columnInstance: visibleColumns[i],
          accessor: visibleColumns[i].id
        })
      }
    }

    return columns
  }

  const pinnedLeftBuilder = (
    minRow: number,
    maxRow: number,
    rows: Row<IListViewRow>[],
    pinnedColumns: IPinnedColumnState
  ) => {
    const cells = []

    const pinnedLeftCount = Object.keys(pinnedColumns.left).length
    for (let i = minRow; i <= maxRow; i++) {
      prepareRow(rows[i])
      for (let j = 0; j < pinnedLeftCount + 3; j++) {
        if (
          rows[i]?.cells[j]?.column &&
          pinnedColumns.left[rows[i].cells[j]?.column?.id]
        ) {
          cells.push({
            position: 'absolute',
            cellInstance: rows[i].cells[j],
            width: rows[i].cells[j].column?.width,
            height: rowHtPixel,
            left: pinnedColumns.left[rows[i].cells[j]?.column?.id]?.offset,
            top: i * rowHtPixel
          })
        }
      }
    }

    return cells
  }
  const pinnedRightBuilder = (
    minRow: number,
    maxRow: number,
    rows: Row<IListViewRow>[],
    pinnedColumns: IPinnedColumnState
  ) => {
    const cells = []

    const pinnedRightCount = Object.keys(pinnedColumns.right).length
    for (let i = minRow; i <= maxRow; i++) {
      prepareRow(rows[i])
      for (
        let j = rows[i].cells.length - 1;
        j >= rows[i].cells.length - pinnedRightCount;
        j--
      ) {
        if (
          rows[i]?.cells[j]?.column &&
          pinnedColumns.right[rows[i].cells[j]?.column?.id]
        ) {
          cells.push({
            position: 'absolute',
            cellInstance: rows[i].cells[j],
            width: rows[i].cells[j].column?.width,
            height: rowHtPixel,
            right: pinnedColumns.right[rows[i].cells[j]?.column?.id]?.offset,
            top: i * rowHtPixel
          })
        }
      }
    }

    return cells
  }

  const innerGridElementType = forwardRef<HTMLDivElement, any>(
    ({ children, ...rest }, ref) => {
      // const columnsContainerRef = useRef<HTMLDivElement | null>(null)

      const [minRow, maxRow, minColumn, maxColumn] = getRenderedCursor(children)

      return (
        <StickyGridContext.Consumer>
          {({
            pinnedColumns,
            pinnedColumnsTotalWidth,
            selectedRows,
            data,
            loading,
            isEditMode,
            setSelectedRows,
            onRowSelect,
            rowIdentifier,
            isColumnLoading,
            visibleColumns,
            instance,
            columns,
            filters,
            setFilters,
            rows,
            hasRowSelection,
            hasRowSelectionWithEdit,
            onRowEditClick,
            filterableColumnsCount,
            hasRadioSelection
          }) => {
            const displayColumns = headerBuilder(
              minColumn,
              maxColumn,
              visibleColumns,
              pinnedColumns
            )

            const displayColumnsPinnedLeft = headerBuilderPinnedLeft(
              visibleColumns,
              pinnedColumns
            )

            const displayColumnsPinnedRight = headerBuilderPinnedRight(
              visibleColumns,
              pinnedColumns
            )

            const displayPinnedLeftRows = pinnedLeftBuilder(
              minRow,
              maxRow,
              rows,
              pinnedColumns
            )

            const displayPinnedRightRows = pinnedRightBuilder(
              minRow,
              maxRow,
              rows,
              pinnedColumns
            )
            var modifiedRest = {...rest}
            modifiedRest.style.height = tableHtPixel
            return (
              <>
                <Position
                  type='relative'
                  className='list-container'
                  {...modifiedRest}
                  ref={ref}
                >
                  <div
                    className='columns-container'
                    style={{
                      width: `calc(100% + ${pinnedColumnsTotalWidth.left}px + ${pinnedColumnsTotalWidth.right}px)`,
                      height: filterableColumnsCount === 0 ? '45px' : '70px',
                      backgroundColor: '#fff'
                    }}
                  >
                    <div
                      className='pinned-left-overlap'
                      style={{
                        width: pinnedColumnsTotalWidth.left + 'px',
                        minWidth: pinnedColumnsTotalWidth.left + 'px'
                      }}
                    >
                      {displayColumnsPinnedLeft.map(
                        ({ left, height, width, columnInstance }) => {
                          return (
                            <Position
                              key={columnInstance.id}
                              type='absolute'
                              left={left + 'px'}
                              style={{ height, width, minWidth: width }}
                            >
                              <TableHeaderCell
                                {...{
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
                                  hasSelectAllRows,
                                  onRowSelect,
                                  rowIdentifier,
                                  filters,
                                  setFilters,
                                  getTextFieldProps,
                                  getSelectFieldProps,
                                  hideColumnSettings,
                                  hasRadioSelection
                                }}
                              />
                            </Position>
                          )
                        }
                      )}
                    </div>
                    <div
                      style={{
                        position: 'relative',
                        width: '100%'
                      }}
                    >
                      {displayColumns.map(
                        ({ left, height, width, columnInstance }) => {
                          if (columnInstance.isResizing) {
                            gridMiddle.current?.resetAfterColumnIndex(0, false)
                          }
                          return (
                            <Position
                              key={columnInstance.id}
                              type='absolute'
                              left={left - pinnedColumnsTotalWidth.left + 'px'}
                              style={{ height, width }}
                            >
                              <TableHeaderCell
                                {...{
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
                                  hasRadioSelection
                                }}
                              />
                            </Position>
                          )
                        }
                      )}
                    </div>
                    <div
                      className='pinned-right-overlap'
                      style={{ width: pinnedColumnsTotalWidth.right + 'px' }}
                    >
                      {displayColumnsPinnedRight.map(
                        ({ right, height, width, columnInstance }) => {
                          return (
                            <Position
                              key={columnInstance.id}
                              type='absolute'
                              right={right + 'px'}
                              style={{ height, width }}
                            >
                              <TableHeaderCell
                                {...{
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
                                  hasRadioSelection
                                }}
                              />
                            </Position>
                          )
                        }
                      )}
                    </div>
                  </div>

                  <div
                    className='rows-container'
                    style={{
                      top: filterableColumnsCount === 0 ? '45px' : '70px'
                    }}
                  >
                    <div
                      className='pinned-left-container'
                      style={{ width: pinnedColumnsTotalWidth.left + 'px' }}
                    >
                      {displayPinnedLeftRows.map(
                        ({ cellInstance, width, height, top, left }, j) => {
                          const rowIndex = cellInstance.row.index
                          let classNames = `cell--hover${rowIndex}`
                          classNames += ` ${
                            selectedRows[
                              cellInstance.row.original[rowIdentifier]
                            ]
                              ? 'selected'
                              : ''
                          }`
                          classNames += ` ${
                            rowIndex === rows.length - 1 ? 'last-row' : ''
                          }`

                          return (
                            <div
                              style={{
                                display: 'flex',
                                position: 'absolute',
                                width: `${width}px`,
                                height: `${height}px`,
                                top: `${top}px`,
                                left: `${left}px`
                              }}
                              key={j}
                            >
                              <TableCellStyledNew
                                {...cellInstance.getCellProps()}
                                className={classNames}
                                key={
                                  'Table Cell' +
                                  cellInstance.row.original[rowIdentifier] +
                                  cellInstance.column.id
                                }
                                onMouseEnter={() =>
                                  handleCellMouseEnter(cellInstance.row.index)
                                }
                                onMouseLeave={() =>
                                  handleCellMouseLeave(cellInstance.row.index)
                                }
                              >
                                {isEditMode &&
                                cellInstance.column.isEditable &&
                                !!selectedRows[
                                  cellInstance.row.original[rowIdentifier]
                                ]
                                  ? cellInstance.render('EditableCell', {
                                      ...cellInstance,
                                      error: !!cellInstance?.row?.original
                                        ?.errorFields?.[cellInstance.column.id]
                                    })
                                  : cellInstance.render('Cell', {
                                      ...cellInstance,
                                      selectedRows,
                                      setSelectedRows,
                                      hasRowSelection,
                                      hasRowSelectionWithEdit,
                                      onRowSelect,
                                      onRowEditClick,
                                      rowIdentifier,
                                      loading,
                                      isEditMode,
                                      row: cellInstance.row,
                                      rowCount: data.length,
                                      hasRadioSelection
                                    })}
                              </TableCellStyledNew>
                              {showFavouriteStar && (
                                <FavouriteStarStyle
                                  className={`${
                                    selectedRows[
                                      cellInstance.row.original[rowIdentifier]
                                    ]
                                      ? 'selected'
                                      : ''
                                  }`}
                                >
                                  {cellInstance.row.original.isFavourite && (
                                    <FontIcon
                                      variant='star-filled'
                                      color='primary.main'
                                      size='sm'
                                    />
                                  )}
                                </FavouriteStarStyle>
                              )}
                            </div>
                          )
                        }
                      )}
                    </div>
                    <div
                      className='data-container'
                      style={{ width: `${rest.style.width}px` }}
                    >
                      {children}
                    </div>
                    <div
                      className='pinned-right-container'
                      style={{ width: pinnedColumnsTotalWidth.right + 'px' }}
                    >
                      {displayPinnedRightRows.map(
                        ({ cellInstance, width, height, top, right }, j) => {
                          const rowIndex = cellInstance.row.index
                          let classNames = `cell--hover${rowIndex}`
                          classNames += ` ${
                            selectedRows[
                              cellInstance.row.original[rowIdentifier]
                            ]
                              ? 'selected'
                              : ''
                          }`
                          classNames += ` ${
                            rowIndex === rows.length - 1 ? 'last-row' : ''
                          }`

                          return (
                            <div
                              style={{
                                position: 'absolute',
                                width: `${width}px`,
                                height: `${height}px`,
                                top: `${top}px`,
                                right: `${right}px`
                              }}
                              key={j}
                            >
                              <TableCellStyledNew
                                {...cellInstance.getCellProps()}
                                className={classNames}
                                key={
                                  'Table Cell' +
                                  cellInstance.row.original[rowIdentifier] +
                                  cellInstance.column.id
                                }
                                onMouseEnter={() =>
                                  handleCellMouseEnter(cellInstance.row.index)
                                }
                                onMouseLeave={() =>
                                  handleCellMouseLeave(cellInstance.row.index)
                                }
                              >
                                {isEditMode &&
                                cellInstance.column.isEditable &&
                                !!selectedRows[
                                  cellInstance.row.original[rowIdentifier]
                                ]
                                  ? cellInstance.render('EditableCell', {
                                      ...cellInstance,
                                      error: !!cellInstance?.row?.original
                                        ?.errorFields?.[cellInstance.column.id]
                                    })
                                  : cellInstance.render('Cell', {
                                      ...cellInstance,
                                      selectedRows,
                                      setSelectedRows,
                                      hasRowSelection,
                                      hasRowSelectionWithEdit,
                                      onRowSelect,
                                      onRowEditClick,
                                      rowIdentifier,
                                      loading,
                                      isEditMode,
                                      hasRadioSelection,
                                      row: cellInstance.row,
                                      rowCount: data.length
                                    })}
                              </TableCellStyledNew>
                            </div>
                          )
                        }
                      )}
                    </div>
                  </div>
                </Position>
              </>
            )
          }}
        </StickyGridContext.Consumer>
      )
    }
  )
  // Render the UI for your table
  return (
    <ListViewStyled
      {...rest}
      ref={tableRef}
      loading={loading}
      showFavouriteStar={showFavouriteStar}
    >
      {/* TOOLBAR - Action Bar, Pagination Bar, etc. */}
      {!hideToolbar && (
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
              {!hidePaginationBar && (
                <PaginationWrapper
                  instance={instance}
                  totalRows={totalRows}
                  isTotalCountLoading={isTotalCountLoading}
                  onPageChange={onPageChange}
                  moreResultsExists={moreResultsExists}
                  loading={loading}
                  disableNext={disableNext}
                />
              )}
              {IconBar}
              {!hideRefresh && (
                <Tooltip
                  hover
                  messagePlacement='end'
                  arrowPlacement='center'
                  tooltipDirection='bottom'
                  message={`Updated on ${lastUpdated?.getDate()}, ${
                    monthNamesShort[lastUpdated?.getMonth()]
                  } ${lastUpdated?.getFullYear()} ${String(
                    lastUpdated?.getHours()
                  ).padStart(2, '0')}:${String(
                    lastUpdated?.getMinutes()
                  ).padStart(2, '0')}:${String(
                    lastUpdated?.getSeconds()
                  ).padStart(2, '0')}`}
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
                    iconSize={12}
                    onlyIcon
                    circle
                    color='grey.A1000'
                  />
                </Tooltip>
              )}
              {!hideColumnSettings && (
                <ShowHideColumnPopup
                  checkBoxGroupArray={showHideColumns}
                  selectedCount={columnCheckedCount}
                  onCheckBoxChange={handleColumnShowHide}
                  onSelectAll={handleSelectAllColumns}
                  onOpen={onShowMoreColumns}
                  onApply={(closeModal, withSave) => {
                    if (columnCheckedCount > 50) {
                      toast.add(
                        labels?.columnSelectionExceedingLimit ||
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
                    const checkedColumns = columns.filter(
                      (column) => column.isVisible
                    )
                    setColumnCheckedCount(checkedColumns?.length)
                    if (appliedShowHideColumns) {
                      setShowHideColumns(appliedShowHideColumns)
                    }
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>
      )}

      <div style={{ overflow: 'auto', display: 'flex', flexGrow: 1 }}>
        <TableStyled>
          {rows.length === 0 && (
            <TableHeadingContainer style={{ width: totalColumnsWidth }}>
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
                                pinnedColumnsTotalWidth={
                                  pinnedColumnsTotalWidth
                                }
                                setPinnedColumns={setPinnedColumns}
                                setColumnCheckedCount={setColumnCheckedCount}
                                setShowHideColumns={setShowHideColumns}
                                setPinnedColumnsTotalWidth={
                                  setPinnedColumnsTotalWidth
                                }
                                hideColumnSettings={hideColumnSettings}
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
                            <Box mt='12px'>
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
          )}
          <TableBodyStyled
            {...getTableBodyProps()}
            style={{ display: 'flex', position: 'relative' }}
          >
            {rows.length === 0 && NoDataFound}

            {tableMounted && rows.length > 0 && (
              <React.Fragment>
                <StickyGridContext.Provider
                  value={{
                    pinnedColumns,
                    pinnedColumnsTotalWidth,
                    visibleColumns,
                    selectedRows,
                    data,
                    loading,
                    isEditMode,
                    setSelectedRows,
                    onRowSelect,
                    rowIdentifier,
                    isColumnLoading,
                    instance,
                    columns,
                    filters,
                    setFilters,
                    rows,
                    hasRowSelection,
                    hasRowSelectionWithEdit,
                    onRowEditClick,
                    filterableColumnsCount,
                    hasRadioSelection
                  }}
                >
                  {!disableScrollOverlay && (
                    <ScrollOverlay className='scroll-overlay' />
                  )}
                  <VariableSizeGrid
                    className='variable-size-grid'
                    height={height}
                    style={{
                      overflow: 'overlay',
                      paddingBottom: '10px',
                      overflowY: 'scroll'
                    }}
                    rowHeight={() => rowHtPixel}
                    columnWidth={(index) =>
                      visibleColumns[index].id === 'selection' ||
                      visibleColumns[index].id === 'selectionWithEdit' ||
                      pinnedColumns.left[visibleColumns[index].id] ||
                      pinnedColumns.right[visibleColumns[index].id]
                        ? 0
                        : (visibleColumns[index].width as number) < 150
                        ? 150
                        : (visibleColumns[index].width as number)
                    }
                    width={gridWidth}
                    ref={gridMiddle}
                    rowCount={data.length}
                    columnCount={visibleColumns.length}
                    itemData={RenderCellItemData}
                    innerElementType={innerGridElementType}
                    // onScroll={handleScrollMain}
                    // className={
                    //   pinnedColumnsTotalWidth.right > 0 ? 'hideScroll' : ''
                    // }
                  >
                    {RenderCell}
                  </VariableSizeGrid>
                </StickyGridContext.Provider>
              </React.Fragment>
            )}
          </TableBodyStyled>
        </TableStyled>
      </div>
    </ListViewStyled>
  )
}

const LVMemo = React.memo(ListView, (p, n) => {
  return p.loading === n.loading && n.loading === true
})

const ListViewMemoized = ({
  columns = [],
  onSaveColumnPreferences = defaultCallback,
  onApply = defaultCallback,
  ...rest
}: IListViewProps) => {
  const [columnsWithWidth, setColumnsWithWidth] = useState<IListViewColumn[]>(
    []
  )

  /** Container of List View */
  const containerRef = React.useRef<HTMLDivElement | null>(null)

  /** Calculate Available container space, i.e, exclude checkbox column (Row Selection) */
  const getAvailableContainerWidth = React.useCallback(() => {
    const { hasRowSelection, hasRowSelectionWithEdit } = rest
    const selectionColumnWidth = hasRowSelectionWithEdit
      ? 50
      : hasRowSelection
      ? 40
      : 0
    const containerWidth =
      (containerRef.current?.getBoundingClientRect().width || 100) -
      selectionColumnWidth

    return containerWidth
  }, [rest.hasRowSelection, rest.hasRowSelectionWithEdit])

  React.useLayoutEffect(() => {
    const containerWidth = getAvailableContainerWidth()
    setColumnsWithWidth(calculateColumnsWidth(columns, containerWidth))
  }, [columns])

  const handleApply = React.useCallback(
    (selectedColumns: Record<string, boolean>) => {
      setColumnsWithWidth((cols) => {
        const colsWithNewVisibility = cols.map((c) => ({
          ...c,
          isVisible: !!selectedColumns?.[c.accessor],
          width: undefined
        }))
        const containerWidth = getAvailableContainerWidth()
        return calculateColumnsWidth(colsWithNewVisibility, containerWidth)
      })
      onApply(selectedColumns)
    },
    [setColumnsWithWidth, onApply]
  )

  const handleSaveColumnPreferences = React.useCallback(
    (visibleColumnIds: Record<string, ColumnInstance<IListViewColumn>>) => {
      setColumnsWithWidth((cols) => {
        const colsWithNewVisibility = cols.map((c) => ({
          ...c,
          isVisible: !!visibleColumnIds?.[c.accessor],
          width: undefined
        }))
        const containerWidth = getAvailableContainerWidth()
        return calculateColumnsWidth(colsWithNewVisibility, containerWidth)
      })
      onSaveColumnPreferences(visibleColumnIds)
    },
    [setColumnsWithWidth, onSaveColumnPreferences]
  )
  const handleWindowResize = React.useCallback(() => {
    setColumnsWithWidth((cols) => {
      const colsWithUnsetWidths = cols.map((c) => ({
        ...c,
        width: undefined
      }))
      const containerWidth = getAvailableContainerWidth()
      return calculateColumnsWidth(colsWithUnsetWidths, containerWidth)
    })
  }, [setColumnsWithWidth])

  return (
    <div
      style={{ width: '100%', height: '100%' }}
      className={`listview-container-${rest.rowIdentifier}`}
      ref={containerRef}
    >
      {columnsWithWidth.length > 0 && (
        <LVMemo
          columns={columnsWithWidth}
          onSaveColumnPreferences={handleSaveColumnPreferences}
          onApply={handleApply}
          onResize={handleWindowResize}
          {...rest}
        />
      )}
    </div>
  )
}

export default ListViewMemoized

export { ListView }
