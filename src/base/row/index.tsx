import React from 'react'
import { bemClass } from '@utils'
import './style.scss'

const blk = 'row'

type IRowProps = {
  children: React.ReactNode
  className?: string
}

const Row: React.FC<IRowProps> = ({ children, className }) => {
  const eltClass = bemClass([blk, {}, className])
  return (
    <div className={eltClass}>
      {children}
    </div>
  )
}

Row.defaultProps = {
  className: '',
}

export default Row
