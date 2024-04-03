import { Metadata } from 'next'

import ModalTriggerButton from '@/components/modal-trigger-button'
import PageCoverSubSection from '@/components/page-cover-sub-section'
import ConfigurationSection from '@/components/configuration-section'
import ImageContentLayout from '@/components/image-content-layout'
import LandingPageRelatedResources from '@/components/landing-page-related-resources'
import PageCoverSectionWithHubspotForm from '@/components/cover-section-with-hubsot-form'
import LoginextEmpowerBrands from '@/components/loginext-empower-brands'
import LandingPagesGtm from '@/components/landing-pages-gtm'

import deliveryRoutingSoftwareHeader from '/public/delivery-routing-software/delivery-routing-software-header.webp'
import deliveryRoutingSoftwareScreenPreview from '/public/delivery-routing-software/delivery-routing-software-screen-preview.webp'
import territoryPlanning from '/public/delivery-routing-software/territory-planning.webp'
import vehicleSchedulingAndRouting from '/public/delivery-routing-software/vehicle-scheduling-and-routing.webp'
import driverManagement from '/public/delivery-routing-software/driver-management.webp'
import fleetManagement from '/public/delivery-routing-software/fleet-management.webp'
import performanceAnalytics from '/public/delivery-routing-software/performance-analytics.webp'
import orderTimeWindowAllocation from '/public/delivery-routing-software/order-time-window-allocation.webp'

import deliveryRoutingSoftwareInformation from './_data'

const DeliveryRoutingSoftware = () => (
  <>
    <PageCoverSectionWithHubspotForm
      title="Delivery Routing Software"
      description="Tackle order tracking issues with accurate time slot predictions, ensuring timely deliveries for a great delivery experience and enhancing customer experience."
      image={deliveryRoutingSoftwareHeader}
      imageTitle="Delivery Routing Software Header"
      imageAlt="Image of Delivery Routes in a City"
      imageDescription="Image of Delivery Routes in a City"
      dataAutoId="delivery_routing_software_section_1"
    />
    <PageCoverSubSection
      title="Achieving 30% faster deliveries with dynamic route planning"
      description={`Whether you’re delivering burgers or a wedding dress, time is of the essence for delivering a splendid customer experience.
                    Learn how dynamic delivery routing software will help your business grow faster.`}
      buttonLabel="download whitepaper"
      buttonCategory="secondary"
      redirectUrl={'https://info.loginextsolutions.com/hubfs/WhitePaper/Achieving%2030%25%20Faster%20Deliveries%20With%20Dynamic%20Route%20Planning.pdf'}
      imageAlt="A Preview of Delivery Routing Software"
      imageTitle="Delivery Routing Software Screen Preview"
      imageDescription="A Preview of Delivery Routing Software"
      image={deliveryRoutingSoftwareScreenPreview}
      video="https://www.youtube.com/embed/39c5odOErtI?autoplay=1&mute=0&controls=0&showinfo=0&modestbranding=1&rel=0&enablejsapi=1"
      videoTitle="Achieving 30% faster deliveries with dynamic route planning"
      dataAutoId="delivery_routing_software_section_2"
    />
    <ConfigurationSection
      iconSize="xxxlg"
      widthBg
      data={[
        {
          id: 'territory-planning',
          image: territoryPlanning,
          title: 'Territory Planning',
          description:
            `Optimize your delivery network with strategic territory planning that maximizes 
            efficiency and minimizes operational cost.`,
        },
        {
          id: 'vehicle-scheduling-and-routing',
          image: vehicleSchedulingAndRouting,
          title: 'Vehicle Scheduling and Routing',
          description:
            'Empower your fleet delivery processes and enhance on-time performance for a seamless customer experience.',
        },
        {
          id: 'driver-management:',
          image: driverManagement,
          title: 'Driver Management:',
          description:
            'Efficiently manage your drivers, and get real-time insights into driver activities, performance monitoring, and communications.',
        },
        {
          id: 'fleet-management',
          image: fleetManagement,
          title: 'Fleet Management',
          description:
            'Take control of your entire fleet effortlessly ensuring your fleet operates at peak performance.',
        },
        {
          id: 'performance-analytics',
          image: performanceAnalytics,
          title: 'Performance Analytics',
          description:
            `Unlock valuable insights into your delivery operations with advanced performance analytics,
            make data-driven decisions, and identify optimization opportunities.`,
        },
        {
          id: 'order-time-window-allocation',
          image: orderTimeWindowAllocation,
          title: 'Order Time Window Allocation',
          description:
            `Enhance customer satisfaction by precisely allocating order time windows with our delivery routing software,
            ensuring timely deliveries and minimal waiting time.`,
        }
      ]}
      dataAutoId="delivery_routing_software_section_3"
    />
    <ImageContentLayout
      content={deliveryRoutingSoftwareInformation[0]}
      category="secondary"
      imageTitle="Delivery Routing Live Screen"
      imageAlt= "A LogiNext Screen for Delivery Routing for Live Orders"
      imageDescription="A LogiNext Screen for Delivery Routing for Live Orders"
      dataAutoId="delivery_routing_software_section_4"
      withFeatureBullet={true}
    />
    <ImageContentLayout
      content={deliveryRoutingSoftwareInformation[1]}
      category="secondary"
      imageTitle="Delivery Routes for Order Management"
      imageAlt="A Live Map of Routes on a Delivery Routing Software"
      imageDescription="A Live Map of Routes on a Delivery Routing Software"
      dataAutoId="delivery_routing_software_section_5"
      withFeatureBullet={true}
    >
      <ModalTriggerButton
        modalType="schedule-a-demo"
        category="secondary"
        size="large"
        dataAutoId="delivery_routing_software_section_5_schedule_demo"
      >
        Schedule a demo
      </ModalTriggerButton>
    </ImageContentLayout>
    <LandingPageRelatedResources slug="delivery-routing-software" dataAutoId="delivery_routing_software_section_6" />
    <LoginextEmpowerBrands dataAutoId="delivery_routing_software_section_7"/>
    <LandingPagesGtm />
  </>
)

const title = 'LogiNext Delivery Routing Software - Deliver Faster'
const description = `LogiNext helps you deliver your orders with maximum efficiency and cost-savings.
                    Order Auto Allocation, Optimized Route Planning, Driver Management, and more!`
const url = 'https://www.loginextsolutions.com/delivery-routing-software'

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
  DeliveryRoutingSoftware as default,
  metadata
}
