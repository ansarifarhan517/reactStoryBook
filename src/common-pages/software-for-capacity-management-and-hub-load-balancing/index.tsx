import Image from 'next/image'

import PageCoverSectionContent from '@/components/page-cover-section-content'
import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeLayout from '@/components/product-informative-layout'
import ProductInformativeContent from '@/components/product-informative-content'
import Container from '@/components/container'
import MidContentSection from '@/components/mid-content-section'
import ConfigurationSection from '@/components/configuration-section'

import { bemClass } from '@/utils'

import coverPageBanner from '/public/software-for-capacity-management-and-hub-load-balancing.webp'
import highCapacityUtilizationAtLowerCost from '/public/high-capacity-utilization-at-lower-cost-1.webp'
import easyLoadingWithFastSortingAndScanning from '/public/easy-loading-with-fast-sorting-and-scanning.webp'

import './style.scss'

const blk = 'software-for-capacity-management-and-hub-load-balancing'

const SoftwareForCapacityManagementAndHubLoadBalancing = () => (
  <>
    <div className={bemClass([blk, 'cover-section'])} data-auto-id="software_for_capacity_management_and_hub_load_balancing_section_1">
      <div className={bemClass([blk, 'cover-bg'])} />
      <div className={bemClass([blk, 'cover-image'])}>
        <Image src={coverPageBanner} alt="Capacity Utilization and Load Balancing" data-auto-id="software_for_capacity_management_and_hub_load_balancing_section_1_image" />
      </div>
      <Container fluid className={bemClass([blk, 'cover-content-container'])}>
        <PageCoverSectionContent
          fluid
          title="Capacity Utilization and Load Balancing"
          description={`Utilize your vehicle capacity to better balance your
          load moving in and out of hubs.`}
          className={bemClass([blk, 'cover-content'])}
          dataAutoId="software_for_capacity_management_and_hub_load_balancing_section_1_content"
        >
          <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="software_for_capacity_management_and_hub_load_balancing_section_1_ask_for_demo">
            Ask for a demo
          </ModalTriggerButton>
        </PageCoverSectionContent>
      </Container>
    </div>
    <MidContentSection
      title="Plan your fleet capacity to perfection"
      description={`Know exactly how many owned or third-party fleet capacity would be needed to fulfill
      incoming orders. Utilize all available fleet capacity to the fullest to bring down
      overheads with expert consolidation.`}
      className={bemClass([blk, 'mid-section'])}
      dataAutoId="software_for_capacity_management_and_hub_load_balancing_section_2"
    />
    <ConfigurationSection
      iconSize="xxxlg"
      data={[
        {
          id: 'easily-sort-all-types-of-loads',
          icon: 'large-haul-hub-load-balance-easily-sort-all-types-of-loads',
          title: 'Easily sort all types of loads',
          description: 'Sort general, fragile, hazmat, etc. load as per their requirements, in quick time.'
        },
        {
          id: 'match-load-to-type-of-truck',
          icon: 'large-haul-hub-load-balance-match-load-to-type-of-truck',
          title: 'Match load to type of truck',
          description: 'Sort and load shipments to the right type of truck, whether reefer, box truck, etc.'
        },
        {
          id: 'easily-sync-oms-and-wms',
          icon: 'large-haul-hub-load-balance-easily-sync-oms-and-wms',
          title: 'Easily sync OMS and WMS',
          description: 'Seamlessly integrate with OMS, WMS, or any legacy system for fast shipment processing.'
        },
        {
          id: 'hub-in-hub-out-reports',
          icon: 'large-haul-hub-load-balance-hub-in-hub-out-reports',
          title: 'Hub-in hub-out reports',
          description: 'Know, in real-time, exactly when a truck enters or leaves any hub, with instant alerts.'
        },
        {
          id: 'reduce-hub-level-detention',
          icon: 'large-haul-hub-load-balance-reduce-hub-level-detention',
          title: 'Reduce hub-level detention',
          description: 'Fast scanning and unloading with clear incoming shipment alerts, reduce hub detention.'
        },
        {
          id: 'reduce-turnaround-time',
          icon: 'large-haul-hub-load-balance-reduce-turnaround-time',
          title: 'Reduce turnaround time',
          description: 'High capacity utilization with an optimized delivery schedule reduces turnaround time.'
        }
      ]}
      dataAutoId="software_for_capacity_management_and_hub_load_balancing_section_2_features"
    />
    <ModalTriggerButton
      modalType="talk-to-us"
      category="primary"
      outline
      className={bemClass([blk, 'learn-more'])}
      dataAutoId="software_for_capacity_management_and_hub_load_balancing_section_2_learn_more"
    >
        Learn more
    </ModalTriggerButton>
    <ProductInformativeLayout
      hAlign="left"
      image={highCapacityUtilizationAtLowerCost}
      imageAlt="High capacity utilization at lower cost"
      widthBg
      dataAutoId="software_for_capacity_management_and_hub_load_balancing_section_3"
      className={bemClass([blk,'high_capacity_utilization'])}
    >
      <ProductInformativeContent
        title="High capacity utilization at lower cost"
        description={`Bring down loading, dispatch, and movement costs by utilizing more of your
        capacity and cutting down the turnaround time for your trucks.`}
        features={[{
          id: 'volume-and-weight-based-capacity-optimization',
          title: 'Volume and weight-based capacity optimization',
          description: `Plan your capacity with not just weight-based analysis, but also volume-based
          analysis. Utilize the space within trucks to their maximum occupancy, while avoiding
          over-capacity or under-capacity movement.`,
        }, {
          id: 'deliver-more-with-your-available-fleet-capacity',
          title: 'Deliver more with your available fleet capacity',
          description: `With higher capacity utilization, cut down on total transit time using lesser
          trucks and delivering to more hubs. Effective route management will further reduce instances
          of deadheading while backhauling.`,
        }]}
        category="secondary"
        dataAutoId="software_for_capacity_management_and_hub_load_balancing_section_3_content"
        className={bemClass([blk,'high_capacity_utilization_content'])}
      >
        <ModalTriggerButton modalType="talk-to-us" category="primary" outline dataAutoId="software_for_capacity_management_and_hub_load_balancing_section_3_connect_with_expert">
          Connect with Expert
        </ModalTriggerButton>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ProductInformativeLayout
      image={easyLoadingWithFastSortingAndScanning}
      imageAlt="Easy loading with fast sorting and scanning"
      dataAutoId="software_for_capacity_management_and_hub_load_balancing_section_4"
    >
      <ProductInformativeContent
        title="Easy loading with fast sorting and scanning"
        description={`In-scanning of items at the sorting stage speeds up the loading process,
        instantly syncing all shipment details with the delivery schedule.`}
        features={[{
          id: 'match-shipments-to-trucks-in-moments',
          title: 'Match shipments to trucks in moments',
          description: `Each shipment or load has clear requirements in terms of the type of vehicle
          and capacity to be utilized. Easily match such load to the right truck and start-off the
          loading process without any detention.`,
        }, {
          id: 'lower-detention-time-at-origin-and-in-transit-hub',
          title: 'Lower detention time at origin and in-transit hub',
          description: `Automated allocation and dispatch of load, with streamlined picking and sorting,
          cuts down detention time. Ensure efficiency by following an optimized delivery schedule along
          with last-in-first-out or similar loading techniques.`,
        }]}
        dataAutoId="software_for_capacity_management_and_hub_load_balancing_section_4_content"
      >
        <ModalTriggerButton modalType="talk-to-us" category="primary" outline dataAutoId="software_for_capacity_management_and_hub_load_balancing_section_4_talk_to_us">
          Talk to us
        </ModalTriggerButton>
      </ProductInformativeContent>
    </ProductInformativeLayout>
  </>
)

export default SoftwareForCapacityManagementAndHubLoadBalancing
