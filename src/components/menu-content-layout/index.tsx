'use client'

import { ReactNode } from 'react'

import Container from '../container'
import SideBar from '../side-bar'
import MediaKitMenu from '../media-kit-menu'

import { bemClass } from '@/utils'

import './style.scss'
import MobileMenuContainer from '../mobile-menu-container'

const blk = 'menu-content-layout'

type menu = {
  id: string
  label: string
}

type menuContentProps = {
  menuList: menu[]
  selectedItem: string
  children?: ReactNode
  clickHandler?: Function;
  menuPosition?: 'up' | 'down'
  showMediaKit?: boolean
  dataAutoId?: string
  mobileSideBarLabel?: string
  className?: string
}

const MenuContentLayout = ({
  menuList,
  selectedItem = '',
  children,
  clickHandler = () => {},
  menuPosition = 'up',
  showMediaKit = false,
  dataAutoId,
  mobileSideBarLabel,
  className
}: menuContentProps) => (
  <Container className={bemClass([blk,[menuPosition]])}>
    <>
      <aside className={bemClass([blk,'side-bar'])} >
        <div className={bemClass([blk,'sticky-menu'])}>
          <MobileMenuContainer
            label={mobileSideBarLabel}
            dataAutoId={`${dataAutoId}_mobile_menu_container`}
            className={className}
          >
            <SideBar
              menuList={menuList}
              selectedItem={selectedItem}
              clickHandler={clickHandler}
              dataAutoId={dataAutoId}
            />
            {showMediaKit && (
              <MediaKitMenu dataAutoId={dataAutoId} />
            )}
          </MobileMenuContainer>
        </div>
      </aside>
      <section className={bemClass([blk, 'content'])}>
        {children}
      </section>
    </>
  </Container>
)

export default MenuContentLayout
