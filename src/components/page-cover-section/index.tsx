import { ReactElement, ReactPortal } from 'react'
import Image, { StaticImageData } from 'next/image'

import { bemClass } from '@/utils'

import './style.scss'

type pageCoverSectionProps = {
  image: StaticImageData;
  imageAlt: string;
  children?: string | number | ReactElement | ReactPortal | boolean | null | undefined;
  className?: string;
  contentClassName?: string;
  imageTitle?: string
  imageDescription?: string;
  dataAutoId?: string
  imageClassName?: string
}

const blk = 'page-cover-section'

const PageCoverSection = ({
  image,
  imageTitle,
  imageDescription,
  imageAlt,
  children,
  className,
  contentClassName,
  dataAutoId,
  imageClassName
}: pageCoverSectionProps) => (
  <div className={bemClass([blk, {}, className])} data-auto-id={dataAutoId}>
    <Image
      src={image}
      alt={imageAlt}
      title={imageTitle || imageAlt}
      aria-description={imageDescription || imageAlt || imageTitle}
      fill
      priority
      className={bemClass([blk, 'image', {}, imageClassName])}
      data-auto-id = {`${dataAutoId}_image`}
    />
    <div
      className={bemClass([blk, 'content',
        {},
        contentClassName])}
      data-auto-id = {`${dataAutoId}_content`}
    >
      {children}
    </div>
  </div>
)

export default PageCoverSection

