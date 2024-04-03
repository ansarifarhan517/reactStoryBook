'use client'

import React, { useState } from 'react'

import Card from '@/components/card'
import MenuContentLayout from '@/components/menu-content-layout'

import { bemClass } from '@/utils'

import { data, menuList } from '../../_data'

import './style.scss'

const blk = 'feature-cards'

const FeatureCards = () => {
  const [selectedItem, setSelectedItem] = useState<string>(menuList[0].id)

  const handleClickHandler = (id : string) => {
    setSelectedItem(id)
  }

  return (
    <MenuContentLayout
      menuList={menuList}
      selectedItem={selectedItem}
      clickHandler={handleClickHandler}
      mobileSideBarLabel="All Features"
    >
      <div className={bemClass([blk, { [selectedItem]: !!selectedItem }])}>
        {data?.map(({ title, description, icon ,url, id = '' }) => (
          <div key={title} className={ bemClass([blk, 'cards-container', { [id]: !!id }])}>
            <Card title={title} description={description} icon={icon} url={url} iconClass="icon"/>
          </div>
        ))}
      </div>
    </MenuContentLayout>
  )
}

export default FeatureCards
