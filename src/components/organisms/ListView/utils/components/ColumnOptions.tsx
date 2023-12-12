import React from 'react'
import Position from '../../../../molecules/Position'
import {
  IPinnedColumnState,
  IListViewColumn,
  IPinnedColumnTotalWidthState,
  IPinnedColumn
} from '../../interfaces'
import { TableInstance, ColumnInterface, ColumnInstance } from 'react-table'
import IconDropdown from '../../../../molecules/IconDropdown'
import { IOptionType } from '../../../../atoms/CheckboxGroup'
import FontIcon from '../../../../atoms/FontIcon'

interface IColumnOptionsProps {
  instance: TableInstance
  columns: IListViewColumn[]
  columnInstance: ColumnInstance<IListViewColumn>
  pinnedColumns: IPinnedColumnState
  setPinnedColumns: React.Dispatch<React.SetStateAction<IPinnedColumnState>>
  pinnedColumnsTotalWidth: IPinnedColumnTotalWidthState
  setPinnedColumnsTotalWidth: React.Dispatch<
    React.SetStateAction<IPinnedColumnTotalWidthState>
  >
  setShowHideColumns: React.Dispatch<React.SetStateAction<IOptionType[]>>
  setColumnCheckedCount: React.Dispatch<React.SetStateAction<number>>
  hideColumnSettings: boolean
}

