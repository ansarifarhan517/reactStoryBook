import { Metadata } from 'next'

import PageCoverSection from '@/components/page-cover-section'
import PageCoverSubSection from '@/components/page-cover-sub-section'
import PageCoverSubSectionCard from '@/components/page-cover-sub-section-card'
import PageCoverSectionContent from '@/components/page-cover-section-content'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import Button from '@/components/button'
import Container from '@/components/container'
import ImageContentLayout from '@/components/image-content-layout'
import Awards from '@/components/awards'

import { bemClass } from '@/utils'

import useCaseDeliveryBg from '/public/usecase-delivery-bg.webp'

import deliveryInformation from './_data/delivery_information'

import './style.scss'

const blk = 'use-case-delivery'

const UseCaseDelivery = () => (
  <>
    <PageCoverSection
      image={useCaseDeliveryBg}
      imageAlt="Use case delivery"
      className={bemClass([blk, 'cover-section'])}
      dataAutoId="usecase_delivery_section_1"
    >
      <Container fluid>
        <PageCoverSectionContent
          dataAutoId="usecase_delivery_section_1_details"
          title="Delivery"
          description="Last mile delivery software to achieve efficient deliveries and high customer satisfaction for each deliver."
        >
          <ButtonGroup>
            <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="usecase_delivery_section_1_talk_to_us">
              Talk to us
            </ModalTriggerButton>
          </ButtonGroup>
        </PageCoverSectionContent>
      </Container>
    </PageCoverSection>
    <PageCoverSubSection
      dataAutoId="usecase_delivery_section_2"
      title="Deliver On-Time, Every Time with the Most Comprehensive Delivery Routing Software"
      description={`Customers expect quick but on-time delivery for their ordered goods.
      Be it food and/or grocery, or delivery of big & bulky items, or even a delivery to
      nearby store in the case of B2B fulfillment, LogiNext\'s flexible last mile delivery
      tracking platform enables your delivery team to meet customer expectations by intelligently
      scheduling customer orders for delivery and optimized routing for delivery drives, thereby
      delivering in the most efficient manner.`}
      isCenter
    >
      <PageCoverSubSectionCard
        dataAutoId="usecase_delivery_section_2_card_1"
        iconName="order-auto-allocation"
        description="Automate and optimized delivery trip planning with help of AI and ML powered route optimization software."
      />
      <PageCoverSubSectionCard
        dataAutoId="usecase_delivery_section_2_card_2"
        iconName="smart-eta"
        description="Delivery route planning software with predictive ETA notifications to keep the end customer updated, always."
      />
      <PageCoverSubSectionCard
        dataAutoId="usecase_delivery_section_2_card_3"
        iconName="order-re-attempts"
        description="Improve driver efficiency with gamification enabled through last mile solutions like LogiNext driver app."
      />
    </PageCoverSubSection>
    <ImageContentLayout content={deliveryInformation[0]} dataAutoId="usecase_delivery_section_3">
      <ModalTriggerButton modalType="schedule-a-demo" category="primary" size="large" dataAutoId="usecase_delivery_section_3_schedule_a_demo">
        Schedule a demo
      </ModalTriggerButton>
    </ImageContentLayout>
    <ImageContentLayout content={deliveryInformation[1]} dataAutoId="usecase_delivery_section_4">
      <ModalTriggerButton modalType="sign-up" category="primary" size="large" dataAutoId="usecase_delivery_section_4_sign_up">
        Sign up
      </ModalTriggerButton>
    </ImageContentLayout>
    <ImageContentLayout content={deliveryInformation[2]} dataAutoId="usecase_delivery_section_5">
      <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="usecase_delivery_section_5_talk_to_us">
       Talk to us
      </ModalTriggerButton>
    </ImageContentLayout>
    <ButtonGroup isCenter>
      <Button
        asLink
        href="/products/mile"
        category="primary"
        size="large"
        dataAutoId="usecase_delivery_section_6_loginext_mile"
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
        dataAutoId="usecase_delivery_section_6_loginext_reverse"
      >
        <>
          Loginext Reverse<sup>TM</sup>
        </>
      </Button>
      <Button
        asLink
        href="/products/on-demand"
        category="primary"
        size="large"
        dataAutoId="usecase_delivery_section_6_loginext_on_demand"
      >
        <>
          Loginext on demand<sup>TM</sup>
        </>
      </Button>
    </ButtonGroup>
    <Awards dataAutoId="usecase_delivery_section_7" />
  </>
)

const title = 'Delivery | Transportation Management System | 3PL Software'
const description = 'LogiNext\'s last mile delivery tracking platform allows smart scheduling of customer orders for delivery and optimized routing for delivery drives. Call us now!'
const url = 'https://www.loginextsolutions.com/usecase/delivery'

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
  UseCaseDelivery as default,
  metadata
}
