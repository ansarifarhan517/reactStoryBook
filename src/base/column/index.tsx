import React from 'react'
import { bemClass } from '@utils'
import './style.scss'

const blk = 'column'

type IColumn = {
  children: React.ReactNode
  col: number
  className?: string
}

const Column: React.FC<IColumn> = ({ children, col, className }) => {
  const eltClass = bemClass([
    blk,
    {
      [col]: !!col,
    },
    className,
  ])
  return (
    <div className={eltClass}>
      {children}
    </div>
  )
}

export default Column
