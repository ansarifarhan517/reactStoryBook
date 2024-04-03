'use client'

import { bemClass } from '@/utils'
import Text from '../text'

import './style.scss'

const blk = 'side-bar'

type menu = {
  id: string
  label: string
}

type sideBarProps = {
  menuList: menu[]
  selectedItem: string
  clickHandler: Function
  className?: string
  dataAutoId?: string
}

const SideBar = ({
  menuList,
  selectedItem,
  clickHandler,
  className,
  dataAutoId
}: sideBarProps) => (
  <ul className={bemClass([blk, {}, className])}>
    {menuList.map(({ id, label }) => (
      <li
        key={id}
        data-auto-id={id}
        className={bemClass([blk, 'item'])}
        onClick={() => {
          clickHandler(id)
        }}
      >
        <Text
          tag="span"
          typography="m"
          fontWeight="bold"
          color={selectedItem === id ? 'primary' : 'gray-dark'}
          dataAutoId={`${dataAutoId}_${id}`}
        >
          {label}
        </Text>
      </li>
    ))}
  </ul>
)

export default SideBar
