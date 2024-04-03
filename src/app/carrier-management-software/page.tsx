import { Metadata } from 'next'

import ModalTriggerButton from '@/components/modal-trigger-button'
import PageCoverSubSection from '@/components/page-cover-sub-section'
import ConfigurationSection from '@/components/configuration-section'
import ImageContentLayout from '@/components/image-content-layout'
import LandingPageRelatedResources from '@/components/landing-page-related-resources'
import PageCoverSectionWithHubspotForm from '@/components/cover-section-with-hubsot-form'
import LoginextEmpowerBrands from '@/components/loginext-empower-brands'
import LandingPagesGtm from '@/components/landing-pages-gtm'

import carrierVehicleManagementHeader from '/public/carrier-management-software/carrier-vehicle-management-header.webp'
import carrierManagementSoftwareScreenPreview from '/public/carrier-management-software/carrier-management-software-screen-preview.webp'
import realTimeFleetTracking from '/public/carrier-management-software/real-time-fleet-tracking.webp'
import intelligentRouteOptimization from '/public/carrier-management-software/intelligent-route-optimization.webp'
import advancedAnalyticsAndReporting from '/public/carrier-management-software/advanced-analytics-and-reporting.webp'
import userFriendlyInterface from '/public/carrier-management-software/user-friendly-interface.webp'
import carrierManagement from '/public/carrier-management-software/carrier-management.webp'
import singleViewOfOperation from '/public/carrier-management-software/single-view-of-operation.webp'

import carrierManagementSoftwareInformation from './_data'

const CarrierManagementSoftware = () => (
  <>
    <PageCoverSectionWithHubspotForm
      title="Carrier Management Software for Smart Logistics"
      description="An efficient carrier management solution to streamline operations, enhance visibility, and propel your logistics into the future."
      image={carrierVehicleManagementHeader}
      imageTitle="Carrier Vehicle Management Header"
      imageAlt="Carrier Trucks Fulfilling Deliveries"
      imageDescription="Carrier Trucks Fulfilling Deliveries"
      dataAutoId="carrier_management_software_section_1"
    />
    <PageCoverSubSection
      title="Carrier management system trusted in 50+ countries"
      description={`Our carrier management software is tailored to transform logistics operations and propel your business forward. 
                    Our scalable platform prioritizes user experience that helps make data-driven decisions and enhance operational efficiency.`}
      buttonLabel="view infographic"
      buttonCategory="secondary"
      redirectUrl={'https://info.loginextsolutions.com/hubfs/Infographics/Why%20Choosing%20the%20Right%20Last%20Mile%20Delivery%20Software%20is%20Critical%20For%20F&B%20Brands.pdf'}
      imageAlt="A Preview of Carrier Management Software"
      imageTitle="Carrier Management Software Screen Preview"
      imageDescription="A Preview of Carrier Management Software"
      image={carrierManagementSoftwareScreenPreview}
      video="https://www.youtube.com/embed/39c5odOErtI?autoplay=1&mute=0&controls=0&showinfo=0&modestbranding=1&rel=0&enablejsapi=1"
      videoTitle="Carrier management system trusted in 50+ countries"
      dataAutoId="carrier_management_software_section_2"

    />
    <ConfigurationSection
      iconSize="xxxlg"
      widthBg
      data={[
        {
          id: 'real-time-fleet-tracking',
          image: realTimeFleetTracking,
          title: 'Real-Time Fleet Tracking',
          description:
            'Enhance visibility, optimize routes, and respond promptly to changes in delivery schedules.',
        },
        {
          id: 'intelligent-route-optimization',
          image: intelligentRouteOptimization,
          title: 'Intelligent Route Optimization',
          description:
            `Our advanced algorithms optimize delivery routes, minimizing fuel costs, reducing travel time, 
            and enhancing overall operational efficiency.`,
        },
        {
          id: 'advanced-analytics-and-reporting',
          image: advancedAnalyticsAndReporting,
          title: 'Advanced Analytics and Reporting',
          description:
            'Gain actionable insights for key performance indicators, driver behavior, and overall fleet efficiency.',
        },
        {
          id: 'user-friendly-interface',
          image: userFriendlyInterface,
          title: 'User-Friendly Interface',
          description:
            'Our user-centric design ensures your team can navigate the software effortlessly, reducing training time and enhancing user adoption.',
        },
        {
          id: 'carrier-management',
          image: carrierManagement,
          title: 'Carrier Management',
          description:
            'Using our carrier integrations, easily integrate with your carrier networks to create the best fleet that can scale as per your order demand.',
        },
        {
          id: 'single-view-of-operation',
          image: singleViewOfOperation,
          title: 'Single View of Operation',
          description:
            'Track order, fleet, and delivery lifecycles on a live dashboard to help mitigate operational inefficiencies with real-time visibility.',
        },

      ]}
      dataAutoId="carrier_management_software_section_3"
    />
    <ImageContentLayout
      content={carrierManagementSoftwareInformation[0]}
      category="secondary"
      imageTitle="Carrier Management Capacity Screen"
      imageAlt= "A LogiNext Screen for Carrier Capacity Management"
      imageDescription="A LogiNext Screen for Carrier Capacity Management"
      dataAutoId="carrier_management_software_section_4"
      withFeatureBullet={true}
    />
    <ImageContentLayout
      content={carrierManagementSoftwareInformation[1]}
      category="secondary"
      imageTitle="Carrier Dashboard for Delivery Management"
      imageAlt="A Dashboard of Carriers used for Delivery Management"
      imageDescription="A Dashboard of Carriers used for Delivery Management"
      dataAutoId="carrier_management_software_section_5"
      withFeatureBullet={true}
    >
      <ModalTriggerButton
        modalType="schedule-a-demo"
        category="secondary"
        size="large"
        dataAutoId="carrier_management_software_section_5_schedule_demo"
      >
        Schedule a demo
      </ModalTriggerButton>
    </ImageContentLayout>
    <LandingPageRelatedResources slug="carrier-management" dataAutoId="carrier_management_software_section_6" />
    <LoginextEmpowerBrands dataAutoId="carrier_management_software_section_7"/>
    <LandingPagesGtm />
  </>
)

const title = 'LogiNext Carrier Management Software - Seamless Deliveries'
const description = `LogiNext helps you utilize your carriers smartly, and integrate them with our delivery management system. 
                      Predictive Insights, Order Auto Allocation, Driver Management, and more!`
const url = 'https://www.loginextsolutions.com/carrier-management-software'

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
  CarrierManagementSoftware as default,
  metadata
}
