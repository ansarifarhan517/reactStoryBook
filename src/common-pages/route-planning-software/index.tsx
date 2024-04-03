import Button from '@/components/button'
import AppStoreButton from '@/components/app-store-button'
import PageCoverSectionContent from '@/components/page-cover-section-content'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeLayout from '@/components/product-informative-layout'
import ProductInformativeContent from '@/components/product-informative-content'
import MidContentSection from '@/components/mid-content-section'
import ConfigurationSection from '@/components/configuration-section'
import GoToSignUpPage from '@/components/go-to-sign-up-page'

import { bemClass } from '@/utils'

import coverPageBanner from '/public/route-planning-software.webp'
import highlyInteractiveVerySimpleMaps from '/public/highly-interactive-very-simple-maps.webp'
import customizedForYourBusinessModel from '/public/customized-for-your-business-model.webp'
import saveCostsWithKeepingCustomerCentricPlans from '/public/save-costs-with-keeping-customer-centric-plans.webp'
import perfectInHandRoutingAndOptimizationApp from '/public/perfect-in-hand-routing-and-optimization-app.webp'

import './style.scss'

const blk = 'route-planning-software'

const featureList = [{
  id: 'first-mile-and-last-mile-delivery',
  icon: 'small-mile-route-planning-and-optimization-first-mile-and-last-mile-delivery',
  label: 'First Mile and Last Mile Delivery'
}, {
  id: 'on-demand-same-day-next-day-delivery',
  icon: 'same-day-next-day-delivery',
  label: 'On-Demand, Same Day/Next Day Delivery'
}, {
  id: 'white-glove-and-large-goods-delivery',
  icon: 'small-mile-route-planning-and-optimization-white-glove-and-large-goods-delivery',
  label: 'White Glove and Large Goods Delivery'
}, {
  id: 'retail-and-cpg-distribution',
  icon: 'small-mile-route-planning-and-optimization-retail-and-cpg-distribution',
  label: 'Retail and CPG Distribution',
}, {
  id: 'b2c-and-home-deliveries',
  icon: 'small-mile-route-planning-and-optimization-b2c-and-home-deliveries',
  label: 'B2C and Home Deliveries',
}, {
  id: 'omnichannel-fulfillment',
  icon: 'small-mile-route-planning-and-optimization-omnichannel-fulfillment',
  label: 'Omnichannel Fulfillment',
}]

