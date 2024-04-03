import { Metadata } from 'next'

import PageCoverSection from '@/components/page-cover-section'
import PageCoverSubSection from '@/components/page-cover-sub-section'
import PageCoverSectionContent from '@/components/page-cover-section-content'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import Container from '@/components/container'
import Awards from '@/components/awards'
import ImageContentLayout from '@/components/image-content-layout'

import { bemClass } from '@/utils'

import productReserveBg from '/public/platform-reverse-bg.webp'
import productReverseInformation from './_data/reverse_information'
import simplifyYourReverseShipments from '/public/products/reverse/simplify-your-reverse-shipments.webp'

import './style.scss'

const blk = 'product-reverse'

const Reverse = () => (
  <>
    <PageCoverSection
      image={productReserveBg}
      imageAlt="Product reverse"
      className={bemClass([blk, 'cover-section'])}
      dataAutoId="product_reverse_section_1"
    >
      <Container fluid>
        <PageCoverSectionContent
          title="LogiNext Reverse"
          description="Reliably optimize reverse pickups including return-to-merchant (RTM) and return-to-origin (RTO) scenarios with the best reverse logistics solutions."
          withGartner
          withTrademark
          dataAutoId="product_reverse_section_1_content"
        >
          <ButtonGroup>
            <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="product_reverse_section_1_lets_talk">
            Lets talk
            </ModalTriggerButton>
            <ModalTriggerButton modalType="sign-up" category="secondary" size="large" dataAutoId="product_reverse_section_1_sign_up">
            Sign up
            </ModalTriggerButton>
          </ButtonGroup>
        </PageCoverSectionContent>
      </Container>
    </PageCoverSection>
    <PageCoverSubSection
      title="Simplify Your Reverse Shipments and Return Orders Pickups Optimizing Costs"
      description={`Whether the return is due to a wrong package delivery or customer no longer wanting the
      ordered goods or reverse consignment pickups from stores, LogiNext Reverse™ enables you to accord convenient pickup
      windows to your customers and club reverse orders
      along with other deliveries for operational efficiency.`}
      image={simplifyYourReverseShipments}
      dataAutoId="product_reverse_section_2"
    />
    <ImageContentLayout
      content={productReverseInformation[0]}
      withFeatureBullet
      dataAutoId="product_reverse_section_3"
    />
    <ImageContentLayout
      content={productReverseInformation[1]}
      withFeatureBullet
      dataAutoId="product_reverse_section_4"
    />
    <Awards />
  </>
)

const title = 'LogiNext Reverse | Reverse Logistics | Workforce Management'
const description = 'Sign-up with LogiNext to optimize your field workforce movement with the best route planning & scheduling, return order pickups, and efficient fleet management.'
const url = 'https://www.loginextsolutions.com/products/reverse'

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
  Reverse as default,
  metadata
}

