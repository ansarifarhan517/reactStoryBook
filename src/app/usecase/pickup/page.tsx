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

import useCasePickupBg from '/public/usecase-pickup-bg.webp'

import pickUpInformation from './_data/pickup_information'

import './style.scss'

const blk = 'use-case-pickup'

const UseCasePickup = () => (
  <>
    <PageCoverSection
      image={useCasePickupBg}
      imageAlt="Use case pick up"
      className={bemClass([blk, 'cover-section'])}
      dataAutoId="usecase_pickup_section_1"
    >
      <Container fluid>
        <PageCoverSectionContent
          dataAutoId="usecase_pickup_section_1_details"
          title="Pickup"
          description="Plan, Schedule and Execute all types of pickup orders without actually clicking a button."
        >
          <ButtonGroup>
            <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="usecase_pickup_section_1_talk_to_us">
              Talk to us
            </ModalTriggerButton>
          </ButtonGroup>
        </PageCoverSectionContent>
      </Container>
    </PageCoverSection>
    <PageCoverSubSection
      dataAutoId="usecase_pickup_section_2"
      title="Automate and Simplify Your Shipment Pick-Ups"
      description={`Whether it is a single or multi-order pickup from the warehouse,
      or a returned order to be picked up from waiting the customer, LogiNext helps
      your operations team with the most optimized route and allocates the pickup to
      the earliest available delivery vehicle.`}
      isCenter
    >
      <PageCoverSubSectionCard
        dataAutoId="usecase_pickup_section_2_card_1"
        iconName="order-auto-allocation"
        description="Auto Assign without manual intervention."
      />
      <PageCoverSubSectionCard
        dataAutoId="usecase_pickup_section_2_card_2"
        iconName="delivery-trip-planning"
        description="Optimize available capacity of fleet by merging pickup routes with delivery routes."
      />
      <PageCoverSubSectionCard
        dataAutoId="usecase_pickup_section_2_card_3"
        iconName="notifications-alerts"
        description="Keep customer engaged and informed through notifications."
      />
      <PageCoverSubSectionCard
        dataAutoId="usecase_pickup_section_2_card_4"
        iconName="audit-logs"
        description="Generate and print AWB labels through driver app on the field."
      />
    </PageCoverSubSection>
    <ImageContentLayout content={pickUpInformation[0]} dataAutoId="usecase_pickup_section_3">
      <ModalTriggerButton modalType="schedule-a-demo" category="primary" size="large" dataAutoId="usecase_pickup_section_3_schedule_a_demo">
        Schedule a demo
      </ModalTriggerButton>
    </ImageContentLayout>
    <ImageContentLayout content={pickUpInformation[1]} dataAutoId="usecase_pickup_section_4">
      <ModalTriggerButton modalType="sign-up" category="primary" size="large" dataAutoId="usecase_pickup_section_4_sign_up">
        Sign up
      </ModalTriggerButton>
    </ImageContentLayout>
    <ImageContentLayout content={pickUpInformation[2]} dataAutoId="usecase_pickup_section_5">
      <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="usecase_pickup_section_3_talk_to_us">
       Talk to us
      </ModalTriggerButton>
    </ImageContentLayout>
    <ButtonGroup isCenter>
      <Button
        asLink
        href="/products/mile"
        category="primary"
        size="large"
        dataAutoId="usecase_pickup_section_6_loginext_mile"
      >
        <>
          Loginext Mile<sup>TM</sup>
        </>
      </Button>
      <Button
        asLink
        href="/products/reverse"
        category="primary"
        size="large"
        dataAutoId="usecase_pickup_section_6_loginext_reverse"
      >
        <>
          Loginext Reverse<sup>TM</sup>
        </>
      </Button>
    </ButtonGroup>
    <Awards dataAutoId="usecase_pickup_section_7" />
  </>
)

const title = 'Automate Pickup | Schedule Pickup | Dispatch Software'
const description = 'LogiNext helps your operations team with the most optimized route and allocates the pickup to the earliest available delivery vehicle. Reach out to us now!'
const url = 'https://www.loginextsolutions.com/usecase/pickup'

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
  UseCasePickup as default,
  metadata
}
