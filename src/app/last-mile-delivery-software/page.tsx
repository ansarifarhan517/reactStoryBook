import { Metadata } from 'next'

import ModalTriggerButton from '@/components/modal-trigger-button'
import PageCoverSubSection from '@/components/page-cover-sub-section'
import ConfigurationSection from '@/components/configuration-section'
import ImageContentLayout from '@/components/image-content-layout'
import LandingPageRelatedResources from '@/components/landing-page-related-resources'
import PageCoverSectionWithHubspotForm from '@/components/cover-section-with-hubsot-form'
import LoginextEmpowerBrands from '@/components/loginext-empower-brands'
import LandingPagesGtm from '@/components/landing-pages-gtm'

import lastMileParcelDeliveryHeader from '/public/last-mile-delivery-software/last-mile-parcel-delivery-header.webp'
import lastMileSoftwareScreenPreview from '/public/last-mile-delivery-software/last-mile-delivery-software-screen-preview.webp'
import fasterRoutesForFasterDeliveries from '/public/last-mile-delivery-software/faster-routes-for-faster-deliveries.webp'
import minimalFollowUpsMaximumVisibility from '/public/last-mile-delivery-software/minimal-follow-ups-maximum-visibility.webp'
import increasedDeliveriesWithCostEfficiency from '/public/last-mile-delivery-software/increased-deliveries-with-cost-efficiency.webp'

import lastMileSoftwareInformation from './_data'

const LastMileDeliverySoftware = () => (
  <>
    <PageCoverSectionWithHubspotForm
      title="Last Mile Software"
      description="Offer faster last mile deliveries for more returning customers."
      image={lastMileParcelDeliveryHeader}
      imageTitle="Last Mile Parcel Delivery Header"
      imageAlt="Image of a Parcel Delivery"
      imageDescription="Image of a Parcel Delivery"
      dataAutoId="last_mile_delivery_software_section_1"
    />
    <PageCoverSubSection
      title="Give your customers the freedom to track their deliveries"
      description={`A happy customer is the true testament of a successful business.
                    While last mile deliveries can be full of complexities due to various factors like time, 
                    nature of product and customer expectations, a reliable last mile software can help you excel in your business exponentially.`}
      buttonLabel="view infographic"
      buttonCategory="secondary"
      redirectUrl={'https://info.loginextsolutions.com/hubfs/Infographics/Why%20Choosing%20the%20Right%20Last%20Mile%20Delivery%20Software%20is%20Critical%20For%20F&B%20Brands.pdf'}
      imageAlt="A Preview of Last Mile Software"
      imageTitle="Last Mile Software Screen Preview"
      imageDescription="A Preview of Last Mile Software"
      image={lastMileSoftwareScreenPreview}
      video="https://www.youtube.com/embed/39c5odOErtI?autoplay=1&mute=0&controls=0&showinfo=0&modestbranding=1&rel=0&enablejsapi=1"
      videoTitle="Give your customers the freedom to track their deliveries"
      dataAutoId="last_mile_delivery_software_section_2"
    />
    <ConfigurationSection
      iconSize="xxxlg"
      widthBg
      data={[
        {
          id: 'faster-routes-for-faster-deliveries',
          image: fasterRoutesForFasterDeliveries,
          title: 'Faster Routes for faster deliveries',
          description:
            `Identify the most suitable routes with a state-of-art route optimization 
              solution for speedy deliveries.`,
        },
        {
          id: 'minimal-follow-ups-maximum visibility',
          image: minimalFollowUpsMaximumVisibility,
          title: 'Minimal follow-ups, maximum visibility',
          description:
            `Offer transparency to your customers with real-time visibility using
            updates via SMS and alerts.`,
        },
        {
          id: 'increased-deliveries-with-cost-efficiency',
          image: increasedDeliveriesWithCostEfficiency,
          title: 'Increased deliveries with cost efficiency',
          description:
            `Optimize vehicles smartly to make multiple deliveries while increasing 
            the average delivery per driver.`,
        },

      ]}
      dataAutoId="last_mile_delivery_software_section_3"
    />
    <ImageContentLayout
      content={lastMileSoftwareInformation[0]}
      category="secondary"
      imageTitle="Last Mile Order Tracking Screen"
      imageAlt= "A LogiNext Mobile Screen for Last Mile Delivery"
      imageDescription="A LogiNext Mobile Screen for Last Mile Delivery"
      dataAutoId="last_mile_delivery_software_section_4"
      withFeatureBullet={true}
    />
    <ImageContentLayout
      content={lastMileSoftwareInformation[1]}
      category="secondary"
      imageTitle="Last Mile Dashboard for Delivery Management"
      imageAlt="A Dashboard of Live Last Mile Deliveries"
      imageDescription="A Dashboard of Live Last Mile Deliveries"
      dataAutoId="last_mile_delivery_software_section_5"
      withFeatureBullet={true}
    >
      <ModalTriggerButton
        modalType="schedule-a-demo"
        category="secondary"
        size="large"
        dataAutoId="last_mile_delivery_software_section_5_schedule_demo"
      >
        Schedule a demo
      </ModalTriggerButton>
    </ImageContentLayout>
    <LandingPageRelatedResources slug="last-mile-delivery" dataAutoId="last_mile_delivery_software_section_6"/>
    <LoginextEmpowerBrands dataAutoId="last_mile_delivery_software_section_7"/>
    <LandingPagesGtm />
  </>
)

const title = 'LogiNext Last Mile Software - Deliver Faster'
const description = `LogiNext helps you optimize your last mile deliveries with fuel & time savings. 
                      Order Auto Allocation, Optimized Route Planning, Driver Management, and more!`
const url = 'https://www.loginextsolutions.com/last-mile-delivery-software'

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
  LastMileDeliverySoftware as default,
  metadata
}
