import { Metadata } from 'next'
import Image from 'next/image'

import PageCoverSection from '@/components/page-cover-section'
import PageCoverSectionContent from '@/components/page-cover-section-content'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeLayout from '@/components/product-informative-layout'
import ProductInformativeContent from '@/components/product-informative-content'
import Container from '@/components/container'
import AppStoreButton from '@/components/app-store-button'
import Parallax from '@/components/parallax'
import ContentOverlapLayout from '@/components/content-overlap-layout'

import { bemClass } from '@/utils'

import pageCoverBg from '/public/special-material-handling-white-glove-delivery-optimization.svg'
import coverPageBanner from '/public/special-handling-white-glove-delivery-banner.webp'
import identifySpecialNeedsForPickupsAndDeliveries from '/public/identify-special-needs-for-pickups-and-deliveries.webp'
import inHouseOrStoreDeliveriesAndPlacement from '/public/in-house-or-store-deliveries-and-placement.webp'
import liveTrackingAndNotificationsForAllMovement from '/public/live-tracking-and-notifications-for-all-movement.webp'
import specialHandlingWhiteGloveDelivery from '/public/special-handling-white-glove-delivery.webp'

import './style.scss'

const blk = 'special-material-handling-white-glove-delivery-optimization'

const SpecialMaterialHandlingWhiteGloveDeliveryOptimization = () => (
  <>
    <PageCoverSection
      image={pageCoverBg}
      imageAlt="Special Handling/ White Glove Delivery"
      className={bemClass([blk, 'cover-section'])}
      dataAutoId="special_material_handling_white_glove_delivery_optimization_section_1"
    >
      <>
        <div className={bemClass([blk, 'cover-bottom'])} />
        <Container fluid className={bemClass([blk, 'container'])}>
          <PageCoverSectionContent
            title="Special Handling/ White Glove Delivery"
            description={`Ensure that specific needs of customer\'s packages/shipments are met with
            white glove or blanket wrap services.`}
            className={bemClass([blk, 'cover-content'])}
            dataAutoId="special_material_handling_white_glove_delivery_optimization_section_1_content"
          >
            <ButtonGroup>
              <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="special_material_handling_white_glove_delivery_optimization_section_1_ask_for_demo">
                Ask for a demo
              </ModalTriggerButton>
              <ModalTriggerButton modalType="sign-up" category="primary" size="large" dataAutoId="special_material_handling_white_glove_delivery_optimization_section_1_try_free">
                Try out free
              </ModalTriggerButton>
            </ButtonGroup>
          </PageCoverSectionContent>
          <Parallax offset={50} className={bemClass([blk, 'cover-image'])}>
            <Image
              src={coverPageBanner}
              alt="Special Handling/ White Glove Delivery"
              className={bemClass([blk, 'image'])}
              loading="eager"
              data-auto-id="special_material_handling_white_glove_delivery_optimization_section_1_image"
            />
          </Parallax>
        </Container>
      </>
    </PageCoverSection>
    <ProductInformativeLayout
      hAlign="left"
      image={identifySpecialNeedsForPickupsAndDeliveries}
      imageAlt="Identify special needs for pickups and deliveries"
      className={bemClass([blk, 'product-info'])}
      dataAutoId="special_material_handling_white_glove_delivery_optimization_section_2"
    >
      <ProductInformativeContent
        title="Identify special needs for pickups and deliveries"
        description={`Easily capture special handling instructions for shipments like secure documents,
        antiques, sensitive electronics, etc.`}
        features={[{
          id: 'auto-allocation-of-pickup-request',
          title: 'Auto-allocation of pickup request',
          description: `Automatically allocate the right delivery associate and vehicle to sensitive
          shipments, best-suited to handle the special handling instructions right from safe
          loading/unloading and priority shipping.`,
        }, {
          id: 'accommodation-of-preferred-time-windows',
          title: 'Accommodation of preferred time windows',
          description: `Specialty shipments come with exact timelines when they are supposed to be picked
          and delivered. Ensure a complete delivery experience with on-time pickup and delivery in such
          preferred time windows.`,
        }]}
        dataAutoId="special_material_handling_white_glove_delivery_optimization_section_2_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="special_material_handling_white_glove_delivery_optimization_section_2_request_demo">
            Request a demo
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="special_material_handling_white_glove_delivery_optimization_section_2_free_trail">
            14 days free trial
          </ModalTriggerButton>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ContentOverlapLayout
      image={specialHandlingWhiteGloveDelivery}
      title="Give specialized delivery experience to customers"
      description={`Ensure that customers stay with you for longer by assigning delivery associates
      and helpers that are best-suited to load, unload, or install the special delivery.`}
      blogUrl="https://www.loginextsolutions.com/blog/white-glove-deliveries-for-big-bulky-ecommerce/"
      dataAutoId="special_material_handling_white_glove_delivery_optimization_section_3"
    >
      <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="special_material_handling_white_glove_delivery_optimization_section_3_talk_to_us">
        talk to us
      </ModalTriggerButton>
    </ContentOverlapLayout>
    <ProductInformativeLayout
      hAlign="right"
      image={inHouseOrStoreDeliveriesAndPlacement}
      imageAlt="In-House or Store Deliveries and Placement"
      dataAutoId="special_material_handling_white_glove_delivery_optimization_section_4"
    >
      <ProductInformativeContent
        title="In-House or Store Deliveries and Placement"
        description={`Match delivery associates skilled in inside location or in-room pickup and
        delivery to the specific shipment requirements.`}
        features={[{
          id: 'pick-up-from-within-the-location',
          title: 'Pick up from within the location',
          description: `Assign helpers or loaders to specialty shipments for pick and
          pack at location.`,
        }, {
          id: 'deliver-in-room-and-place-packages',
          title: 'Deliver in-room and place packages',
          description: `Instruct your delivery associates to deliver in-room and place
          items as required.`,
        }]}
        dataAutoId="special_material_handling_white_glove_delivery_optimization_section_4_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="special_material_handling_white_glove_delivery_optimization_section_4_connect_with_expert">
            Connect with expert
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="special_material_handling_white_glove_delivery_optimization_section_4_sign_up_free">
            sign up for free
          </ModalTriggerButton>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ProductInformativeLayout
      hAlign="left"
      image={liveTrackingAndNotificationsForAllMovement}
      imageAlt="Live tracking and notifications for all movement"
      className={bemClass([blk, 'live-tracking'])}
      dataAutoId="special_material_handling_white_glove_delivery_optimization_section_5"
    >
      <ProductInformativeContent
        title="Live tracking and notifications for all movement"
        description={`Track all specialty and white glove movement from pickup and delivery
        from within a single dashboard with instant notifications and alerts for all stakeholders.`}
        features={[]}
        dataAutoId="special_material_handling_white_glove_delivery_optimization_section_5_content"
      >
        <AppStoreButton category="secondary" align="hozironatal" dataAutoId="special_material_handling_white_glove_delivery_optimization_section_5_stores" />
      </ProductInformativeContent>
    </ProductInformativeLayout>
  </>
)

const title = 'Courier Express Parcel | White Glove Delivery | LogiNext'
const description = 'Are you in the business which requires safe handling of customer\'s packages/ shipments, antiques? Choose LogiNext to meet white glove delivery requirements.'
const url = 'https://www.loginextsolutions.com/industries/couriers-express-parcels/special-material-handling-white-glove-delivery-optimization'

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
  SpecialMaterialHandlingWhiteGloveDeliveryOptimization as default,
  metadata
}
