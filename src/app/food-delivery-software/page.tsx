import { Metadata } from 'next'

import ModalTriggerButton from '@/components/modal-trigger-button'
import PageCoverSubSection from '@/components/page-cover-sub-section'
import ConfigurationSection from '@/components/configuration-section'
import ImageContentLayout from '@/components/image-content-layout'
import LandingPageRelatedResources from '@/components/landing-page-related-resources'
import PageCoverSectionWithHubspotForm from '@/components/cover-section-with-hubsot-form'
import LoginextEmpowerBrands from '@/components/loginext-empower-brands'
import LandingPagesGtm from '@/components/landing-pages-gtm'

import restaurantFoodDeliveryHeader from '/public/food-delivery-software/restaurant-food-delivery-header.webp'
import foodDeliverySoftwareScreenPreview from '/public/food-delivery-software/food-delivery-software-screen-preview.webp'
import liveOrderTracking from '/public/food-delivery-software/live-order-tracking.webp'
import automaticDriverAllocation from '/public/food-delivery-software/automatic-driver-allocation.webp'
import thirdPartyCarrierIntegration from '/public/food-delivery-software/third-party-carrier-integration.webp'


import foodDeliverySoftwareInformation from './_data'


const FoodDeliverySoftware = () => (
  <>
    <PageCoverSectionWithHubspotForm
      title="Food Delivery System"
      description="Offer an unparalleled delivery experience for every delicacy."
      image={restaurantFoodDeliveryHeader}
      imageTitle="Restaurant Food Delivery Header"
      imageAlt="Image of a Food Delivery Bike"
      imageDescription="Image of a Food Delivery Bike"
      dataAutoId="food_delivery_software_section_1"
    />
    <PageCoverSubSection
      title="Expand your food delivery business with the power of automation"
      description={`Overwhelming deliveries, order surges during peak hours, manual operations 
                    and limited workforce can affect the growth of your food delivery business significantly.
                    A suitable food delivery system helps you automate your order allocation, minimize errors and process deliveries faster.`}
      buttonLabel="view white paper"
      buttonCategory="secondary"
      redirectUrl={'https://info.loginextsolutions.com/hubfs/WhitePaper/A%20Quick%20Guide%20to%20Food%20Delivery%20Management%20System.pdf'}
      imageAlt="A Preview of Food Delivery Software"
      imageTitle="Food Delivery Software Screen Preview"
      imageDescription="A Preview of Food Delivery Software"
      image={foodDeliverySoftwareScreenPreview}
      video="https://www.youtube.com/embed/39c5odOErtI?autoplay=1&mute=0&controls=0&showinfo=0&modestbranding=1&rel=0&enablejsapi=1"
      videoTitle="Expand your food delivery business with the power of automation"
      dataAutoId="food_delivery_software_section_2"
    />
    <ConfigurationSection
      iconSize="xxxlg"
      widthBg
      data={[
        {
          id: 'live-order-tracking',
          image: liveOrderTracking,
          title: 'Live Order Tracking',
          description:
            `Use a single dashboard as a source of truth to view the movement of all the drivers out for deliveries 
            and offer essential alerts to the customers.`
        },
        {
          id: 'automatic-driver-allocation',
          image: automaticDriverAllocation,
          title: 'Automatic Driver Allocation',
          description:
            'Deliver faster and in a cost efficient way by allocating the right driver for the right delivery automatically.',
        },
        {
          id: 'third-party-carrier-integration',
          image: thirdPartyCarrierIntegration,
          title: 'Third-party Carrier Integration',
          description:
            `Use a single window to track all the consignments in real-time across 
            third-party logistics providers.`,
        },

      ]}
      dataAutoId="food_delivery_software_section_3"
    />
    <ImageContentLayout
      content={foodDeliverySoftwareInformation[0]}
      category="secondary"
      imageTitle="Food Order Management Screen"
      imageAlt= "A LogiNext Screen for Food Delivery Management"
      imageDescription="A LogiNext Screen for Food Delivery Management"
      dataAutoId="food_delivery_software_section_4"
      withFeatureBullet={true}
    />
    <ImageContentLayout
      content={foodDeliverySoftwareInformation[1]}
      category="secondary"
      imageTitle="Food Delivery Map for Order Management"
      imageAlt="A Map showing a Live Food Delivery Order"
      imageDescription="A Map showing a Live Food Delivery Order"
      dataAutoId="food_delivery_software_section_5"
      withFeatureBullet={true}
    >
      <ModalTriggerButton
        modalType="schedule-a-demo"
        category="secondary"
        size="large"
        dataAutoId="food_delivery_software_section_5_schedule_demo"
      >
        Schedule a demo
      </ModalTriggerButton>
    </ImageContentLayout>
    <LandingPageRelatedResources slug="last-mile-delivery" dataAutoId="food_delivery_software_section_6" />
    <LoginextEmpowerBrands dataAutoId="food_delivery_software_section_7"/>
    <LandingPagesGtm />
  </>
)

const title = 'LogiNext Food Delivery System - Deliver Fresher'
const description = `LogiNext helps you deliver your food hot and fresh!
                    Order Auto Allocation, Accurate ETA Predictions,Optimized Route Planning, Driver Management and more!`
const url = 'https://www.loginextsolutions.com/food-delivery-software'

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
  FoodDeliverySoftware as default,
  metadata
}
