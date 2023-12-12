import { TableInstance } from 'react-table'
import { IListViewRow } from './../interfaces'
import { ISelectedRows } from '../interfaces'
import { useState, useEffect } from 'react'

interface IRowSelectPersistenceInstance {
  rowIdentifier: string
  data: IListViewRow[]
  onRowSelect(selectedRows: ISelectedRows): void
  instance: TableInstance
}

const useRowSelectPersistence = ({
  rowIdentifier,
  data,
  onRowSelect,
  instance: { selectedFlatRows }
}: IRowSelectPersistenceInstance) => {
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({})
  // const [skipRowSelectionEffect] = useState<boolean>(false)
  const [hasDataChanged, setDataChanged] = useState<boolean>(false)

  /** Pre-select rows based on data attributes */
  // useEffect(() => {
  //   console.log('pre-select rows')

  //   for (let i = 0; i < data.length; i++) {
  //     if (selectedRows[data[i][rowIdentifier]]) {
  //       toggleRowSelected(i + '', true)
  //     }
  //   }
  //   setDataChanged(true)
  // }, [data, rowIdentifier])

  /** Whenever user toggles row selection, Update selectedRows State and pass the new state as callback */
  useEffect(() => {
    // console.log({ skipRowSelectionEffect, hasDataChanged })
    // console.log('computing selected rows', {
    //   ...selectedFlatRows.map((flatRow) => ({ ...flatRow.original }))
    // })
    if (hasDataChanged) {
      setDataChanged(false)
      return
    }

    // console.log('processing')
    const newSelectedRows = {
      ...selectedRows
    }

    data.forEach((row) => {
      if (
        !row.hasSelectionDisabled &&
        selectedFlatRows.findIndex(
          (flatRow) => flatRow.original[rowIdentifier] === row[rowIdentifier]
        ) !== -1
      ) {
        newSelectedRows[row[rowIdentifier]] = row
      } else {
        delete newSelectedRows[row[rowIdentifier]]
      }
    })
    // console.log({ newSelectedRows })
    setSelectedRows(newSelectedRows)
    onRowSelect(newSelectedRows)
  }, [selectedFlatRows])

  return selectedRows
}

export default useRowSelectPersistence
