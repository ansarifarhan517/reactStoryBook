import React, { useState } from 'react'
import Link from 'next/link'

import { m, LazyMotion, domAnimation } from 'framer-motion'

import { bemClass } from '@/utils'

import MobileSubMenu from '../mobile-sub-menu'

import './style.scss'

type menuType = {
  displayName?: string;
  label: string;
  href: string;
  id?: string;
  menu?: {
    label: string;
    href: string;
  }[];
}

type mobileToopLevelMenuProps = {
  id: string;
  label: string;
  href: string;
  menu?: menuType[];
  menuVariant: {
    hidden: {
      opacity: number,
      x: number,
    },
    show: {
      opacity: number,
      x: number,
      transition: {
        duration: number,
      },
    },
  };
}

const blk = 'mobile-top-level-menu'

const MobileToopLevelMenu = ({
  id,
  label,
  href = '/',
  menu = [],
  menuVariant,
}: mobileToopLevelMenuProps) => {
  const [toggle, toggleMenu] = useState<boolean>(false)
  const setToggleMenu = () => {
    toggleMenu(!toggle)
  }
  return (
    <LazyMotion features={domAnimation}>
      <m.li
        variants={menuVariant}
        className={bemClass([blk, { expanded: toggle }])}
        onClick={setToggleMenu}
      >
        <div className={bemClass([blk, 'header'])}>
          <Link
            className={bemClass([
              blk,
              'label',
              {
                disabled: (menu.length > 0 && href !== '/products')
              }
            ])}
            href={href}
            data-auto-id={id}
          >
            {label}
          </Link>
          {menu?.length > 0 && (
            <button className={bemClass([blk, 'button', { expanded: toggle }])} />
          )}
        </div>
        {toggle && (
          <MobileSubMenu parentId={id} subMenu={menu} />
        )}
      </m.li>
    </LazyMotion>
  )
}

export default MobileToopLevelMenu
