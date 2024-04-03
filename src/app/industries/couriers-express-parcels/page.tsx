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

import brandImages from '@/config/empowering-brands'

import couriersExpressParcelsBg from '/public/industries-couriers-express-parcels-bg.webp'
import couriersExpressParcelTab from '/public/industries/couriers-express-parcels/courier-express-parcel-tab-img.webp'

import industriesCouriersExpressParcels from './_data/couriers_express_parcels_information'
import { carouselItems, featureTag } from './_carousel-data'

import './style.scss'

const blk = 'industries-couriers-express-parcels'

const CouriersExpressParcels = () => (
  <>
    <PageCoverSection
      image={couriersExpressParcelsBg}
      imageAlt="couriers express parcels"
      dataAutoId="industries_couriers_express_parcels_section_1"
    >
      <Container fluid>
        <PageCoverSectionContent
          title="Courier, Express and Parcel"
          description={`Amazon and Uber have revolutionized eCommerce, mobility and deliveries.
          Courier companies and postal networks are rapidly undergoing a digital transformation
          journey to keep up and compete with the digital natives. LogiNext’s comprehensive
          and flexible parcel delivery management software lets you leapfrog into the future with
          delivery solutions that are plug & play.`}
          dataAutoId="industries_couriers_express_parcels_section_1_content"
        >
          <ButtonGroup>
            <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="industries_couriers_express_parcels_section_1_lets_talk">
              Lets talk
            </ModalTriggerButton>
          </ButtonGroup>
        </PageCoverSectionContent>
      </Container>
    </PageCoverSection>
    <ImageContentLayout content={industriesCouriersExpressParcels[0]} dataAutoId="industries_couriers_express_parcels_section_2">
      <ModalTriggerButton modalType="schedule-a-demo" category="primary" size="large" dataAutoId="industries_couriers_express_parcels_section_2_schedule_demo">
        Schedule a demo
      </ModalTriggerButton>
    </ImageContentLayout>
    <ImageContentLayout content={industriesCouriersExpressParcels[1]} dataAutoId="industries_couriers_express_parcels_section_3">
      <ModalTriggerButton modalType="sign-up" category="primary" size="large" dataAutoId="industries_couriers_express_parcels_section_3_sign_up">
        Sign up
      </ModalTriggerButton>
    </ImageContentLayout>
    <ImageContentLayout content={industriesCouriersExpressParcels[2]} dataAutoId="industries_couriers_express_parcels_section_4">
      <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="industries_couriers_express_parcels_section_4_talk_us">
       Talk to us
      </ModalTriggerButton>
    </ImageContentLayout>
    <SectionTitle
      category="dual"
      className={bemClass([blk, 'carousal-title'])}
      dataAutoId="industries_couriers_express_parcels_section_5_title"
    >
        Key Features
    </SectionTitle>
    <FeatureCarousel
      dataAutoId="industries_couriers_express_parcels_section_5"
      carouselItems={carouselItems}
      featureTag={featureTag}
      imageSrc={couriersExpressParcelTab}
    />
    <EmpoweringBrands
      brandsImages={brandImages['couriers-express-parcels']}
      industry ="couriers-express-parcels"
      dataAutoId="industries_couriers_express_parcels_section_6"
    />
  </>
)

const title = 'Courier, Express & Parcel | On-time Postal Delivery Service'
const description = 'LogiNext offers a comprehensive and flexible parcel delivery management software that lets you leapfrog into the future with delivery solutions. Call us today!'
const url = 'https://www.loginextsolutions.com/industries/couriers-express-parcels'

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
  CouriersExpressParcels as default,
  metadata
}
