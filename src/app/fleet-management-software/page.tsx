import { Metadata } from 'next'
import ModalTriggerButton from '@/components/modal-trigger-button'
import PageCoverSubSection from '@/components/page-cover-sub-section'
import ConfigurationSection from '@/components/configuration-section'
import ImageContentLayout from '@/components/image-content-layout'
import LandingPageRelatedResources from '@/components/landing-page-related-resources'
import PageCoverSectionWithHubspotForm from '@/components/cover-section-with-hubsot-form'
import LoginextEmpowerBrands from '@/components/loginext-empower-brands'
import LandingPagesGtm from '@/components/landing-pages-gtm'

import fleetManagementSoftware from '/public/fleet-management-software/fleet-truck-highway.webp'
import fleetManagementInfogrpahicTruckManagement from '/public/fleet-management-software/fleet-management-infogrpahic-truck-management.webp'
import realTimeTracking from '/public/fleet-management-software/order-tracking.webp'
import routeOptimization from '/public/fleet-management-software/route.webp'
import fleet from '/public/fleet-management-software/fleet.webp'
import autoAssignment from '/public/fleet-management-software/order-assignment.webp'
import driverMonitoring from '/public/fleet-management-software/driver-monitoring.webp'
import reportingAndAnalytics from '/public/fleet-management-software/reporting-and-analytics.webp'

import fleetManagementSoftwareInformation from './_data'

const FleetManagementSoftware = () => (
  <>
    <PageCoverSectionWithHubspotForm
      title="Fleet Management Software"
      description={`Prioritize seamless deliveries, automate fleet operations and offer splendid customer
      experience with a feature-rich fleet management software.`}
      image={fleetManagementSoftware}
      imageTitle="Fleet tracking on highway"
      imageAlt="A fleet of trucks moving on a highway"
      imageDescription="A fleet of trucks moving on a highway"
      dataAutoId="fleet_management_software_section_1"
    />
    <PageCoverSubSection
      title="Streamline all the fleet operations for hassle-free and timely deliveries."
      description={`End-to-end fleet management can be a daunting task for businesses as it includes multiple 
                    operations taking place simultaneously. Managing operations effortlessly requires a full fledged and 
                    feature-rich fleet management software. Invest in LogiNext's user-friendly fleet management solution now!`}
      buttonLabel="view infographic"
      buttonCategory="secondary"
      redirectUrl={'https://info.loginextsolutions.com/hubfs/Infographics/5%20Reasons%20You%20Need%20LogiNext%E2%80%99s%20Fleet%20Tracking%20System.pdf'}
      imageAlt="A row of white vans parked in front of a building"
      imageTitle="Fleet of Delivery Trucks Infographic"
      imageDescription="An image of a fleet of delivery trucks outside a warehouse"
      image={fleetManagementInfogrpahicTruckManagement}
      video="https://www.youtube.com/embed/39c5odOErtI?autoplay=1&mute=0&controls=0&showinfo=0&modestbranding=1&rel=0&enablejsapi=1"
      videoTitle="Streamline all the fleet operations for hassle-free and timely deliveries"
      dataAutoId="fleet_management_software_section_2"
    />
    <ConfigurationSection
      iconSize="xxxlg"
      widthBg
      data={[
        {
          id: 'real-time-tracking-of-order-lifecyle',
          image: realTimeTracking,
          title: 'Real-time Tracking',
          description:
            'Track real-time locations and get updates about all vehicles on road to improve fleet efficiency in the longer run.',
        },
        {
          id: 'route-optimization',
          image: routeOptimization,
          title: 'Route Optimization',
          description:
            'Configure delivery routes based on traffic patterns, road conditions, and other data with a fleet management software to enhance productivity.',
        },
        {
          id: 'fleet-utilization',
          image: fleet,
          title: 'Fleet Utilization',
          description:
            'Ensure that no vehicles are under utilized or over utilized with the power of automation while planning deliveries.',
        },
        {
          id: 'auto-assignment',
          image: autoAssignment,
          title: 'Auto Assignment',
          description:
            'Identify the best suited drivers automatically and assign orders for cost efficient and timely delivery.',
        },
        {
          id: 'driver-monitoring',
          image: driverMonitoring,
          title: 'Driver Monitoring',
          description:
            'Get real-time updates about your driver’s movement and behavior like vehicle speed and pitstop timing.',
        },
        {
          id: 'reporting-and-analytics',
          image: reportingAndAnalytics,
          title: 'Reporting and Analytics',
          description:
            'Identify areas of improvement with detailed reports on fleet performance including routes taken, delivery time, fuel consumption and more.',
        },
      ]}
      dataAutoId="fleet_management_software_section_3"
    />
    <ImageContentLayout
      content={fleetManagementSoftwareInformation[0]}
      category="secondary"
      imageTitle="Fleet Tracking on LogiNext Screen"
      imageAlt="An image of an area’s location on a map, utilized for fleet tracking on the Loginext screen"
      imageDescription="An image of an area’s location on a map, utilized for fleet tracking on the Loginext screen"
      dataAutoId="fleet_management_software_section_4"
      withFeatureBullet={true}
    />
    <ImageContentLayout
      content={fleetManagementSoftwareInformation[1]}
      category="secondary"
      imageTitle="Route Planning on LogiNext Screen"
      imageAlt="An image of a vehicle’s route location on a map, viewed through the LogiNext screen for fleet tracking"
      imageDescription="An image of a vehicle’s route location on a map, viewed through the LogiNext screen for fleet tracking"
      dataAutoId="fleet_management_software_section_5"
      withFeatureBullet={true}
    >
      <ModalTriggerButton
        modalType="schedule-a-demo"
        category="secondary"
        size="large"
        dataAutoId="fleet_management_software_section_5_schedule_demo"
      >
        Schedule a demo
      </ModalTriggerButton>
    </ImageContentLayout>
    <LandingPageRelatedResources
      slug="fleet-management-software"
      dataAutoId="fleet_management_software_section_6"
    />
    <LoginextEmpowerBrands dataAutoId="fleet_management_software_section_7" />
    <LandingPagesGtm />
  </>
)

const title = 'LogiNext Fleet Management Software - Improved Performance'
const description = ` LogiNext helps you track your fleet movements for optimized deliveries 
                      and efficient fleet management. Real-time tracking, Geofencing, Capacity Utilization, Live Screens and more!`
const url = 'https://www.loginextsolutions.com/fleet-management-software'

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
  FleetManagementSoftware as default,
  metadata
}
