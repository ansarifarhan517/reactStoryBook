import { Metadata } from 'next'

import Image from 'next/image'

import PageCoverSection from '@/components/page-cover-section'
import PageCoverSectionContent from '@/components/page-cover-section-content'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeLayout from '@/components/product-informative-layout'
import ProductInformativeContent from '@/components/product-informative-content'
import ConfigurationSection from '@/components/configuration-section'
import Container from '@/components/container'
import MidContentSection from '@/components/mid-content-section'
import Parallax from '@/components/parallax'

import { bemClass } from '@/utils'

import pageCoverBg from '/public/software-for-restaurant-supplies-and-distribution.svg'
import coverPageBanner from '/public/deliver-supplies-to-restaurants-faster.webp'
import makeMoreDeliveriesWithLesserResources from '/public/make-more-deliveries-with-lesser-resources.webp'
import trackAllMovingResourcesLive from '/public/track-all-moving-resources-live.webp'

import './style.scss'

const blk = 'software-for-restaurant-supplies-and-distribution'

const SoftwareForRestaurantSuppliesAndDistribution = () => (
  <>
    <PageCoverSection
      image={pageCoverBg}
      imageAlt="Deliver supplies to restaurants faster"
      className={bemClass([blk, 'cover-section'])}
      dataAutoId="software_for_restaurant_supplies_and_distribution_section_1"
    >
      <>
        <div className={bemClass([blk, 'cover-bottom'])} />
        <Container fluid className={bemClass([blk, 'container'])}>
          <PageCoverSectionContent
            title="Deliver supplies to restaurants faster"
            description={`Quick and full-service restaurants work on a very-lean logistics system
            depending highly on fresh produce. Make fresh deliveries on-time, every time.`}
            fluid
            className={bemClass([blk, 'cover-content'])}
            dataAutoId="software_for_restaurant_supplies_and_distribution_section_1_content"
          >
            <ButtonGroup>
              <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="software_for_restaurant_supplies_and_distribution_section_1_ask_for_demo">
                Ask for a demo
              </ModalTriggerButton>
              <ModalTriggerButton modalType="sign-up" category="primary" size="large" dataAutoId="software_for_restaurant_supplies_and_distribution_section_1_try_free">
                Try out free
              </ModalTriggerButton>
            </ButtonGroup>
          </PageCoverSectionContent>
          <Parallax offset={50} className={bemClass([blk, 'cover-image'])}>
            <Image
              src={coverPageBanner}
              alt="Deliver supplies to restaurants faster"
              className={bemClass([blk, 'image'])}
              loading="eager"
              data-auto-id="software_for_restaurant_supplies_and_distribution_section_1_image"
            />
          </Parallax>
        </Container>
      </>
    </PageCoverSection>
    <MidContentSection
      title="Control all areas of your food movement"
      description={`Fresh food such as meat, bread, pulses, spices, and more require a highly visible
      and controlled logistics set-up. Fast and proper deliveries along the preferred
      time-slots for receiving them is very important.`}
      className={bemClass([blk, 'mid-section'])}
      dataAutoId="software_for_restaurant_supplies_and_distribution_section_2"
    >
      <ButtonGroup isCenter>
        <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="software_for_restaurant_supplies_and_distribution_section_2_talk_to_us">
          Talk to us
        </ModalTriggerButton>
        <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="software_for_restaurant_supplies_and_distribution_section_2_free_trail">
          14 days free trial
        </ModalTriggerButton>
      </ButtonGroup>
    </MidContentSection>
    <ConfigurationSection
      iconSize="xxxlg"
      iconDivider
      hoverEffect
      data={[
        {
          id: 'sustain-food-quality',
          icon: 'large-home-slider-retail--e-commerce-store-to-customer-movement',
          title: 'Sustain food quality',
          description: 'Ensure that the quality of each food item is uncompromised all along the trip.'
        },
        {
          id: 'comply-with-all-slas',
          icon: 'large-home-slider-logistics--transportation-rate-and-contract-management',
          title: 'Comply with all SLAs',
          description: 'Follow all service level agreements as your vehicles move food to destinations.'
        },
        {
          id: 'Deliver supplies on-time',
          icon: 'large-home-slider-retail--e-commerce-same-day-next-day-delivery',
          title: 'Deliver supplies on-time',
          description: 'Get the food supplies to your clients on-time with perfect delivery validation.'
        }
      ]}
      dataAutoId="software_for_restaurant_supplies_and_distribution_section_2_features"
    />
    <ProductInformativeLayout
      hAlign="left"
      image={makeMoreDeliveriesWithLesserResources}
      imageAlt="Make more deliveries with lesser resources"
      className={bemClass([blk, 'make-more-deliveries'])}
      dataAutoId="software_for_restaurant_supplies_and_distribution_section_3"
    >
      <ProductInformativeContent
        title="Make more deliveries with lesser resources"
        description={`Use specific vehicles with drivers having the right skill-sets.
        This ideal match boosts the efficiency and smoothness of the entire delivery
        process.`}
        features={[{
          id: 'deliver-with-the-right-vehicle-and-driver',
          title: 'Deliver with the right vehicle and driver',
          description: `Get the right vehicle with the right driver to carry specific
          food products. Get them on the right route with the ideal delivery schedule
          avoiding traffic to reach destinations on-time. Ensure the delivery associate
          or driver know how to handle the food right.`,
        }, {
          id: 'reach-more-restaurants-in-quicktime',
          title: 'Reach more restaurants in quicktime',
          description: `Use available capacity and time of the resources to the fullest,
          delivering well-preserved food to more restaurants in each trip. Work-in the
          preferred delivery time-windows of each restaurant as you plan schedules and routes.`,
        }]}
        dataAutoId="software_for_restaurant_supplies_and_distribution_section_3_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="software_for_restaurant_supplies_and_distribution_section_3_talk_to_us">
            Talk to us
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="software_for_restaurant_supplies_and_distribution_section_3_free_trail">
            14 days free trial
          </ModalTriggerButton>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ProductInformativeLayout
      hAlign="right"
      image={trackAllMovingResourcesLive}
      imageAlt="Track all moving resources live"
      dataAutoId="software_for_restaurant_supplies_and_distribution_section_4"
    >
      <ProductInformativeContent
        title="Track all moving resources live"
        description={`Increase the responsiveness and agility of your ground-movement as
        you deliver to restaurants. Track the movement of all vehicles in real-time.`}
        features={[{
          id: 'know-exactly-where-the-orders-have-reached',
          title: 'Know exactly where the orders have reached',
          description: `Watch all moving resources in a single dashboard and react to on-ground
          events in time. Cut down turnaround times within your trips. Chat with your delivery
          associates while they move in their trips.`,
        }, {
          id: 'get-real-time-notifications-and-alerts',
          title: 'Get real-time notifications and alerts',
          description: `Receive live notifications and alerts wherever you are, whenever there
          is a delay, deviation from delivery route, erratic driving, delivery statuses changing
          from scheduled to complete or incomplete, and more.`,
        }]}
        dataAutoId="software_for_restaurant_supplies_and_distribution_section_4"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="software_for_restaurant_supplies_and_distribution_section_4_connect_with_expert">
            connect with expert
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="software_for_restaurant_supplies_and_distribution_section_4_sign_up_free">
            sign up for free
          </ModalTriggerButton>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
  </>
)

const title = 'Food and Beverage | Distribution Management Software '
const description = 'Ensure quick, on-time, everytime and fresh deliveries to manage restaurant supplies with the best distribution management software from LogiNext. Contact us now!'
const url = 'https://www.loginextsolutions.com/industries/food-and-beverages/software-for-restaurant-supplies-and-distribution'

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
  SoftwareForRestaurantSuppliesAndDistribution as default,
  metadata
}

