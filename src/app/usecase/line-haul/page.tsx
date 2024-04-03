import { Metadata } from 'next'

import PageCoverSection from '@/components/page-cover-section'
import PageCoverSubSection from '@/components/page-cover-sub-section'
import PageCoverSectionContent from '@/components/page-cover-section-content'
import PageCoverSubSectionCard from '@/components/page-cover-sub-section-card'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import Button from '@/components/button'
import Container from '@/components/container'
import ImageContentLayout from '@/components/image-content-layout'
import Awards from '@/components/awards'

import { bemClass } from '@/utils'

import useCaseLineHaulBg from '/public/usecase-line-haul-bg.webp'
import useCaseLineHaulDelivery from './_data/line_haul_information'

import './style.scss'

const blk = 'use-case-line-haul'

const UseCaseLineHaul = () => (
  <>
    <PageCoverSection
      image={useCaseLineHaulBg}
      imageAlt="Use case line haul"
      className={bemClass([blk, 'cover-section'])}
      dataAutoId="usecase_line_haul_section_1"
    >
      <Container fluid>
        <PageCoverSectionContent
          dataAutoId="usecase_line_haul_section_1_details"
          title="Line Haul"
          description="The best transportation management software for logistics movements across nations and continents."
        >
          <ButtonGroup>
            <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="usecase_line_haul_section_1_talk_to_us">
              Talk to us
            </ModalTriggerButton>
          </ButtonGroup>
        </PageCoverSectionContent>
      </Container>
    </PageCoverSection>
    <PageCoverSubSection
      dataAutoId="usecase_line_haul_section_2"
      title="Preempt and Avert Delays by Intelligent Tracking Across All Your Shipments"
      description={`Large shipments between warehouses can take a long time to arrive, and
      your team has little visibility on these movements. Many TMS softwares can provide
      visibility, but they cannot preempt and avert potential delays or bottlenecks.
      With LogiNext, besides providing visibility, our platform analyzes route conditions
      to alert drivers of possible issues and alternatives to meet ETA, understands potential
      bottlenecks like detention time, and alerts operations and warehouse teams of impending
      arrivals to ensure high operational efficiency.`}
      isCenter
    >
      <PageCoverSubSectionCard
        dataAutoId="usecase_line_haul_section_2_card_1"
        iconName="delivery-trip-planning"
        description="End to end visibility over own and outsourced vehicle movements."
      />
      <PageCoverSubSectionCard
        dataAutoId="usecase_line_haul_section_2_card_2"
        iconName="three-d-packing-optimization"
        description="3D packing optimization for the best capacity utilization."
      />
      <PageCoverSubSectionCard
        dataAutoId="usecase_line_haul_section_2_card_3"
        iconName="loginext-smart-route"
        description="Predictive route analytics and alerts."
      />
    </PageCoverSubSection>
    <ImageContentLayout content={useCaseLineHaulDelivery[0]} dataAutoId="usecase_line_haul_section_3">
      <ModalTriggerButton modalType="schedule-a-demo" category="primary" size="large" dataAutoId="usecase_line_haul_section_3_schedule_a_demo">
        Schedule a demo
      </ModalTriggerButton>
    </ImageContentLayout>
    <ImageContentLayout content={useCaseLineHaulDelivery[1]} dataAutoId="usecase_line_haul_section_4">
      <ModalTriggerButton modalType="sign-up" category="primary" size="large" dataAutoId="usecase_line_haul_section_4_sign_up">
        Sign up
      </ModalTriggerButton>
    </ImageContentLayout>
    <ImageContentLayout content={useCaseLineHaulDelivery[2]} dataAutoId="usecase_line_haul_section_5">
      <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="usecase_line_haul_section_5_talk_to_us">
       Talk to us
      </ModalTriggerButton>
    </ImageContentLayout>
    <ButtonGroup isCenter>
      <Button
        asLink
        href="/products/haul"
        category="primary"
        size="large"
        dataAutoId="usecase_line_haul_section_6_loginext_haul"
      >
        <>
          Loginext Haul<sup>TM</sup>
        </>
      </Button>
    </ButtonGroup>
    <Awards dataAutoId="usecase_line_haul_section_7" />
  </>
)

const title = 'Line Haul | Logistics Management | Multi Stop Route Planner'
const description = 'Intelligent tracking of shipment across nations & continent offering real time visibility, 3d packing optimization, route planning & more. Contact LogiNext now!'
const url = 'https://www.loginextsolutions.com/usecase/line-haul'

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
  UseCaseLineHaul as default,
  metadata
}