const ColumnOptions = ({
  instance,
  columns,
  columnInstance,
  pinnedColumns,
  setPinnedColumns,
  setPinnedColumnsTotalWidth,
  setShowHideColumns,
  setColumnCheckedCount,
  hideColumnSettings
}: IColumnOptionsProps) => {
  // const renders = React.useRef(0)
  // renders.current++
  // console.log('Renderring Column Options', columnInstance.id, renders)
  const {
    allColumns,
    setColumnOrder,
    toggleSortBy,
    toggleHideColumn,
    state: { columnOrder }
  } = instance

  const handleColumnPinning = (
    selectedOption: 'pinLeft' | 'pinRight' | 'unpin',
    column: ColumnInterface<IListViewColumn>
  ) => {
    let newColumnOrder: string[] = columnOrder.length
      ? columnOrder
      : allColumns.map((c) => c.id)
    newColumnOrder = newColumnOrder.filter((columnId) => columnId !== column.id)
    const newPinnedColumns = { ...pinnedColumns }

    let calculatedOffset = 0
    switch (selectedOption) {
      case 'pinLeft':
        Object.values(newPinnedColumns.left).forEach((value) => {
          calculatedOffset += value.width
        })

        {
          const width =
            document
              .getElementById(`column-header-${column.id}`)
              ?.getBoundingClientRect().width || 0
          newPinnedColumns.left[column.id || ''] = {
            offset: calculatedOffset,
            // width: Number(column.width)
            width
          }
          setPinnedColumnsTotalWidth((pT) => ({
            ...pT,
            // left: calculatedOffset + Number(column.width)
            left: calculatedOffset + width
          }))
        }
        break

      case 'pinRight':
        Object.values(newPinnedColumns.right).forEach((value) => {
          calculatedOffset += value.width
        })

        {
          const width =
            document
              .getElementById(`column-header-${column.id}`)
              ?.getBoundingClientRect().width || 0
          newPinnedColumns.right[column.id || ''] = {
            offset: calculatedOffset,
            // width: Number(column.width)
            width
          }

          setPinnedColumnsTotalWidth((pT) => ({
            ...pT,
            // right: calculatedOffset + Number(column.width)
            right: calculatedOffset + width
          }))
        }
        break

      case 'unpin':
        {
          const unpinColumnWidth =
            document
              .getElementById(`column-header-${column.id}`)
              ?.getBoundingClientRect().width || 0
          if (newPinnedColumns.left[column.id || '']) {
            Object.values(newPinnedColumns.left).forEach(
              (pinnedColumn: IPinnedColumn) => {
                if (Number(unpinColumnWidth) <= pinnedColumn.offset) {
                  pinnedColumn.offset -= Number(unpinColumnWidth)
                }
              }
            )

            setPinnedColumnsTotalWidth((pT) => ({
              ...pT,
              left: pT.left - Number(unpinColumnWidth)
              // left: 50
            }))
          }

          if (newPinnedColumns.right[column.id || '']) {
            Object.values(newPinnedColumns.right).forEach(
              (pinnedColumn: IPinnedColumn) => {
                if (Number(unpinColumnWidth) <= pinnedColumn.offset) {
                  pinnedColumn.offset -= Number(unpinColumnWidth)
                }
              }
            )

            setPinnedColumnsTotalWidth((pT) => ({
              ...pT,
              right: pT.right - Number(unpinColumnWidth)
            }))
          }
        }
        delete newPinnedColumns.left[column.id || '']
        delete newPinnedColumns.right[column.id || '']
        // Object.values(newPinnedColumns.right)
        break
    }

    setPinnedColumns(newPinnedColumns)

    newColumnOrder = [
      ...Object.keys(pinnedColumns.left),
      ...columns
        .filter(
          ({ accessor }) =>
            !(
              newPinnedColumns.left[accessor] ||
              newPinnedColumns.right[accessor]
            )
        )
        .map(({ accessor }) => accessor),
      ...Object.keys(pinnedColumns.right).reverse()
    ]

    setColumnOrder(newColumnOrder)
  }

  const columnOptions = React.useMemo(() => {
    let options = [
      {
        value: 'sortAscending',
        label: sessionStorage.getItem('logiLabels_ascendingSort') || "Sort asending" ,
        iconVariant: 'up-arrow'
      },
      {
        value: 'sortDescending',
        label: sessionStorage.getItem('logiLabels_descendingSort') || "Sort Descending",
        iconVariant: 'down-arrow'
      },
      {
        value: 'removeSortBy',
        label: sessionStorage.getItem('logiLabels_removeSort') || "remove Sort By",
        iconVariant: 'x'
      },
      {
        value: 'hideColumn',
        label: sessionStorage.getItem('logiLabels_hideColumn') || "Hide Column",
        iconVariant: 'x'  
      },
      {
        value: 'pinLeft',
        label: sessionStorage.getItem('logiLabels_pinLeft') || "Pin Left",
        iconVariant: 'icomoon-angle-left'
      },
      {
        value: 'pinRight',
        label: sessionStorage.getItem('logiLabels_pinRight') || "Pin Right",
        iconVariant: 'icomoon-angle-right'
      }
    ]

    if (!columnInstance?.['isSortable']) {
      options = options.splice(2, options.length)
    }

    if (
      pinnedColumns.left[columnInstance.id] ||
      pinnedColumns.right[columnInstance.id]
    ) {
      options.push({
        value: 'unpin',
        label: sessionStorage.getItem('logiLabels_unpin') || "Unpin Column",
        iconVariant: 'x'
      })

      options = options.filter(
        (option) =>
          (pinnedColumns.left[columnInstance.id] &&
            option.value !== 'pinLeft') ||
          (pinnedColumns.right[columnInstance.id] &&
            option.value !== 'pinRight')
      )
    }

    if (!columnInstance.isSorted) {
      // options.push()
      const removeSortIndex = options.findIndex(
        (o) => o.value === 'removeSortBy'
      )
      options.splice(removeSortIndex, 1)
    }

    if (hideColumnSettings) {
      const hideColumnIndex = options.findIndex((o) => o.value === 'hideColumn')

      options.splice(hideColumnIndex, 1)
    }
    return options
  }, [columnInstance.isSorted, pinnedColumns, columnInstance.id])

  return (
    <Position type='absolute' top='-0.5em' right='0em' style={{ zIndex: 2 }}>
      <Position type='relative'>
        {columnInstance.isSorted && (
          <Position
            type='absolute'
            right='22px'
            top='calc(50% - 8px)'
            display='flex'
            // color='grey.A1000'
          >
            <FontIcon
              variant={
                columnInstance.isSortedDesc
                  ? 'sort-descending'
                  : 'sort-ascending'
              }
              size={10}
            />
            <span style={{ fontSize: '12px' }}>
              {columnInstance.sortedIndex + 1}
            </span>
          </Position>
        )}
        <IconDropdown
          width='auto'
          variant='column-filter'
          optionList={columnOptions}
          onChange={(value) => {
            switch (value) {
              case 'pinLeft':
                if (pinnedColumns.right[columnInstance.id]) {
                  handleColumnPinning('unpin', columnInstance)
                }
                handleColumnPinning(value, columnInstance)
                break
              case 'pinRight':
                if (pinnedColumns.left[columnInstance.id]) {
                  handleColumnPinning('unpin', columnInstance)
                }
                handleColumnPinning(value, columnInstance)
                break
              case 'unpin':
                handleColumnPinning(value, columnInstance)
                break

              case 'removeSortBy':
                columnInstance.clearSortBy()
                break
              case 'sortAscending':
                toggleSortBy(columnInstance.id, false, true)
                break

              case 'sortDescending':
                toggleSortBy(columnInstance.id, true, true)
                break

              case 'hideColumn':
                setShowHideColumns((cList) =>
                  cList.map((c) =>
                    c.id === columnInstance.id
                      ? { ...c, checked: !c.checked }
                      : c
                  )
                )
                setColumnCheckedCount((c) => c - 1)
                setTimeout(() => {
                  toggleHideColumn(columnInstance.id, true)
                  handleColumnPinning('unpin', columnInstance)
                }, 100)
                break
            }
          }}
        />
      </Position>
    </Position>
  )
}

export default ColumnOptions
// export default React.memo(
//   ColumnOptions,
//   (prevProps: IColumnOptionsProps, nextProps: IColumnOptionsProps) => {
//     console.log(prevProps, nextProps)
//     if (
//       prevProps.instance === nextProps.instance &&
//       prevProps.columnInstance.id === nextProps.columnInstance.id &&
//       prevProps.columnInstance.isSorted === nextProps.columnInstance.isSorted &&
//       prevProps.columnInstance.clearSortBy ===
//         nextProps.columnInstance.clearSortBy &&
//       prevProps.pinnedColumns === nextProps.pinnedColumns &&
//       prevProps.setPinnedColumns === nextProps.setPinnedColumns &&
//       prevProps.columns === nextProps.columns &&
//       prevProps.instance.state.columnOrder ===
//         nextProps.instance.state.columnOrder &&
//       prevProps.instance.setColumnOrder === nextProps.instance.setColumnOrder &&
//       prevProps.instance.toggleSortBy === nextProps.instance.toggleSortBy &&
//       prevProps.instance.toggleHideColumn ===
//         nextProps.instance.toggleHideColumn
//     ) {
//       return true
//     } else {
//       return false
//     }
//   }
// )
