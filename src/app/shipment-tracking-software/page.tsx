import { Metadata } from 'next'

import ModalTriggerButton from '@/components/modal-trigger-button'
import PageCoverSubSection from '@/components/page-cover-sub-section'
import ConfigurationSection from '@/components/configuration-section'
import ImageContentLayout from '@/components/image-content-layout'
import LandingPageRelatedResources from '@/components/landing-page-related-resources'
import PageCoverSectionWithHubspotForm from '@/components/cover-section-with-hubsot-form'
import LoginextEmpowerBrands from '@/components/loginext-empower-brands'
import LandingPagesGtm from '@/components/landing-pages-gtm'

import shipmentTrackingHeader from '/public/shipment-tracking-software/header-shipment-tracking.webp'
import shipmentTrackingSoftwarePreview from '/public/shipment-tracking-software/shipment-tracking-software-preview.webp'
import realTimeShipmentTracking from '/public/shipment-tracking-software/real-time-shipment-tracking.webp'
import algorithmBasedAllocation from '/public/shipment-tracking-software/algorithm-based-allocation.webp'
import simplifiedDeliveryOrchestration from '/public/shipment-tracking-software/simplified-delivery-orchestration.webp'

import shipmentTrackingSoftwareInformation from './_data'

const ShipmentTrackingSoftware = () => (
  <>
    <PageCoverSectionWithHubspotForm
      title="Shipment Tracking Software"
      description="Offer end-to-end visibility of every delivery to your customers with a full-fledged shipment tracking software."
      image={shipmentTrackingHeader}
      imageTitle="Header Image for Shipment Tracking"
      imageAlt="Shipment being carried by a truck with GPS carrier"
      imageDescription="Shipment being carried by a truck with GPS carrier"
      dataAutoId="shipment_tracking_software_section_1"
    />
    <PageCoverSubSection
      title="Transform the way your shipments reach the customers"
      description={`Prioritize transparency, cost efficiency and minimized follow ups while managing a 
                  large number of shipments with limited workforce. Offer timely deliveries with overall 
                  courier visibility using a suitable shipment tracking software because customers demand every
                   status update about their orders.`}
      buttonLabel="view blog"
      buttonCategory="secondary"
      redirectUrl={'https://www.loginextsolutions.com/blog/10-tips-to-streamline-delivery-operations-with-delivery-tracking-software/'}
      imageAlt="A Preview of Shipment Tracking Software"
      imageTitle="Shipment Tracking Software Screen Preview"
      imageDescription="A Preview of Shipment Tracking Software"
      image={shipmentTrackingSoftwarePreview}
      video="https://www.youtube.com/embed/39c5odOErtI?autoplay=1&mute=0&controls=0&showinfo=0&modestbranding=1&rel=0&enablejsapi=1"
      videoTitle="Transform the way your shipments reach the customers"
      dataAutoId="shipment_tracking_software_section_2"
    />
    <ConfigurationSection
      iconSize="xxxlg"
      widthBg
      data={[
        {
          id: 'real-time-shipment-tracking',
          image: realTimeShipmentTracking,
          title: 'Real-time shipment tracking',
          description:
            'Make instant decisions based on latest updates about every shipment taking place.',
        },
        {
          id: 'algorithm-based-allocation',
          image: algorithmBasedAllocation,
          title: 'Algorithm-based allocation',
          description:
            `Distribute resources strategically with AI-enabled data-driven 
            allocation for greater efficiency.`,
        },
        {
          id: 'simplified-delivery-orchestration',
          image: simplifiedDeliveryOrchestration,
          title: 'Simplified delivery orchestration',
          description:
            `Use a single window to track all the consignments in real-time across 
            third-party logistics providers.`,
        },

      ]}
      dataAutoId="shipment_tracking_software_section_3"
    />
    <ImageContentLayout
      content={shipmentTrackingSoftwareInformation[0]}
      category="secondary"
      imageTitle="Last Mile Order Tracking Screen"
      imageAlt= "A LogiNext Mobile Screen for Last Mile Delivery"
      imageDescription="A LogiNext Mobile Screen for Last Mile Delivery"
      dataAutoId="shipment_tracking_software_section_4"
      withFeatureBullet={true}
    />
    <ImageContentLayout
      content={shipmentTrackingSoftwareInformation[1]}
      category="secondary"
      imageTitle="Live Screen for Shipment Movement at Location"
      imageAlt="A Live Map Screen tracking shipment movements"
      imageDescription="A Live Map Screen tracking shipment movements"
      dataAutoId="shipment_tracking_software_section_5"
      withFeatureBullet={true}
    >
      <ModalTriggerButton
        modalType="schedule-a-demo"
        category="secondary"
        size="large"
        dataAutoId="shipment_tracking_software_section_5_schedule_demo"
      >
        Schedule a demo
      </ModalTriggerButton>
    </ImageContentLayout>
    <LandingPageRelatedResources slug="last-mile-delivery" dataAutoId="shipment_tracking_software_section_6" />
    <LoginextEmpowerBrands dataAutoId="shipment_tracking_software_section_7"/>
    <LandingPagesGtm />
  </>
)

const title = 'LogiNext Shipment Tracking Software - Real-Time Visibility'
const description = `LogiNext helps you track your shipments, plan for delays, 
                    and improve your customer experience. Real-time GPS tracking, 
                    Checkpoints, Geofencing and more!`
const url = 'https://www.loginextsolutions.com/shipment-tracking-software'

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
    card: 'summary',
  },
  metadataBase: new URL('https://www.loginextsolutions.com'),
}

export {
  ShipmentTrackingSoftware as default,
  metadata
}
