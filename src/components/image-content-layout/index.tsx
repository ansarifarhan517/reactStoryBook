import { ReactElement, ReactPortal } from 'react'
import Image, { StaticImageData } from 'next/image'

import { bemClass } from '@/utils'

import Container from '../container'
import SectionTitle from '../section-title'
import Parallax from '../parallax'
import InViewSlide from '../in-view-slide'

import Text from '../text'

import './style.scss'

type featureType = {
  id: string;
  label: string;
  description: string;
};

type contentType = {
  image: StaticImageData;
  imagePosition: string;
  title?: string;
  description?: string;
  features?: featureType[];
}

type imageContentLayoutProps = {
  content: contentType;
  children?: string | number | ReactElement | ReactElement[] | ReactPortal | boolean | null | undefined;
  className? : string;
  imageClass? : string;
  imageTitle?: string,
  imageAlt? : string
  imageDescription? : string
  category?: string
  withFeatureBullet?: boolean
  dataAutoId?: string
};

const blk = 'image-content-layout-positon'

const ImageContentLayout = ({
  content,
  children,
  className,
  imageClass,
  imageTitle,
  imageAlt,
  imageDescription,
  category = 'primary',
  withFeatureBullet = false,
  dataAutoId
}: imageContentLayoutProps) => {
  const {
    image,
    imagePosition,
    title = 'image',
    description,
    features
  } = content
  const eltClass = bemClass([
    blk,
    {
      [imagePosition]: imagePosition,
      [category]: category
    },
    className
  ])

  return (
    <Container fluid className={eltClass} dataAutoId={dataAutoId}>
      <>
        <Parallax
          offset={20}
          className={bemClass([blk, 'image-container', { [category]: category }, imageClass])}
        >
          <Image
            loading="lazy"
            src={image}
            title={imageTitle}
            alt={ imageAlt || title}
            aria-description={ imageDescription || imageAlt || title}
            className={bemClass([blk, 'image'])}
            data-auto-id={`${dataAutoId}_image`}
          />
        </Parallax>

        <InViewSlide
          className={bemClass([blk, 'content'])}
        >
          <>
            {title && (
              <SectionTitle
                category="primary"
                className={bemClass([blk,'title'])}
                dataAutoId={`${dataAutoId}_title`}
              >
                {title}
              </SectionTitle>
            )}
            {description && (
              <Text
                tag="p"
                className={bemClass([blk, 'description'])}
                dataAutoId={`${dataAutoId}_description`}
              >
                {description}
              </Text>
            )}
            {features && (
              <InViewSlide className={bemClass([blk, 'features'])}>
                <ul className={bemClass([blk, 'feature-list', { 'bullet': withFeatureBullet }])}>
                  {features?.map((feature,index) => (
                    <li key={feature.id} className={bemClass([blk, 'feature'])} data-auto-id={`${dataAutoId}_feature_${index}`}>
                      <Text tag="span" color="black" fontWeight="bold" dataAutoId={`${dataAutoId}_feature_${index}_label`}>
                        {feature.label}
                      </Text>
                      <Text tag="span" dataAutoId={`${dataAutoId}_feature_${index}_description`}>
                        {feature.description}
                      </Text>
                    </li>
                  ))}
                </ul>
              </InViewSlide>
            )}
            <InViewSlide>
              {children}
            </InViewSlide>
          </>
        </InViewSlide>
      </>
    </Container>
  )
}

export default ImageContentLayout
