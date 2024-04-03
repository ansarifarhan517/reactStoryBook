'use client'

import { bemClass } from '@/utils'

import './style.scss'
import { list } from '../..'

type dropdownListProps = {
  listOpen: boolean;
  list: list[];
  selectedOption: number | string;
  onValueChange: (e: any) => void;
  dataAutoId?: string;
};

const blk = 'drop-down-list'

const DropdownList = ({
  listOpen,
  list,
  selectedOption,
  onValueChange,
  dataAutoId
}: dropdownListProps) => (
  <div className={blk}>
    {listOpen && (
      <ul className={bemClass([blk, 'options'])}>
        {list?.map((item, _i) => {
          const optionClass = bemClass([
            blk,
            'option',
            {
              active: selectedOption === item.value,
            },
          ])
          return (
            <li
              className={optionClass}
              key={item?.key}
              data-auto-id={`${dataAutoId}_${_i + 1}`}
            >
              <button onClick={() => onValueChange(item)} className={bemClass([blk,'item-button'])}>{item?.value}
              </button>
            </li>
          )
        })}
      </ul>
    )}
  </div>
)

export default DropdownList
