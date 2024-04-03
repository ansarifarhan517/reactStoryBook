import { Metadata } from 'next'

import PageCoverSection from '@/components/page-cover-section'
import PageCoverSectionContent from '@/components/page-cover-section-content'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import Container from '@/components/container'
import Awards from '@/components/awards'
import PageCoverSubSection from '@/components/page-cover-sub-section'
import ImageContentLayout from '@/components/image-content-layout'

import productHaul from '/public/platform-haul-bg.webp'
import productHaulInformation from './_data/haul_information'
import takeTheStressOutOfLogistics from '/public/products/haul/take-the-stress-out-of-logistics.webp'

import { bemClass } from '@/utils'

import './style.scss'

const blk = 'haul'

const Haul = () => (
  <>
    <PageCoverSection
      image={productHaul}
      imageAlt="Product Haul"
      dataAutoId="product_haul_section_1"
      className={bemClass([blk,'cover-section'])}
    >
      <Container fluid>
        <PageCoverSectionContent
          title="LogiNext Haul"
          description={`Get the best Transportation Optimization platform to gain end to end visibility over your logistical operations, avoid
          supply chain hiccups and lower overall transportation costs.`}
          withGartner
          withTrademark
          dataAutoId="product_haul_section_1_content"
        >
          <ButtonGroup>
            <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="product_haul_section_1_lets_talk">
              Lets talk
            </ModalTriggerButton>
            <ModalTriggerButton modalType="sign-up" category="secondary" size="large" dataAutoId="product_haul_section_1_sign_up">
              Sign up
            </ModalTriggerButton>
          </ButtonGroup>
        </PageCoverSectionContent>
      </Container>
    </PageCoverSection>
    <PageCoverSubSection
      title="Get a Complete View of Your Operations on the Best Cloud Based Transportation Management System (TMS)"
      description={`Manual processes and operations can slow you down, adding unwanted
        delays. With LogiNext HaulTM, identify shipment bottlenecks, track vehicles to
        channelize your line haul truck movements and shipments through our route
        optimization processes saving you resource time and fuel costs. Most TMS
        softwares can help you identify your truck capacity and provide tracking,
        however LogiNext HaulTM automates shipment assignments optimizing resource
        utilization with end to end GPS vehicle tracking to increase supply chain
        efficiency and decrease On-Time, in Full (OTIF) penalties.`}
      image={takeTheStressOutOfLogistics}
      dataAutoId="product_haul_section_2"
    />
    <ImageContentLayout
      content={productHaulInformation[0]}
      withFeatureBullet
      dataAutoId="product_haul_section_3"
    />
    <ImageContentLayout
      content={productHaulInformation[1]}
      withFeatureBullet
      dataAutoId="product_haul_section_4"
    />
    <ImageContentLayout
      content={productHaulInformation[2]}
      withFeatureBullet
      dataAutoId="product_haul_section_5"
    />

    <Awards dataAutoId="product_haul_section_6"/>
  </>
)

const title = 'LogiNext Haul | Best Transportation Optimization Platform'
const description = 'Need end-to-end & real-time visibility over your logistics operations? Choose LogiNext to offer you the best cloud-based Transportation Management System (TMS).'
const url = 'https://www.loginextsolutions.com/products/haul'

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
  Haul as default,
  metadata
}

