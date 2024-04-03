import { Metadata } from 'next'

import ModalTriggerButton from '@/components/modal-trigger-button'
import PageCoverSubSection from '@/components/page-cover-sub-section'
import ConfigurationSection from '@/components/configuration-section'
import ImageContentLayout from '@/components/image-content-layout'
import LandingPageRelatedResources from '@/components/landing-page-related-resources'
import LoginextEmpowerBrands from '@/components/loginext-empower-brands'
import PageCoverSectionWithHubspotForm from '@/components/cover-section-with-hubsot-form'
import LandingPagesGtm from '@/components/landing-pages-gtm'

import routeOptimizationAndPlanningSoftware from '/public/route-optimization-and-planning-software/route-optimization-and-planning-software.webp'
import deliveryTruckRoutePlanning from '/public/route-optimization-and-planning-software/delivery-truck-route-planning.webp'
import liveTracking from '/public/route-optimization-and-planning-software/live-tracking.webp'
import shorterRoutes from '/public/route-optimization-and-planning-software/shorter-routes.webp'
import accurateETAs from '/public/route-optimization-and-planning-software/accurate-etas.webp'
import lesserTraffic from '/public/route-optimization-and-planning-software/lesser-traffic.webp'
import smartGeocoding from '/public/route-optimization-and-planning-software/smart-geocoding.webp'
import automaticAllocation from '/public/route-optimization-and-planning-software/automatic-allocation.webp'

import transportManagementSystemInformation from './_data'

const RouteOptimizationAndPlanningSoftware = () => (
  <>
    <PageCoverSectionWithHubspotForm
      title="Route Optimization Software"
      description={`Maximize ROI and offer timely deliveries by identifying faster
      routes with a smart route planning software.`}
      image={routeOptimizationAndPlanningSoftware}
      imageTitle="Route Optimization for Faster Deliveries"
      imageAlt="A Drone Shot of Multiple Routes"
      imageDescription="A Drone Shot of Multiple Routes"
      dataAutoId="route_optimization_and_planning_software_section_1"
    />
    <PageCoverSubSection
      title="Achieve critical business objectives with a significant positive impact on timely deliveries"
      description={`An AI-powered routing software enables faster deliveries, offers the most accurate ETAs 
                    and eliminates the need for overspending on fuel and continuous communication. 
                    While choosing an ideal solution can be a daunting task, prioritizing practical, efficient, 
                    and non-overlapping routes can help in making the right decisions.`}
      buttonLabel="view infographic"
      buttonCategory="secondary"
      redirectUrl={
        'https://info.loginextsolutions.com/hubfs/Infographics/Benefits%20of%20using%20Multiple%20Delivery%20Route%20Planner%20Software.pdf'
      }
      imageAlt="A Delivery Truck on a Planned Route"
      imageTitle="Delivery Truck on a Planned Route"
      imageDescription="An Image of A Delivery Truck on a Planned Route"
      image={deliveryTruckRoutePlanning}
      video="https://www.youtube.com/embed/39c5odOErtI?autoplay=1&mute=0&controls=0&showinfo=0&modestbranding=1&rel=0&enablejsapi=1"
      videoTitle="Achieve critical business objectives with a significant positive impact on timely deliveries"
      dataAutoId="route_optimization_and_planning_software_section_2"
    />
    <ConfigurationSection
      iconSize="xxxlg"
      widthBg
      data={[
        {
          id: 'live-tracking',
          image: liveTracking,
          title: 'Live Tracking',
          description: `Stay updated and keep the customer informed about their delivery status and 
              real-time updates of the shipment.`,
        },
        {
          id: 'shorter-routes',
          image: shorterRoutes,
          title: 'Shorter Routes',
          description: `Identify the fastest and most cost efficient routes to keep your 
            deliveries on time and customers happy.`,
        },
        {
          id: 'accurate-ETAs',
          image: accurateETAs,
          title: 'Accurate ETAs',
          description: `Minimize communication by offering the approximate delivery time 
            and avoid multiple follow ups.`,
        },
        {
          id: 'lesser-traffic',
          image: lesserTraffic,
          title: 'Lesser Traffic',
          description:
            'Identify routes with lesser traffic where the shipments can move faster and conveniently.',
        },
        {
          id: 'smart-geocoding',
          image: smartGeocoding,
          title: 'Smart Geocoding',
          description: `Decode every delivery address across the globe into accurate coordinates 
            for reaching the destination easily.`,
        },
        {
          id: 'automatic-allocation',
          image: automaticAllocation,
          title: 'Automatic Allocation',
          description: `Fulfill the immediate market needs along with optimized resource 
              utilization for every delivery.`,
        },
      ]}
      dataAutoId="route_optimization_and_planning_software_section_3"
    />
    <ImageContentLayout
      content={transportManagementSystemInformation[0]}
      imageTitle="Delivery Goods on a Planned Route"
      imageAlt="An Image of a Delivery Driver Carrying Parcel"
      imageDescription="An Image of a Delivery Driver Carrying Parcel"
      dataAutoId="route_optimization_and_planning_software_section_4"
      withFeatureBullet={true}
    />
    <ImageContentLayout
      content={transportManagementSystemInformation[1]}
      imageTitle="Route Planning for Delivery"
      imageAlt="Delivery Truck using Route Planning Software"
      imageDescription="Delivery Truck using Route Planning Software"
      dataAutoId="route_optimization_and_planning_software_section_5"
      withFeatureBullet={true}
    >
      <ModalTriggerButton
        modalType="schedule-a-demo"
        category="secondary"
        size="large"
        dataAutoId="route_optimization_and_planning_software_section_5_schedule_demo"
      >
        Schedule a demo
      </ModalTriggerButton>
    </ImageContentLayout>
    <LandingPageRelatedResources
      slug="route-planning-software"
      dataAutoId="route_optimization_and_planning_software_section_6"
    />
    <LoginextEmpowerBrands dataAutoId="route_optimization_and_planning_software_section_7" />
    <LandingPagesGtm />
  </>
)

const title = 'LogiNext Route Optimization Software - Deliver Faster'
const description = `LogiNext helps you deliver more orders in less time, and ensure fuel cost and time savings. 
                    Live Traffic Analysis, Real-time tracking, Multiple Stops, Live Screens and more!`
const url =
  'https://www.loginextsolutions.com/route-optimization-and-planning-software'

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

export { RouteOptimizationAndPlanningSoftware as default, metadata }
