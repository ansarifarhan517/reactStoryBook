import React, { useState, memo } from 'react'
import { Icon, Button, DropDown } from '@base'
import { bemClass } from '@utils'
import './style.scss'

const blk = 'pagination-container'

type IPaginationProps = {
  currentPage: number
  totalcount: number
  onLimitChange: () => void
  prevhandler: () => void
  nexthandler: () => void
  className?: string
}

const options = [
  { label: '5 Per page', value: 5 },
  { label: '10 Per page', value: 10 },
  { label: '20 Per page', value: 20 },
  { label: '30 Per page', value: 30 },
  { label: '40 Per page', value: 40 },
  { label: '50 Per page', value: 50 },
]

const Pagination: React.FC<IPaginationProps> = ({
  currentPage = 1,
  totalcount = 1000,
  onLimitChange,
  prevhandler,
  nexthandler,
  className,
}) => {
  const [selectedValue, setSelectedValue] = useState(5)
  const btnclss = bemClass([blk, 'button'])
  const pgclss = bemClass([blk, 'pagination-element'])

  const handleChange = (e: Record<string, number | string>) => {
    setSelectedValue(+e.name)
  // onLimitChange();  // assuming onLimitChange does not require arguments
  }

  return (
    <div className={bemClass([blk, {}, className])}>
      <DropDown
        options={options}
        name="dropdown"
        value={selectedValue}
        className={bemClass([blk, 'per-page'])}
        changeHandler={handleChange}
      />
      <div className={pgclss}>
        <Button className={btnclss} clickHandler={prevhandler}>
          <Icon name="angle-left" color="white" />
        </Button>
        <p>{currentPage}</p>
        -
        <p>{selectedValue}</p>
        of
        <p>{totalcount}</p>
        <Button className={btnclss} clickHandler={nexthandler}>
          <Icon name="angle-right" color="white" />
        </Button>
      </div>
    </div>
  )
}

Pagination.defaultProps = {
  className: '',
  currentPage: 1,
  totalcount: 1000,
  onLimitChange: () => { },
  nexthandler: () => { },
  prevhandler: () => { },
}

export default memo(Pagination)
