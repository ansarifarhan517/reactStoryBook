import React from 'react'
import { bemClass } from '@utils'

import './style.scss'

const blk = 'table-header-cell'

type ITableHeaderCellProps = {
  label: string
  className?: string
}

const TableHeaderCell: React.FC<ITableHeaderCellProps> = ({ label, className }) => {
  const eltClass = bemClass([blk, {}, className])
  return (
    <th className={eltClass}>{label}</th>
  )
}

export default TableHeaderCell
