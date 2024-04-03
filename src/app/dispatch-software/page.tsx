import { Metadata } from 'next'

import ModalTriggerButton from '@/components/modal-trigger-button'
import PageCoverSubSection from '@/components/page-cover-sub-section'
import ConfigurationSection from '@/components/configuration-section'
import ImageContentLayout from '@/components/image-content-layout'
import LandingPageRelatedResources from '@/components/landing-page-related-resources'
import PageCoverSectionWithHubspotForm from '@/components/cover-section-with-hubsot-form'
import LandingPagesGtm from '@/components/landing-pages-gtm'

import deliveryDriverDispatchSoftware from '/public/dispatch-software/delivery-driver-dispatch-software.webp'
import logiNextScreenDispatchManagement from '/public/dispatch-software/logiNext-screen-dispatch-management.webp'
import smartAssignment from '/public/dispatch-software/smart-assignment.webp'
import automatedDispatch from '/public/dispatch-software/automated-dispatch.webp'
import enhancedVisibility from '/public/dispatch-software/enhanced-visibility.webp'


import dispatchSoftwareInformation from './_data'
import LoginextEmpowerBrands from '@/components/loginext-empower-brands'


const DispatchSoftware = () => (
  <>
    <PageCoverSectionWithHubspotForm
      title="Reliable Scheduling and Dispatch Software"
      description={`Streamline operations, improve customer satisfaction and
                  achieve all-mile logistics excellence on the go.`}
      image={deliveryDriverDispatchSoftware}
      imageTitle="Delivery Driver with Parcel using Dispatch Software"
      imageAlt="A Delivery Associate Carrying a Parcel"
      imageDescription="A Delivery Associate Carrying a Parcel"
      dataAutoId="dispatch_software_section_1"
    />
    <PageCoverSubSection
      title="Optimize your dispatch operations to prioritize timely delivery and increased efficiency"
      description={`Dispatch management softwares with AI-enabled ready-to-use solutions are a must have for 
                    every business dealing with logistics in today’s fast-paced era. 
                    Investing in a solution that helps in exponential growth of timely deliveries comes with multiple benefits and better customer retention.`}
      buttonLabel="view blog"
      buttonCategory="secondary"
      redirectUrl={'https://www.loginextsolutions.com/blog/dispatch-software-for-logistics-operations/'}
      imageAlt="A Screen of Dispatch Software"
      imageTitle="LogiNext Screen for Dispatch & Schedule Management"
      imageDescription="An image of cargo delivery trucks on a highway"
      image={logiNextScreenDispatchManagement}
      video="https://www.youtube.com/embed/39c5odOErtI?autoplay=1&mute=0&controls=0&showinfo=0&modestbranding=1&rel=0&enablejsapi=1"
      videoTitle="Optimize your dispatch operations to prioritize timely delivery and increased efficiency"
      dataAutoId="dispatch_software_section_2"
    />
    <ConfigurationSection
      iconSize="xxxlg"
      widthBg
      data={[
        {
          id: 'smart-assignment',
          image: smartAssignment,
          title: 'Smart Assignment',
          description:
            `Ensure that the right delivery agent is assigned for every delivery depending on factors 
            such as time, location and delivery type.`,
        },
        {
          id: 'automated-dispatch',
          image: automatedDispatch,
          title: 'Automated Dispatch',
          description:
            `Reduce planning time and expected human errors 
            by automating the entire dispatch process.`,
        },
        {
          id: 'enhanced-visibility',
          image: enhancedVisibility,
          title: 'Enhanced Visibility',
          description:
            `Foster transparency and develop trust with customers using real-time 
            visibility and timely notifications.`,
        },

      ]}
      dataAutoId="dispatch_software_section_3"
    />
    <ImageContentLayout
      content={dispatchSoftwareInformation[0]}
      imageTitle="Dispatched Goods in Delivery Truck"
      imageAlt= "A Truck Carrying Dispatched Goods on a Highway"
      imageDescription="A Truck Carrying Dispatched Goods on a Highway"
      dataAutoId="dispatch_software_section_4"
      withFeatureBullet={true}
    />
    <ImageContentLayout
      content={dispatchSoftwareInformation[1]}
      imageTitle="Dispatching Order for Delivery"
      imageAlt="Dispatcher is dispatching a delivery order near a van"
      imageDescription="Dispatcher is dispatching a delivery order near a van"
      dataAutoId="dispatch_software_section_5"
      withFeatureBullet={true}
    >
      <ModalTriggerButton
        modalType="schedule-a-demo"
        category="secondary"
        size="large"
        dataAutoId="dispatch_software_section_5_schedule_demo"
      >
        Schedule a demo
      </ModalTriggerButton>
    </ImageContentLayout>
    <LandingPageRelatedResources slug="dispatch-software" dataAutoId="dispatch_software_section_6"/>
    <LoginextEmpowerBrands dataAutoId="dispatch_software_section_7"/>
    <LandingPagesGtm />
  </>
)

const title = 'LogiNext Dispatch Management Software - Deliver Better'
const description = `LogiNext helps you dispatch more orders in less time, and ensure on-time deliveries. 
                    Order Auto Allocation, Real-time tracking, ePOD, Live Screens and more!`
const url = 'https://www.loginextsolutions.com/dispatch-software'

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
  DispatchSoftware as default,
  metadata
}
