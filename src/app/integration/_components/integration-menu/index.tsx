'use client'

import React, { useEffect, useState, useRef } from 'react'

import Card from '@/components/card'
import MenuContentLayout from '@/components/menu-content-layout'

import { bemClass } from '@/utils'

import { menuList, data } from '@/config/api-integration'

import './style.scss'

const blk = 'integration-menu'

const IntergrationMenu = () => {
  const [selectedItem, setSelectedItem] = useState<string>(menuList[0].id)
  const contentLayoutReference = useRef<HTMLDivElement>(null)

  const handleClickHandler = (id : string) => {
    setSelectedItem(id)
    if (contentLayoutReference.current) {
      window.scrollTo(0, contentLayoutReference.current.offsetTop - 100)
    }
  }

  useEffect(() => {
    if (window.sessionStorage) {
      setSelectedItem(window.sessionStorage.getItem('integrationName') || menuList[0].id)
    }
  },[])

  return (
    <MenuContentLayout
      menuList={menuList}
      selectedItem={selectedItem}
      clickHandler={handleClickHandler}
      mobileSideBarLabel="All Integration"
    >
      <div className={bemClass([blk,{ [selectedItem]: !!selectedItem }])} ref={contentLayoutReference} >
        {data?.map(({ name, content, image ,url, category }) => (
          <div key={name} className={ bemClass([blk, 'cards-container', { [category]: category && !!category }])}>
            <Card title={name} description={content} image={image} url={url} imageClass="image"/>
          </div>
        ))}
      </div>
    </MenuContentLayout>
  )
}

export default IntergrationMenu
