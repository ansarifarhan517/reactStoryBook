import Image, { StaticImageData } from 'next/image'

import { bemClass } from '@/utils'

import Text from '@/components/text'
import Button from '@/components/button'
import SocialShare from '@/components/social-share'

import './style.scss'

const blk = 'news-media-card'

type newsMediaCardProps = {
  title: string
  description: string
  icon?: string
  url: string
  image?: StaticImageData
  iconClass?: string
  dataAutoId?: string
}

const NewsMediaCard = ({
  title,
  description,
  url,
  image,
  dataAutoId
}: newsMediaCardProps) => (
  <div key={title} className={bemClass([blk, {}, 'box-hover-effect'])}>
    {image && (
      <Image
        src={image}
        alt={title}
        className={bemClass([blk, 'image'])}
        data-auto-id={`${dataAutoId}_image`}
      />
    )}
    <Text
      tag="h2"
      typography="l"
      fontWeight="thin"
      className={bemClass([blk, 'title'])}
      dataAutoId={`${dataAutoId}_title`}
    >
      {title}
    </Text>
    <Text
      tag="p"
      typography="s"
      fontWeight="thin"
      className={bemClass([blk, 'description'])}
      dataAutoId={`${dataAutoId}_desc`}
    >
      {description}
    </Text>
    <div className={bemClass([blk, 'footer'])}>
      <Button
        asLink
        category="primary"
        outline
        className={bemClass([blk, 'button'])}
        href={url}
        dataAutoId={`${dataAutoId}_know_more`}
      >
        Know More
      </Button>
      <SocialShare url={url} dataAutoId={`${dataAutoId}_share`} />
    </div>
  </div>
)

export default NewsMediaCard
