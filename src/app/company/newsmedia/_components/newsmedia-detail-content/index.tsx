'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import React, { useState } from 'react'

import MenuContentLayout from '@/components/menu-content-layout'
import Text from '@/components/text'
import Button from '@/components/button'

import { bemClass } from '@/utils'

import NewsDetailSocial from '../news-detail-social'

import { menuList, data } from '../../_data'

import './style.scss'

const blk = 'news-media-detail-content'

type newsMediaDetailContentProps = {
  news: string
  dataAutoId?: string
}

const NewsMediaDetailContent = ({ news, dataAutoId }: newsMediaDetailContentProps) => {
  const newsLength = data.length
  const newsIndex = data.findIndex(({ id }) => id === news)
  const selectedNews = news ? data.find(({ id }) => id === news) : data[0]

  const { name: nextNewsName , url: nextNewsUrl } = data[newsIndex + 1] || {}
  const { name: prevNewsName , url: prevNewsUrl } = data[newsIndex - 1] || {}

  const {
    category = '', name, source, url = '',
    publishedOn, detailDescription, newsLink
  } = selectedNews || {}
  const [selectedItem, setSelectedItem] = useState<string>(category)

  const router = useRouter()

  const handleClickHandler = (id: string) => {
    setSelectedItem(id)
    if (window.sessionStorage) {
      window.sessionStorage.setItem('newsCategory', id)
    }
    router.push('/company/newsmedia')
  }

  return (
    <MenuContentLayout
      menuList={menuList}
      selectedItem={selectedItem}
      clickHandler={handleClickHandler}
      showMediaKit
      dataAutoId={`${dataAutoId}_side_bar`}
      mobileSideBarLabel="Show All News"
    >
      <div className={blk}>
        <div className={bemClass([blk, 'header'])}>
          <div className={bemClass([blk, 'title'])}>
            <Text tag="h1" typography="xxl" color="gray-darker" dataAutoId={`${dataAutoId}_title`}>
              {name}
            </Text>
            <p>
              <Text tag="label" color="gray-darker" dataAutoId={`${dataAutoId}_sub_title_source`}>
                {`Source: ${source}`}
              </Text>
              <span> | </span>
              <Text tag="label" color="gray-darker" dataAutoId={`${dataAutoId}_sub_title_publish`}>
                {` Published on: ${publishedOn}`}
              </Text>
            </p>
          </div>
          <NewsDetailSocial url={url} dataAutoId={`${dataAutoId}_social`} />
        </div>
        <div className={bemClass([blk, 'content'])}>
          <Text tag="p" typography="s" dataAutoId={`${dataAutoId}_desc`}>
            {detailDescription}
          </Text>
          <Button
            category="primary"
            outline
            asLink
            target="_blank"
            href={newsLink}
            className={bemClass([blk, 'read-more'])}
            dataAutoId={`${dataAutoId}_read_more`}
          >
            Read more
          </Button>
        </div>
        <div className={bemClass([blk, 'footer'])}>
          <div className={bemClass([blk, 'footer-link-wrapper'])}>
            {newsIndex !== 0 && (
              <Link href={prevNewsUrl} className={bemClass([blk, 'footer-link'])} data-auto-d={`${dataAutoId}_previous`}>
                &lt; Previous
                <Text tag="p" typography="s" className={bemClass([blk, 'footer-links-desc'])} dataAutoId={`${dataAutoId}_previous_news`}>
                  {prevNewsName}
                </Text>
              </Link>
            )}
          </div>
          <div className={bemClass([blk, 'footer-link-wrapper', ['next']])}>
            {(newsIndex !== newsLength - 1) && (
              <Link href={nextNewsUrl} className={bemClass([blk, 'footer-link'])} data-auto-id={`${dataAutoId}_next`}>
                Next &gt;
                <Text tag="p" typography="s" className={bemClass([blk, 'footer-links-desc'])} dataAutoId={`${dataAutoId}_next_news`}>
                  {nextNewsName}
                </Text>
              </Link>
            )}
          </div>
        </div>
      </div>
    </MenuContentLayout>
  )
}

export default NewsMediaDetailContent
