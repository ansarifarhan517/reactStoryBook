import { Metadata } from 'next'
import Image from 'next/image'

import PageCoverSectionContent from '@/components/page-cover-section-content'
import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeLayout from '@/components/product-informative-layout'
import ProductInformativeContent from '@/components/product-informative-content'
import Container from '@/components/container'
import Parallax from '@/components/parallax'

import { bemClass } from '@/utils'

import coverPageBanner from '/public/live-fleet-tracking-with-instant-alerts.webp'
import highCapacityUtilizationAtLowerCost from '/public/high-capacity-utilization-at-lower-cost.webp'
import endToEndFleetMovementVisibility from '/public/end-to-end-fleet-movement-visibility.webp'
import getInstantAlertsOfAllOnGroundInstances from '/public/get-instant-alerts-of-all-on-ground-instances.webp'

import './style.scss'

const blk = 'intercity-transort-vehicle-live-tracking-alerts'

const IntercityTransortVehicleLiveTrackingAlerts = () => (
  <div className={blk}>
    <div className={bemClass([blk, 'cover-section'])} data-auto-id="intercity_transort_vehicle_live_tracking_alerts_section_1">
      <div className={bemClass([blk, 'cover-section-bg'])}/>
      <Container className={bemClass([blk, 'container'])}>
        <PageCoverSectionContent
          title="Live Fleet Tracking with Instant Alerts"
          description={`Know exactly where your vehicle is at any time with live fleet tracking
          from a single dashboard and instant alerts for all important instances.`}
          fluid
          className={bemClass([blk, 'cover-content'])}
          dataAutoId="intercity_transort_vehicle_live_tracking_alerts_section_1_content"
        >
          <ModalTriggerButton
            modalType="talk-to-us"
            category="primary"
            size="large"
            dataAutoId="intercity_transort_vehicle_live_tracking_alerts_section_1_ask_for_demo"
          >
            Ask for a demo
          </ModalTriggerButton>
        </PageCoverSectionContent>
        <Parallax offset={50} className={bemClass([blk, 'cover-image'])}>
          <Image
            src={coverPageBanner}
            alt="Easily Plan Shipment Schedules and Routes"
            className={bemClass([blk, 'image'])}
            loading="eager"
            data-auto-id="intercity_transort_vehicle_live_tracking_alerts_section_1_image"
          />
        </Parallax>
      </Container>
    </div>
    <ProductInformativeLayout
      hAlign="left"
      image={highCapacityUtilizationAtLowerCost}
      imageAlt="High capacity utilization at lower cost"
      className={bemClass([blk, 'high-capacity-utilization'])}
      dataAutoId="intercity_transort_vehicle_live_tracking_alerts_section_2"
    >
      <ProductInformativeContent
        title="High capacity utilization at lower cost"
        description={`Bring down loading, dispatch, and movement costs by utilizing more
        of your capacity and cutting down the turnaround time for your trucks.`}
        features={[{
          id: 'track-shipments-with-accuracy',
          title: 'Track Shipments with Accuracy',
          description: `Many shipments require special handling. Track the location as well
          whether the temperature (for reefer trailers) are properly maintained. Track the
          speed of the vehicle to ensure safety (especially for hazmat trucks).`,
        }, {
          id: 'reach-hubs-on-time',
          title: 'Reach Hubs On-time',
          description: `Ensure your shipments reach their hubs (in-transit or destination) on time.
          Track live traffic across routes to avoid unplanned detention. Track the time spent
          unloading and loading at all in-transit hubs to minimize potential delays.`,
        }]}
        dataAutoId="intercity_transort_vehicle_live_tracking_alerts_section_2_content"
      />
    </ProductInformativeLayout>
    <ProductInformativeLayout
      hAlign="right"
      image={endToEndFleetMovementVisibility}
      imageAlt="End-to-End Fleet Movement Visibility"
      widthBg
      dataAutoId="intercity_transort_vehicle_live_tracking_alerts_section_2"
      className={bemClass([blk,'layout'])}
    >
      <ProductInformativeContent
        title="End-to-End Fleet Movement Visibility"
        description={`With shipment worth millions moving through multiple cities, across
        state lines, it can be hard to keep track of each vehicle at the same time.
        That's why you need the 'Control Tower'.`}
        features={[{
          id: 'view-all-logistics-movement',
          title: 'View all Logistics Movement',
          description: 'Single dashboard for complete location, movement, and delivery status of entire fleet.',
        }, {
          id: 'control-shipments-with-your-voice',
          title: 'Control Shipments with Your Voice',
          description: 'Just ask the system to find out the status of any shipment, vehicle, or driver.',
        }]}
        dataAutoId="intercity_transort_vehicle_live_tracking_alerts_section_2_content"
        category="secondary"
        className={bemClass([blk,'content'])}
      />
    </ProductInformativeLayout>
    <ProductInformativeLayout
      hAlign="left"
      image={getInstantAlertsOfAllOnGroundInstances}
      imageAlt="Get Instant Alerts of All On-Ground Instances"
      dataAutoId="intercity_transort_vehicle_live_tracking_alerts_section_3"
    >
      <ProductInformativeContent
        title="Get Instant Alerts of All On-Ground Instances"
        description={`Know whenever any shipment is stuck in-transit or if the driver
        takes an alternative route (and much more) with instant alerts.`}
        features={[{
          id: 'cut-down-reaction-time',
          title: 'Cut Down Reaction Time',
          description: `Reduce reaction time for any instance such as delays and detention
          with instant alerts where you are (in-app or in the web dashboard) and take appropriate
          action accordingly, within moments.`,
        }, {
          id: 'dynamic-eta-updates',
          title: 'Dynamic ETA updates',
          description: `System recalculates ETAs after each hub visit to sustain the accuracy of
          all shipment timelines. All stakeholders (manager and hub owners to be visited) are
          immediately notified about the updated ETAs.`,
        }]}
        dataAutoId="intercity_transort_vehicle_live_tracking_alerts_section_3_content"
      />
    </ProductInformativeLayout>
  </div>
)

const title = 'LogiNext Haul | Fleet Tracking Solution | Logistics Alerts'
const description = `Get accurate live tracking and instant alerts of your fleet complied
in a single dashboard by choosing LogiNext for fleet management. Talk to an expert now!`
const url = 'https://www.loginextsolutions.com/products/haul/intercity-transort-vehicle-live-tracking-alerts'

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
  IntercityTransortVehicleLiveTrackingAlerts as default,
  metadata
}

