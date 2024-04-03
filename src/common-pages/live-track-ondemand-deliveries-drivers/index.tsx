import Image from 'next/image'

import PageCoverSection from '@/components/page-cover-section'
import PageCoverSectionContent from '@/components/page-cover-section-content'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeContent from '@/components/product-informative-content'
import Button from '@/components/button'
import GoToSignUpPage from '@/components/go-to-sign-up-page'
import Container from '@/components/container'
import Parallax from '@/components/parallax'
import ProductInformativeLayout from '@/components/product-informative-layout'
import MidContentSection from '@/components/mid-content-section'
import ConfigurationSection from '@/components/configuration-section'

import { bemClass } from '@/utils'

import pageCoverBg from '/public/live-track-ondemand-deliveries-drivers-cover-bg.svg'
import coverPageBanner from '/public/live-tracking-of-on-demand-delivery-movement.webp'
import trackDeliveryMovementInRealTime from '/public/track-delivery-movement-in-real-time.webp'
import instantNotificationsFromAllDeliveryMovement from '/public/instant-notifications-from-all-delivery-movement.webp'

import './style.scss'

const blk = 'live-track-ondemand-deliveries-drivers'

const LiveTrackOnDemandDeliveriesDrivers = () => (
  <>
    <PageCoverSection
      image={pageCoverBg}
      imageAlt="Product mile"
      className={bemClass([blk, 'cover-section'])}
      dataAutoId="live_track_ondemand_deliveries_drivers_section_1"
    >
      <Container fluid className={bemClass([blk, 'container'])}>
        <PageCoverSectionContent
          title="Live Tracking of On-Demand Delivery Movement"
          description={`Track all pickups and deliveries as they happen, from allocation and dispatch to
          on-time handover and validation.`}
          fluid className={bemClass([blk, 'cover-content'])}
          dataAutoId="live_track_ondemand_deliveries_drivers_section_1_content"
        >
          <ButtonGroup>
            <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="live_track_ondemand_deliveries_drivers_section_1_request_demo">
              Request a demo
            </ModalTriggerButton>
            <GoToSignUpPage>
              <Button asLink category="primary" href="/pricing/signup" size="large" dataAutoId="live_track_ondemand_deliveries_drivers_section_1_try_free">
                Try out free
              </Button>
            </GoToSignUpPage>
          </ButtonGroup>
        </PageCoverSectionContent>
        <Parallax offset={50} className={bemClass([blk, 'cover-image'])}>
          <Image
            src={coverPageBanner}
            alt="Live Tracking of On-Demand Delivery Movement"
            className={bemClass([blk, 'image'])}
            loading="eager"
            data-auto-id="live_track_ondemand_deliveries_drivers_section_1_image"
          />
        </Parallax>
      </Container>
    </PageCoverSection>
    <MidContentSection
      title="Know Exactly How Your Deliveries Move On-Ground"
      description={`Increase on-ground visibility by tracking the live movement of all in-transit orders
        from origin to the point where they reach their destination. Know the exact location
        of any driver along with accurate ETAs for all deliveries.`}
      dataAutoId="live_track_ondemand_deliveries_drivers_section_2"
    >
      <ModalTriggerButton modalType="talk-to-us" category="primary" outline dataAutoId="live_track_ondemand_deliveries_drivers_section_2_get_in_touch">
            Get in touch
      </ModalTriggerButton>
    </MidContentSection>
    <ConfigurationSection
      iconSize="xxxlg"
      data={[
        {
          id: 'communicate-with-drivers',
          icon: 'large-on-demand-live-tracking--communicate-with-associates',
          title: 'Communicate with Drivers',
          description: 'Chat with all drivers in real-time to better direct them to their destinations.'
        },
        {
          id: 'avoid-in-transit-delays',
          icon: 'large-on-demand-live-tracking-avoid-in-transit-delays',
          title: 'Avoid In-transit Delays',
          description: 'Track order movement to immediately react to any service interruption or disruption.'
        },
        {
          id: 'live-traffic-analysis',
          icon: 'large-on-demand-live-tracking-live-traffic-analysis',
          title: 'Live Traffic Analysis',
          description: 'Track live traffic patterns to avoid them and increase on-time deliveries.'
        }
      ]}
      dataAutoId="live_track_ondemand_deliveries_drivers_section_2_features"
    />
    <ProductInformativeLayout
      hAlign="left"
      image={trackDeliveryMovementInRealTime}
      imageAlt="Track Delivery Movement in Real-time"
      className={bemClass([blk, 'track-delivery-movement'])}
      dataAutoId="live_track_ondemand_deliveries_drivers_section_3"
      containerClassName={bemClass([blk, 'track-delivery-movement-container'])}
    >
      <ProductInformativeContent
        title="Track Delivery Movement in Real-time"
        description={`On-demand deliveries require fast allocation and dispatch with live tracking
          to help companies manage on-field activities properly.`}
        features={[{
          id: 'stick-to-your-planned-schedules',
          title: 'Stick to Your Planned Schedules',
          description: 'Ensure that your drivers follow the planned delivery schedules and routes.',
        }, {
          id: 'increase-on-time-deliveries',
          title: 'Increase On-time Deliveries',
          description: 'Track live delivery movement to ensure that orders are delivered on time.',
        }, {
          id: 'react-quickly-to-delays',
          title: 'React Quickly to Delays',
          description: 'Take corrective measures immediately whenever any delivery is delayed.',
        }]}
        dataAutoId="live_track_ondemand_deliveries_drivers_section_3_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="live_track_ondemand_deliveries_drivers_section_3_connect_with_expert">
              Connect with expert
          </ModalTriggerButton>
          <GoToSignUpPage>
            <Button category="default" asLink href="/pricing/signup" outline dataAutoId="live_track_ondemand_deliveries_drivers_section_3_free_trail">
                start free trial
            </Button>
          </GoToSignUpPage>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ProductInformativeLayout
      hAlign="right"
      image={instantNotificationsFromAllDeliveryMovement}
      imageAlt="Instant Notifications from all Delivery Movement"
      dataAutoId="live_track_ondemand_deliveries_drivers_section_4"
    >
      <ProductInformativeContent
        title="Instant Notifications from all Delivery Movement"
        description={`Get notified about each activity of interest; whether a new pickup request comes in,
          a delivery is delayed, customer changes the delivery address or time preferences, etc.`}
        features={[{
          id: 'talk-to-on-ground-drivers',
          title: 'Talk to On-Ground Drivers',
          description: 'Chat with your drivers as they move along their scheduled deliveries.',
        }, {
          id: 'broadcast-messages-giving-directions',
          title: 'Broadcast Messages Giving Directions',
          description: 'Send out directions or information to one or all delivery associates, anytime.',
        }, {
          id: 'keep-control-with-dynamic-planning',
          title: 'Keep Control with Dynamic Planning',
          description: 'Use the notifications coming in live to adjust and better active delivery routes.',
        }]}
        dataAutoId="live_track_ondemand_deliveries_drivers_section_4_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="live_track_ondemand_deliveries_drivers_section_4_request_demo">
              Request a demo
          </ModalTriggerButton>
          <GoToSignUpPage>
            <Button category="default" asLink href="/pricing/signup" outline dataAutoId="live_track_ondemand_deliveries_drivers_section_4_free_trail">
                14 days trial
            </Button>
          </GoToSignUpPage>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
  </>
)

export default LiveTrackOnDemandDeliveriesDrivers
