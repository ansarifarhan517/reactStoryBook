import React from 'react'
import {
  Text,
} from '@base'
import { bemClass } from '@utils'
import './style.scss'

const blk = 'collapsible'

type ICollapsibleProps = {
  title: string
  children: React.ReactNode
  contentClassName?: string
  isExpanded: boolean
  onClickHandler: () => void
}

const Collapsible: React.FC<ICollapsibleProps> = ({
  title,
  children,
  contentClassName,
  isExpanded,
  onClickHandler,
}) => (
  <div className={bemClass([blk, '', { closed: isExpanded }])}>
    <button
      type="button"
      className={bemClass([blk, 'header'])}
      onClick={onClickHandler}
    >
      <Text tag="h4">{title}</Text>
      <div className={bemClass([blk, 'button', { expanded: isExpanded }])} />
    </button>
    <div className={bemClass([blk, 'content', contentClassName])}>
      {children}
    </div>
  </div>
)

export default Collapsible
