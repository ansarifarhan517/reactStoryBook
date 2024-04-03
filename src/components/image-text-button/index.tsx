import React, { ReactElement } from 'react'
import Image, { StaticImageData } from 'next/image'
import { bemClass } from '@/utils'

import Text from '../text'

import './style.scss'

type imageTextButtonProps = {
  image : StaticImageData
  title: string
  description?: string
  children: ReactElement | ReactElement[] | string | number | null | undefined;
  showTitle?: boolean //by deafult title will be hidden for mobile view if you want to see title make this props true
  className?: string
  dataAutoId?: string
}

const blk = 'image-text-button'

const ImageTextButton = ({
  image, title, description, children, showTitle = false, className, dataAutoId
}: imageTextButtonProps) => (
  <div className={bemClass([blk, {}, className])}>
    <Image
      src={image}
      alt={title}
      className={bemClass([blk, 'image'])}
      fill
      objectFit="cover"
      data-auto-id={`${dataAutoId}_image_${title}`}
    />
    <div className={bemClass([blk, 'overlay'])}>
      <div className={bemClass([blk, 'message'])}>
        <Text
          tag="h1"
          typography="xxl"
          className={bemClass([blk, 'title', { 'showTitle' : showTitle }])}
          color="white"
          fontWeight="thin"
          dataAutoId={`${dataAutoId}_title`}
        >
          {title}
        </Text>
        <Text
          tag="h1"
          typography="m"
          className={bemClass([blk, 'description'])}
          color="white"
          dataAutoId={`${dataAutoId}_desc`}
        >
          {description}
        </Text>
        <div className={bemClass([blk, 'buttons'])}>
          {children}
        </div>
      </div>
    </div>
  </div>
)

export default ImageTextButton
