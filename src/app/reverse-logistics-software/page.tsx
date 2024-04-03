import { Metadata } from 'next'

import ModalTriggerButton from '@/components/modal-trigger-button'
import PageCoverSubSection from '@/components/page-cover-sub-section'
import ConfigurationSection from '@/components/configuration-section'
import ImageContentLayout from '@/components/image-content-layout'
import LandingPageRelatedResources from '@/components/landing-page-related-resources'
import PageCoverSectionWithHubspotForm from '@/components/cover-section-with-hubsot-form'
import LoginextEmpowerBrands from '@/components/loginext-empower-brands'
import LandingPagesGtm from '@/components/landing-pages-gtm'

import reverseLogisticsReturnHeader from '/public/reverse-logistics-software/reverse-logistics-return-header.webp'
import reverseLogisticsSoftwareScreenPreview from '/public/reverse-logistics-software/reverse-logistics-software-screen-preview.webp'
import realTimeTracking from '/public/reverse-logistics-software/real-time-tracking.webp'
import integrationMarketplace from '/public/reverse-logistics-software/integration-marketplace.webp'
import dataAnalyticsAndReporting from '/public/reverse-logistics-software/data-analytics-and-reporting.webp'
import ePodAndESignCapture from '/public/reverse-logistics-software/ePod-and-eSign-capture.webp'
import alertsAndNotifications from '/public/reverse-logistics-software/alerts-and-notifications.webp'
import customPickUpTimeWindow from '/public/reverse-logistics-software/custom-pick-up-time-window.webp'

import reverseLogisticsSoftwareInformation from './_data'


const ReverseLogisticsSoftware = () => (
  <>
    <PageCoverSectionWithHubspotForm
      title="Most Trusted Reverse Logistics Software"
      description="Handle returns easily with LogiNext’s highly flexible and configurable reverse logistics software."
      image={reverseLogisticsReturnHeader}
      imageTitle="Reverse Logistics Header"
      imageAlt="A Delivery Driver Picking up Return"
      imageDescription="A Delivery Driver Picking up Return"
      dataAutoId="reverse_logistics_software_section_1"
    />
    <PageCoverSubSection
      title="Unlock competitive advantage with hassle-free returns"
      description={`With our reverse logistics software solution, you can be assured to enhance customer experience, 
                  improve return on investment, and grow your business exponentially.`}
      buttonLabel="view blog"
      buttonCategory="secondary"
      redirectUrl={'https://www.loginextsolutions.com/blog/what-is-reverse-logistics-how-to-handle-returns-efficiently'}
      imageAlt="A Preview of Live Return Orders"
      imageTitle="Reverse Logistics Software Screen Preview"
      imageDescription="A Preview of Live Return Orders"
      image={reverseLogisticsSoftwareScreenPreview}
      video="https://www.youtube.com/embed/39c5odOErtI?autoplay=1&mute=0&controls=0&showinfo=0&modestbranding=1&rel=0&enablejsapi=1"
      videoTitle="Unlock competitive advantage with hassle-free returns"
      dataAutoId="reverse_logistics_software_section_2"
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
            `Both customers and dispatchers can get real-time updates for returned orders which 
              eliminates uncertainty,minimizes queries, and builds trust.`,
        },
        {
          id: 'integration-marketplace',
          image: integrationMarketplace,
          title: 'Integration Marketplace',
          description:
            `LogiNext easily integrates with your present logistics solutions with APIs to empower 
            dispatchers for hassle-free returns.`,
        },
        {
          id: 'data-analytics-and-reporting',
          image: dataAnalyticsAndReporting,
          title: 'Data Analytics and Reporting',
          description:
            'Dispatchers can analyze return patterns, identify trends, and locate the root causes of frequent returns.',
        },
        {
          id: 'ePod-and-eSign-capture',
          image: ePodAndESignCapture,
          title: 'ePod and eSign Capture',
          description:
            'Capture proof digitally to ensure a seamless and paperless verification process for returned orders.',
        },
        {
          id: 'alerts-and-notifications',
          image: alertsAndNotifications,
          title: 'Alerts and Notifications',
          description:
            `Automatically notify customers when their return is received, processed, 
            and when refunds or replacements are initiated.`,
        },
        {
          id: 'custom-pick-up-time-window',
          image: customPickUpTimeWindow,
          title: 'Custom Pick-up Time Window',
          description:
            `Customers can now schedule returns at their convenience,
            reducing the inconvenience and frustration often associated with fixed return schedules.`,
        }
      ]}
      dataAutoId="reverse_logistics_software_section_3"
    />
    <ImageContentLayout
      content={reverseLogisticsSoftwareInformation[0]}
      category="secondary"
      imageTitle="Live Screen for Return Orders"
      imageAlt= "A LogiNext Screen of all Reverse Logistics Orders"
      imageDescription="A LogiNext Screen of all Reverse Logistics Orders"
      dataAutoId="reverse_logistics_software_section_4"
      withFeatureBullet={true}
    />
    <ImageContentLayout
      content={reverseLogisticsSoftwareInformation[1]}
      category="secondary"
      imageTitle="Live Dashboard Preview Reverse Logistics"
      imageAlt="A Live Dashboard tracking deliveries & returns"
      imageDescription="A Live Dashboard tracking deliveries & returns"
      dataAutoId="reverse_logistics_software_section_5"
      withFeatureBullet={true}
    >
      <ModalTriggerButton
        modalType="schedule-a-demo"
        category="secondary"
        size="large"
        dataAutoId="reverse_logistics_software_section_5_schedule_demo"
      >
        Schedule a demo
      </ModalTriggerButton>
    </ImageContentLayout>
    <LandingPageRelatedResources slug="reverse-logistics-software" dataAutoId="reverse_logistics_software_section_6" />
    <LoginextEmpowerBrands dataAutoId="reverse_logistics_software_section_7"/>
    <LandingPagesGtm />
  </>
)

const title = 'LogiNext Reverse Logistics Software - Easy Returns'
const description = `LogiNext helps you manage returns & replacements effectively.
                    Checkpoints, Route Planning, Pickup-Scheduling and more!`
const url = 'https://www.loginextsolutions.com/reverse-logistics-software'

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
  ReverseLogisticsSoftware as default,
  metadata
}
