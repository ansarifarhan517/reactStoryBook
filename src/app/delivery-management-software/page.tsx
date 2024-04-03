/* eslint-disable max-len */
import { Metadata } from 'next'

import ModalTriggerButton from '@/components/modal-trigger-button'
import PageCoverSubSection from '@/components/page-cover-sub-section'
import ConfigurationSection from '@/components/configuration-section'
import ImageContentLayout from '@/components/image-content-layout'
import LandingPageRelatedResources from '@/components/landing-page-related-resources'
import PageCoverSectionWithHubspotForm from '@/components/cover-section-with-hubsot-form'
import LoginextEmpowerBrands from '@/components/loginext-empower-brands'
import LandingPagesGtm from '@/components/landing-pages-gtm'

import deliverySoftwareWithEPOD from '/public/delivery-management-software/delivery-software-with-ePOD.webp'
import deliveryManagementSoftwarePreview from '/public/delivery-management-software/delivery-management-software-preview.webp'
import dataFirstDeliveryManagement from '/public/delivery-management-software/data-first-delivery-management.webp'
import betterAccountabilityWithEPOD from '/public/delivery-management-software/better-accountability-with-ePOD.webp'
import onDemandDeliveryFulfillment from '/public/delivery-management-software/on-demand-delivery-fulfillment.webp'

import deliveryManagementSoftwareInformation from './_data'

const DeliveryManagementSoftware = () => (
  <>
    <PageCoverSectionWithHubspotForm
      title="A Reliable Delivery Software"
      description={`Choose the most optimized routes to enable faster
      and efficient deliveries.`}
      image={deliverySoftwareWithEPOD}
      imageTitle="Delivery using Delivery Software with ePOD"
      imageAlt="Fulfilled Deliveries using Delivery Software"
      imageDescription="Fulfilled Deliveries using Delivery Software"
      dataAutoId="delivery_management_software_section_1"
    />
    <PageCoverSubSection
      title="Boost performance for faster, better and more deliveries with data-driven decisions"
      description={`Enjoy a one-stop solution for your customers who demand faster and reliable delivery. 
                  Reach your customers on time, every time with a feature-rich delivery management software 
                  that takes care of everything from faster routes to paperless delivery.`}
      buttonLabel="view infographic"
      buttonCategory="secondary"
      redirectUrl="https://info.loginextsolutions.com/hubfs/Infographics/Delivery-Management-Software-Key-Features-Infographic.pdf"
      imageAlt="A Preview of Delivery Management Software"
      imageTitle="Delivery Management Software Screen Preview"
      imageDescription="A Preview of Delivery Management Software"
      image={deliveryManagementSoftwarePreview}
      video="https://www.youtube.com/embed/39c5odOErtI?autoplay=1&mute=0&controls=0&showinfo=0&modestbranding=1&rel=0&enablejsapi=1"
      videoTitle="Boost performance for faster, better and more deliveries with data-driven decisions"
      dataAutoId="delivery_management_software_section_2"
    />
    <ConfigurationSection
      iconSize="xxxlg"
      widthBg
      data={[
        {
          id: 'data-first-delivery-management',
          image: dataFirstDeliveryManagement,
          title: 'Data-first Delivery Management',
          description:
            `Superior constraint driver routing engine with a high-level strategic view of the 
              delivery pattern and overall business.`,
        },
        {
          id: 'better-accountability-with-ePOD',
          image: betterAccountabilityWithEPOD,
          title: 'Better Accountability with ePOD',
          description:
            `Higher rates of successful delivery as the drivers can upload a picture 
              or a signed document in real-time when they deliver a package.`,
        },
        {
          id: 'on-demand-delivery-fulfillment',
          image: onDemandDeliveryFulfillment,
          title: 'On-demand Delivery Fulfillment',
          description:
            `Quicker turn-arond times for delivering multiple orders in a single trip along with 
              auto-allocation of orders helps in serving many customers at once.`,
        },

      ]}
      dataAutoId="delivery_management_software_section_3"
    />
    <ImageContentLayout
      content={deliveryManagementSoftwareInformation[0]}
      category="secondary"
      imageTitle="Delivery Management Software Screen"
      imageAlt= "A LogiNext Screen of Delivery Management Software"
      imageDescription="A LogiNext Screen of Delivery Management Software"
      dataAutoId="delivery_management_software_section_4"
      withFeatureBullet={true}
    />
    <ImageContentLayout
      content={deliveryManagementSoftwareInformation[1]}
      category="secondary"
      imageTitle="Delivery Tracking Software for Management"
      imageAlt="A Map of Live Deliveries on a Delivery Software"
      imageDescription="A Map of Live Deliveries on a Delivery Software"
      dataAutoId="delivery_management_software_section_5"
      withFeatureBullet={true}
    >
      <ModalTriggerButton
        modalType="schedule-a-demo"
        category="secondary"
        size="large"
        dataAutoId="delivery_management_software_section_5_schedule_demo"
      >
        Schedule a demo
      </ModalTriggerButton>
    </ImageContentLayout>
    <LandingPageRelatedResources slug="delivery-management-software" dataAutoId="delivery_management_software_section_6" />
    <LoginextEmpowerBrands dataAutoId="delivery_management_software_section_7"/>
    <LandingPagesGtm />
  </>
)

const title = 'LogiNext Delivery Management Software - Deliver Faster'
const description = `LogiNext helps you deliver more orders in less time, and ensure fuel cost and time savings. 
                      Optimized Route Planning, Real-time tracking, Multiple Stops, Live Screens and more!`
const url = 'https://www.loginextsolutions.com/delivery-management-software'

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
  DeliveryManagementSoftware as default,
  metadata
}
