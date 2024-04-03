import { Metadata } from 'next'
import dynamic from 'next/dynamic'

import PageCoverSectionContent from '@/components/page-cover-section-content'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeLayout from '@/components/product-informative-layout'
import ProductInformativeContent from '@/components/product-informative-content'
import Button from '@/components/button'
import GoToSignUpPage from '@/components/go-to-sign-up-page'
import ConfigurationSection from '@/components/configuration-section'
import Container from '@/components/container'
import MidContentSection from '@/components/mid-content-section'
import Text from '@/components/text'

import { bemClass } from '@/utils'

import coverPageBanner from '/public/on-demand-pickup-and-delivery.webp'
import dynamicEtaCalculation from '/public/dynamic-eta-calculation.webp'
import completeProcessVisibility from '/public/complete-process-visibility.webp'

import './style.scss'

const Icon = dynamic(() => import('@/components/icon'), {
  ssr: false
})

const blk = 'sameday-ondemand-delivery-optimization-software'

const SamedayOnDemandDeliveryOptimizationSoftware = () => (
  <>
    <ProductInformativeLayout
      image={coverPageBanner}
      imageAlt="On-Demand Pickup and Delivery"
      loading="eager"
      hAlign="right"
      vAlign="bottom"
      contentAlign="start"
      className={bemClass([blk, 'cover-section'])}
      dataAutoId="sameday_ondemand_delivery_optimization_software_section_1"
      isCoverSection
    >
      <PageCoverSectionContent
        fluid
        title="On-Demand Pickup and Delivery"
        description={`Automatically assign pickups to nearest delivery person,
        optimize routes, and ensure on-time handovers.`}
        className={bemClass([blk, 'cover-content'])}
        dataAutoId="sameday_ondemand_delivery_optimization_software_section_1_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="sameday_ondemand_delivery_optimization_software_section_1_request_demo">
            Request a demo
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="primary" size="large" dataAutoId="sameday_ondemand_delivery_optimization_software_section_1_try_free">
              try out free
          </ModalTriggerButton>
        </ButtonGroup>
      </PageCoverSectionContent>
    </ProductInformativeLayout>
    <MidContentSection
      title="Auto-Allocation of Pickup Requests"
      description={`Capture each pickup request, identify the nearest delivery person from the pickup
      origin point, assess their capacity and timelines, automatically assign the pickup
      request to the best-suited delivery person.`}
      className={bemClass([blk, 'mid-section'])}
      dataAutoId="sameday_ondemand_delivery_optimization_software_section_2"
    />
    <Container className={bemClass([blk, 'card-holder'])}>
      <div className={bemClass([blk, 'card'])}>
        <Icon
          name="large-field-live-tracking-field-simple-web--app-map-interface"
          size="xxxxlg"
          color="primary"
          dataAutoId="sameday_ondemand_delivery_optimization_software_section_2_icon_1"
        />
        <div>
          <Text tag="strong" typography="l" className={bemClass([blk, 'card-text'])} dataAutoId="sameday_ondemand_delivery_optimization_software_section_2_title_1">
            Movement Tracking
          </Text>
          <Text tag="p" typography="s" dataAutoId="sameday_ondemand_delivery_optimization_software_section_2_description_1">
            Live tracking of all on-ground associates for perfect pickup-delivery person match.
          </Text>
        </div>
      </div>
      <div className={bemClass([blk, 'card'])}>
        <Icon
          name="large-mile-delivery-schedule-planning-territory-mapping"
          size="xxxxlg"
          color="primary"
          dataAutoId="sameday_ondemand_delivery_optimization_software_section_2_icon_2"
        />
        <div>
          <Text tag="strong" typography="l" className={bemClass([blk, 'card-text'])} dataAutoId="sameday_ondemand_delivery_optimization_software_section_2_title_2">
            Accurate Addressing
          </Text>
          <Text tag="p" typography="s" dataAutoId="sameday_ondemand_delivery_optimization_software_section_2_description_2">
            Validate all customer addresses to avoid delays while searching for any location.
          </Text>
        </div>
      </div>
    </Container>
    <ModalTriggerButton
      modalType="talk-to-us"
      category="primary"
      outline
      className={bemClass([blk, 'learn-more'])}
      dataAutoId="sameday_ondemand_delivery_optimization_software_section_2_learn_more"
    >
        Learn more
    </ModalTriggerButton>
    <ConfigurationSection
      iconSize="xxxlg"
      widthBg
      data={[
        {
          id: 'easy-allocation',
          icon: 'large-field-automated-allocation-automated-dispatch',
          title: 'Easy Allocation',
          description: 'Assign orders to the resource best suited to deliver them efficiently and on-time.'
        },
        {
          id: 'orders-sequencing',
          icon: 'large-field-automated-allocation-field-agent-empowerment',
          title: 'Orders Sequencing',
          description: 'Optimize order sequencing for timely deliveries along with random pickup requests.'
        },
        {
          id: 'live-tracking',
          icon: 'large-field-live-tracking-field-simple-web--app-map-interface',
          title: 'Live Tracking',
          description: 'Track all delivery movement in real-time with instant notifications and updates.'
        },
        {
          id: 'dynamic-etas',
          icon: 'large-field-mobile-dynamic-eta-calculation',
          title: 'Dynamic ETAs',
          description: 'Calculate accurate estimated time of arrivals for deliveries with live-traffic analytics.'
        },
        {
          id: 'dynamic-rerouting',
          icon: 'large-field-web-choose-best-planned-trip',
          title: 'Dynamic Rerouting',
          description: 'Reroute on-ground delivery associates without delaying current pickups or deliveries.'
        },
        {
          id: 'delivery-validation',
          icon: 'large-mile-delivery-validation-instant-delivery-status-capture',
          title: 'Delivery Validation',
          description: 'Electronically validate all delivery handovers with instant central-system syncing.'
        }
      ]}
      dataAutoId="sameday_ondemand_delivery_optimization_software_section_3"
    />
    <ProductInformativeLayout
      hAlign="right"
      image={dynamicEtaCalculation}
      imageAlt="Dynamic ETA Calculation"
      dataAutoId="sameday_ondemand_delivery_optimization_software_section_4"
    >
      <ProductInformativeContent
        title="Dynamic ETA Calculation"
        description={`Precise ETAs are calculated and communicated with customers and other
        stakeholders considering multiple factors such as live-traffic statuses and priority
        timeslots`}
        features={[{
          id: 'live-traffic-consideration',
          title: 'Live-Traffic Consideration',
          description: `Analyze live traffic patterns in all territories to identify fastest routes
          for current deliverables, reroute as and when required, and to assess the most accurate ETA
          for each pickup and delivery.`,
        }, {
          id: 'instant-notifications',
          title: 'Instant Notifications',
          description: `Notify all stakeholders including customers, coordinators, supervisors, and
          managers about the ETAs of incoming pickups or deliveries so that they don\'t have to wonder
          about any such arrival.`,
        }]}
        dataAutoId="sameday_ondemand_delivery_optimization_software_section_4_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="sameday_ondemand_delivery_optimization_software_section_4_talk_to_us">
            Talk to us
          </ModalTriggerButton>
          <GoToSignUpPage>
            <Button category="default" asLink href="/pricing/signup" outline dataAutoId="sameday_ondemand_delivery_optimization_software_section_4_free_trail">
              14 days free trial
            </Button>
          </GoToSignUpPage>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ProductInformativeLayout
      hAlign="left"
      image={completeProcessVisibility}
      imageAlt="Complete Process Visibility"
      dataAutoId="sameday_ondemand_delivery_optimization_software_section_5"
    >
      <ProductInformativeContent
        title="Complete Process Visibility"
        description={`Ensure complete process visibility from allocation to fulfillment with live
        tracking of delivery associates and complete information about every incoming request.`}
        features={[{
          id: 'tracking-and-updates',
          title: 'Tracking and Updates',
          description: `Visualize all delivery associate movement in an interactive map interface with
          live updates about any delay or disruption, ensuring responsiveness and agility in operations
          leading to proper customer support.`,
        }, {
          id: 'voice-enabled-routing',
          title: 'Voice-Enabled Routing',
          description: `Managers and delivery associates alike can interact with their system using
          just their voice to know all subsequent orders, follow the optimized routes, communicate with
          the end-customers, etc.`,
        }]}
        dataAutoId="sameday_ondemand_delivery_optimization_software_section_5_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="sameday_ondemand_delivery_optimization_software_section_5_connect_with_expert">
            Connect with expert
          </ModalTriggerButton>
          <GoToSignUpPage>
            <Button category="default" asLink href="/pricing/signup" outline dataAutoId="sameday_ondemand_delivery_optimization_software_section_5_sign_up_free">
              Sign up for free
            </Button>
          </GoToSignUpPage>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
  </>
)

const title = 'Courier Express Parcel | On Demand Pickup and Delivery'
const description = 'Automate and optimize for on demand pickup and delivery with auto assignment of pickup request from the nearest delivery associate. Call us for a demo now!'
const url = 'https://www.loginextsolutions.com/industries/couriers-express-parcels/sameday-ondemand-delivery-optimization-software'

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
  SamedayOnDemandDeliveryOptimizationSoftware as default,
  metadata
}
