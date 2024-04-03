import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

import { bemClass } from '@/utils'

import Container from '@/components/container'
import Text from '@/components/text'

import ResourceCoverSection from '../_components/resource-cover-section'

import infoGraphicData from './_data'

import './style.scss'

const blk = 'resource-inforgraphic'

const InfoGraphic = () => (
  <>
    <ResourceCoverSection resource="infographic" dataAutoId="resources_info_graphic">
      <Container>
        <div className={blk}>
          {infoGraphicData.map(({ id, title, image, altText, link }: any) => (
            <Link
              key={id}
              href={link}
              target="_blank"
              data-auto-id={`resources_info_graphic_card_${id}`}
              className={bemClass([blk, 'card'])}
            >
              <Text tag="p" fontWeight="bold" dataAutoId={`resources_info_graphic_card_${id}_title`}>
                {title}
              </Text>
              <div className={bemClass([blk, 'image-wrapper'])}>
                <Image src={image} alt={altText} fill className={bemClass([blk, 'image'])} data-auto-id={`resources_info_graphic_card_${id}_image`} />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </ResourceCoverSection>
  </>
)

const title = 'LogiNext Resources | Infographic'
const description = 'Find the best resources related to first-mile, middle-mile, and last-mile deliveries, field workforce management, and on-demand deliveries in logistics.'
const url = 'https://www.loginextsolutions.com/resource/infographic'

const metadata: Metadata = {
  title,
  description,
  openGraph: {
    locale: 'en_US',
    type: 'website',
    title,
    description,
    url,
    siteName: 'loginextsolutions',
  },
  twitter: {
    title,
    description,
    card: 'summary'
  },
  metadataBase: new URL('https://www.loginextsolutions.com'),
}

export {
  InfoGraphic as default,
  metadata
}
