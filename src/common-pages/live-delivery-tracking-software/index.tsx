import PageCoverSectionContent from '@/components/page-cover-section-content'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeLayout from '@/components/product-informative-layout'
import ProductInformativeContent from '@/components/product-informative-content'
import Button from '@/components/button'
import ConfigurationSection from '@/components/configuration-section'
import MidContentSection from '@/components/mid-content-section'
import GoToSignUpPage from '@/components/go-to-sign-up-page'

import { bemClass } from '@/utils'

import coverPageBanner from '/public/live-delivery-tracking-and-analysis.webp'
import areYourShipmentsStuck from '/public/are-your-shipments-stuck.webp'
import instantNotificationsAndAlerts from '/public/instant-notifications-and-alerts.webp'

import './style.scss'

const blk = 'live-delivery-tracking-software'

const LiveDeliveryTrackingSoftware = () => (
  <>
    <div className={blk}>
      <ProductInformativeLayout
        image={coverPageBanner}
        imageAlt="Live Delivery Tracking and Analysis"
        loading="eager"
        hAlign="right"
        vAlign="bottom"
        contentAlign="start"
        dataAutoId="live_delivery_tracking_software_section_1"
        isCoverSection
      >
        <PageCoverSectionContent
          fluid
          title="Live Delivery Tracking and Analysis"
          description="View all your moving drivers and vehicles live from a single dashboard for increased responsiveness."
          className={bemClass([blk, 'cover-content'])}
          dataAutoId="live_delivery_tracking_software_section_1_content"
        >
          <ButtonGroup>
            <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="live_delivery_tracking_software_section_1_request_demo">
            Request a demo
            </ModalTriggerButton>
            <GoToSignUpPage>
              <Button category="primary" size="large" asLink href="/pricing/signup" dataAutoId="live_delivery_tracking_software_section_1_try_free">
                Try out free
              </Button>
            </GoToSignUpPage>
          </ButtonGroup>
        </PageCoverSectionContent>
      </ProductInformativeLayout>
    </div>
    <MidContentSection
      title="Tracking Deliveries from Allocation to Fulfillment"
      description={`Know how and where your drivers move at any given time right from the point
      of order assignment to final delivery fulfillment adding to the control and
      visibility over all on-ground resources.`}
      className={bemClass([blk, 'mid-section'])}
      dataAutoId="live_delivery_tracking_software_section_2"
    >
      <ButtonGroup isCenter>
        <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="live_delivery_tracking_software_section_2_get_in_touch">
            Get in touch
        </ModalTriggerButton>
        <GoToSignUpPage>
          <Button outline asLink href="/pricing/signup" dataAutoId="live_delivery_tracking_software_section_2_sign_up">Sign up for trial</Button>
        </GoToSignUpPage>
      </ButtonGroup>
    </MidContentSection>
    <ConfigurationSection
      iconSize="xxxlg"
      iconAlign="top-left"
      iconColor="primary"
      data={[
        {
          id: 'fast-sorting-and-loading',
          icon: 'large-mile-live-tracking-fast-sorting-and-loading',
          title: 'Fast Sorting and Loading',
          description: 'Quickly scan-in each unit using a unique id for easy loading and tracking.'
        },
        {
          id: 'accurate-ata-calculation',
          icon: 'large-mile-live-tracking-accurate-eta-calculation',
          title: 'Accurate ETA Calculation',
          description: 'Predict precise estimated time of arrivals for all deliveries and stick to them.'
        },
        {
          id: 'easy-check-in-check-out',
          icon: 'large-mile-live-tracking-easy-check-in--check-out',
          title: 'Easy Check-in & Check-out',
          description: 'Check-in for a delivery and capture accurate service time with an easy check-out.'
        }
      ]}
      dataAutoId="live_delivery_tracking_software_section_2_features"
    />
    <ProductInformativeLayout
      image={areYourShipmentsStuck}
      imageAlt="Are Your Shipments Stuck?"
      dataAutoId="live_delivery_tracking_software_section_3"
    >
      <ProductInformativeContent
        title="Are Your Shipments Stuck?"
        description={`Ensure all your deliveries are on-time by tracking their
        movement and quickly responding to all possible in-transit delays.`}
        features={[{
          id: 'avoid-delays',
          title: 'Avoid Delays',
          description: `Through efficient planning, identify the fastest and most
          optimal route to each delivery and make sure the drivers stick to the plans
          by tracking their movement in real-time from a comprehensive dashboard.`,
        },{
          id: 'live-traffic-updates',
          title: 'Live Traffic Updates',
          description: `Find out the status of all traffic movement to with clear
          updates showing whether any driver would be delayed because of that.
          Managers can better direct or reroute the drivers as required.`,
        }]}
        dataAutoId="live_delivery_tracking_software_section_3_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="live_delivery_tracking_software_section_3_connect_with_expert">
            Connect with expert
          </ModalTriggerButton>
          <GoToSignUpPage>
            <Button
              category="default"
              outline
              asLink
              href="/pricing/signup"
              dataAutoId="live_delivery_tracking_software_section_3_free_trail"
            >
              Start free trial
            </Button>
          </GoToSignUpPage>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ConfigurationSection
      title="Ground-level Visibility"
      iconAlign="left-top"
      iconType="circular"
      iconBorder="primary"
      iconBackground="primary"
      iconColor="white"
      iconSize="sm"
      widthBg
      data={[
        {
          id: 'seamless-dispatch',
          icon: 'small-mile-live-tracking-seamless-dispatch',
          title: 'Seamless Dispatch',
          description: 'Automatically start trips as drivers move out of hubs for accurate tracking.'
        },
        {
          id: 'dynamic-rerouting',
          icon: 'small-mile-live-tracking-dynamic-rerouting',
          title: 'Dynamic Rerouting',
          description: 'Reroute trips when delays cause a priority delivery to be pushed up the sequence.'
        },
        {
          id: 'dynamically-updated-etas',
          icon: 'small-mile-live-tracking-dynamically-updated-etas',
          title: 'Dynamically Updated ETAs',
          description: 'Recalculate ETAs after each delivery to make sure all upcoming ETAs are accurate.'
        },
        {
          id: 'on-time-deliveries',
          icon: 'small-mile-live-tracking-on-time-deliveries',
          title: 'On-time Deliveries',
          description: 'Direct drivers through traffic-light routes to ensure on-deliveries.'
        },
        {
          id: 'delivery-status-updates',
          icon: 'small-mile-live-tracking-instant-delivery-validation',
          title: 'Delivery Status Updates',
          description: 'Receive regular updates to know whether a delivery is done, is pending, or has failed.'
        },
        {
          id: 'instant-delivery-validation',
          icon: 'small-mile-live-tracking-delivery-status-updates',
          title: 'Instant Delivery Validation',
          description: 'Validate all deliveries in real-time though secure in-app validation mechanism.'
        }
      ]}
      dataAutoId="live_delivery_tracking_software_section_4_features"
    />
    <ProductInformativeLayout
      hAlign="left"
      image={instantNotificationsAndAlerts}
      imageAlt="Instant Notifications and Alerts"
      dataAutoId="live_delivery_tracking_software_section_5"
    >
      <ProductInformativeContent
        title="Instant Notifications and Alerts"
        description={`Receive instant notifications and alerts on the web dashboard or
        the mobile app about any delay or disruption in movement of drivers.`}
        features={[{
          id: 'immediate-customers-notifications',
          title: 'Immediate Customers Notifications',
          description: `Delay or not, the customers receive notifications or alerts to
          tell them exactly when their delivery would arrive. Looping in the customers
          with such information helps manage their expectations and increase their satisfaction.`,
        },{
          id: 'chatting-with-on-ground-drivers',
          title: 'Chatting with On-Ground Drivers',
          description: `Managers can communicate with their on-ground drivers through
          in-system chatting mechanism. Drivers can also send messages to other drivers.
          This helps capture live insights from the field.`,
        }]}
        dataAutoId="live_delivery_tracking_software_section_5_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="live_delivery_tracking_software_section_5_get_in_touch">
            get in touch
          </ModalTriggerButton>
          <GoToSignUpPage>
            <Button
              category="default"
              outline
              asLink
              href="/pricing/signup"
              dataAutoId="live_delivery_tracking_software_section_5_try_for_free"
            >
              Try for free
            </Button>
          </GoToSignUpPage>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
  </>
)

export default LiveDeliveryTrackingSoftware
