'use client'
import Image, { StaticImageData } from 'next/image'

import { bemClass } from '@/utils'

import Text from '@/components/text'
import Button from '@/components/button'
import SocialShare from '@/components/social-share'

import './style.scss'

type whitePaperCardProps = {
  dataAutoId: string
  image: StaticImageData
  title: string
  description: string
  hubSpotFormId: string
  onDownloadHandler: (formId: string, title: string) => void
}

const blk = 'white-paper-card'

const WhitePaperCard = ({
  dataAutoId,
  image,
  title,
  description,
  hubSpotFormId,
  onDownloadHandler,
}: whitePaperCardProps) => {

  const downloadHandler = () => {
    onDownloadHandler(hubSpotFormId, title)
  }

  return (
    <div className={blk} data-auto-id={dataAutoId}>
      <div className={bemClass([blk, 'image-wrapper'])}>
        <Image
          src={image}
          alt={title}
          fill
          className={bemClass([blk, 'image'])}
          data-auto-id={`${dataAutoId}_image`}
        />
      </div>
      <div className={bemClass([blk, 'content'])}>
        <Text
          tag="h2"
          typography="xxl"
          fontWeight="semi-bold"
          className={bemClass([blk, 'title'])}
          dataAutoId={`${dataAutoId}_title`}
        >
          {title}
        </Text>
        <Text tag="p" typography="s" dataAutoId={`${dataAutoId}_desc`}>
          {description}
        </Text>
        <div className={bemClass([blk, 'download'])}>
          <Button
            category="default"
            outline
            clickHandler={downloadHandler}
            dataAutoId={`${dataAutoId}_download_now`}
          >
            Download now
          </Button>
          <SocialShare url="" dataAutoId={`${dataAutoId}_share`} />
        </div>
      </div>
    </div>
  )
}

export default WhitePaperCard
