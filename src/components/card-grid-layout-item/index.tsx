import { ReactElement } from 'react'

import { bemClass } from '@/utils'

import './style.scss'

type cardGridLayoutProps = {
  children: ReactElement[];
  className?: string;
}

const blk = 'card-grid-layout-item'

const CardGridLayoutItem = ({ children, className }: cardGridLayoutProps) => (
  <li className={blk}>
    <div className={bemClass([blk, 'content', {}, className])}>
      {children}
    </div>
  </li>
)

export default CardGridLayoutItem
