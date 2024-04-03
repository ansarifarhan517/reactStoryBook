'use client'

import { useState, useRef } from 'react'

import Text from '../text'

import { bemClass } from '@/utils'

import UseOnClickOutside from '@/hooks/use-outside-click'

import PopOvermenuOption from '../pop-over-menu-option'

import './style.scss'

type optionType = {
  key: string
  value: string
}

type popOverMenuProps = {
  options?: optionType[]
  selectedValue?: string
  selectHandler?: (valueObj: Record<string, string>) => void
}

const blk = 'pop-over-menu'

const PopOverMenu = ({
  options = [],
  selectedValue,
  selectHandler = () => {}
}: popOverMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const eltRef = useRef<HTMLDivElement>(null)

  const togglePopUp = () => {
    setIsOpen(!isOpen)
  }

  const onClickOutside = () => {
    setIsOpen(false)
  }

  UseOnClickOutside(eltRef, onClickOutside)

  return (
    <div className={blk} ref={eltRef}>
      <button
        className={bemClass([
          blk,
          'button',
          { open: isOpen }
        ])}
        onClick={togglePopUp}
      >
        <Text tag="span" typography="l">{selectedValue}</Text>
      </button>
      {isOpen && (
        <ul className={bemClass([blk, 'menu-list'])}>
          {options.map((option) => (
            <li
              key={option.key}
            >
              <PopOvermenuOption
                option={option}
                selectHandler={selectHandler}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PopOverMenu
