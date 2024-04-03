import { Metadata } from 'next'

import ModalTriggerButton from '@/components/modal-trigger-button'
import PageCoverSubSection from '@/components/page-cover-sub-section'
import ConfigurationSection from '@/components/configuration-section'
import ImageContentLayout from '@/components/image-content-layout'
import LandingPageRelatedResources from '@/components/landing-page-related-resources'
import PageCoverSectionWithHubspotForm from '@/components/cover-section-with-hubsot-form'
import LoginextEmpowerBrands from '@/components/loginext-empower-brands'
import LandingPagesGtm from '@/components/landing-pages-gtm'

import truckingManagementHeader from '/public/trucking-management-software/trucking-management-header.webp'
import truckingManagementSoftwareScreenPreview from '/public/trucking-management-software/trucking-management-software-screen-preview.webp'
import realTimeTracking from '/public/trucking-management-software/real-time-tracking.webp'
import routeOptimization from '/public/trucking-management-software/route-optimization.webp'
import compartmentPlanning from '/public/trucking-management-software/compartment-planning.webp'
import checkpoints from '/public/trucking-management-software/checkpoints.webp'
import packingOptimization from '/public/trucking-management-software/3d-packing-optimization.webp'
import reportsAndAnalysis from '/public/trucking-management-software/reports-and-analysis.webp'

import truckingManagementSoftwareInformation from './_data'

const TruckingManagementSoftware = () => (
  <>
    <PageCoverSectionWithHubspotForm
      title="Trucking Management Software"
      description="Optimize your delivery routing and scheduling with the best trucking management software for seamless logistics operations."
      image={truckingManagementHeader}
      imageTitle="Trucking Management Header"
      imageAlt="Image of a Fleet of Trucks"
      imageDescription="Image of a Fleet of Trucks"
      dataAutoId="trucking_management_software_section_1"
    />
    <PageCoverSubSection
      title="Streamline logistics operations by choosing the right trucking management software"
      description={`Investing in the right trucking software is essential for businesses to meet 
                    their operational needs without sacrificing their efficiency and productivity while being within budget.`}
      buttonLabel="view case study"
      buttonCategory="secondary"
      redirectUrl={'https://info.loginextsolutions.com/hubfs/Case_Studies_2022/CSLite_LN%2BTrucking.pdf'}
      imageAlt="A Preview of Trucking Management Software"
      imageTitle="Trucking Management Software Screen Preview"
      imageDescription="A Preview of Trucking Management Software"
      image={truckingManagementSoftwareScreenPreview}
      video="https://www.youtube.com/embed/39c5odOErtI?autoplay=1&mute=0&controls=0&showinfo=0&modestbranding=1&rel=0&enablejsapi=1"
      videoTitle="Streamline logistics operations by choosing the right trucking management software"
      dataAutoId="trucking_management_software_section_2"
    />
    <ConfigurationSection
      iconSize="xxxlg"
      widthBg
      data={[
        {
          id: 'real-time-tracking',
          image: realTimeTracking,
          title: 'Real-time Tracking',
          description:
            'Get accurate tracking with alerts and notifications of your fleet in real time for better decision-making.',
        },
        {
          id: 'route-optimization',
          image: routeOptimization,
          title: 'Route Optimization',
          description:
            'Our advanced AI-enabled algorithm considers multiple factors to ensure timely deliveries.',
        },
        {
          id: 'compartment-planning',
          image: compartmentPlanning,
          title: 'Compartment Planning',
          description:
            'Manage and optimize for LTL and FTL truckloads to maximize truck capacity utilization and reduce empty miles.',
        },
        {
          id: 'checkpoints',
          image: checkpoints,
          title: 'Checkpoints',
          description:
            'Monitor the progress of shipments or delivery in real-time to ensure adherence to schedules.',
        },
        {
          id: '3d-packing-optimization',
          image: packingOptimization,
          title: '3D Packing Optimization',
          description:
            'We enable brands and enterprises to pack goods or load a container most efficiently.',
        },
        {
          id: 'reports-and-analysis',
          image: reportsAndAnalysis,
          title: 'Reports and Analysis',
          description:
            'Track key performance indicators, identify trends, and make informed decisions to enhance fleet performance.',
        },

      ]}
      dataAutoId="trucking_management_software_section_3"
    />
    <ImageContentLayout
      content={truckingManagementSoftwareInformation[0]}
      category="secondary"
      imageTitle="Fleet & Truck Management Screen"
      imageAlt= "A LogiNext Screen for Fleet & Truck Management"
      imageDescription="A LogiNext Screen for Fleet & Truck Management"
      dataAutoId="trucking_management_software_section_4"
      withFeatureBullet={true}
    />
    <ImageContentLayout
      content={truckingManagementSoftwareInformation[1]}
      category="secondary"
      imageTitle="Fleet & Truck Tracking Dashboard for Management"
      imageAlt="A Dashboard of Trucking Management Software"
      imageDescription="A Dashboard of Trucking Management Software"
      dataAutoId="trucking_management_software_section_5"
      withFeatureBullet={true}
    >
      <ModalTriggerButton
        modalType="schedule-a-demo"
        category="secondary"
        size="large"
        dataAutoId="trucking_management_software_section_5_schedule_demo"
      >
        Schedule a demo
      </ModalTriggerButton>
    </ImageContentLayout>
    <LandingPageRelatedResources slug="last-mile-delivery" dataAutoId="trucking_management_software_section_6" />
    <LoginextEmpowerBrands dataAutoId="trucking_management_software_section_section_7"/>
    <LandingPagesGtm />
  </>
)

const title = 'LogiNext Trucking Management Software - Deliver Better'
const description = `LogiNext helps you manage your fleet of trucks for optimized deliveries.
                    Real-time Tracking, Accurate ETA Predictions, Driver Management, Checkpoints and more!`
const url = 'https://www.loginextsolutions.com/trucking-management-software'

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
  TruckingManagementSoftware as default,
  metadata
}
