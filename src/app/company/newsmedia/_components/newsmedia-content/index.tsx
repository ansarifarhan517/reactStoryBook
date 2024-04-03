'use client'

import React, { useEffect, useState, useRef } from 'react'

import MenuContentLayout from '@/components/menu-content-layout'

import { bemClass } from '@/utils'

import NewsMediaCard from '../newsmedia-card'

import { menuList, data } from '../../_data'

import './style.scss'

const blk = 'newsmedia-content'

type newsMediaContentProps = {
  dataAutoId?: string
}

const NewsMediaContent = ({ dataAutoId }: newsMediaContentProps) => {
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
      setSelectedItem(window.sessionStorage.getItem('newsCategory') || menuList[0].id)
    }
  },[])

  return (
    <MenuContentLayout
      menuList={menuList}
      selectedItem={selectedItem}
      showMediaKit
      clickHandler={handleClickHandler}
      dataAutoId={`${dataAutoId}_menu`}
      mobileSideBarLabel="Show All News"
    >
      <div
        ref={contentLayoutReference}
        className={bemClass([blk,{ [selectedItem]: !!selectedItem }])}
        id="news"
      >
        {data?.map(({ name, content, image ,url, category, id }) => (
          <div key={name} className={ bemClass([blk, 'cards-container', { [category]: category && !!category }])}>
            <NewsMediaCard
              title={name}
              description={content}
              image={image}
              url={url}
              dataAutoId={`${dataAutoId}_card_${id}`}
            />
          </div>
        ))}
      </div>
    </MenuContentLayout>
  )
}

export default NewsMediaContent
