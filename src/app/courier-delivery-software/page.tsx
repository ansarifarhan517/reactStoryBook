import { Metadata } from 'next'

import ModalTriggerButton from '@/components/modal-trigger-button'
import PageCoverSubSection from '@/components/page-cover-sub-section'
import ConfigurationSection from '@/components/configuration-section'
import ImageContentLayout from '@/components/image-content-layout'
import LandingPageRelatedResources from '@/components/landing-page-related-resources'
import PageCoverSectionWithHubspotForm from '@/components/cover-section-with-hubsot-form'
import LoginextEmpowerBrands from '@/components/loginext-empower-brands'
import LandingPagesGtm from '@/components/landing-pages-gtm'

import courierDeliverySoftwareHeader from '/public/courier-delivery-software/courier-delivery-software-header.webp'
import courierSoftwareScreenPreview from '/public/courier-delivery-software/courier-software-screen-preview.webp'
import automationForSimplifiedOperations from '/public/courier-delivery-software/automation-for-simplified-operations.webp'
import geocodingForFasterDeliveries from '/public/courier-delivery-software/geocoding-for-faster-deliveries.webp'
import realTimeCourierTracking from '/public/courier-delivery-software/real-time-courier-tracking.webp'

import courierDeliverySoftwareInformation from './_data'

const CourierDeliverySoftware = () => (
  <>
    <PageCoverSectionWithHubspotForm
      title="Comprehensive Courier Software"
      description="Increase delivery speed and efficiency by smartly utilizing reliable courier software."
      image={courierDeliverySoftwareHeader}
      imageTitle="Courier Delivery Header"
      imageAlt="Image of Courier Delivery with ePOD"
      imageDescription="Image of Courier Delivery with ePOD"
      dataAutoId="courier_delivery_software_section_1"
    />
    <PageCoverSubSection
      title="Meet all the courier business needs to solve the delivery and routing chaos"
      description={`Bid adieu to the time-consuming process of manually managing courier deliveries. 
                    A feature-rich courier software eliminates the burden of managing multiple operations 
                    and streamlines end-to-end delivery processes.`}
      buttonLabel="view blog"
      buttonCategory="secondary"
      redirectUrl={'https://www.loginextsolutions.com/blog/cloud-based-tms-courier-management-software/'}
      imageAlt="A Preview of Courier Delivery Software"
      imageTitle="Courier Software Screen Preview"
      imageDescription="A Preview of Courier Delivery Software"
      image={courierSoftwareScreenPreview}
      video="https://www.youtube.com/embed/39c5odOErtI?autoplay=1&mute=0&controls=0&showinfo=0&modestbranding=1&rel=0&enablejsapi=1"
      videoTitle="Meet all the courier business needs to solve the delivery and routing chaos"
      dataAutoId="courier_delivery_software_section_2"
    />
    <ConfigurationSection
      iconSize="xxxlg"
      widthBg
      data={[
        {
          id: 'automation-for-simplified-operations',
          image: automationForSimplifiedOperations,
          title: 'Automation for Simplified Operations',
          description:
            `Make complex and time taking operations simple and faster by automating it entirely 
              to eliminate manual intervention.`,
        },
        {
          id: 'geocoding-for-faster-deliveries',
          image: geocodingForFasterDeliveries,
          title: 'Geocoding for Faster Deliveries',
          description:
            'Make successful first-time deliveries to the exact and accurate address with the geocoding feature.',
        },
        {
          id: 'real-time-courier-tracking',
          image: realTimeCourierTracking,
          title: 'Real-time Courier Tracking',
          description:
            'Offer every update about the courier in real-time with timely alerts and notifications.',
        },

      ]}
      dataAutoId="courier_delivery_software_section_3"
    />
    <ImageContentLayout
      content={courierDeliverySoftwareInformation[0]}
      category="secondary"
      imageTitle="Courier Management Screen"
      imageAlt= "A LogiNext Screen for Courier Management Software"
      imageDescription="A LogiNext Screen for Courier Management Software"
      dataAutoId="courier_delivery_software_section_4"
      withFeatureBullet={true}
    />
    <ImageContentLayout
      content={courierDeliverySoftwareInformation[1]}
      category="secondary"
      imageTitle="Courier Delivery Management on Live Map"
      imageAlt="A Live Map of Courier Delivery Software"
      imageDescription="A Live Map of Courier Delivery Software"
      dataAutoId="courier_delivery_software_section_5"
      withFeatureBullet={true}
    >
      <ModalTriggerButton
        modalType="schedule-a-demo"
        category="secondary"
        size="large"
        dataAutoId="courier_delivery_software_section_5_schedule_demo"
      >
        Schedule a demo
      </ModalTriggerButton>
    </ImageContentLayout>
    <LandingPageRelatedResources slug="courier-delivery-software" dataAutoId="courier_delivery_software_section_6"/>
    <LoginextEmpowerBrands dataAutoId="courier_delivery_software_section_7"/>
    <LandingPagesGtm />
  </>
)

const title = 'LogiNext Courier Delivery Software - Deliver Faster'
const description = `LogiNext helps you deliver couriers faster & cheaper. 
                      Optimized Route Planning, Accurate ETA Predictions, Driver Management, Checkpoints and more!`
const url = 'https://www.loginextsolutions.com/courier-delivery-software'

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
  CourierDeliverySoftware as default,
  metadata
}
