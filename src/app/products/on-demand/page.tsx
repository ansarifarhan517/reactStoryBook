import { Metadata } from 'next'

import { bemClass } from '@/utils'

import PageCoverSection from '@/components/page-cover-section'
import PageCoverSubSection from '@/components/page-cover-sub-section'
import PageCoverSectionContent from '@/components/page-cover-section-content'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import Container from '@/components/container'
import Awards from '@/components/awards'
import ImageContentLayout from '@/components/image-content-layout'

import productOnDemandBg from '/public/platform-on-demand-bg.webp'
import productOnDemandInformation from './_data/on_demand_information'
import optimizeAndAllocatePickUp from '/public/products/on-demand/optimize-and-allocate-pick-up.webp'

import './style.scss'

const blk = 'on-demand'

const OnDemand = () => (
  <>
    <PageCoverSection
      image={productOnDemandBg}
      imageAlt="Product on demand"
      dataAutoId="product_ondemand_section_1"
      className={blk}
      imageClassName={bemClass([blk, 'image'])}
    >
      <Container fluid>
        <PageCoverSectionContent
          title="LogiNext On-Demand"
          description="Faster and better on-time pickups and deliveries using our enhanced route planning and auto delivery allocation software."
          withGartner
          withTrademark
          dataAutoId="product_ondemand_section_1_content"
        >
          <ButtonGroup>
            <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="product_ondemand_section_1_lets_talk">
              Lets talk
            </ModalTriggerButton>
            <ModalTriggerButton modalType="sign-up" category="secondary" size="large" dataAutoId="product_ondemand_section_1_sign_up">
              Sign up
            </ModalTriggerButton>
          </ButtonGroup>
        </PageCoverSectionContent>
      </Container>
    </PageCoverSection>
    <PageCoverSubSection
      title="Optimize and Allocate Pick-Up and Deliveries with Maximum Efficiency"
      description={`You cannot predict when an on-demand pick-up or delivery request will
      arrive, and this complicates your resource planning and management. LogiNext software
      has full visibility of your available resources, their allocated orders, location,
      load, routes, etc, and therefore when a new order arrives, it is able to dynamically
      auto-allocate the order to the best available resource keeping all these factors in
      consideration, thereby improving your resource utilization and efficiency, both.`}
      image={optimizeAndAllocatePickUp}
      dataAutoId="product_ondemand_section_2"
    />
    <ImageContentLayout
      content={productOnDemandInformation[0]}
      withFeatureBullet
      dataAutoId="product_ondemand_section_3"
    />
    <ImageContentLayout
      content={productOnDemandInformation[1]}
      withFeatureBullet
      dataAutoId="product_ondemand_section_4"
    />
    <ImageContentLayout
      content={productOnDemandInformation[2]}
      withFeatureBullet
      dataAutoId="product_ondemand_section_5"
    />

    <Awards dataAutoId="product_haul_section_6" />
  </>
)

const title = 'LogiNext On-Demand | On Demand Delivery Management Software'
const description = 'LogiNext offers an on-demand delivery management system to help with route optimization & planning, helping with efficient fleet utilization. Setup a demo now!'
const url = 'https://www.loginextsolutions.com/products/on-demand'

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
  OnDemand as default,
  metadata
}

