import PageCoverSectionContent from '@/components/page-cover-section-content'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeLayout from '@/components/product-informative-layout'
import ProductInformativeContent from '@/components/product-informative-content'
import Container from '@/components/container'
import ConfigurationSection from '@/components/configuration-section'

import { bemClass } from '@/utils'

import getYourCapacityAllocationRight from '/public/get-your-capacity-allocation-right.webp'
import getCompleteVisibilityOfAllMovingVehicles from '/public/get-complete-visibility-of-all-moving-vehicles.webp'

import './style.scss'

const blk = 'hub-to-hub-middle-mile-optimization-software'

const HubToHubMiddleMileOptimizationSoftware = () => (
  <>
    <div className={bemClass([blk, 'cover-section'])} data-auto-id="hub_to_hub_middle_mile_optimization_software_section_1" >
      <div className={bemClass([blk, 'cover-bg'])} />
      <Container className={bemClass([blk, 'container'])}>
        <PageCoverSectionContent
          fluid
          title="Fully optimize your middle mile"
          description={`Cut down on lead times with quicker movement between warehouse,
          hub and distributor, or modern stores.`}
          className={bemClass([blk, 'cover-content'])}
          dataAutoId="hub_to_hub_middle_mile_optimization_software_section_1_content"
        >
          <ButtonGroup>
            <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="hub_to_hub_middle_mile_optimization_software_section_1_book_demo">
              Book a demo
            </ModalTriggerButton>
            <ModalTriggerButton modalType="sign-up" category="primary" size="large" dataAutoId="hub_to_hub_middle_mile_optimization_software_section_1_try_free">
              try our free
            </ModalTriggerButton>
          </ButtonGroup>
        </PageCoverSectionContent>
      </Container>
      <ConfigurationSection
        iconAlign="left-top"
        iconColor="white"
        textColor="white"
        iconType="circular"
        iconBorder="white"
        iconSize="sm"
        title="Make way for better logistics movement"
        className={bemClass([blk, 'config'])}
        data={[{
          id: 'delivery-scheduling',
          icon: 'small-haul-voice-schedule-route-planning-reduce-turnaround-time',
          title: 'Delivery scheduling',
          description: 'Create proper delivery schedules factoring in preferred time-windows at receiving hub.'
        }, {
          id: 'quick-and-easy-sorting',
          icon: 'small-haul-driver-behavior-skillset-matching',
          title: 'Quick and easy sorting',
          description: 'Make picking, sorting, and loading easy with in-app scanning and tracing of all unit items.'
        }, {
          id: 'fast-dispatch',
          icon: 'small-haul-voice-schedule-route-planning-auto-allocate-to-vehicles',
          title: 'Fast dispatch',
          description: 'Well planned schedules and fast loading leads to quick dispatch from origin warehouse.'
        }, {
          id: 'route-optimization',
          icon: 'small-field-field-workforce-schedule-planning-shorter-distances',
          title: 'Route optimization',
          description: 'Optimize the routes taken by your trucks to move along traffic-free short roads.'
        }, {
          id: 'hub-load-balancing',
          icon: 'small-haul-driver-behavior--point-of-interest-mapping',
          title: 'Hub-load balancing',
          description: 'Plan delivery timelines to properly balance the load leaving and received at each hub.'
        }, {
          id: 'sla-compliance',
          icon: 'small-field-field-workforce-schedule-planning-unique-schedules',
          title: 'SLA compliance',
          description: 'Ensure strict SLA compliance with owned or third party trucks/delivery associates.'
        }]}
        dataAutoId="hub_to_hub_middle_mile_optimization_software_section_2"
      />
    </div>
    <ProductInformativeLayout
      hAlign="left"
      image={getYourCapacityAllocationRight}
      imageAlt="Get your capacity allocation right"
      dataAutoId="hub_to_hub_middle_mile_optimization_software_section_3"
    >
      <ProductInformativeContent
        title="Get your capacity allocation right"
        description={`Make sure you use your capacity wisely. Under or overutilization can hinder
        proper logistics movement and create unnecessary bottlenecks.`}
        features={[{
          id: 'boost-overall-vehicle-capacity-utilization',
          title: 'Boost overall vehicle capacity utilization',
          description: `Make load allocation and delivery schedule plans that utilize available
          capacity to the fullest. Assign loads and shipments based on carrying capacity, calculated
          not just by weight, but also volume capacity of each vehicle.`,
        }, {
          id: 'cut-down-on-turnaround-time',
          title: 'Cut down on turnaround time',
          description: `Run more load through well-planned and shorter routes to cut down on total
          turnaround time for each trip. Get more out of the same available resources by utilizing
          their time more efficiently.`,
        }]}
        dataAutoId="hub_to_hub_middle_mile_optimization_software_section_3_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="hub_to_hub_middle_mile_optimization_software_section_3_connect_with_us">
            connect with us
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="hub_to_hub_middle_mile_optimization_software_section_3_sign_up_free">
            sign up for free
          </ModalTriggerButton>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ProductInformativeLayout
      hAlign="right"
      image={getCompleteVisibilityOfAllMovingVehicles}
      imageAlt="Get complete visibility of all moving vehicles"
      dataAutoId="hub_to_hub_middle_mile_optimization_software_section_4"
    >
      <ProductInformativeContent
        title="Get complete visibility of all moving vehicles"
        description={`Know where each of your vehicles is at any point either by checking a single
        dashboard or by just talking to the system.`}
        features={[{
          id: 'track-all-logistics-movement-in-real-time',
          title: 'Track all logistics movement in real-time',
          description: `Take control of your middle movement by tracking the exact location and
          delivery status of all moving vehicles. Know each time your driver speeds, takes an
          alternate route, or is detained for long.`,
        }, {
          id: 'get-alerted-about-all-on-ground-activities',
          title: 'Get alerted about all on-ground activities',
          description: `Increase the overall responsiveness of your middle mile logistics with instant
          alerts about all on-ground events. Get alerted instantly about each delivery with complete
          status, all driver behavior alerts, all shipment quality metrics, and more.`,
        }]}
        dataAutoId="hub_to_hub_middle_mile_optimization_software_section_4_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="hub_to_hub_middle_mile_optimization_software_section_4_talk_to_expert">
            talk to expert
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="hub_to_hub_middle_mile_optimization_software_section_4_free_trail">
            14 days trial
          </ModalTriggerButton>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
  </>
)

export default HubToHubMiddleMileOptimizationSoftware
