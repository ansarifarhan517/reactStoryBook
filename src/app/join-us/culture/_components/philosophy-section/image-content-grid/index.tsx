import Image, { StaticImageData } from 'next/image'

import Text from '@/components/text'

import { bemClass } from '@/utils'

import './style.scss'

const blk = 'image-content-grid'

type ImageContentGrid = {
  item: {
    id: string
    title?: string | undefined
    description?: string | undefined
    image?: StaticImageData | undefined
    videoSrc?: string | undefined
    videoPoster?: string | undefined
  }
  className?: string
  dataAutoId?: string
}

const ImageContentGrid = ({ item, className, dataAutoId }: ImageContentGrid) => {
  if (item.description) {
    return (
      <div key={item.id} className={bemClass([blk, 'content', {}, className])}>
        <Text
          tag="h2"
          typography="l"
          color="gray-dark"
          className={bemClass([blk, 'title', {}, 'slide-fade-in-delay-1'])}
          dataAutoId={`${dataAutoId}_title`}
        >
          {item.title}
        </Text>
        <Text
          tag="h2"
          typography="m"
          color="gray-dark"
          className={bemClass([
            blk,
            'description',
            {},
            'slide-fade-in-delay-1',
          ])}
          dataAutoId={`${dataAutoId}_desc`}
        >
          {item.description}
        </Text>
      </div>
    )
  }
  if (item.image) {
    return (
      <div className={bemClass([blk,'image-container',{},className])}>
        <Image
          src={item.image}
          alt={item.id}
          className={bemClass([blk, 'image'])}
          data-auto-id={`${dataAutoId}_image`}
        />
      </div>
    )
  }
  if (item.videoSrc) {
    return (
      <div className={bemClass([blk, 'video-container', {}, className])}>
        <video
          preload="auto"
          autoPlay
          loop
          muted
          id={item.id}
          poster={item.videoPoster}
          className={bemClass([blk, 'video'])}
          data-auto-id={`${dataAutoId}_video`}
        >
          <source src={item.videoSrc} />
        </video>
      </div>
    )
  }
  return null
}

export default ImageContentGrid
