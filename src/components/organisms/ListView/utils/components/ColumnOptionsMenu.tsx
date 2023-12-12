import React from 'react'

import {
  IPinnedColumnState,
  IListViewColumn,
  IPinnedColumnTotalWidthState,
  IPinnedColumn
  // IPinnedColumn
} from '../../interfaces'
import { TableInstance, ColumnInstance, ColumnInterface } from 'react-table'
import { IOptionType } from '../../../../atoms/CheckboxGroup'
import FontIcon from '../../../../atoms/FontIcon'
import Box from '../../../../atoms/Box'
import styled from 'styled-components'

export interface IColumnOptionsProps {
  instance: TableInstance
  columns?: IListViewColumn[]
  columnInstance?: ColumnInstance<IListViewColumn> | any
  pinnedColumns: IPinnedColumnState
  setPinnedColumns: React.Dispatch<React.SetStateAction<IPinnedColumnState>>
  pinnedColumnsTotalWidth: IPinnedColumnTotalWidthState
  setPinnedColumnsTotalWidth: React.Dispatch<
    React.SetStateAction<IPinnedColumnTotalWidthState>
  >
  setShowHideColumns?: React.Dispatch<React.SetStateAction<IOptionType[]>>
  setColumnCheckedCount?: React.Dispatch<React.SetStateAction<number>>
  onSelect?: () => void
}

const MenuContainer = styled.div`
  width: 135px;
  background-color: #fff;
  box-shadow: 0 10px 36px -10px #00000078;
`

const MenuOption = styled.div`
  background-color: #fff;
  font-size: 11px;
  border-bottom: ${({ theme }) => `1px solid ${theme?.colors?.grey['500']}`};
  cursor: pointer;
  padding: 8px 12px;

  &:hover {
    color: ${({ theme }) => theme?.colors?.primary?.main};
    background-color: ${({ theme }) => theme?.colors?.grey['600']};
  }
  &:last-child {
    border-bottom: none;
  }

  display: flex;
  align-items: center;
  justify-content: flex-start;
`
const defaultCallback = () => {}

const ColumnOptionsMenu = ({
  instance,
  columns,
  columnInstance,
  pinnedColumns,
  setPinnedColumns,
  setPinnedColumnsTotalWidth,
  setShowHideColumns,
  setColumnCheckedCount,
  onSelect = defaultCallback
}: IColumnOptionsProps) => {
  const {
    allColumns,
    setColumnOrder,
    toggleSortBy,
    toggleHideColumn,
    state: { columnOrder }
  } = instance

  const handleSortAsc = () => {
    toggleSortBy(columnInstance.id, false, true)
    onSelect()
  }

  const handleSortDsc = () => {
    toggleSortBy(columnInstance.id, true, true)
    onSelect()
  }

  const handleRemoveSort = () => {
    columnInstance.clearSortBy()
    onSelect()
  }

  const handleHideColumn = () => {
    if (!setShowHideColumns || !setColumnCheckedCount) {
      return
    }

    setShowHideColumns((cList) =>
      cList.map((c) =>
        c.id === columnInstance.id ? { ...c, checked: !c.checked } : c
      )
    )
    setColumnCheckedCount((c) => c - 1)
    setTimeout(() => {
      toggleHideColumn(columnInstance.id, true)
      handleUnpin()
    }, 100)
    onSelect()
  }

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

    if (!columns) {
      return
    }

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

  const handlePinLeft = () => {
    handleColumnPinning('pinLeft', columnInstance)
    onSelect()
  }

  const handlePinRight = () => {
    handleColumnPinning('pinRight', columnInstance)
    onSelect()
  }

  const handleUnpin = () => {
    handleColumnPinning('unpin', columnInstance)
    onSelect()
  }

  return (
    <MenuContainer>
      {columnInstance?.['isSortable'] && (
        <>
          <MenuOption onClick={handleSortAsc}>
            <Box mr='5px'>
              <FontIcon variant='down-arrow' size={15} />
            </Box>
            <div>Sort Ascending</div>
          </MenuOption>
          <MenuOption onClick={handleSortDsc}>
            <Box mr='5px'>
              <FontIcon variant='up-arrow' size={15} />
            </Box>
            <div>Sort Descending</div>
          </MenuOption>
          {columnInstance.isSorted && (
            <MenuOption onClick={handleRemoveSort}>
              <Box mr='5px'>
                <FontIcon variant='icomoon-close' size={15} />
              </Box>
              <div>Remove Sort</div>
            </MenuOption>
          )}
        </>
      )}
      <MenuOption onClick={handleHideColumn}>
        <Box mr='5px'>
          <FontIcon variant='icomoon-close' size={15} />
        </Box>
        <div>Hide Column</div>
      </MenuOption>
      {!pinnedColumns?.left?.[columnInstance?.id] &&
        !pinnedColumns?.right?.[columnInstance?.id] && (
          <MenuOption onClick={handlePinLeft}>
            <Box mr='5px'>
              <FontIcon variant='icomoon-angle-left' size={15} />
            </Box>
            <div>Pin Left</div>
          </MenuOption>
        )}
      {!pinnedColumns?.left?.[columnInstance?.id] &&
        !pinnedColumns?.right?.[columnInstance?.id] && (
          <MenuOption onClick={handlePinRight}>
            <Box mr='5px'>
              <FontIcon variant='icomoon-angle-right' size={15} />
            </Box>
            <div>Pin Right</div>
          </MenuOption>
        )}
      {(pinnedColumns?.left?.[columnInstance?.id] ||
        pinnedColumns?.right?.[columnInstance?.id]) && (
        <MenuOption onClick={handleUnpin}>
          <Box mr='5px'>
            <FontIcon variant='icomoon-close' size={15} />
          </Box>
          <div>Unpin Column</div>
        </MenuOption>
      )}
    </MenuContainer>
  )
}

export default ColumnOptionsMenu
