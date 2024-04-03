'use client'
import { FormEvent, useState } from 'react'

import Hamburger from '../hamburger'
import MobileNavigationMenu from '../mobile-navigation-menu'

import './style.scss'

type mobileNavigationProps = {
  isIndia: boolean;
  toggleSigUpModal: (e: FormEvent) => void;
  toggleScheduleDemoModal: (e: FormEvent) => void;
}

const blk = 'mobile-navigation'

const MobileNavigation = ({
  toggleSigUpModal, toggleScheduleDemoModal, isIndia
}: mobileNavigationProps) => {
  const [toggle, toggleMenu] = useState<boolean>(false)
  return (
    <div className={blk}>
      <Hamburger active={toggle} clickHandler={() => toggleMenu(!toggle)} />
      {toggle && (
        <MobileNavigationMenu
          toggleSigUpModal={toggleSigUpModal}
          toggleScheduleDemoModal={toggleScheduleDemoModal}
          isIndia={isIndia}
        />
      )}
    </div>
  )
}

export default MobileNavigation
