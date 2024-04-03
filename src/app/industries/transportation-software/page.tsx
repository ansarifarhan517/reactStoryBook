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

import transportationSoftwareBg from '/public/industries-transportation-software-bg.webp'
import industriesTransportationSoftwareInformation from './_data/transportation_software_information'
import keyFeaturesTransportationSoftwareImg from '/public/industries/transportation-software/key-features-transportation-and-logistics-img.webp'

import { carouselItems, featureTag } from './_carousel-data'

import './style.scss'

const blk = 'transportation-software'

const TransportationSoftware = () => (
  <>
    <PageCoverSection
      image={transportationSoftwareBg}
      imageAlt="Transportation software"
      dataAutoId="transportation_software_section_1"
    >
      <Container fluid>
        <PageCoverSectionContent
          title="Transportation and Logistics"
          description={`Get real time visibility over your logistics operations across states,
          countries or continents with the best TMS (transportation management software).
          Get insights, take action, relieve stress from the supply chain.`}
          dataAutoId="transportation_software_section_1_content"
        >
          <ButtonGroup>
            <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="transportation_software_section_1_lets_talk">
              Lets talk
            </ModalTriggerButton>
          </ButtonGroup>
        </PageCoverSectionContent>
      </Container>
    </PageCoverSection>
    <ImageContentLayout content={industriesTransportationSoftwareInformation[0]} dataAutoId="transportation_software_section_2">
      <ModalTriggerButton modalType="schedule-a-demo" category="primary" size="large" dataAutoId="transportation_software_section_2_schedule_a_demo">
        Schedule a demo
      </ModalTriggerButton>
    </ImageContentLayout>
    <ImageContentLayout content={industriesTransportationSoftwareInformation[1]} dataAutoId="transportation_software_section_3">
      <ModalTriggerButton modalType="sign-up" category="primary" size="large" dataAutoId="transportation_software_section_3_sign_up">
        Sign up
      </ModalTriggerButton>
    </ImageContentLayout>
    <ImageContentLayout content={industriesTransportationSoftwareInformation[2]} dataAutoId="transportation_software_section_4">
      <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="transportation_software_section_4_talk_to_us">
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
      imageSrc={keyFeaturesTransportationSoftwareImg}
    />
    <EmpoweringBrands
      brandsImages={brandImages['transportation']}
      industry="transportation"
      dataAutoId="transportation_software_section_5"
    />
  </>
)

const title = 'Transportation and Logistics | Transportation Automation S/W'
const description = 'We help clients with visibility issues, driver shortage, optimize storage utilization, trip planning and schedule and more. Contact LogiNext for more details.'
const url = 'https://www.loginextsolutions.com/industries/transportation-software'

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
  TransportationSoftware as default,
  metadata
}

