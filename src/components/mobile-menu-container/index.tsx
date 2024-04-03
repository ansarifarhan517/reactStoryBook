import { ReactElement } from 'react'
import Image from 'next/image'

import { bemClass } from '@/utils'

import mobileMenuButtonIcon from '/public/mobile-menu-button-icon.svg'

import './style.scss'

const blk = 'mobile-menu-container'

type mobileMenuContainerProps = {
    label?: string
    children: ReactElement | ReactElement[] | any
    dataAutoId?: string
    className?: string
}

const MobileMenuContainer = ({ label, dataAutoId, children, className }: mobileMenuContainerProps) => (
  <div className={bemClass([blk, {}, className])}>
    <input type="checkbox" id="filter-checkbox" className={bemClass([blk, 'checkbox'])} />
    <div className={bemClass([blk, 'button'])}>
      <Image
        src={mobileMenuButtonIcon}
        alt="Mobile menu button icon"
        data-auto-id={`${dataAutoId}_image`}
        className={bemClass([blk, 'image'])}
      />
      <label htmlFor="filter-checkbox">
        {label}
      </label>
    </div>
    <div className={bemClass([blk, 'content'])}>
      {children}
    </div>
  </div>
)

export default MobileMenuContainer
