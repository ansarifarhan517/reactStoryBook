import { ReactElement } from 'react'
import Image, { StaticImageData } from 'next/image'

import { bemClass } from '@/utils'

import Container from '../container'
import SectionTitle from '../section-title'
import Text from '../text'
import Button from '../button'
import VideoButton from '../video-button'

import './style.scss'

type pageCoverSubSectionProps = {
  title?: string;
  description?: string;
  buttonLabel?: string;
  redirectUrl?: string;
  buttonCategory?: 'primary' | 'secondary' | 'default';
  isCenter?: boolean;
  image?: string | StaticImageData;
  video?: string;
  videoTrackingId?: string
  videoTitle?: string
  imageTitle?: string
  imageAlt?: string
  imageDescription?: string
  children?: ReactElement | ReactElement[];
  dataAutoId?: string
}

const blk = 'page-cover-sub-section'

const PageCoverSubSection = ({
  title = '',
  description,
  buttonLabel,
  buttonCategory = 'secondary',
  redirectUrl,
  isCenter,
  image = '',
  video,
  videoTrackingId = '',
  videoTitle = '',
  imageAlt,
  imageTitle,
  imageDescription,
  children,
  dataAutoId
}: pageCoverSubSectionProps) => (
  <div className={bemClass([blk, { 'center': isCenter }])} data-auto-id={dataAutoId}>
    <Container fluid className={bemClass([blk, 'container'])}>
      <div className={bemClass([blk, 'content'])} data-auto-id={`${dataAutoId}_content`}>
        <SectionTitle color="black" dataAutoId={`${dataAutoId}_title`}>
          {title}
        </SectionTitle>
        <Text tag="p" className={bemClass([blk, 'description'])} dataAutoId={`${dataAutoId}_description`}>
          {description}
        </Text>
        {buttonLabel && (
          <Button
            category={buttonCategory}
            asLink
            size="large"
            href={redirectUrl}
            target="_blank"
            dataAutoId={`${dataAutoId}_description`}
          >
            {buttonLabel}
          </Button>
        )}
      </div>
      <>
        {image && (
          <div className={bemClass([blk, 'image-holder'])}>
            <Image
              src={image}
              alt={imageAlt || title}
              title={imageTitle || title}
              aria-description={imageDescription || imageAlt || imageTitle || title }
              loading="lazy"
              className={bemClass([blk, 'image'])}
              data-auto-id={`${dataAutoId}_image`}
              fill
            />
            {video && (
              <div className={bemClass([blk, 'video'])} data-auto-id={`${dataAutoId}_video`}>
                <VideoButton
                  videoUrl={video}
                  videoTrackingId={videoTrackingId}
                  videoTitle={videoTitle}
                />
              </div>
            )}
          </div>
        )}
      </>
    </Container>
    <Container fluid className={bemClass([blk, 'card-container'])} dataAutoId={`${dataAutoId}_children`}>
      {children}
    </Container>
  </div>
)

export default PageCoverSubSection
