import { Metadata } from 'next'
import Image from 'next/image'

import PageCoverSection from '@/components/page-cover-section'
import PageCoverSectionContent from '@/components/page-cover-section-content'
import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeLayout from '@/components/product-informative-layout'
import ProductInformativeContent from '@/components/product-informative-content'
import ConfigurationSection from '@/components/configuration-section'
import Container from '@/components/container'
import Parallax from '@/components/parallax'

import { bemClass } from '@/utils'

import pageCoverBg from '/public/intercity-longhaul-transport-fleet-route-planning-software.svg'
import coverPageBanner from '/public/easily-plan-shipment-schedules-and-routes.webp'
import planEfficientShipmentSchedules from '/public/plan-efficient-shipment-schedules.webp'
import betterAndSaferRoutesForShipments from '/public/better-and-safer-routes-for-shipments.webp'

import './style.scss'

const blk = 'intercity-longhaul-transport-fleet-route-planning-software'

const IntercityLonghaulTransportFleetRoutePlanningSoftware = () => (
  <>
    <PageCoverSection
      image={pageCoverBg}
      imageAlt="Easily Plan Shipment Schedules and Routes"
      className={bemClass([blk, 'cover-section'])}
      dataAutoId="intercity_longhaul_transport_fleet_route_planning_software_section_1"
    >
      <Container fluid className={bemClass([blk, 'container'])}>
        <PageCoverSectionContent
          title="Easily Plan Shipment Schedules and Routes"
          description={`Increase the efficiency of your logistics movement while reducing overall
          costs. Use better and safer routes to reach all hubs and destinations.`}
          fluid className={bemClass([blk, 'cover-content'])}
          dataAutoId="intercity_longhaul_transport_fleet_route_planning_software_section_1_content"
        >
          <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="intercity_longhaul_transport_fleet_route_planning_software_section_1_ask_for_demo">
            Ask for a demo
          </ModalTriggerButton>
        </PageCoverSectionContent>
        <Parallax offset={50} className={bemClass([blk, 'cover-image'])}>
          <Image
            src={coverPageBanner}
            alt="Easily Plan Shipment Schedules and Routes"
            className={bemClass([blk, 'image'])}
            loading="eager"
            data-auto-id="intercity_longhaul_transport_fleet_route_planning_software_section_1_image"
          />
        </Parallax>
      </Container>
    </PageCoverSection>
    <ConfigurationSection
      title="Use Drivers and Vehicles Better"
      iconAlign="left-top"
      iconColor="white"
      textColor="gray-dark"
      iconType="circular"
      iconBorder="white"
      iconSize="sm"
      iconBackground="gray-dark"
      className={bemClass([blk, 'config-section'])}
      data={[{
        id: 'plan-optimized-schedules',
        icon: 'small-haul-voice-schedule-route-planning-plan-optimized-schedules',
        title: 'Plan Optimized Schedules',
        description: 'Plan shipment schedules with high delivery efficiency and lower movement costs.'
      }, {
        id: 'auto-allocate-to-vehicles',
        icon: 'small-haul-voice-schedule-route-planning-auto-allocate-to-vehicles',
        title: 'Auto-Allocate to Vehicles',
        description: 'Allocate shipment automatically as per preferred vehicle type and driver skill-set.'
      }, {
        id: 'optimize-fleet-capacity',
        icon: 'small-haul-voice-schedule-route-planning-optimize-fleet-capacity',
        title: 'Optimize Fleet Capacity',
        description: 'Utilize all available fleet capacity properly to further reduce logistics movement costs.'
      }, {
        id: 'load-and-dispatch-faster',
        icon: 'small-haul-voice-schedule-route-planning-load-and-dispatch-faster',
        title: 'Load and Dispatch Faster',
        description: 'Scan-in the load, recording it directly into the system, and dispatch shipments faster.'
      }, {
        id: 'use-faster-and-safer-routes',
        icon: 'small-haul-voice-schedule-route-planning-use-faster-and-safer-routes',
        title: 'Use Faster and Safer Routes',
        description: 'Take the best route according to the planned schedule, avoiding traffic and delays.'
      }, {
        id: 'reduce-turnaround-time',
        icon: 'small-haul-voice-schedule-route-planning-reduce-turnaround-time',
        title: 'Reduce Turnaround Time',
        description: 'Move on faster routes, cover more in-transit hubs, reduce overall detention, and save time.'
      }]}
      dataAutoId="intercity_longhaul_transport_fleet_route_planning_software_section_2_content"
    />
    <ProductInformativeLayout
      hAlign="left"
      image={planEfficientShipmentSchedules}
      imageAlt="Plan Efficient Shipment Schedules"
      className={bemClass([blk, 'track-delivery-movement'])}
      dataAutoId="intercity_longhaul_transport_fleet_route_planning_software_section_3"
    >
      <ProductInformativeContent
        title="Plan Efficient Shipment Schedules"
        description={`Optimize the overall capacity of available vehicles to fulfill all the
        shipments, allocating and dispatching the right vehicle with the right load on the right
        route.`}
        features={[{
          id: 'match-shipment-with-driver-skill-sets',
          title: 'Match Shipment with Driver Skill-Sets',
          description: `Assign the shipment to the driver best-suited to handle it. It can be
          hazmat or white glove deliveries. The system automatically assigns the right driver
          to handle the delivery satisfactorily.`,
        }, {
          id: 'auto-allocate-load-as-per-available-capacity',
          title: 'Auto-Allocate Load as per Available Capacity',
          description: `Utilize your resources properly, allocating as per available volume and
          weight capacity of each vehicle. Increase the load carried per vehicle, reducing the
          cost of movement and increasing the overall logistics movement efficiency.`,
        }]}
        dataAutoId="intercity_longhaul_transport_fleet_route_planning_software_section_3_content"
      >
        <ModalTriggerButton modalType="talk-to-us" category="primary" outline dataAutoId="intercity_longhaul_transport_fleet_route_planning_software_section_3_talk_to_us">
          Talk to us
        </ModalTriggerButton>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ProductInformativeLayout
      image={betterAndSaferRoutesForShipments}
      imageAlt="Better and Safer Routes for Shipments"
      dataAutoId="intercity_longhaul_transport_fleet_route_planning_software_section_4"
    >
      <ProductInformativeContent
        title="Better and Safer Routes for Shipments"
        description={`Guide all shipments through better, shorter, and safer routes to cut
        down on time spent on-road while increasing on-time deliveries.`}
        features={[{
          id: 'move-through-traffic-light-routes',
          title: 'Move Through Traffic-Light Routes',
          description: `Take routes with minimum traffic delays or other detentions.
          Reduce unplanned downtime by picking the route with minimum bottlenecks.
          Ensure smooth movement for all vehicles from source to destination hub.`,
        }, {
          id: 'reduce-travel-and-turnaround-time',
          title: 'Reduce Travel and Turnaround Time',
          description: `Quick transport doesn\'t have to be fast driving, it can also be clear
          and fast routes. Reduce total turnaround time for vehicles by using shorter routes
          connecting all required in-transit hubs.`,
        }]}
        dataAutoId="intercity_longhaul_transport_fleet_route_planning_software_section_4_content"
      >
        <ModalTriggerButton modalType="talk-to-us" category="primary" outline dataAutoId="intercity_longhaul_transport_fleet_route_planning_software_section_4_connect_with_expert">
          Connect with expert
        </ModalTriggerButton>
      </ProductInformativeContent>
    </ProductInformativeLayout>
  </>
)

const title = 'LogiNext Haul | Route Planning Software | Faster Dispatch'
const description = 'Plan shipment schedule that\'s fleet optimized, reduces turnaround time, matches shipment with driver skillsets & faster loading & dispatch. Call LogiNext now!'
const url = 'https://www.loginextsolutions.com//products/haul/intercity-longhaul-transport-fleet-route-planning-software'

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
  IntercityLonghaulTransportFleetRoutePlanningSoftware as default,
  metadata
}

