import React from 'react'
import { computeValue, bemClass } from '@utils'

import './style.scss'

const blk = 'table-data-cell'

type ITableDataCellProps = {
  column: {
    label: string
    custom?: (dataItem: object) => React.ReactNode;
    className?: string
    map?: string
  }
  dataItem?: object
}

const TableDataCell: React.FC<ITableDataCellProps> = ({ column, dataItem = {} }) => {
  const { custom, map = '', className = '' } = column
  const eltClass = bemClass([blk, {}, className])

  if (custom) {
    return <td className={eltClass}>{custom(dataItem)}</td>
  }

  // Check if dataItem is defined before calling computeValue
  if (dataItem) {
    const value = String(computeValue(dataItem, map))
    return <td className={eltClass}>{value}</td>
  }

  // Return a default cell if dataItem is undefined
  return <td className={eltClass}>N/A</td>
}

export default TableDataCell