const RoutePlanningSoftware = () => (
  <>
    <div className={blk} data-auto-id="route_planning_software_section_1">
      <ProductInformativeLayout
        image={coverPageBanner}
        imageAlt="Route planning software"
        loading="eager"
        hAlign="right"
        vAlign="bottom"
        contentAlign="start"
        dataAutoId="route_planning_software_section_1_content_container"
        isCoverSection
      >
        <PageCoverSectionContent
          fluid
          title="Route Planning and Optimization"
          description={`Plan faster and shorter routes optimized for customer\’s preferred
          time windows, driver\’s work hours and geographic preferences, vehicle\’s capacity
          constraints and local traffic.`}
          className={bemClass([blk, 'cover-content'])}
          dataAutoId="route_planning_software_section_1_content"
        >
          <ButtonGroup>
            <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="route_planning_software_section_1_ask_for_demo">
              Ask for a demo
            </ModalTriggerButton>
            <GoToSignUpPage>
              <Button category="primary" size="large" asLink href="/pricing/signup" dataAutoId="route_planning_software_section_1_go_to_signup" >
                Try out free
              </Button>
            </GoToSignUpPage>
          </ButtonGroup>
        </PageCoverSectionContent>
      </ProductInformativeLayout>
      <ConfigurationSection
        iconAlign="left-top"
        iconColor="white"
        textColor="white"
        iconType="circular"
        iconBorder="white"
        iconSize="sm"
        columns="4"
        data={[{
          id: 'shorter-routes',
          icon: 'small-mile-route-planning-and-optimization-shorter-routes',
          title: 'Shorter Routes',
          description: 'Identify the shortest route for each delivery for lesser turnaround times.'
        }, {
          id: 'avoid-traffic',
          icon: 'small-mile-route-planning-and-optimization-avoid-traffic',
          title: 'Avoid Traffic',
          description: 'Adjust for live-traffic conditions even along remote routes or locations.'
        }, {
          id: 'accurate-addresses',
          icon: 'small-mile-route-planning-and-optimization-accurate-addresses',
          title: 'Accurate Addresses',
          description: 'Cut down time spent searching for wrong addresses by fixing them early.'
        }, {
          id: 'dynamic-rerouting',
          icon: 'small-mile-route-planning-and-optimization-dynamic-rerouting',
          title: 'Dynamic Rerouting',
          description: 'Reroute trips whenever required to compensate for delays or new orders.'
        }]}
        dataAutoId="route_planning_software_section_1_features"
      />
    </div>
    <MidContentSection
      title="Managing Customer Expectations"
      description={`Take charge to better manage customer or client expectations by ensuring
      that all delivery timelines are met along with clear communication about
      the movement of the shipment towards the destination.`}
      className={bemClass([blk, 'mid-section'])}
      dataAutoId="route_planning_software_section_2"
    >
      <ModalTriggerButton modalType="talk-to-us" category="primary" outline dataAutoId="route_planning_software_section_2_get_in_touch">
          Get in touch
      </ModalTriggerButton>
    </MidContentSection>
    <ConfigurationSection
      iconSize="xxxlg"
      data={[
        {
          id: 'live-tracking',
          icon: 'large-mile-route-planning-and-optimization-live-tracking',
          title: 'Live Tracking',
          description: 'Track each delivery associate as they move along the planned route.'
        },
        {
          id: 'dynamic-eta-calculation',
          icon: 'large-mile-route-planning-and-optimization-dynamic-eta-calculation',
          title: 'Dynamic ETA Calculation',
          description: 'Update ETAs dynamically after each completed delivery in the route.'
        },
        {
          id: 'on-time-deliveries',
          icon: 'large-mile-route-planning-and-optimization-on-time-deliveries',
          title: 'On-time Deliveries',
          description: 'Adjust routes for preferred time deliveries and local traffic to deliver on-time.'
        }
      ]}
      dataAutoId="route_planning_software_section_2_features"
    />
    <ProductInformativeLayout
      hAlign="left"
      image={customizedForYourBusinessModel}
      imageAlt="Customized for your business model"
      dataAutoId="route_planning_software_section_3_content_container"
    >
      <ProductInformativeContent
        title="Customized for your business model"
        description={`There is no such thing as one-size-fits-all in your industry
        That\'s why our route planning and optimization comes pre-configured to your use-case.`}
        features={[{
          id: 'highly-interactive-feature-list',
          isFeatureList: true,
          list: featureList
        }]}
        dataAutoId="route_planning_software_section_3_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="route_planning_software_section_3_talk_to_us">
            Talk to us
          </ModalTriggerButton>
          <GoToSignUpPage>
            <Button category="default" asLink href="/pricing/signup" outline dataAutoId="route_planning_software_section_3_try_it_now">
              Try it out Now
            </Button>
          </GoToSignUpPage>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ProductInformativeLayout
      hAlign="right"
      image={highlyInteractiveVerySimpleMaps}
      imageAlt="Highly interactive, yet very simple maps"
      dataAutoId="route_planning_software_section_4"
    >
      <ProductInformativeContent
        title="Highly interactive, yet very simple maps"
        description={`Plan and view perfect routes with multiple stop points within a map,
        in seconds with no absolutely no lag. Simple to understand and easy to integrate with
        any localized mapping service with high accuracy.`}
        features={[{
          id: 'visual-territory-mapping',
          title: 'Visual territory mapping',
          description: 'Visualize all your territories in an attractive clustered view clearly defining geocoded or geofenced areas shown directly or in a heat map.',
        }, {
          id: 'multilingual-support-anywhere',
          title: 'Multilingual support, anywhere',
          description: 'Let your delivery associates and managers view and operate the system in their own language for better understanding and productivity.',
        }]}
        dataAutoId="route_planning_software_section_4_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="route_planning_software_section_4_request_demo" >
            Request a demo
          </ModalTriggerButton>
          <GoToSignUpPage>
            <Button category="default" asLink href="/pricing/signup" outline dataAutoId="route_planning_software_section_4_sign_up">
              Sign up for  trial
            </Button>
          </GoToSignUpPage>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ProductInformativeLayout
      hAlign="left"
      image={saveCostsWithKeepingCustomerCentricPlans}
      imageAlt="Save costs with keeping customer-centric plans"
      widthBg
      dataAutoId="route_planning_software_section_5"
    >
      <ProductInformativeContent
        title="Save costs with keeping customer-centric plans"
        description={`Boost margins by lowering costs with high resource and
        capacity utilization; while increasing profits with on-time deliveries
        and high customer satisfaction.`}
        features={[{
          id: 'make-deliveries-when-customers-want',
          title: 'Make deliveries when customers want',
          description: 'Deliver shipments and orders within the timeframe chosen by the customer. Easily plan preferred time slots for multiple deliveries within a single route with no delays.',
        },{
          id: 'dynamically-update-and-communicate-etas',
          title: 'Dynamically update and communicate ETAs',
          description: `Deliver shipments/orders on-time or recalculate ETAs in case of delay
          and instantly alert the customer. Reduce instances of missed attempts with such clear
          communication.`,
        }]}
        dataAutoId="route_planning_software_section_5_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="route_planning_software_section_5_connect_with_expert">
            Connect with expert
          </ModalTriggerButton>
          <Button
            category="default"
            outline
            asLink
            href="https://www.loginextsolutions.com/blog/ultimate-guide-to-route-optimization"
            dataAutoId="route_planning_software_section_5_read_blog"
          >
            Read blog
          </Button>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ProductInformativeLayout
      image={perfectInHandRoutingAndOptimizationApp}
      imageAlt="Perfect In-hand Routing and Optimization App"
      dataAutoId="route_planning_software_section_6"
    >
      <ProductInformativeContent
        title="Perfect In-hand Routing and Optimization App"
        description={`Drivers can easily follow planned routes and schedules from within their
        apps using an interactive map interface and an intuitive design for two-way communication
        with managers.`}
        features={[]}
        dataAutoId="route_planning_software_section_6_content"
      >
        <AppStoreButton category="secondary" align="hozironatal" dataAutoId="route_planning_software_section_6_stores" />
      </ProductInformativeContent>
    </ProductInformativeLayout>
  </>
)

export default RoutePlanningSoftware
