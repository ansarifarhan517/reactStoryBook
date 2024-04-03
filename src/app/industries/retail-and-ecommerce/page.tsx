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

import retailAndEcommerceBg from '/public/industries-retail-and-ecommerce-bg.webp'
import keyFeaturesReatilEcommerceImg from '/public/industries/retail-and-ecommerce/key-features-retail-and-ecommerce-img.webp'

import industriesRetailEcommerceInformation from './_data/retail_and_ecommerce_information'
import { carouselItems, featureTag } from './_carousel-data'

import './style.scss'

const blk = 'retail-and-ecommerce'

const RetailAndEcommerce = () => (
  <>
    <PageCoverSection
      image={retailAndEcommerceBg}
      imageAlt="retail and ecommerce"
      dataAutoId="retail_and_ecommerce_section_1"
    >
      <Container fluid>
        <PageCoverSectionContent
          title="Retail and eCommerce"
          description={`Consumer expectations have dramatically shifted and eCommerce has become extremely
          competitive with the emergence of new models of delivering products and goods.
          Deliver on time, every time with the most advanced delivery solutions for eCommerce.`}
          dataAutoId="retail_and_ecommerce_section_1_content"
        >
          <ButtonGroup>
            <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="retail_and_ecommerce_section_1_lets_talk">
              Lets talk
            </ModalTriggerButton>
          </ButtonGroup>
        </PageCoverSectionContent>
      </Container>
    </PageCoverSection>
    <ImageContentLayout content={industriesRetailEcommerceInformation[0]} dataAutoId="retail_and_ecommerce_section_2">
      <ModalTriggerButton modalType="schedule-a-demo" category="primary" size="large" dataAutoId="retail_and_ecommerce_section_2_schedule_demo">
        Schedule a demo
      </ModalTriggerButton>
    </ImageContentLayout>
    <ImageContentLayout content={industriesRetailEcommerceInformation[1]} dataAutoId="retail_and_ecommerce_section_3">
      <ModalTriggerButton modalType="sign-up" category="primary" size="large" dataAutoId="retail_and_ecommerce_section_3_sign_up">
        Sign up
      </ModalTriggerButton>
    </ImageContentLayout>
    <ImageContentLayout content={industriesRetailEcommerceInformation[2]} dataAutoId="retail_and_ecommerce_section_4">
      <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="retail_and_ecommerce_section_4_talk_to_us">
       Talk to us
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
      imageSrc={keyFeaturesReatilEcommerceImg}
    />
    <EmpoweringBrands
      brandsImages={brandImages['retail-and-ecommerce']}
      industry="retail-and-ecommerce"
      dataAutoId="retail_and_ecommerce_section_6"
    />
  </>
)

const title = 'Retail & eCommerce | Retail Distribution Software | LogiNext'
const description = 'Automate pick-up and deliveries, schedule deliveries, easy carrier management & smart route planning are some of the key features offered by LogiNext. Call Now!'
const url = 'https://www.loginextsolutions.com/industries/retail-and-ecommerce'

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
  RetailAndEcommerce as default,
  metadata
}

