'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import React, { useState } from 'react'

import Text from '@/components/text'
import MenuContentLayout from '@/components/menu-content-layout'

import { bemClass } from '@/utils'
import { data, menuList } from '@/config/api-integration'

import './style.scss'

const blk = 'integration-information'

type itergationNamePorps = {
  integrationName: string
}

const IntergrationInformation = ({ integrationName }: itergationNamePorps) => {
  const selectedIntegration = integrationName ? data.find(intergation => intergation.url === `integrationdetail/${integrationName}`) : data[0]
  const { category = '' } = selectedIntegration || {}
  const [selectedItem, setSelectedItem] = useState<string>(category)

  const router = useRouter()

  const handleClickHandler = (id: string) => {
    setSelectedItem(id)
    if (window.sessionStorage) {
      window.sessionStorage.setItem('integrationName', id)
    }
    router.push('/integration')
  }

  return (
    <MenuContentLayout
      menuList={menuList}
      selectedItem={ selectedItem}
      clickHandler={handleClickHandler}
      menuPosition= "down"
      mobileSideBarLabel="All Integration"
    >
      {selectedIntegration && (
        <div className={bemClass([blk])}>
          <div className={bemClass([blk, 'image-container'])}>
            {selectedIntegration.image && <Image
              src={selectedIntegration.image}
              alt={selectedIntegration?.id}
              className={bemClass([blk,'image'])}
            />}
          </div>
          <Text
            tag="h1"
            color="black"
            fontWeight="semi-bold"
            typography="xl"
            className={bemClass([blk, 'title'])}
          >
            {selectedIntegration?.name}
          </Text>
          <Text
            tag="h1"
            color="black"
            typography="l"
            className={bemClass([blk, 'description'])}
          >
            {selectedIntegration?.content}
          </Text>
        </div>
      )}
    </MenuContentLayout>
  )
}

export default IntergrationInformation
