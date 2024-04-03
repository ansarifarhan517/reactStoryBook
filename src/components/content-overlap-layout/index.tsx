import { ReactElement } from 'react'
import Image, { StaticImageData } from 'next/image'

import { bemClass } from '@/utils'

import Container from '../container'
import SectionTitle from '../section-title'
import Text from '../text'

import './style.scss'

type contentOverlapLayoutProps = {
  image: StaticImageData;
  title: string;
  description: string;
  contentBgCategory?: 'primary' | 'secondary'
  blogUrl: string;
  blogLinkCategory?: 'primary' | 'secondary';
  children: ReactElement | ReactElement[];
  className?: string;
  dataAutoId?: string
}

const blk = 'content-overlap-layout'

const ContentOverlapLayout = ({
  image,
  title,
  description,
  contentBgCategory = 'primary',
  blogUrl,
  blogLinkCategory = 'primary',
  children,
  className,
  dataAutoId
}: contentOverlapLayoutProps) => {
  const isSecondary = contentBgCategory === 'secondary'
  const textColor = isSecondary ? 'white' : 'gray-dark'
  return (
    <Container
      className={bemClass([
        blk,
        {
          [contentBgCategory]: !!contentBgCategory,
        },
        className
      ])}
      dataAutoId={dataAutoId}
    >
      <div className={bemClass([
        blk,
        'wrapper',
        {
          [contentBgCategory]: !!contentBgCategory,
        }
      ])}>
        <div
          className={bemClass([
            blk,
            'content',
            {
              [contentBgCategory]: !!contentBgCategory,
            }
          ])}
          data-auto-id={`${dataAutoId}_content`}
        >
          <SectionTitle
            category="secondary"
            color={textColor}
            borderPosition="left"
            fontWeight="thin"
            className={bemClass([blk, 'title'])}
            dataAutoId={`${dataAutoId}_title`}
          >
            {title}
          </SectionTitle>
          <Text
            tag="p"
            color={textColor}
            className={bemClass([blk, 'description'])}
            dataAutoId={`${dataAutoId}_description`}
          >
            {description}
          </Text>
          {children}
        </div>
        <a
          href={blogUrl}
          target="_blank"
          className={bemClass([
            blk,
            'link',
            {
              [blogLinkCategory]: !!blogLinkCategory,
            }
          ])} rel="noreferrer"
          data-auto-id={`${dataAutoId}_read_blog`}
        >
          <span>Read blog</span>
          <span className={bemClass([blk, 'arrow'])}>&#8594;</span>
        </a>
      </div>
      <div className={bemClass([blk, 'image-holder'])}>
        <Image fill src={image} alt={title} className={bemClass([blk, 'image'])} data-auto-id={`${dataAutoId}_image`} />
      </div>
    </Container>
  )
}

export default ContentOverlapLayout
