import React, { useState, useEffect } from 'react'
import { ISelectedRows, IListViewRow } from '../../interfaces'
import Position from '../../../../molecules/Position'
import Checkbox from '../../../../atoms/Checkbox'

export interface IHeaderSelectAllProps {
  selectedRows: ISelectedRows
  setSelectedRows: React.Dispatch<React.SetStateAction<ISelectedRows>>
  data: IListViewRow[]
  loading: boolean
  isEditMode: boolean
  rowIdentifier: string
  hasSelectAllRows: boolean
  onRowSelect(selectedRows: ISelectedRows): void
  hasRadioSelection: boolean
}

const defaultCallback = () => {}
const HeaderSelectAll = ({
  rowIdentifier = 'id',
  data = [],
  loading = false,
  isEditMode = false,
  selectedRows = {},
  setSelectedRows = defaultCallback,
  onRowSelect = defaultCallback,
  hasSelectAllRows,
  hasRadioSelection
}: IHeaderSelectAllProps) => {
  const [checked, setChecked] = useState<boolean>(false)
  const [byPassUseEffect, setByPassUseEffect] = useState<boolean>(false)

  const selectionCount: number = React.useMemo(
    () => Object.keys(selectedRows).length,
    [selectedRows]
  )

  useEffect(() => {
    if (byPassUseEffect) {
      setByPassUseEffect(false)
      return
    }

    setChecked(
      !!data.length &&
        selectionCount > 0 &&
        !data.some(
          (row) =>
            !row.ignoreSelectAll &&
            !row.hasSelectionDisabled &&
            !selectedRows[row[rowIdentifier]]
        )
    )
  }, [selectedRows, data])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSelection = { ...selectedRows }
    const checkedValue = e.target.checked

    data.forEach((row) => {
      if (checkedValue && !row.ignoreSelectAll && !row.hasSelectionDisabled) {
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
      {!hasRadioSelection && hasSelectAllRows && (
        <Checkbox
          id='listView-selectAll'
          checkboxSize='md'
          checked={checked}
          onChange={handleChange}
          disabled={loading || isEditMode}
          // disabled={loading}
          // {...getToggleAllRowsSelectedProps()}
          title={undefined}
        />
      )}
    </Position>
  )
}

export default React.memo(HeaderSelectAll)
