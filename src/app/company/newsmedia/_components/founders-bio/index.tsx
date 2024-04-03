'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

import Text from '@/components/text'
import MenuContentLayout from '@/components/menu-content-layout'

import { bemClass } from '@/utils'

import dhruvilSanghvi from '/public/dhruvil-sanghvi.webp'

import { menuList } from '../../_data'

import './style.scss'

const blk = 'founders-bio'

type foundersBioProps = {
  dataAutoId?: string
}

const FoundersBio = ({ dataAutoId }: foundersBioProps) => {
  const router = useRouter()
  const [selectedItem, setSelectedItem] = useState<string>('')
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
      className={bemClass([blk, 'mobile-menu-visible'])}
    >
      <div className={blk}>
        <div className={bemClass([blk, 'title'])}>
          <Text tag="h1" typography="xxl" color="gray-darker" dataAutoId={`${dataAutoId}_founder_profile`}>
            Founder Profile
          </Text>
        </div>
        <div className={bemClass([blk, 'content'])}>
          <Text tag="p" className={bemClass([blk, 'description'])} dataAutoId={`${dataAutoId}_desc_1`}>
            LogiNext&apos;s founder Dhruvil Sanghvi has established himself as one of the top
            entrepreneurs by scaling LogiNext globally and making it one of the fastest growing
            SaaS companies.
          </Text>
          <Text tag="p" className={bemClass([blk, 'description'])} dataAutoId={`${dataAutoId}_desc_2`}>
            Since the inception of LogiNext, Dhruvil has been eager to lead, consult, and
            mentor young entrepreneurs and companies on the path towards success.
          </Text>
          <Text tag="p" className={bemClass([blk, 'description'])} dataAutoId={`${dataAutoId}_desc_3`}>
            LogiNext&apos;s core team has received multiple awards and recognitions to commemorate the
            growth of the company and it is a testament to the leadership team.
          </Text>
          <div className={bemClass([blk, 'founder'])}>
            <Text tag="h2" typography="xxl" dataAutoId={`${dataAutoId}_founder_name`}>Dhruvil Sanghvi</Text>
            <Text tag="span" dataAutoId={`${dataAutoId}_founder_designation`}>Founder & Chief Executive Officer</Text>
          </div>
          <Image
            src={dhruvilSanghvi}
            alt="Dhruvil Shangvi, CO-FOUNDER & CEO, LOGINEXT"
            loading="eager"
            data-auto-id={`${dataAutoId}_founder_image`}
            className={bemClass([blk, 'image'])}
          />
          <Text tag="p" className={bemClass([blk, 'description'])} dataAutoId={`${dataAutoId}_founder_desc_1`}>
            CEO and Founder of LogiNext, youngest tech business head in Forbes India 30 under 30 (2017),
            started his journey post Carnegie Mellon University and effectively led LogiNext, the fastest
            growing field workforce optimization SaaS enterprise, to glory. His vision and insights have
            transformed how the entire industry views logistics management automation.
          </Text>
          <Text tag="p" className={bemClass([blk, 'description'])} dataAutoId={`${dataAutoId}_founder_desc_2`}>
            His stature is of a leader with immense knowledge and expertise in the art of deciphering the
            dynamics of any business. Before initiating his journey as an entrepreneur, he performed as a
            consultant to many Fortune 500 companies such as Ernst & Young and Deloitte. He still extends
            his expertise as a consultant to many incubated startups. Being an early stage investor, he
            plays the role of a masterful mentor while honing and guiding the young entrepreneurs on their
            individual journeys.
          </Text>
          <Text tag="p" className={bemClass([blk, 'description'])} dataAutoId={`${dataAutoId}_founder_desc_3`}>
            LogiNext, under Dhruvil stewardship, has gained world renown by consistently pushing
            technology and logistics benchmarks.
          </Text>
        </div>
      </div>
    </MenuContentLayout>
  )
}

export default FoundersBio
