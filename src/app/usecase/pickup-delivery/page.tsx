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

import useCasePickupDeliveryBg from '/public/usecase-pickup-delivery-bg.webp'

import pickupDeliveryInformation from './_data/pickup_delivery_information'

import './style.scss'

const blk = 'use-case-pickup-delivery'

const UseCasePickupDelivery = () => (
  <>
    <PageCoverSection
      image={useCasePickupDeliveryBg}
      imageAlt="Use case pick up and delivery"
      className={bemClass([blk, 'cover-section'])}
      dataAutoId="usecase_pickup_and_delivery_section_1"
    >
      <Container fluid>
        <PageCoverSectionContent
          dataAutoId="usecase_pickup_and_delivery_section_1_details"
          title="Pickup and Delivery"
          description="Gain Efficiency and Visibility over the first and last legs of any delivery through the best dispatch software."
        >
          <ButtonGroup>
            <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="usecase_pickup_and_delivery_section_1_talk_to_us">
              Talk to us
            </ModalTriggerButton>
          </ButtonGroup>
        </PageCoverSectionContent>
      </Container>
    </PageCoverSection>
    <PageCoverSubSection
      dataAutoId="usecase_pickup_and_delivery_section_2"
      title="Optimize the Most Critical Segments of Your Delivery to Improve Customer ETA"
      description={`Remove the complexities involved with large scale pickup and deliveries of
      orders while improving efficiency and gaining complete visibility over all aspects of your order lifecycle.
      Efficiently schedule pickup and deliveries using same resources while meeting your customer SLAs and Business KPIs.`}
      isCenter
    >
      <PageCoverSubSectionCard
        dataAutoId="usecase_pickup_and_delivery_section_2_card_1"
        iconName="carrier-management"
        description="Seamless integration with 3rd party logistics providers (3PL/ 4PL)."
      />
      <PageCoverSubSectionCard
        dataAutoId="usecase_pickup_and_delivery_section_2_card_2"
        iconName="delivery-trip-planning"
        description="End to End visibility & tracking across your delivery operations."
      />
      <PageCoverSubSectionCard
        dataAutoId="usecase_pickup_and_delivery_section_2_card_3"
        iconName="zone-mapping"
        description="Service Area profiles to match your delivery zones."
      />
    </PageCoverSubSection>
    <ImageContentLayout content={pickupDeliveryInformation[0]} dataAutoId="usecase_pickup_and_delivery_section_3">
      <ModalTriggerButton modalType="schedule-a-demo" category="primary" size="large" dataAutoId="usecase_pickup_and_delivery_section_3_schedule_a_demo">
        Schedule a demo
      </ModalTriggerButton>
    </ImageContentLayout>
    <ImageContentLayout content={pickupDeliveryInformation[1]} dataAutoId="usecase_pickup_and_delivery_section_4">
      <ModalTriggerButton modalType="sign-up" category="primary" size="large" dataAutoId="usecase_pickup_and_delivery_section_4_sign_up">
        Sign up
      </ModalTriggerButton>
    </ImageContentLayout>
    <ButtonGroup isCenter>
      <Button
        asLink
        href="/products/mile"
        category="primary"
        size="large"
        dataAutoId="usecase_pickup_and_delivery_section_5_loginext_mile"
      >
        <>
          Loginext Mile<sup>TM</sup>
        </>
      </Button>
      <Button
        asLink
        href="/products/on-demand"
        category="primary"
        size="large"
        dataAutoId="usecase_pickup_and_delivery_section_5_loginext_on_demand"
      >
        <>
          Loginext on demand<sup>TM</sup>
        </>
      </Button>
    </ButtonGroup>
    <Awards dataAutoId="usecase_pickup_and_delivery_section_6" />
  </>
)

const title = 'Pickup & Delivery | Fleet Management System | Fleet Tracking'
const description = 'Customers get insights on first and last leg of delivery, improving ETA, meeting customer SLA\'s and Business KPI\'s. Call LogiNext to simplify pickup & delivery.'
const url = 'https://www.loginextsolutions.com/usecase/pickup-delivery'

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
  UseCasePickupDelivery as default,
  metadata
}
