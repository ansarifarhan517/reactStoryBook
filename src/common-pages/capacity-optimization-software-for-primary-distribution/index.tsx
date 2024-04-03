import Image from 'next/image'

import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeLayout from '@/components/product-informative-layout'
import ProductInformativeContent from '@/components/product-informative-content'
import Container from '@/components/container'
import MidContentSection from '@/components/mid-content-section'
import Parallax from '@/components/parallax'
import Text from '@/components/text'
import ConfigurationSection from '@/components/configuration-section'

import { bemClass } from '@/utils'

import coverPageBanner from '/public/capacity-management-in-primary-distribution.webp'
import increaseEfficiencyWithinPrimaryDistribution from '/public/increase-efficiency-within-primary-distribution.webp'
import reduceCostsAndImprovePerformances from '/public/reduce-costs-and-improve-performances.webp'
import easilyTrackEachUnitInEveryCrateAtAnyTime from '/public/easily-track-each-unit-in-every-crate-at-any-time.webp'

import './style.scss'

const blk = 'capacity-optimization-software-for-primary-distribution'

const CapacityOptimizationSoftwareForPrimaryDistribution = () => (
  <>
    <div className={bemClass([blk, 'cover-section'])} data-auto-id="capacity_optimization_software_for_primary_distribution_section_1">
      <Container>
        <Text tag="h1" typography="xxxl" color="white" fontWeight="bold" dataAutoId="capacity_optimization_software_for_primary_distribution_section_1_title">
          <>
            Capacity <br />
            Management in <br />
            Primary Distribution
          </>
        </Text>
        <Text tag="p" color="white" className={bemClass([blk, 'cover-section-text'])} dataAutoId="capacity_optimization_software_for_primary_distribution_section_1_description">
          <>
            Efficiently manage carrying capacities of all vehicles to get
            more out of them as they move towards hubs.
          </>
        </Text>
        <ButtonGroup isCenter>
          <ModalTriggerButton
            modalType="talk-to-us"
            category="primary"
            size="large"
            outline
            dataAutoId="capacity_optimization_software_for_primary_distribution_section_1_request_demo"
          >
            Request a demo
          </ModalTriggerButton>
          <ModalTriggerButton
            modalType="sign-up"
            category="default"
            size="large"
            dataAutoId="capacity_optimization_software_for_primary_distribution_section_1_try_free"
          >
            try out free
          </ModalTriggerButton>
        </ButtonGroup>
        <Parallax offset={25} className={bemClass([blk, 'cover-image'])}>
          <Image
            src={coverPageBanner}
            alt="Capacity Management in Primary Distribution"
            className={bemClass([blk, 'image'])}
            loading="eager"
            data-auto-id="capacity_optimization_software_for_primary_distribution_section_1_image"
          />
        </Parallax>
      </Container>
    </div>
    <MidContentSection
      title="Keep Your Primary Distribution Healthy"
      description={`Ensure timely and safe movement of all SKUs to warehouses and distributors while maintaining
      optimized schedules and fast routes for reduced cost of movement and high efficiency.`}
      className={bemClass([blk, 'mid-section'])}
      dataAutoId="capacity_optimization_software_for_primary_distribution_section_2"
    >
      <ButtonGroup isCenter>
        <ModalTriggerButton
          modalType="talk-to-us"
          category="primary"
          dataAutoId="capacity_optimization_software_for_primary_distribution_section_2_talk_to_us"
        >
          Talk to us
        </ModalTriggerButton>
        <ModalTriggerButton
          modalType="sign-up"
          category="default"
          outline
          dataAutoId="capacity_optimization_software_for_primary_distribution_section_2_free_trail"
        >
          14 days free trial
        </ModalTriggerButton>
      </ButtonGroup>
    </MidContentSection>
    <ConfigurationSection
      iconSize="xxxlg"
      data={[
        {
          id: 'capacity-optimization',
          icon: 'large-home-slider-consumer-packaged-goods-primary-distribution-capacity-optimization',
          title: 'Capacity Optimization',
          description: 'Better utilize resource and vehicle capacity to reduce logistics movement costs.'
        },
        {
          id: 'easy-loading-and-unloading',
          icon: 'large-haul-web-fast-loading-and-unloading',
          title: 'Easy Loading and Unloading',
          description: 'Scan and load each unit item in each crate for easy processing and complete visibility.'
        },
        {
          id: 'shorter-turnaround-time',
          icon: 'large-haul-hub-load-balance-reduce-turnaround-time',
          title: 'Shorter Turnaround Time',
          description: 'Optimize routes for fast but safe movement to reduce turnaround time for resources.'
        }
      ]}
      dataAutoId="capacity_optimization_software_for_primary_distribution_section_2_features"
    />
    <ProductInformativeLayout
      hAlign="right"
      image={increaseEfficiencyWithinPrimaryDistribution}
      imageAlt="Increase Efficiency Within Primary Distribution"
      widthBg
      dataAutoId="capacity_optimization_software_for_primary_distribution_section_3"
    >
      <ProductInformativeContent
        title="Increase Efficiency Within Primary Distribution"
        description={`Assess different criteria like priority statuses for shipments, vehicle
        capacity & availability, and traffic-light routes to drive more efficiency at lower costs.`}
        features={[{
          id: 'create-sla-compliant-and-productive-schedules',
          title: 'Create SLA Compliant and Productive Schedules',
          description: `Ensure that all your resources follow a planned schedule which complies with
          multiple service level agreements such as on-time and electronically validated deliveries
          of undamaged merchandise.`,
        }, {
          id: 'ensure-fast-and-safe-movement-of-shipment',
          title: 'Ensure Fast and Safe Movement of Shipment',
          description: `Direct your vehicles through faster routes optimized to avoid heavy traffic
          or detention while ensuring safety for the moving merchandise, reducing overall distance
          traveled and total turnaround time.`,
        }]}
        dataAutoId="capacity_optimization_software_for_primary_distribution_section_3_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="capacity_optimization_software_for_primary_distribution_section_3_connect_with_expert">
            connect with expert
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="capacity_optimization_software_for_primary_distribution_section_3_sign_up_free">
            Sign up for free
          </ModalTriggerButton>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ProductInformativeLayout
      hAlign="left"
      image={reduceCostsAndImprovePerformances}
      imageAlt="Reduce Costs and Improve Performances"
      dataAutoId="capacity_optimization_software_for_primary_distribution_section_4"
    >
      <ProductInformativeContent
        title="Reduce Costs and Improve Performances"
        description={`Make sure all your vehicles are optimally utilized across the entire primary
        leg of distribution with clear performance measurement.`}
        features={[{
          id: 'keep-your-bottom-line-down-and-steady',
          title: 'Keep Your Bottom Line Down and Steady',
          description: `Reduce cost of resource movement by identifying the ideal vehicle for each trip
          based on shipment requirements and optimizing the delivery schedules to reduce losses due to
          trucks moving with idle capacities.`,
        }, {
          id: 'consistently-improve-vehicle-performance',
          title: 'Consistently Improve Vehicle Performance',
          description: `Track the performance of each driver and vehicle to better manage service level
          agreements. Ensure that all vehicles are well-maintained by closely tracking their movement and
          driver behavior.`,
        }]}
        dataAutoId="capacity_optimization_software_for_primary_distribution_section_4_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="capacity_optimization_software_for_primary_distribution_section_4_request_demo">
            Request a demo
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="capacity_optimization_software_for_primary_distribution_section_4_free_trail">
            14 days free trial
          </ModalTriggerButton>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ConfigurationSection
      title="Live Tracking and Instant Alerts"
      iconAlign="left-top"
      iconColor="white"
      textColor="gray-dark"
      iconType="circular"
      iconBorder="white"
      iconSize="sm"
      iconBackground="gray-dark"
      widthBg
      className={bemClass([blk, 'config-section'])}
      data={[{
        id: 'vehicle-tracking',
        icon: 'small-mile-live-tracking-instant-delivery-validation',
        title: 'Vehicle Tracking',
        description: 'GPS based live tracking of vehicles to find the exact location of each shipment at any time.'
      }, {
        id: 'crate-level-tracking',
        icon: 'small-mile-route-planning-and-optimization-dynamic-rerouting',
        title: 'Crate Level Tracking',
        description: 'Tracking the loading and unloading of each unit in each crate using easy in-app scanning.'
      }, {
        id: 'dynamic-eta-calculation',
        icon: 'small-field-field-workforce-schedule-planning-preferred-time-slots',
        title: 'Dynamic ETA Calculation',
        description: 'Track the estimated time of arrival of each shipment from a comprehensive dashboard.'
      }, {
        id: 'instant-alerts',
        icon: 'small-on-demand-instant-alerts-and-notifications',
        title: 'Instant Alerts',
        description: 'Receive instant alerts in case of any delay, detention, or SLA breach involving any shipment.'
      }, {
        id: 'electronic-proof-of-delivery',
        icon: 'small-field-field-workforce-schedule-planning-multiple-choices-in-plans',
        title: 'Electronic Proof of Delivery',
        description: 'Record the proof of deliveries electronically for increased transparency and accountability.'
      }, {
        id: 'error-free-invoicing',
        icon: 'small-field-field-workforce-schedule-planning-unique-schedules',
        title: 'Error-free Invoicing',
        description: 'Validate the invoices at the time of delivery and instantly sync them with your system.'
      }]}
      dataAutoId="capacity_optimization_software_for_primary_distribution_section_5"
    />
    <ProductInformativeLayout
      hAlign="left"
      image={easilyTrackEachUnitInEveryCrateAtAnyTime}
      imageAlt="Easily Track Each Unit in Every Crate at Any Time"
      dataAutoId="capacity_optimization_software_for_primary_distribution_section_6"
    >
      <ProductInformativeContent
        title="Easily Track Each Unit in Every Crate at Any Time"
        description={`Scan all units to add them directly into the system for faster loading and
        dispatch. Follow the simple and intuitive app-design through faster and optimized routes to
        ensure on-time deliveries.`}
        features={[]}
        dataAutoId="capacity_optimization_software_for_primary_distribution_section_6_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="capacity_optimization_software_for_primary_distribution_section_6_connect_with_expert">
            connect with expert
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="capacity_optimization_software_for_primary_distribution_section_6_sign_up_free">
            Sign up for free
          </ModalTriggerButton>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
  </>
)

export default CapacityOptimizationSoftwareForPrimaryDistribution
