import { ReactElement, ReactPortal } from 'react'
import Image, { StaticImageData } from 'next/image'

import { bemClass } from '@/utils'

import Container from '../container'
import Parallax from '../parallax'

import './style.scss'

type productInformativeLayoutProps = {
  image: StaticImageData;
  imageAlt: string;
  loading?: 'eager' | 'lazy';
  hAlign?: 'left' | 'right';
  vAlign?: 'top' | 'bottom';
  contentAlign?: 'middle' | 'start';
  children?: string | number | ReactElement | ReactElement[] | ReactPortal | boolean | null | undefined;
  className?: string;
  widthBg?: boolean;
  dataAutoId?: string
  containerClassName?: string
  isCoverSection?: boolean
}

const blk = 'product-informative-layout'

const ProductInformativeLayout = ({
  image,
  imageAlt,
  loading = 'lazy',
  hAlign = 'right',
  vAlign = 'top',
  contentAlign = 'middle',
  children,
  widthBg = false,
  className,
  containerClassName,
  dataAutoId,
  isCoverSection
}: productInformativeLayoutProps) => (
  <div
    className={bemClass([
      blk,
      { 'cover-section': isCoverSection,
        'with-bg': widthBg },
      className
    ])}
    data-auto-id={dataAutoId}
  >
    <Container
      className={bemClass([
        blk,
        'container',
        {
          [hAlign]: !!hAlign,
          [vAlign]: !!vAlign,
          [contentAlign]: !!contentAlign
        },
        containerClassName
      ])}
    >
      <Parallax
        className={bemClass([blk, 'image-holder'])}
        offset={50}
      >
        <Image
          src={image}
          alt={imageAlt}
          loading={loading}
          priority={!loading}
          className={bemClass([blk, 'image', { [hAlign]: !!hAlign },])}
          data-auto-id={`${dataAutoId}_image`}
        />
      </Parallax>
      <div className={bemClass([blk, 'content'])} data-auto-id={`${dataAutoId}_content`}>
        {children}
      </div>
    </Container>
  </div>
)

export default ProductInformativeLayout
