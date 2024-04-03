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

import useCaseEndToEndBg from '/public/usecase-end-to-end-bg.webp'
import useCaseEndToEndDelivery from './_data/end_to_end_information'

import './style.scss'

const blk = 'use-case-end-to-end'

const UseCaseEndToEnd = () => (
  <>
    <PageCoverSection
      image={useCaseEndToEndBg}
      imageAlt="Use case end to end"
      className={bemClass([blk, 'cover-section'])}
      dataAutoId="usecase_end_to_end_section_1"
    >
      <Container fluid>
        <PageCoverSectionContent
          dataAutoId="usecase_end_to_end_section_1_details"
          title="End to End"
          description="A comprehensive transportation management system for all your logistics operations."
        >
          <ButtonGroup>
            <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="usecase_end_to_end_section_1_talk_to_us">
              Talk to us
            </ModalTriggerButton>
          </ButtonGroup>
        </PageCoverSectionContent>
      </Container>
    </PageCoverSection>
    <PageCoverSubSection
      dataAutoId="usecase_end_to_end_section_2"
      title="Gain Supply Chain Visibility and Optimize Your Operations on Top of the Most Advanced Vehicle Routing System"
      description={`Any shipment involves multiple segments - and each of them are either an
      opportunity to delight your customer or a reason for missing ETA. With LogiNext\’s
      supply chain visibility software, we enable you to track and gain visibility across all
      these segments, optimize them, and provide you with actionable analytics to take charge.
      Let every delivery be a happy one for your customers and your operations team.`}
      isCenter
    >
      <PageCoverSubSectionCard
        dataAutoId="usecase_end_to_end_section_2_card_1"
        iconName="order-auto-allocation"
        description="Easy to use supply chain visibility solutions for dispatchers, carriers, delivery drivers and the end customer."
      />
      <PageCoverSubSectionCard
        dataAutoId="usecase_end_to_end_section_2_card_2"
        iconName="highly-configurable"
        description="Easily integrate your existing IT systems with large pool of ready integrations for end to end supply chain visibility."
      />
      <PageCoverSubSectionCard
        dataAutoId="usecase_end_to_end_section_2_card_3"
        iconName="end-to-end-visibility"
        description="Optimize, schedule and track your shipments across all legs and transports."
      />
    </PageCoverSubSection>
    <ImageContentLayout content={useCaseEndToEndDelivery[0]} dataAutoId="usecase_end_to_end_section_3">
      <ModalTriggerButton modalType="schedule-a-demo" category="primary" size="large" dataAutoId="usecase_end_to_end_section_3_schedule_a_demo">
        Schedule a demo
      </ModalTriggerButton>
    </ImageContentLayout>
    <ImageContentLayout content={useCaseEndToEndDelivery[1]} dataAutoId="usecase_end_to_end_section_4">
      <ModalTriggerButton modalType="sign-up" category="primary" size="large" dataAutoId="usecase_end_to_end_section_4_sign_up">
        Sign up
      </ModalTriggerButton>
    </ImageContentLayout>
    <ImageContentLayout content={useCaseEndToEndDelivery[2]} dataAutoId="usecase_end_to_end_section_5">
      <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="usecase_end_to_end_section_5_talk_to_us">
       Talk to us
      </ModalTriggerButton>
    </ImageContentLayout>
    <ButtonGroup isCenter>
      <Button
        asLink
        href="/products/mile"
        category="primary"
        size="large"
        dataAutoId="usecase_end_to_end_section_6_loginext_mile"
      >
        <>
          Loginext Mile<sup>TM</sup>
        </>
      </Button>
    </ButtonGroup>
    <Awards dataAutoId="usecase_end_to_end_section_7" />
  </>
)

const title = 'End to End Logistics Visibility | Fleet Management Software'
const description = 'LogiNext offers an advanced vehicle routing system to help with end-to-end logistics visibility, easy integration & tracking shipment across all legs. Call now!'
const url = 'https://www.loginextsolutions.com/usecase/end-to-end'

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
  UseCaseEndToEnd as default,
  metadata
}
