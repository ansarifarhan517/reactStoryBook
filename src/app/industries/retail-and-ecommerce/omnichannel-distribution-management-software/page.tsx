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

import pageCoverBg from '/public/omnichannel-distribution-management-software.svg'
import coverPageBanner from '/public/first-mile-pickup-and-optimization.webp'
import planPerfectDeliverySchedulesAndRoutes from '/public/plan-perfect-delivery-schedules-and-routes.webp'
import ensureSmoothLastMileDeliveryMovement from '/public/ensure-smooth-last-mile-delivery-movement.webp'

import './style.scss'

const blk = 'omnichannel-distribution-management-software'

const OmnichannelDistributionManagementSoftware = () => (
  <>
    <PageCoverSection
      image={pageCoverBg}
      imageAlt="Complete Omnichannel Delivery Experience"
      className={bemClass([blk, 'cover-section'])}
      dataAutoId="omnichannel_distribution_management_software_section_1"
    >
      <>
        <div className={bemClass([blk, 'cover-bottom'])} />
        <Container fluid className={bemClass([blk, 'container'])}>
          <PageCoverSectionContent
            title="Complete Omnichannel Delivery Experience"
            description={`Take the best of both retail and e-commerce and give your end-customers
            the complete omnichannel delivery experience.`}
            fluid
            className={bemClass([blk, 'cover-content'])}
            dataAutoId="omnichannel_distribution_management_software_section_1_content"
          >
            <ButtonGroup>
              <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="omnichannel_distribution_management_software_section_1_ask_for_demo">
                Ask for a demo
              </ModalTriggerButton>
              <ModalTriggerButton modalType="sign-up" category="primary" size="large" dataAutoId="omnichannel_distribution_management_software_section_1_try_free">
                Try out free
              </ModalTriggerButton>
            </ButtonGroup>
          </PageCoverSectionContent>
          <Parallax offset={50} className={bemClass([blk, 'cover-image'])}>
            <Image
              src={coverPageBanner}
              alt="First Mile Pickup and Optimization"
              className={bemClass([blk, 'image'])}
              loading="eager"
            />
          </Parallax>
        </Container>
      </>
    </PageCoverSection>
    <MidContentSection
      title="Know your customer better"
      description={`Give each customer the delivery experience they desire. Match the delivery timelines
      and style to each customers requirements. Create a lasting impression while delivering
      orders to boost overall satisfaction.`}
      className={bemClass([blk, 'mid-section'])}
      dataAutoId="omnichannel_distribution_management_software_section_2"
    >
      <ButtonGroup isCenter>
        <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="omnichannel_distribution_management_software_section_2_talk_us" >
          Talk to us
        </ModalTriggerButton>
        <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="omnichannel_distribution_management_software_section_2_free_trail">
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
          id: 'address-level-specifications',
          icon: 'large-home-slider-consumer-packaged-goods-shipment-and-unit-level-tracking',
          title: 'Address Level Specifications',
          description: 'Customize the delivery style, like special directives, to each customer address.'
        },
        {
          id: 'preferred-time-delivery',
          icon: 'large-mile-route-planning-and-optimization-on-time-deliveries',
          title: 'Preferred Time Delivery',
          description: 'Capture delivery time-windows for each address, whether its delivery at home or work.'
        },
        {
          id: 'retain-more-customers',
          icon: 'large-home-slider-retail--e-commerce-store-to-customer-movement',
          title: 'Retain More Customers',
          description: 'Give special treatment to each customer and ensure they keep coming back.'
        }
      ]}
      dataAutoId="omnichannel_distribution_management_software_section_3"
    />
    <ProductInformativeLayout
      hAlign="left"
      image={planPerfectDeliverySchedulesAndRoutes}
      imageAlt="Plan perfect delivery schedules and routes"
      className={bemClass([blk, 'plan-perfect-delivery-schedules-and-routes'])}
      dataAutoId="omnichannel_distribution_management_software_section_4"
    >
      <ProductInformativeContent
        title="Plan perfect delivery schedules and routes"
        description={`Main factor for success in the omnichannel marketplace is having the perfect
        delivery scheduling and routing technology at your disposal.`}
        features={[{
          id: 'promise-on-time-delivery-and-then-do-it',
          title: 'Promise on-time delivery and then do it',
          description: `Fulfill all on-time delivery promises by ensuring that your
          delivery associates move along the shortest routes without traffic, reaching more
          customers per trips with perfectly planned schedules.`,
        }, {
          id: 'give-complete-delivery-movement-visibility',
          title: 'Give complete delivery movement visibility',
          description: `Track all on-ground delivery movement and tell the customer exactly where
          their order has reached in a real-time map interface. Giving assurance that their order
          would reach them soon boost satisfaction.`,
        }]}
        dataAutoId="omnichannel_distribution_management_software_section_4_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="omnichannel_distribution_management_software_section_4_request_demo">
            Requst a demo
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="omnichannel_distribution_management_software_section_4_free_trail">
            14 days free trial
          </ModalTriggerButton>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <MidContentSection
      title="Same / Next day delivery"
      description={`Customers now expect same or next day delivery much more often. Retail and e-commerce
      companies must upgrade their last mile delivery movement to ensure much shorter lead
      times and fast pickup and delivery turnarounds.`}
      className={bemClass([blk, 'mid-section'])}
      dataAutoId="omnichannel_distribution_management_software_section_5"
    >
      <ButtonGroup isCenter>
        <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="omnichannel_distribution_management_software_section_5_request_demo">
          Request a demo
        </ModalTriggerButton>
        <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="omnichannel_distribution_management_software_section_5_free_trail">
          14 days free trial
        </ModalTriggerButton>
      </ButtonGroup>
    </MidContentSection>

    <ConfigurationSection
      iconSize="xxxlg"
      hoverEffect
      data={[
        {
          id: 'automated-pickup',
          icon: 'large-mile-mobile-auto-pickup-allocation',
          title: 'Automated pickup',
          description: 'Instantly assign the right delivery associate the right pickup to cut down turnaround time.'
        },
        {
          id: 'fast-sorting-and-dispatch',
          icon: 'large-mile-live-tracking-fast-sorting-and-loading',
          title: 'Fast sorting & dispatch',
          description: 'Continuously scan items at warehouse to quickly sort, pick, & dispatch orders'
        },
        {
          id: 'delivery-schedule-planning',
          icon: 'large-mile-delivery-schedule-planning-auto-allocation-and-dispatch',
          title: 'Delivery schedule planning',
          description: 'Plan schedules and routes which cover more successful order deliveries in each trip.'
        }
      ]}
      dataAutoId="omnichannel_distribution_management_software_section_5_features"
    />
    <ProductInformativeLayout
      hAlign="right"
      image={ensureSmoothLastMileDeliveryMovement}
      imageAlt="Ensure smooth last mile delivery movement"
      className={bemClass([blk, 'ensure-smooth-last-mile-delivery-movement'])}
      dataAutoId="omnichannel_distribution_management_software_section_6"
    >
      <ProductInformativeContent
        title="Ensure smooth last mile delivery movement"
        description={`Optimize the entire last mile delivery process to give more and more
        end-customers faster deliveries consistently, even through peak-sales seasons or random
        sale spikes.`}
        features={[{
          id: 'optimize-delivery-associate-and-vehicle-capacity',
          title: 'Optimize delivery associate and vehicle capacity',
          description: `Make the most out of the available delivery associates time and vehicle
          capacity by planning schedules factoring ideal load balancing across shipments.
          Cut down on idle or over capacity instances.`,
        }, {
          id: 'gain-more-ccontrol-over-your-last-mile-deliveries',
          title: 'Gain more control over your last mile deliveries',
          description: `Fill in your last mile movement with agility and responsiveness.
          Track all orders in a single dashboard with instant notifications to the manager
          and customers when a delivery is near its destination or there is a delay.`,
        }]}
        dataAutoId="omnichannel_distribution_management_software_section_6_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="omnichannel_distribution_management_software_section_6_connect_with_expert" >
            Connect with expert
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="omnichannel_distribution_management_software_section_6_sign_up_free">
            sign up for free
          </ModalTriggerButton>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
  </>
)

const title = 'Retail & eCommerce | Omnichannel Delivery Experience'
const description = 'Give your end customer the complete omnichannel experience that will create a long lasting experience and boost your deliveries. Schedule a demo with LogiNext!'
const url = 'https://www.loginextsolutions.com/industries/retail-and-ecommerce/omnichannel-distribution-management-software'

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
  OmnichannelDistributionManagementSoftware as default,
  metadata
}

