import { Metadata } from 'next'

import PageCoverSectionContent from '@/components/page-cover-section-content'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeLayout from '@/components/product-informative-layout'
import ProductInformativeContent from '@/components/product-informative-content'
import ConfigurationSection from '@/components/configuration-section'
import MidContentSection from '@/components/mid-content-section'

import { bemClass } from '@/utils'

import coverPageBanner from '/public/next-day-or-same-day-deliveries.webp'
import onTimeParcelDelivery from '/public/on-time-parcel-delivery.webp'
import instantNotificationsAndValidation from '/public/instant-notifications-and-validation.webp'
import followOptimizedRoutesAndOrderSequences from '/public/follow-optimized-routes-and-order-sequences.webp'

import './style.scss'

const blk = 'best-software-for-next-day-or-same-day-delivery-management'

const BestSoftwareForNextDayOrSameDayDeliveryManagement = () => (
  <>
    <div className={bemClass([blk, 'cover-section'])}>
      <ProductInformativeLayout
        image={coverPageBanner}
        imageAlt="Next Day or Same Day Deliveriesy"
        loading="eager"
        hAlign="right"
        vAlign="bottom"
        contentAlign="start"
        className={bemClass([blk, 'cover-container'])}
        dataAutoId="best_software_for_next_day_or_same_day_delivery_management_section_1"
        isCoverSection
      >
        <PageCoverSectionContent
          fluid
          title="Next Day or Same Day Deliveriesy"
          description={`Deliver when and where the customer needs, be it next-day, or the same-day,
          across any distance.`}
          className={bemClass([blk, 'cover-content'])}
          dataAutoId="best_software_for_next_day_or_same_day_delivery_management_section_1_content"
        >
          <ButtonGroup>
            <ModalTriggerButton modalType="talk-to-us" category="default" size="large" dataAutoId="best_software_for_next_day_or_same_day_delivery_management_section_1_ask_for_demo" >
              ask for a demo
            </ModalTriggerButton>
            <ModalTriggerButton modalType="sign-up" category="primary" size="large" dataAutoId="best_software_for_next_day_or_same_day_delivery_management_section_1_try_free" >
              try out free
            </ModalTriggerButton>
          </ButtonGroup>
        </PageCoverSectionContent>
      </ProductInformativeLayout>
    </div>
    <ConfigurationSection
      iconSize="xxxlg"
      iconColor="primary"
      data={[
        {
          id: 'capacity-optimization',
          icon: 'large-home-slider-retail--e-commerce-primary-distribution-capacity-optimization',
          title: 'Capacity Optimization',
          description: 'Better utilize resource and vehicle capacity to reduce logistics movement costs.'
        },
        {
          id: 'easy-loading-and-unloading',
          icon: 'large-mile-live-tracking-fast-sorting-and-loading',
          title: 'Easy Loading and Unloading',
          description: 'Scan and load each unit item in each crate for easy processing and complete visibility.'
        },
        {
          id: 'shorter-turnaround-time',
          icon: 'large-haul-hub-load-balance-reduce-turnaround-time',
          title: 'Shorter Turnaround Time',
          description: 'Optimize routes for fast but safe movement to reduce turnaround time for resources.'
        }
      ]}
      dataAutoId="best_software_for_next_day_or_same_day_delivery_management_section_2_features"
    />
    <MidContentSection
      title="Quick Deliveries for All Customers"
      description={`Fulfill all customer timelines such as preferred time-slot deliveries on the same-day
      or the next-day across state lines with real-time tracking and notifications covering each
      event from dispatch to final handover.`}
      dataAutoId="best_software_for_next_day_or_same_day_delivery_management_section_2_content"
    >
      <ButtonGroup isCenter>
        <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="best_software_for_next_day_or_same_day_delivery_management_section_2_talk_to_us" >
          Talk to us
        </ModalTriggerButton>
        <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="best_software_for_next_day_or_same_day_delivery_management_section_2_free_trail" >
          14 days free trial
        </ModalTriggerButton>
      </ButtonGroup>
    </MidContentSection>

    <ProductInformativeLayout
      hAlign="right"
      image={onTimeParcelDelivery}
      imageAlt="On-time Parcel Delivery"
      widthBg
      dataAutoId="best_software_for_next_day_or_same_day_delivery_management_section_3"
    >
      <ProductInformativeContent
        title="On-time Parcel Delivery"
        description={`Increase customer satisfaction by consistently delivering parcels on-time whether on
        the same-day, overnight (next-day morning), or next business day across geographies.`}
        features={[{
          id: 'optimized-scheduling',
          title: 'Optimized Scheduling',
          description: `Plan the sequence of all shipments precisely to fulfill all parcel deliveries on-time
          factoring in all preferred time-slots, territory or work area related coordinators (or contractors),
          delivery van specifications, etc.`,
        }, {
          id: 'enhanced-route-planning',
          title: 'Enhanced Route Planning',
          description: `Utilize more than a billion location tracking data points to plan optimized routes for
          all shipment movement across state lines and time zones avoiding local traffic to delivery parcels
          on-time, every time.`,
        }]}
        dataAutoId="best_software_for_next_day_or_same_day_delivery_management_section_3_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="best_software_for_next_day_or_same_day_delivery_management_section_3_request_demo" >
            Requst a demo
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="best_software_for_next_day_or_same_day_delivery_management_section_3_free_trail" >
            14 days free trial
          </ModalTriggerButton>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ProductInformativeLayout
      hAlign="left"
      image={instantNotificationsAndValidation}
      imageAlt="Instant Notifications and Validation"
      dataAutoId="best_software_for_next_day_or_same_day_delivery_management_section_4"
    >
      <ProductInformativeContent
        title="Instant Notifications and Validation"
        description={`Keep all stakeholders including customers and local parcel coordinators aware of all
        incoming shipments with instant notifications and eventual delivery validation.`}
        features={[{
          id: 'status-notifications',
          title: 'Status Notifications',
          description: `Communicate each shipment status update such as nearing key
          locations or any delay.`,
        }, {
          id: 'live-tracking',
          title: 'Live Tracking',
          description: `Track each shipment in real-time to help companies be more
          responsive and agile.`,
        }, {
          id: 'delivery-validation',
          title: 'Delivery Validation',
          description: `Ensure process transparency by validating all deliveries
          electronically from the app.`,
        }]}
        dataAutoId="best_software_for_next_day_or_same_day_delivery_management_section_4_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="best_software_for_next_day_or_same_day_delivery_management_section_4_connect_with_expert" >
            Connect with expert
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="best_software_for_next_day_or_same_day_delivery_management_section_4_sign_up_free" >
            sign up for free
          </ModalTriggerButton>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ConfigurationSection
      title="Dynamic Rerouting and ETAs"
      iconAlign="left-top"
      iconColor="white"
      textColor="gray-dark"
      iconType="circular"
      iconBorder="white"
      iconSize="sm"
      iconBackground="primary"
      widthBg
      data={[{
        id: 'live-traffic-analysis',
        icon: 'small-mile-live-tracking-delivery-status-updates',
        title: 'Live Traffic Analysis',
        description: 'Analyze traffic across trips to find out the best route to deliver all parcels as per timelines.'
      }, {
        id: 'estimated-time-of-arrival',
        icon: 'small-on-demand-instant-alerts-and-notifications',
        title: 'Estimated Time of Arrival',
        description: 'Calculate accurate ETAs to maximize on-time deliveries across work areas and territories.'
      }, {
        id: 'pickup-assignments',
        icon: 'small-on-demand-faster-pickups',
        title: 'Pickup Assignments',
        description: 'Auto-assign pickup requests to the right associate and accordingly adjust their routes.'
      }, {
        id: 'intelligent-rerouting',
        icon: 'small-mile-live-tracking-dynamic-rerouting',
        title: 'Intelligent Rerouting',
        description: 'Reroute trips mid-journey in case of long delays, pickup requests, customer requests, etc.'
      }, {
        id: 'accurate-addressing',
        icon: 'small-mile-live-tracking-instant-delivery-validation',
        title: 'Accurate Addressing',
        description: 'Avoid delays caused by searching for wrong addresses by fixing them early utilizing machine learning.'
      }, {
        id: 'eta-updates',
        icon: 'small-mile-live-tracking-dynamically-updated-etas',
        title: 'ETA Updates',
        description: 'Send instant ETA updates in case of any delay or rerouting to sustain clear communication.'
      }]}
      dataAutoId="best_software_for_next_day_or_same_day_delivery_management_section_5"
    />
    <ProductInformativeLayout
      hAlign="right"
      image={followOptimizedRoutesAndOrderSequences}
      imageAlt="Follow Optimized Routes and Order Sequences"
      dataAutoId="best_software_for_next_day_or_same_day_delivery_management_section_6"
    >
      <ProductInformativeContent
        title="Follow Optimized Routes and Order Sequences"
        description={`Delivery associates can follow clear and optimized routes and order sequences
        (or schedules) from their app with easy-to-understand directions and voice-enabled interaction
        capabilities.`}
        features={[]}
        dataAutoId="best_software_for_next_day_or_same_day_delivery_management_section_6_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="best_software_for_next_day_or_same_day_delivery_management_section_6_request_demo" >
            Request a demo
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="best_software_for_next_day_or_same_day_delivery_management_section_6_free_trail" >
            14 days free trial
          </ModalTriggerButton>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
  </>
)

const title = 'Retail & eCommerce | Same Day Delivery Management Software'
const description = 'LogiNext offers a premium delivery management software that helps businesses with same day or next day deliveries to its customers. Talk to an expert now!'
const url = 'https://www.loginextsolutions.com/industries/retail-and-ecommerce/best-software-for-next-day-or-same-day-delivery-management'

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
    card: 'summary'
  },
  metadataBase: new URL('https://www.loginextsolutions.com'),
}

export {
  BestSoftwareForNextDayOrSameDayDeliveryManagement as default,
  metadata
}

