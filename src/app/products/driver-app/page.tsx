import { Metadata } from 'next'

import { bemClass } from '@/utils'

import PageCoverSection from '@/components/page-cover-section'
import PageCoverSectionContent from '@/components/page-cover-section-content'
import PageCoverSubSectionCard from '@/components/page-cover-sub-section-card'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import Container from '@/components/container'
import Awards from '@/components/awards'
import PageCoverSubSection from '@/components/page-cover-sub-section'
import ImageContentLayout from '@/components/image-content-layout'

import productDriverApp from '/public/platform-driver-app-bg.webp'
import productDriverAppInformation from './_data/driver_app_information'

import './style.scss'

const blk = 'driver-app'

const DriverApp = () => (
  <>
    <PageCoverSection
      image={productDriverApp}
      imageAlt="Driver app"
      dataAutoId="product_driver_app_section_1"
      className={blk}
      imageClassName={bemClass([blk, 'image'])}
    >
      <Container fluid>
        <PageCoverSectionContent
          title="LogiNext Driver App"
          description={`In this fast paced environment, your drivers deserve the best mobile application to fulfill orders in the most efficient manner.
          LogiNext’s delivery driver application has an intuitive interface with gamification inbuilt through
          which you can incentivize drivers to deliver with the maximum efficiency.`}
          withGartner
          withTrademark
          dataAutoId="product_driver_app_section_1_content"
        >
          <ButtonGroup>
            <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="product_driver_app_section_1_lets_talk">
              Lets talk
            </ModalTriggerButton>
            <ModalTriggerButton modalType="sign-up" category="secondary" size="large" dataAutoId="product_driver_app_section_1_sign_up">
              Sign up
            </ModalTriggerButton>
          </ButtonGroup>
        </PageCoverSectionContent>
      </Container>
    </PageCoverSection>
    <PageCoverSubSection
      title="USPs of the LogiNext Driver App"
      description={`Features like real time tracking of vehicles, eSign, bulk pickups,
        hotspots, online/offline status, break times, payments and configuring
        region specific regulations along with a gamified experience let you get
        the best out of your delivery fleet and deliver a great customer experience.`}
      isCenter
      dataAutoId="product_driver_app_section_2"
    >
      <>
        <PageCoverSubSectionCard
          iconName="delivery-driver"
          description="Comprehensive delivery driver software to guide and assist riders in all aspects of order delivery."
          dataAutoId="product_driver_app_section_2_card_1"
        />
        <PageCoverSubSectionCard
          iconName="large-home-slider-retail--e-commerce-omnichannel-distribution"
          description="Flexible and scalable, handling millions of orders every day."
          dataAutoId="product_driver_app_section_2_card_2"
        />
        <PageCoverSubSectionCard
          iconName="customer-invoicing"
          description="Integrated payments and communications modules."
          dataAutoId="product_driver_app_section_2_card_3"
        />
      </>
    </PageCoverSubSection>
    <ImageContentLayout
      content={productDriverAppInformation[0]}
      withFeatureBullet
      dataAutoId="product_driver_app_section_3"
    >
      <ButtonGroup>
        <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="product_driver_app_section_3_lets_talk">
            Lets talk
        </ModalTriggerButton>
        <ModalTriggerButton modalType="sign-up" category="secondary" size="large" dataAutoId="product_driver_app_section_3_sign_up">
            Sign up
        </ModalTriggerButton>
      </ButtonGroup>
    </ImageContentLayout>
    <ImageContentLayout
      content={productDriverAppInformation[1]}
      withFeatureBullet
      dataAutoId="product_driver_app_section_4"
    />
    <Awards dataAutoId="product_driver_app_section_5" />
  </>
)

const title = 'LogiNext Driver App | Mobile Management | Real Time Tracking'
const description = 'LogiNext\'s Driver App allows drivers assistance with delivery aspects, integrated payments, delivery proof, gamification, order scan, and more. Call for a demo!'
const url = 'https://www.loginextsolutions.com/products/driver-app'

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
  DriverApp as default,
  metadata
}

