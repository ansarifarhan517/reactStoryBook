import { Metadata } from 'next'

import ModalTriggerButton from '@/components/modal-trigger-button'
import PageCoverSubSection from '@/components/page-cover-sub-section'
import ConfigurationSection from '@/components/configuration-section'
import ImageContentLayout from '@/components/image-content-layout'
import LandingPageRelatedResources from '@/components/landing-page-related-resources'
import PageCoverSectionWithHubspotForm from '@/components/cover-section-with-hubsot-form'
import LoginextEmpowerBrands from '@/components/loginext-empower-brands'
import LandingPagesGtm from '@/components/landing-pages-gtm'

import transportManagementSystem from '/public/transportation-management-system/fleet-delivery-truck-management.webp'
import logiNextLiveScreenTransportationManagement from '/public/transportation-management-system/logiNext-live-screen-transportation-management.webp'
import liveDeliveryAndTracking from '/public/transportation-management-system/live-delivery-and-tracking.webp'
import cratePlanningAndOptimization from '/public/transportation-management-system/crate-planning-and-optimization.webp'
import orderManagementWithAutomation from '/public/transportation-management-system/order-management-with-automation.webp'
import enhancedVisibilityOfShipments from '/public/transportation-management-system/enhanced-visibility-of-shipments.webp'
import electronicProofOfDelivery from '/public/transportation-management-system/electronic-proof-of-delivery.webp'
import fleetPerformanceMonitoring from '/public/transportation-management-system/fleet-performance-monitoring.webp'

import transportManagementSystemInformation from './_data'

const TransportManagementSystem = () => (
  <>
    <PageCoverSectionWithHubspotForm
      title="Transportation Management System"
      description={`Explore endless possibilities of growth and opportunities with
      end-to-end supply chain visibility using a comprehensive solution.`}
      image={transportManagementSystem}
      imageTitle="Delivery Truck"
      imageAlt="A Delivery Vehicle on a Highway"
      imageDescription="An image of a delivery truck on a highway"
      dataAutoId="transportation_management_system_section_1"
    />
    <PageCoverSubSection
      title="Witness a significant boost in hassle-free deliveries with the ideal transportation management system"
      description={`A future-ready solution that simplifies planning, optimization and delivery of shipments is the need of the hour for every business.
                    Investing in a suitable Transportation management system has helped businesses across the globe in multiple ways. Now, it’s your turn to grow and deliver.`}
      buttonLabel="view infographic"
      buttonCategory="secondary"
      redirectUrl={'https://info.loginextsolutions.com/hubfs/Infographics/Top%20Features%20and%20Benefits%20of%20Transportation%20Management%20Software%20for%20Your%20Logistics%20Business.pdf'}
      imageAlt="Preview for LogiNext Screen for Transportation Management"
      imageTitle="LogiNext Live Screen for Transportation Management"
      imageDescription="Preview for LogiNext Screen for Transportation Management"
      image={logiNextLiveScreenTransportationManagement}
      video="https://www.youtube.com/embed/39c5odOErtI?autoplay=1&mute=0&controls=0&showinfo=0&modestbranding=1&rel=0&enablejsapi=1"
      videoTitle="Witness a significant boost in hassle-free deliveries with the ideal transportation management system"
      dataAutoId="transportation_management_system_section_2"
    />
    <ConfigurationSection
      iconSize="xxxlg"
      widthBg
      data={[
        {
          id: 'live-delivery-and-tracking',
          image: liveDeliveryAndTracking,
          title: 'Live Delivery and Tracking',
          description:
            'Get complete visibility of the shipment’s movement along with convenient notifications in real time throughout the journey.',
        },
        {
          id: 'crate-planning-and-optimization',
          image: cratePlanningAndOptimization,
          title: 'Crate Planning and Optimization',
          description:
            'Ensure that the vehicle space is utilized efficiently for shipments leaving the inventory with the help of a transportation management system.',
        },
        {
          id: 'order-management-with-automation',
          image: orderManagementWithAutomation,
          title: 'Order Management with Automation',
          description:
            'Make the most of automation to save time, streamline order lifecycle and get updates on routes, live status and ETA for every shipment.',
        },
        {
          id: 'enhanced-visibility-of-shipments',
          image: enhancedVisibilityOfShipments,
          title: 'Enhanced Visibility of Shipments',
          description:
            'Obtain comprehensive overview of various shipments throughout their journey from warehouse to the destination in a single view.',
        },
        {
          id: 'electronic-proof-of-delivery',
          image: electronicProofOfDelivery,
          title: 'Electronic Proof of Delivery',
          description:
            'Simplify the documentation process, stay updated and inform the end-customers whether products are delivered or marked for return.',
        },
        {
          id: 'fleet-performance-monitoring',
          image: fleetPerformanceMonitoring,
          title: 'Fleet Performance Monitoring',
          description:
            'Understand the overall fleet performance, utilize advanced fleet management features and make decisions for better planning and optimization in future.',
        },
      ]}
      dataAutoId="transportation_management_system_section_3"
    />
    <ImageContentLayout
      content={transportManagementSystemInformation[0]}
      imageTitle="Delivery Truck for Transportation"
      imageAlt= "Delivery Vehicles on a Highway Across the World"
      imageDescription="An image of cargo delivery trucks on a highway"
      dataAutoId="transportation_management_system_section_4"
      withFeatureBullet={true}
    />
    <ImageContentLayout
      content={transportManagementSystemInformation[1]}
      imageTitle="LogiNext Transportation Management Screen"
      imageAlt="A Screen helping with Transportation Management"
      imageDescription="A Screen helping with Transportation Management"
      dataAutoId="transportation_management_system_section_5"
      withFeatureBullet={true}
    >
      <ModalTriggerButton
        modalType="schedule-a-demo"
        category="secondary"
        size="large"
        dataAutoId="transportation_management_system_section_5_schedule_demo"
      >
        Schedule a demo
      </ModalTriggerButton>
    </ImageContentLayout>
    <LandingPageRelatedResources slug="transportation-management-system" dataAutoId="transportation_management_system_section_6"/>
    <LoginextEmpowerBrands dataAutoId="transportation_management_system_section_7"/>
    <LandingPagesGtm />
  </>
)

const title = 'LogiNext Transportation Management System - Deliver Faster'
const description = `LogiNext helps you track your entire order lifecycle, and ensure on-time deliveries. 
                      Real-time tracking, ePOD, Capacity Utilization, Live Screens and more!`
const url = 'https://www.loginextsolutions.com/transportation-management-system'

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
  TransportManagementSystem as default,
  metadata
}
