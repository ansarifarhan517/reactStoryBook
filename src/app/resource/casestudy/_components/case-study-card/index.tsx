'use client'

import { useState, useEffect } from 'react'
import Image, { StaticImageData } from 'next/image'

import { bemClass } from '@/utils'

import Text from '@/components/text'
import SocialShare from '@/components/social-share'

import './style.scss'

type caseStudyCardProps = {
  dataAutoId: string
  image: StaticImageData
  title: string
  description: string
  hubSpotFormId: string
  shareUrl: string
  onDownloadHandler: (formId: string, title: string) => void
}

const blk = 'case-study-card'

const CaseStudyCard = ({
  dataAutoId,
  image,
  title,
  description,
  shareUrl,
  hubSpotFormId,
  onDownloadHandler,
}: caseStudyCardProps) => {

  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(window.location.host)
  }, [])

  const downloadHandler = () => {
    onDownloadHandler(hubSpotFormId, title)
  }

  return (
    <div className={bemClass([blk, {}, 'fade-in-effect'])} data-auto-id={dataAutoId}>
      <div className={bemClass([blk, 'image-wrapper'])}>
        <Image src={image} alt={title} fill className={bemClass([blk, 'image'])} data-auto-id={`${dataAutoId}_image`} />
      </div>
      <div className={bemClass([blk, 'content'])}>
        <Text
          tag="h3"
          typography="xl"
          dataAutoId={`${dataAutoId}_title`}
        >
          {title}
        </Text>
        <Text
          tag="p"
          typography="s"
          fontWeight="thin"
          color="gray-dark"
          dataAutoId={`${dataAutoId}_desc`}
        >
          {description}
        </Text>
      </div>
      <div className={bemClass([blk, 'share'])}>
        <SocialShare url={`${url}${shareUrl}`} dataAutoId={`${dataAutoId}_share`} />
      </div>
      <button
        onClick={downloadHandler}
        className={bemClass([blk, 'download'])}
        data-auto-id={`${dataAutoId}_download_now`}
      >
        Download now
      </button>
    </div>
  )
}

export default CaseStudyCard
