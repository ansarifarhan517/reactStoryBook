'use client'

import { useEffect, useRef, useState } from 'react'

import { bemClass } from '@/utils'

import UseOnClickOutside from '@/hooks/use-outside-click'

import './style.scss'
import DropdownList from './components/drop-down-list'

export type list = {
  key: string,
  value: string
}

type dropdownProps = {
  label: string,
  invalid?: boolean,
  list: list[],
  changeHandler?: (e: any) => void,
  name: string,
  errorMessage?: string,
  dataAutoId?: string,
  value?: string
}

const blk = 'dropdown'

const Dropdown = ({ label, list, invalid, changeHandler = () => {}, name, errorMessage, dataAutoId, value }: dropdownProps) => {
  const [listOpen, setListOpen] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<number | string | any>()
  const eltRef = useRef<HTMLDivElement>(null)

  const onClickOutside = () => {
    setListOpen(false)
  }

  UseOnClickOutside(eltRef, onClickOutside)

  const handleToggle = () => {
    setListOpen(!listOpen)
  }

  const onValueChange = (item: list) => {
    setSelectedOption(item?.value)
    setListOpen(false)
    changeHandler({ [name] : item?.value })
  }

  const selectClass = bemClass([blk, 'select', {
    invalid,
    'animate': listOpen,
  }])

  const labelClass = bemClass([blk, 'label', {
    'active': selectedOption
  }])

  useEffect(() => {
    setSelectedOption(value)
  }, [selectedOption, value])

  return (
    <div ref={eltRef} className={blk}>
      <button className={selectClass} onClick={handleToggle}>
        <div className={labelClass} data-auto-id={dataAutoId}>{label}</div>
        <div className={bemClass([blk, 'selected'])} data-auto-id={`${dataAutoId}_${selectedOption}`}>{selectedOption ? selectedOption : ''}</div>
        <span className={bemClass([blk, listOpen ? 'icondown' : 'iconup'])} data-auto-id={`${dataAutoId}_arrow_icon`} ></span>
      </button>
      {invalid && (
        <span className={bemClass([blk, 'error'])} data-auto-id={`${dataAutoId}_error`}>
          {errorMessage}
        </span>)
      }
      <DropdownList
        dataAutoId={dataAutoId}
        listOpen={listOpen}
        list={list}
        selectedOption={selectedOption}
        onValueChange={onValueChange}
      />
    </div>
  )
}

export default Dropdown
