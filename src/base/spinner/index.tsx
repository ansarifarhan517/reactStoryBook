import React from 'react'
import { bemClass } from '@utils'
import './style.scss'

const blk = 'spinner'

type ISpinnerProps = {
  category: 'primary' | 'secondary'
  size: 'small' | 'medium' | 'large'
  className: string
}

const Spinner: React.FC<ISpinnerProps> = ({
  category,
  size,
  className,
}) => {
  const eltClassName = bemClass([blk, {
    [category]: category,
    [size]: size,
  }, className])

  return (
    <div className={eltClassName} />
  )
}

export default Spinner
