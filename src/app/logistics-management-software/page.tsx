
import { Metadata } from 'next'

import ModalTriggerButton from '@/components/modal-trigger-button'
import PageCoverSubSection from '@/components/page-cover-sub-section'
import ConfigurationSection from '@/components/configuration-section'
import ImageContentLayout from '@/components/image-content-layout'
import LandingPageRelatedResources from '@/components/landing-page-related-resources'
import LoginextEmpowerBrands from '@/components/loginext-empower-brands'
import LandingPagesGtm from '@/components/landing-pages-gtm'

import logisticsCargoDeliveryTruck from '/public/logistics-management-software/logistics-cargo-delivery-truck.webp'
import logisticsManagementSoftwarePreview from '/public/logistics-management-software/logistics-management-software-preview.webp'
import routeOptimization from '/public/logistics-management-software/route-optimization.webp'
import singleViewOfOperations from '/public/logistics-management-software/single-view-of-operations.webp'
import realTimeAlerts from '/public/logistics-management-software/real-time-alerts.webp'
import supplyChainVisibility from '/public/logistics-management-software/supply-chain-visibility.webp'
import shipmentTracking from '/public/logistics-management-software/shipment-tracking.webp'
import thirdPartyCarrierIntegration from '/public/logistics-management-software/third-party-carrier-integration.webp'
import PageCoverSectionWithHubspotForm from '@/components/cover-section-with-hubsot-form'

import logisticsManagementSystemInformation from './_data'


const LogisticsManagementSystem = () => (
  <>
    <PageCoverSectionWithHubspotForm
      title="Logistics Management Software"
      description={`Automate and simplify the entire order lifecycle across overall
                    planning till final delivery with a suitable logistics management software.`}
      image={logisticsCargoDeliveryTruck}
      imageTitle="Logistics Cargo Delivery Truck"
      imageAlt="Delivery Truck on Highway for Logistics"
      imageDescription="A Image of a Delivery Truck on Highway for Logistics"
      dataAutoId="logistics_managment_system_section_1"
    />
    <PageCoverSubSection
      title="Optimize fulfillment and adapt to business disruptions with the apt logistics management software"
      description={`Transform logistics operations into a manageable and seamless, customer-centric experience with 
                    integrated supply chains and a holistic view of the entire shipping experience. All you need to do is choose 
                    the right logistics management software as per your business requirements.`}
      buttonLabel="view infographic"
      buttonCategory="secondary"
      redirectUrl={'https://info.loginextsolutions.com/hubfs/Infographics/Best_Logistics_Management_Software.pdf'}
      imageAlt="A Preview of Logistics Management Software"
      imageTitle="Logistics Management Software Screen Preview"
      imageDescription="A Preview of Logistics Management Software"
      image={logisticsManagementSoftwarePreview}
      video="https://www.youtube.com/embed/39c5odOErtI?autoplay=1&mute=0&controls=0&showinfo=0&modestbranding=1&rel=0&enablejsapi=1"
      videoTitle="Optimize fulfillment and adapt to business disruptions with the apt logistics management software"
      dataAutoId="logistics_managment_system_section_2"
    />
    <ConfigurationSection
      iconSize="xxxlg"
      widthBg
      data={[
        {
          id: 'route-0ptimization:',
          image: routeOptimization,
          title: 'Route Optimization:',
          description:
            `Prioritize comprehensive route planning and dispatch scheduling with essential calculations
             and analysis for cost efficiency.`,
        },
        {
          id: 'single-view-of-operations',
          image: singleViewOfOperations,
          title: 'Single View of Operations',
          description:
          `Eliminate the hassle of moving to multiple screens for relevant updates of any shipment. 
            Get a single view of all the operations with end-to-end progress.`,
        },
        {
          id: 'real-time-alerts',
          image: realTimeAlerts,
          title: 'Real-time Alerts',
          description:
            `Minimize communication and offer timely updates about the shipments and deliveries to 
              the end customers with real-time notifications and alerts.`,
        },
        {
          id: 'supply-chain-visibility',
          image: supplyChainVisibility,
          title: 'Supply Chain Visibility',
          description:
            `Get end-to-end visibility of the entire supply chain for making better decisions 
              related to your logistics planning.`,
        },
        {
          id: 'shipment-tracking',
          image: shipmentTracking,
          title: 'Shipment Tracking',
          description:
            `Efficient barcode scanning features allow you to receive real-time updates on the current 
            status of your shipment.`,
        },
        {
          id: 'third-party-carrier-integration',
          image: thirdPartyCarrierIntegration,
          title: 'Third-party Carrier Integration',
          description:
            `Stop worrying about fleet or driver shortage by choosing from the plethora of options available for 
            faster deliveries with third-party carrier integration.`,
        },

      ]}
      dataAutoId="logistics_managment_system_section_3"
    />
    <ImageContentLayout
      content={logisticsManagementSystemInformation[0]}
      category="secondary"
      imageTitle="Logistics Management Software Screen"
      imageAlt= "A LogiNext Screen of Logistics Management Software"
      imageDescription="A LogiNext Screen of Logistics Management Software"
      dataAutoId="logistics_managment_system_section_4"
      withFeatureBullet={true}
    />
    <ImageContentLayout
      content={logisticsManagementSystemInformation[1]}
      category="secondary"
      imageTitle="Logistics Tracking Software for Management"
      imageAlt="A Map of Live Deliveries on a Logistics Software"
      imageDescription="A Map of Live Deliveries on a Logistics Software"
      dataAutoId="logistics_managment_system_section_5"
      withFeatureBullet={true}
    >
      <ModalTriggerButton
        modalType="schedule-a-demo"
        category="secondary"
        size="large"
        dataAutoId="logistics_managment_system_section_5_schedule_demo"
      >
        Schedule a demo
      </ModalTriggerButton>
    </ImageContentLayout>
    <LandingPageRelatedResources slug="logistics-management-software" dataAutoId="logistics_managment_system_section_6" />
    <LoginextEmpowerBrands dataAutoId="logistics_managment_system_section_7"/>
    <LandingPagesGtm />
  </>
)

const title = 'LogiNext Logistics Management Software - Optimize Deliveries'
const description = `LogiNext helps you deliver more orders in less time, and ensure fuel cost and time savings.
                     Optimized Route Planning, Real-time Notifications, Fleet Tracking, Live Screens and more!`
const url = 'https://www.loginextsolutions.com/logistics-management-software'

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
  LogisticsManagementSystem as default,
  metadata
}
