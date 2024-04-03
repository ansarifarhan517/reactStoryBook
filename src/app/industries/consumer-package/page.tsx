import { Metadata } from 'next'

import { bemClass } from '@/utils'

import PageCoverSection from '@/components/page-cover-section'
import PageCoverSectionContent from '@/components/page-cover-section-content'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import Container from '@/components/container'
import EmpoweringBrands from '@/components/empowering-brands'
import ImageContentLayout from '@/components/image-content-layout'
import SectionTitle from '@/components/section-title'
import FeatureCarousel from '@/components/feature-carousel'

import consumerPackageBg from '/public/industries-consumer-package-bg.webp'
import industriesConsumerPackageInformation from './_data/consumer_package_information'
import keyFeaturesConsumerPackageImg from '/public/industries/consumer-package/key-features-consumer-packaged-goods-img.webp'

import brandImages from '@/config/empowering-brands'

import { carouselItems, featureTag } from './_carousel-data'

import './style.scss'

const blk = 'consumer-package'

const ConsumerPackage = () => (
  <>
    <PageCoverSection
      image={consumerPackageBg}
      imageAlt="consumer packages"
      dataAutoId="consumer_packages_section_1"
    >
      <Container fluid>
        <PageCoverSectionContent
          title="Consumer Packaged Goods"
          description={`You need a flexible and comprehensive dispatching and scheduling
          software for the exploding needs of the CPG industry. Right from moving goods
          from warehouse to stores to last mile deliveries to the customers’ doorsteps,
          get the logistics software solutions recommended by experts.`}
          dataAutoId="consumer_packages_section_1_content"
        >
          <ButtonGroup>
            <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="consumer_packages_section_1_lets_talk">
              Talk to us
            </ModalTriggerButton>
          </ButtonGroup>
        </PageCoverSectionContent>
      </Container>
    </PageCoverSection>
    <ImageContentLayout content={industriesConsumerPackageInformation[0]} dataAutoId="consumer_packages_section_2">
      <ModalTriggerButton modalType="schedule-a-demo" category="primary" size="large" dataAutoId="consumer_packages_section_2_schedule_demo">
        Schedule a demo
      </ModalTriggerButton>
    </ImageContentLayout>
    <ImageContentLayout content={industriesConsumerPackageInformation[1]} dataAutoId="consumer_packages_section_3">
      <ModalTriggerButton modalType="sign-up" category="primary" size="large" dataAutoId="consumer_packages_section_3_sign_up">
        Sign up
      </ModalTriggerButton>
    </ImageContentLayout>
    <SectionTitle
      category="dual"
      className={bemClass([blk, 'carousal-title'])}
      dataAutoId="retail_and_ecommerce_section_5_title"
    >
      Key Features
    </SectionTitle>
    <FeatureCarousel
      dataAutoId="retail_and_ecommerce_section_5"
      carouselItems={carouselItems}
      featureTag={featureTag}
      imageSrc={keyFeaturesConsumerPackageImg}
    />
    <EmpoweringBrands
      brandsImages={brandImages['consumer-packages']}
      industry="consumer-packages"
      dataAutoId="consumer_packages_section_4"
    />
  </>
)

const title = 'Consumer Packaged Goods | Best Delivery Management Software'
const description = 'LogiNext is your one-stop solution offering stress-free logistics operations for on-time deliveries with real-time tracking links, geofencing, order scans, etc. '
const url = 'https://www.loginextsolutions.com/industries/consumer-package'

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
  ConsumerPackage as default,
  metadata
}
