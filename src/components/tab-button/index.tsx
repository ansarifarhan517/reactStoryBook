import React, { MouseEventHandler, ReactElement } from 'react'

import Text from '../text'

import { bemClass } from '@/utils'
import './style.scss'

const blk = 'tab-button'

type tabButtonProps = {
  buttonClassName?: string
  handleClick?: MouseEventHandler
  active?: boolean
  children: ReactElement | ReactElement[] | string | number | null | undefined;
  dataAutoId?: string
}
const TabButton = ({
  buttonClassName,
  handleClick = () => {},
  active,
  children,
  dataAutoId
}: tabButtonProps) => (
  <button
    className={bemClass([blk, { active }, buttonClassName])}
    onClick={handleClick}
    data-auto-id={dataAutoId}
  >
    <Text typography="s" tag="span" fontWeight="bold" color="white">
      {children}
    </Text>
  </button>
)

export default TabButton
